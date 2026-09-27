---
title: "概念"
---

本指南介紹 OpenSpec 的核心理念及它們如何相互配合。實踐操作請參閱[快速入門](/zh-Hant/getting-started/)和[工作流程](/zh-Hant/workflows/)。

## 理念

OpenSpec 圍繞四項原則建置：

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### 為什麼這些原則重要

**靈活而非僵化。** 傳統規格說明系統會將工作鎖定在不同階段：先規劃，再實作，最後完成。OpenSpec 更靈活——你可以按照最適合當前工作的順序建立產物。

**迭代而非瀑布。** 需求會變化，理解會加深。起初看似可行的方案，在瞭解程式碼庫後可能並不合適。OpenSpec 接受並支援這種現實情況。

**簡單而非複雜。** 有些規格框架要求大量設定、僵硬格式或繁重流程。OpenSpec 不會擋你的路：幾秒鐘內完成初始化，立即開始工作，只在需要時自訂。

**優先面向棕地專案。** 大多數軟體工作不是從零建置，而是修改現有系統。OpenSpec 基於差異的方式讓你能夠輕鬆描述現有行為的變化，而不僅僅是描述全新的系統。

## 整體結構

OpenSpec 將工作組織到兩個主要區域：

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

**規格說明**是唯一真實依據，描述系統當前的行為。

**變更**是擬議的修改；在準備好合併之前，它們一直儲存在獨立資料夾中。

這種分離至關重要。你可以並行處理多項變更而不會相互衝突，可以在變更影響主規格說明之前先審查它。歸檔變更時，其差異會清晰地合併到唯一真實依據中。

## 規格說明

規格說明使用結構化的需求和情境描述系統行為。

### 結構

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

按領域組織規格說明——領域是符合系統邏輯的分組。常見模式包括：

- **按功能區域：** `auth/`、`payments/`、`search/`
- **按元件：** `api/`、`frontend/`、`workers/`
- **按有界上下文：** `ordering/`、`fulfillment/`、`inventory/`

### 規格說明格式

規格說明由需求組成，每項需求都包含情境：

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

**關鍵要素：**

| 要素 | 用途 |
|---------|---------|
| `## Purpose` | 對該規格說明所涉領域的高層描述 |
| `### Requirement:` | 系統必須具備的一種具體行為 |
| `#### Scenario:` | 需求實際生效時的具體範例 |
| SHALL/MUST/SHOULD | 表示需求嚴格程度的 RFC 2119 關鍵詞 |

### 為什麼規格說明採用這種結構

**需求描述“做什麼”**——它們說明系統應該做什麼，而不指定具體實作。

**情境描述“何時發生”**——它們提供可以驗證的具體範例。優質情境應當：

- 可測試（可以據此編寫自動化測試）
- 同時涵蓋正常流程和邊界情況
- 使用 Given/When/Then 或類似的結構化格式

**RFC 2119 關鍵詞**（SHALL、MUST、SHOULD、MAY）用於表達要求的嚴格程度：

- **MUST/SHALL**——絕對要求
- **SHOULD**——建議遵循，但允許例外
- **MAY**——可選

### 規格說明是什麼（以及不是什麼）

規格說明是**行為約定**，不是實作計畫。

適合寫入規格說明的內容：

- 使用者或下游系統依賴的可觀察行為
- 輸入、輸出和錯誤情況
- 外部約束（安全、隱私、可靠性、相容性）
- 可以測試或明確驗證的情境

避免寫入規格說明的內容：

- 內部類/函式名稱
- 庫或框架的選擇
- 逐步實作細節
- 詳細執行計畫（這些屬於 `design.md` 或 `tasks.md`）

快速判斷：

- 如果改變實作方式而不影響外部可見行為，該內容通常不屬於規格說明。

### 保持輕量：逐步提高嚴謹程度

OpenSpec 希望避免官僚流程。選擇仍能讓變更可驗證的最輕量方式。

**輕量規格說明（預設）：**

