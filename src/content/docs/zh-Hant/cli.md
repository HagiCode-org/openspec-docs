---
title: "CLI 參考"
---

OpenSpec CLI（`openspec`）提供用於專案設定、驗證、狀態檢查和管理的終端命令。這些命令與[命令](/zh-Hant/commands/)中介紹的 AI 斜槓命令（例如 `/opsx:propose`）相輔相成。

## 概要

| 類別 | 命令 | 用途 |
|----------|----------|---------|
| **設定** | `init`, `update` | 在專案中初始化和更新 OpenSpec |
| **Stores（獨立 OpenSpec 儲存庫）** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | 管理已註冊的 store（獨立 OpenSpec 儲存庫） |
| **健康狀況** | `doctor` | 報告解析後根目錄的關聯健康狀況 |
| **工作上下文** | `context` | 彙總工作集（根目錄 + 引用的 stores） |
| **個人工作集** | `workset create`, `workset list`, `workset open`, `workset remove` | 在工具中儲存並打開個人本地工作檢視 |
| **瀏覽** | `list`, `view`, `show` | 瀏覽變更和規範 |
| **驗證** | `validate` | 檢查變更和規範中的問題 |
| **生命週期** | `archive` | 完成變更的最終處理 |
| **工作流程** | `new change`, `status`, `instructions`, `templates`, `schemas` | 提供基於產物的工作流程支援 |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | 建立和管理自訂工作流程 |
| **設定** | `config` | 檢視和修改設定 |
| **實用工具** | `feedback`, `completion` | 提交回饋和整合 shell |

---

## 面向使用者與代理的命令

大多數 CLI 命令面向終端中的**使用者**。部分命令也可透過 JSON 輸出供**代理或指令碼使用**。

### 僅供使用者使用的命令

這些命令具有互動性，專為終端使用設計：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化專案（互動式提示） |
| `openspec view` | 互動式儀表板 |
| `openspec workset open <name>` | 開啟已儲存的工作集（編輯器視窗或終端代理會話） |
| `openspec config edit` | 在編輯器中開啟設定 |
| `openspec feedback` | 透過 GitHub 提交回饋 |
| `openspec completion install` | 安裝 shell 補全 |

### 相容代理的命令

這些命令支援 `--json` 輸出，供 AI 代理和指令碼以程式設計方式使用：

| 命令 | 使用者用法 | 代理用法 |
|---------|-----------|-----------|
| `openspec list` | 瀏覽變更/規範 | 使用 `--json` 獲取結構化資料 |
| `openspec show <item>` | 閱讀內容 | 使用 `--json` 進行解析 |
| `openspec validate` | 檢查問題 | 使用 `--all --json` 批次驗證 |
| `openspec status` | 檢視產物進度 | 使用 `--json` 獲取結構化狀態 |
| `openspec instructions` | 獲取後續步驟 | 使用 `--json` 獲取代理指令 |
| `openspec templates` | 查詢模板路徑 | 使用 `--json` 解析路徑 |
| `openspec schemas` | 列出可用 schema | 使用 `--json` 發現 schema；使用 `--store <id>` 選擇已註冊的根目錄 |
| `openspec store setup <id>` | 建立並註冊本地 store | 提供顯式輸入並使用 `--json` 獲取結構化設定結果 |
| `openspec store register <path>` | 註冊現有 store | 使用 `--json` 獲取結構化註冊結果 |
| `openspec store unregister <id>` | 清除本地 store 註冊資訊 | 使用 `--json` 獲取結構化清理結果 |
| `openspec store remove <id>` | 刪除已註冊的本地 store 資料夾 | 使用 `--yes --json` 非互動式刪除 |
| `openspec store list` | 瀏覽已註冊的 store | 使用 `--json` 獲取結構化註冊資訊 |
| `openspec store doctor` | 檢查本地 store 設定 | 使用 `--json` 獲取結構化診斷資訊 |
| `openspec new change <id>` | 建立儲存庫本地的變更腳手架 | 使用 `--json`；還可用 `--store <id>` 將已註冊 store 作為 OpenSpec 根目錄 |
| `openspec workset create [name]` | 組合個人工作檢視 | 使用 `--member <path> --json` 非互動式組合 |
| `openspec workset list` | 瀏覽已儲存的工作集 | 使用 `--json` 獲取結構化檢視 |
| `openspec workset remove <name>` | 刪除已儲存的檢視 | 使用 `--yes --json` 非互動式刪除 |

---

## 全域選項

以下選項適用於所有命令：

| 選項 | 說明 |
|--------|-------------|
| `--version`, `-V` | 顯示版本號 |
| `--no-color` | 停用彩色輸出 |
| `--help`, `-h` | 顯示命令幫助 |

---

## 設定命令

### `openspec init`

在專案中初始化 OpenSpec。建立目錄結構並設定 AI 工具整合。

預設行為使用全域設定：設定 `core`、交付模式 `both`，工作流程為 `propose, explore, apply, update, sync, archive`。

