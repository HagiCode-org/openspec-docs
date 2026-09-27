---
title: "自定义"
---

OpenSpec 提供三个层次的自定义方式：

| 层级 | 用途 | 适用对象 |
|-------|--------------|----------|
| **项目配置** | 设置默认值、注入上下文/规则 | 大多数团队 |
| **自定义模式** | 定义自己的工作流产物 | 流程独特的团队 |
| **全局覆盖** | 在所有项目间共享模式 | 高级用户 |

---

## 项目配置

`openspec/config.yaml` 是为团队自定义 OpenSpec 最简单的方式。你可以用它来：

- **设置默认模式**——无需在每条命令中都指定 `--schema`
- **注入项目上下文**——让 AI 了解你的技术栈、约定等
- **添加产物级规则**——为特定产物添加自定义规则
- **添加操作指引**——为 apply 和 archive 操作提供建议
- **记住集成选项**——例如选择是否启用 [GitHub Copilot 云端编码智能体](/zh-CN/supported-tools/)

### 快速设置

```bash
openspec init
```

该命令会以交互方式引导你创建配置文件。你也可以手动创建：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones

operations:
  apply:
    guidance:
      - Run focused tests before the full suite
  archive:
    guidance:
      - Keep the completion summary concise

# Set by `openspec init` when you choose (or decline) the GitHub Copilot
# cloud coding agent; controls whether `init`/`update` generate its files.
githubCopilot:
  cloudAgent: false
