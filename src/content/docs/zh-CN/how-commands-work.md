---
title: "命令的工作方式"
---

**只需记住一件事：OpenSpec 有两种命令，分别在不同的地方运行。**

- `openspec ...` 命令在**终端**中运行。（例如：`openspec init`。）
- `/opsx:...` 命令在 **AI 助手聊天**中运行。（例如：`/opsx:propose`。）

如果你曾在终端中输入 `/opsx:propose`，却什么也没发生，本页就能解释原因：你正在与 OpenSpec 错误的一半对话。斜杠命令不是终端命令，而是你在 AI 编程助手中输入的指令，就像在同一个聊天框里输入“添加一个登录表单”一样。

这是新用户最常遇到的障碍，因此我们会把它说明白。

## 两个部分

OpenSpec 是一个身兼两职的项目。

**CLI（终端部分）。** 名为 `openspec` 的程序，你可以安装后从 shell 中运行。它会设置项目、列出并验证变更、显示仪表板，以及归档已完成的工作。你可以在 iTerm、VS Code 终端、PowerShell，或任何可以运行 `git` 或 `npm` 的地方输入命令。

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**斜杠命令（聊天部分）。** 像 `/opsx:propose` 和 `/opsx:apply` 这样的简短命令，输入到 AI 助手中。这些命令会要求 AI 遵循 OpenSpec 工作流：起草提案、编写规格说明、按任务清单实现，并在完成后归档。可以在 Claude Code、Cursor、Devin Desktop、Copilot 或你所使用的其他助手中输入。

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

下面这张图概括了整个思维模型：

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

注意图中的箭头。在终端中运行 `openspec init`，会将斜杠命令*安装*到 AI 工具中。终端部分负责设置聊天部分。完成设置后，日常操作大多在聊天中进行。

## “如何启动交互模式？”

**没有需要单独启动的交互模式。** 这是个常见问题，值得直接说明。

无需进入特殊的 OpenSpec 模式。像平常一样打开 AI 编程助手，在聊天中输入斜杠命令即可。斜杠命令本身就是“进入”OpenSpec 的方式。助手会识别命令、加载对应的 OpenSpec 技能，并开始遵循相应工作流。

实际只需这样做：

1. 在项目中打开 AI 编程助手（例如 Claude Code、Cursor、Devin Desktop）。
2. 在它的聊天中输入 `/opsx:propose`，就像输入其他请求一样。
3. 留意自动补全：如果 OpenSpec 已安装，输入斜杠时会出现 `/opsx:propose`、`/opsx:apply` 等建议。

就是这样。无需切换模式、启动守护进程或打开单独的窗口。

终端中确实有一个交互式功能：`openspec view`。它会打开一个仪表板，用于浏览规格说明和变更。但它只是查看器，不是用于提出和实现变更的工具。真正的构建工作通过聊天中的斜杠命令进行。

## 为什么要这样划分

了解这种划分很有价值，因为它解释了 OpenSpec 为何能配合 30 多种 AI 工具使用。

CLI 是**引擎**。它了解规则：变更文件夹应是什么样子、各产物之间有哪些依赖关系，以及如何将差异规格说明合并到唯一真实依据中。无论使用哪种工具，它都相同。

斜杠命令是**方向盘**，每种 AI 工具的方向盘都略有不同。Claude Code 将它们称为命令；Cursor 和 Devin Desktop 使用各自的格式；有些工具称其为技能。运行 `openspec init` 时，OpenSpec 会为你选择的每种工具生成相应文件，因此无论你偏好哪种助手，都可以表达相同的 `/opsx:propose` 意图。

这种设计的优点是：学会一次工作流，就能在不同工具间使用。代价是：不同工具的命令语法可能略有差异，下一节会介绍这些差异。

## 不同工具的斜杠命令语法

命令意图处处相同，具体拼写则取决于工具加载的文件。

| 工具的命令文件 | 输入方式 | 示例工具 |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code、Gemini CLI、Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor、GitHub Copilot（IDE）、Devin Desktop、Trae、Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| 无——仅支持技能 | `/openspec-propose` | CodeArts、ForgeCode、Hermes、Mistral Vibe、Zed Agent、共享 `.agents` |
| 无——Kimi Code | `/skill:openspec-propose` | Kimi Code |
| 无——Codex CLI | `$openspec-propose` | Codex |

