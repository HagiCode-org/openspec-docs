---
title: "遷移到 OPSX"
---

本指南幫助你從舊版 OpenSpec 工作流程遷移到 OPSX。遷移過程旨在平穩完成——現有工作會得到保留，新系統則提供更大的靈活性。

## 有哪些變化？

OPSX 以靈活、基於操作的方式取代了舊版受階段限制的工作流程。主要變化如下：

| 方面 | 舊版 | OPSX |
|--------|--------|------|
| **命令** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 預設：`/opsx:propose`、`/opsx:explore`、`/opsx:apply`、`/opsx:update`、`/opsx:sync`、`/opsx:archive`（可選擴充套件工作流程命令） |
| **工作流程** | 一次建立全部產物 | 可以逐步建立，也可以一次建立——由你決定 |
| **返回修改** | 階段關卡讓返回很不方便 | 隨時自然更新任何產物 |
| **自訂** | 固定結構 | 由模式驅動，可充分修改 |
| **設定** | 帶標記的 `CLAUDE.md` + `project.md` | 使用 `openspec/config.yaml` 中的清晰設定 |

**理念上的變化：** 工作並非線性的。OPSX 不再假裝它是線性的。

---

## 開始之前

### 現有工作會得到保護

遷移過程以保留現有內容為設計目標：

- **`openspec/changes/` 中的活動變更**——完整保留，可以繼續使用 OPSX 命令處理。
- **已歸檔的變更**——不會改動，歷史記錄保持完整。
- **`openspec/specs/` 中的主規格說明**——不會改動，它們仍是唯一真實依據。
- **`CLAUDE.md`、`AGENTS.md` 等檔案中的自有內容**——會予以保留。只會移除 OpenSpec 標記塊，你編寫的其他內容都會保留。

### 將被移除的內容

只會移除即將被替代、由 OpenSpec 管理的檔案：

| 內容 | 原因 |
|------|-----|
| 舊版斜槓命令目錄/檔案 | 由新的技能系統取代 |
| `openspec/AGENTS.md` | 已過時的工作流程觸發檔案 |
| `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記 | 不再需要 |

**各工具的舊版命令位置**（以下只是範例，實際位置可能不同）：

- Claude Code：`.claude/commands/openspec/`
- Cursor：`.cursor/commands/openspec-*.md`
- Devin Desktop，原 Windsurf：`.windsurf/workflows/openspec-*.md`
- Cline：`.clinerules/workflows/openspec-*.md`
- Roo：`.roo/commands/openspec-*.md`
- GitHub Copilot：`.github/prompts/openspec-*.prompt.md`（僅適用於 IDE 擴充套件；Copilot CLI 不支援）
- Codex：OpenSpec 現在使用規範的 `.agents/skills/openspec-*` 路徑。只有在替代檔案已存在後，才會協調舊版 `.codex/skills` 路徑下由 OpenSpec 管理的 `SKILL.md` 檔案；自訂檔案和不一致的副本會保留。如果未標記的 `.agents` 技能樹中已有 OpenSpec 技能，OpenSpec 會保留現有的 Codex (`$openspec-*`) 或通用 (`/openspec-*`) 呼叫形式，而不會根據舊目錄猜測。執行 `openspec init` 時顯式選擇 `codex` 可切換所有權。清理舊版提示詞時，也只會處理 OpenSpec 允許列表中位於 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 的檔名。
- 以及其他工具（Augment、Continue、Amazon Q 等）

遷移會檢測你已設定的工具，並清理它們的舊版檔案。

移除列表可能看起來很長，但這些檔案原本都是由 OpenSpec 建立的。不會刪除你自己的內容。

### 需要你處理的內容

有一個檔案需要手動遷移：

**`openspec/project.md`**——由於此檔案可能包含你編寫的專案上下文，因此不會自動刪除。你需要：

1. 檢查檔案內容。
2. 將有用的上下文移至 `openspec/config.yaml`（參閱下方說明）。
3. 準備好後刪除該檔案。

**為什麼要做此更改：**

舊版 `project.md` 是被動檔案——智慧代理程式可能會閱讀，也可能不會；即使讀了，也可能忘記其中內容。我們發現這種做法的可靠性參差不齊。

新的 `config.yaml` 上下文會**主動注入每個 OpenSpec 規劃請求**。這意味著 AI 建立產物時始終能獲得專案約定、技術棧和規則，從而提高可靠性。

**需要權衡的地方：**

由於上下文會注入每個請求，因此應儘量簡潔。請聚焦於真正重要的內容：

- 技術棧和關鍵約定
- AI 需要知道、但不容易推斷出的限制
- 過去經常被忽略的規則

不必追求一次做到完美。我們仍在摸索最佳做法，並會在嘗試過程中持續改進上下文注入機制。

---

## 執行遷移

`openspec init` 和 `openspec update` 都會檢測舊版檔案，並引導你執行相同的清理流程。根據實際情況任選其一：

- 新安裝預設使用 `core` 設定檔案（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）。
- 遷移現有安裝時，如果需要，會透過寫入 `custom` 設定檔案來保留你之前安裝的工作流程。

### 使用 `openspec init`

如果你要新增新工具，或重新設定已設定的工具，請執行：

```bash
openspec init
```

`init` 命令會檢測舊版檔案，並引導你完成清理：

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**選擇是之後會發生什麼：**

1. 移除舊版斜槓命令目錄。
2. 移除 `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記（自有內容會保留）。
3. 刪除 `openspec/AGENTS.md`。
4. 在 `.claude/skills/` 中安裝新技能。
5. 建立包含預設模式的 `openspec/config.yaml`。

