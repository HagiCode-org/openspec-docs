---
title: "OPSX 工作流程"
---

> 歡迎在 [Discord](https://discord.gg/YctCnvvshC) 提供回饋。

## 這是什麼？

OPSX 現已成為 OpenSpec 的標準工作流程。

它是一種**靈活、迭代式的工作流程**，用於處理 OpenSpec 變更。不再受僵化階段的限制——你可以隨時執行各種操作。

## 為什麼要有 OPSX

舊版 OpenSpec 工作流程雖然可用，但**限制很多**：

- **指令是硬編碼的**——埋在 TypeScript 程式碼中，無法修改
- **要麼全做，要麼不做**——一個大型命令一次建立所有內容，無法單獨測試各個部分
- **結構固定**——每個人都使用同一種工作流程，無法定製
- **黑盒**——AI 輸出不理想時，無法調整提示詞

**OPSX 打開了這扇門。**現在任何人都可以：

1. **試驗指令**——編輯模板，觀察 AI 的表現是否改善
2. **細粒度測試**——獨立驗證每個產物的指令
3. **定製工作流程**——定義自己的產物及其依賴關係
4. **快速迭代**——修改模板後立即測試，無需重新建置

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
- **團隊**——建立符合實際工作方式的工作流程
- **高階使用者**——調整提示詞，讓 AI 更好地理解你的程式碼庫
- **OpenSpec 貢獻者**——無需釋出新版本即可試驗新方法

我們仍在共同探索什麼方法最有效。OPSX 讓大家能夠一起學習。

## 使用者體驗

**線性工作流程的問題：**
你先“處於規劃階段”，然後“進入實作階段”，最後“完成”。但現實工作並非如此。實作過程中，你可能發現設計有誤，需要更新規範，然後繼續實作。線性階段與實際工作方式相沖突。

**OPSX 的方式：**
- **操作，而非階段**——建立、實作、更新、歸檔，任何操作都可以隨時執行
- **依賴關係用於啟用操作**——它們說明你可以做什麼，而不是規定下一步必須做什麼

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## 設定

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

這會在 `.claude/skills/`（或對應目錄）中建立 skills，AI 編碼助手可自動檢測它們。

預設情況下，OpenSpec 使用 `core` 工作流程設定（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）。如果需要擴充套件工作流程命令（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），請使用 `openspec config profile` 設定，並透過 `openspec update` 應用。

設定期間，系統會提示你建立**專案設定**（`openspec/config.yaml`）。此設定可選，但建議建立。

## 專案設定

專案設定可設定預設值，並向所有產物注入專案專屬上下文。

### 建立設定

設定會在執行 `openspec init` 時建立，也可以手動建立：

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

### 設定欄位

| 欄位 | 型別 | 說明 |
|-------|------|-------------|
| `schema` | string | 新建變更時使用的預設 schema（例如 `spec-driven`） |
| `context` | string | 注入所有產物指令的專案上下文 |
| `rules` | object | 按產物 ID 設定的產物級規則 |

### 工作原理

**Schema 優先順序**（從高到低）：
1. CLI 標誌（`--schema <name>`）
2. 變更元資料（變更目錄中的 `.openspec.yaml`）
3. 專案設定（`openspec/config.yaml`）
4. 預設值（`spec-driven`）

**上下文注入：**
- 上下文會新增到每個產物指令的開頭
- 內容會用 `<context>...</context>` 標籤包裹
- 幫助 AI 理解專案約定

**規則注入：**
- 只會為匹配的產物注入規則
- 內容會用 `<rules>...</rules>` 標籤包裹
- 位於上下文之後、模板之前

### 各 Schema 的產物 ID

**spec-driven**（預設）：
- `proposal` — 變更提案
- `specs` — 規範
- `design` — 技術設計
- `tasks` — 實作任務

### 設定驗證

- `rules` 中未知的產物 ID 會產生警告
- Schema 名稱會根據可用 schema 列表進行驗證
- 上下文大小上限為 50KB
- 無效 YAML 會報告行號

### 故障排除

**“Unknown artifact ID in rules: X”**
- 檢查產物 ID 是否與 schema 匹配（參見上方列表）
- 執行 `openspec schemas --json` 檢視每個 schema 的產物 ID

**設定未生效：**
- 確認檔案路徑為 `openspec/config.yaml`（而非 `.yml`）
- 使用驗證工具檢查 YAML 語法
- 設定更改會立即生效（無需重啟）

**上下文過大：**
- 上下文大小限制為 50KB
- 請改為概述內容，或連結到外部文件

## 命令

| 命令 | 功能 |
|---------|--------------|
| `/opsx:propose` | 一步建立變更並生成規劃產物（預設快速路徑） |
| `/opsx:explore` | 梳理想法、調查問題、明確需求 |
| `/opsx:new` | 建立新的變更腳手架（擴充套件工作流程） |
| `/opsx:continue` | 建立下一個產物（擴充套件工作流程） |
| `/opsx:ff` | 快速生成規劃產物（擴充套件工作流程） |
| `/opsx:apply` | 實作任務，並按需更新產物 |
| `/opsx:update` | 修改變更的規劃產物並保持一致 |
| `/opsx:verify` | 根據產物驗證實作（擴充套件工作流程） |
| `/opsx:sync` | 將增量規範合併到主規範（可選） |
| `/opsx:archive` | 完成後歸檔 |
| `/opsx:bulk-archive` | 批次歸檔已完成的變更（擴充套件工作流程） |
| `/opsx:onboard` | 引導完成端到端變更流程 |

## 用法

### 探索想法
```
/opsx:explore
```
梳理想法、調查問題、比較方案。不要求任何固定結構——它就是一個思考夥伴。想法逐漸清晰後，可以轉到 `/opsx:propose`（預設工作流程），或 `/opsx:new`/`/opsx:ff`（擴充套件工作流程）。

### 開始一項新變更
```
/opsx:propose
```
建立變更，並生成實作前所需的規劃產物。

如果啟用了擴充套件工作流程，也可以改用：

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### 建立產物
```
/opsx:continue
```
根據依賴關係顯示當前可建立的產物，然後建立其中一個。重複此操作即可逐步建置變更。

```
/opsx:ff add-dark-mode
```
一次性建立所有規劃產物。適用於你已明確要建置什麼的情況。

### 實作（靈活迭代的部分）
```
/opsx:apply
```
逐項處理任務，並在完成時勾選。如果同時處理多項變更，可以執行 `/opsx:apply <name>`；否則它會根據對話推斷目標變更，如果無法判斷則提示你選擇。

### 更新變更
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
修改變更現有的規劃產物，並確保各方向內容保持一致（例如修改設計可能會影響提案）。它不會編輯程式碼。每項編輯都會先與你確認。關於它如何處理缺失檔案而不建立新產物，請參閱[更新命令參考](/zh-Hant/commands/#opsxupdate)。

如果變更已經實作，它會建議執行 `/opsx:apply`，使程式碼與修訂後的計畫保持一致。如果修訂改變了變更的*意圖*，則應重新開始。參閱[何時更新，何時重新開始](#何時更新何時重新開始)。

### 同步增量規範
```text
/opsx:sync
```
將當前變更的增量規範合併到主 `openspec/specs/` 中，但不歸檔——該變更仍保持活動狀態。此操作會應用整個增量：`## REMOVED` 下的需求會從主規範中刪除，重新命名的需求會在原位置改名，增量未提及的內容則保持不變。同步是可選的——如果尚未同步，歸檔時會提示你先同步。以下情況適合使用同步：歸檔前先更新主規範；並行變更需要基於本次新增的規範繼續工作；或你想在歸檔前檢查合併後的主規範。

### 收尾
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## 何時更新，何時重新開始

實作之前，你隨時可以編輯提案或規範。但細化到什麼程度，就算是“另一項工作”？

### 提案涵蓋哪些內容

提案會定義三件事：
1. **意圖**——你要解決什麼問題？
2. **範圍**——哪些內容屬於範圍之內或之外？
3. **方案**——你將如何解決？

關鍵是：哪些內容發生了變化，變化有多大？

### 適合更新現有變更的情況：

**意圖相同，只是完善執行方式**
- 發現了之前未考慮到的邊界情況
- 需要調整方案，但目標沒有改變
- 實作過程中發現設計略有偏差

**縮小範圍**
- 發現完整範圍過大，希望先交付 MVP
- “新增暗色模式” → “新增暗色模式開關（系統偏好支援放到 v2）”

**根據新發現進行修正**
- 程式碼庫結構與你原先的設想不同
- 某個依賴的行為與預期不符
- “使用 CSS 變數” → “改用 Tailwind 的 `dark:` 字首”

### 適合開始新變更的情況：

**意圖發生根本變化**
- 要解決的問題本身已經不同
- “新增暗色模式” → “新增可自訂顏色、字型和間距的完整主題系統”

**範圍大幅膨脹**
- 變更增長到本質上已是另一項工作
- 更新後的內容會讓原始提案面目全非
- “修復登入錯誤” → “重寫身份驗證系統”

**原始工作已可完成**
- 原始變更已經可以標記為“完成”
- 新工作可以獨立成立，並非對原工作的細化
- 完成“新增暗色模式 MVP” → 歸檔 → 新建變更“增強暗色模式”

### 判斷依據

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

| 判斷項 | 更新 | 新建變更 |
|------|--------|------------|
| **本質** | “同一件事的完善” | “不同的工作” |
| **範圍重疊** | 重疊超過 50% | 重疊少於 50% |
| **完成條件** | 不做這些更改就無法“完成” | 原工作可以完成，新工作獨立成立 |
| **過程敘述** | 更新過程連貫合理 | 補丁式修改只會讓理解更混亂 |

### 原則

> **更新保留上下文；新建變更讓目標更清晰。**
>
> 當思考過程的歷史很有價值時，選擇更新。
> 當重新開始比修補舊方案更清楚時，選擇新建。

可以把它想象成 git 分支：
- 同一功能持續開發時，不斷提交
- 真正開始新工作時，建立新分支
- 有時先合併部分功能，再為第二階段重新開始

## 有何不同？

| | 舊版（`/openspec:proposal`） | OPSX（`/opsx:*`） |
|---|---|---|
| **結構** | 一份大型提案文件 | 彼此依賴的獨立產物 |
| **工作流程** | 線性階段：規劃 → 實作 → 歸檔 | 靈活操作——隨時執行任何操作 |
| **迭代** | 返回上一步不方便 | 根據新發現更新產物 |
| **定製** | 結構固定 | Schema 驅動（可定義自己的產物） |

**關鍵認識：**工作並非線性的。OPSX 不再假裝它是線性的。

## 架構深入解析

本節介紹 OPSX 的內部工作方式，以及它與舊版工作流程的區別。
本節範例使用擴充套件命令集（`new`、`continue` 等）；預設 `core` 使用者可將同樣的流程對映為 `propose → apply → sync → archive`。

### 理念：階段與操作

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

### 元件架構

**舊版工作流程**在 TypeScript 中使用硬編碼模板：

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

**OPSX** 使用外部 schema 和依賴關係圖引擎：

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

### 依賴圖模型

產物構成有向無環圖（DAG）。依賴關係是**啟用條件**，而非關卡：

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

**狀態轉換：**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### 資訊流

**舊版工作流程**——代理收到靜態指令：

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

**OPSX**——代理查詢豐富的上下文：

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

**舊版工作流程**——迭代過程很彆扭：

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

**OPSX**——自然地進行迭代：

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

### 自訂 Schema

使用 schema 管理命令建立自訂工作流程：

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

Schema 儲存在 `openspec/schemas/`（專案本地、納入版本控制）或 `~/.local/share/openspec/schemas/`（使用者全域）中。

**Schema 結構：**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**schema.yaml 範例：**
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

**依賴圖：**
```
   research ──► proposal ──► tasks
```

### 總結

| 方面 | 舊版 | OPSX |
|--------|----------|------|
| **模板** | 硬編碼的 TypeScript | 外部 YAML + Markdown |
| **依賴關係** | 無（一次性生成） | 透過拓撲排序處理 DAG |
| **狀態** | 基於階段的思維模型 | 根據檔案系統中的檔案是否存在判斷 |
| **定製** | 修改原始碼並重新建置 | 建立 schema.yaml |
| **迭代** | 受階段限制 | 靈活編輯任何內容 |
| **編輯器支援** | 特定工具的設定器/介面卡 | 統一的 skills 目錄 |

## Schema 列表

Schema 定義現有哪些產物及其依賴關係。目前可用的 schema：

- **spec-driven**（預設）：proposal → specs → design → tasks

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

- 在決定建立變更前，先用 `/opsx:explore` 梳理想法
- 明確目標時使用 `/opsx:ff`；仍在探索時使用 `/opsx:continue`
- 執行 `/opsx:apply` 時發現問題，就修正產物後繼續
- 透過 `tasks.md` 中的複選框追蹤任務進度
- 隨時執行 `openspec status --change "name"` 檢視狀態

## 回饋

目前還不夠完善，這是有意為之——我們還在探索什麼方法最有效。

發現錯誤或有改進建議？請加入 [Discord](https://discord.gg/YctCnvvshC)，或在 [GitHub](https://github.com/Fission-AI/openspec/issues) 上提交 issue。
