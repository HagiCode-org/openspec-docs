---
title: "迁移到 OPSX"
---

本指南帮助你从旧版 OpenSpec 工作流迁移到 OPSX。迁移过程旨在平稳完成——现有工作会得到保留，新系统则提供更大的灵活性。

## 有哪些变化？

OPSX 以灵活、基于操作的方式取代了旧版受阶段限制的工作流。主要变化如下：

| 方面 | 旧版 | OPSX |
|--------|--------|------|
| **命令** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 默认：`/opsx:propose`、`/opsx:explore`、`/opsx:apply`、`/opsx:update`、`/opsx:sync`、`/opsx:archive`（可选扩展工作流命令） |
| **工作流** | 一次创建全部产物 | 可以逐步创建，也可以一次创建——由你决定 |
| **返回修改** | 阶段关卡让返回很不方便 | 随时自然更新任何产物 |
| **自定义** | 固定结构 | 由模式驱动，可充分修改 |
| **配置** | 带标记的 `CLAUDE.md` + `project.md` | 使用 `openspec/config.yaml` 中的清晰配置 |

**理念上的变化：** 工作并非线性的。OPSX 不再假装它是线性的。

---

## 开始之前

### 现有工作会得到保护

迁移过程以保留现有内容为设计目标：

- **`openspec/changes/` 中的活动变更**——完整保留，可以继续使用 OPSX 命令处理。
- **已归档的变更**——不会改动，历史记录保持完整。
- **`openspec/specs/` 中的主规格说明**——不会改动，它们仍是唯一真实依据。
- **`CLAUDE.md`、`AGENTS.md` 等文件中的自有内容**——会予以保留。只会移除 OpenSpec 标记块，你编写的其他内容都会保留。

### 将被移除的内容

只会移除即将被替代、由 OpenSpec 管理的文件：

| 内容 | 原因 |
|------|-----|
| 旧版斜杠命令目录/文件 | 由新的技能系统取代 |
| `openspec/AGENTS.md` | 已过时的工作流触发文件 |
| `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记 | 不再需要 |

**各工具的旧版命令位置**（以下只是示例，实际位置可能不同）：

- Claude Code：`.claude/commands/openspec/`
- Cursor：`.cursor/commands/openspec-*.md`
- Devin Desktop，原 Windsurf：`.windsurf/workflows/openspec-*.md`
- Cline：`.clinerules/workflows/openspec-*.md`
- Roo：`.roo/commands/openspec-*.md`
- GitHub Copilot：`.github/prompts/openspec-*.prompt.md`（仅适用于 IDE 扩展；Copilot CLI 不支持）
- Codex：OpenSpec 现在使用规范的 `.agents/skills/openspec-*` 路径。只有在替代文件已存在后，才会协调旧版 `.codex/skills` 路径下由 OpenSpec 管理的 `SKILL.md` 文件；自定义文件和不一致的副本会保留。如果未标记的 `.agents` 技能树中已有 OpenSpec 技能，OpenSpec 会保留现有的 Codex (`$openspec-*`) 或通用 (`/openspec-*`) 调用形式，而不会根据旧目录猜测。运行 `openspec init` 时显式选择 `codex` 可切换所有权。清理旧版提示词时，也只会处理 OpenSpec 允许列表中位于 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 的文件名。
- 以及其他工具（Augment、Continue、Amazon Q 等）

迁移会检测你已配置的工具，并清理它们的旧版文件。

移除列表可能看起来很长，但这些文件原本都是由 OpenSpec 创建的。不会删除你自己的内容。

### 需要你处理的内容

有一个文件需要手动迁移：

**`openspec/project.md`**——由于此文件可能包含你编写的项目上下文，因此不会自动删除。你需要：

1. 检查文件内容。
2. 将有用的上下文移至 `openspec/config.yaml`（参阅下方说明）。
3. 准备好后删除该文件。

**为什么要做此更改：**

旧版 `project.md` 是被动文件——智能体可能会阅读，也可能不会；即使读了，也可能忘记其中内容。我们发现这种做法的可靠性参差不齐。

新的 `config.yaml` 上下文会**主动注入每个 OpenSpec 规划请求**。这意味着 AI 创建产物时始终能获得项目约定、技术栈和规则，从而提高可靠性。

**需要权衡的地方：**

由于上下文会注入每个请求，因此应尽量简洁。请聚焦于真正重要的内容：

- 技术栈和关键约定
- AI 需要知道、但不容易推断出的限制
- 过去经常被忽略的规则

不必追求一次做到完美。我们仍在摸索最佳做法，并会在尝试过程中持续改进上下文注入机制。

---

## 执行迁移

`openspec init` 和 `openspec update` 都会检测旧版文件，并引导你执行相同的清理流程。根据实际情况任选其一：

- 新安装默认使用 `core` 配置档案（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）。
- 迁移现有安装时，如果需要，会通过写入 `custom` 配置档案来保留你之前安装的工作流。

### 使用 `openspec init`

如果你要添加新工具，或重新配置已设置的工具，请运行：

```bash
openspec init
```

`init` 命令会检测旧版文件，并引导你完成清理：

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**选择是之后会发生什么：**

1. 移除旧版斜杠命令目录。
2. 移除 `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记（自有内容会保留）。
3. 删除 `openspec/AGENTS.md`。
4. 在 `.claude/skills/` 中安装新技能。
5. 创建包含默认模式的 `openspec/config.yaml`。

