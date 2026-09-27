---
title: "範例與操作配方"
---

從頭到尾演示真實變更。每個配方都會展示需要輸入的命令以及相應輸出，方便你將自己的情況與對應模式匹配並照此操作。範例使用預設的 **core** 命令（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）；需要擴充套件命令集的地方會特別註明。

開始之前提醒一句：`/opsx:propose` 之類的斜槓命令應在 **AI 助手聊天**中輸入；`openspec` 命令則在**終端**中執行。如果你還不熟悉這種區分，請先閱讀[命令的工作方式](/zh-Hant/how-commands-work/)。下面的對話中，`You:` 和 `AI:` 表示聊天內容，以 `$` 開頭的行表示終端命令。

> **還不確定要建置什麼？** 多數配方都適合先執行 `/opsx:explore` 梳理思路。[配方 3](/zh-Hant/examples/)展示了具體操作，[先探索](/zh-Hant/explore/)指南則完整解釋了這種做法的價值。

## 配方 1：小型功能，快速路徑

**適用情境：** 你清楚自己要什麼，而且工作範圍明確。這是最常見的配方。

整個流程只需三個命令：提出、實作、歸檔。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

現在閱讀計畫。開啟提案和差異規格說明。此時正是 OpenSpec 發揮作用的時刻：趁錯誤假設還只佔一段文字時發現它，而不是等到 400 行程式碼寫完。發現問題時可直接編輯任何產物，然後繼續。

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

就是這樣。退出登入行為現在已經成為規格說明的一部分，變更連同完整上下文一起歸檔。

## 配方 2：修復 bug

**適用情境：** 有東西壞了，你希望將修復記錄為有意的行為變更，而不是一條來歷不明的提交。

修復 bug 的流程與新增功能完全相同。區別在於提案的表述方式：描述*正確*行為，而不只是“修復這個 bug”。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

修復會以帶有新情境的 `MODIFIED` 需求形式記錄，因此下一個維護者（或下次 AI 會話）看到的不只是你修復了什麼，還會知道“正確”意味著什麼。之後像往常一樣執行 `/opsx:apply` 和 `/opsx:archive`。

提示：好的修復情境就是用文字寫出的迴歸測試。例如：“GIVEN 一個已退出登入的使用者，WHEN 他提交有效憑據，THEN 他會進入儀表板，且不會再次被重定向。”把它寫出來，實作就有了明確目標。

## 配方 3：在作出決定之前先探索

**適用情境：** 你遇到了問題，但還沒有計畫。不確定要建置什麼，或哪個方案更合適。

從 `/opsx:explore` 開始。這是一位沒有固定流程的思考夥伴。它不會編寫程式碼；除非你要求記錄最終決定，或在它提出時表示同意，否則也不會寫入任何內容。它會讀取程式碼庫並協助你作出決定。

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

探索能在你決定為它建立變更之前，先釐清思路。獲得明確結論後，再提出變更，AI 會將上下文帶入後續工作。

## 配方 4：同時處理兩項變更

**適用情境：** 你正在實作某項功能，突然出現一項更緊急的修復工作。

變更位於不同資料夾，因此並行處理不會相互衝突。開始修復、釋出後，再回到功能開發繼續之前的工作。

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

如果同時有多項活動中的變更，在 `/opsx:apply add-dark-mode` 中寫明變更名稱，就能指定要處理哪一項。由於任務完成狀態記錄在 `tasks.md` 中，AI 能準確知道你上次停在哪裡。

同時完成多項變更時，擴充套件命令 `/opsx:bulk-archive` 可以將它們一起歸檔，並依據實際實作內容解決規格說明衝突。參閱[工作流程](/zh-Hant/workflows/)。

## 配方 5：不改變行為的重構

**適用情境：** 你正在重組程式碼，但外部可見行為應保持完全一致。

這是一個有意思的情況，因為純重構*沒有任何內容需要新增到規格說明中*。行為約定沒有變化，只有實作方式改變。因此，這項工作記錄在設計和任務中，規格差異則為空或不存在。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

在變更的 `.openspec.yaml` 中設定 `skip_specs: true`，以明確宣告沒有差異：

```yaml
schema: spec-driven
skip_specs: true
```

如果沒有此標記，`openspec validate` 會拒絕零差異變更（因此遺漏規格說明階段仍會被發現）；新增標記後，驗證會透過，`openspec status` 也會將規格階段顯示為明確跳過，而非待處理。如果重構最終確實改變了行為，請從 `.openspec.yaml` 中刪除 `skip_specs` 並編寫差異規格說明——驗證會把標記與規格檔案視為衝突，因此過期標記不會悄悄留存。

歸檔帶有此標記的變更無需額外標誌（沒有差異需要合併）。此外，終端命令的 `--skip-specs` 標誌會明確跳過規格說明步驟：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

這個標誌也適用於工具、CI 和僅修改文件的變更。原則是：規格說明描述行為；如果行為未變，規格說明也不應改變。參閱[概念](/zh-Hant/concepts/)。

## 配方 6：逐步控制（擴充套件命令）

**適用情境：** 變更復雜或風險較高，你希望每個產物完成後都能先審閱再繼續。

core 命令 `/opsx:propose` 會一次性起草所有內容。如果你希望逐步處理，請啟用擴充套件命令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

然後逐步搭建並完善變更：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

每個產物生成後都可以先審閱並隨意編輯，滿意後再繼續。想一次性起草其餘內容時，`/opsx:ff` 會快速生成剩餘規劃產物。歸檔之前，`/opsx:verify` 會檢查實作是否確實符合規格說明。參閱[工作流程](/zh-Hant/workflows/)。

## 配方 7：親自走一遍完整流程

**適用情境：** 你已經安裝 OpenSpec，希望在自己的程式碼上*體驗*整個工作流程，而不是隻看玩具範例。

啟用擴充套件命令（見配方 6），然後：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 會在你的程式碼庫中找到一個真實但較小的改進點，為其建立變更、完成實作並歸檔，同時逐步說明每個步驟。整個過程約需 15 到 30 分鐘，最後會留下一個真實變更，你可以選擇保留或放棄。這是最溫和的學習方式。參閱[命令](/zh-Hant/commands/)。

## 在終端中檢查工作

任何時候都可以從終端檢查當前狀態：

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

這些工具用於讀取和檢查。提案和實作仍透過聊天中的斜槓命令完成。完整詳情見 [CLI 參考](/zh-Hant/cli/)。

## 接下來讀什麼

- [先探索](/zh-Hant/explore/)：不確定時建議採用的起步方式
- [工作流程](/zh-Hant/workflows/)：以上模式，以及何時採用哪種模式的指引
- [命令](/zh-Hant/commands/)：所有斜槓命令的詳細說明
- [快速入門](/zh-Hant/getting-started/)：標準的首次變更完整演示
- [概念](/zh-Hant/concepts/)：瞭解各部分如何相互配合
