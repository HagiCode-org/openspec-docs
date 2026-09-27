---
title: "支援的工具"
---

OpenSpec 支援多種 AI 程式設計助手。執行 `openspec init` 時，OpenSpec 會根據當前啟用的設定檔案/工作流程選擇和交付模式，為所選工具進行設定。

## 工作方式

對於每個已選擇的工具，OpenSpec 可以安裝：

1. **技能**（如果交付方式包含技能）：`.../skills/openspec-*/SKILL.md`
2. **命令**（如果交付方式包含命令）：該工具專用的 `opsx-*` 命令檔案

Codex 僅使用技能：即使交付方式設定為 `commands`，OpenSpec 也會為 Codex 安裝 `.agents/skills/openspec-*/SKILL.md`，但不會生成 Codex 自訂提示詞檔案。舊版 `.codex/skills` 路徑下由 OpenSpec 管理的技能，會在替代技能寫入後進行協調；自訂檔案和內容不一致的檔案會予以保留。

預設情況下，OpenSpec 使用 `core` 設定檔案，其中包括：

- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

你可以透過 `openspec config profile` 啟用擴充套件工作流程（`new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`），然後執行 `openspec update`。

## 如何呼叫

本文件使用 `/opsx:propose` 作為標準名稱，但每種工具都會按照它載入的 OpenSpec 檔案形式來拼寫。請先在下方的[工具目錄參考](/zh-Hant/supported-tools/)中找到所用工具的命令路徑，再在此表中匹配其形式。