### 使用 `openspec update`

如果你只想迁移并将现有工具刷新到最新版本，请运行：

```bash
openspec update
```

`update` 也会检测并清理旧版产物，然后刷新生成的技能/命令，使其符合当前配置档案和交付设置。

### 非交互式/CI 环境

如需通过脚本迁移：

```bash
openspec init --force --tools claude
```

`--force` 会跳过提示，并自动确认清理操作。

这也包括清理全局 Codex 提示词目录中由 OpenSpec 管理的提示词文件。清理范围仅限 OpenSpec 允许列表中的旧版 Codex 提示词文件名；只有替代的 `.agents/skills/openspec-*` 技能已存在时才会删除，并保留其他所有文件。

---

## 将 project.md 迁移到 config.yaml

旧版 `openspec/project.md` 是用于存放项目上下文的自由格式 Markdown 文件。新的 `openspec/config.yaml` 采用结构化格式；更重要的是，内容会**注入每个规划请求**，确保 AI 工作时始终可以获取你的约定。

### 迁移前（project.md）

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 迁移后（config.yaml）

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 主要区别

| project.md | config.yaml |
|------------|-------------|
| 自由格式 Markdown | 结构化 YAML |
| 一整块文本 | 区分上下文和产物级规则 |
| 使用时机不明确 | 上下文出现在所有产物中；规则只出现在匹配的产物中 |
| 无法选择模式 | 通过显式的 `schema:` 字段设置默认工作流 |

### 保留什么，删除什么

迁移时要有选择地保留。问问自己：“AI 每次规划时都需要这些内容吗？”

**适合放入 `context:` 的内容**

- 技术栈（语言、框架、数据库）
- 关键架构模式（单体仓库、微服务等）
- 不容易推断出的限制（“因为……，我们不能使用库 X”）
- 经常被忽视的重要约定

**改放到 `rules:`**

- 仅针对特定产物的格式要求（“规格说明使用 Given/When/Then 格式”）
- 审查标准（“提案必须包含回滚方案”）
- 这些内容只会在相应产物的请求中出现，使其他请求保持精简

**完全删除**

- AI 模型已经知道的通用最佳实践
- 可以压缩概括的冗长说明
- 不影响当前工作的历史背景

### 迁移步骤

1. **创建 config.yaml**（如果 `init` 尚未创建）：
   ```yaml
   schema: spec-driven
   ```

2. **添加上下文**（尽量简洁——它会注入每个请求）：
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **添加产物级规则**（可选）：
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. 将有用内容迁移完成后，删除 `project.md`。

**不必过度纠结。** 从必要内容开始，再逐步完善。如果发现 AI 遗漏了重要信息，就补充进去；如果上下文显得臃肿，就删减内容。这是一份持续演进的文档。

### 需要帮助？使用以下提示词

如果你不确定如何提炼 `project.md`，可以向 AI 助手询问：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI 会帮你区分哪些内容必不可少，哪些可以删减。

---

## 新命令

命令是否可用取决于所选配置档案：

**默认（`core` 配置档案）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 创建变更，并在一步中生成规划产物 |
| `/opsx:explore` | 不受固定结构限制地梳理想法 |
| `/opsx:apply` | 实现 `tasks.md` 中的任务 |
| `/opsx:update` | 修改变更的规划产物并保持内容协调 |
| `/opsx:sync` | 将差异规格说明合并到主规格说明 |
| `/opsx:archive` | 完成变更并归档 |