```
openspec init [path] [options]
```

使用 `--language <language>` 可向新專案的 `openspec/config.yaml` 新增語言指令。
對於現有專案，請編輯設定中的 `context` 欄位，以免 OpenSpec 覆蓋專案專屬指南。

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設為當前目錄） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--tools <list>` | 以非互動方式設定 AI 工具。可使用 `all`、`none` 或逗號分隔的列表 |
| `--language <language>` | 建立新設定時，指定產物使用的語言 |
| `--force` | 不提示，自動清理舊檔案 |
| `--profile <profile>` | 覆蓋本次初始化使用的全域設定（`core` 或 `custom`） |
| `--no-animation` | 顯示靜態歡迎介面，不播放動畫 |
| `--copilot-cloud` | 不提示，設定 GitHub Copilot [雲編碼代理檔案](/zh-Hant/supported-tools/#github-copilot-雲端編碼智慧代理程式) |
| `--no-copilot-cloud` | 不提示，跳過 GitHub Copilot 雲編碼代理檔案 |

`--profile custom` 使用全域設定中當前選定的工作流程（`openspec config profile`）。

設定 `OPENSPEC_NO_ANIMATION` 環境變數（任何值，包括空值）、將 `NO_COLOR` 設為非空值，或啟用作業系統的減少動態效果偏好（macOS“減少動態效果”、GNOME 停用動畫）時，也會跳過歡迎動畫。

**支援的工具 ID（`--tools`）**——`windsurf` 也可作為 `devin` 的別名使用：`amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`codeassistant`、`qoder`、`qwen`、`rovodev`、`roocode`、`trae`、`zed`、`zcode`、`agents`

> 此列表與 `src/core/config.ts` 中的 `AI_TOOLS` 一致。各工具的 skill 和命令路徑請參閱[支援的工具](/zh-Hant/supported-tools/)。

**範例：**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**建立的內容：**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

升級 CLI 後更新 OpenSpec 指令檔案。根據當前全域設定、所選工作流程和交付模式重新生成 AI 工具設定檔案。

```
openspec update [path] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `path` | 否 | 目標目錄（預設為當前目錄） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--force` | 即使檔案已是最新，也強制更新 |

**範例：**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

請先升級軟體包。指令檔案由已安裝的 CLI 生成，因此如果安裝版本過舊，執行 `openspec update` 會報告所有內容均為最新，卻不會新增較新版本提供的工作流程。

為明確提示這一點，`openspec update` 會查詢 npm registry，檢查是否已釋出更新的 CLI。如果當前版本較舊，它會提供升級選項：

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

回答 yes 後，它會執行 `npm install -g @fission-ai/openspec@latest`，再用新版 CLI 重新執行更新，因此新工作流程會在同一命令中寫入。它會詢問已安裝二進位制檔案的版本來確認升級，而不是隻相信 npm 的退出碼；如果 `PATH` 中更靠前的另一個安裝版本仍在響應，它會如實告知，而不會謊稱升級成功。回答 no 後，它會列印升級命令，並使用當前 CLI 執行更新。按 Ctrl-C 可停止命令。

只有在互動式終端中，且 OpenSpec 是透過 npm 安裝時，才會顯示此提示——這是 `npm install -g` 能夠實際修復的唯一情況。其他安裝方式則會顯示相應的升級命令：

| OpenSpec 的安裝方式 | 顯示內容 |
|---------------------------|--------------|
| 全域 npm 套件安裝 | 在互動式終端中顯示提示並代為升級；如果輸出被重定向，則改為列印升級命令 |
| 全域 pnpm、bun、yarn 或 volta 安裝 | 顯示對應包管理器的命令：`pnpm add -g …@latest`、`bun add -g …@latest`、`yarn global add …@latest` 或 `volta install …@latest` |
| 作為專案依賴安裝 | 提示更新該依賴，因為鎖檔案由專案的包管理器管理 |
| `npx` / `dlx` 快取 | 顯示 `npx @fission-ai/openspec@latest update`——該命令本身就是更新操作，無需第二步 |
| Git 複製 | 不顯示內容——使用的版本由當前分支決定 |

無論何時列印資訊，都會顯示當前 CLI 的載入目錄。如果你已經升級，但 `PATH` 中仍優先找到舊的 shim，可據此檢查。

如果 npm 匯出了 `npm_config_registry`，檢查會使用其中的 registry；否則使用 `https://registry.npmjs.org`。它不會讀取 `.npmrc`：允許檔案內容決定出站請求的目標並不安全，而且專案的 `.npmrc` 會隨儲存庫一同分發。使用私有映象時，請匯出 `npm_config_registry`；也可以設定 `OPENSPEC_NO_UPDATE_CHECK` 完全跳過檢查。當 `CI` 被設為任何明確的非關閉值（`false`、`0`、`no`、`off` 或空值除外）、`NODE_ENV=test`，或設定了 `OPENSPEC_NO_UPDATE_CHECK`（任何值）、`DO_NOT_TRACK=1`、`OPENSPEC_TELEMETRY=0` 時，檢查會跳過。檢查在更新前執行，最多延遲 1.5 秒；超過時限後即會放棄，即使網路悄悄丟包也一樣，並且在 registry 無法存取時不會輸出錯誤資訊。

