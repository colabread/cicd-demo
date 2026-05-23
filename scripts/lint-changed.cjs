const { execFileSync, spawnSync } = require('node:child_process')

const LINTABLE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
}

function isLintable(file) {
  const dotIndex = file.lastIndexOf('.')
  if (dotIndex === -1) {
    return false
  }

  return LINTABLE_EXTENSIONS.has(file.slice(dotIndex))
}

const changedFiles = [
  ...runGit(['diff', '--name-only', '--diff-filter=ACMR', '-z', 'HEAD', '--']),
  ...runGit(['ls-files', '--others', '--exclude-standard', '-z']),
]

const lintFiles = Array.from(new Set(changedFiles)).filter(isLintable)

if (lintFiles.length === 0) {
  console.log('No changed lintable files found.')
  process.exit(0)
}

console.log(`Linting ${lintFiles.length} changed file(s):`)
lintFiles.forEach((file) => {
  console.log(`  - ${file}`)
})

const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
const result = spawnSync(yarn, ['eslint', ...lintFiles], { stdio: 'inherit' })

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

if (result.status === 0) {
  console.log('PASS: Changed files passed ESLint.')
}

process.exit(result.status ?? 1)
