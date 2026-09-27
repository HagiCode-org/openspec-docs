---
title: "常見問題"
---

這裡簡要回答大家最常問的問題。如果你的問題更像是“出了故障”，請檢視[故障排除](/zh-Hant/troubleshooting/)。如果想了解術語定義，請檢視[術語表](/zh-Hant/glossary/)。

## 基礎知識

### 用一句話來說，OpenSpec 是什麼？

OpenSpec 是一個輕量級約定層，讓你和 AI 程式設計助手在編寫任何程式碼之前，以書面形式就要建置什麼達成一致。

### 為什麼我需要它？

因為 AI 助手即使錯了也可能顯得很自信。如果需求只存在於聊天記錄中，AI 就會透過猜測填補空白，而你可能等程式碼寫完後才發現問題。OpenSpec 將達成共識的時機提前，讓錯誤能夠以較低成本修正。完整說明請參閱[核心概念速覽](/zh-Hant/overview/)。

### 所有事情都必須使用 OpenSpec 嗎？

不必。在需要達成共識的工作中使用它，這包括大多數非瑣碎任務。修復一個字元的拼寫錯誤可能不值得走完整流程，沒關係。

### 它適用於大型現有程式碼庫，還是隻適用於新專案？

現有程式碼庫才是 OpenSpec 的主要使用情境。OpenSpec 優先考慮棕地專案：你無需預先記錄整個應用，只需為每項變更涉及的內容編寫規格說明。規格說明會圍繞你實際完成的工作逐步完善。參閱專門的[在現有專案中使用 OpenSpec 指南](/zh-Hant/existing-projects/)。

### 它是否繫結某種 AI 工具？

不繫結。OpenSpec 支援 30 多種助手，包括 Claude Code、Cursor、Devin Desktop、GitHub Copilot、Gemini CLI、Codex 等。完整清單和各工具詳情見[支援的工具](/zh-Hant/supported-tools/)。

## 執行命令

### `/opsx:propose` 應該在哪裡輸入？

在 AI 助手聊天中，而不是終端。這是最常見的困惑，因此有專門的[命令的工作方式](/zh-Hant/how-commands-work/)頁面。簡而言之：`openspec ...` 在終端執行，`/opsx:...` 在聊天中執行。

### 如何“啟動互動模式”？

沒有單獨需要啟動的模式。像平常一樣開啟 AI 助手，在聊天中輸入斜槓命令即可。輸入斜槓命令就是“進入”OpenSpec 的方式。（真正具有互動性的終端功能是 `openspec view`，它提供瀏覽規格說明和變更的儀表板。）詳情見[命令的工作方式](/zh-Hant/how-commands-work/)。

### 我輸入了斜槓命令，卻什麼也沒發生。為什麼？

最可能的原因是你在終端而非 AI 聊天中輸入了命令、使用了工具無法識別的拼寫，或尚未安裝這些命令。如果檔案缺失，或你從未設定該工具，請執行 `openspec init`；`openspec update` 只會重新整理已有檔案。然後重新啟動助手，並使用“Getting started”中顯示的命令格式——參見[如何呼叫](/zh-Hant/supported-tools/)。完整檢查清單見[故障排除](/zh-Hant/troubleshooting/)。

### 為什麼有些工具使用 `/opsx:propose`，另一些卻用 `/opsx-propose`？

不同 AI 工具呈現自訂命令的方式不同，OpenSpec 會根據工具載入的檔案形式選擇命令拼寫。名為 `opsx-propose.md` 的命令檔案對應 `/opsx-propose`；放在 `commands/opsx/` 下的檔案則對應 `/opsx:propose`。使用技能而非命令的工具會使用技能名稱——Codex 使用 `$openspec-propose`，Kimi Code 使用 `/skill:openspec-propose`。`openspec init` 中的“Getting started”提示會顯示你所選工具對應的格式；完整表格見[如何呼叫](/zh-Hant/supported-tools/)。

### 技能和命令有什麼區別？