**“已是最新”的判斷方式：**skill 檔案會記錄生成它們的版本，因此 OpenSpec 會將該版本與已安裝的 CLI 進行比較。命令檔案沒有版本標記，所以對於只提供命令、不提供 skills 的工具（交付模式為 `commands`），OpenSpec 會將檔案內容與當前將要生成的內容進行比較——對這些檔案的手動編輯會被視為偏差並覆蓋。交付模式為 `skills` 或 `both` 時，只檢查記錄的版本；因此，只要版本仍匹配，手動修改過的檔案就會保留。使用 `--force` 可重新寫入。無論哪種模式，生成檔案都由 OpenSpec 管理——請將自訂指令儲存在其他位置。

---

## Stores（獨立 OpenSpec 儲存庫）

> **Beta。** Store 及其相關功能（引用、工作上下文、工作集）都是新功能；命令名稱、標誌、檔案格式和 JSON 輸出可能在不同版本間發生變化。以問題為導向的操作指南請參閱 [stores 指南](/zh-Hant/stores-beta/user-guide/)。

Store 是你在此計算機上註冊的獨立 OpenSpec 儲存庫，例如規劃儲存庫或合約儲存庫。註冊後，只需傳入 `--store <id>`，即可從任意位置使用常規命令（`list`、`show`、`status`、`validate`、`new change`、`archive` 等）在該 store 中操作。

### `openspec store setup`

建立並註冊本地 store。在終端中不帶引數執行時，OpenSpec 會引導使用者完成設定。代理和指令碼應傳入明確的輸入，並使用 `--json`。

```bash
openspec store setup [id] [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--path <path>` | Store 所在資料夾（例如 `~/openspec/<id>`） |
| `--remote <url>` | 在新 store 的 `store.yaml` 中記錄規範遠端地址 |
| `--init-git` | 初始化 Git 儲存庫並建立初始提交（預設） |
| `--no-init-git` | 跳過所有 Git 操作：不初始化儲存庫，也不建立初始提交 |
| `--json` | 輸出 JSON |

非互動執行（`--json`、指令碼、代理）必須同時傳入 store ID 和 `--path`。在互動式終端中，設定流程會詢問存放位置，並提供一個位於使用者可見、可自行管理位置的可編輯建議路徑（例如 `~/openspec/<id>`）；絕不會預設使用 OpenSpec 管理的資料目錄。

範例：

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

註冊現有的本地 store 資料夾。在 stores beta 階段，即使尚無任何變更、尚未應用規範或歸檔變更，也可以註冊根目錄；此時 `openspec/changes/`、`openspec/specs/` 和 `openspec/changes/archive/` 目錄可能尚不存在，直到常規命令建立它們為止。
僅含設定且聲明瞭 `store: <id>` 的儲存庫仍只是指向另一個 store 的指標；除非刪除該指標，否則不會將其註冊為 store 根目錄。

```bash
openspec store register [path] [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--id <id>` | Store ID；預設採用 store 元資料或資料夾名稱 |
| `--yes` | 確認在健康的 OpenSpec 根目錄中建立 store 身份元資料 |
| `--json` | 輸出 JSON |

### `openspec store unregister`

清除本地 store 註冊資訊，但不刪除檔案。

```bash
openspec store unregister <id> [--json]
```

當 store 已移動、複製到其他位置，或不應再由此計算機上的 OpenSpec 顯示時，請使用此命令。

### `openspec store remove`

清除本地 store 註冊資訊並刪除其本地資料夾。

```bash
openspec store remove <id> [--yes] [--json]
```

在互動式終端中，`remove` 會在刪除前顯示確切的資料夾路徑。
代理、指令碼和 JSON 呼叫方必須傳入 `--yes` 以確認刪除。
如果資料夾不包含匹配的 store 元資料，OpenSpec 會拒絕刪除。

### `openspec store list`

列出本地已註冊的 store。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

檢查本地 store 註冊狀態、元資料和 Git 是否存在。

```bash
openspec store doctor [id] [--json]
```

Doctor 僅用於診斷；它會報告根目錄缺失、元資料不匹配和本地登錄檔狀態無效等問題，但不會修改 store。

### 在專案中引用 Store

專案儲存庫可在 `openspec/config.yaml` 中宣告其工作所依賴的 store：

```yaml
schema: spec-driven
references:
  - team-context
```

此後，該儲存庫中 `openspec instructions` 的輸出（包括逐產物指令和 `apply` 指令，JSON 與人類可讀模式均如此）都會附帶每個被引用 store 的規範索引——包括規範 ID、從各規範 Purpose 部分提取的一行摘要，以及獲取命令（`openspec show <spec-id> --type spec --store <id>`）。每次執行都會根據已註冊的檢出內容即時建置索引；規範正文絕不會複製到輸出中。