```

### 工作方式

**默认模式：**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**上下文和规则注入：**

生成任意产物时，你的上下文和规则都会注入 AI 提示词：

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Context** 会出现在所有产物中。
- **Rules** 只会出现在与之匹配的产物中。

**操作指引：**

`operations.apply.guidance` 和 `operations.archive.guidance` 是可选数组，用于提供智能体执行这些操作时的建议。它们与 `rules` 相互独立：操作指引不会限制产物内容，产物规则也不会被重新归类为操作指引。

Apply 和 archive 会在执行时获取这些输入：

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

这两个接口会将当前项目的 `context` 和匹配的 `operationGuidance` 作为独立的可选字段返回。每次调用都会从已解析的根目录读取最新快照。使用 `--store <id>` 时，变更、上下文和指引均来自该存储库，而非当前代码仓库。Archive 指令命令是只读的：它不会检查或合并差异规格说明、写入主规格说明、移动变更，也不会执行静态归档工作流。

项目上下文是提示词层面的必需输入。生成的工作流会读取它，并应用相关的项目事实、约定和限制。操作指引是可选的补充建议：工作流会考虑所有条目，并遵循适用且与内置工作流兼容的内容。

这两个字段都与 CLI 控制的状态、已解析路径、内置步骤、明确的用户选择以及产物规则相互独立。工作流会报告上下文冲突，同时保留具有控制效力的值。它不会遵循不适用或相互冲突的指引，并会说明原因。这两个字段都不是可强制执行的检查；除非用户另行要求，否则工作流不会将它们复制到实现文件、规格说明、变更产物或摘要中。

**归档和规格同步的输入安全性：**

Archive、bulk archive 和独立的 sync 会将 `openspec status --json` 输出中的 `artifactPaths.specs.existingOutputPaths` 作为唯一的差异规格说明来源。没有 `specs` 产物的模式，或实际输出路径列表为空的变更，都没有内容需要同步；不会通过其他产物推断差异规格说明。

语义合并写入主规格说明之前，工作流会读取当前的 `openspec instructions specs --change <name> --json` 输出。返回的 `specs` 规则仅约束此次合并所生成的主规格说明。单项 archive 会将该快照传给内部 sync；单独运行 sync 时会直接获取快照；bulk archive 则会在首次写入规格说明之前，先获取所有必需快照。如果 archive/specs 指令请求返回非零退出码或无效 JSON，这是查找失败，而非输入为空：工作流会在受影响的规格写入或变更移动之前停止（bulk archive 会在任何批量写入或移动之前停止）。

此配置不会改变归档执行阶段、用户提示、文件系统操作、语义合并的责任归属、直接的 `openspec archive` 命令，也不会改变产物 `rules` 的结构和输出。

### 模式解析顺序

OpenSpec 需要选择模式时，会按以下顺序检查：

1. CLI 标志：`--schema <name>`
2. 变更元数据（变更文件夹中的 `.openspec.yaml`）
3. 项目配置（`openspec/config.yaml`）
4. 默认模式（`spec-driven`）

---

## 自定义模式

当项目配置不够用时，可以创建完全自定义的模式来定义工作流。自定义模式位于项目的 `openspec/schemas/` 目录中，并与代码一同进行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### 从现有模式派生

最快的自定义方式是从内置模式派生：

```bash
openspec schema fork spec-driven my-workflow
```

该命令会将整个 `spec-driven` 模式复制到 `openspec/schemas/my-workflow/`，随后你可以自由编辑。

**生成的内容：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

接着编辑 `schema.yaml` 以更改工作流，或编辑模板以更改 AI 生成的内容。

### 从头创建模式

如果要完全从头定义工作流：

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 模式结构

模式会定义工作流中的产物以及它们之间的依赖关系：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**关键字段：**

| 字段 | 用途 |
|-------|---------|
| `id` | 唯一标识符，在命令和规则中使用 |
| `generates` | 输出文件名（支持 `specs/**/*.md` 等 glob 模式） |
| `template` | `templates/` 目录中的模板文件 |
| `instruction` | 创建该产物时提供给 AI 的指令 |
| `requires` | 依赖项——必须先存在的产物 |

按你希望的顺序列出产物。`requires` 决定哪些产物可以开始；当多个产物同时就绪时，`artifacts:` 列表的顺序决定先处理哪个。

### 模板

模板是用于指导 AI 的 Markdown 文件。创建相应产物时，模板会注入提示词中。

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

模板可以包含：

- 提示 AI 填写的章节标题
- 用于指导 AI 的 HTML 注释
- 展示预期结构的示例格式

### 验证模式

使用自定义模式之前，请先验证：

```bash
openspec schema validate my-workflow
```

此操作会检查：

- `schema.yaml` 语法是否正确
- 所有被引用的模板是否存在
- 是否存在循环依赖
- 产物 ID 是否有效

### 使用自定义模式

创建完成后，可以这样使用：

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### 调试模式解析

不确定实际使用了哪个模式？运行以下命令检查：

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

输出会显示模式来自项目、用户目录还是软件包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 还支持将用户级模式放在 `~/.local/share/openspec/schemas/` 下，以便在多个项目间共享；不过建议将模式放在项目级的 `openspec/schemas/` 中，因为它会与代码一起进行版本控制。

---

## 示例

### 快速迭代工作流

适用于快速迭代的最小工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 添加审查产物

从默认模式派生，并添加审查步骤：

```bash
openspec schema fork spec-driven with-review
```

然后编辑 `schema.yaml` 添加：

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## 社区模式

OpenSpec 也支持通过独立仓库分发、由社区维护的模式。这些模式提供具有明确观点的工作流，可将 OpenSpec 与其他工具或系统集成，类似于 [github/spec-kit 的社区扩展目录](https://github.com/github/spec-kit/tree/main/extensions)为 spec-kit 提供扩展的方式。

社区模式不会打包进 OpenSpec 核心，而是保存在各自仓库中，并按各自的节奏发布。要使用某个模式，请将其模式包复制到项目的 `openspec/schemas/<schema-name>/` 目录中（各仓库的 README 均包含安装说明）。

| 模式 | 维护者 | 仓库 | 说明 |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | 在实现前记录变更意图、可观察行为、技术设计和长期架构决策。新增与变更关联的 ADR 审查清单，并将符合条件的长期决策写为不可变、可被后续 ADR 取代的记录。 |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 将 OpenSpec 的产物治理与 [obra/superpowers](https://github.com/obra/superpowers) 执行技能（头脑风暴、编写计划、通过子智能体进行 TDD、代码审查、收尾）集成。添加以证据为先的 `retrospective` 产物，补足 Superpowers 原生流程未覆盖的环节。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | 以产品管理为先的工作流。先运行 [nanopm](https://github.com/nmrtn/nanopm) 规划流水线（审计 → 策略 → 路线图 → PRD），再进入实现阶段。将产品规划衔接到 OpenSpec 的规格驱动工程工作流。如果存在 `.nanopm/`，产物会读取其中内容：提案引用审计，设计引用策略，任务引用 PRD 分解。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 面向能力的端到端测试手册。每项能力都有不可变规格说明、不可变任务模板，并为每次执行生成带时间戳的运行记录。断言只关注可观察行为（HTTP 状态、响应正文、持久化状态，不检查日志片段）；每次运行都会记录 UTC 开始/结束时间、持续时间，以及估算的 LLM token 消耗量。 |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | 遵循 TDD 并包含对抗式审查步骤的规格驱动工作流。流程：`proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`。`review` 由具备全新上下文的只读审查者编写（如有条件则使用第二个模型），并输出 `VERDICT:` 行，指示智能体阻止 `test-plan`、`tasks` 和 `apply` 直至通过审查；OpenSpec 只检查产物是否存在，因此需通过自己的 CI 或钩子实施此关卡。`test-plan` 会将每个规格场景映射到具名测试，同时作为由 `verify` 审计的红/绿进度记录。 |

> 想贡献社区模式？请提交包含仓库链接的 issue，或提交 PR 在此表格中添加一行。

---

## 另请参阅

- [CLI 参考：模式命令](/zh-CN/cli/)——完整的命令文档
