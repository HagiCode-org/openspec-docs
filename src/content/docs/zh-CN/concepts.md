---
title: "概念"
---

本指南介绍 OpenSpec 的核心理念及它们如何相互配合。实践操作请参阅[快速入门](/zh-CN/getting-started/)和[工作流](/zh-CN/workflows/)。

## 理念

OpenSpec 围绕四项原则构建：

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### 为什么这些原则重要

**灵活而非僵化。** 传统规格说明系统会将工作锁定在不同阶段：先规划，再实现，最后完成。OpenSpec 更灵活——你可以按照最适合当前工作的顺序创建产物。

**迭代而非瀑布。** 需求会变化，理解会加深。起初看似可行的方案，在了解代码库后可能并不合适。OpenSpec 接受并支持这种现实情况。

**简单而非复杂。** 有些规格框架要求大量设置、僵硬格式或繁重流程。OpenSpec 不会挡你的路：几秒钟内完成初始化，立即开始工作，只在需要时自定义。

**优先面向棕地项目。** 大多数软件工作不是从零构建，而是修改现有系统。OpenSpec 基于差异的方式让你能够轻松描述现有行为的变化，而不仅仅是描述全新的系统。

## 整体结构

OpenSpec 将工作组织到两个主要区域：

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**规格说明**是唯一真实依据，描述系统当前的行为。

**变更**是拟议的修改；在准备好合并之前，它们一直保存在独立文件夹中。

这种分离至关重要。你可以并行处理多项变更而不会相互冲突，可以在变更影响主规格说明之前先审查它。归档变更时，其差异会清晰地合并到唯一真实依据中。

## 规格说明

规格说明使用结构化的需求和场景描述系统行为。

### 结构

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

按领域组织规格说明——领域是符合系统逻辑的分组。常见模式包括：

- **按功能区域：** `auth/`、`payments/`、`search/`
- **按组件：** `api/`、`frontend/`、`workers/`
- **按有界上下文：** `ordering/`、`fulfillment/`、`inventory/`

### 规格说明格式

规格说明由需求组成，每项需求都包含场景：

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**关键要素：**

| 要素 | 用途 |
|---------|---------|
| `## Purpose` | 对该规格说明所涉领域的高层描述 |
| `### Requirement:` | 系统必须具备的一种具体行为 |
| `#### Scenario:` | 需求实际生效时的具体示例 |
| SHALL/MUST/SHOULD | 表示需求严格程度的 RFC 2119 关键词 |

### 为什么规格说明采用这种结构

**需求描述“做什么”**——它们说明系统应该做什么，而不指定具体实现。

**场景描述“何时发生”**——它们提供可以验证的具体示例。优质场景应当：

- 可测试（可以据此编写自动化测试）
- 同时涵盖正常流程和边界情况
- 使用 Given/When/Then 或类似的结构化格式

**RFC 2119 关键词**（SHALL、MUST、SHOULD、MAY）用于表达要求的严格程度：

- **MUST/SHALL**——绝对要求
- **SHOULD**——建议遵循，但允许例外
- **MAY**——可选

### 规格说明是什么（以及不是什么）

规格说明是**行为约定**，不是实现计划。

适合写入规格说明的内容：

- 用户或下游系统依赖的可观察行为
- 输入、输出和错误情况
- 外部约束（安全、隐私、可靠性、兼容性）
- 可以测试或明确验证的场景

避免写入规格说明的内容：

- 内部类/函数名称
- 库或框架的选择
- 逐步实现细节
- 详细执行计划（这些属于 `design.md` 或 `tasks.md`）

快速判断：

- 如果改变实现方式而不影响外部可见行为，该内容通常不属于规格说明。

### 保持轻量：逐步提高严谨程度

OpenSpec 希望避免官僚流程。选择仍能让变更可验证的最轻量方式。

**轻量规格说明（默认）：**

- 范围清楚，包含明确的非目标
- 若干具体的验收检查

**完整规格说明（适用于较高风险）：**

- 跨团队或跨仓库的变更
- API/约定变更、迁移、安全或隐私问题
- 歧义可能造成昂贵返工的变更

大多数变更都应采用轻量模式。

### 人与智能体协作

在许多团队中，人负责探索，智能体负责起草产物。预期的工作循环如下：

1. 人提供意图、上下文和约束。
2. 智能体将这些内容整理成以行为为先的需求和场景。
3. 智能体将实现细节放在 `design.md` 和 `tasks.md`，而不是 `spec.md` 中。
4. 实现之前先验证结构和清晰度。

这样可以让规格说明既便于人阅读，又便于智能体一致地处理。

## 变更

变更是对系统拟议的一项修改，会打包成一个文件夹，其中包含理解和实现该变更所需的一切内容。

### 变更结构

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

每项变更都自成一体，包含：

- **产物**——记录意图、设计和任务的文档
- **差异规格说明**——描述新增、修改或移除内容的规格说明
- **元数据**——针对该项变更的可选配置

### 为什么变更采用文件夹形式

将变更打包成文件夹有多项好处：

1. **内容集中。** 提案、设计、任务和规格说明都放在同一处，不必四处寻找。
2. **支持并行工作。** 多项变更可以同时存在而互不冲突；你可以在处理 `add-dark-mode` 时，同时推进 `fix-auth-bug`。
3. **历史清晰。** 归档后，变更会连同完整上下文一起移入 `changes/archive/`。日后可以了解不仅改了什么，也能了解为什么要改。
4. **便于审查。** 变更文件夹容易审查——打开文件夹，阅读提案、检查设计、查看规格差异即可。

## 产物

产物是变更中的文档，用于指导工作。

### 产物流转顺序

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

