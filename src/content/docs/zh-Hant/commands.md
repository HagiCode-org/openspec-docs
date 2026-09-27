---
title: "命令"
---

本頁是 OpenSpec 斜槓命令參考。這些命令應在 AI 程式設計助手的聊天介面中呼叫（例如 Claude Code、Cursor、Devin Desktop）。

工作流程模式以及每個命令的適用情境，請參閱[工作流程](/zh-Hant/workflows/)。CLI 命令請參閱 [CLI](/zh-Hant/cli/)。

本文使用 `/opsx:<command>` 作為標準形式。部分工具的拼寫不同——Cursor 和 GitHub Copilot 註冊為 `/opsx-propose`，Codex 使用 `$openspec-propose`——因此請檢視[如何呼叫](/zh-Hant/supported-tools/)中適用於你所用工具的格式。OpenSpec 生成的檔案已經採用正確形式。

## 快速參考

### 預設快捷路徑（`core` 設定檔案）

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 建立變更，並在一步中生成規劃產物 |
| `/opsx:explore` | 在確定變更方案之前梳理想法 |
| `/opsx:apply` | 實作變更中的任務 |
| `/opsx:update` | 修改變更的規劃產物並保持內容協調 |
| `/opsx:sync` | 將差異規格說明合併到主規格說明 |
| `/opsx:archive` | 歸檔已完成的變更 |

### 擴充套件工作流程命令（自訂工作流程選擇）

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 建立新的變更腳手架 |
| `/opsx:continue` | 根據依賴關係建立下一個產物 |
| `/opsx:ff` | 快進：一次性建立所有規劃產物 |
| `/opsx:verify` | 驗證實作是否符合產物 |
| `/opsx:bulk-archive` | 一次性歸檔多個變更 |
| `/opsx:onboard` | 透過完整工作流程進行引導式教程 |

預設全域設定檔案為 `core`。若要啟用擴充套件工作流程命令，請執行 `openspec config profile` 並選擇工作流程，然後在專案中執行 `openspec update`。

---

## 命令參考

### `/opsx:propose`

新建變更，並在一步中生成規劃產物。這是 `core` 設定檔案中的預設起始命令。

**語法：**
```text
/opsx:propose [change-name-or-description]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name-or-description` | 否 | kebab-case 名稱或自然語言變更描述 |

**功能：**

- 建立 `openspec/changes/<change-name>/`
- 生成實作之前所需的產物（對於 `spec-driven`：proposal、specs、design、tasks）
- 變更準備好使用 `/opsx:apply` 後停止

**範例：**
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

- 如需最快的端到端流程，請使用此命令。
- 如果希望逐步控制產物建立，請啟用擴充套件工作流程並使用 `/opsx:new` + `/opsx:continue`。

---

### `/opsx:explore`

> **拿不準時從這裡開始。** Explore 是一位沒有壓力的思考夥伴：它會讀取程式碼庫、比較方案，並在編寫任何程式碼之前，把模糊想法整理成具體計畫。它已包含在預設設定檔案中。完整說明和更多範例請參閱[先探索](/zh-Hant/explore/)指南。

在確定變更方案之前梳理想法、調查問題並明確需求。