引用只提供只讀上下文，不會改變命令的操作位置：工作仍在儲存庫自身的根目錄中進行，寫入被引用的 store 仍須明確使用 `--store`。無法解析的引用（例如此計算機上尚未註冊的 store）會在索引中降級為警告，並附上確切的修復方法；指令仍會正常生成。`openspec doctor` 會集中報告引用的健康狀況。

### 記錄 Store 的複製來源

Store 可以在已提交的身份檔案中記錄其規範複製來源，使新成員設定流程不會卡在“註冊 store”這一步：

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

遠端地址會寫入初始提交中的 `.openspec-store/store.yaml`，因此每個複製都自帶此資訊。對於已有 store，可手動編輯 `store.yaml` 並提交。`store doctor` 會顯示已記錄的遠端地址（以及當前檢出的 Git origin）；setup/register 的共享說明會列出該地址；register 還會將當前檢出的 origin 記錄到本機登錄檔中。

引用宣告也可以攜帶複製來源，這樣尚未擁有該 store 的團隊成員就能直接複製並執行完整的修復命令（`git clone <remote> <path> && openspec store register <path> --id <id>`）：

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

記錄遠端地址並不意味著同步：OpenSpec 不會自行執行 clone、pull 或 push。

### 宣告預設 Store

對於規劃內容完全外接的儲存庫（沒有本地 `openspec/specs/` 或 `openspec/changes/`），可只宣告一次預設 store，而不必為每條命令都傳入 `--store`：

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

隨後，常規命令會自動解析到宣告的 store；根目錄橫幅和 JSON `root` 塊會報告 `source: "declared"` 以及 store ID，列印的提示仍會包含 `--store <id>`。此宣告是回退選項，而不是覆蓋項：顯式指定的 `--store` 始終優先；如果目錄中存在實際規劃資料夾，則忽略該指標（併發出警告）。若要將指標儲存庫轉換為本地 OpenSpec 根目錄，請刪除 `store:` 行並執行 `openspec init`——只要宣告仍存在，init 就會拒絕建立腳手架。

機器級設定可一次應用於所有儲存庫：`openspec config set defaultStore <id>`（參閱“設定”）。只有在 `--store`、本地根目錄和專案指標都無法解析後，才會使用此設定；屆時根目錄橫幅和 JSON `root` 塊會報告 `source: "global_default"`。

## Doctor（關聯健康狀況）

透過一個只讀命令集中回答一個問題：OpenSpec 根目錄是否健康，其引用的 store 是否可在此計算機上使用？

```bash
openspec doctor [--store <id>] [--json]
```

報告會分別列出根目錄健康狀況、store 元資料健康狀況（包括已記錄遠端與當前檢出的 origin 不一致時的提示，以及 store 檢出內容落後於上次獲取的上游追蹤引用時的提示），以及引用健康狀況（與 instructions 中顯示相同的診斷，併為無法解析的引用提供複製修復命令）。無論健康問題嚴重程度如何，退出碼均為 0——代理應讀取 `status` 陣列；只有命令本身失敗（例如沒有根目錄或 store 未知）才會以退出碼 1 結束。Doctor 不會複製、同步或修復內容。如需獲取彙總後的工作集本身而非其健康狀況，請使用 `openspec context`。

## 工作上下文（彙總集合）

透過 OpenSpec 宣告與當前工作相關的所有內容會組成一個工作集：OpenSpec 根目錄及其引用的 store。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON 摘要可供代理使用（每個可用的被引用 store 都包含獲取步驟；無法解析的成員會附帶與 instructions、doctor 相同的修復說明）。`--code-workspace` 還會寫入 VS Code workspace 檔案，其中包含根目錄和可用的被引用 store（`ref:<id>` 資料夾）——這是此命令唯一執行的寫入操作；如果目標檔案已存在且未指定 `--force`，命令會拒絕覆蓋。對於不可用的成員，命令會報告其狀態，不會猜測路徑。

“工作上下文”指彙總後的集合；`openspec/config.yaml` 中的 `context:` 欄位則是注入指令的專案背景，兩者含義不同。`openspec doctor` 用於判斷集合是否健康；`openspec context` 用於檢視集合包含哪些內容。

## 個人工作集

