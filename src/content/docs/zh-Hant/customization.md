---
title: "自訂"
---

OpenSpec 提供三個層次的自訂方式：

| 層級 | 用途 | 適用物件 |
|-------|--------------|----------|
| **專案設定** | 設定預設值、注入上下文/規則 | 大多數團隊 |
| **自訂模式** | 定義自己的工作流程產物 | 流程獨特的團隊 |
| **全域覆蓋** | 在所有專案間共享模式 | 高階使用者 |

---

## 專案設定

`openspec/config.yaml` 是為團隊自訂 OpenSpec 最簡單的方式。你可以用它來：

- **設定預設模式**——無需在每條命令中都指定 `--schema`
- **注入專案上下文**——讓 AI 瞭解你的技術棧、約定等
- **新增產物級規則**——為特定產物新增自訂規則
- **新增操作指引**——為 apply 和 archive 操作提供建議
- **記住整合選項**——例如選擇是否啟用 [GitHub Copilot 雲端編碼智慧代理程式](/zh-Hant/supported-tools/)

### 快速設定

```bash
openspec init
```

該命令會以互動方式引導你建立設定檔案。你也可以手動建立：

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

**預設模式：**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**上下文和規則注入：**

生成任意產物時，你的上下文和規則都會注入 AI 提示詞：

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

- **Context** 會出現在所有產物中。
- **Rules** 只會出現在與之匹配的產物中。

**操作指引：**

`operations.apply.guidance` 和 `operations.archive.guidance` 是可選陣列，用於提供智慧代理程式執行這些操作時的建議。它們與 `rules` 相互獨立：操作指引不會限制產物內容，產物規則也不會被重新歸類為操作指引。

Apply 和 archive 會在執行時獲取這些輸入：

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

這兩個介面會將當前專案的 `context` 和匹配的 `operationGuidance` 作為獨立的可選欄位返回。每次呼叫都會從已解析的根目錄讀取最新快照。使用 `--store <id>` 時，變更、上下文和指引均來自該儲存庫，而非當前程式碼儲存庫。Archive 指令命令是隻讀的：它不會檢查或合併差異規格說明、寫入主規格說明、移動變更，也不會執行靜態歸檔工作流程。

專案上下文是提示詞層面的必需輸入。生成的工作流程會讀取它，並應用相關的專案事實、約定和限制。操作指引是可選的補充建議：工作流程會考慮所有條目，並遵循適用且與內建工作流程相容的內容。

這兩個欄位都與 CLI 控制的狀態、已解析路徑、內建步驟、明確的使用者選擇以及產物規則相互獨立。工作流程會報告上下文衝突，同時保留具有控制效力的值。它不會遵循不適用或相互衝突的指引，並會說明原因。這兩個欄位都不是可強制執行的檢查；除非使用者另行要求，否則工作流程不會將它們複製到實作檔案、規格說明、變更產物或摘要中。

**歸檔和規格同步的輸入安全性：**

Archive、bulk archive 和獨立的 sync 會將 `openspec status --json` 輸出中的 `artifactPaths.specs.existingOutputPaths` 作為唯一的差異規格說明來源。沒有 `specs` 產物的模式，或實際輸出路徑列表為空的變更，都沒有內容需要同步；不會透過其他產物推斷差異規格說明。

語義合併寫入主規格說明之前，工作流程會讀取當前的 `openspec instructions specs --change <name> --json` 輸出。返回的 `specs` 規則僅約束此次合併所生成的主規格說明。單項 archive 會將該快照傳給內部 sync；單獨執行 sync 時會直接獲取快照；bulk archive 則會在首次寫入規格說明之前，先獲取所有必需快照。如果 archive/specs 指令請求返回非零退出碼或無效 JSON，這是查詢失敗，而非輸入為空：工作流程會在受影響的規格寫入或變更移動之前停止（bulk archive 會在任何批次寫入或移動之前停止）。

此設定不會改變歸檔執行階段、使用者提示、檔案系統操作、語義合併的責任歸屬、直接的 `openspec archive` 命令，也不會改變產物 `rules` 的結構和輸出。

### 模式解析順序

OpenSpec 需要選擇模式時，會按以下順序檢查：

1. CLI 標誌：`--schema <name>`
2. 變更元資料（變更資料夾中的 `.openspec.yaml`）
3. 專案設定（`openspec/config.yaml`）
4. 預設模式（`spec-driven`）

---

## 自訂模式

當專案設定不夠用時，可以建立完全自訂的模式來定義工作流程。自訂模式位於專案的 `openspec/schemas/` 目錄中，並與程式碼一同進行版本控制。

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

### 從現有模式派生

最快的自訂方式是從內建模式派生：

```bash
openspec schema fork spec-driven my-workflow
```

該命令會將整個 `spec-driven` 模式複製到 `openspec/schemas/my-workflow/`，隨後你可以自由編輯。

**生成的內容：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