兩者都是 OpenSpec 寫入的檔案，用於讓助手執行工作流程。技能 (`.../skills/openspec-*/SKILL.md`) 是較新的跨工具標準；命令 (`.../commands/opsx-*`) 是較早採用的、按工具區分的斜槓命令檔案。你無需自己選擇。輸入斜槓命令後，OpenSpec 會安裝你的工具所使用的形式。

## 工作流程

### 還不確定要建置什麼時，應該從哪裡開始？

從 `/opsx:explore` 開始。它是一位沒有壓力的思考夥伴，會讀取程式碼庫、列出選項，並在編寫程式碼之前把模糊的問題梳理成具體計畫。它包含在預設設定檔案中，隨時可用。計畫清晰後，再轉交 `/opsx:propose`。這是最值得養成的習慣，因為它能阻止躍躍欲試的 AI 自信地建置錯誤的內容。參閱[先探索](/zh-Hant/explore/)。

### 最簡單的流程是什麼？

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

先用 Explore 梳理想法，再用 propose 起草計畫、用 apply 實作，最後用 archive 歸檔。已經完全清楚自己要什麼時，可以跳過 Explore。

### `/opsx:propose` 和 `/opsx:new` 有什麼區別？

`/opsx:propose` 是預設的單步命令：它會建立變更並一次性起草所有規劃產物。`/opsx:new` 屬於擴充套件命令集，只搭建空的變更框架，然後由你透過 `/opsx:continue` 一次建立一個產物（或使用 `/opsx:ff` 一次建立全部產物）。除非你需要逐步控制，否則使用 propose 即可。參閱[命令](/zh-Hant/commands/)。

### `core` 和 expanded 設定檔案是什麼？

設定檔案決定安裝哪些斜槓命令。預設的 **Core** 包含 `propose`、`explore`、`apply`、`update`、`sync` 和 `archive`。**expanded** 集合還增加 `new`、`continue`、`ff`、`verify`、`bulk-archive` 和 `onboard`，提供更細緻的控制。使用 `openspec config profile` 切換，然後執行 `openspec update` 應用設定。

### 我需要執行 `/opsx:sync` 嗎？

通常不需要。Sync 會把變更的差異規格說明合併到主規格說明中，而 `/opsx:archive` 會主動為你執行同步。只有當你希望在歸檔之前先合併規格說明時，才手動執行 sync，例如處理耗時較長的變更。參閱[命令](/zh-Hant/commands/)。

### 開始之後，如何編輯提案、規格說明或任務？

直接編輯檔案即可。每項產物都是 `openspec/changes/<name>/` 下的純 Markdown 檔案，沒有鎖定階段或特殊編輯模式。你可以手動修改，也可以讓 AI 幫忙（“更新設計，改用佇列”），然後繼續。AI 始終基於檔案的當前內容工作。完整指南見[編輯和迭代變更](/zh-Hant/editing-changes/)。

### 實作了一部分之後，還能回頭修改計畫嗎？

可以，任何時候都可以。工作流程很靈活，審查和編輯不會把你限制在某個階段。編輯產物後繼續即可。如果需要有條理地檢查程式碼是否仍符合計畫，可以執行 `/opsx:verify`。參閱[編輯和迭代變更](/zh-Hant/editing-changes/)。

### 我手動編輯了程式碼，如何與規格說明協調？

歸檔會讓規格說明成為正式記錄，所以歸檔前需要讓兩者重新一致。如果程式碼現在正確，就更新差異規格說明以反映已交付內容；如果規格說明正確，就繼續實作，直到程式碼符合要求。`/opsx:verify` 可以指出不一致。參閱[編輯和迭代變更](/zh-Hant/editing-changes/)。

### 何時應更新現有變更，何時應新建？

同一項工作只是經過完善時就更新；意圖徹底改變或範圍膨脹成另一項工作時就重新開始。決策流程圖和範例見[工作流程](/zh-Hant/workflows/)。

