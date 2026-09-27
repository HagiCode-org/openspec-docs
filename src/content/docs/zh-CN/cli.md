---
title: "CLI 参考"
---

OpenSpec CLI（`openspec`）提供用于项目设置、验证、状态检查和管理的终端命令。这些命令与[命令](/zh-CN/commands/)中介绍的 AI 斜杠命令（例如 `/opsx:propose`）相辅相成。

## 概要

| 类别 | 命令 | 用途 |
|----------|----------|---------|
| **设置** | `init`, `update` | 在项目中初始化和更新 OpenSpec |
| **Stores（独立 OpenSpec 仓库）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理已注册的 store（独立 OpenSpec 仓库） |
| **健康状况** | `doctor` | 报告解析后根目录的关联健康状况 |
| **工作上下文** | `context` | 汇总工作集（根目录 + 引用的 stores） |
| **个人工作集** | `workset create`, `workset list`, `workset open`, `workset remove` | 在工具中保存并打开个人本地工作视图 |
| **浏览** | `list`, `view`, `show` | 浏览变更和规范 |
| **验证** | `validate` | 检查变更和规范中的问题 |
| **生命周期** | `archive` | 完成变更的最终处理 |
| **工作流** | `new change`, `status`, `instructions`, `templates`, `schemas` | 提供基于产物的工作流支持 |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建和管理自定义工作流 |
| **配置** | `config` | 查看和修改设置 |
| **实用工具** | `feedback`, `completion` | 提交反馈和集成 shell |

---

## 面向用户与代理的命令

大多数 CLI 命令面向终端中的**用户**。部分命令也可通过 JSON 输出供**代理或脚本使用**。

### 仅供用户使用的命令

这些命令具有交互性，专为终端使用设计：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表板 |
| `openspec workset open <name>` | 打开已保存的工作集（编辑器窗口或终端代理会话） |
| `openspec config edit` | 在编辑器中打开配置 |
| `openspec feedback` | 通过 GitHub 提交反馈 |
| `openspec completion install` | 安装 shell 补全 |

### 兼容代理的命令

这些命令支持 `--json` 输出，供 AI 代理和脚本以编程方式使用：

| 命令 | 用户用法 | 代理用法 |
|---------|-----------|-----------|
| `openspec list` | 浏览变更/规范 | 使用 `--json` 获取结构化数据 |
| `openspec show <item>` | 阅读内容 | 使用 `--json` 进行解析 |
| `openspec validate` | 检查问题 | 使用 `--all --json` 批量验证 |
| `openspec status` | 查看产物进度 | 使用 `--json` 获取结构化状态 |
| `openspec instructions` | 获取后续步骤 | 使用 `--json` 获取代理指令 |
| `openspec templates` | 查找模板路径 | 使用 `--json` 解析路径 |
| `openspec schemas` | 列出可用 schema | 使用 `--json` 发现 schema；使用 `--store <id>` 选择已注册的根目录 |
| `openspec store setup <id>` | 创建并注册本地 store | 提供显式输入并使用 `--json` 获取结构化设置结果 |
| `openspec store register <path>` | 注册现有 store | 使用 `--json` 获取结构化注册结果 |
| `openspec store unregister <id>` | 清除本地 store 注册信息 | 使用 `--json` 获取结构化清理结果 |
| `openspec store remove <id>` | 删除已注册的本地 store 文件夹 | 使用 `--yes --json` 非交互式删除 |
| `openspec store list` | 浏览已注册的 store | 使用 `--json` 获取结构化注册信息 |
| `openspec store doctor` | 检查本地 store 设置 | 使用 `--json` 获取结构化诊断信息 |
| `openspec new change <id>` | 创建仓库本地的变更脚手架 | 使用 `--json`；还可用 `--store <id>` 将已注册 store 作为 OpenSpec 根目录 |
| `openspec workset create [name]` | 组合个人工作视图 | 使用 `--member <path> --json` 非交互式组合 |
| `openspec workset list` | 浏览已保存的工作集 | 使用 `--json` 获取结构化视图 |
| `openspec workset remove <name>` | 删除已保存的视图 | 使用 `--yes --json` 非交互式删除 |

---

## 全局选项

以下选项适用于所有命令：

| 选项 | 说明 |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令帮助 |

---

## 设置命令

### `openspec init`

在项目中初始化 OpenSpec。创建目录结构并配置 AI 工具集成。

默认行为使用全局配置：配置 `core`、交付模式 `both`，工作流为 `propose, explore, apply, update, sync, archive`。