- 簡短且以行為為主的需求
- 範圍清楚，包含明確的非目標
- 若干具體的驗收檢查

**完整規格說明（適用於較高風險）：**

- 跨團隊或跨儲存庫的變更
- API/約定變更、遷移、安全或隱私問題
- 歧義可能造成昂貴返工的變更

大多數變更都應採用輕量模式。

### 人與智慧代理程式協作

在許多團隊中，人負責探索，智慧代理程式負責起草產物。預期的工作迴圈如下：

1. 人提供意圖、上下文和約束。
2. 智慧代理程式將這些內容整理成以行為為先的需求和情境。
3. 智慧代理程式將實作細節放在 `design.md` 和 `tasks.md`，而不是 `spec.md` 中。
4. 實作之前先驗證結構和清晰度。

這樣可以讓規格說明既便於人閱讀，又便於智慧代理程式一致地處理。

## 變更

變更是對系統擬議的一項修改，會打包成一個資料夾，其中包含理解和實作該變更所需的一切內容。

### 變更結構

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

每項變更都自成一體，包含：

- **產物**——記錄意圖、設計和任務的文件
- **差異規格說明**——描述新增、修改或移除內容的規格說明
- **元資料**——針對該項變更的可選設定

### 為什麼變更採用資料夾形式

將變更打包成資料夾有多項好處：

1. **內容集中。** 提案、設計、任務和規格說明都放在同一處，不必四處尋找。
2. **支援並行工作。** 多項變更可以同時存在而互不衝突；你可以在處理 `add-dark-mode` 時，同時推進 `fix-auth-bug`。
3. **歷史清晰。** 歸檔後，變更會連同完整上下文一起移入 `changes/archive/`。日後可以瞭解不僅改了什麼，也能瞭解為什麼要改。
4. **便於審查。** 變更資料夾容易審查——開啟資料夾，閱讀提案、檢查設計、檢視規格差異即可。

## 產物

產物是變更中的文件，用於指導工作。

### 產物流轉順序

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

產物層層銜接：每項產物都會為下一項提供上下文。

### 產物型別

#### 提案 (`proposal.md`)

提案從高層次記錄**意圖**、**範圍**和**方案**。

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

**以下情形應更新提案：**

- 範圍發生變化（縮小或擴大）
- 意圖更加明確（對問題有了更深入的理解）
- 方案發生根本變化

#### 規格說明（`specs/` 下的差異規格說明）