### 使用 `openspec update`

如果你只想遷移並將現有工具重新整理到最新版本，請執行：

```bash
openspec update
```

`update` 也會檢測並清理舊版產物，然後重新整理生成的技能/命令，使其符合當前設定檔案和交付設定。

### 非互動式/CI 環境

如需透過指令碼遷移：

```bash
openspec init --force --tools claude
```

`--force` 會跳過提示，並自動確認清理操作。

這也包括清理全域 Codex 提示詞目錄中由 OpenSpec 管理的提示詞檔案。清理範圍僅限 OpenSpec 允許列表中的舊版 Codex 提示詞檔名；只有替代的 `.agents/skills/openspec-*` 技能已存在時才會刪除，並保留其他所有檔案。

---

## 將 project.md 遷移到 config.yaml

舊版 `openspec/project.md` 是用於存放專案上下文的自由格式 Markdown 檔案。新的 `openspec/config.yaml` 採用結構化格式；更重要的是，內容會**注入每個規劃請求**，確保 AI 工作時始終可以獲取你的約定。

### 遷移前（project.md）

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 遷移後（config.yaml）

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 主要區別

| project.md | config.yaml |
|------------|-------------|
| 自由格式 Markdown | 結構化 YAML |
| 一整塊文字 | 區分上下文和產物級規則 |
| 使用時機不明確 | 上下文出現在所有產物中；規則只出現在匹配的產物中 |
| 無法選擇模式 | 透過顯式的 `schema:` 欄位設定預設工作流程 |

### 保留什麼，刪除什麼

遷移時要有選擇地保留。問問自己：“AI 每次規劃時都需要這些內容嗎？”

**適合放入 `context:` 的內容**

- 技術棧（語言、框架、資料庫）
- 關鍵架構模式（單體儲存庫、微服務等）
- 不容易推斷出的限制（“因為……，我們不能使用庫 X”）
- 經常被忽視的重要約定

**改放到 `rules:`**

- 僅針對特定產物的格式要求（“規格說明使用 Given/When/Then 格式”）
- 審查標準（“提案必須包含回滾方案”）
- 這些內容只會在相應產物的請求中出現，使其他請求保持精簡

**完全刪除**

- AI 模型已經知道的通用最佳實踐
- 可以壓縮概括的冗長說明
- 不影響當前工作的歷史背景

### 遷移步驟

1. **建立 config.yaml**（如果 `init` 尚未建立）：
   ```yaml
   schema: spec-driven
   ```

2. **新增上下文**（儘量簡潔——它會注入每個請求）：
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **新增產物級規則**（可選）：
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. 將有用內容遷移完成後，刪除 `project.md`。

**不必過度糾結。** 從必要內容開始，再逐步完善。如果發現 AI 遺漏了重要資訊，就補充進去；如果上下文顯得臃腫，就刪減內容。這是一份持續演進的文件。

### 需要幫助？使用以下提示詞

如果你不確定如何提煉 `project.md`，可以向 AI 助手詢問：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI 會幫你區分哪些內容必不可少，哪些可以刪減。

---

## 新命令

命令是否可用取決於所選設定檔案：

