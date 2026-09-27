---
title: "術語表"
---

這裡彙集了 OpenSpec 中的所有術語，並用通俗語言解釋。快速瀏覽一遍，閱讀其餘文件時會更輕鬆。

術語按主題分組，每組內按字母順序排列。

## 核心名詞

**規格說明 (spec)。** 描述系統某個部分如何執行的文件。規格說明存放在 `openspec/specs/` 中，按領域組織，由需求和情境組成。它是“這款軟體做什麼？”這一問題共同認可的答案。參閱[概念](/zh-Hant/concepts/)。

**唯一真實依據 (source of truth)。** 整個 `openspec/specs/` 目錄。它記錄系統當前共同認可的行為。變更提出對它的修改；歸檔則將這些修改應用進去。

**變更 (change)。** 一個工作單元，以資料夾形式放在 `openspec/changes/<name>/` 下。變更包含該項工作的所有內容：提案、設計、任務，以及引入的規格說明修改。一個變更對應一項功能或修復。

**產物 (artifact)。** 變更中的一份文件。標準產物包括提案、差異規格說明、設計和任務。它們按依賴順序建立，並以前一項為基礎。

**差異規格說明 (delta spec)。** 變更中的規格說明，只通過 `ADDED`、`MODIFIED` 和 `REMOVED` 部分描述變更內容，而非重述整份規格說明。這讓 OpenSpec 能夠簡潔地修改現有系統。參閱[概念](/zh-Hant/concepts/)。

**領域 (domain)。** 規格說明的邏輯分組，例如 `auth/`、`payments/` 或 `ui/`。你可以選擇符合自己系統思維方式的領域。

## 規格說明中的要素

**需求 (requirement)。** 系統必須具備的一項行為，通常使用 RFC 2119 關鍵詞編寫，例如：“系統 SHALL 在 30 分鐘後使會話過期。”需求說明的是*做什麼*，而非*如何做*。

**情境 (scenario)。** 需求實際執行時的一個具體、可測試範例，通常採用 Given/When/Then（給定/當/則）形式。情境讓需求可以驗證：你可以據此編寫自動化測試。

**RFC 2119 關鍵詞。** MUST、SHALL、SHOULD 和 MAY 這些詞具有關於需求嚴格程度的標準化含義。MUST 和 SHALL 表示絕對要求；SHOULD 表示建議，但允許例外；MAY 表示可選。名稱來自訂這些關鍵詞的網際網路標準文件。

## 產物

**提案 (`proposal.md`)。** 變更的*原因*和*內容*：其意圖、範圍和大致方案。首先建立的產物。

**設計 (`design.md`)。** 變更的*實作方式*：技術方案、架構決策以及預計會修改的檔案。簡單變更可以省略。

**任務 (`tasks.md`)。** 帶複選框的實作清單。AI 在 `/opsx:apply` 期間會逐項執行並勾選。

## 生命週期

**歸檔 (archive)。** 完成變更的過程。其差異規格說明會合併到主規格說明中，變更資料夾則移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。歸檔後，規格說明反映新的實際情況。參閱[概念](/zh-Hant/concepts/)。

**同步 (sync)。** 將變更的差異規格說明合併到主規格說明中，*但不歸檔*該變更。通常會自動執行（歸檔時會提示同步），也可以透過 `/opsx:sync` 單獨執行，適用於耗時較長的變更。參閱[命令](/zh-Hant/commands/)。

## 工作流程與命令

**OPSX。** 當前的標準 OpenSpec 工作流程，圍繞靈活的操作建置，而非僵化的階段。它的斜槓命令均以 `/opsx:` 開頭。參閱[OPSX 工作流程](/zh-Hant/opsx/)。

**斜槓命令 (slash command)。** 在 AI 助手聊天中輸入的命令，例如 `/opsx:propose`。斜槓命令驅動工作流程，不是終端命令。參閱[命令的工作方式](/zh-Hant/how-commands-work/)。

**探索 (`/opsx:explore`)。** 思考夥伴命令。它會讀取程式碼庫、比較選項，並把模糊想法梳理成具體計畫。它不會編寫程式碼；除非你要求將探索結果記錄為變更，或在它提出該建議時表示同意，否則也不會寫入其他內容。當你有問題但尚無計畫時，建議從此命令開始。參閱[先探索](/zh-Hant/explore/)。