接著編輯 `schema.yaml` 以更改工作流程，或編輯模板以更改 AI 生成的內容。

### 從頭建立模式

如果要完全從頭定義工作流程：

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 模式結構

模式會定義工作流程中的產物以及它們之間的依賴關係：

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

**關鍵欄位：**

| 欄位 | 用途 |
|-------|---------|
| `id` | 唯一識別符號，在命令和規則中使用 |
| `generates` | 輸出檔名（支援 `specs/**/*.md` 等 glob 模式） |
| `template` | `templates/` 目錄中的模板檔案 |
| `instruction` | 建立該產物時提供給 AI 的指令 |
| `requires` | 依賴項——必須先存在的產物 |

按你希望的順序列出產物。`requires` 決定哪些產物可以開始；當多個產物同時就緒時，`artifacts:` 列表的順序決定先處理哪個。

### 模板

模板是用於指導 AI 的 Markdown 檔案。建立相應產物時，模板會注入提示詞中。

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

- 提示 AI 填寫的章節標題
- 用於指導 AI 的 HTML 註釋
- 展示預期結構的範例格式

### 驗證模式

使用自訂模式之前，請先驗證：

```bash
openspec schema validate my-workflow
```

此操作會檢查：

- `schema.yaml` 語法是否正確
- 所有被引用的模板是否存在
- 是否存在迴圈依賴
- 產物 ID 是否有效

### 使用自訂模式

建立完成後，可以這樣使用：

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### 除錯模式解析

不確定實際使用了哪個模式？執行以下命令檢查：

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

輸出會顯示模式來自專案、使用者目錄還是軟體包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 還支援將使用者級模式放在 `~/.local/share/openspec/schemas/` 下，以便在多個專案間共享；不過建議將模式放在專案級的 `openspec/schemas/` 中，因為它會與程式碼一起進行版本控制。

---

## 範例

### 快速迭代工作流程

適用於快速迭代的最小工作流程：

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

### 新增審查產物

從預設模式派生，並新增審查步驟：

```bash
openspec schema fork spec-driven with-review
```

然後編輯 `schema.yaml` 新增：

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

## 社群模式

OpenSpec 也支援透過獨立儲存庫分發、由社群維護的模式。這些模式提供具有明確觀點的工作流程，可將 OpenSpec 與其他工具或系統整合，類似於 [github/spec-kit 的社群擴充套件目錄](https://github.com/github/spec-kit/tree/main/extensions)為 spec-kit 提供擴充套件的方式。

社群模式不會打包進 OpenSpec 核心，而是儲存在各自儲存庫中，並按各自的節奏釋出。要使用某個模式，請將其模式包複製到專案的 `openspec/schemas/<schema-name>/` 目錄中（各儲存庫的 README 均包含安裝說明）。

| 模式 | 維護者 | 儲存庫 | 說明 |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | 在實作前記錄變更意圖、可觀察行為、技術設計和長期架構決策。新增與變更關聯的 ADR 審查清單，並將符合條件的長期決策寫為不可變、可被後續 ADR 取代的記錄。 |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | 將 OpenSpec 的產物治理與 [obra/superpowers](https://github.com/obra/superpowers) 執行技能（頭腦風暴、編寫計畫、透過子智慧代理程式進行 TDD、程式碼審查、收尾）整合。新增以證據為先的 `retrospective` 產物，補足 Superpowers 原生流程未覆蓋的環節。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | 以產品管理為先的工作流程。先執行 [nanopm](https://github.com/nmrtn/nanopm) 規劃流水線（審計 → 策略 → 路線圖 → PRD），再進入實作階段。將產品規劃銜接到 OpenSpec 的規格驅動工程工作流程。如果存在 `.nanopm/`，產物會讀取其中內容：提案引用審計，設計引用策略，任務引用 PRD 分解。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 面向能力的端到端測試手冊。每項能力都有不可變規格說明、不可變任務模板，併為每次執行生成帶時間戳的執行記錄。斷言只關注可觀察行為（HTTP 狀態、響應正文、持久化狀態，不檢查日誌片段）；每次執行都會記錄 UTC 開始/結束時間、持續時間，以及估算的 LLM token 消耗量。 |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | 遵循 TDD 並包含對抗式審查步驟的規格驅動工作流程。流程：`proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`。`review` 由具備全新上下文的只讀審查者編寫（如有條件則使用第二個模型），並輸出 `VERDICT:` 行，指示智慧代理程式阻止 `test-plan`、`tasks` 和 `apply` 直至透過審查；OpenSpec 只檢查產物是否存在，因此需透過自己的 CI 或鉤子實施此關卡。`test-plan` 會將每個規格情境對映到具名測試，同時作為由 `verify` 審計的紅/綠進度記錄。 |

> 想貢獻社群模式？請提交包含儲存庫連結的 issue，或提交 PR 在此表格中新增一行。

---

## 另請參閱

- [CLI 參考：模式命令](/zh-Hant/cli/)——完整的命令文件