**語法：**
```
/opsx:explore [topic]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 想要探索或調查的內容 |

**功能：**

- 無需固定結構即可展開探索式對話
- 調查程式碼庫以回答問題
- 比較選項和方案
- 建立視覺化圖表以輔助梳理思路
- 在你要求記錄探索結果，或接受它的提議時，使用 `openspec new change` 搭建變更並編寫你指定的規劃產物，或更新現有變更的產物
- 當思路明確後，可轉交給 `/opsx:propose`（預設）或 `/opsx:new`（擴充套件工作流程）

**範例：**
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

- 需求不明確或需要調查時使用。
- 它絕不會編寫程式碼；除非你提出要求或接受它的建議，否則也不會寫入其他內容。
- 適合在作出決定前比較多種方案。
- 可以讀取檔案並搜尋程式碼庫。

---

### `/opsx:new`

建立新的變更腳手架。此命令會建立變更資料夾，隨後等待你使用 `/opsx:continue` 或 `/opsx:ff` 生成產物。

此命令屬於擴充套件工作流程集（預設的 `core` 設定檔案不包含）。

**語法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 變更資料夾名稱（未提供時會提示輸入） |
| `--schema` | 否 | 要使用的工作流程模式（預設來自設定或 `spec-driven`） |

**功能：**

- 建立 `openspec/changes/<change-name>/` 目錄
- 在變更資料夾中建立 `.openspec.yaml` 元資料檔案
- 顯示可供建立的第一個產物模板
- 未提供時提示輸入變更名稱和模式

**建立內容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**範例：**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**提示：**

- 使用描述性名稱：`add-feature`、`fix-bug`、`refactor-module`。
- 避免使用 `update`、`changes`、`wip` 等泛化名稱。
- 也可以在專案設定 (`openspec/config.yaml`) 中設定模式。

---

### `/opsx:continue`

沿依賴鏈建立下一個產物。每次只建立一個產物，以便逐步推進。

**語法：**
```
/opsx:continue [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要繼續處理的變更（未提供時根據上下文推斷） |

**功能：**

- 查詢產物依賴圖
- 顯示哪些產物已就緒，哪些仍受阻
- 建立第一個就緒的產物
- 讀取依賴檔案以獲取上下文
- 顯示建立後哪些產物變為可用

**範例：**
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

- 希望在繼續之前先審查每個產物時使用。
- 適用於複雜變更，方便你掌控流程。
- 多個產物可能會同時就緒。
- 繼續之前可以編輯已建立的產物。

---

### `/opsx:ff`

快進建立產物，一次性建立所有規劃產物。

**語法：**
```
/opsx:ff [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要快進處理的變更（未提供時根據上下文推斷） |

**功能：**

- 按依賴順序建立所有產物
- 透過待辦列表追蹤進度
- 所有 `apply-required` 產物完成後停止
- 建立下一個產物之前先讀取每項依賴

**範例：**
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

- 已經清楚要建置什麼時使用。
- 對於簡單明瞭的變更，比 `/opsx:continue` 更快。
- 之後仍然可以編輯產物。
- 適合中小型功能。

---

### `/opsx:apply`

實作變更中的任務。它會逐項執行任務清單、編寫程式碼並勾選已完成專案。

**語法：**
```
/opsx:apply [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要實作的變更（未提供時根據上下文推斷） |

**功能：**

- 讀取 `tasks.md` 並找出未完成的任務
- 逐項執行任務
- 根據需要編寫程式碼、建立檔案和執行測試
- 使用複選框 `[x]` 標記已完成的任務

**範例：**
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

- 如果中斷，可以從上次進度繼續。
- 並行處理多項變更時，可指定變更名稱。
- 完成狀態記錄在 `tasks.md` 的複選框中。

---

### `/opsx:update`

修改變更中已有的規劃產物，並協調它們之間的內容。此命令僅處理規劃產物，不會修改程式碼。

**語法：**

```text
/opsx:update [change-name]
```

**引數：**

| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要更新的變更（未提供時根據上下文推斷） |

**功能：**

- 透過 `openspec status --change <name> --json` 讀取變更產物
- 根據你的要求修改，或在未指定修改內容時檢查產物之間是否矛盾
- 可沿任一方向協調其他已有產物（一處設計修改可能需要回頭調整提案）
- 每次只處理一個產物，並在寫入前逐項向你確認所有修改
- 最後建議下一步操作：`/opsx:continue`（存在尚未開始的產物）、`/opsx:apply`（將修改後的計畫用於程式碼實作），或 `/opsx:archive`（全部完成）

**缺少的檔案：**

- 如果 glob 產物（例如 `specs/**/*.md`）至少有一個現有檔案，update 可以建議建立缺少的配套檔案。它會使用模式中的指令，並在建立前要求你確認具體路徑。
- 尚無任何檔案的產物仍應使用 `/opsx:continue`。有意跳過的產物不會受影響。
- 新檔案必須位於變更目錄內。如果建立前確認的路徑上已出現檔案，update 會停止，而不會覆蓋它。

**範例：**

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

- 如果尚無產物檔案，它不會啟動產物建立。若已安裝，可使用 `/opsx:continue`；否則可使用 `openspec status` 和 `openspec instructions`。
- 如果變更已經實作，隨後應執行 `/opsx:apply`，讓程式碼符合修訂後的計畫。
- 如果修訂改變了變更的*意圖*，應新建變更，而不是更新現有變更（參閱[何時更新，何時重新開始](/zh-Hant/opsx/)）。

---

### `/opsx:verify`

驗證實作是否符合變更產物，檢查完整性、正確性和一致性。

**語法：**
```
/opsx:verify [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要驗證的變更（未提供時根據上下文推斷） |

**功能：**

- 從三個維度檢查實作品質
- 在程式碼庫中搜索實作證據
- 將問題分為 CRITICAL、WARNING 或 SUGGESTION
- 不會阻止歸檔，但會指出問題

**驗證維度：**

| 維度 | 驗證內容 |
|-----------|-------------------|
| **完整性** | 所有任務是否完成、所有需求是否實作、情境是否覆蓋 |
| **正確性** | 實作是否符合規格意圖、邊界情況是否處理 |
| **一致性** | 設計決策是否體現在程式碼中、模式是否一致 |

**範例：**
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

- 歸檔前執行它，以便及早發現不一致。
- 警告不會阻止歸檔，但可能指出潛在問題。
- 提交前可用它審查 AI 的工作。
- 它可以發現產物與實作之間的偏差。

---

### `/opsx:sync`

**可選命令。** 將變更中的差異規格說明合併到主規格說明。如果需要同步，Archive 會主動提示，因此通常無需手動執行此命令。

**語法：**
```
/opsx:sync [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要同步的變更（未提供時根據上下文推斷） |

**功能：**

- 從變更資料夾讀取差異規格說明
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 章節
- 將變更合併到主 `openspec/specs/` 目錄
- 保留差異中未提及的現有內容
- 不會歸檔變更（變更仍保持活動狀態）

**範例：**
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

**何時手動執行：**

| 情境 | 是否使用 sync？ |
|----------|-----------|
| 長期變更，希望在歸檔前先將規格說明合併到主規格中 | 是 |
| 多項並行變更需要以更新後的主規格說明為基礎 | 是 |
| 想單獨預覽/審查合併結果 | 是 |
| 快速完成變更並直接歸檔 | 否（archive 會處理） |

**提示：**

- Sync 是智慧合併，而非複製貼上。
- 可以向現有需求新增情境而不重複建立。
- 同步後變更仍保持活動狀態（不會歸檔）。
- 大多數使用者永遠不需要直接呼叫此命令——如有需要，Archive 會提示。

---

### `/opsx:archive`

歸檔已完成的變更，使其結束並移至歸檔資料夾。

**語法：**
```
/opsx:archive [change-name]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要歸檔的變更（未提供時根據上下文推斷） |

**功能：**

- 檢查產物完成狀態
- 檢查任務完成情況（如有未完成項則發出警告）
- 如果差異規格說明尚未同步，則詢問是否同步
- 將變更資料夾移至 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有產物作為審計記錄

**範例：**
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

- 有未完成任務不會阻止歸檔，但會發出警告。
- 可以在歸檔期間或之前同步差異規格說明。
- 歸檔的變更會保留作為歷史記錄。
- 可先使用 `/opsx:verify` 檢查問題。

---

### `/opsx:bulk-archive`

一次性歸檔多個已完成的變更，並處理它們之間的規格衝突。

**語法：**
```
/opsx:bulk-archive [change-names...]
```

**引數：**
| 引數 | 必需 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要歸檔的指定變更（未提供時會提示選擇） |

**功能：**

- 列出所有已完成的變更
- 歸檔前驗證每項變更
- 檢測不同變更之間的規格衝突
- 根據實際實作情況解決衝突
- 按時間順序歸檔

**範例：**
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

- 適用於並行工作流程。
- 衝突解決由智慧代理程式完成（會檢查程式碼庫）。
- 按建立順序歸檔變更。
- 覆蓋規格內容前會提示。

---

### `/opsx:onboard`

引導你走完完整的 OpenSpec 工作流程。這是一種基於真實程式碼庫的互動式教程。

**語法：**
```
/opsx:onboard
```

**功能：**

- 透過講解帶你完整走過一次工作流程
- 掃描程式碼庫以尋找真實的改進機會
- 建立包含真實產物的實際變更
- 實作實際工作（規模小且安全的改動）
- 歸檔完成的變更
- 在每一步發生時說明操作原因

**階段：**

1. 歡迎並分析程式碼庫
2. 尋找改進機會
3. 建立變更 (`/opsx:new`)
4. 編寫提案
5. 建立規格說明
6. 編寫設計
7. 建立任務
8. 實作任務 (`/opsx:apply`)
9. 驗證實作
10. 歸檔變更
11. 總結並說明後續步驟

**範例：**
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

- 適合剛開始學習工作流程的新使用者。
- 使用真實程式碼，而不是玩具範例。
- 會建立真實變更，你可以選擇保留或放棄。
- 整個過程需要 15–30 分鐘。

---

## 不同 AI 工具的命令語法

不同 AI 工具使用的命令語法略有區別。請使用與你的工具對應的格式：

| 工具的命令檔案 | 語法範例 | 範例工具 |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`、`/opsx:apply` | Claude Code、Gemini CLI、Crush |
| `.../opsx-<id>.*` | `/opsx-propose`、`/opsx-apply` | Cursor、Devin Desktop、Copilot（IDE）、Trae、Oh My Pi |
| 無——僅支援技能 | `/openspec-propose`、`/openspec-apply-change` | CodeArts、ForgeCode、Hermes、MiniMax Code、Mistral Vibe、Zed Agent、共享 `.agents` |
| 無——Kimi Code | `/skill:openspec-propose` | Kimi Code |
| 無——Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop 與 Devin Local：** `.devin/workflows/opsx-*.md` 檔案會為 Devin Desktop 提供 `/opsx-propose`。Devin Local 沒有工作流程——請使用 OpenSpec 寫入 `.devin/skills/` 的技能，例如 `/openspec-propose`；兩種智慧代理程式均可使用這些技能。

不同工具中的命令意圖相同，但呈現方式可能因整合而異。[如何呼叫](/zh-Hant/supported-tools/)列出了所有受支援的工具；此表只展示各類格式的範例。

> **注意：** GitHub Copilot 命令 (`.github/prompts/*.prompt.md`) 僅適用於 IDE 擴充套件（VS Code、JetBrains、Visual Studio）。GitHub Copilot CLI 目前不支援自訂提示檔案；詳情和替代方案請參閱[支援的工具](/zh-Hant/supported-tools/)。

---

## 舊版命令

這些命令使用較早的“一次性全部生成”工作流程。它們仍可使用，但建議採用 OPSX 命令。

| 命令 | 功能 |
|---------|--------------|
| `/openspec:proposal` | 一次性建立所有產物（proposal、specs、design、tasks） |
| `/openspec:apply` | 實作變更 |
| `/openspec:archive` | 歸檔變更 |

**適合使用舊版命令的情況：**
- 使用舊工作流程的現有專案
- 無需逐步建立產物的簡單變更
- 傾向於一次性完成所有工作的方式

**遷移到 OPSX：**
可以使用 OPSX 命令繼續處理舊版變更。兩者的產物結構相容。

---

## 故障排除

### “未找到變更”

命令無法確定要處理哪項變更。

**解決方法：**
- 明確指定變更名稱：`/opsx:apply add-dark-mode`
- 檢查變更資料夾是否存在：`openspec list`
- 確認當前位於正確的專案目錄

### “沒有就緒的產物”

所有產物都已完成，或因缺少依賴項而受阻。

**解決方法：**
- 執行 `openspec status --change <name>` 檢視受阻原因
- 檢查所需產物是否存在
- 先建立缺少的依賴產物

### “未找到 Schema”

指定的 schema 不存在。

**解決方法：**
- 列出可用 schema：`openspec schemas`
- 檢查 schema 名稱拼寫
- 如果是自訂 schema，請建立它：`openspec schema init <name>`

### 無法識別命令

AI 工具無法識別 OpenSpec 命令。

**解決方法：**
- 確認已初始化 OpenSpec：`openspec init`
- 重新生成 skills：`openspec update`
- 檢查 `.claude/skills/` 目錄是否存在（Claude Code）
- 重啟 AI 工具，使其載入新 skills

### 產物生成不正確

AI 建立的產物不完整或有誤。

**解決方法：**
- 在 `openspec/config.yaml` 中新增專案上下文
- 為具體指導新增產物級規則
- 在變更描述中提供更多細節
- 使用 `/opsx:continue` 而非 `/opsx:ff`，以便更細緻地控制流程

---

## 後續步驟

- [工作流程](/zh-Hant/workflows/)——常見模式以及各命令的適用時機
- [CLI](/zh-Hant/cli/)——用於管理和驗證的終端命令
- [定製](/zh-Hant/customization/)——建立自訂 schema 和工作流程
