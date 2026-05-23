module.exports = {
  types: [
    {
      value: "init",
      name: "🎉 init: 初始化",
    },
    {
      value: "feat",
      name: "✨ feat: 新功能",
    },
    {
      value: "fix",
      name: "🐞 fix: 修复bug",
    },
    {
      value: "perf",
      name: "💡 perf: 改进优化相关,比如提升性能、体验",
    },
    {
      value: "test",
      name: "🚨 test: 测试，实验",
    },
    {
      value: "chore",
      name: "🔧 chore: 构建/工程依赖/工具",
    },
    {
      value: "style",
      name: "💄 style: 代码的样式美化(标记、空白、格式化、缺少分号……)",
    },
    {
      value: "release",
      name: "🔖 release: 发布版本",
    },
    {
      value: "move",
      name: "🚚 move: 移动或删除文件",
    },
    {
      value: "revert",
      name: "⏪ revert: 回退",
    },
    {
      value: "merge",
      name: "🔀 merge: 合并分支",
    },
    {
      value: "docs",
      name: "📝 docs: 文档变更",
    },
  ],
  scopes: [
    "主页",
    "构建",
    "workflow",
    "vercel",
    "eslint",
    "脚手架",
  ],
  skipQuestions: ["body", "footer"],
  messages: {
    type: "选择一种你的提交类型( 必选 ❗):",
    scope:
      "请选择修改范围\n 💬 业务项目中依据菜单或者功能模块划分(必选 ❗)：\n",
    subject: "请简要描述提交( 必填 ❗)：\n",
    body: '请输入详细描述使用," | "换行(可选)：\n',
    breaking: "列出任何BREAKING CHANGES(可选)：\n",
    confirmCommit: "确定提交此说明吗？",
  },
  allowCustomScopes: false,
  allowBreakingChanges: ["feat", "fix"],
  subjectLimit: 72,
};
