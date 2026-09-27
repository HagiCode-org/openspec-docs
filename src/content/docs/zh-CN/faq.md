---
title: "常见问题"
---

这里简要回答大家最常问的问题。如果你的问题更像是“出了故障”，请查看[故障排除](/zh-CN/troubleshooting/)。如果想了解术语定义，请查看[术语表](/zh-CN/glossary/)。

## 基础知识

### 用一句话来说，OpenSpec 是什么？

OpenSpec 是一个轻量级约定层，让你和 AI 编程助手在编写任何代码之前，以书面形式就要构建什么达成一致。

### 为什么我需要它？

因为 AI 助手即使错了也可能显得很自信。如果需求只存在于聊天记录中，AI 就会通过猜测填补空白，而你可能等代码写完后才发现问题。OpenSpec 将达成共识的时机提前，让错误能够以较低成本修正。完整说明请参阅[核心概念速览](/zh-CN/overview/)。

### 所有事情都必须使用 OpenSpec 吗？

不必。在需要达成共识的工作中使用它，这包括大多数非琐碎任务。修复一个字符的拼写错误可能不值得走完整流程，没关系。

### 它适用于大型现有代码库，还是只适用于新项目？

现有代码库才是 OpenSpec 的主要使用场景。OpenSpec 优先考虑棕地项目：你无需预先记录整个应用，只需为每项变更涉及的内容编写规格说明。规格说明会围绕你实际完成的工作逐步完善。参阅专门的[在现有项目中使用 OpenSpec 指南](/zh-CN/existing-projects/)。

### 它是否绑定某种 AI 工具？

不绑定。OpenSpec 支持 30 多种助手，包括 Claude Code、Cursor、Devin Desktop、GitHub Copilot、Gemini CLI、Codex 等。完整清单和各工具详情见[支持的工具](/zh-CN/supported-tools/)。

## 运行命令

### `/opsx:propose` 应该在哪里输入？

在 AI 助手聊天中，而不是终端。这是最常见的困惑，因此有专门的[命令的工作方式](/zh-CN/how-commands-work/)页面。简而言之：`openspec ...` 在终端运行，`/opsx:...` 在聊天中运行。

### 如何“启动交互模式”？

没有单独需要启动的模式。像平常一样打开 AI 助手，在聊天中输入斜杠命令即可。输入斜杠命令就是“进入”OpenSpec 的方式。（真正具有交互性的终端功能是 `openspec view`，它提供浏览规格说明和变更的仪表板。）详情见[命令的工作方式](/zh-CN/how-commands-work/)。

### 我输入了斜杠命令，却什么也没发生。为什么？

最可能的原因是你在终端而非 AI 聊天中输入了命令、使用了工具无法识别的拼写，或尚未安装这些命令。如果文件缺失，或你从未设置该工具，请运行 `openspec init`；`openspec update` 只会刷新已有文件。然后重新启动助手，并使用“Getting started”中显示的命令格式——参见[如何调用](/zh-CN/supported-tools/)。完整检查清单见[故障排除](/zh-CN/troubleshooting/)。

### 为什么有些工具使用 `/opsx:propose`，另一些却用 `/opsx-propose`？

不同 AI 工具呈现自定义命令的方式不同，OpenSpec 会根据工具加载的文件形式选择命令拼写。名为 `opsx-propose.md` 的命令文件对应 `/opsx-propose`；放在 `commands/opsx/` 下的文件则对应 `/opsx:propose`。使用技能而非命令的工具会使用技能名称——Codex 使用 `$openspec-propose`，Kimi Code 使用 `/skill:openspec-propose`。`openspec init` 中的“Getting started”提示会显示你所选工具对应的格式；完整表格见[如何调用](/zh-CN/supported-tools/)。

### 技能和命令有什么区别？

两者都是 OpenSpec 写入的文件，用于让助手运行工作流。技能 (`.../skills/openspec-*/SKILL.md`) 是较新的跨工具标准；命令 (`.../commands/opsx-*`) 是较早采用的、按工具区分的斜杠命令文件。你无需自己选择。输入斜杠命令后，OpenSpec 会安装你的工具所使用的形式。

## 工作流

### 还不确定要构建什么时，应该从哪里开始？

从 `/opsx:explore` 开始。它是一位没有压力的思考伙伴，会读取代码库、列出选项，并在编写代码之前把模糊的问题梳理成具体计划。它包含在默认配置档案中，随时可用。计划清晰后，再转交 `/opsx:propose`。这是最值得养成的习惯，因为它能阻止跃跃欲试的 AI 自信地构建错误的内容。参阅[先探索](/zh-CN/explore/)。

### 最简单的流程是什么？

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

先用 Explore 梳理想法，再用 propose 起草计划、用 apply 实现，最后用 archive 归档。已经完全清楚自己要什么时，可以跳过 Explore。

### `/opsx:propose` 和 `/opsx:new` 有什么区别？

`/opsx:propose` 是默认的单步命令：它会创建变更并一次性起草所有规划产物。`/opsx:new` 属于扩展命令集，只搭建空的变更框架，然后由你通过 `/opsx:continue` 一次创建一个产物（或使用 `/opsx:ff` 一次创建全部产物）。除非你需要逐步控制，否则使用 propose 即可。参阅[命令](/zh-CN/commands/)。

### `core` 和 expanded 配置档案是什么？