产物层层衔接：每项产物都会为下一项提供上下文。

### 产物类型

#### 提案 (`proposal.md`)

提案从高层次记录**意图**、**范围**和**方案**。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**以下情形应更新提案：**

- 范围发生变化（缩小或扩大）
- 意图更加明确（对问题有了更深入的理解）
- 方案发生根本变化

#### 规格说明（`specs/` 下的差异规格说明）

差异规格说明描述相对于当前规格说明**发生了什么变化**。详见下文的[差异规格说明](#差异规格说明)。

#### 设计 (`design.md`)

设计记录**技术方案**和**架构决策**。

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**以下情形应更新设计：**

- 实现过程中发现方案不可行
- 找到更好的解决办法
- 依赖项或约束发生变化

#### 任务 (`tasks.md`)

任务是**实现清单**，由带复选框的具体步骤组成。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**任务最佳实践：**

- 使用标题对相关任务分组
- 使用层级编号（1.1、1.2 等）
- 任务粒度应足以在一次工作时段内完成
- 说明每项任务如何验证（测试、命令或可观察结果）
- 每组工作需要的测试和文档应放在该组中完成，而不是留到最后补做
- 完成任务后勾选

## 差异规格说明

差异规格说明是让 OpenSpec 适用于棕地开发的关键概念。它描述**发生了什么变化**，而不是重述整份规格说明。

### 格式

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### 差异章节

| 章节 | 含义 | 归档时的处理方式 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新行为 | 追加到主规格说明 |
| `## MODIFIED Requirements` | 变更后的行为 | 替换现有需求 |
| `## REMOVED Requirements` | 已废弃的行为 | 从主规格说明中删除；若移除最后一项需求，则会废弃该能力并删除其规格文件（前提是变更声明了 `retire_capabilities: true`） |
| `## Purpose` | 新建能力的用途 | 用作新建主规格说明的 Purpose；规格说明已存在时会忽略 |

### 为什么使用差异而不是完整规格说明

**明确。** 差异会精确展示发生变化的部分。阅读完整规格说明时，你必须在脑中将它与当前版本进行比较。

**避免冲突。** 两项变更可以修改同一规格文件的不同需求而不发生冲突。

**提高审查效率。** 审查者看到的是变更内容，而非未变化的上下文，可以专注于重要部分。

**适合棕地项目。** 大多数工作都是修改现有行为。差异让修改成为核心功能，而非事后补充。

## 模式

模式定义工作流中的产物类型及其依赖关系。

### 模式如何工作

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**产物构成依赖图：**

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

**依赖关系是助力，而非关卡。** 它们指出可以创建哪些内容，而不是下一步必须创建什么。如果不需要设计文档，可以跳过 design。规格说明可以在设计之前或之后创建，因为两者都只依赖 proposal。

### 内置模式

**spec-driven**（默认）

适用于规格驱动开发的标准工作流：

```
proposal → specs → design → tasks → implement
```

适用场景：大多数功能开发——你希望在实现前先就规格说明达成一致。

### 自定义模式

可以为团队工作流创建自定义模式：

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**自定义模式示例：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

有关创建和使用自定义模式的完整详情，请参阅[自定义](/zh-CN/customization/)。

## 归档

归档会将变更的差异规格说明合并到主规格说明中，并保留变更作为历史记录，从而完成该变更。

### 归档时会发生什么

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 归档流程

1. **合并差异。** 每份差异规格说明中的 ADDED/MODIFIED/REMOVED 章节都会应用到相应的主规格说明中。
2. **移入归档。** 变更文件夹会带日期前缀移至 `changes/archive/`，以便按时间排序。
3. **保留上下文。** 所有产物都会完整保留在归档中。你随时可以回顾变更原因。

### 归档为何重要

**保持状态整洁。** 活动变更目录 (`changes/`) 只显示正在进行的工作。已完成的工作会移出活动区。

**留下审计记录。** 归档会保留每项变更的完整上下文——不仅有变更内容，还包括说明原因的提案、说明实现方式的设计，以及展示完成工作的任务清单。

**推动规格说明演进。** 规格说明会随变更归档逐渐完善。每次归档都会合并差异，长期积累成完整规格说明。

## 各部分如何配合

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**良性循环：**

1. 规格说明描述当前行为
2. 变更通过差异提出修改
3. 实现让变更成为现实
4. 归档将差异合并进规格说明
5. 规格说明由此描述新的行为
6. 后续变更以更新后的规格说明为基础

## 术语表

| 术语 | 定义 |
|------|------------|
| **产物** | 变更中的文档（提案、设计、任务或差异规格说明） |
| **归档** | 完成变更并将其差异合并到主规格说明中的过程 |
| **变更** | 对系统拟议的一项修改，以包含产物的文件夹形式打包 |
| **差异规格说明** | 相对于当前规格说明描述变更（ADDED/MODIFIED/REMOVED）的规格说明 |
| **领域** | 规格说明的逻辑分组（例如 `auth/`、`payments/`） |
| **需求** | 系统必须具备的一种具体行为 |
| **场景** | 需求的具体示例，通常采用 Given/When/Then 格式 |
| **模式** | 对产物类型及其依赖关系的定义 |
| **规格说明** | 描述系统行为，并包含需求和场景的规范 |
| **唯一真实依据** | `openspec/specs/` 目录，包含当前已达成一致的行为 |

## 后续步骤

- [快速入门](/zh-CN/getting-started/)——实践起步指南
- [工作流](/zh-CN/workflows/)——常见模式及各自的适用场景
- [命令](/zh-CN/commands/)——完整命令参考
- [自定义](/zh-CN/customization/)——创建自定义模式并配置项目
