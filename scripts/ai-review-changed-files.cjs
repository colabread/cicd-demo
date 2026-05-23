#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const FRONTEND_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.scss',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
])

const REVIEW_MARKER = '<!-- ai-code-review:frontend-guidelines -->'
const SUMMARY_MARKER = '<!-- ai-code-review:frontend-guidelines-summary -->'
const MAX_FINDINGS = 20
const MAX_PATCH_CHARS = 80000

function log(message) {
  console.log(`[ai-review] ${message}`)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function isFrontendFile(filePath) {
  return FRONTEND_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function chatCompletionsUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/+$/, '')
  if (normalized.endsWith('/chat/completions')) {
    return normalized
  }
  return `${normalized}/chat/completions`
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${options.method ?? 'GET'} ${url} failed: ${response.status} ${body}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function createGitHubClient({ apiUrl, owner, repo, token }) {
  const baseUrl = `${apiUrl.replace(/\/+$/, '')}/repos/${owner}/${repo}`

  return {
    get(pathname) {
      return requestJson(`${baseUrl}${pathname}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    post(pathname, body) {
      return requestJson(`${baseUrl}${pathname}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    },
    patch(pathname, body) {
      return requestJson(`${baseUrl}${pathname}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    },
    delete(pathname) {
      return requestJson(`${baseUrl}${pathname}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
  }
}

async function paginate(getPage) {
  const items = []

  for (let page = 1; ; page += 1) {
    const current = await getPage(page)
    items.push(...current)

    if (current.length < 100) {
      break
    }
  }

  return items
}

function getChangedLines(patch) {
  const changedLines = new Set()
  let newLine = 0

  for (const line of patch.split('\n')) {
    if (line.startsWith('@@')) {
      const match = line.match(/\+(\d+)(?:,\d+)?/)
      newLine = match ? Number(match[1]) : 0
      continue
    }

    if (line.startsWith('\\')) {
      continue
    }

    if (line.startsWith('+') && !line.startsWith('+++')) {
      changedLines.add(newLine)
      newLine += 1
      continue
    }

    if (line.startsWith('-') && !line.startsWith('---')) {
      continue
    }

    if (newLine > 0) {
      newLine += 1
    }
  }

  return changedLines
}

function stripCodeFence(content) {
  const trimmed = content.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  return fenced ? fenced[1].trim() : trimmed
}

function parseAiResponse(content) {
  const parsed = JSON.parse(stripCodeFence(content))
  const findings = Array.isArray(parsed.findings) ? parsed.findings : []
  const allowedSeverities = new Set(['suggestion', 'warning', 'critical'])

  return findings
    .filter((finding) => finding && typeof finding === 'object')
    .map((finding) => ({
      path: String(finding.path ?? '').trim(),
      line: Number(finding.line),
      ruleId: String(finding.ruleId ?? '').trim(),
      severity: allowedSeverities.has(String(finding.severity ?? '').trim())
        ? String(finding.severity).trim()
        : 'warning',
      message: String(finding.message ?? '').trim(),
      suggestion: String(finding.suggestion ?? '').trim(),
    }))
    .filter((finding) => {
      return (
        finding.path &&
        Number.isInteger(finding.line) &&
        finding.line > 0 &&
        finding.ruleId &&
        finding.message &&
        finding.suggestion
      )
    })
}

async function callAiReview({ apiKey, baseUrl, model, guidelines, files }) {
  const promptFiles = files.map((file) => ({
    path: file.filename,
    status: file.status,
    changedLines: Array.from(file.changedLines).sort((a, b) => a - b),
    patch: file.patch,
  }))

  const response = await fetch(chatCompletionsUrl(baseUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: [
            '你是一个谨慎的前端 Code Review 助手。',
            '你只根据团队规范和 PR diff 审查问题。',
            '只输出明确违反规范、会影响维护性、可读性、可访问性或用户体验的问题。',
            '不要输出泛泛的重构建议，不要审查 diff 之外的代码。',
            '必须使用中文输出。',
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            '请根据以下团队规范审查 PR 变更。',
            '',
            '要求：',
            `- 最多返回 ${MAX_FINDINGS} 条 findings。`,
            '- 每条 finding 必须引用规范中的 ruleId，例如 TS-001、REACT-004。',
            '- line 必须是 changedLines 中的行号，也就是 PR 中新增或修改的行。',
            '- 如果问题无法定位到 changedLines，或者你不确定是否违反规范，不要返回该 finding。',
            '- path 必须完全等于输入文件 path。',
            '- severity 只能是 suggestion、warning、critical 之一。',
            '- 只返回 JSON，不要返回 Markdown 或解释文字。',
            '',
            'JSON 格式：',
            '{"findings":[{"path":"src/App.tsx","line":12,"ruleId":"REACT-004","severity":"warning","message":"问题说明","suggestion":"修改建议"}]}',
            '',
            '团队规范：',
            guidelines,
            '',
            'PR 变更文件：',
            JSON.stringify(promptFiles, null, 2),
          ].join('\n'),
        },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`AI request failed: ${response.status} ${body}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('AI response does not contain message content.')
  }

  return parseAiResponse(content).slice(0, MAX_FINDINGS)
}

function findingKey(finding) {
  return `${finding.path}:${finding.line}:${finding.ruleId}`
}

function normalizeFindings(findings, filesByPath) {
  const seen = new Set()
  const normalized = []
  const overflow = []

  for (const finding of findings) {
    const file = filesByPath.get(finding.path)

    if (!file || !file.changedLines.has(finding.line)) {
      overflow.push(finding)
      continue
    }

    const key = findingKey(finding)
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push(finding)
  }

  return { normalized, overflow }
}

function reviewCommentBody(finding) {
  return [
    REVIEW_MARKER,
    `**${finding.ruleId}** · ${finding.severity}`,
    '',
    finding.message,
    '',
    `建议：${finding.suggestion}`,
  ].join('\n')
}

function summaryBody({ files, postedCount, overflow, skippedReason }) {
  const lines = [
    SUMMARY_MARKER,
    '## AI Code Review',
    '',
  ]

  if (skippedReason) {
    lines.push(`已跳过：${skippedReason}`)
    return lines.join('\n')
  }

  lines.push(`已根据 \`docs/frontend-code-review-guidelines.md\` 检查 ${files.length} 个前端变更文件。`)
  lines.push(`已发布 ${postedCount} 条行级评论。`)

  if (postedCount === 0 && overflow.length === 0) {
    lines.push('')
    lines.push('未发现明确违反团队规范的问题。')
  }

  if (overflow.length > 0) {
    lines.push('')
    lines.push('以下问题未能定位到 PR 变更行，暂放在汇总中：')
    lines.push('')

    for (const finding of overflow) {
      lines.push(`- \`${finding.path}:${finding.line}\` **${finding.ruleId}**：${finding.message} 建议：${finding.suggestion}`)
    }
  }

  return lines.join('\n')
}

async function deletePreviousReviewComments({ github, pullNumber }) {
  const comments = await paginate((page) => {
    return github.get(`/pulls/${pullNumber}/comments?per_page=100&page=${page}`)
  })

  const previous = comments.filter((comment) => {
    return typeof comment.body === 'string' && comment.body.includes(REVIEW_MARKER)
  })

  for (const comment of previous) {
    await github.delete(`/pulls/comments/${comment.id}`)
  }

  if (previous.length > 0) {
    log(`Deleted ${previous.length} previous AI review comment(s).`)
  }
}

async function upsertSummaryComment({ github, pullNumber, body }) {
  const comments = await paginate((page) => {
    return github.get(`/issues/${pullNumber}/comments?per_page=100&page=${page}`)
  })

  const previous = comments.find((comment) => {
    return typeof comment.body === 'string' && comment.body.includes(SUMMARY_MARKER)
  })

  if (previous) {
    await github.patch(`/issues/comments/${previous.id}`, { body })
    return
  }

  await github.post(`/issues/${pullNumber}/comments`, { body })
}

async function postLineComments({ github, pullNumber, commitSha, findings }) {
  const failed = []
  let postedCount = 0

  for (const finding of findings) {
    try {
      await github.post(`/pulls/${pullNumber}/comments`, {
        body: reviewCommentBody(finding),
        commit_id: commitSha,
        path: finding.path,
        line: finding.line,
        side: 'RIGHT',
      })
      postedCount += 1
    } catch (error) {
      console.warn(`[ai-review] Failed to post line comment for ${findingKey(finding)}: ${error.message}`)
      failed.push(finding)
    }
  }

  return { postedCount, failed }
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  const repository = process.env.GITHUB_REPOSITORY
  const githubToken = process.env.GITHUB_TOKEN
  const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com'
  const apiKey = process.env.AI_REVIEW_API_KEY
  const baseUrl = process.env.AI_REVIEW_BASE_URL
  const model = process.env.AI_REVIEW_MODEL

  if (!eventPath || !repository || !githubToken) {
    log('Missing GitHub Actions environment. Nothing to review.')
    return
  }

  const missingAiConfig = [
    ['AI_REVIEW_API_KEY', apiKey],
    ['AI_REVIEW_BASE_URL', baseUrl],
    ['AI_REVIEW_MODEL', model],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missingAiConfig.length > 0) {
    log(`Missing ${missingAiConfig.join(', ')}. Skipping AI review.`)
    return
  }

  const event = readJson(eventPath)
  const pullRequest = event.pull_request

  if (!pullRequest) {
    log('This event is not a pull_request event. Nothing to review.')
    return
  }

  if (pullRequest.base.ref !== 'pre') {
    log(`Target branch is ${pullRequest.base.ref}, not pre. Skipping AI review.`)
    return
  }

  if (pullRequest.draft) {
    log('Pull request is draft. Skipping AI review.')
    return
  }

  const [owner, repo] = repository.split('/')
  const github = createGitHubClient({
    apiUrl,
    owner,
    repo,
    token: githubToken,
  })

  const guidelines = fs.readFileSync(
    path.join(process.cwd(), 'docs/frontend-code-review-guidelines.md'),
    'utf8',
  )

  const prFiles = await paginate((page) => {
    return github.get(`/pulls/${pullRequest.number}/files?per_page=100&page=${page}`)
  })

  const files = prFiles
    .filter((file) => {
      return (
        file.status !== 'removed' &&
        typeof file.patch === 'string' &&
        isFrontendFile(file.filename)
      )
    })
    .map((file) => ({
      filename: file.filename,
      status: file.status,
      patch: file.patch,
      changedLines: getChangedLines(file.patch),
    }))
    .filter((file) => file.changedLines.size > 0)

  if (files.length === 0) {
    log('No changed frontend files found. Skipping AI review.')
    await deletePreviousReviewComments({
      github,
      pullNumber: pullRequest.number,
    })
    await upsertSummaryComment({
      github,
      pullNumber: pullRequest.number,
      body: summaryBody({
        files,
        postedCount: 0,
        overflow: [],
        skippedReason: '本次 PR 没有需要 AI Review 的前端变更文件。',
      }),
    })
    return
  }

  const patchSize = files.reduce((total, file) => total + file.patch.length, 0)
  const reviewFiles =
    patchSize > MAX_PATCH_CHARS
      ? files.reduce((selected, file) => {
          const currentSize = selected.reduce((total, item) => total + item.patch.length, 0)
          return currentSize + file.patch.length <= MAX_PATCH_CHARS ? [...selected, file] : selected
        }, [])
      : files

  if (reviewFiles.length === 0) {
    log('Changed frontend diff is too large for one AI review request. Skipping AI review.')
    await deletePreviousReviewComments({
      github,
      pullNumber: pullRequest.number,
    })
    await upsertSummaryComment({
      github,
      pullNumber: pullRequest.number,
      body: summaryBody({
        files,
        postedCount: 0,
        overflow: [],
        skippedReason: '本次前端 diff 过大，超过 AI Review 初版处理上限。',
      }),
    })
    return
  }

  if (reviewFiles.length < files.length) {
    log(`Reviewing ${reviewFiles.length}/${files.length} file(s) because the diff is large.`)
  } else {
    log(`Reviewing ${reviewFiles.length} changed frontend file(s).`)
  }

  const filesByPath = new Map(reviewFiles.map((file) => [file.filename, file]))
  const findings = await callAiReview({
    apiKey,
    baseUrl,
    model,
    guidelines,
    files: reviewFiles,
  })

  const { normalized, overflow } = normalizeFindings(findings, filesByPath)

  await deletePreviousReviewComments({
    github,
    pullNumber: pullRequest.number,
  })

  const { postedCount, failed } = await postLineComments({
    github,
    pullNumber: pullRequest.number,
    commitSha: pullRequest.head.sha,
    findings: normalized,
  })

  await upsertSummaryComment({
    github,
    pullNumber: pullRequest.number,
    body: summaryBody({
      files: reviewFiles,
      postedCount,
      overflow: [...overflow, ...failed],
    }),
  })

  log(`AI review completed with ${postedCount} line comment(s).`)
}

main().catch((error) => {
  console.error(`[ai-review] ${error.stack || error.message}`)
  console.error('[ai-review] AI review is non-blocking, exiting successfully.')
  process.exit(0)
})
