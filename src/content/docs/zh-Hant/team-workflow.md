---
title: "在團隊中使用 OpenSpec"
---

其他指南中的所有內容，無論你是獨自工作還是身處二十人團隊，流程都一樣。團隊協作帶來的變化在於周邊問題：規格說明放在哪裡、團隊成員如何審查計畫，以及這一切如何融入現有的拉取請求流程？

簡短回答：變更只是檔案，而 OpenSpec 從不觸碰 git。因此它能融入現有工作流程，而不是取代它。本頁說明哪些約定行之有效。

## 一條規則：OpenSpec 不碰 git

OpenSpec 會在 `openspec/` 下讀取和寫入純 Markdown 檔案。它絕不會在你的專案中提交、建立分支、推送或拉取，也不會自行複製或同步[儲存庫](/zh-Hant/stores-beta/user-guide/)。這意味著：

- **像提交其他原始檔一樣提交 `openspec/`。** 規格說明、活動中的變更和歸檔都屬於專案歷史。（沒錯，要提交整個資料夾——參見[常見問題](/zh-Hant/faq/)。）
- **像管理程式碼一樣對變更資料夾進行版本管理。** `openspec/changes/add-dark-mode/` 只是一個分支上的一組檔案。
- **以下所有內容都是約定，而非強制。** OpenSpec 不會要求你必須這樣做，只是這種方式配合起來很順暢。

## 日常迴圈

一種行之有效的工作流程，是將變更對應到一個分支和一個拉取請求：

```
git switch -c add-dark-mode        start a branch, as usual
   │
/opsx:propose add-dark-mode        draft the plan (proposal + specs + tasks)
   │
REVIEW THE PLAN                    you read it before any code — see Reviewing a Change
   │
/opsx:apply                        build it; artifacts + code change together
   │
git commit && open a PR            the PR contains the spec delta AND the code
   │
teammate reviews, merges
   │
/opsx:archive                      fold the delta into specs/, move the change to archive/
```

計畫和程式碼並排儲存在同一分支中，隊友可以一併審查；六個月後，歸檔的規格說明仍能解釋程式碼為何如此編寫。

## 在拉取請求中審查規格說明

團隊協作最能體現這種做法的價值。如果 PR 包含該變更的差異規格說明，審查者就能獲得單看程式碼差異無法提供的資訊：**在閱讀任何程式碼之前，先用通俗語言說明這項變更應該實作什麼。**

建議審查者按以下順序閱讀：

1. **閱讀 `proposal.md`** —— 問題和範圍是否合適？
2. **閱讀 `specs/` 下的差異** —— “完成”的定義是否正確？（也就是[審查變更](/zh-Hant/reviewing-changes/)中的兩分鐘檢查，現在直接在 PR 中進行。）
3. **然後閱讀程式碼差異** —— 它是否準確滿足了這些要求？

如果審查者不同意*方案*，可以直接針對提案提出意見，成本很低，而不必在 300 行程式碼中反覆爭論。可以把差異規格說明放在 PR 描述靠前的位置，或指向變更資料夾，讓審查者從那裡開始。

## 何時歸檔

歸檔會將某個變更的差異合併到主 `openspec/specs/` 中，並將變更資料夾移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。由於 `specs/` 是**共享的唯一真實依據**，團隊需要關注歸檔時機。以下兩種約定都可行：

- **PR 合併後再歸檔（推薦）。** 分支攜帶活動中的變更；合併到主分支後，在主分支上歸檔（通常是一個很小的後續提交，或安排一次定期清理）。這樣，共享的 `specs/` 只會隨實際釋出的工作更新。
- **在 PR 中歸檔。** 小團隊採用這種方式更簡單：同一個 PR 既加入程式碼，也同步並歸檔規格說明。代價是 `specs/` 和程式碼差異會一起出現，可能讓 PR 顯得更繁雜。

選定一種並保持一致。無論採用哪種方式，`/opsx:archive` 都會檢查任務是否完成，並提示先同步，以免未完成的內容意外合併。

## 兩個人並行處理變更

由於變更位於獨立資料夾中，彼此不會衝突：

- **不同的人處理不同變更——沒有問題。** `add-dark-mode` 和 `rate-limit-login` 位於不同分支的不同資料夾，直到兩者都歸檔時才會相遇。
- **一個變更，一個負責人。** 兩個人同時編輯同一個變更資料夾，就像同時編輯同一個檔案一樣會衝突。讓一個變更由一位作者負責，或者將其拆分為兩個變更（這也是[合理控制變更規模](/zh-Hant/writing-specs/)的另一個理由）。
- **衝突只會出現在 `specs/`。** 如果兩個變更都修改了*同一項*需求，第二個變更歸檔時會在 `openspec/specs/…/spec.md` 中衝突——像處理其他合併衝突一樣解決即可，保留符合實際情況的需求。這種情況很少見，而且是件好事：git 正在提醒你，兩個變更對系統行為的看法不一致。

## 規劃超出單個儲存庫時

以上內容都假設計畫位於程式碼儲存庫自己的 `openspec/` 資料夾中，這也是正確的預設選擇。如果規劃確實跨越多個儲存庫或團隊（例如一項功能涉及三個服務，或某個團隊擁有而其他團隊依賴的需求），可以使用 beta 版 **stores** 功能：規劃放在獨立儲存庫中，任何程式碼儲存庫都可以引用它。請從[儲存庫使用者指南](/zh-Hant/stores-beta/user-guide/)開始瞭解。

## 接下來讀什麼

- [審查變更](/zh-Hant/reviewing-changes/)——在 PR 中進行的審查流程。
- [編寫良好的規格說明](/zh-Hant/writing-specs/)——包括如何合理控制變更規模，使其適合一個分支。
- [儲存庫使用者指南](/zh-Hant/stores-beta/user-guide/)——瞭解跨儲存庫和團隊的規劃方式。
