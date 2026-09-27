---
title: "審查變更"
---

OpenSpec 的核心承諾是：**在編寫任何程式碼之前，你和 AI 就要對建置內容達成一致。** 只有你確實閱讀 AI 起草的內容，這份共識才有意義。本頁介紹這兩分鐘的審查過程——該開啟什麼、按什麼順序閱讀，以及要檢查什麼。

道理很簡單：在一段提案中發現方向錯誤，幾乎不費成本；在 300 行程式碼中發現同樣的錯誤，就沒那麼容易了。審查就是讓這份投入得到回報的環節。

## 需要審查的兩個時機

一共只有兩個：

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **`/opsx:propose`（或 `/opsx:ff`）之後，`/opsx:apply` 之前**——計畫還只是文字時先閱讀。
2. **建置之後，使用 `/opsx:verify`**——檢查程式碼是否確實實作了計畫中的內容。

第一次審查最能幫你避免損失，也是人們最容易跳過的一步。本頁大部分內容都會介紹它。

## 按這個順序閱讀

一個變更就是 `openspec/changes/<name>/` 下的一組純 Markdown 檔案。按以下順序閱讀，可以在發現問題時儘早停止：

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

你無需逐字閱讀所有內容。需要做的是每個檔案回答一個問題，一共三個問題。

## 提案：問題選對了嗎？

先開啟 `proposal.md`。它用一兩段話記錄“為什麼”與“做什麼”——即意圖、範圍和方案。

**理想情況：** 意圖清楚、範圍符合預期，並且能說明為什麼現在值得做。

**警示訊號：**

- 它解決的其實是與你提出的*略有不同*的問題。
- 範圍擴大了——你只要求主題切換開關，提案卻“順便”修改身份驗證。
- 內容含糊。“改進設定頁面”不是明確的範圍；“新增一個遵循作業系統偏好的深色模式切換開關”才是。

**需要回答的問題：** *這是否符合我實際提出的要求？有沒有混進其他內容？* 如果答案是否，就停在這裡——先修正提案（參見[提出異議成本很低](/zh-Hant/editing-changes/)）。

## 規格差異：“完成”的定義正確嗎？

這是審查的核心。`specs/` 下的差異規格說明以需求及證明需求的情境，描述變更交付後哪些內容會成為*事實*：

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**優質需求應當是：** 一條清楚的 `SHALL`/`MUST` 陳述，可以交給測試人員驗證；並且至少包含一個透過 GIVEN/WHEN/THEN 確實檢驗該陳述的情境。

**警示訊號：**

- **需求含糊。** “系統 SHALL 執行得很快”無法實作，也無法測試。怎樣才算快？
- **需求沒有情境**，或者情境沒有測試所屬需求。
- **最有價值的檢查：缺了什麼。** AI 會如實寫下你*說過的內容*，而你的任務是留意你*忘記說的內容*。如果你最關心作業系統偏好的情形，卻沒有任何情境提到它，那麼審查就發揮了應有作用。

閱讀差異時，問問自己：*如果系統只做這些事，而且沒有其他行為，我會滿意嗎？* 此時還沒有涉及程式碼，因此修改成本仍然很低。

## 任務：工作計畫合理嗎？

最後開啟 `tasks.md`。它是 AI 將要執行的實作清單。

**理想情況：** 步驟有序，每項都能對應到某條需求，沒有難以理解的內容。

**警示訊號：**

- 某項任務沒有對應需求（它從何而來？）。
- 只有一項籠統的“實作功能”任務，把所有實際決策都藏了起來。
- 某項任務會影響你剛剛批准的範圍之外的內容。

你不是在這裡估算工作量或事無鉅細地管理，而是在檢查計畫是否符合你已經接受的需求。

## 提出異議成本很低

如果以上三個問題中任何一個的答案不理想，就說出來。這裡沒有階段，也沒有被鎖定的內容——修正後繼續即可。與[編輯變更](/zh-Hant/editing-changes/)中所述相同，你有兩種方式：

- **自己編輯檔案。** 檔案是純 Markdown；修改範圍描述、明確需求或刪除任務即可。
- **告訴 AI 哪裡不對，讓它修改：** *“刪掉身份驗證修改——不在範圍內”*、*“新增一個使用者已經選過主題時的情境”*、*“把任務 3 拆成模式和介面兩項。”*

然後重新閱讀改過的部分。反覆修改，直到計畫值得你署名為止。這樣的來回修改*就是產品正常工作的方式*。

## 程式碼完成後：驗證

工作完成後，`/opsx:verify` 是第二次審查。它會重新閱讀產物和程式碼，並從三個方面報告不匹配：

| 維度 | 檢查內容 |
|-----------|----------------|
| **完整性** | 所有任務是否完成、所有需求是否實作、情境是否覆蓋 |
| **正確性** | 實作是否符合規格說明的意圖、是否處理邊界情況 |
| **一致性** | 設計決策是否真正體現在程式碼中 |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

它會將問題標記為 CRITICAL、WARNING 或 SUGGESTION，但**不會**阻止歸檔——它只會指出差距，是否處理由你決定。這就是“AI 是否寫了程式碼”與“AI 是否實作了雙方約定的內容”之間的區別。

`/opsx:verify` 屬於擴充套件設定檔案。如果你沒有此命令，可以用 `openspec config profile` 啟用（然後執行 `openspec update`），也可以自行重新閱讀變更和程式碼差異。

## 讓審查與變更規模相稱

並非每項變更都值得完整審查。單檔案中的拼寫錯誤，快速瀏覽二十秒即可；涉及身份驗證、支付或不可恢復資料的變更，則值得逐項檢查以上所有問題。重點從來不是走形式，而是把注意力花在犯錯代價高的地方，對無關緊要的內容快速略過。

## 兩分鐘檢查清單

- [ ] 提案中的意圖符合我的要求。
- [ ] 範圍沒有悄悄擴大。
- [ ] 每條需求都足夠具體，可以測試。
- [ ] 每條需求都有真正檢驗它的情境。
- [ ] 我最關心的情形已被覆蓋。
- [ ] 任務都能對應到需求，沒有莫名其妙或超出範圍的內容。
- [ ] 如果 AI 完全按此計畫實作、沒有更多內容，我會放心。

七項全部透過，就可以放心執行 `/opsx:apply`。如果有任何一項未透過，那不是挫折——這正是這兩分鐘審查發揮作用的證明。

## 接下來讀什麼

- [編寫良好的規格說明](/zh-Hant/writing-specs/)——從另一面瞭解如何起草值得批准的需求和情境。
- [編輯和迭代變更](/zh-Hant/editing-changes/)——開始實作後如何修改計畫。
- [工作流程](/zh-Hant/workflows/)——審查在整個流程中的位置。
