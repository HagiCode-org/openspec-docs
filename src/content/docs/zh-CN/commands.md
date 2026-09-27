---
title: "命令"
---

本页是 OpenSpec 斜杠命令参考。这些命令应在 AI 编程助手的聊天界面中调用（例如 Claude Code、Cursor、Devin Desktop）。

工作流模式以及每个命令的适用场景，请参阅[工作流](/zh-CN/workflows/)。CLI 命令请参阅 [CLI](/zh-CN/cli/)。

本文使用 `/opsx:<command>` 作为标准形式。部分工具的拼写不同——Cursor 和 GitHub Copilot 注册为 `/opsx-propose`，Codex 使用 `$openspec-propose`——因此请查看[如何调用](/zh-CN/supported-tools/)中适用于你所用工具的格式。OpenSpec 生成的文件已经采用正确形式。

## 快速参考

### 默认快捷路径（`core` 配置档案）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 创建变更，并在一步中生成规划产物 |
| `/opsx:explore` | 在确定变更方案之前梳理想法 |
| `/opsx:apply` | 实现变更中的任务 |
| `/opsx:update` | 修改变更的规划产物并保持内容协调 |
| `/opsx:sync` | 将差异规格说明合并到主规格说明 |
| `/opsx:archive` | 归档已完成的变更 |

### 扩展工作流命令（自定义工作流选择）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 创建新的变更脚手架 |
| `/opsx:continue` | 根据依赖关系创建下一个产物 |
| `/opsx:ff` | 快进：一次性创建所有规划产物 |
| `/opsx:verify` | 验证实现是否符合产物 |
| `/opsx:bulk-archive` | 一次性归档多个变更 |
| `/opsx:onboard` | 通过完整工作流进行引导式教程 |

默认全局配置档案为 `core`。若要启用扩展工作流命令，请运行 `openspec config profile` 并选择工作流，然后在项目中运行 `openspec update`。

---

## 命令参考

### `/opsx:propose`

新建变更，并在一步中生成规划产物。这是 `core` 配置档案中的默认起始命令。

**语法：**
```text
/opsx:propose [change-name-or-description]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | kebab-case 名称或自然语言变更描述 |

**功能：**

- 创建 `openspec/changes/<change-name>/`
- 生成实现之前所需的产物（对于 `spec-driven`：proposal、specs、design、tasks）
- 变更准备好使用 `/opsx:apply` 后停止

**示例：**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**提示：**

- 如需最快的端到端流程，请使用此命令。
- 如果希望逐步控制产物创建，请启用扩展工作流并使用 `/opsx:new` + `/opsx:continue`。

---

### `/opsx:explore`

> **拿不准时从这里开始。** Explore 是一位没有压力的思考伙伴：它会读取代码库、比较方案，并在编写任何代码之前，把模糊想法整理成具体计划。它已包含在默认配置档案中。完整说明和更多示例请参阅[先探索](/zh-CN/explore/)指南。

在确定变更方案之前梳理想法、调查问题并明确需求。

**语法：**
```
/opsx:explore [topic]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 想要探索或调查的内容 |

**功能：**

- 无需固定结构即可展开探索式对话
- 调查代码库以回答问题
- 比较选项和方案
- 创建可视化图表以辅助梳理思路
- 在你要求记录探索结果，或接受它的提议时，使用 `openspec new change` 搭建变更并编写你指定的规划产物，或更新现有变更的产物
- 当思路明确后，可转交给 `/opsx:propose`（默认）或 `/opsx:new`（扩展工作流）

**示例：**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**提示：**

- 需求不明确或需要调查时使用。
- 它绝不会编写代码；除非你提出要求或接受它的建议，否则也不会写入其他内容。
- 适合在作出决定前比较多种方案。
- 可以读取文件并搜索代码库。

---

### `/opsx:new`

创建新的变更脚手架。此命令会创建变更文件夹，随后等待你使用 `/opsx:continue` 或 `/opsx:ff` 生成产物。

此命令属于扩展工作流集（默认的 `core` 配置档案不包含）。

**语法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 变更文件夹名称（未提供时会提示输入） |
| `--schema` | 否 | 要使用的工作流模式（默认来自配置或 `spec-driven`） |