**CLI。** 在終端執行的 `openspec` 程式。它用於設定專案、列出和驗證變更、開啟儀表板以及歸檔，是 OpenSpec 的終端端工具。參閱[CLI](/zh-Hant/cli/)。

**技能 (skill)。** 包含指令的資料夾 (`.../skills/openspec-*/SKILL.md`)，AI 助手會自動檢測並遵循其中的指令。技能正逐漸成為跨工具交付 OpenSpec 工作流程的標準方式。

**命令檔案 (command file)。** 針對具體工具的斜槓命令檔案 (`.../commands/opsx-*`)。這是較早採用的交付機制，目前仍與技能並行支援。通常無需直接編輯這些檔案。

**設定檔案 (profile)。** 專案中安裝的斜槓命令集合。預設的 **Core** 包含 `propose`、`explore`、`apply`、`update`、`sync`、`archive`。**expanded** 集合還增加 `new`、`continue`、`ff`、`verify`、`bulk-archive`、`onboard`。使用 `openspec config profile` 更改設定檔案。

**交付方式 (delivery)。** OpenSpec 為你的工具安裝技能、命令檔案，還是兩者都安裝。此項在全域範圍設定，並透過 `openspec update` 應用。

## 自訂

**模式 (schema)。** 定義工作流程包含哪些產物，以及它們之間依賴關係的規範。內建預設值是 `spec-driven`（提案 → 規格說明 → 設計 → 任務）。你可以從中派生自己的模式，也可以自行編寫。參閱[自訂](/zh-Hant/customization/)。

**模板 (template)。** 模式中的 Markdown 檔案，用於規定 AI 為特定產物生成的內容形式。編輯模板後，AI 會立即採用新輸出方式，無需重新建置。

**專案設定 (`openspec/config.yaml`)。** 單個專案的設定：預設模式、注入每次規劃請求的 `context:`，以及針對每種產物的 `rules:`。這是讓 OpenSpec 瞭解技術棧和約定的最簡便方式。參閱[自訂](/zh-Hant/customization/)。

**上下文注入 (context injection)。** 將專案背景放入 `config.yaml` 的 `context:` 欄位，使其自動加入 AI 生成的每份產物中。與寄希望於 AI 讀取單獨檔案相比，這種方式更可靠。

**依賴圖 (dependency graph)。** 由產物的 `requires:` 關係構成的有向圖。它是一個 DAG（有向無環圖：箭頭只向前，不會形成迴圈），OpenSpec 用它判斷接下來可以建立什麼。

**助力，而非關卡 (enablers, not gates)。** 產物依賴關係說明下一步*可以*做什麼，而不是*必須*做什麼這一原則。任何時候都可以回頭修改任一產物。參閱[核心概念速覽](/zh-Hant/overview/)。

## 跨儲存庫協作（beta）

僅當你的規劃跨越多個儲存庫時，才適用以下術語。目前處於 beta 階段，大多數使用者無需關注。參閱[儲存庫使用者指南](/zh-Hant/stores-beta/user-guide/)。

**儲存庫 (store)。** 專門用於規劃的獨立儲存庫。它擁有你熟悉的 `openspec/` 結構（規格說明和變更），以及一個簡短的身份檔案。你可以在本機按名稱註冊一次，之後便可從任意位置透過任何 OpenSpec 命令在其中工作。

**引用 (reference)。** 程式碼儲存庫在 `openspec/config.yaml` 中宣告自己會使用某個儲存庫。引用為只讀：程式碼儲存庫保留自己的根目錄，而 `openspec instructions` 會增加所引用儲存庫規格說明的索引，併為每項提供準確的獲取命令。

**工作上下文 (working context)。** `openspec context` 為當前儲存庫彙總的內容：它自己的 OpenSpec 根目錄，以及所引用的每個儲存庫和相應的獲取方式。也就是“我正在使用哪些內容？”這一問題的答案。

**工作集 (workset)。** 在個人機器上建立的一組本地資料夾，可以將它們一起開啟（一個儲存庫和正在使用的程式碼儲存庫）。使用 `openspec workset create` 明確建立；這些本地路徑不會提交到共享規劃儲存庫。

## 另請參閱

- [核心概念速覽](/zh-Hant/overview/)：一頁介紹五個理念
- [概念](/zh-Hant/concepts/)：詳細說明
- [命令的工作方式](/zh-Hant/how-commands-work/)：斜槓命令與 CLI 的區別