差異規格說明描述相對於當前規格說明**發生了什麼變化**。詳見下文的[差異規格說明](#差異規格說明)。

#### 設計 (`design.md`)

設計記錄**技術方案**和**架構決策**。

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

**以下情形應更新設計：**

- 實作過程中發現方案不可行
- 找到更好的解決辦法
- 依賴項或約束髮生變化

#### 任務 (`tasks.md`)

任務是**實作清單**，由帶複選框的具體步驟組成。

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

**任務最佳實踐：**

- 使用標題對相關任務分組
- 使用層級編號（1.1、1.2 等）
- 任務粒度應足以在一次工作時段內完成
- 說明每項任務如何驗證（測試、命令或可觀察結果）
- 每組工作需要的測試和文件應放在該組中完成，而不是留到最後補做
- 完成任務後勾選

## 差異規格說明

差異規格說明是讓 OpenSpec 適用於棕地開發的關鍵概念。它描述**發生了什麼變化**，而不是重述整份規格說明。

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

### 差異章節

| 章節 | 含義 | 歸檔時的處理方式 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新行為 | 追加到主規格說明 |
| `## MODIFIED Requirements` | 變更後的行為 | 替換現有需求 |
| `## REMOVED Requirements` | 已廢棄的行為 | 從主規格說明中刪除；若移除最後一項需求，則會廢棄該能力並刪除其規格檔案（前提是變更聲明瞭 `retire_capabilities: true`） |
| `## Purpose` | 新建能力的用途 | 用作新建主規格說明的 Purpose；規格說明已存在時會忽略 |

### 為什麼使用差異而不是完整規格說明

**明確。** 差異會精確展示發生變化的部分。閱讀完整規格說明時，你必須在腦中將它與當前版本進行比較。

**避免衝突。** 兩項變更可以修改同一規格檔案的不同需求而不發生衝突。

**提高審查效率。** 審查者看到的是變更內容，而非未變化的上下文，可以專注於重要部分。

**適合棕地專案。** 大多數工作都是修改現有行為。差異讓修改成為核心功能，而非事後補充。

## 模式

模式定義工作流程中的產物型別及其依賴關係。

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

**產物構成依賴圖：**

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

**依賴關係是助力，而非關卡。** 它們指出可以建立哪些內容，而不是下一步必須建立什麼。如果不需要設計文件，可以跳過 design。規格說明可以在設計之前或之後建立，因為兩者都只依賴 proposal。

### 內建模式

**spec-driven**（預設）

適用於規格驅動開發的標準工作流程：

```
proposal → specs → design → tasks → implement
```

適用情境：大多數功能開發——你希望在實作前先就規格說明達成一致。

### 自訂模式

可以為團隊工作流程建立自訂模式：

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**自訂模式範例：**

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

有關建立和使用自訂模式的完整詳情，請參閱[自訂](/zh-Hant/customization/)。

## 歸檔

歸檔會將變更的差異規格說明合併到主規格說明中，並保留變更作為歷史記錄，從而完成該變更。

### 歸檔時會發生什麼

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

### 歸檔流程

1. **合併差異。** 每份差異規格說明中的 ADDED/MODIFIED/REMOVED 章節都會應用到相應的主規格說明中。
2. **移入歸檔。** 變更資料夾會帶日期字首移至 `changes/archive/`，以便按時間排序。
3. **保留上下文。** 所有產物都會完整保留在歸檔中。你隨時可以回顧變更原因。

### 歸檔為何重要

**保持狀態整潔。** 活動變更目錄 (`changes/`) 只顯示正在進行的工作。已完成的工作會移出活動區。

**留下審計記錄。** 歸檔會保留每項變更的完整上下文——不僅有變更內容，還包括說明原因的提案、說明實作方式的設計，以及展示完成工作的任務清單。

**推動規格說明演進。** 規格說明會隨變更歸檔逐漸完善。每次歸檔都會合並差異，長期積累成完整規格說明。

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

**良性迴圈：**

1. 規格說明描述當前行為
2. 變更透過差異提出修改
3. 實作讓變更成為現實
4. 歸檔將差異合併進規格說明
5. 規格說明由此描述新的行為
6. 後續變更以更新後的規格說明為基礎

## 術語表

| 術語 | 定義 |
|------|------------|
| **產物** | 變更中的文件（提案、設計、任務或差異規格說明） |
| **歸檔** | 完成變更並將其差異合併到主規格說明中的過程 |
| **變更** | 對系統擬議的一項修改，以包含產物的資料夾形式打包 |
| **差異規格說明** | 相對於當前規格說明描述變更（ADDED/MODIFIED/REMOVED）的規格說明 |
| **領域** | 規格說明的邏輯分組（例如 `auth/`、`payments/`） |
| **需求** | 系統必須具備的一種具體行為 |
| **情境** | 需求的具體範例，通常採用 Given/When/Then 格式 |
| **模式** | 對產物型別及其依賴關係的定義 |
| **規格說明** | 描述系統行為，並包含需求和情境的規範 |
| **唯一真實依據** | `openspec/specs/` 目錄，包含當前已達成一致的行為 |

## 後續步驟

- [快速入門](/zh-Hant/getting-started/)——實踐起步指南
- [工作流程](/zh-Hant/workflows/)——常見模式及各自的適用情境
- [命令](/zh-Hant/commands/)——完整命令參考
- [自訂](/zh-Hant/customization/)——建立自訂模式並設定專案