```
openspec init [path] [options]
```

使用 `--language <language>` 可向新项目的 `openspec/config.yaml` 添加语言指令。
对于现有项目，请编辑配置中的 `context` 字段，以免 OpenSpec 覆盖项目专属指南。

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认为当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--tools <list>` | 以非交互方式配置 AI 工具。可使用 `all`、`none` 或逗号分隔的列表 |
| `--language <language>` | 创建新配置时，指定产物使用的语言 |
| `--force` | 不提示，自动清理旧文件 |
| `--profile <profile>` | 覆盖本次初始化使用的全局配置（`core` 或 `custom`） |
| `--no-animation` | 显示静态欢迎界面，不播放动画 |
| `--copilot-cloud` | 不提示，设置 GitHub Copilot [云编码代理文件](/zh-CN/supported-tools/#github-copilot-云端编码智能体) |
| `--no-copilot-cloud` | 不提示，跳过 GitHub Copilot 云编码代理文件 |

`--profile custom` 使用全局配置中当前选定的工作流（`openspec config profile`）。

设置 `OPENSPEC_NO_ANIMATION` 环境变量（任何值，包括空值）、将 `NO_COLOR` 设为非空值，或启用操作系统的减少动态效果偏好（macOS“减少动态效果”、GNOME 禁用动画）时，也会跳过欢迎动画。

**支持的工具 ID（`--tools`）**——`windsurf` 也可作为 `devin` 的别名使用：`amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`codeassistant`、`qoder`、`qwen`、`rovodev`、`roocode`、`trae`、`zed`、`zcode`、`agents`

> 此列表与 `src/core/config.ts` 中的 `AI_TOOLS` 一致。各工具的 skill 和命令路径请参阅[支持的工具](/zh-CN/supported-tools/)。

**示例：**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**创建的内容：**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

升级 CLI 后更新 OpenSpec 指令文件。根据当前全局配置、所选工作流和交付模式重新生成 AI 工具配置文件。

```
openspec update [path] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认为当前目录） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 即使文件已是最新，也强制更新 |

**示例：**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

请先升级软件包。指令文件由已安装的 CLI 生成，因此如果安装版本过旧，运行 `openspec update` 会报告所有内容均为最新，却不会添加较新版本提供的工作流。

为明确提示这一点，`openspec update` 会查询 npm registry，检查是否已发布更新的 CLI。如果当前版本较旧，它会提供升级选项：

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

回答 yes 后，它会运行 `npm install -g @fission-ai/openspec@latest`，再用新版 CLI 重新执行更新，因此新工作流会在同一命令中写入。它会询问已安装二进制文件的版本来确认升级，而不是只相信 npm 的退出码；如果 `PATH` 中更靠前的另一个安装版本仍在响应，它会如实告知，而不会谎称升级成功。回答 no 后，它会打印升级命令，并使用当前 CLI 执行更新。按 Ctrl-C 可停止命令。

只有在交互式终端中，且 OpenSpec 是通过 npm 安装时，才会显示此提示——这是 `npm install -g` 能够实际修复的唯一情况。其他安装方式则会显示相应的升级命令：

| OpenSpec 的安装方式 | 显示内容 |
|---------------------------|--------------|
| 全局 npm 安装 | 在交互式终端中显示提示并代为升级；如果输出被重定向，则改为打印升级命令 |
| 全局 pnpm、bun、yarn 或 volta 安装 | 显示对应包管理器的命令：`pnpm add -g …@latest`、`bun add -g …@latest`、`yarn global add …@latest` 或 `volta install …@latest` |
| 作为项目依赖安装 | 提示更新该依赖，因为锁文件由项目的包管理器管理 |
| `npx` / `dlx` 缓存 | 显示 `npx @fission-ai/openspec@latest update`——该命令本身就是更新操作，无需第二步 |
| Git 克隆 | 不显示内容——使用的版本由当前分支决定 |

无论何时打印信息，都会显示当前 CLI 的加载目录。如果你已经升级，但 `PATH` 中仍优先找到旧的 shim，可据此检查。

如果 npm 导出了 `npm_config_registry`，检查会使用其中的 registry；否则使用 `https://registry.npmjs.org`。它不会读取 `.npmrc`：允许文件内容决定出站请求的目标并不安全，而且项目的 `.npmrc` 会随仓库一同分发。使用私有镜像时，请导出 `npm_config_registry`；也可以设置 `OPENSPEC_NO_UPDATE_CHECK` 完全跳过检查。当 `CI` 被设为任何明确的非关闭值（`false`、`0`、`no`、`off` 或空值除外）、`NODE_ENV=test`，或设置了 `OPENSPEC_NO_UPDATE_CHECK`（任何值）、`DO_NOT_TRACK=1`、`OPENSPEC_TELEMETRY=0` 时，检查会跳过。检查在更新前运行，最多延迟 1.5 秒；超过时限后即会放弃，即使网络悄悄丢包也一样，并且在 registry 无法访问时不会输出错误信息。

