---
title: "OPSX 工作流"
---

> 欢迎在 [Discord](https://discord.gg/YctCnvvshC) 提供反馈。

## 这是什么？

OPSX 现已成为 OpenSpec 的标准工作流。

它是一种**灵活、迭代式的工作流**，用于处理 OpenSpec 变更。不再受僵化阶段的限制——你可以随时执行各种操作。

## 为什么要有 OPSX

旧版 OpenSpec 工作流虽然可用，但**限制很多**：

- **指令是硬编码的**——埋在 TypeScript 代码中，无法修改
- **要么全做，要么不做**——一个大型命令一次创建所有内容，无法单独测试各个部分
- **结构固定**——每个人都使用同一种工作流，无法定制
- **黑盒**——AI 输出不理想时，无法调整提示词

**OPSX 打开了这扇门。**现在任何人都可以：

1. **试验指令**——编辑模板，观察 AI 的表现是否改善
2. **细粒度测试**——独立验证每个产物的指令
3. **定制工作流**——定义自己的产物及其依赖关系
4. **快速迭代**——修改模板后立即测试，无需重新构建

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**OPSX 面向所有人：**
- **团队**——创建符合实际工作方式的工作流
- **高级用户**——调整提示词，让 AI 更好地理解你的代码库
- **OpenSpec 贡献者**——无需发布新版本即可试验新方法

我们仍在共同探索什么方法最有效。OPSX 让大家能够一起学习。

## 用户体验

**线性工作流的问题：**
你先“处于规划阶段”，然后“进入实现阶段”，最后“完成”。但现实工作并非如此。实现过程中，你可能发现设计有误，需要更新规范，然后继续实现。线性阶段与实际工作方式相冲突。

**OPSX 的方式：**
- **操作，而非阶段**——创建、实现、更新、归档，任何操作都可以随时执行
- **依赖关系用于启用操作**——它们说明你可以做什么，而不是规定下一步必须做什么

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## 设置

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

这会在 `.claude/skills/`（或对应目录）中创建 skills，AI 编码助手可自动检测它们。

默认情况下，OpenSpec 使用 `core` 工作流配置（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）。如果需要扩展工作流命令（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），请使用 `openspec config profile` 配置，并通过 `openspec update` 应用。

设置期间，系统会提示你创建**项目配置**（`openspec/config.yaml`）。此配置可选，但建议创建。

## 项目配置

项目配置可设置默认值，并向所有产物注入项目专属上下文。

### 创建配置

配置会在运行 `openspec init` 时创建，也可以手动创建：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### 配置字段

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `schema` | string | 新建变更时使用的默认 schema（例如 `spec-driven`） |
| `context` | string | 注入所有产物指令的项目上下文 |
| `rules` | object | 按产物 ID 设置的产物级规则 |

### 工作原理

**Schema 优先级**（从高到低）：
1. CLI 标志（`--schema <name>`）
2. 变更元数据（变更目录中的 `.openspec.yaml`）
3. 项目配置（`openspec/config.yaml`）
4. 默认值（`spec-driven`）

**上下文注入：**
- 上下文会添加到每个产物指令的开头
- 内容会用 `<context>...</context>` 标签包裹
- 帮助 AI 理解项目约定

**规则注入：**
- 只会为匹配的产物注入规则
- 内容会用 `<rules>...</rules>` 标签包裹
- 位于上下文之后、模板之前

### 各 Schema 的产物 ID

**spec-driven**（默认）：
- `proposal` — 变更提案
- `specs` — 规范
- `design` — 技术设计
- `tasks` — 实现任务

### 配置验证

- `rules` 中未知的产物 ID 会产生警告
- Schema 名称会根据可用 schema 列表进行验证
- 上下文大小上限为 50KB
- 无效 YAML 会报告行号

### 故障排除

**“Unknown artifact ID in rules: X”**
- 检查产物 ID 是否与 schema 匹配（参见上方列表）
- 运行 `openspec schemas --json` 查看每个 schema 的产物 ID

**配置未生效：**
- 确认文件路径为 `openspec/config.yaml`（而非 `.yml`）
- 使用验证工具检查 YAML 语法
- 配置更改会立即生效（无需重启）

**上下文过大：**
- 上下文大小限制为 50KB
- 请改为概述内容，或链接到外部文档

## 命令

| 命令 | 功能 |
|---------|--------------|
| `/opsx:propose` | 一步创建变更并生成规划产物（默认快速路径） |
| `/opsx:explore` | 梳理想法、调查问题、明确需求 |
| `/opsx:new` | 创建新的变更脚手架（扩展工作流） |
| `/opsx:continue` | 创建下一个产物（扩展工作流） |
| `/opsx:ff` | 快速生成规划产物（扩展工作流） |
| `/opsx:apply` | 实现任务，并按需更新产物 |
| `/opsx:update` | 修改变更的规划产物并保持一致 |
| `/opsx:verify` | 根据产物验证实现（扩展工作流） |
| `/opsx:sync` | 将增量规范合并到主规范（可选） |
| `/opsx:archive` | 完成后归档 |
| `/opsx:bulk-archive` | 批量归档已完成的变更（扩展工作流） |
| `/opsx:onboard` | 引导完成端到端变更流程 |

## 用法

### 探索想法
```
/opsx:explore
```
梳理想法、调查问题、比较方案。不要求任何固定结构——它就是一个思考伙伴。想法逐渐清晰后，可以转到 `/opsx:propose`（默认工作流），或 `/opsx:new`/`/opsx:ff`（扩展工作流）。

### 开始一项新变更
```
/opsx:propose
```
创建变更，并生成实现前所需的规划产物。

如果启用了扩展工作流，也可以改用：

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### 创建产物
```
/opsx:continue
```
根据依赖关系显示当前可创建的产物，然后创建其中一个。重复此操作即可逐步构建变更。

```
/opsx:ff add-dark-mode
```
一次性创建所有规划产物。适用于你已明确要构建什么的情况。

### 实现（灵活迭代的部分）
```
/opsx:apply
```
逐项处理任务，并在完成时勾选。如果同时处理多项变更，可以运行 `/opsx:apply <name>`；否则它会根据对话推断目标变更，如果无法判断则提示你选择。

### 更新变更
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
修改变更现有的规划产物，并确保各方向内容保持一致（例如修改设计可能会影响提案）。它不会编辑代码。每项编辑都会先与你确认。关于它如何处理缺失文件而不创建新产物，请参阅[更新命令参考](/zh-CN/commands/#opsxupdate)。

如果变更已经实现，它会建议运行 `/opsx:apply`，使代码与修订后的计划保持一致。如果修订改变了变更的*意图*，则应重新开始。参阅[何时更新，何时重新开始](#何时更新何时重新开始)。

### 同步增量规范
```text
/opsx:sync
```
将当前变更的增量规范合并到主 `openspec/specs/` 中，但不归档——该变更仍保持活动状态。此操作会应用整个增量：`## REMOVED` 下的需求会从主规范中删除，重命名的需求会在原位置改名，增量未提及的内容则保持不变。同步是可选的——如果尚未同步，归档时会提示你先同步。以下情况适合使用同步：归档前先更新主规范；并行变更需要基于本次新增的规范继续工作；或你想在归档前检查合并后的主规范。

### 收尾
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## 何时更新，何时重新开始

实现之前，你随时可以编辑提案或规范。但细化到什么程度，就算是“另一项工作”？

### 提案涵盖哪些内容

提案会定义三件事：
1. **意图**——你要解决什么问题？
2. **范围**——哪些内容属于范围之内或之外？
3. **方案**——你将如何解决？

关键是：哪些内容发生了变化，变化有多大？

### 适合更新现有变更的情况：

**意图相同，只是完善执行方式**
- 发现了之前未考虑到的边界情况
- 需要调整方案，但目标没有改变
- 实现过程中发现设计略有偏差

**缩小范围**
- 发现完整范围过大，希望先交付 MVP
- “添加暗色模式” → “添加暗色模式开关（系统偏好支持放到 v2）”

**根据新发现进行修正**
- 代码库结构与你原先的设想不同
- 某个依赖的行为与预期不符
- “使用 CSS 变量” → “改用 Tailwind 的 `dark:` 前缀”

### 适合开始新变更的情况：

**意图发生根本变化**
- 要解决的问题本身已经不同
- “添加暗色模式” → “添加可自定义颜色、字体和间距的完整主题系统”

**范围大幅膨胀**
- 变更增长到本质上已是另一项工作
- 更新后的内容会让原始提案面目全非
- “修复登录错误” → “重写身份验证系统”

**原始工作已可完成**
- 原始变更已经可以标记为“完成”
- 新工作可以独立成立，并非对原工作的细化
- 完成“添加暗色模式 MVP” → 归档 → 新建变更“增强暗色模式”

### 判断依据

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| 判断项 | 更新 | 新建变更 |
|------|--------|------------|
| **本质** | “同一件事的完善” | “不同的工作” |
| **范围重叠** | 重叠超过 50% | 重叠少于 50% |
| **完成条件** | 不做这些更改就无法“完成” | 原工作可以完成，新工作独立成立 |
| **过程叙述** | 更新过程连贯合理 | 补丁式修改只会让理解更混乱 |

### 原则

> **更新保留上下文；新建变更让目标更清晰。**
>
> 当思考过程的历史很有价值时，选择更新。
> 当重新开始比修补旧方案更清楚时，选择新建。

可以把它想象成 git 分支：
- 同一功能持续开发时，不断提交
- 真正开始新工作时，创建新分支
- 有时先合并部分功能，再为第二阶段重新开始

## 有何不同？

| | 旧版（`/openspec:proposal`） | OPSX（`/opsx:*`） |
|---|---|---|
| **结构** | 一份大型提案文档 | 彼此依赖的独立产物 |
| **工作流** | 线性阶段：规划 → 实现 → 归档 | 灵活操作——随时执行任何操作 |
| **迭代** | 返回上一步不方便 | 根据新发现更新产物 |
| **定制** | 结构固定 | Schema 驱动（可定义自己的产物） |

**关键认识：**工作并非线性的。OPSX 不再假装它是线性的。

## 架构深入解析

本节介绍 OPSX 的内部工作方式，以及它与旧版工作流的区别。
本节示例使用扩展命令集（`new`、`continue` 等）；默认 `core` 用户可将同样的流程映射为 `propose → apply → sync → archive`。

### 理念：阶段与操作

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 组件架构

**旧版工作流**在 TypeScript 中使用硬编码模板：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** 使用外部 schema 和依赖关系图引擎：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Devin)                    │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 依赖图模型

产物构成有向无环图（DAG）。依赖关系是**启用条件**，而非关卡：

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**状态转换：**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### 信息流

**旧版工作流**——代理收到静态指令：

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create delta spec files              │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX**——代理查询丰富的上下文：

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked",                          │  │
  │  │       "missingDeps": ["specs", "design"]}                          │  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### 迭代模型

**旧版工作流**——迭代过程很别扭：

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX**——自然地进行迭代：

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### 自定义 Schema

使用 schema 管理命令创建自定义工作流：

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

Schema 存储在 `openspec/schemas/`（项目本地、纳入版本控制）或 `~/.local/share/openspec/schemas/`（用户全局）中。

**Schema 结构：**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**schema.yaml 示例：**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**依赖图：**
```
   research ──► proposal ──► tasks
```

### 总结

| 方面 | 旧版 | OPSX |
|--------|----------|------|
| **模板** | 硬编码的 TypeScript | 外部 YAML + Markdown |
| **依赖关系** | 无（一次性生成） | 通过拓扑排序处理 DAG |
| **状态** | 基于阶段的思维模型 | 根据文件系统中的文件是否存在判断 |
| **定制** | 修改源码并重新构建 | 创建 schema.yaml |
| **迭代** | 受阶段限制 | 灵活编辑任何内容 |
| **编辑器支持** | 特定工具的配置器/适配器 | 统一的 skills 目录 |

## Schema 列表

Schema 定义现有哪些产物及其依赖关系。目前可用的 schema：

- **spec-driven**（默认）：proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## 提示

- 在决定创建变更前，先用 `/opsx:explore` 梳理想法
- 明确目标时使用 `/opsx:ff`；仍在探索时使用 `/opsx:continue`
- 执行 `/opsx:apply` 时发现问题，就修正产物后继续
- 通过 `tasks.md` 中的复选框跟踪任务进度
- 随时运行 `openspec status --change "name"` 查看状态

## 反馈

目前还不够完善，这是有意为之——我们还在探索什么方法最有效。

发现错误或有改进建议？请加入 [Discord](https://discord.gg/YctCnvvshC)，或在 [GitHub](https://github.com/Fission-AI/openspec/issues) 上提交 issue。
