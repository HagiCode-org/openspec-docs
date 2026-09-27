---
title: "快速入門"
---

本指南介紹安裝並初始化 OpenSpec 後的使用方式。安裝說明請參閱[文件首頁](/zh-Hant/)或[安裝指南](/zh-Hant/installation/)。剛開始閱讀整套文件？請檢視[文件首頁](/zh-Hant/)，瞭解各文件內容。

> **這些命令應該在哪裡輸入？** 有兩個地方，混淆它們是初學者最常遇到的問題。
>
> - `openspec ...` 命令（例如 `openspec init`）在**終端**中執行。
> - `/opsx:...` 命令（例如 `/opsx:propose`）在 **AI 助手的聊天**中執行，也就是你平時讓它編寫程式碼的輸入框。
>
> 無需另外啟動“互動模式”。只需在聊天中輸入斜槓命令，助手便會接手處理。完整說明請參閱[命令的工作方式](/zh-Hant/how-commands-work/)。

## 前五分鐘

完整流程如下，並標明瞭每一步發生的位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

設定只需在終端中執行兩步，之後就在聊天中完成操作。本指南餘下部分將逐一介紹每一步的作用以及你會看到的內容。

**不想自己在終端中操作？** 將[設定提示詞](/zh-Hant/installation/)貼上給助手，它會處理這兩行命令，並報告建立了什麼。

> **還不確定要建置什麼？從 `/opsx:explore` 開始。** 它是一位沒有壓力的思考夥伴，會讀取程式碼庫、權衡選項，並在編寫任何程式碼之前，把模糊想法整理成具體計畫。思路明確後，它會交由 `/opsx:propose` 繼續。這是與 AI 合作時最值得養成的習慣，因為 AI 否則可能會自信地建置出錯誤的內容。參閱[探索指南](/zh-Hant/explore/)。

## 工作方式

OpenSpec 幫助你和 AI 程式設計助手在編寫程式碼之前，就要建置什麼達成一致。

**預設快捷路徑（core 設定檔案）：**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

還在考慮該做什麼時，從 `/opsx:explore` 開始；已經清楚要做什麼時，可以直接使用 `/opsx:propose`。預設設定檔案中包含 Explore，因此需要時隨時可用。

**擴充套件路徑（自訂工作流程選擇）：**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

預設的全域設定檔案是 `core`，其中包含 `propose`、`explore`、`apply`、`update`、`sync` 和 `archive`。你可以透過 `openspec config profile` 啟用擴充套件工作流程命令，然後執行 `openspec update`。

## OpenSpec 會建立什麼

執行 `openspec init` 後，專案會包含如下結構：

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

**兩個關鍵目錄：**

- **`specs/`**——唯一真實依據。這些規格說明描述系統當前的行為，並按領域組織（例如 `specs/auth/`、`specs/payments/`）。
- **`changes/`**——擬議的修改。每項變更都有自己的資料夾，其中包含所有相關產物。變更完成後，其規格說明會合併到主 `specs/` 目錄中。

## 理解產物

每個變更資料夾都包含用於指導工作的產物：

| 產物 | 用途 |
|----------|---------|
| `proposal.md` | “原因”和“內容”——記錄意圖、範圍和方案 |
| `specs/` | 透過 ADDED/MODIFIED/REMOVED 描述變更的差異規格說明 |
| `design.md` | “實作方式”——技術方案和架構決策 |
| `tasks.md` | 帶複選框的實作清單 |

**產物層層銜接：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

隨著實作過程中不斷了解新情況，你隨時可以回頭完善早期產物。

## 差異規格說明的工作方式

差異規格說明是 OpenSpec 的核心概念。它描述相對於當前規格說明發生了哪些變化。

### 格式

差異規格說明使用不同的章節標明變更型別：

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

### 歸檔時會發生什麼

歸檔變更時：

1. **ADDED** 需求會追加到主規格說明中。
2. **MODIFIED** 需求會替換已有版本。
3. **REMOVED** 需求會從主規格說明中刪除。

變更資料夾會移到 `openspec/changes/archive/`，以保留審計歷史。

## 範例：你的第一個變更

下面演示如何為應用新增深色模式。

### 1. 開始變更（預設方式）

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

如果你啟用了擴充套件工作流程設定檔案，也可以分兩步完成：先執行 `/opsx:new`，然後執行 `/opsx:ff`（或透過 `/opsx:continue` 逐步完成）。

### 2. 建立的內容

**proposal.md** ——記錄意圖：

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

**specs/ui/spec.md** ——描述新增需求的差異：

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

**tasks.md** ——實作清單：

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

### 3. 實作

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

實作過程中如果發現需要調整設計，只需更新相應產物並繼續即可。

### 4. 歸檔

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

現在，差異規格說明已經併入主規格說明，記錄了系統的工作方式。

## 驗證與審查

使用 CLI 檢查變更：

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

## 後續步驟

- [先探索](/zh-Hant/explore/)——在投入實作之前，使用 `/opsx:explore` 梳理想法
- [審查變更](/zh-Hant/reviewing-changes/)——在編寫程式碼之前，檢查 AI 起草的計畫
- [編寫良好的規格說明](/zh-Hant/writing-specs/)——瞭解優質需求和情境的寫法
- [在現有專案中使用 OpenSpec](/zh-Hant/existing-projects/)——從大型棕地程式碼庫開始使用
- [編輯和迭代變更](/zh-Hant/editing-changes/)——更新產物、返回前序步驟並協調手動編輯
- [核心概念速覽](/zh-Hant/overview/)——一頁瞭解完整思維模型
- [範例與配方](/zh-Hant/examples/)——完整的真實變更範例
- [工作流程](/zh-Hant/workflows/)——常用模式及命令的適用情境
- [命令](/zh-Hant/commands/)——所有斜槓命令的完整參考
- [概念](/zh-Hant/concepts/)——深入瞭解規格說明、變更和模式
- [自訂](/zh-Hant/customization/)——按自己的方式使用 OpenSpec
- [儲存庫](/zh-Hant/stores-beta/user-guide/)——規劃跨越多個儲存庫或團隊？將規劃放在獨立儲存庫中（beta）
- [常見問題](/zh-Hant/faq/)與[故障排除](/zh-Hant/troubleshooting/)——遇到問題時查閱