**“已是最新”的判断方式：**skill 文件会记录生成它们的版本，因此 OpenSpec 会将该版本与已安装的 CLI 进行比较。命令文件没有版本标记，所以对于只提供命令、不提供 skills 的工具（交付模式为 `commands`），OpenSpec 会将文件内容与当前将要生成的内容进行比较——对这些文件的手动编辑会被视为偏差并覆盖。交付模式为 `skills` 或 `both` 时，只检查记录的版本；因此，只要版本仍匹配，手动修改过的文件就会保留。使用 `--force` 可重新写入。无论哪种模式，生成文件都由 OpenSpec 管理——请将自定义指令保存在其他位置。

---

## Stores（独立 OpenSpec 仓库）

> **Beta。** Store 及其相关功能（引用、工作上下文、工作集）都是新功能；命令名称、标志、文件格式和 JSON 输出可能在不同版本间发生变化。以问题为导向的操作指南请参阅 [stores 指南](/zh-CN/stores-beta/user-guide/)。

Store 是你在此计算机上注册的独立 OpenSpec 仓库，例如规划仓库或合约仓库。注册后，只需传入 `--store <id>`，即可从任意位置使用常规命令（`list`、`show`、`status`、`validate`、`new change`、`archive` 等）在该 store 中操作。

### `openspec store setup`

创建并注册本地 store。在终端中不带参数运行时，OpenSpec 会引导用户完成设置。代理和脚本应传入明确的输入，并使用 `--json`。

```bash
openspec store setup [id] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--path <path>` | Store 所在文件夹（例如 `~/openspec/<id>`） |
| `--remote <url>` | 在新 store 的 `store.yaml` 中记录规范远端地址 |
| `--init-git` | 初始化 Git 仓库并创建初始提交（默认） |
| `--no-init-git` | 跳过所有 Git 操作：不初始化仓库，也不创建初始提交 |
| `--json` | 输出 JSON |

非交互运行（`--json`、脚本、代理）必须同时传入 store ID 和 `--path`。在交互式终端中，设置流程会询问存放位置，并提供一个位于用户可见、可自行管理位置的可编辑建议路径（例如 `~/openspec/<id>`）；绝不会默认使用 OpenSpec 管理的数据目录。

示例：

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

注册现有的本地 store 文件夹。在 stores beta 阶段，即使尚无任何变更、尚未应用规范或归档变更，也可以注册根目录；此时 `openspec/changes/`、`openspec/specs/` 和 `openspec/changes/archive/` 目录可能尚不存在，直到常规命令创建它们为止。
仅含配置且声明了 `store: <id>` 的仓库仍只是指向另一个 store 的指针；除非删除该指针，否则不会将其注册为 store 根目录。

```bash
openspec store register [path] [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--id <id>` | Store ID；默认采用 store 元数据或文件夹名称 |
| `--yes` | 确认在健康的 OpenSpec 根目录中创建 store 身份元数据 |
| `--json` | 输出 JSON |

### `openspec store unregister`

清除本地 store 注册信息，但不删除文件。

```bash
openspec store unregister <id> [--json]
```

当 store 已移动、克隆到其他位置，或不应再由此计算机上的 OpenSpec 显示时，请使用此命令。

### `openspec store remove`

清除本地 store 注册信息并删除其本地文件夹。

```bash
openspec store remove <id> [--yes] [--json]
```

在交互式终端中，`remove` 会在删除前显示确切的文件夹路径。
代理、脚本和 JSON 调用方必须传入 `--yes` 以确认删除。
如果文件夹不包含匹配的 store 元数据，OpenSpec 会拒绝删除。

### `openspec store list`

列出本地已注册的 store。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

检查本地 store 注册状态、元数据和 Git 是否存在。

```bash
openspec store doctor [id] [--json]
```

Doctor 仅用于诊断；它会报告根目录缺失、元数据不匹配和本地注册表状态无效等问题，但不会修改 store。

