---
title: "社区展示"
---

这是由社区维护的精选清单，收录使用 OpenSpec 构建或为 OpenSpec 提供支持的项目与资源。欢迎提交工具、集成、工作流和学习资源。社区成员通过提交 issue 不断扩充此展示页，条目由维护者添加。

所列项目均由各自维护者独立维护。收录不代表 OpenSpec 官方提供支持或认可。有关设置和支持，请查看各项目的文档和问题跟踪器。

## 项目与资源

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**：运行并监督针对 OpenSpec 变更的智能体。
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**：CLI 和 GitHub Action，可报告哪些 OpenSpec 场景已由 Vitest 或 Jest 测试覆盖，而不运行测试。

## 托管服务

提供 CLI 未提供的 OpenSpec 功能的托管产品。每个条目都会说明其账户、付费和数据处理条款。

- **[MySpec](https://myspec.dev)**：云端测试版（需要账户；提供免费套餐，无需信用卡），通过引导式规格访谈生成规格，并导出四文件包或与 OpenSpec 兼容的变更。其 MCP 服务器（`@myspec/mcp-server`）和 [Claude Code 插件](https://github.com/myspecs/claude-plugins) 可让编码智能体读取这些规格、编写 OpenSpec 变更，并逐项任务进行实现。该服务会将提交的内容发送给第三方 AI 提供商，不适用于敏感数据。
- **[Entalpa](https://entalpa.com/en/openspec)**：将公开 GitHub 仓库的 `openspec/specs/`（最多 300 条需求）导入可浏览的项目中，添加利益相关方、用户故事以及标注为推断的开放问题，并将结果导出为 `openspec/specs/` 目录树；它从不写入该仓库。导入和阅读无需账户；保存或编辑需要账户，AI 功能使用付费积分。导入的内容会发送给第三方 AI 提供商。
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) 和 [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**：来自 SkillGild、适用于 Claude Code、Codex、Cursor、Gemini CLI 或任何 MCP 客户端的托管技能。Review 会将变更发布为一个链接，持有该链接的任何人无需账户即可逐项需求进行批准、要求修改或评论，并显示 `openspec archive` 将写入的主规格说明，同时标记其他进行中的变更也涉及的需求。Compact 会在主规格说明之间查找词汇相似的需求和重复的场景，并将清理工作写成一个 OpenSpec 变更。需要 SkillGild CLI 和免费账户（每个技能每月 25 次运行）。两者都会将规格内容发送到 SkillGild 的服务器，这些服务器运行闭源代码，且不调用任何 AI 模型；Review 还会发送提案、设计和任务，并将变更保留 30 天。

## 添加你的项目

提交 issue，说明你希望添加的一行内容：项目名称、直接链接，以及它与 OpenSpec 的简短关联说明。维护者会将其添加到此文件中。

- 条目应聚焦于使用 OpenSpec 构建的内容或支持使用 OpenSpec 的内容，而非一般性的产品宣传。
- 描述人们可以用它做什么。避免宣传性说法、推荐链接和跟踪链接。
- 如有付费功能或必需账户，请在条目中说明。
- 托管或付费服务仅在其提供 CLI 尚未具备的 OpenSpec 功能，且有免费试用途径时，才会列入“托管服务”部分。仅重新打包 OpenSpec 自身技能或命令的服务不予收录。

也欢迎更正和更新现有条目。
