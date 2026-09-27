---
title: "在現有專案中使用 OpenSpec"
---

**開始時無需記錄整個程式碼庫，只需為即將修改的部分編寫規格說明。** 這是在現有專案中採用 OpenSpec 最重要的一點，也正是 OpenSpec 以棕地專案為優先進行設計的原因。

常見的擔憂是：“我的應用已經有 80,000 行程式碼了。要讓 OpenSpec 發揮作用，我是不是得先為所有程式碼編寫規格說明？”不用。你不會想這麼做，我們也不希望你這麼做。OpenSpec 會隨每次變更逐步積累規格說明。第一次變更記錄它涉及的部分，下一次變更記錄另一部分，幾個月後，規格說明便會圍繞你實際開展的工作自然充實起來。

本指南介紹如何從第一天開始使用 OpenSpec，而無需試圖一次性處理所有事情。

## 三十秒瞭解

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

然後在 AI 聊天中輸入：

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

現在，你的規格說明準確描述了這項變更所涉及的系統部分，僅此而已。這完全正確。無需再擔心其餘 80,000 行程式碼。

## 先寫差異是關鍵

OpenSpec 變更以**差異**形式編寫：`ADDED`、`MODIFIED`、`REMOVED`。差異描述相對於當前行為發生了什麼變化，而不是整個系統的全部情況。

這恰好滿足棕地專案的需要。你很少從零開始建置：可能是新增一個欄位、修復重定向，或縮短超時時間。使用差異，你就能準確描述這項變更，而無需事先為周邊所有內容編寫一份 40 頁的規格說明。

因此，你的 `openspec/specs/` 目錄一開始並不完整。它從近乎空白開始，然後逐漸積累內容。每次歸檔都會將相應差異合併進去。只有在你已經多次修改 `auth/` 後，其中的規格說明才會逐漸完善——而這也正是你需要它完善的時候。

想進一步瞭解其運作方式，請參閱[概念：差異規格說明](/zh-Hant/concepts/)。

## 在真實程式碼庫中的第一個變更

選擇一項小而真實的工作。不要選玩具專案，也不要選重寫。選一項你本來就打算在本週完成的變更。以小變更起步，能讓你在風險較低的情況下熟悉工作流程。

**第 1 步：讓 AI 閱讀相關部分。** 在不熟悉或規模龐大的程式碼庫中，`/opsx:explore` 尤其有用。讓它檢查你即將修改的區域，先了解程式碼的工作方式，再開始提案。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

注意，此時 AI 已經瞭解你的實際結構，因此它編寫的提案會適合你的程式碼，而不是套用通用模板。對大型程式碼庫而言，這個習慣最能減少後續麻煩。參閱[先探索](/zh-Hant/explore/)。

**第 2 步：提出變更。** 提案和差異規格說明只記錄這項變更。

```text
You: /opsx:propose add-api-rate-limiting
```

**第 3 步：實作並歸檔。** 像處理其他變更一樣，使用 `/opsx:apply` 和 `/opsx:archive`。歸檔後，你就擁有了一份真實的限流行為規格說明，而且它來自你本來就需要完成的變更。

## 想要引導式體驗？使用 onboard

如果你希望在自己的程式碼上看到整個流程並聽取說明，擴充套件命令 `/opsx:onboard` 正好可以做到：它會掃描程式碼庫，尋找一項小而安全的改進，然後逐步帶你完成提案、實作和歸檔，並解釋每一步。

先啟用擴充套件命令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

然後在聊天中輸入：

```text
/opsx:onboard
```

這是在真實專案中最溫和的入門方式，並會留下一個真正（但很小）的變更，你可以選擇保留或放棄。參閱[命令：`/opsx:onboard`](/zh-Hant/commands/)。

## “可是我已經有需求文件了”

也許你有 PRD、SRS、正式規格說明，甚至 TLA+ 模型。很好。無需把它們整體匯入，也無需丟棄它們。

把現有文件當作**探索的素材**，而不是需要轉換的規格說明。開始一項變更時，將相關部分貼上給 AI 或告訴它去哪裡檢視，讓它據此整理出範圍明確的 OpenSpec 差異。差異會以 OpenSpec 可測試的需求與情境形式，記錄你現在要修改的行為。原始文件仍留在原處，作為背景資料。

原因很實際：OpenSpec 規格說明特意以行為為先，並圍繞變更劃定範圍。一份 40 頁的 PRD 是用途不同的另一種產物。強行一次性批次轉換，往往會產生一份龐大且過時、沒人信任的規格說明。讓規格說明隨實際變更逐步成長，才能保持準確。

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## 在大型程式碼庫中組織規格說明

規格說明放在 `openspec/specs/` 下，按**領域**分組。領域是符合團隊系統思維方式的邏輯區域。你無需事先設計完整的分類體系；某個區域的第一個變更需要時，再建立相應的領域資料夾即可。

常見的領域劃分方式：

- **按功能區域：** `auth/`、`payments/`、`search/`
- **按元件：** `api/`、`frontend/`、`workers/`
- **按有界上下文：** `ordering/`、`fulfillment/`、`inventory/`

選擇一種讓新成員一看就明白的方式即可，以後還可以調整。參閱[概念：規格說明](/zh-Hant/concepts/)。

## 單體儲存庫與跨儲存庫工作

對於單體儲存庫，最簡單的模式是在儲存庫根目錄放一個 `openspec/` 目錄，其中各領域對應不同的軟體包或服務。這足以滿足大多數團隊的需求。

如果工作確實跨越**多個儲存庫**（或跨越你視為獨立單元的多個軟體包），OpenSpec 提供 beta 版 **stores** 功能：規劃內容放在一個獨立儲存庫中，其他程式碼儲存庫都可以引用，這樣計畫就不必放在某個儲存庫自己的 `openspec/` 資料夾中。此功能仍處於 beta 階段，因此命令和狀態都可能變化。請從[儲存庫使用者指南](/zh-Hant/stores-beta/user-guide/)瞭解其思維模型和最簡實用流程。

## 幾點務實提醒

- **不要忍不住去補齊所有內容。** 為當前不會修改的程式碼編寫規格說明，看起來很有效率，通常卻不是。由於沒有任何機制確保它們與實際情況同步，這些規格說明會過時。讓實際變更推動規格說明的完善。
- **初期變更要小。** 前幾個變更不僅是為了交付，也是為了熟悉節奏。範圍越明確，流程越快，試錯成本越低。
- **將 `openspec/` 提交到 git。** 規格說明和歸檔屬於版本控制，應與其描述的程式碼儲存在一起。
- **為 AI 提供上下文。** 對於約定嚴格的大型程式碼庫，應填寫 `openspec/config.yaml` 的 `context:`，讓每個提案都遵循你的技術棧和模式。參閱[自訂](/zh-Hant/customization/)。

## 接下來讀什麼

- [先探索](/zh-Hant/explore/)——修改程式碼前瞭解程式碼的關鍵習慣
- [快速入門](/zh-Hant/getting-started/)——完整演示第一個變更
- [編輯和迭代變更](/zh-Hant/editing-changes/)——隨著瞭解加深調整變更
- [概念：差異規格說明](/zh-Hant/concepts/)——瞭解差異為何適合棕地專案
- [自訂](/zh-Hant/customization/)——讓 OpenSpec 遵循專案約定
