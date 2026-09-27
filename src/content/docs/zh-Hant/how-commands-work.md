---
title: "命令的工作方式"
---

**只需記住一件事：OpenSpec 有兩種命令，分別在不同的地方執行。**

- `openspec ...` 命令在**終端**中執行。（例如：`openspec init`。）
- `/opsx:...` 命令在 **AI 助手聊天**中執行。（例如：`/opsx:propose`。）

如果你曾在終端中輸入 `/opsx:propose`，卻什麼也沒發生，本頁就能解釋原因：你正在與 OpenSpec 錯誤的一半對話。斜槓命令不是終端命令，而是你在 AI 程式設計助手中輸入的指令，就像在同一個聊天框裡輸入“新增一個登入表單”一樣。

這是新使用者最常遇到的障礙，因此我們會把它說明白。

## 兩個部分

OpenSpec 是一個身兼兩職的專案。

**CLI（終端部分）。** 名為 `openspec` 的程式，你可以安裝後從 shell 中執行。它會設定專案、列出並驗證變更、顯示儀表板，以及歸檔已完成的工作。你可以在 iTerm、VS Code 終端、PowerShell，或任何可以執行 `git` 或 `npm` 的地方輸入命令。

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**斜槓命令（聊天部分）。** 像 `/opsx:propose` 和 `/opsx:apply` 這樣的簡短命令，輸入到 AI 助手中。這些命令會要求 AI 遵循 OpenSpec 工作流程：起草提案、編寫規格說明、按任務清單實作，並在完成後歸檔。可以在 Claude Code、Cursor、Devin Desktop、Copilot 或你所使用的其他助手中輸入。

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

下面這張圖概括了整個思維模型：

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

注意圖中的箭頭。在終端中執行 `openspec init`，會將斜槓命令*安裝*到 AI 工具中。終端部分負責設定聊天部分。完成設定後，日常操作大多在聊天中進行。

## “如何啟動互動模式？”

**沒有需要單獨啟動的互動模式。** 這是個常見問題，值得直接說明。

無需進入特殊的 OpenSpec 模式。像平常一樣開啟 AI 程式設計助手，在聊天中輸入斜槓命令即可。斜槓命令本身就是“進入”OpenSpec 的方式。助手會識別命令、載入對應的 OpenSpec 技能，並開始遵循相應工作流程。

實際只需這樣做：

1. 在專案中開啟 AI 程式設計助手（例如 Claude Code、Cursor、Devin Desktop）。
2. 在它的聊天中輸入 `/opsx:propose`，就像輸入其他請求一樣。
3. 留意自動補全：如果 OpenSpec 已安裝，輸入斜槓時會出現 `/opsx:propose`、`/opsx:apply` 等建議。

就是這樣。無需切換模式、啟動守護程序或開啟單獨的視窗。

終端中確實有一個互動式功能：`openspec view`。它會開啟一個儀表板，用於瀏覽規格說明和變更。但它只是檢視器，不是用於提出和實作變更的工具。真正的建置工作透過聊天中的斜槓命令進行。

## 為什麼要這樣劃分

瞭解這種劃分很有價值，因為它解釋了 OpenSpec 為何能配合 30 多種 AI 工具使用。

CLI 是**引擎**。它瞭解規則：變更資料夾應是什麼樣子、各產物之間有哪些依賴關係，以及如何將差異規格說明合併到唯一真實依據中。無論使用哪種工具，它都相同。

斜槓命令是**方向盤**，每種 AI 工具的方向盤都略有不同。Claude Code 將它們稱為命令；Cursor 和 Devin Desktop 使用各自的格式；有些工具稱其為技能。執行 `openspec init` 時，OpenSpec 會為你選擇的每種工具生成相應檔案，因此無論你偏好哪種助手，都可以表達相同的 `/opsx:propose` 意圖。

這種設計的優點是：學會一次工作流程，就能在不同工具間使用。代價是：不同工具的命令語法可能略有差異，下一節會介紹這些差異。

## 不同工具的斜槓命令語法

命令意圖處處相同，具體拼寫則取決於工具載入的檔案。

| 工具的命令檔案 | 輸入方式 | 範例工具 |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code、Gemini CLI、Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor、GitHub Copilot（IDE）、Devin Desktop、Trae、Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| 無——僅支援技能 | `/openspec-propose` | CodeArts、ForgeCode、Hermes、Mistral Vibe、Zed Agent、共享 `.agents` |
| 無——Kimi Code | `/skill:openspec-propose` | Kimi Code |
| 無——Codex CLI | `$openspec-propose` | Codex |