### 在项目中引用 Store

项目仓库可在 `openspec/config.yaml` 中声明其工作所依赖的 store：

```yaml
schema: spec-driven
references:
  - team-context
```

此后，该仓库中 `openspec instructions` 的输出（包括逐产物指令和 `apply` 指令，JSON 与人类可读模式均如此）都会附带每个被引用 store 的规范索引——包括规范 ID、从各规范 Purpose 部分提取的一行摘要，以及获取命令（`openspec show <spec-id> --type spec --store <id>`）。每次运行都会根据已注册的检出内容实时构建索引；规范正文绝不会复制到输出中。

引用只提供只读上下文，不会改变命令的操作位置：工作仍在仓库自身的根目录中进行，写入被引用的 store 仍须明确使用 `--store`。无法解析的引用（例如此计算机上尚未注册的 store）会在索引中降级为警告，并附上确切的修复方法；指令仍会正常生成。`openspec doctor` 会集中报告引用的健康状况。

### 记录 Store 的克隆来源

Store 可以在已提交的身份文件中记录其规范克隆来源，使新成员设置流程不会卡在“注册 store”这一步：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

远端地址会写入初始提交中的 `.openspec-store/store.yaml`，因此每个克隆都自带此信息。对于已有 store，可手动编辑 `store.yaml` 并提交。`store doctor` 会显示已记录的远端地址（以及当前检出的 Git origin）；setup/register 的共享说明会列出该地址；register 还会将当前检出的 origin 记录到本机注册表中。

引用声明也可以携带克隆来源，这样尚未拥有该 store 的团队成员就能直接复制并执行完整的修复命令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

记录远端地址并不意味着同步：OpenSpec 不会自行执行 clone、pull 或 push。

### 声明默认 Store

对于规划内容完全外置的仓库（没有本地 `openspec/specs/` 或 `openspec/changes/`），可只声明一次默认 store，而不必为每条命令都传入 `--store`：

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

随后，常规命令会自动解析到声明的 store；根目录横幅和 JSON `root` 块会报告 `source: "declared"` 以及 store ID，打印的提示仍会包含 `--store <id>`。此声明是回退选项，而不是覆盖项：显式指定的 `--store` 始终优先；如果目录中存在实际规划文件夹，则忽略该指针（并发出警告）。若要将指针仓库转换为本地 OpenSpec 根目录，请删除 `store:` 行并运行 `openspec init`——只要声明仍存在，init 就会拒绝创建脚手架。

机器级设置可一次应用于所有仓库：`openspec config set defaultStore <id>`（参阅“配置”）。只有在 `--store`、本地根目录和项目指针都无法解析后，才会使用此设置；届时根目录横幅和 JSON `root` 块会报告 `source: "global_default"`。

## Doctor（关联健康状况）

通过一个只读命令集中回答一个问题：OpenSpec 根目录是否健康，其引用的 store 是否可在此计算机上使用？

```bash
openspec doctor [--store <id>] [--json]
```

报告会分别列出根目录健康状况、store 元数据健康状况（包括已记录远端与当前检出的 origin 不一致时的提示，以及 store 检出内容落后于上次获取的上游跟踪引用时的提示），以及引用健康状况（与 instructions 中显示相同的诊断，并为无法解析的引用提供克隆修复命令）。无论健康问题严重程度如何，退出码均为 0——代理应读取 `status` 数组；只有命令本身失败（例如没有根目录或 store 未知）才会以退出码 1 结束。Doctor 不会克隆、同步或修复内容。如需获取汇总后的工作集本身而非其健康状况，请使用 `openspec context`。

## 工作上下文（汇总集合）

通过 OpenSpec 声明与当前工作相关的所有内容会组成一个工作集：OpenSpec 根目录及其引用的 store。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 摘要可供代理使用（每个可用的被引用 store 都包含获取步骤；无法解析的成员会附带与 instructions、doctor 相同的修复说明）。`--code-workspace` 还会写入 VS Code workspace 文件，其中包含根目录和可用的被引用 store（`ref:<id>` 文件夹）——这是此命令唯一执行的写入操作；如果目标文件已存在且未指定 `--force`，命令会拒绝覆盖。对于不可用的成员，命令会报告其状态，不会猜测路径。

“工作上下文”指汇总后的集合；`openspec/config.yaml` 中的 `context:` 字段则是注入指令的项目背景，两者含义不同。`openspec doctor` 用于判断集合是否健康；`openspec context` 用于查看集合包含哪些内容。

