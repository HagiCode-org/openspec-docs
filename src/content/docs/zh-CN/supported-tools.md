---
title: "支持的工具"
---

OpenSpec 支持多种 AI 编程助手。运行 `openspec init` 时，OpenSpec 会根据当前启用的配置档案/工作流选择和交付模式，为所选工具进行配置。

## 工作方式

对于每个已选择的工具，OpenSpec 可以安装：

1. **技能**（如果交付方式包含技能）：`.../skills/openspec-*/SKILL.md`
2. **命令**（如果交付方式包含命令）：该工具专用的 `opsx-*` 命令文件

Codex 仅使用技能：即使交付方式设置为 `commands`，OpenSpec 也会为 Codex 安装 `.agents/skills/openspec-*/SKILL.md`，但不会生成 Codex 自定义提示词文件。旧版 `.codex/skills` 路径下由 OpenSpec 管理的技能，会在替代技能写入后进行协调；自定义文件和内容不一致的文件会予以保留。

默认情况下，OpenSpec 使用 `core` 配置档案，其中包括：

- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

你可以通过 `openspec config profile` 启用扩展工作流（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），然后运行 `openspec update`。

## 如何调用

本文档使用 `/opsx:propose` 作为标准名称，但每种工具都会按照它加载的 OpenSpec 文件形式来拼写。请先在下方的[工具目录参考](/zh-CN/supported-tools/)中找到所用工具的命令路径，再在此表中匹配其形式。