配置档案决定安装哪些斜杠命令。默认的 **Core** 包含 `propose`、`explore`、`apply`、`update`、`sync` 和 `archive`。**expanded** 集合还增加 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`，提供更细致的控制。使用 `openspec config profile` 切换，然后运行 `openspec update` 应用设置。

### 我需要运行 `/opsx:sync` 吗？

通常不需要。Sync 会把变更的差异规格说明合并到主规格说明中，而 `/opsx:archive` 会主动为你执行同步。只有当你希望在归档之前先合并规格说明时，才手动运行 sync，例如处理耗时较长的变更。参阅[命令](/zh-CN/commands/)。

### 开始之后，如何编辑提案、规格说明或任务？

直接编辑文件即可。每项产物都是 `openspec/changes/<name>/` 下的纯 Markdown 文件，没有锁定阶段或特殊编辑模式。你可以手动修改，也可以让 AI 帮忙（“更新设计，改用队列”），然后继续。AI 始终基于文件的当前内容工作。完整指南见[编辑和迭代变更](/zh-CN/editing-changes/)。

### 实现了一部分之后，还能回头修改计划吗？

可以，任何时候都可以。工作流很灵活，审查和编辑不会把你限制在某个阶段。编辑产物后继续即可。如果需要有条理地检查代码是否仍符合计划，可以运行 `/opsx:verify`。参阅[编辑和迭代变更](/zh-CN/editing-changes/)。

### 我手动编辑了代码，如何与规格说明协调？

归档会让规格说明成为正式记录，所以归档前需要让两者重新一致。如果代码现在正确，就更新差异规格说明以反映已交付内容；如果规格说明正确，就继续实现，直到代码符合要求。`/opsx:verify` 可以指出不一致。参阅[编辑和迭代变更](/zh-CN/editing-changes/)。

### 何时应更新现有变更，何时应新建？

同一项工作只是经过完善时就更新；意图彻底改变或范围膨胀成另一项工作时就重新开始。决策流程图和示例见[工作流](/zh-CN/workflows/)。

### 如果会话上下文用完，或实现过程中需求发生变化，该怎么办？

这正是规格说明发挥作用的地方。计划存放在文件中，而不只是聊天记录里，因此你可以清空上下文、开始新的 AI 会话，再运行 `/opsx:apply`；它会读取产物，并从第一个未勾选的任务继续。需求变化时，修改产物以反映新的实际情况，然后继续。保持干净的上下文窗口也能得到更好的结果；开始实现前可以清空上下文。

### 我应该把 `openspec/` 文件夹提交到 git 吗？

应该。规格说明、活动中的变更和归档都是项目历史的一部分，应像其他源文件一样提交。尤其是归档，它会成为记录系统为何如此运行的长期资料。

## 规格说明与变更

### 规格说明和设计分别写什么？

规格说明描述可观察的行为：系统做什么、输入和输出是什么，以及错误情形如何处理。设计描述如何构建：技术方案、架构决策和文件变更。如果改变实现但不改变外部可见行为，该内容就属于设计，而非规格说明。详见[概念](/zh-CN/concepts/)。

### 什么是差异规格说明？

差异规格说明只通过 `ADDED`、`MODIFIED` 和 `REMOVED` 章节描述变更内容，而不会重述整份规格说明。这是 OpenSpec 简洁地修改现有系统的方式。参阅[概念](/zh-CN/concepts/)。

### 已归档的变更会放在哪里？

它会连同所有变更产物一起移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`，并从活动变更列表中移除。明确声明 `retire_capabilities: true` 的变更还可以在删除某项能力的最后一条需求时，删除该能力的主规格说明。

## 配置与自定义

### 如何告诉 AI 我的技术栈？

将信息放在 `openspec/config.yaml` 的 `context:` 下。该文本会注入每个规划请求，因此 AI 始终了解你的技术栈和约定。参阅[自定义](/zh-CN/customization/)。

### 可以用英语以外的语言生成规格说明吗？

可以。在配置的 `context:` 中添加语言指令。[多语言指南](/zh-CN/multi-language/)提供了多种语言的可复制片段。

### 可以更改工作流本身吗？

可以，使用自定义模式即可。模式定义有哪些产物以及彼此之间的依赖关系。使用 `openspec schema fork spec-driven my-workflow` 从默认模式派生，再进行编辑。参阅[自定义](/zh-CN/customization/)。

## 模型、隐私与升级

### 应该使用哪种 AI 模型？

OpenSpec 最适合搭配推理能力强的模型。README 建议在规划和实现时使用 Codex 5.5、Opus 4.7 等模型。也要保持上下文窗口干净：开始实现前清空上下文，以获得最佳效果。

### OpenSpec 会收集数据吗？

它会收集匿名使用统计信息，仅包括命令名称和版本。不收集参数、路径、内容或个人数据，并会在 CI 中自动关闭。可使用 `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1` 选择退出。

### 如何升级？

分两步完成。先升级软件包 (`npm install -g @fission-ai/openspec@latest`)，然后在每个项目中运行 `openspec update`，刷新生成的技能和命令。

### 如何卸载 OpenSpec？

没有专门的卸载命令，因为它只是一个全局软件包和项目中的一些文件。移除软件包 (`npm uninstall -g @fission-ai/openspec`)，还可以选择删除 `openspec/` 目录和生成的工具文件。分步说明以及哪些内容可以保留，见[安装指南](/zh-CN/installation/)。

## 获取帮助

### 在哪里提问或报告 bug？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **在终端中：** 运行 `openspec feedback "your message"`，即可为你创建 GitHub Issue。

### 文档有错误或让人困惑，该怎么办？

告诉我们，或者直接修正。我们欢迎并重视文档拉取请求。你可以提交 issue 或拉取请求。