**扩展工作流（自定义选择）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 创建新的变更脚手架 |
| `/opsx:continue` | 一次创建下一个产物 |
| `/opsx:ff` | 快进，一次性创建规划产物 |
| `/opsx:verify` | 验证实现是否符合规格说明 |
| `/opsx:bulk-archive` | 一次性归档多个变更 |
| `/opsx:onboard` | 端到端引导式入门工作流 |

运行 `openspec config profile` 启用扩展命令，然后运行 `openspec update`。

### 旧命令与 OPSX 命令对应关系

| 旧版 | OPSX 对应命令 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（默认）或 `/opsx:new` 后接 `/opsx:ff`（扩展模式） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新增功能

以下功能属于扩展工作流命令集。

**细粒度创建产物：**
```
/opsx:continue
```
每次根据依赖关系创建一个产物。需要逐步审查时使用此命令。

**探索模式：**
```
/opsx:explore
```
在确定变更方案之前，与思考伙伴一起梳理想法。

---

## 了解新架构

### 从阶段锁定到灵活流转

旧版工作流会强迫你线性推进：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX 使用操作，而非阶段：

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 依赖图

产物构成一个有向图。依赖关系是助力，而非关卡：

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

运行 `/opsx:continue` 时，它会检查哪些内容已经就绪，并提供下一个产物。多个已就绪的产物也可以按任意顺序创建。

### 技能与命令

旧系统使用各工具专用的命令文件：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用新兴的**技能**标准：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能可被多种 AI 编程工具识别，并能提供更丰富的元数据。

OPSX 中的 Codex 仅支持技能。OpenSpec 不再生成 Codex 自定义提示词文件；请改用生成的 `.agents/skills/openspec-*` 目录。

---

## 继续现有变更

你尚未完成的变更可与 OPSX 命令无缝配合。

**有旧版工作流中的活动变更？**

```
/opsx:apply add-my-feature
```

OPSX 会读取现有产物并从上次进度继续。

**想为现有变更添加更多产物？**

```
/opsx:continue add-my-feature
```

它会根据当前已有内容显示可以创建的产物。

**需要查看状态？**

```bash
openspec status --change add-my-feature
```

---

## 新配置系统

### config.yaml 结构

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 模式解析

OPSX 按以下顺序决定使用哪个模式：

1. **CLI 标志：** `--schema <name>`（优先级最高）
2. **变更元数据：** 变更目录中的 `.openspec.yaml`
3. **项目配置：** `openspec/config.yaml`
4. **默认值：** `spec-driven`

### 可用模式

| 模式 | 产物 | 适用场景 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多数项目 |

列出所有可用模式：

```bash
openspec schemas
```

### 自定义模式

创建自己的工作流：

```bash
openspec schema init my-workflow
```

也可以从现有模式派生：

```bash
openspec schema fork spec-driven my-workflow
```

详情见[自定义](/zh-CN/customization/)。

---

## 故障排除

### “Legacy files detected in non-interactive mode”

你正在 CI 或非交互环境中运行。使用：

```bash
openspec init --force
```

### 迁移后命令没有出现

重新启动 IDE。技能会在启动时检测。

### “Unknown artifact ID in rules”

检查 `rules:` 键是否与模式中的产物 ID 一致：

- **spec-driven：** `proposal`、`specs`、`design`、`tasks`

运行以下命令查看有效的产物 ID：

```bash
openspec schemas --json
```

### 配置没有生效

1. 确认文件位于 `openspec/config.yaml`（而非 `.yml`）。
2. 验证 YAML 语法。
3. 配置更改立即生效，无需重启。

### project.md 没有迁移

系统会有意保留 `project.md`，因为其中可能包含你的自定义内容。请手动检查，将有用部分移至 `config.yaml`，然后删除原文件。

### 想知道哪些文件会被清理？

运行 `init` 并在清理提示中选择拒绝，即可查看完整检测摘要，不会实际修改任何文件。

---

## 快速参考

### 迁移后的文件

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### 已移除的内容

- `.claude/commands/openspec/`——已由 `.claude/skills/` 取代
- `openspec/AGENTS.md`——已过时
- `openspec/project.md`——迁移到 `config.yaml` 后删除
- `CLAUDE.md`、`AGENTS.md` 等文件中的 OpenSpec 标记块

### 命令速查表

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## 获取帮助

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **文档：** 阅读 [docs/opsx.md](/zh-CN/opsx/) 获取完整 OPSX 参考