**功能：**

- 创建 `openspec/changes/<change-name>/` 目录
- 在变更文件夹中创建 `.openspec.yaml` 元数据文件
- 显示可供创建的第一个产物模板
- 未提供时提示输入变更名称和模式

**创建内容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**示例：**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示：**

- 使用描述性名称：`add-feature`、`fix-bug`、`refactor-module`。
- 避免使用 `update`、`changes`、`wip` 等泛化名称。
- 也可以在项目配置 (`openspec/config.yaml`) 中设置模式。

---

### `/opsx:continue`

沿依赖链创建下一个产物。每次只创建一个产物，以便逐步推进。

**语法：**
```
/opsx:continue [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要继续处理的变更（未提供时根据上下文推断） |

**功能：**

- 查询产物依赖图
- 显示哪些产物已就绪，哪些仍受阻
- 创建第一个就绪的产物
- 读取依赖文件以获取上下文
- 显示创建后哪些产物变为可用

**示例：**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**提示：**

- 希望在继续之前先审查每个产物时使用。
- 适用于复杂变更，方便你掌控流程。
- 多个产物可能会同时就绪。
- 继续之前可以编辑已创建的产物。

---

### `/opsx:ff`

快进创建产物，一次性创建所有规划产物。

**语法：**
```
/opsx:ff [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要快进处理的变更（未提供时根据上下文推断） |

**功能：**

- 按依赖顺序创建所有产物
- 通过待办列表跟踪进度
- 所有 `apply-required` 产物完成后停止
- 创建下一个产物之前先读取每项依赖

**示例：**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**提示：**

- 已经清楚要构建什么时使用。
- 对于简单明了的变更，比 `/opsx:continue` 更快。
- 之后仍然可以编辑产物。
- 适合中小型功能。

---

### `/opsx:apply`

实现变更中的任务。它会逐项执行任务清单、编写代码并勾选已完成项目。

**语法：**
```
/opsx:apply [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要实现的变更（未提供时根据上下文推断） |

**功能：**

- 读取 `tasks.md` 并找出未完成的任务
- 逐项执行任务
- 根据需要编写代码、创建文件和运行测试
- 使用复选框 `[x]` 标记已完成的任务

**示例：**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**提示：**

- 如果中断，可以从上次进度继续。
- 并行处理多项变更时，可指定变更名称。
- 完成状态记录在 `tasks.md` 的复选框中。

---

### `/opsx:update`

修改变更中已有的规划产物，并协调它们之间的内容。此命令仅处理规划产物，不会修改代码。

**语法：**

```text
/opsx:update [change-name]
```

**参数：**

| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要更新的变更（未提供时根据上下文推断） |

**功能：**

- 通过 `openspec status --change <name> --json` 读取变更产物
- 根据你的要求修改，或在未指定修改内容时检查产物之间是否矛盾
- 可沿任一方向协调其他已有产物（一处设计修改可能需要回头调整提案）
- 每次只处理一个产物，并在写入前逐项向你确认所有修改
- 最后建议下一步操作：`/opsx:continue`（存在尚未开始的产物）、`/opsx:apply`（将修改后的计划用于代码实现），或 `/opsx:archive`（全部完成）

**缺少的文件：**

- 如果 glob 产物（例如 `specs/**/*.md`）至少有一个现有文件，update 可以建议创建缺少的配套文件。它会使用模式中的指令，并在创建前要求你确认具体路径。
- 尚无任何文件的产物仍应使用 `/opsx:continue`。有意跳过的产物不会受影响。
- 新文件必须位于变更目录内。如果创建前确认的路径上已出现文件，update 会停止，而不会覆盖它。

**示例：**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**提示：**

- 如果尚无产物文件，它不会启动产物创建。若已安装，可使用 `/opsx:continue`；否则可使用 `openspec status` 和 `openspec instructions`。
- 如果变更已经实现，随后应运行 `/opsx:apply`，让代码符合修订后的计划。
- 如果修订改变了变更的*意图*，应新建变更，而不是更新现有变更（参阅[何时更新，何时重新开始](/zh-CN/opsx/)）。

---

### `/opsx:verify`

验证实现是否符合变更产物，检查完整性、正确性和一致性。

**语法：**
```
/opsx:verify [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要验证的变更（未提供时根据上下文推断） |

**功能：**

- 从三个维度检查实现质量
- 在代码库中搜索实现证据
- 将问题分为 CRITICAL、WARNING 或 SUGGESTION
- 不会阻止归档，但会指出问题

**验证维度：**

| 维度 | 验证内容 |
|-----------|-------------------|
| **完整性** | 所有任务是否完成、所有需求是否实现、场景是否覆盖 |
| **正确性** | 实现是否符合规格意图、边界情况是否处理 |
| **一致性** | 设计决策是否体现在代码中、模式是否一致 |

**示例：**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**提示：**

- 归档前运行它，以便及早发现不一致。
- 警告不会阻止归档，但可能指出潜在问题。
- 提交前可用它审查 AI 的工作。
- 它可以发现产物与实现之间的偏差。

---

### `/opsx:sync`

**可选命令。** 将变更中的差异规格说明合并到主规格说明。如果需要同步，Archive 会主动提示，因此通常无需手动运行此命令。

**语法：**
```
/opsx:sync [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步的变更（未提供时根据上下文推断） |

**功能：**

- 从变更文件夹读取差异规格说明
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 章节
- 将变更合并到主 `openspec/specs/` 目录
- 保留差异中未提及的现有内容
- 不会归档变更（变更仍保持活动状态）

**示例：**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**何时手动运行：**

| 场景 | 是否使用 sync？ |
|----------|-----------|
| 长期变更，希望在归档前先将规格说明合并到主规格中 | 是 |
| 多项并行变更需要以更新后的主规格说明为基础 | 是 |
| 想单独预览/审查合并结果 | 是 |
| 快速完成变更并直接归档 | 否（archive 会处理） |

**提示：**

- Sync 是智能合并，而非复制粘贴。
- 可以向现有需求添加场景而不重复创建。
- 同步后变更仍保持活动状态（不会归档）。
- 大多数用户永远不需要直接调用此命令——如有需要，Archive 会提示。

---

### `/opsx:archive`

归档已完成的变更，使其结束并移至归档文件夹。

**语法：**
```
/opsx:archive [change-name]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（未提供时根据上下文推断） |

**功能：**

- 检查产物完成状态
- 检查任务完成情况（如有未完成项则发出警告）
- 如果差异规格说明尚未同步，则询问是否同步
- 将变更文件夹移至 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有产物作为审计记录

**示例：**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**提示：**

- 有未完成任务不会阻止归档，但会发出警告。
- 可以在归档期间或之前同步差异规格说明。
- 归档的变更会保留作为历史记录。
- 可先使用 `/opsx:verify` 检查问题。

---

### `/opsx:bulk-archive`

一次性归档多个已完成的变更，并处理它们之间的规格冲突。

**语法：**
```
/opsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 必需 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要归档的指定变更（未提供时会提示选择） |

**功能：**

- 列出所有已完成的变更
- 归档前验证每项变更
- 检测不同变更之间的规格冲突
- 根据实际实现情况解决冲突
- 按时间顺序归档

**示例：**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**提示：**

- 适用于并行工作流。
- 冲突解决由智能体完成（会检查代码库）。
- 按创建顺序归档变更。
- 覆盖规格内容前会提示。

---

### `/opsx:onboard`

引导你走完完整的 OpenSpec 工作流。这是一种基于真实代码库的交互式教程。

**语法：**
```
/opsx:onboard
```

**功能：**

- 通过讲解带你完整走过一次工作流
- 扫描代码库以寻找真实的改进机会
- 创建包含真实产物的实际变更
- 实现实际工作（规模小且安全的改动）
- 归档完成的变更
- 在每一步发生时说明操作原因

**阶段：**

1. 欢迎并分析代码库
2. 寻找改进机会
3. 创建变更 (`/opsx:new`)
4. 编写提案
5. 创建规格说明
6. 编写设计
7. 创建任务
8. 实现任务 (`/opsx:apply`)
9. 验证实现
10. 归档变更
11. 总结并说明后续步骤

**示例：**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**提示：**

- 适合刚开始学习工作流的新用户。
- 使用真实代码，而不是玩具示例。
- 会创建真实变更，你可以选择保留或放弃。
- 整个过程需要 15–30 分钟。

---

## 不同 AI 工具的命令语法

不同 AI 工具使用的命令语法略有区别。请使用与你的工具对应的格式：

| 工具的命令文件 | 语法示例 | 示例工具 |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`、`/opsx:apply` | Claude Code、Gemini CLI、Crush |
| `.../opsx-<id>.*` | `/opsx-propose`、`/opsx-apply` | Cursor、Devin Desktop、Copilot（IDE）、Trae、Oh My Pi |
| 无——仅支持技能 | `/openspec-propose`、`/openspec-apply-change` | CodeArts、ForgeCode、Hermes、MiniMax Code、Mistral Vibe、Zed Agent、共享 `.agents` |
| 无——Kimi Code | `/skill:openspec-propose` | Kimi Code |
| 无——Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop 与 Devin Local：** `.devin/workflows/opsx-*.md` 文件会为 Devin Desktop 提供 `/opsx-propose`。Devin Local 没有工作流——请使用 OpenSpec 写入 `.devin/skills/` 的技能，例如 `/openspec-propose`；两种智能体均可使用这些技能。

不同工具中的命令意图相同，但呈现方式可能因集成而异。[如何调用](/zh-CN/supported-tools/)列出了所有受支持的工具；此表只展示各类格式的示例。

> **注意：** GitHub Copilot 命令 (`.github/prompts/*.prompt.md`) 仅适用于 IDE 扩展（VS Code、JetBrains、Visual Studio）。GitHub Copilot CLI 目前不支持自定义提示文件；详情和替代方案请参阅[支持的工具](/zh-CN/supported-tools/)。

---

## 旧版命令

这些命令使用较早的“一次性全部生成”工作流。它们仍可使用，但建议采用 OPSX 命令。

| 命令 | 功能 |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有产物（proposal、specs、design、tasks） |
| `/openspec:apply` | 实现变更 |
| `/openspec:archive` | 归档变更 |

**适合使用旧版命令的情况：**
- 使用旧工作流的现有项目
- 无需逐步创建产物的简单变更
- 倾向于一次性完成所有工作的方式

**迁移到 OPSX：**
可以使用 OPSX 命令继续处理旧版变更。两者的产物结构兼容。

---

## 故障排除

### “未找到变更”

命令无法确定要处理哪项变更。

**解决方法：**
- 明确指定变更名称：`/opsx:apply add-dark-mode`
- 检查变更文件夹是否存在：`openspec list`
- 确认当前位于正确的项目目录

### “没有就绪的产物”

所有产物都已完成，或因缺少依赖项而受阻。

**解决方法：**
- 运行 `openspec status --change <name>` 查看受阻原因
- 检查所需产物是否存在
- 先创建缺少的依赖产物

### “未找到 Schema”

指定的 schema 不存在。

**解决方法：**
- 列出可用 schema：`openspec schemas`
- 检查 schema 名称拼写
- 如果是自定义 schema，请创建它：`openspec schema init <name>`

### 无法识别命令

AI 工具无法识别 OpenSpec 命令。

**解决方法：**
- 确认已初始化 OpenSpec：`openspec init`
- 重新生成 skills：`openspec update`
- 检查 `.claude/skills/` 目录是否存在（Claude Code）
- 重启 AI 工具，使其加载新 skills

### 产物生成不正确

AI 创建的产物不完整或有误。

**解决方法：**
- 在 `openspec/config.yaml` 中添加项目上下文
- 为具体指导添加产物级规则
- 在变更描述中提供更多细节
- 使用 `/opsx:continue` 而非 `/opsx:ff`，以便更细致地控制流程

---

## 后续步骤

- [工作流](/zh-CN/workflows/)——常见模式以及各命令的适用时机
- [CLI](/zh-CN/cli/)——用于管理和验证的终端命令
- [定制](/zh-CN/customization/)——创建自定义 schema 和工作流