Devin 是唯一橫跨兩行的工具。Devin Desktop 會讀取 `.devin/workflows/`，所以在那裡可以使用 `/opsx-propose`；[Devin Local 不支援](https://docs.devin.ai/desktop/devin-local)，因此在該智慧代理程式中應使用 `/openspec-propose` 技能。OpenSpec 寫入 `.devin/skills/` 的技能在兩種環境中都有效，因此它們會透過技能名稱相互引用。

所有工具均列在[如何呼叫](/zh-Hant/supported-tools/)中——該表是權威參考。有兩行並非斜槓命令：Amazon Q 會把檔案載入到透過 `@` 呼叫的提示詞庫；最後三行使用的是*技能名稱*，它並非命令 ID（`/opsx:apply` 對應的技能是 `openspec-apply-change`）。

拿不準時，檢視 `openspec init` 列印的“Getting started”提示，其中已經使用了工具註冊的格式。也可以輸入斜槓並檢視自動補全，但並非所有工具都提供斜槓命令。

## 命令從何而來：技能與命令

執行 `openspec init`（或 `openspec update`）時，OpenSpec 會在專案中寫入一些小檔案，讓 AI 工具能夠找到工作流程。根據工具和設定，這些檔案可能是**技能**、**命令**或兩者兼有。

- **技能**通常位於 `.claude/skills/openspec-*/SKILL.md` 等路徑。它們是新興的跨工具標準：一組可由助手自動檢測的指令檔案。
- **命令**通常位於 `.cursor/commands/opsx-<id>.md` 或 `.claude/commands/opsx/<id>.md` 等路徑——目錄結構取決於工具，工具也決定如何輸入命令。它們是較早採用的、按工具區分的斜槓命令檔案。Codex 不會生成命令檔案；請改用 `.agents/skills/openspec-*`。

你無需關心工具使用的是哪種檔案。輸入斜槓命令即可。但瞭解這些檔案的存在有助於排查問題：命令消失時，通常是檔案缺失或已過時；執行 `openspec update` 可重新生成。

每種工具對應的確切路徑見[支援的工具](/zh-Hant/supported-tools/)；技能如何取代較早的純命令方式，見[遷移指南](/zh-Hant/migration-guide/)。

## 確認已經安裝

按照從快到慢的順序檢查：

1. **在 AI 聊天中輸入斜槓。** 輸入 `/opsx` 並檢視自動補全建議。如果出現建議，說明設定正常。對於僅支援技能的工具（Codex、Kimi Code、CodeArts、ForgeCode、Hermes、Mistral Vibe、Zed Agent 或共享 `.agents` 目標），即使安裝正常，輸入 `/opsx` 也不會自動補全——請嘗試上表中的技能名稱。
2. **檢視檔案。** 對於 Claude Code，檢查 `.claude/skills/` 中是否有 `openspec-*` 資料夾。其他工具使用各自的目錄（見[支援的工具](/zh-Hant/supported-tools/)）。
3. **重新執行設定。** 在專案根目錄執行 `openspec update`。這會為你設定的工具重新生成技能和命令檔案。
4. **重新啟動助手。** 許多工具會在啟動時掃描技能和命令，因此重新開啟視窗可能就是解決辦法。

## 我有哪些命令？

預設情況下，OpenSpec 會安裝 **core** 斜槓命令集：

- `/opsx:explore`：在確定變更之前與 AI 一起梳理想法（拿不準時很適合作為第一步）
- `/opsx:propose`：建立變更並一次性起草所有規劃產物
- `/opsx:apply`：逐項執行任務清單以實作變更
- `/opsx:update`：修改變更的規劃產物並保持內容一致
- `/opsx:sync`：將變更對規格說明的更新合併到主規格說明中（通常會自動執行）
- `/opsx:archive`：完成變更並歸檔

推薦的預設節奏是：還在考慮要做什麼時使用 `explore`，然後依次使用 `propose`、`apply` 和 `archive`。[先探索](/zh-Hant/explore/)指南解釋了為什麼先探索很有價值。

此外，還有面向需要更精細控制的使用者的 **expanded** 命令集（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）。執行 `openspec config profile` 啟用，然後執行 `openspec update` 應用。

如果你剛開始使用，擴充套件命令集中的 `/opsx:onboard` 會在你自己的程式碼庫中帶你走完一項完整變更，並逐步說明操作。它是最友好的入門方式。

每個命令的詳細用途見[命令](/zh-Hant/commands/)；何時使用哪個命令見[工作流程](/zh-Hant/workflows/)。

## 從頭開始的完整流程

以下完整流程標註了每一步發生的位置：

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

在終端中執行兩步完成設定，然後主要就在聊天中工作。這就是日常節奏。

## 相關內容

- [快速入門](/zh-Hant/getting-started/)：首次變更的完整演示
- [命令](/zh-Hant/commands/)：逐一介紹所有斜槓命令
- [CLI](/zh-Hant/cli/)：逐一介紹所有終端命令
- [支援的工具](/zh-Hant/supported-tools/)：各工具的語法和檔案位置
- [常見問題](/zh-Hant/faq/)：更多簡要解答
- [故障排除](/zh-Hant/troubleshooting/)：命令未顯示時的解決辦法