| OpenSpec 写入的命令文件 | 输入方式 | 工具 |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*`——通过 `opsx/` 文件夹进行命名空间划分 | `/opsx:<id>` | Claude Code、CodeBuddy、Crush、Gemini CLI、Lingma、Qoder、ZCode |
| `.../opsx-<id>.*`——文件名就是命令 | `/opsx-<id>` | 其他所有生成命令文件的工具，Amazon Q 和 Devin 除外 |
| `.devin/workflows/opsx-<id>.md`——仅由 Devin 的两种智能体之一读取 | Devin Desktop 使用 `/opsx-<id>`，Devin Local 使用 `/openspec-<skill>` | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md`——这是提示词，而非命令 | `@opsx-<id>` | Amazon Q Developer |
| 无——仅支持技能 | `/openspec-<skill>` | CodeArts、ForgeCode、Hermes、MiniMax Code、Mistral Vibe、Zed Agent、共享 `.agents` |
| 无——Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| 无——Codex CLI | `$openspec-<skill>` | Codex（[不识别 `/openspec-<skill>`](https://github.com/openai/codex/issues/11817)） |

因此，同一个 `/opsx:propose` 命令在 Cursor 中写作 `/opsx-propose`，在 Amazon Q 中写作 `@opsx-propose`，在 Codex 中则写作 `$openspec-propose`。

有两项因素会独立变化，因此表格中的行不能合并：

- **名称。** 第 1、2 行仅在文件命名命令的形式上不同；所有生成命令文件的工具都使用 `opsx-<id>` / `opsx:<id>` 这一组名称。
- **包装形式。** Amazon Q 会将文件加载到通过 `@` 调用的提示词库中。仅支持技能的工具不会生成命令文件，因此最后三行使用[生成的技能名称](/zh-CN/supported-tools/)，它们与命令 ID 并非一一对应（`/opsx:apply` 对应 `openspec-apply-change` 技能）。

上方的命令路径模式有意使用不限定扩展名的 `.*`：扩展名由工具决定（Gemini CLI 使用 `.toml`、Continue 使用 `.prompt`、Kiro 和 GitHub Copilot 使用 `.prompt.md`）；部分工具在选择器中会显示扩展名。请匹配目录结构，而不是扩展名。

OpenSpec 生成的文件以及设置完成后显示的“Getting started”提示，已经采用了所选工具对应的格式。因此，最快的确认方式就是查看该提示。

## 工具目录参考

| 工具（ID） | 技能路径模式 | 命令路径模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请通过技能调用 `/openspec-*`） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（仅支持技能；请使用 `$openspec-*`） |
| Devin Desktop，原 Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请通过技能调用 `/openspec-*`） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 不生成（没有命令适配器；请通过技能调用 `/openspec-*`） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请通过技能调用 `/skill:openspec-*`） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请使用 MiniMax Code 技能） |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请通过技能调用 `/openspec-*`） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx/<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | 不生成。Rovo 没有斜杠命令界面——它会自动或根据提示词匹配技能（例如“使用 openspec-propose 技能”）；`/skills` 仅用于管理技能。生成的内容只通过技能名称引用技能，不会把它们写成 `/openspec-*` 命令。 |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（仅支持技能；请使用 `/openspec-*` 或 `@openspec-*`） |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| 共享 `.agents` 技能 (`agents`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（没有命令适配器；请通过技能调用 `/openspec-*`） |

\*\* GitHub Copilot 提示文件可在 IDE 扩展（VS Code、JetBrains、Visual Studio）中用作自定义斜杠命令。Copilot CLI 目前不会直接读取 `.github/prompts/*.prompt.md`。选择 `github-copilot` 还可以设置 GitHub 托管的**云端编码智能体**——详见下文 [GitHub Copilot 云端编码智能体](/zh-CN/supported-tools/)。

\*\*\* Hermes 默认从 `~/.hermes/skills/` 加载技能。若要使用项目本地的 OpenSpec 技能，请将项目 `.hermes/skills/` 目录添加到 `~/.hermes/config.yaml` 的 `skills.external_dirs` 中；之后 Hermes 会通过 `/openspec-propose` 等面向用户的斜杠调用形式提供技能。

\*\*\*\* Windsurf 于 2026 年 6 月 2 日[更名为 Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq)，其配置目录也随之更改：`.devin/` 是优先读写位置，`.windsurf/` 是旧版只读回退位置。OpenSpec 也采用了该更名——工具 ID 为 `devin`，同时 `--tools windsurf` 仍是其别名，以确保现有设置脚本继续有效。如果项目仍在 `.windsurf/` 中保存 OpenSpec 文件，下次运行 `openspec update` 时会提示迁移；拒绝迁移会保留原文件，而你自己编写的文件永远不会被修改。工作流按文件名调用，因此 `.devin/workflows/opsx-apply.md` 对应 `/opsx-apply`。[Devin Local 智能体不支持工作流](https://docs.devin.ai/desktop/devin-local)，只支持技能，而且完全不会读取 `.windsurf/`。因此，无论何时 OpenSpec 写入 Devin 技能，技能正文和入门提示都会使用 `/openspec-*` 技能调用形式，两种智能体均可使用。仅采用 commands 交付时不会写入技能，两者都会回退到 `/opsx-*`。

SourceCraft Code Assistant 支持面向其 VS Code 扩展。[自定义命令](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands)和[技能](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills)仅可在 VS Code 中使用。此集成不会配置 SourceCraft Web 或 JetBrains。

使用仅技能交付方式时，请要求 Code Assistant 针对你的想法使用 `openspec-propose` 技能。技能会根据请求内容匹配启用；OpenSpec 不会为此工具生成 `/openspec-*` 命令。

MiniMax Code 是全局的仅技能集成。OpenSpec 只会在 `~/.minimax/skills/` 下写入 `openspec-*` 目录，不会创建仓库本地的 `.minimax` 或 `.mavis` 目录。采用仅 commands 交付方式时，会保留现有的 MiniMax Code 全局技能，避免一个项目的交付设置移除其他项目正在使用的技能。

### GitHub Copilot 云端编码智能体

GitHub 的 [Copilot 编码智能体](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)运行在 GitHub Actions 环境中，与编辑器中的 Copilot 相互独立。OpenSpec 可以通过生成两个文件来设置它使用 OpenSpec CLI：

- `.github/workflows/copilot-setup-steps.yml`——在智能体环境中安装 `@fission-ai/openspec`
- `.github/agents/openspec.agent.md`——说明智能体如何驱动 OpenSpec

由于这会在仓库中写入 GitHub Actions 工作流，因此必须**显式选择启用**：

| 方式 | 行为 |
|-----|----------|
| `openspec init`（交互式） | 询问是否设置云端文件。默认选择为**否**。 |
| `openspec init --copilot-cloud` | 不提示，直接设置文件（适用于脚本/CI）。 |
| `openspec init --no-copilot-cloud` | 不提示，跳过设置，并移除之前生成的文件。 |
| `openspec update` | 不会提示。仅当你选择了启用（或项目中已有这些文件）时才刷新文件。如果你选择不启用，则会移除由 OpenSpec 管理的云端文件。 |

你的选择会保存在 `openspec/config.yaml` 的 `githubCopilot.cloudAgent: true|false` 中，因此非交互式更新也会遵循该设置。OpenSpec 只会写入或移除由它自己生成的文件——如果你自定义了 `copilot-setup-steps.yml` 或 `openspec.agent.md`，或原本就有自己的文件，OpenSpec 会保留它们并告知你。

### 何时选择共享 `.agents` 目标

`agents` 是不绑定厂商的选项：它会将技能写入 `.agents/skills/`（许多智能体工具都会读取的共享根目录），而不是某个工具专属目录。

| 情况 | 选择 |
|-----------|------|
| 你的工具在上方有专属条目 | 选择对应 ID——可使用该工具集成，包括其支持的斜杠命令 |
| 同一个仓库中有多个智能体，且都读取 `.agents/skills` | 选择 `agents`——共享一套技能，而不是每种工具各建一套 |
| 你的工具尚未列出，但会读取 `.agents/skills` | 选择 `agents` |

将此选项与某个工具专属 ID 一起选择没有问题；通常两者会写入不同的根目录。Codex 和 Zed Agent 是例外，因为它们共用规范 `.agents` 根目录。如果同时选择 Codex 与 Zed 或 `agents`，OpenSpec 会保留一套由 Codex 管理的技能树。交接内容会同时列出 Codex 的 `$openspec-*` 和其他智能体的 `/openspec-*` 调用形式，因此 `--tools all` 以及已有的多智能体设置仍可正常工作，不会有多个写入者互相覆盖文件。

当项目中已经有 `.agents/skills/` 目录时，OpenSpec 也会自动提供此选项；仅有 `.agents/` 不够，因为工具还会用该目录存放规则和子智能体定义。注意 `.agents` 与 `.agent` 不同：单数目录属于 Antigravity。

请留意以下两点：

- **只提供技能。** 此目标没有命令适配器，因此不会写入 `opsx-*` 命令文件；在包含 commands 的交付模式下，`openspec init` 会在 `Commands skipped for: … (no adapter)` 报告中列出 `agents`。通过技能名称调用工作流——多数读取 `.agents/skills` 的助手会使用 `/openspec-propose`，也是 OpenSpec 设置提示中显示的形式。此目标不绑定厂商，因此如果你的助手使用其他形式，请查看它自己的文档。
- **不会创建或编辑 `AGENTS.md`。** 该目标使用 `.agents/` 目录。如果根目录中的 `AGENTS.md` 仍包含旧版 OpenSpec 标记块，运行 `openspec update` 时会将其删除——参阅[迁移指南](/zh-CN/migration-guide/)。

此处介绍的 Zed 支持针对其内置 Zed Agent。Zed External Agents 和 Terminal Threads 使用各自的集成。Agent Skills 需要 [Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) 或更高版本。在不受信任的工作树中，项目本地技能不可用，除非你先[授予信任](https://zed.dev/docs/worktree-trust)。

Codex、Zed Agent 和不绑定厂商的目标共用 `.agents/skills/`，因此需要了解 OpenSpec 在其中管理哪些内容：OpenSpec 只会写入、刷新和移除所选工作流对应的 `openspec-*` 技能目录，以及记录共享技能树由 Codex、Zed Agent 还是不绑定厂商的目标生成的 `.openspec-target` 标记。该目录中的其他内容都会保留。`openspec-*` 名称和标记归 OpenSpec 管理；其中的修改会在下次 `openspec update` 时被替换，与其他工具的技能相同。

对于尚无标记的项目，OpenSpec 会根据受管理技能中的调用方式推断归属：`$openspec-*` 表示 Codex，`/openspec-*` 表示不绑定厂商的目标。若通用规范技能树与旧版 `.codex/skills` 同时存在，则视为较旧的双目标安装，并合并到兼容的共享技能树中。

`openspec update` 也会遵循此归属。如果项目的 `.agents` 属于不绑定厂商的目标，而剩余 Codex 安装的依据仅是零散的提示词文件，更新会保留已有的 `agents` 技能树，而不将其重写为 Codex 语法，同时保留旧提示词文件。若要将共享技能树交由 Codex 管理，请显式运行 `openspec init --tools codex`。

## 非交互式设置

在 CI/CD 或脚本中设置时，请使用 `--tools`（也可以选择使用 `--profile`）：

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**可用工具 ID（`--tools`）**——`windsurf` 也可作为 `devin` 的别名使用：`amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`codeassistant`、`trae`、`zed`、`zcode`、`agents`

## 根据工作流选择安装内容

OpenSpec 会根据所选工作流安装相应产物：

- **Core 配置档案（默认）：** `propose`、`explore`、`apply`、`update`、`sync`、`archive`
- **自定义选择：** 可以从所有工作流 ID 中任选子集：`propose`、`explore`、`new`、`continue`、`apply`、`update`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

也就是说，技能/命令的数量取决于配置档案和交付模式，并非固定不变。

## 生成的技能名称

根据配置档案/工作流设置选择后，OpenSpec 会生成以下技能：

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

命令行为见[命令](/zh-CN/commands/)，`init`/`update` 选项见 [CLI](/zh-CN/cli/)。

## 相关内容

- [CLI 参考](/zh-CN/cli/)——终端命令
- [命令](/zh-CN/commands/)——斜杠命令和技能
- [快速入门](/zh-CN/getting-started/)——首次设置