## 个人工作集

> **Beta。** 工作集属于新的 beta 功能；命令、标志和文件格式可能在不同版本间发生变化。操作指南请参阅 [stores 指南](/zh-CN/stores-beta/user-guide/#工作集重新打开一起工作的文件夹)。

工作集是你常用文件夹的个人命名视图——包含规划根目录以及你选择的其他目录——保存在本机，并可在工具中按名称重新打开。它完全保存在本地：不会提交、不会共享，也不会根据声明自动生成；删除工作集也不会触碰其成员文件夹。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 会运行简短的引导流程（也可通过 `--member` 标志以非交互方式创建；第一个成员是主目录，会话会从该目录启动）。`open` 会启动所选工具：编辑器（VS Code、Cursor）会打开包含所有成员的窗口，然后返回；CLI 代理（Claude Code、codex）会接管当前终端，启动一个附加所有成员且未预填提示词的会话，直到你退出。打开时缺失的成员文件夹会跳过并显示说明，其余成员仍会打开。每次打开时都可通过 `--tool` 覆盖已保存的工具偏好。

支持新工具只需配置，无需编写代码。每个工具都使用两种启动方式之一：`workspace-file`（通过生成的 `.code-workspace` 启动）或 `attach-dirs`（每个成员使用一个附加目录标志）。全局 `config.json` 中的 `openers` 键（使用 `openspec config edit` 打开）可添加工具，或按字段调整内置配置：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集状态都存放在全局数据目录下的 `worksets/` 文件夹中（包括已保存的视图和生成的 `<name>.code-workspace` 文件；每次打开时都会重新生成）。删除该文件夹即可清除所有痕迹。

---

## 浏览命令

### `openspec list`

列出项目中的变更或规范。

```
openspec list [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--specs` | 列出规范而非变更 |
| `--changes` | 列出变更（默认） |
| `--sort <order>` | 按 `recent`（默认）或 `name` 排序 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**输出（文本）：**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

显示交互式仪表板，用于浏览规范和变更。

```
openspec view
```

打开基于终端的界面，以浏览项目规范和变更。

---

### `openspec show`

显示变更或规范的详细信息。

```
openspec show [item-name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | 变更或规范名称（省略时会提示输入） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（名称明确时会自动检测） |
| `--json` | 以 JSON 格式输出 |
| `--no-interactive` | 禁用提示 |

**变更专用选项：**

| 选项 | 说明 |
|--------|-------------|
| `--deltas-only` | 只显示增量规范（JSON 模式） |

**规范专用选项：**

| 选项 | 说明 |
|--------|-------------|
| `--requirements` | 只显示需求，不包含场景（JSON 模式） |
| `--no-scenarios` | 不包含场景内容（JSON 模式） |
| `-r, --requirement <id>` | 按从 1 开始的索引显示指定需求（JSON 模式） |

**示例：**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## 验证命令

### `openspec validate`

验证变更和规范的结构问题，并将变更中 MODIFIED 需求与其将要替换的主规范进行比较。

```
openspec validate [item-name] [options]
```

如果变更没有任何规范增量，验证就会失败，除非其 `.openspec.yaml` 声明了 `skip_specs: true`（适用于纯重构、工具或文档工作——参阅[配方 5](/zh-CN/examples/#配方-5不改变行为的重构)）。

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的指定项目（省略时会提示输入） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 验证所有变更和规范 |
| `--changes` | 验证所有变更 |
| `--specs` | 验证所有规范 |
| `--archived` | 验证已归档变更的所有任务是否均已完成（适用于 pre-commit lint） |
| `--type <type>` | 名称有歧义时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格验证模式 |
| `--json` | 以 JSON 格式输出 |
| `--concurrency <n>` | 最大并行验证数（默认为 6，也可通过 `OPENSPEC_CONCURRENCY` 环境变量设置） |
| `--no-interactive` | 禁用提示 |

`--archived` 是独立的验证范围：它不会验证规范增量（归档时已应用），而是检查 `changes/archive/` 下每个变更的 `tasks.md` 复选框是否全部勾选；只要存在未勾选项，就会以非零状态码退出。此选项可发现归档时仍有未完成工作的变更，适合用于 pre-commit hook。

**示例：**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**输出（文本）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**输出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 生命周期命令

### `openspec archive`

归档已完成的变更，并将增量规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（省略时会提示输入；如果无法响应提示，则必须提供） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示。当无法响应提示时必须使用——例如由 AI 代理、CI 任务或标准输入已关闭的运行调用 |
| `--skip-specs` | 本次归档跳过规范更新。永久没有规范增量的变更应在 `.openspec.yaml` 中声明 `skip_specs: true`，而非每次使用此标志——此时无需标志即可归档 |
| `--no-validate` | 跳过验证（需要确认）。同时禁用 capability 退役——没有验证器的结论，就不会退役任何 capability |

**示例：**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**退役 capability：**在变更元数据中添加退役标记：

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

然后按常规方式归档变更：

```bash
openspec archive retire-legacy --yes
```

当变更移除某项 capability 的最后一个需求时，OpenSpec 会删除其有效的 `spec.md`。同一变更中其他 capability 的增量仍会更新各自的主规范。如果没有此标记，归档会在修改任何文件之前停止，并提示你添加该标记。

**执行内容：**

1. 验证变更（除非指定 `--no-validate`）
2. 提示确认（除非指定 `--yes`）
3. 在修改任何主规范前先占用归档目标位置
4. 验证活动增量规范并将其合并到 `openspec/specs/`——如果变更移除了某项 capability 的最后一个需求，则该 capability 会退役且其规范文件会被删除；但只有当变更的 `.openspec.yaml` 在 `schema:` 旁声明 `retire_capabilities: true` 时才会如此
5. 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
6. 如果规范修改或最终移动在完整归档安全写入前失败，则恢复规范，并将变更保留或移回活动路径
7. 如果已验证的备用副本创建成功，但暂存源清理失败，则保留完整归档和已提交的规范状态，供后续恢复

**没有终端时：**AI 代理、CI 任务或任何标准输入已关闭的运行都无法响应第 2 步，因此归档会在触碰任何内容前停止，以状态码 1 退出，并指出要重新运行的命令——`openspec archive <name> --yes`，同时保留你传入的其他标志。预先传入 `--yes`（以及变更名称）即可避免这次往返。

---

## 工作流命令

这些命令支持基于产物的 OPSX 工作流，既可供用户检查进度，也可供代理确定后续步骤。

### `openspec new change`

在已解析的 OpenSpec 根目录中创建变更目录以及可选的已检入元数据。

```bash
openspec new change <name> [options]
```

变更名称必须使用小写 kebab-case：由小写字母、数字和单个连字符组成。名称不能包含空格、下划线、大写字母、连续连字符，也不能以连字符开头或结尾。名称允许以数字开头，因此可以给变更添加排序或分级前缀，例如 `100-add-feature` 或 `00001-add-auth`。

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--description <text>` | 要添加到 `README.md` 的说明 |
| `--goal <text>` | 与变更一同存储的可选目标元数据 |
| `--schema <name>` | 要使用的工作流 schema |
| `--store <id>` | 用作 OpenSpec 根目录的 store ID（store 是你已注册的独立 OpenSpec 仓库） |
| `--json` | 输出 JSON |

示例：

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

显示某项变更的产物完成状态。

```
openspec status [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--change <id>` | 变更名称（省略时会提示输入） |
| `--schema <name>` | 覆盖 schema（从变更配置自动检测） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**输出（文本）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

声明了 `skip_specs: true` 的变更会将其规范阶段显示为 `[~] specs (skipped: change declares skip_specs)`，且不计入进度总数。

**输出（JSON）：**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` 表示所有未跳过的规划产物是否都已存在；跳过的产物视为已满足，无需实际创建。它不表示实现任务是否完成。`isComplete` 作为兼容别名保留，其值与 `isPlanningComplete` 相同。

产物按依赖顺序列出——依赖项始终出现在需要它的产物之前。若多个产物同时变为可用（例如 spec-driven 的 `specs` 和 `design` 都只依赖 `proposal`），则按 schema 中声明的顺序排列，而非按字母顺序排列。因此，第一个 `ready` 条目就是下一步要编写的产物。

---

### `openspec instructions`

获取用于创建产物或执行任务的扩展指令。AI 代理可据此了解接下来应创建什么。

```
openspec instructions [artifact] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `artifact` | 否 | 产物 ID，或工作流输入接口：`apply` 或 `archive` |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--change <id>` | 变更名称（非交互模式下必填） |
| `--schema <name>` | 覆盖 schema |
| `--json` | 以 JSON 格式输出 |

**特殊情况：**使用 `apply` 获取任务实现指令。使用 `archive` 可为有效变更获取当前只读归档输入（`context` 和 `operationGuidance`）；它不会归档或修改任何内容。

**示例：**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# Get current archive operation inputs without archiving
openspec instructions archive --change add-dark-mode --json

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**输出包含：**

- 产物模板内容
- 配置中的项目上下文
- 依赖产物中的内容
- 配置中的产物级规则
- `apply`/`archive` 当前项目上下文及匹配的操作指南

每次调用都会从已解析的仓库或选定的 store 读取操作输入。项目上下文是提示词层面的必需输入：代理会读取它，并应用相关项目事实、约定和限制。操作指南则是可选的补充建议：代理会考虑每一项，只遵循适用且与内置工作流兼容的内容。这两个字段都与明确的用户选择、CLI 控制的状态、内置指令和产物规则彼此独立。若上下文冲突，会报告冲突；若指南冲突或不适用，则不会遵循，并会说明原因。这些是针对生成式代理的行为约定，并非 CLI 可强制执行的检查。`instructions archive` 只返回选定变更、可选输入和根目录元数据，不包含静态归档工作流。

通过 `skip_specs: true` 跳过的产物只会产生警告（JSON 会增加 `skipped`/`warning` 字段）——不得创建该产物。

---

### `openspec templates`

显示某个 schema 中所有产物解析后的模板路径。

```
openspec templates [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--schema <name>` | 要检查的 schema（默认为 `spec-driven`） |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**输出（文本）：**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流 schema、说明及其产物流程。

```
openspec schemas [options]
```

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--json` | 以 JSON 格式输出 |
| `--store <id>` | 使用已注册的 store 作为 OpenSpec 根目录 |

**示例：**

```bash
openspec schemas
```

**输出：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema 命令

用于创建和管理自定义工作流 schema 的命令。

### `openspec schema init`

创建新的项目本地 schema。

```
openspec schema init <name> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 是 | Schema 名称（kebab-case） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--description <text>` | Schema 说明 |
| `--artifacts <list>` | 逗号分隔的产物 ID 列表（默认为 `proposal,specs,design,tasks`） |
| `--default` | 设为项目默认 schema |
| `--no-default` | 不提示是否设为默认值 |
| `--force` | 覆盖现有 schema |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**创建的内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

将现有 schema 复制到项目中以便定制。

```
openspec schema fork <source> [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `source` | 是 | 要复制的 schema |
| `name` | 否 | 新 schema 名称（默认为 `<source>-custom`） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--force` | 覆盖现有目标 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证 schema 的结构和模板。

```
openspec schema validate [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | 要验证的 schema（省略时验证全部） |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--verbose` | 显示详细验证步骤 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

显示 schema 的解析来源（可用于调试优先级）。

```
openspec schema which [name] [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `name` | 否 | Schema 名称 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--all` | 列出所有 schema 及其来源 |
| `--json` | 以 JSON 格式输出 |

**示例：**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**输出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema 优先级：**

1. 项目：`openspec/schemas/<name>/`
2. 用户：`~/.local/share/openspec/schemas/<name>/`
3. 软件包：内置 schema

---

## 配置命令

### `openspec config`

查看和修改 OpenSpec 全局配置。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `path` | 显示配置文件位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取指定值 |
| `set <key> <value>` | 设置值 |
| `unset <key>` | 删除键 |
| `reset` | 重置为默认值 |
| `edit` | 使用 `$EDITOR` 打开 |
| `profile [preset]` | 通过交互方式或预设配置工作流配置 |

**示例：**

```bash
# Show config file path
openspec config path

# List all settings
openspec config list

# Get a specific value
openspec config get telemetry.enabled

# Set a value (disable anonymous usage telemetry)
openspec config set telemetry.enabled false

# Set a string value explicitly
openspec config set user.name "My Name" --string

# Remove a custom setting
openspec config unset user.name

# Set a machine-level default store (fallback root when no --store,
# local root, or project store: pointer resolves)
openspec config set defaultStore team-plans

# Reset all configuration
openspec config reset --all --yes

# Edit config in your editor
openspec config edit

# Configure profile with action-based wizard
openspec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
openspec config profile core
```

**退出遥测：**未设置时，`telemetry.enabled` 默认为开启（选择退出模式）。
将其设为 `false` 可禁用匿名使用统计和 `openspec update` 版本检查。
环境变量优先于配置：无论配置值如何，`OPENSPEC_TELEMETRY=0`、`DO_NOT_TRACK=1`，
以及真值 `CI`（例如 `true`/`1`/`yes`）都会禁用遥测。

`openspec config profile` 会先显示当前状态摘要，然后让你选择：
- 更改交付模式和工作流
- 仅更改交付模式
- 仅更改工作流
- 保持当前设置（退出）

如果保留当前设置，不会写入更改，也不会显示更新提示。
如果配置没有变化，但当前项目文件与全局配置的 profile/交付模式不同步，OpenSpec 会显示警告并建议运行 `openspec update`。
按 `Ctrl+C` 也会干净地取消流程（不显示堆栈跟踪），并以退出码 `130` 结束。
在工作流清单中，`[x]` 表示该工作流已在全局配置中选中。要将这些选择应用到项目文件，请运行 `openspec update`（或在项目内提示时选择 `Apply changes to this project now?`）。

**交互示例：**

```bash
# Delivery-only update
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## 实用工具命令

### `openspec feedback`

提交有关 OpenSpec 的反馈，并创建 GitHub issue。

```
openspec feedback <message> [options]
```

**参数：**

| 参数 | 必填 | 说明 |
|----------|----------|-------------|
| `message` | 是 | 反馈摘要；较长的文本会在 issue 标题中缩短，但会在正文中完整保留 |

**选项：**

| 选项 | 说明 |
|--------|-------------|
| `--body <text>` | 跟在摘要之后的补充详情 |

**要求：**必须安装并登录 GitHub CLI（`gh`）。

**示例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 shell 补全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 说明 |
|------------|-------------|
| `generate [shell]` | 将补全脚本输出到 stdout |
| `install [shell]` | 为 shell 安装补全 |
| `uninstall [shell]` | 删除已安装的补全 |

**支持的 shell：**`bash`、`zsh`、`fish`、`powershell`

**示例：**

```bash
# Install completions (auto-detects shell)
openspec completion install

# Install for specific shell
openspec completion install zsh

# Generate script for manual installation (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

**Windows（PowerShell）：**为当前 PowerShell 主机安装补全：

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` 用于告知 OpenSpec 在本会话中配置哪个 profile。
安装程序会创建缺失的 profile 目录，并添加一个用于加载
`OpenSpecCompletion.ps1` 的受管理代码块。重新加载 profile 后，补全会立即生效。

要从当前主机卸载，请运行：

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

卸载后请重启 PowerShell，以清除当前会话中的补全。

补全需要选择启用。首次在交互式终端运行命令时，CLI 会在 stderr 上提示一次，之后不再提示；如果已安装补全，也不会显示提示。设置 `OPENSPEC_NO_COMPLETIONS=1` 可完全禁用此提示。

---

## 退出码

| 代码 | 含义 |
|------|---------|
| `0` | 成功 |
| `1` | 错误（验证失败、文件缺失等） |

---

## 环境变量

| 变量 | 说明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 设为 `0` 可禁用遥测和 `openspec update` 版本检查（覆盖全局配置中的 `telemetry.enabled`） |
| `DO_NOT_TRACK` | 设为 `1` 可禁用遥测和 `openspec update` 版本检查（标准 DNT 信号；覆盖配置） |
| `OPENSPEC_CONCURRENCY` | 批量验证的默认并行度（默认值：6） |
| `EDITOR` 或 `VISUAL` | `openspec config edit` 使用的编辑器 |
| `NO_COLOR` | 设置后禁用彩色输出 |
| `OPENSPEC_NO_ANIMATION` | 设置后禁用 `openspec init` 欢迎动画 |
| `OPENSPEC_NO_COMPLETIONS` | 设为 `1` 可禁止一次性的 shell 补全提示 |
| `OPENSPEC_NO_UPDATE_CHECK` | 设置后禁用 `openspec update` 对新版 CLI 的检查（任何值，包括空值）。当 `CI` 已设置（除非值为 `false`/`0`/`no`/`off`）或 `NODE_ENV=test` 时也会跳过检查 |
| `npm_config_registry` | `openspec update` 版本检查所查询的 registry。必须是 `http(s)` URL，否则回退至 `https://registry.npmjs.org`。不会读取 `.npmrc` 文件 |

---

## 相关文档

- [命令](/zh-CN/commands/)——AI 斜杠命令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流](/zh-CN/workflows/)——常见模式以及各命令的适用时机
- [定制](/zh-CN/customization/)——创建自定义 schema 和模板
- [快速入门](/zh-CN/getting-started/)——首次设置指南