### 如果會話上下文用完，或實作過程中需求發生變化，該怎麼辦？

這正是規格說明發揮作用的地方。計畫存放在檔案中，而不只是聊天記錄裡，因此你可以清空上下文、開始新的 AI 會話，再執行 `/opsx:apply`；它會讀取產物，並從第一個未勾選的任務繼續。需求變化時，修改產物以反映新的實際情況，然後繼續。保持乾淨的上下文視窗也能得到更好的結果；開始實作前可以清空上下文。

### 我應該把 `openspec/` 資料夾提交到 git 嗎？

應該。規格說明、活動中的變更和歸檔都是專案歷史的一部分，應像其他原始檔一樣提交。尤其是歸檔，它會成為記錄系統為何如此執行的長期資料。

## 規格說明與變更

### 規格說明和設計分別寫什麼？

規格說明描述可觀察的行為：系統做什麼、輸入和輸出是什麼，以及錯誤情形如何處理。設計描述如何建置：技術方案、架構決策和檔案變更。如果改變實作但不改變外部可見行為，該內容就屬於設計，而非規格說明。詳見[概念](/zh-Hant/concepts/)。

### 什麼是差異規格說明？

差異規格說明只通過 `ADDED`、`MODIFIED` 和 `REMOVED` 章節描述變更內容，而不會重述整份規格說明。這是 OpenSpec 簡潔地修改現有系統的方式。參閱[概念](/zh-Hant/concepts/)。

### 已歸檔的變更會放在哪裡？

它會連同所有變更產物一起移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`，並從活動變更列表中移除。明確宣告 `retire_capabilities: true` 的變更還可以在刪除某項能力的最後一條需求時，刪除該能力的主規格說明。

## 設定與自訂

### 如何告訴 AI 我的技術棧？

將資訊放在 `openspec/config.yaml` 的 `context:` 下。該文字會注入每個規劃請求，因此 AI 始終了解你的技術棧和約定。參閱[自訂](/zh-Hant/customization/)。

### 可以用英語以外的語言生成規格說明嗎？

可以。在設定的 `context:` 中新增語言指令。[多語言指南](/zh-Hant/multi-language/)提供了多種語言的可複製片段。

### 可以更改工作流程本身嗎？

可以，使用自訂模式即可。模式定義有哪些產物以及彼此之間的依賴關係。使用 `openspec schema fork spec-driven my-workflow` 從預設模式派生，再進行編輯。參閱[自訂](/zh-Hant/customization/)。

## 模型、隱私與升級

### 應該使用哪種 AI 模型？

OpenSpec 最適合搭配推理能力強的模型。README 建議在規劃和實作時使用 Codex 5.5、Opus 4.7 等模型。也要保持上下文窗口乾淨：開始實作前清空上下文，以獲得最佳效果。

### OpenSpec 會收集資料嗎？

它會收集匿名使用統計資訊，僅包括命令名稱和版本。不收集引數、路徑、內容或個人資料，並會在 CI 中自動關閉。可使用 `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1` 選擇退出。

### 如何升級？

分兩步完成。先升級軟體包 (`npm install -g @fission-ai/openspec@latest`)，然後在每個專案中執行 `openspec update`，重新整理生成的技能和命令。

### 如何解除安裝 OpenSpec？

沒有專門的解除安裝命令，因為它只是一個全域軟體包和專案中的一些檔案。移除軟體包 (`npm uninstall -g @fission-ai/openspec`)，還可以選擇刪除 `openspec/` 目錄和生成的工具檔案。分步說明以及哪些內容可以保留，見[安裝指南](/zh-Hant/installation/)。

## 獲取幫助

### 在哪裡提問或報告 bug？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **在終端中：** 執行 `openspec feedback "your message"`，即可為你建立 GitHub Issue。

### 文件有錯誤或讓人困惑，該怎麼辦？

告訴我們，或者直接修正。我們歡迎並重視文件拉取請求。你可以提交 issue 或拉取請求。