| OpenSpec 寫入的命令檔案 | 輸入方式 | 工具 |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*`——透過 `opsx/` 資料夾進行名稱空間劃分 | `/opsx:<id>` | Claude Code、CodeBuddy、Crush、Gemini CLI、Lingma、Qoder、ZCode |
| `.../opsx-<id>.*`——檔名就是命令 | `/opsx-<id>` | 其他所有生成命令檔案的工具，Amazon Q 和 Devin 除外 |
| `.devin/workflows/opsx-<id>.md`——僅由 Devin 的兩種智慧代理程式之一讀取 | Devin Desktop 使用 `/opsx-<id>`，Devin Local 使用 `/openspec-<skill>` | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md`——這是提示詞，而非命令 | `@opsx-<id>` | Amazon Q Developer |
| 無——僅支援技能 | `/openspec-<skill>` | CodeArts、ForgeCode、Hermes、MiniMax Code、Mistral Vibe、Zed Agent、共享 `.agents` |
| 無——Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| 無——Codex CLI | `$openspec-<skill>` | Codex（[不識別 `/openspec-<skill>`](https://github.com/openai/codex/issues/11817)） |

因此，同一個 `/opsx:propose` 命令在 Cursor 中寫作 `/opsx-propose`，在 Amazon Q 中寫作 `@opsx-propose`，在 Codex 中則寫作 `$openspec-propose`。

有兩項因素會獨立變化，因此表格中的行不能合併：

- **名稱。** 第 1、2 行僅在檔案命名命令的形式上不同；所有生成命令檔案的工具都使用 `opsx-<id>` / `opsx:<id>` 這一組名稱。
- **包裝形式。** Amazon Q 會將檔案載入到透過 `@` 呼叫的提示詞庫中。僅支援技能的工具不會生成命令檔案，因此最後三行使用[生成的技能名稱](/zh-Hant/supported-tools/)，它們與命令 ID 並非一一對應（`/opsx:apply` 對應 `openspec-apply-change` 技能）。

上方的命令路徑模式有意使用不限定副檔名的 `.*`：副檔名由工具決定（Gemini CLI 使用 `.toml`、Continue 使用 `.prompt`、Kiro 和 GitHub Copilot 使用 `.prompt.md`）；部分工具在選擇器中會顯示副檔名。請匹配目錄結構，而不是副檔名。

OpenSpec 生成的檔案以及設定完成後顯示的“Getting started”提示，已經採用了所選工具對應的格式。因此，最快的確認方式就是檢視該提示。

## 工具目錄參考

| 工具（ID） | 技能路徑模式 | 命令路徑模式 |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請透過技能呼叫 `/openspec-*`） |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（僅支援技能；請使用 `$openspec-*`） |
| Devin Desktop，原 Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請透過技能呼叫 `/openspec-*`） |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | 不生成（沒有命令介面卡；請透過技能呼叫 `/openspec-*`） |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請透過技能呼叫 `/skill:openspec-*`） |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請使用 MiniMax Code 技能） |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請透過技能呼叫 `/openspec-*`） |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx/<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | 不生成。Rovo 沒有斜槓命令介面——它會自動或根據提示詞匹配技能（例如“使用 openspec-propose 技能”）；`/skills` 僅用於管理技能。生成的內容只通過技能名稱引用技能，不會把它們寫成 `/openspec-*` 命令。 |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（僅支援技能；請使用 `/openspec-*` 或 `@openspec-*`） |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| 共享 `.agents` 技能 (`agents`) | `.agents/skills/openspec-*/SKILL.md` | 不生成（沒有命令介面卡；請透過技能呼叫 `/openspec-*`） |

\*\* GitHub Copilot 提示檔案可在 IDE 擴充套件（VS Code、JetBrains、Visual Studio）中用作自訂斜槓命令。Copilot CLI 目前不會直接讀取 `.github/prompts/*.prompt.md`。選擇 `github-copilot` 還可以設定 GitHub 託管的**雲端編碼智慧代理程式**——詳見下文 [GitHub Copilot 雲端編碼智慧代理程式](/zh-Hant/supported-tools/)。

\*\*\* Hermes 預設從 `~/.hermes/skills/` 載入技能。若要使用專案本地的 OpenSpec 技能，請將專案 `.hermes/skills/` 目錄新增到 `~/.hermes/config.yaml` 的 `skills.external_dirs` 中；之後 Hermes 會透過 `/openspec-propose` 等面向使用者的斜槓呼叫形式提供技能。

\*\*\*\* Windsurf 於 2026 年 6 月 2 日[更名為 Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq)，其設定目錄也隨之更改：`.devin/` 是優先讀寫位置，`.windsurf/` 是舊版只讀回退位置。OpenSpec 也採用了該更名——工具 ID 為 `devin`，同時 `--tools windsurf` 仍是其別名，以確保現有設定指令碼繼續有效。如果專案仍在 `.windsurf/` 中儲存 OpenSpec 檔案，下次執行 `openspec update` 時會提示遷移；拒絕遷移會保留原檔案，而你自己編寫的檔案永遠不會被修改。工作流程按檔名呼叫，因此 `.devin/workflows/opsx-apply.md` 對應 `/opsx-apply`。[Devin Local 智慧代理程式不支援工作流程](https://docs.devin.ai/desktop/devin-local)，只支援技能，而且完全不會讀取 `.windsurf/`。因此，無論何時 OpenSpec 寫入 Devin 技能，技能正文和入門提示都會使用 `/openspec-*` 技能呼叫形式，兩種智慧代理程式均可使用。僅採用 commands 交付時不會寫入技能，兩者都會回退到 `/opsx-*`。

SourceCraft Code Assistant 支援面向其 VS Code 擴充套件。[自訂命令](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands)和[技能](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills)僅可在 VS Code 中使用。此整合不會設定 SourceCraft Web 或 JetBrains。

使用僅技能交付方式時，請要求 Code Assistant 針對你的想法使用 `openspec-propose` 技能。技能會根據請求內容匹配啟用；OpenSpec 不會為此工具生成 `/openspec-*` 命令。

MiniMax Code 是全域的僅技能整合。OpenSpec 只會在 `~/.minimax/skills/` 下寫入 `openspec-*` 目錄，不會建立儲存庫本地的 `.minimax` 或 `.mavis` 目錄。採用僅 commands 交付方式時，會保留現有的 MiniMax Code 全域技能，避免一個專案的交付設定移除其他專案正在使用的技能。

### GitHub Copilot 雲端編碼智慧代理程式

GitHub 的 [Copilot 編碼智慧代理程式](https://docs.github.com/en/copilot/using-github-copilot/coding-agent)執行在 GitHub Actions 環境中，與編輯器中的 Copilot 相互獨立。OpenSpec 可以透過生成兩個檔案來設定它使用 OpenSpec CLI：

- `.github/workflows/copilot-setup-steps.yml`——在智慧代理程式環境中安裝 `@fission-ai/openspec`
- `.github/agents/openspec.agent.md`——說明智慧代理程式如何驅動 OpenSpec

由於這會在儲存庫中寫入 GitHub Actions 工作流程，因此必須**顯式選擇啟用**：

| 方式 | 行為 |
|-----|----------|
| `openspec init`（互動式） | 詢問是否設定雲端檔案。預設選擇為**否**。 |
| `openspec init --copilot-cloud` | 不提示，直接設定檔案（適用於指令碼/CI）。 |
| `openspec init --no-copilot-cloud` | 不提示，跳過設定，並移除之前生成的檔案。 |
| `openspec update` | 不會提示。僅當你選擇了啟用（或專案中已有這些檔案）時才重新整理檔案。如果你選擇不啟用，則會移除由 OpenSpec 管理的雲端檔案。 |

你的選擇會儲存在 `openspec/config.yaml` 的 `githubCopilot.cloudAgent: true|false` 中，因此非互動式更新也會遵循該設定。OpenSpec 只會寫入或移除由它自己生成的檔案——如果你自訂了 `copilot-setup-steps.yml` 或 `openspec.agent.md`，或原本就有自己的檔案，OpenSpec 會保留它們並告知你。

### 何時選擇共享 `.agents` 目標

`agents` 是不繫結廠商的選項：它會將技能寫入 `.agents/skills/`（許多智慧代理程式工具都會讀取的共享根目錄），而不是某個工具專屬目錄。

| 情況 | 選擇 |
|-----------|------|
| 你的工具在上方有專屬條目 | 選擇對應 ID——可使用該工具整合，包括其支援的斜槓命令 |
| 同一個儲存庫中有多個智慧代理程式，且都讀取 `.agents/skills` | 選擇 `agents`——共享一套技能，而不是每種工具各建一套 |
| 你的工具尚未列出，但會讀取 `.agents/skills` | 選擇 `agents` |

將此選項與某個工具專屬 ID 一起選擇沒有問題；通常兩者會寫入不同的根目錄。Codex 和 Zed Agent 是例外，因為它們共用規範 `.agents` 根目錄。如果同時選擇 Codex 與 Zed 或 `agents`，OpenSpec 會保留一套由 Codex 管理的技能樹。交接內容會同時列出 Codex 的 `$openspec-*` 和其他智慧代理程式的 `/openspec-*` 呼叫形式，因此 `--tools all` 以及已有的多智慧代理程式設定仍可正常工作，不會有多個寫入者互相覆蓋檔案。

當專案中已經有 `.agents/skills/` 目錄時，OpenSpec 也會自動提供此選項；僅有 `.agents/` 不夠，因為工具還會用該目錄存放規則和子智慧代理程式定義。注意 `.agents` 與 `.agent` 不同：單數目錄屬於 Antigravity。

請留意以下兩點：

- **只提供技能。** 此目標沒有命令介面卡，因此不會寫入 `opsx-*` 命令檔案；在包含 commands 的交付模式下，`openspec init` 會在 `Commands skipped for: … (no adapter)` 報告中列出 `agents`。透過技能名稱呼叫工作流程——多數讀取 `.agents/skills` 的助手會使用 `/openspec-propose`，也是 OpenSpec 設定提示中顯示的形式。此目標不繫結廠商，因此如果你的助手使用其他形式，請檢視它自己的文件。
- **不會建立或編輯 `AGENTS.md`。** 該目標使用 `.agents/` 目錄。如果根目錄中的 `AGENTS.md` 仍包含舊版 OpenSpec 標記塊，執行 `openspec update` 時會將其刪除——參閱[遷移指南](/zh-Hant/migration-guide/)。

此處介紹的 Zed 支援針對其內建 Zed Agent。Zed External Agents 和 Terminal Threads 使用各自的整合。Agent Skills 需要 [Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) 或更高版本。在不受信任的工作樹中，專案本地技能不可用，除非你先[授予信任](https://zed.dev/docs/worktree-trust)。

Codex、Zed Agent 和不繫結廠商的目標共用 `.agents/skills/`，因此需要了解 OpenSpec 在其中管理哪些內容：OpenSpec 只會寫入、重新整理和移除所選工作流程對應的 `openspec-*` 技能目錄，以及記錄共享技能樹由 Codex、Zed Agent 還是不繫結廠商的目標生成的 `.openspec-target` 標記。該目錄中的其他內容都會保留。`openspec-*` 名稱和標記歸 OpenSpec 管理；其中的修改會在下次 `openspec update` 時被替換，與其他工具的技能相同。

對於尚無標記的專案，OpenSpec 會根據受管理技能中的呼叫方式推斷歸屬：`$openspec-*` 表示 Codex，`/openspec-*` 表示不繫結廠商的目標。若通用規範技能樹與舊版 `.codex/skills` 同時存在，則視為較舊的雙目標安裝，併合併到相容的共享技能樹中。

`openspec update` 也會遵循此歸屬。如果專案的 `.agents` 屬於不繫結廠商的目標，而剩餘 Codex 安裝的依據僅是零散的提示詞檔案，更新會保留已有的 `agents` 技能樹，而不將其重寫為 Codex 語法，同時保留舊提示詞檔案。若要將共享技能樹交由 Codex 管理，請顯式執行 `openspec init --tools codex`。

## 非互動式設定

在 CI/CD 或指令碼中設定時，請使用 `--tools`（也可以選擇使用 `--profile`）：

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**可用工具 ID（`--tools`）**——`windsurf` 也可作為 `devin` 的別名使用：`amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`qoder`、`qwen`、`roocode`、`codeassistant`、`trae`、`zed`、`zcode`、`agents`

## 根據工作流程選擇安裝內容

OpenSpec 會根據所選工作流程安裝相應產物：

- **Core 設定檔案（預設）：** `propose`、`explore`、`apply`、`update`、`sync`、`archive`
- **自訂選擇：** 可以從所有工作流程 ID 中任選子集：`propose`、`explore`、`new`、`continue`、`apply`、`update`、`ff`、`sync`、`archive`、`bulk-archive`、`verify`、`onboard`

也就是說，技能/命令的數量取決於設定檔案和交付模式，並非固定不變。

## 生成的技能名稱

根據設定檔案/工作流程設定選擇後，OpenSpec 會生成以下技能：

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

命令列為見[命令](/zh-Hant/commands/)，`init`/`update` 選項見 [CLI](/zh-Hant/cli/)。

## 相關內容

- [CLI 參考](/zh-Hant/cli/)——終端命令
- [命令](/zh-Hant/commands/)——斜槓命令和技能
- [快速入門](/zh-Hant/getting-started/)——首次設定
