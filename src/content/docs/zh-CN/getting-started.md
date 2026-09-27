---
title: "快速入门"
---

本指南介绍安装并初始化 OpenSpec 后的使用方式。安装说明请参阅[文档首页](/zh-CN/)或[安装指南](/zh-CN/installation/)。刚开始阅读整套文档？请查看[文档首页](/zh-CN/)，了解各文档内容。

> **这些命令应该在哪里输入？** 有两个地方，混淆它们是初学者最常遇到的问题。
>
> - `openspec ...` 命令（例如 `openspec init`）在**终端**中运行。
> - `/opsx:...` 命令（例如 `/opsx:propose`）在 **AI 助手的聊天**中运行，也就是你平时让它编写代码的输入框。
>
> 无需另外启动“交互模式”。只需在聊天中输入斜杠命令，助手便会接手处理。完整说明请参阅[命令的工作方式](/zh-CN/how-commands-work/)。

## 前五分钟

完整流程如下，并标明了每一步发生的位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

设置只需在终端中执行两步，之后就在聊天中完成操作。本指南余下部分将逐一介绍每一步的作用以及你会看到的内容。

**不想自己在终端中操作？** 将[设置提示词](/zh-CN/installation/)粘贴给助手，它会处理这两行命令，并报告创建了什么。

> **还不确定要构建什么？从 `/opsx:explore` 开始。** 它是一位没有压力的思考伙伴，会读取代码库、权衡选项，并在编写任何代码之前，把模糊想法整理成具体计划。思路明确后，它会交由 `/opsx:propose` 继续。这是与 AI 合作时最值得养成的习惯，因为 AI 否则可能会自信地构建出错误的内容。参阅[探索指南](/zh-CN/explore/)。

## 工作方式

OpenSpec 帮助你和 AI 编程助手在编写代码之前，就要构建什么达成一致。

**默认快捷路径（core 配置档案）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

还在考虑该做什么时，从 `/opsx:explore` 开始；已经清楚要做什么时，可以直接使用 `/opsx:propose`。默认配置档案中包含 Explore，因此需要时随时可用。

**扩展路径（自定义工作流选择）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

默认的全局配置档案是 `core`，其中包含 `propose`、`explore`、`apply`、`update`、`sync` 和 `archive`。你可以通过 `openspec config profile` 启用扩展工作流命令，然后运行 `openspec update`。

## OpenSpec 会创建什么

运行 `openspec init` 后，项目会包含如下结构：

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**两个关键目录：**

- **`specs/`**——唯一真实依据。这些规格说明描述系统当前的行为，并按领域组织（例如 `specs/auth/`、`specs/payments/`）。
- **`changes/`**——拟议的修改。每项变更都有自己的文件夹，其中包含所有相关产物。变更完成后，其规格说明会合并到主 `specs/` 目录中。

## 理解产物

每个变更文件夹都包含用于指导工作的产物：

| 产物 | 用途 |
|----------|---------|
| `proposal.md` | “原因”和“内容”——记录意图、范围和方案 |
| `specs/` | 通过 ADDED/MODIFIED/REMOVED 描述变更的差异规格说明 |
| `design.md` | “实现方式”——技术方案和架构决策 |
| `tasks.md` | 带复选框的实现清单 |

**产物层层衔接：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

随着实现过程中不断了解新情况，你随时可以回头完善早期产物。

## 差异规格说明的工作方式

差异规格说明是 OpenSpec 的核心概念。它描述相对于当前规格说明发生了哪些变化。

### 格式

差异规格说明使用不同的章节标明变更类型：

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 归档时会发生什么

归档变更时：

1. **ADDED** 需求会追加到主规格说明中。
2. **MODIFIED** 需求会替换已有版本。
3. **REMOVED** 需求会从主规格说明中删除。

变更文件夹会移到 `openspec/changes/archive/`，以保留审计历史。

## 示例：你的第一个变更

下面演示如何为应用添加深色模式。

### 1. 开始变更（默认方式）

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

如果你启用了扩展工作流配置档案，也可以分两步完成：先运行 `/opsx:new`，然后运行 `/opsx:ff`（或通过 `/opsx:continue` 逐步完成）。

### 2. 创建的内容

**proposal.md** ——记录意图：

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** ——描述新增需求的差异：

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** ——实现清单：

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 实现

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

实现过程中如果发现需要调整设计，只需更新相应产物并继续即可。

### 4. 归档

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

现在，差异规格说明已经并入主规格说明，记录了系统的工作方式。

## 验证与审查

使用 CLI 检查变更：

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## 后续步骤

- [先探索](/zh-CN/explore/)——在投入实现之前，使用 `/opsx:explore` 梳理想法
- [审查变更](/zh-CN/reviewing-changes/)——在编写代码之前，检查 AI 起草的计划
- [编写良好的规格说明](/zh-CN/writing-specs/)——了解优质需求和场景的写法
- [在现有项目中使用 OpenSpec](/zh-CN/existing-projects/)——从大型棕地代码库开始使用
- [编辑和迭代变更](/zh-CN/editing-changes/)——更新产物、返回前序步骤并协调手动编辑
- [核心概念速览](/zh-CN/overview/)——一页了解完整思维模型
- [示例与配方](/zh-CN/examples/)——完整的真实变更示例
- [工作流](/zh-CN/workflows/)——常用模式及命令的适用场景
- [命令](/zh-CN/commands/)——所有斜杠命令的完整参考
- [概念](/zh-CN/concepts/)——深入了解规格说明、变更和模式
- [自定义](/zh-CN/customization/)——按自己的方式使用 OpenSpec
- [存储库](/zh-CN/stores-beta/user-guide/)——规划跨越多个仓库或团队？将规划放在独立仓库中（beta）
- [常见问题](/zh-CN/faq/)与[故障排除](/zh-CN/troubleshooting/)——遇到问题时查阅