> **Beta。** 工作集屬於新的 beta 功能；命令、標誌和檔案格式可能在不同版本間發生變化。操作指南請參閱 [stores 指南](/zh-Hant/stores-beta/user-guide/#工作集重新開啟一起工作的資料夾)。

工作集是你常用資料夾的個人命名檢視——包含規劃根目錄以及你選擇的其他目錄——儲存在本機，並可在工具中按名稱重新開啟。它完全儲存在本地：不會提交、不會共享，也不會根據宣告自動生成；刪除工作集也不會觸碰其成員資料夾。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` 會執行簡短的引導流程（也可透過 `--member` 標誌以非互動方式建立；第一個成員是主目錄，會話會從該目錄啟動）。`open` 會啟動所選工具：編輯器（VS Code、Cursor）會開啟包含所有成員的視窗，然後返回；CLI 代理（Claude Code、codex）會接管當前終端，啟動一個附加所有成員且未預填提示詞的會話，直到你退出。開啟時缺失的成員資料夾會跳過並顯示說明，其餘成員仍會開啟。每次開啟時都可透過 `--tool` 覆蓋已儲存的工具偏好。

支援新工具只需設定，無需編寫程式碼。每個工具都使用兩種啟動方式之一：`workspace-file`（透過生成的 `.code-workspace` 啟動）或 `attach-dirs`（每個成員使用一個附加目錄標誌）。全域 `config.json` 中的 `openers` 鍵（使用 `openspec config edit` 開啟）可新增工具，或按欄位調整內建設定：

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

所有工作集狀態都存放在全域資料目錄下的 `worksets/` 資料夾中（包括已儲存的檢視和生成的 `<name>.code-workspace` 檔案；每次開啟時都會重新生成）。刪除該資料夾即可清除所有痕跡。

---

## 瀏覽命令

### `openspec list`

列出專案中的變更或規範。

```
openspec list [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--specs` | 列出規範而非變更 |
| `--changes` | 列出變更（預設） |
| `--sort <order>` | 按 `recent`（預設）或 `name` 排序 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**輸出（文字）：**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

顯示互動式儀表板，用於瀏覽規範和變更。

```
openspec view
```

開啟基於終端的介面，以瀏覽專案規範和變更。

---

### `openspec show`

顯示變更或規範的詳細資訊。

```
openspec show [item-name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `item-name` | 否 | 變更或規範名稱（省略時會提示輸入） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--type <type>` | 指定型別：`change` 或 `spec`（名稱明確時會自動檢測） |
| `--json` | 以 JSON 格式輸出 |
| `--no-interactive` | 停用提示 |

**變更專用選項：**

| 選項 | 說明 |
|--------|-------------|
| `--deltas-only` | 只顯示增量規範（JSON 模式） |

**規範專用選項：**

| 選項 | 說明 |
|--------|-------------|
| `--requirements` | 只顯示需求，不包含情境（JSON 模式） |
| `--no-scenarios` | 不包含情境內容（JSON 模式） |
| `-r, --requirement <id>` | 按從 1 開始的索引顯示指定需求（JSON 模式） |

**範例：**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## 驗證命令

### `openspec validate`

驗證變更和規範的結構問題，並將變更中 MODIFIED 需求與其將要替換的主規範進行比較。

```
openspec validate [item-name] [options]
```

如果變更沒有任何規範增量，驗證就會失敗，除非其 `.openspec.yaml` 聲明瞭 `skip_specs: true`（適用於純重構、工具或文件工作——參閱[配方 5](/zh-Hant/examples/#配方-5不改變行為的重構)）。

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `item-name` | 否 | 要驗證的指定專案（省略時會提示輸入） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--all` | 驗證所有變更和規範 |
| `--changes` | 驗證所有變更 |
| `--specs` | 驗證所有規範 |
| `--archived` | 驗證已歸檔變更的所有任務是否均已完成（適用於 pre-commit lint） |
| `--type <type>` | 名稱有歧義時指定型別：`change` 或 `spec` |
| `--strict` | 啟用嚴格驗證模式 |
| `--json` | 以 JSON 格式輸出 |
| `--concurrency <n>` | 最大並行驗證數（預設為 6，也可透過 `OPENSPEC_CONCURRENCY` 環境變數設定） |
| `--no-interactive` | 停用提示 |

`--archived` 是獨立的驗證範圍：它不會驗證規範增量（歸檔時已應用），而是檢查 `changes/archive/` 下每個變更的 `tasks.md` 複選框是否全部勾選；只要存在未勾選項，就會以非零狀態碼退出。此選項可發現歸檔時仍有未完成工作的變更，適合用於 pre-commit hook。

**範例：**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**輸出（文字）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**輸出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 生命週期命令

### `openspec archive`

歸檔已完成的變更，並將增量規範合併到主規範中。

```
openspec archive [change-name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `change-name` | 否 | 要歸檔的變更（省略時會提示輸入；如果無法響應提示，則必須提供） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `-y, --yes` | 跳過確認提示。當無法響應提示時必須使用——例如由 AI 代理、CI 任務或標準輸入已關閉的執行呼叫 |
| `--skip-specs` | 本次歸檔跳過規範更新。永久沒有規範增量的變更應在 `.openspec.yaml` 中宣告 `skip_specs: true`，而非每次使用此標誌——此時無需標誌即可歸檔 |
| `--no-validate` | 跳過驗證（需要確認）。同時停用 capability 退役——沒有驗證器的結論，就不會退役任何 capability |

**範例：**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**退役 capability：**在變更元資料中新增退役標記：

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

然後按常規方式歸檔變更：

```bash
openspec archive retire-legacy --yes
```

當變更移除某項 capability 的最後一個需求時，OpenSpec 會刪除其有效的 `spec.md`。同一變更中其他 capability 的增量仍會更新各自的主規範。如果沒有此標記，歸檔會在修改任何檔案之前停止，並提示你新增該標記。

**執行內容：**

1. 驗證變更（除非指定 `--no-validate`）
2. 提示確認（除非指定 `--yes`）
3. 在修改任何主規範前先佔用歸檔目標位置
4. 驗證活動增量規範並將其合併到 `openspec/specs/`——如果變更移除了某項 capability 的最後一個需求，則該 capability 會退役且其規範檔案會被刪除；但只有當變更的 `.openspec.yaml` 在 `schema:` 旁宣告 `retire_capabilities: true` 時才會如此
5. 將變更資料夾移動到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
6. 如果規範修改或最終移動在完整歸檔安全寫入前失敗，則恢復規範，並將變更保留或移回活動路徑
7. 如果已驗證的備用副本建立成功，但暫存源清理失敗，則保留完整歸檔和已提交的規範狀態，供後續恢復

**沒有終端時：**AI 代理、CI 任務或任何標準輸入已關閉的執行都無法響應第 2 步，因此歸檔會在觸碰任何內容前停止，以狀態碼 1 退出，並指出要重新執行的命令——`openspec archive <name> --yes`，同時保留你傳入的其他標誌。預先傳入 `--yes`（以及變更名稱）即可避免這次往返。

---

## 工作流程命令

這些命令支援基於產物的 OPSX 工作流程，既可供使用者檢查進度，也可供代理確定後續步驟。

### `openspec new change`

在已解析的 OpenSpec 根目錄中建立變更目錄以及可選的已檢入元資料。

```bash
openspec new change <name> [options]
```

變更名稱必須使用小寫 kebab-case：由小寫字母、數字和單個連字元組成。名稱不能包含空格、下劃線、大寫字母、連續連字元，也不能以連字元開頭或結尾。名稱允許以數字開頭，因此可以給變更新增排序或分級字首，例如 `100-add-feature` 或 `00001-add-auth`。

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--description <text>` | 要新增到 `README.md` 的說明 |
| `--goal <text>` | 與變更一同儲存的可選目標元資料 |
| `--schema <name>` | 要使用的工作流程 schema |
| `--store <id>` | 用作 OpenSpec 根目錄的 store ID（store 是你已註冊的獨立 OpenSpec 儲存庫） |
| `--json` | 輸出 JSON |

範例：

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

顯示某項變更的產物完成狀態。

```
openspec status [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--change <id>` | 變更名稱（省略時會提示輸入） |
| `--schema <name>` | 覆蓋 schema（從變更設定自動檢測） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Interactive status check
openspec status

# Status for specific change
openspec status --change add-dark-mode

# JSON for agent use
openspec status --change add-dark-mode --json
```

**輸出（文字）：**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

聲明瞭 `skip_specs: true` 的變更會將其規範階段顯示為 `[~] specs (skipped: change declares skip_specs)`，且不計入進度總數。

**輸出（JSON）：**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` 表示所有未跳過的規劃產物是否都已存在；跳過的產物視為已滿足，無需實際建立。它不表示實作任務是否完成。`isComplete` 作為相容別名保留，其值與 `isPlanningComplete` 相同。

產物按依賴順序列出——依賴項始終出現在需要它的產物之前。若多個產物同時變為可用（例如 spec-driven 的 `specs` 和 `design` 都只依賴 `proposal`），則按 schema 中宣告的順序排列，而非按字母順序排列。因此，第一個 `ready` 條目就是下一步要編寫的產物。

---

### `openspec instructions`

獲取用於建立產物或執行任務的擴充套件指令。AI 代理可據此瞭解接下來應建立什麼。

```
openspec instructions [artifact] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `artifact` | 否 | 產物 ID，或工作流程輸入介面：`apply` 或 `archive` |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--change <id>` | 變更名稱（非互動模式下必填） |
| `--schema <name>` | 覆蓋 schema |
| `--json` | 以 JSON 格式輸出 |

**特殊情況：**使用 `apply` 獲取任務實作指令。使用 `archive` 可為有效變更獲取當前只讀歸檔輸入（`context` 和 `operationGuidance`）；它不會歸檔或修改任何內容。

**範例：**

```bash
# Get instructions for next artifact
openspec instructions --change add-dark-mode

# Get specific artifact instructions
openspec instructions design --change add-dark-mode

# Get apply/implementation instructions
openspec instructions apply --change add-dark-mode

# Get current archive operation inputs without archiving
openspec instructions archive --change add-dark-mode --json

# JSON for agent consumption
openspec instructions design --change add-dark-mode --json
```

**輸出包含：**

- 產物模板內容
- 設定中的專案上下文
- 依賴產物中的內容
- 設定中的產物級規則
- `apply`/`archive` 當前專案上下文及匹配的操作指南

每次呼叫都會從已解析的儲存庫或選定的 store 讀取操作輸入。專案上下文是提示詞層面的必需輸入：代理會讀取它，並應用相關專案事實、約定和限制。操作指南則是可選的補充建議：代理會考慮每一項，只遵循適用且與內建工作流程相容的內容。這兩個欄位都與明確的使用者選擇、CLI 控制的狀態、內建指令和產物規則彼此獨立。若上下文衝突，會報告衝突；若指南衝突或不適用，則不會遵循，並會說明原因。這些是針對生成式代理的行為約定，並非 CLI 可強制執行的檢查。`instructions archive` 只返回選定變更、可選輸入和根目錄元資料，不包含靜態歸檔工作流程。

透過 `skip_specs: true` 跳過的產物只會產生警告（JSON 會增加 `skipped`/`warning` 欄位）——不得建立該產物。

---

### `openspec templates`

顯示某個 schema 中所有產物解析後的模板路徑。

```
openspec templates [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--schema <name>` | 要檢查的 schema（預設為 `spec-driven`） |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Show template paths for default schema
openspec templates

# Show templates for custom schema
openspec templates --schema my-workflow

# JSON for programmatic use
openspec templates --json
```

**輸出（文字）：**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流程 schema、說明及其產物流程。

```
openspec schemas [options]
```

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--json` | 以 JSON 格式輸出 |
| `--store <id>` | 使用已註冊的 store 作為 OpenSpec 根目錄 |

**範例：**

```bash
openspec schemas
```

**輸出：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema 命令

用於建立和管理自訂工作流程 schema 的命令。

### `openspec schema init`

建立新的專案本地 schema。

```
openspec schema init <name> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 是 | Schema 名稱（kebab-case） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--description <text>` | Schema 說明 |
| `--artifacts <list>` | 逗號分隔的產物 ID 列表（預設為 `proposal,specs,design,tasks`） |
| `--default` | 設為專案預設 schema |
| `--no-default` | 不提示是否設為預設值 |
| `--force` | 覆蓋現有 schema |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Interactive schema creation
openspec schema init research-first

# Non-interactive with specific artifacts
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**建立的內容：**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema definition
└── templates/
    ├── proposal.md       # Template for each artifact
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

將現有 schema 複製到專案中以便定製。

```
openspec schema fork <source> [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `source` | 是 | 要複製的 schema |
| `name` | 否 | 新 schema 名稱（預設為 `<source>-custom`） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--force` | 覆蓋現有目標 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Fork the built-in spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

驗證 schema 的結構和模板。

```
openspec schema validate [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 否 | 要驗證的 schema（省略時驗證全部） |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--verbose` | 顯示詳細驗證步驟 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Validate a specific schema
openspec schema validate my-workflow

# Validate all schemas
openspec schema validate
```

---

### `openspec schema which`

顯示 schema 的解析來源（可用於除錯優先順序）。

```
openspec schema which [name] [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `name` | 否 | Schema 名稱 |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--all` | 列出所有 schema 及其來源 |
| `--json` | 以 JSON 格式輸出 |

**範例：**

```bash
# Check where a schema comes from
openspec schema which spec-driven
```

**輸出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema 優先順序：**

1. 專案：`openspec/schemas/<name>/`
2. 使用者：`~/.local/share/openspec/schemas/<name>/`
3. 軟體包：內建 schema

---

## 設定命令

### `openspec config`

檢視和修改 OpenSpec 全域設定。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 說明 |
|------------|-------------|
| `path` | 顯示設定檔案位置 |
| `list` | 顯示所有當前設定 |
| `get <key>` | 獲取指定值 |
| `set <key> <value>` | 設定值 |
| `unset <key>` | 刪除鍵 |
| `reset` | 重置為預設值 |
| `edit` | 使用 `$EDITOR` 開啟 |
| `profile [preset]` | 透過互動方式或預設設定工作流程設定 |

**範例：**

```bash
# Show config file path
openspec config path

# List all settings
openspec config list

# Get a specific value
openspec config get telemetry.enabled

# Set a value (disable anonymous usage telemetry)
openspec config set telemetry.enabled false

# Set a string value explicitly
openspec config set user.name "My Name" --string

# Remove a custom setting
openspec config unset user.name

# Set a machine-level default store (fallback root when no --store,
# local root, or project store: pointer resolves)
openspec config set defaultStore team-plans

# Reset all configuration
openspec config reset --all --yes

# Edit config in your editor
openspec config edit

# Configure profile with action-based wizard
openspec config profile

# Fast preset: switch workflows to core (keeps delivery mode)
openspec config profile core
```

**退出遙測：**未設定時，`telemetry.enabled` 預設為開啟（選擇退出模式）。
將其設為 `false` 可停用匿名使用統計和 `openspec update` 版本檢查。
環境變數優先於設定：無論設定值如何，`OPENSPEC_TELEMETRY=0`、`DO_NOT_TRACK=1`，
以及真值 `CI`（例如 `true`/`1`/`yes`）都會停用遙測。

`openspec config profile` 會先顯示當前狀態摘要，然後讓你選擇：
- 更改交付模式和工作流程
- 僅更改交付模式
- 僅更改工作流程
- 保持當前設定（退出）

如果保留當前設定，不會寫入更改，也不會顯示更新提示。
如果設定沒有變化，但當前專案檔案與全域設定的 profile/交付模式不同步，OpenSpec 會顯示警告並建議執行 `openspec update`。
按 `Ctrl+C` 也會乾淨地取消流程（不顯示堆疊追蹤），並以退出碼 `130` 結束。
在工作流程清單中，`[x]` 表示該工作流程已在全域設定中選中。要將這些選擇應用到專案檔案，請執行 `openspec update`（或在專案內提示時選擇 `Apply changes to this project now?`）。

**互動範例：**

```bash
# Delivery-only update
openspec config profile
# choose: Change delivery only
# choose delivery: Skills only

# Workflows-only update
openspec config profile
# choose: Change workflows only
# toggle workflows in the checklist, then confirm
```

---

## 實用工具命令

### `openspec feedback`

提交有關 OpenSpec 的回饋，並建立 GitHub issue。

```
openspec feedback <message> [options]
```

**引數：**

| 引數 | 必填 | 說明 |
|----------|----------|-------------|
| `message` | 是 | 回饋摘要；較長的文字會在 issue 標題中縮短，但會在正文中完整保留 |

**選項：**

| 選項 | 說明 |
|--------|-------------|
| `--body <text>` | 跟在摘要之後的補充詳情 |

**要求：**必須安裝並登入 GitHub CLI（`gh`）。

**範例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 shell 補全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 說明 |
|------------|-------------|
| `generate [shell]` | 將補全指令碼輸出到 stdout |
| `install [shell]` | 為 shell 安裝補全 |
| `uninstall [shell]` | 刪除已安裝的補全 |

**支援的 shell：**`bash`、`zsh`、`fish`、`powershell`

**範例：**

```bash
# Install completions (auto-detects shell)
openspec completion install

# Install for specific shell
openspec completion install zsh

# Generate script for manual installation (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Uninstall
openspec completion uninstall
```

**Windows（PowerShell）：**為當前 PowerShell 主機安裝補全：

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` 用於告知 OpenSpec 在本會話中設定哪個 profile。
安裝程式會建立缺失的 profile 目錄，並新增一個用於載入
`OpenSpecCompletion.ps1` 的受管理程式碼塊。重新載入 profile 後，補全會立即生效。

要從當前主機解除安裝，請執行：

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

解除安裝後請重啟 PowerShell，以清除當前會話中的補全。

補全需要選擇啟用。首次在互動式終端執行命令時，CLI 會在 stderr 上提示一次，之後不再提示；如果已安裝補全，也不會顯示提示。設定 `OPENSPEC_NO_COMPLETIONS=1` 可完全停用此提示。

---

## 退出碼

| 程式碼 | 含義 |
|------|---------|
| `0` | 成功 |
| `1` | 錯誤（驗證失敗、檔案缺失等） |

---

## 環境變數

| 變數 | 說明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | 設為 `0` 可停用遙測和 `openspec update` 版本檢查（覆蓋全域設定中的 `telemetry.enabled`） |
| `DO_NOT_TRACK` | 設為 `1` 可停用遙測和 `openspec update` 版本檢查（標準 DNT 訊號；覆蓋設定） |
| `OPENSPEC_CONCURRENCY` | 批次驗證的預設並行度（預設值：6） |
| `EDITOR` 或 `VISUAL` | `openspec config edit` 使用的編輯器 |
| `NO_COLOR` | 設定後停用彩色輸出 |
| `OPENSPEC_NO_ANIMATION` | 設定後停用 `openspec init` 歡迎動畫 |
| `OPENSPEC_NO_COMPLETIONS` | 設為 `1` 可禁止一次性的 shell 補全提示 |
| `OPENSPEC_NO_UPDATE_CHECK` | 設定後停用 `openspec update` 對新版 CLI 的檢查（任何值，包括空值）。當 `CI` 已設定（除非值為 `false`/`0`/`no`/`off`）或 `NODE_ENV=test` 時也會跳過檢查 |
| `npm_config_registry` | `openspec update` 版本檢查所查詢的 registry。必須是 `http(s)` URL，否則回退至 `https://registry.npmjs.org`。不會讀取 `.npmrc` 檔案 |

---

## 相關文件

- [命令](/zh-Hant/commands/)——AI 斜槓命令（`/opsx:propose`、`/opsx:apply` 等）
- [工作流程](/zh-Hant/workflows/)——常見模式以及各命令的適用時機
- [定製](/zh-Hant/customization/)——建立自訂 schema 和模板
- [快速入門](/zh-Hant/getting-started/)——首次設定指南