**預設（`core` 設定檔案）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:propose` | 建立變更，並在一步中生成規劃產物 |
| `/opsx:explore` | 不受固定結構限制地梳理想法 |
| `/opsx:apply` | 實作 `tasks.md` 中的任務 |
| `/opsx:update` | 修改變更的規劃產物並保持內容協調 |
| `/opsx:sync` | 將差異規格說明合併到主規格說明 |
| `/opsx:archive` | 完成變更並歸檔 |

**擴充套件工作流程（自訂選擇）：**

| 命令 | 用途 |
|---------|---------|
| `/opsx:new` | 建立新的變更腳手架 |
| `/opsx:continue` | 一次建立下一個產物 |
| `/opsx:ff` | 快進，一次性建立規劃產物 |
| `/opsx:verify` | 驗證實作是否符合規格說明 |
| `/opsx:bulk-archive` | 一次性歸檔多個變更 |
| `/opsx:onboard` | 端到端引導式入門工作流程 |

執行 `openspec config profile` 啟用擴充套件命令，然後執行 `openspec update`。

### 舊命令與 OPSX 命令對應關係

| 舊版 | OPSX 對應命令 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose`（預設）或 `/opsx:new` 後接 `/opsx:ff`（擴充套件模式） |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新增功能

以下功能屬於擴充套件工作流程命令集。

**細粒度建立產物：**
```
/opsx:continue
```
每次根據依賴關係建立一個產物。需要逐步審查時使用此命令。

**探索模式：**
```
/opsx:explore
```
在確定變更方案之前，與思考夥伴一起梳理想法。

---

## 瞭解新架構

### 從階段鎖定到靈活流轉

舊版工作流程會強迫你線性推進：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX 使用操作，而非階段：

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 依賴圖

產物構成一個有向圖。依賴關係是助力，而非關卡：

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

執行 `/opsx:continue` 時，它會檢查哪些內容已經就緒，並提供下一個產物。多個已就緒的產物也可以按任意順序建立。

### 技能與命令

舊系統使用各工具專用的命令檔案：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用新興的**技能**標準：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能可被多種 AI 程式設計工具識別，並能提供更豐富的元資料。

OPSX 中的 Codex 僅支援技能。OpenSpec 不再生成 Codex 自訂提示詞檔案；請改用生成的 `.agents/skills/openspec-*` 目錄。

---

## 繼續現有變更

你尚未完成的變更可與 OPSX 命令無縫配合。

**有舊版工作流程中的活動變更？**

```
/opsx:apply add-my-feature
```

OPSX 會讀取現有產物並從上次進度繼續。

**想為現有變更新增更多產物？**

```
/opsx:continue add-my-feature
```

它會根據當前已有內容顯示可以建立的產物。

**需要檢視狀態？**

```bash
openspec status --change add-my-feature
```

---

## 新設定系統

### config.yaml 結構

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 模式解析

OPSX 按以下順序決定使用哪個模式：

1. **CLI 標誌：** `--schema <name>`（優先順序最高）
2. **變更元資料：** 變更目錄中的 `.openspec.yaml`
3. **專案設定：** `openspec/config.yaml`
4. **預設值：** `spec-driven`

### 可用模式

| 模式 | 產物 | 適用情境 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多數專案 |

列出所有可用模式：

```bash
openspec schemas
```

### 自訂模式

建立自己的工作流程：

```bash
openspec schema init my-workflow
```

也可以從現有模式派生：

```bash
openspec schema fork spec-driven my-workflow
```

詳情見[自訂](/zh-Hant/customization/)。

---

## 故障排除

### “Legacy files detected in non-interactive mode”

你正在 CI 或非互動環境中執行。使用：

```bash
openspec init --force
```

### 遷移後命令沒有出現

重新啟動 IDE。技能會在啟動時檢測。

### “Unknown artifact ID in rules”

檢查 `rules:` 鍵是否與模式中的產物 ID 一致：

- **spec-driven：** `proposal`、`specs`、`design`、`tasks`

執行以下命令檢視有效的產物 ID：

```bash
openspec schemas --json
```

### 設定沒有生效

1. 確認檔案位於 `openspec/config.yaml`（而非 `.yml`）。
2. 驗證 YAML 語法。
3. 設定更改立即生效，無需重啟。

### project.md 沒有遷移

系統會有意保留 `project.md`，因為其中可能包含你的自訂內容。請手動檢查，將有用部分移至 `config.yaml`，然後刪除原檔案。

### 想知道哪些檔案會被清理？

執行 `init` 並在清理提示中選擇拒絕，即可檢視完整檢測摘要，不會實際修改任何檔案。

---

## 快速參考

### 遷移後的檔案

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### 已移除的內容

- `.claude/commands/openspec/`——已由 `.claude/skills/` 取代
- `openspec/AGENTS.md`——已過時
- `openspec/project.md`——遷移到 `config.yaml` 後刪除
- `CLAUDE.md`、`AGENTS.md` 等檔案中的 OpenSpec 標記塊

### 命令速查表

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## 獲取幫助

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **文件：** 閱讀 [docs/opsx.md](/zh-Hant/opsx/) 獲取完整 OPSX 參考
