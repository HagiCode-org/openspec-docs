---
title: "先探索"
---

**`/opsx:explore` 是你的思考夥伴。當你有問題但尚無計畫時，就使用它。** 它會調查程式碼庫、與你一起權衡選項，並在編寫任何程式碼之前，幫你明確真正想要什麼。思路清晰後，它會將工作交給 `/opsx:propose`。

如果你只從這些文件中養成一個習慣，就記住這一點：**拿不準時，先探索，再提案。**

這很重要。AI 程式設計助手總是躍躍欲試。提示含糊時，它們會自信地建置出“某種東西”——但可能不是你需要的東西。Explore 正是解決辦法。它是一場沒有壓力的對話，你和 AI 一起找出正確的做法，這樣等你開始提案時，提出的就是正確方案。

## 何時進行探索

比許多人預想的更多時候，探索都是正確的第一步。遇到以下任一情形時都可以使用：

- 你知道*問題*，但不知道*解決方案*。（“頁面感覺很慢。”“身份驗證一團糟。”“我們總是收到重複訂單。”）
- 你正在不同方案之間做選擇，想根據實際程式碼瞭解各種取捨。
- 你剛接觸某個程式碼庫，需要在修改前先弄清楚某部分的工作方式。
- 需求還不明確，想在確定方案前把它們梳理清楚。
- 你懷疑工作量比表面上更大或更小，想如實確定範圍。

只有當你已經完全清楚要做什麼以及怎麼做時，才跳過探索。此時可以直接使用 [`/opsx:propose`](/zh-Hant/commands/)。

## 它會做什麼（以及不會做什麼）

Explore 是一場**對話**，不是生成器。

**它會：**

- 閱讀並搜尋程式碼庫，以回答實際問題。
- 比較各種方案並說明各自的取捨。
- 繪製圖示，讓設計更容易理解。
- 幫你將模糊想法收斂為具體且可實作的範圍。
- 在你要求或接受它的提議時記錄探索結果：使用 `openspec new change` 搭建變更框架，並編寫你指定的規劃產物，或更新現有變更的產物。
- 在你準備好時轉到 `/opsx:propose`。

**它不會：**

- 編寫或修改程式碼。Explore 在任何路徑中都不會編寫程式碼，包括記錄探索結果時。
- 設計或編輯你的模式或模板。這類工作屬於變更，而非思考。
- 自行啟動變更或編寫產物。除非你主動要求，或在它提出時表示同意，否則它不會寫入任何內容；即使你同意，也只會寫你確認的內容，以及啟動變更所需的設定檔案（見下文）。
- 迫使你記錄探索結果。思路逐漸明確時，它會提出建議，但由你決定是否採納。

這正是設計目的。探索不需要你承擔成本，也不會讓你作出承諾，除非你明確同意。你可以探索三個行不通的方向，從每個方向中學到一些東西，最後再提案實施留下來的方案。

## 它已經安裝好了

好訊息：`/opsx:explore` 已包含在預設的 **core** 設定檔案中，與 `propose`、`apply`、`update`、`sync` 和 `archive` 並列。你無需啟用任何功能。只要專案已設定 OpenSpec，就可以在 AI 聊天中使用 Explore。（和所有 `/opsx:*` 命令一樣，要在助手聊天中輸入，而不是在終端中輸入。參閱[命令的工作方式](/zh-Hant/how-commands-work/)。）

## 完整範例

看看一個模糊的擔憂如何變成明確且可實作的變更。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

注意剛才發生的事。起初只是“有些地方不對勁，我不敢貿然修改”。短短二十秒的探索就得到了明確的根本原因、按優先順序排列的三個方案、基於現有程式碼給出的建議，以及範圍清楚的變更。接下來的提案之所以明確，是因為先進行了思考。

## 轉交給 propose

Explore 不會將內容歸檔到任何地方。準備好後，只需開始一項變更，AI 就會把對話中的上下文帶入產物。

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

你可以用日常語言表達（“把這個整理成一項變更吧”），也可以直接執行 `/opsx:propose <name>`。無論採用哪種方式，剛剛進行的探索都會成為提案的基礎，而不是被丟棄的聊天記錄。

你也可以不結束當前對話，直接讓 Explore 記錄變更：“為這個開始一項變更”會搭建資料夾，“再把提案也寫出來”則會準確地建立你指定的產物。搭建框架時也會寫入變更自身的元資料，並補齊專案頂層缺少的內容（`openspec/specs/`、`openspec/changes/archive/`、`config.yaml`）。

這與轉交給 propose 的最終結果相同，區別在於：propose 會生成模式要求的、足以開始實作的整套產物，而記錄探索結果時只會生成你指定的產物。

如果使用擴充套件命令集，Explore 也可以將工作交給 `/opsx:new`，以便逐步建立產物。參閱[工作流程](/zh-Hant/workflows/)。

## 有效探索的提示

- **帶來問題，而不是預設的解決方案。** “登入感覺很慢”給 AI 留下了調查空間；“新增 Redis 快取”則讓你過早選定了未經驗證的答案。
- **明確詢問各種取捨。** “每種方案的缺點是什麼？”能幫你獲得更誠實的比較。
- **讓 AI 先閱讀。** 最好的探索始於 AI 實際檢查程式碼，而不是憑空猜測。如果有幫助，可以指出相關區域。
- **放棄也沒關係。** 如果探索發現這個想法不值得做，那也是一種收穫，而且學費很低。
- **變更過程中也可以再次探索。** 在 `/opsx:apply` 期間遇到困難？可以退一步探索一個子問題，然後再繼續。

## 坦誠看待取捨

**你會得到什麼：** Explore 能在成本最低的時候發現方向錯誤，在你作出任何承諾之前及時糾正。它在不熟悉的程式碼中尤其有用，AI 閱讀和總結系統的能力可以省去你花一下午摸索程式碼的時間。

**它需要什麼：** 一點耐心。Explore 是對話，比直接執行 `/opsx:propose` 並寄希望於結果更慢。如果你已經真正理解這項工作，額外步驟就只是開銷，完全可以跳過。

一個經驗法則：任務越模糊，探索越有價值；任務越明確，就越可以直接開始提案。

## 接下來讀什麼

- [命令：`/opsx:explore`](/zh-Hant/commands/)：精確的命令參考
- [工作流程](/zh-Hant/workflows/)：在日常迴圈中使用探索
- [範例與配方](/zh-Hant/examples/)：完整流程中如何進行探索
- [快速入門](/zh-Hant/getting-started/)：包含探索環節的首次變更指南