Devin 是唯一横跨两行的工具。Devin Desktop 会读取 `.devin/workflows/`，所以在那里可以使用 `/opsx-propose`；[Devin Local 不支持](https://docs.devin.ai/desktop/devin-local)，因此在该智能体中应使用 `/openspec-propose` 技能。OpenSpec 写入 `.devin/skills/` 的技能在两种环境中都有效，因此它们会通过技能名称相互引用。

所有工具均列在[如何调用](/zh-CN/supported-tools/)中——该表是权威参考。有两行并非斜杠命令：Amazon Q 会把文件加载到通过 `@` 调用的提示词库；最后三行使用的是*技能名称*，它并非命令 ID（`/opsx:apply` 对应的技能是 `openspec-apply-change`）。

拿不准时，查看 `openspec init` 打印的“Getting started”提示，其中已经使用了工具注册的格式。也可以输入斜杠并查看自动补全，但并非所有工具都提供斜杠命令。

## 命令从何而来：技能与命令

运行 `openspec init`（或 `openspec update`）时，OpenSpec 会在项目中写入一些小文件，让 AI 工具能够找到工作流。根据工具和设置，这些文件可能是**技能**、**命令**或两者兼有。

- **技能**通常位于 `.claude/skills/openspec-*/SKILL.md` 等路径。它们是新兴的跨工具标准：一组可由助手自动检测的指令文件。
- **命令**通常位于 `.cursor/commands/opsx-<id>.md` 或 `.claude/commands/opsx/<id>.md` 等路径——目录结构取决于工具，工具也决定如何输入命令。它们是较早采用的、按工具区分的斜杠命令文件。Codex 不会生成命令文件；请改用 `.agents/skills/openspec-*`。

你无需关心工具使用的是哪种文件。输入斜杠命令即可。但了解这些文件的存在有助于排查问题：命令消失时，通常是文件缺失或已过时；运行 `openspec update` 可重新生成。

每种工具对应的确切路径见[支持的工具](/zh-CN/supported-tools/)；技能如何取代较早的纯命令方式，见[迁移指南](/zh-CN/migration-guide/)。

## 确认已经安装

按照从快到慢的顺序检查：

1. **在 AI 聊天中输入斜杠。** 输入 `/opsx` 并查看自动补全建议。如果出现建议，说明设置正常。对于仅支持技能的工具（Codex、Kimi Code、CodeArts、ForgeCode、Hermes、Mistral Vibe、Zed Agent 或共享 `.agents` 目标），即使安装正常，输入 `/opsx` 也不会自动补全——请尝试上表中的技能名称。
2. **查看文件。** 对于 Claude Code，检查 `.claude/skills/` 中是否有 `openspec-*` 文件夹。其他工具使用各自的目录（见[支持的工具](/zh-CN/supported-tools/)）。
3. **重新运行设置。** 在项目根目录运行 `openspec update`。这会为你配置的工具重新生成技能和命令文件。
4. **重新启动助手。** 许多工具会在启动时扫描技能和命令，因此重新打开窗口可能就是解决办法。

## 我有哪些命令？

默认情况下，OpenSpec 会安装 **core** 斜杠命令集：

- `/opsx:explore`：在确定变更之前与 AI 一起梳理想法（拿不准时很适合作为第一步）
- `/opsx:propose`：创建变更并一次性起草所有规划产物
- `/opsx:apply`：逐项执行任务清单以实现变更
- `/opsx:update`：修改变更的规划产物并保持内容一致
- `/opsx:sync`：将变更对规格说明的更新合并到主规格说明中（通常会自动执行）
- `/opsx:archive`：完成变更并归档

推荐的默认节奏是：还在考虑要做什么时使用 `explore`，然后依次使用 `propose`、`apply` 和 `archive`。[先探索](/zh-CN/explore/)指南解释了为什么先探索很有价值。

此外，还有面向需要更精细控制的用户的 **expanded** 命令集（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。运行 `openspec config profile` 启用，然后运行 `openspec update` 应用。

如果你刚开始使用，扩展命令集中的 `/opsx:onboard` 会在你自己的代码库中带你走完一项完整变更，并逐步说明操作。它是最友好的入门方式。

每个命令的详细用途见[命令](/zh-CN/commands/)；何时使用哪个命令见[工作流](/zh-CN/workflows/)。

## 从头开始的完整流程

以下完整流程标注了每一步发生的位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

在终端中执行两步完成设置，然后主要就在聊天中工作。这就是日常节奏。

## 相关内容

- [快速入门](/zh-CN/getting-started/)：首次变更的完整演示
- [命令](/zh-CN/commands/)：逐一介绍所有斜杠命令
- [CLI](/zh-CN/cli/)：逐一介绍所有终端命令
- [支持的工具](/zh-CN/supported-tools/)：各工具的语法和文件位置
- [常见问题](/zh-CN/faq/)：更多简要解答
- [故障排除](/zh-CN/troubleshooting/)：命令未显示时的解决办法
