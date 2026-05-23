import type { ModulePageMeta } from './module-placeholder'

export const questionBankMeta: ModulePageMeta = {
  title: '题库管理',
  subtitle: '沉淀校本题目资产，按学科、知识点、难度和来源进行统一治理。',
  tone: '湖青',
  metrics: [
    { label: '题目总量', value: '48,216', trend: '本周新增 312' },
    { label: '待复核', value: '126', trend: '较昨日 -18' },
    { label: '知识点覆盖', value: '92%', trend: '高频章节稳定' },
  ],
  focus: ['题目查重与版本归档', '按知识点批量维护标签', '难度分布与来源质量巡检'],
}

export const paperManagementMeta: ModulePageMeta = {
  title: '试卷管理',
  subtitle: '管理试卷模板、命题任务和成卷记录，让教研组快速复用优秀方案。',
  tone: '松墨',
  metrics: [
    { label: '试卷模板', value: '318', trend: '同步 24 个年级包' },
    { label: '组卷中', value: '17', trend: '8 个待审核' },
    { label: '平均成卷', value: '11m', trend: '效率提升 21%' },
  ],
  focus: ['试卷蓝图与双向细目表', '组卷策略沉淀', '质量评估与结构复盘'],
}

export const knowledgeGraphMeta: ModulePageMeta = {
  title: '图谱管理',
  subtitle: '维护学科知识图谱、先修关系和能力层级，支撑智能推荐与诊断。',
  tone: '石榴',
  metrics: [
    { label: '节点数量', value: '6,904', trend: '本月扩充 186' },
    { label: '关系边', value: '19,420', trend: '冲突 9 条' },
    { label: '覆盖教材', value: '34', trend: '新课标版本齐全' },
  ],
  focus: ['知识点层级维护', '先修关系校验', '教材章节映射'],
}

export const userManagementMeta: ModulePageMeta = {
  title: '用户管理',
  subtitle: '统一维护教研员、备课组长、教师和外部专家账号。',
  tone: '竹青',
  metrics: [
    { label: '活跃用户', value: '1,246', trend: '近 7 日 +64' },
    { label: '待激活', value: '38', trend: '来自 6 所学校' },
    { label: '组织数', value: '72', trend: '区校结构已同步' },
  ],
  focus: ['账号生命周期', '学校与教研组归属', '角色变更留痕'],
}

export const permissionManagementMeta: ModulePageMeta = {
  title: '权限管理',
  subtitle: '配置角色、资源范围与审批边界，保证教研资料安全流转。',
  tone: '金棕',
  metrics: [
    { label: '角色模板', value: '18', trend: '4 个已启用审批' },
    { label: '权限点', value: '146', trend: '覆盖 8 个模块' },
    { label: '风险操作', value: '5', trend: '待安全复核' },
  ],
  focus: ['最小权限策略', '跨校协作授权', '敏感资源审计'],
}

export const paperCompositionMeta: ModulePageMeta = {
  title: '试卷录排',
  subtitle: '承载录题、排版、校对、导出全流程，保障试卷交付一致性。',
  tone: '靛蓝',
  metrics: [
    { label: '录排任务', value: '42', trend: '12 个今日到期' },
    { label: '校对通过率', value: '97%', trend: '排版错误下降' },
    { label: '导出队列', value: '8', trend: 'PDF/Word 双格式' },
  ],
  focus: ['题干结构化录入', '版式模板检查', '多格式导出预检'],
}

export const questionLabelingMeta: ModulePageMeta = {
  title: '题目标注',
  subtitle: '对题目进行知识点、能力维度、情境类型和评分标准标注。',
  tone: '朱砂',
  metrics: [
    { label: '待标注', value: '864', trend: '优先处理中考题' },
    { label: '一致率', value: '89%', trend: '双人复核样本' },
    { label: '争议项', value: '23', trend: '等待专家仲裁' },
  ],
  focus: ['批量标注工作台', '专家复核机制', '标签一致性分析'],
}

export const logManagementMeta: ModulePageMeta = {
  title: '日志管理',
  subtitle: '追踪平台操作、导入导出、权限变更和系统异常。',
  tone: '青灰',
  metrics: [
    { label: '今日事件', value: '12,808', trend: '异常 14 条' },
    { label: '导出记录', value: '73', trend: '均已水印留痕' },
    { label: '告警处理', value: '96%', trend: '平均 18 分钟' },
  ],
  focus: ['操作追溯', '异常行为筛查', '审计报表归档'],
}
