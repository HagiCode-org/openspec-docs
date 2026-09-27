---
title: "儲存庫：將規劃放入獨立儲存庫"
---

> **Beta。** 儲存庫、引用、工作上下文和工作集均為新功能。命令名稱、標誌、檔案格式和 JSON 輸出在不同版本間仍可能變化。下方所有操作演示都已在當前建置版本中執行，但升級後請重新閱讀本指南。

## 此功能解決的問題

通常，OpenSpec 位於單個程式碼儲存庫中：程式碼旁邊有一個 `openspec/` 資料夾，用於存放該儲存庫的規格說明和變更。

當規劃工作超出單個儲存庫時，這種組織方式就不再合適：

- 工作涉及多個儲存庫——一項功能同時修改 API 伺服器、Web 應用和共享庫。計畫應該放在哪個儲存庫的 `openspec/` 資料夾中？
- 團隊在程式碼存在之前就開始規劃，或規劃不會成為*當前*儲存庫程式碼的工作。
- 一個團隊負責需求，其他團隊使用這些需求。Wiki 上的版本逐漸過時，而編碼智慧代理程式甚至無法讀取它。

**儲存庫** (store) 就是解決辦法：一個專門用於規劃的獨立儲存庫。它擁有你熟悉的 `openspec/` 結構——規格說明和變更——以及一個小型身份檔案。你只需在本機按名稱註冊一次，之後就能在任何位置使用所有常規 OpenSpec 命令操作它。

## 結構

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

兩條規則讓一切保持簡單：

1. **儲存庫只是普通的 git 儲存庫。** 由你自己提交、推送、拉取和審查。OpenSpec 不會自行複製、同步或推送任何內容。
2. **宣告，而非機制。** 儲存庫可以*宣告*自己與儲存庫之間的關係（下文將介紹）。宣告會改變 OpenSpec 能向你提供的資訊，但絕不會改變命令的操作位置。

## 五分鐘建立第一個儲存庫

只需兩個命令，就能從零開始建立儲存庫並生成一項限定到該儲存庫的變更：

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

整體模型就是如此。從這裡開始，生命週期與你熟悉的完全相同——`status`、`instructions`、`validate`、`archive`——只需在每條命令中新增 `--store team-plans`，所有輸出提示也都會帶上此標誌。`Using OpenSpec root:` 行會始終指出命令當前操作的位置。

## 情境：一個團隊，一個規劃儲存庫

團隊將規格說明和變更集中儲存在 `team-plans` 中，而非分散到各個程式碼儲存庫。

**第一天（由負責設定的人執行）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

傳入 `--remote` 會將複製 URL 記錄到儲存庫自身的身份檔案 (`.openspec-store/store.yaml`) 中，並包含在初始提交裡。以後複製儲存庫時，它就會帶有來源資訊，因此健康檢查和錯誤訊息可以為還沒有該儲存庫的隊友提供一條完整且可直接貼上執行的修復命令。

**每位隊友（每臺機器執行一次）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

此後，所有人都可以透過名稱在同一個規劃儲存庫中工作：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**有意使用 git 來共享工作。** 你建立的變更在提交併推送之前只存在於自己的檢出目錄中——這與程式碼相同。由於儲存庫是普通儲存庫，規劃工作也能自然使用分支、拉取請求和程式碼審查。

**連線團隊的程式碼儲存庫。** 如果某個程式碼儲存庫完全將規劃工作外接，只需在 `openspec/config.yaml` 中加入一行：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

此後，在 `web-app` 中執行的每條 OpenSpec 命令都會直接操作 `team-plans`，無需任何標誌：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

此指標只是回退機制，不會強制覆蓋其他選擇：顯式傳入 `--store` 始終優先；如果儲存庫後來出現自己的真實規劃目錄，則本地目錄會優先（併發出警告，建議移除過期指標）。

**在本機為所有儲存庫設定一個預設值。** 如果你有很多程式碼儲存庫都使用同一個儲存庫進行規劃，可以在全域設定一次，而不必在每個儲存庫中都新增 `store:`：

```bash
openspec config set defaultStore team-plans
```

此後，在規劃根目錄之外執行的命令，只要沒有 `--store` 標誌和專案指標，就會解析到 `team-plans`。它位於優先順序列表的最後，因此 `--store`、本地根目錄和專案級 `store:` 指標仍然優先。根目錄橫幅和 JSON `root` 塊會將 `source: "global_default"` 與儲存庫 ID 一起報告，因此你能分辨機器範圍的預設值和儲存庫自身指標。執行 `openspec config unset defaultStore` 可清除此設定。如果該 ID 未註冊，命令會報錯並提示你註冊該儲存庫或清除過期的預設值。

## 範例：一個功能，兩個元件儲存庫

假設 `add-checkout-promo` 同時修改 `checkout-api` 和 `checkout-web`。團隊希望共用一份產品行為約定，但每個程式碼儲存庫仍需擁有自己的實作任務、分支和審查。

分為兩層來管理：

1. 將共享行為放在 `team-plans` 中。
2. 將實作計畫放在各元件儲存庫中，並以只讀上游上下文的方式引用該儲存庫。

首先，在儲存庫中規劃共享約定：

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

提案和規格說明應描述元件交界處的行為——例如，服務返回哪些促銷欄位，以及前端如何處理不符合促銷條件的結賬請求。像審查其他分支和拉取請求一樣，在儲存庫中審查此變更。

### 規劃時能看到哪些上下文？

選擇儲存庫會改變 OpenSpec 根目錄，但不會自動發現或讀取所有使用該儲存庫的程式碼儲存庫。儲存庫中的指令會讀取儲存庫內的產物和已設定上下文。只有當智慧代理程式或編輯器能存取相應元件目錄，且智慧代理程式實際讀取了它們，才會看到元件程式碼。

使用工作集可以方便地同時開啟規劃儲存庫和兩個程式碼儲存庫：

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

這會將這些資料夾顯示在同一個 IDE 工作區中。它不會將原始碼上下文複製到儲存庫，不會選擇受影響的儲存庫，也不會授予智慧代理程式編輯這些儲存庫的權限。持久的跨元件事實應寫入共享規格說明；不要依賴規劃者記住自己偶然檢查過的原始碼內容。

### 如何在每個儲存庫中開始實作？

當沒有顯式的 `--store` 或更近的 `openspec/` 根目錄時，`store: team-plans` 指標會將命令路由到該儲存庫。它不會根據呼叫 `apply` 時所在的目錄，把一個儲存庫的任務列表拆分到不同儲存庫中。OpenSpec 目前不會將任務路由到不同程式碼儲存庫。

如果每個元件都需要單獨確定範圍的實作/審查迴圈，則應為每個元件建立本地 OpenSpec 根目錄，並將中央儲存庫作為引用，而不是直接指向它：

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

共享約定在儲存庫的主規格說明中批准並可用後，為每個元件建立一項小型本地變更：

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

各儲存庫指令中的引用索引會提供儲存庫規格說明的摘要，以及準確的 `openspec show ... --store team-plans` 獲取命令。每個本地提案都引用該共享約定，其任務只描述對應元件的工作。隨後分別在每個儲存庫中執行 `/opsx:apply`；根目錄解析機制會確保產物和實作修改限定在各自儲存庫中。伺服器端和前端變更可以分別測試、審查、合併和歸檔。

如果必須在儲存庫中的共享變更仍處於活動狀態時就開始實作，請使用 `openspec show add-checkout-promo --store team-plans` 顯式獲取該變更；引用索引列出的是規範儲存庫中的主規格說明，不包括活動變更。請在儲存庫分支和元件分支的拉取請求描述中互相引用，讓審查者知道每個實作依據的是哪個版本的約定。

## 情境：跨越團隊邊界的需求

平臺團隊負責需求。產品團隊在自己的儲存庫中根據這些需求實作功能，並採用各自的設計。引用會描述這種關係，但不會轉移任何團隊的工作。

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**產品團隊在自己的儲存庫中宣告所依賴的內容**，在 `openspec/config.yaml` 中寫入：

```yaml
references:
  - platform-reqs
```

引用是隻讀上下文。儲存庫仍然保留自己的 `openspec/` 根目錄，工作也仍在其中進行。變化在於：該儲存庫中的 `openspec instructions` 會增加一個被引用儲存庫規格說明的索引——每條規格都有一行摘要和準確的獲取命令（`openspec show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 中工作的智慧代理程式可以找到上游支付需求並引用它們，然後在儲存庫自己的根目錄中編寫低層設計，不需要任何人手動貼上上下文。

引用也可以包含複製來源，這樣尚未擁有該儲存庫的隊友就能獲得完整的修復建議，而非無處可去的報錯：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**如果你希望同時開啟計畫和程式碼，可以建立工作集。** 工作集由個人顯式建立：每個人在自己的機器上選擇實際要一起工作的資料夾。共享規劃儲存庫不會提交任何本地檢出路徑。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 隨時可以提出的兩個問題

**“我的設定是否正常？”**——`openspec doctor` 會以只讀方式檢查當前根目錄及其引用的儲存庫，併為每項發現提供可直接貼上的修復命令：

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**“我正在使用哪些內容？”**——`openspec context` 會依據 OpenSpec 宣告彙總工作集：當前根目錄和它引用的儲存庫。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

這兩個命令都支援 `--json`，方便智慧代理程式呼叫。`openspec context --code-workspace <path>` 還會寫入一個包含整個工作集的 VS Code 工作區檔案——這是此命令唯一執行的寫操作。

## 工作集：重新開啟一起工作的資料夾

與以上功能不同，大多數人每次會話都會同時開啟相同的幾個資料夾——規劃儲存庫以及兩三個程式碼儲存庫。**工作集**是一個可重複開啟的個人檢視，準確記錄這些資料夾；透過一條命令即可在所選工具中重新開啟。

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

之後執行 `openspec workset open platform` 會啟動已儲存的工具：編輯器（VS Code、Cursor）會開啟一個包含所有成員的視窗，命令隨後返回。第一個成員是主成員。任何時候都可以用 `--tool <id>` 覆蓋工具設定。

工作集特意不作為共享狀態。它們儲存在你的機器上，不會提交，也不會對工作內容作出任何宣告——只記錄你喜歡同時開啟哪些資料夾。刪除工作集不會影響成員資料夾。新增工具屬於設定而非程式碼：可以在全域設定的 `openers` 鍵下新增透過工作區檔案或逐目錄附加標誌啟動的工具（執行 `openspec config edit` 開啟設定）。

## 命令如何決定操作位置

所有常規命令都會按相同順序解析根目錄：

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

`Using OpenSpec root:` 行（以及 `--json` 輸出中的 `root` 塊）會告訴你當前使用的是哪種情形。

## 已知限制

- **Beta 功能仍在變化。** 本頁介紹的所有內容都可能隨版本變化，包括名稱、標誌、檔案格式和 JSON 鍵。
- **每臺機器上的每個儲存庫 ID 只能對應一個檢出目錄。** 若在同一 ID 下注冊第二個檢出目錄會失敗，並提示先執行 `store unregister`。
- **絕不自動同步，這是有意設計。** OpenSpec 從不複製、拉取或推送。檢出目錄過期時，其規格說明會保持過期，直到*你自己*拉取；引用始終從磁碟上的當前內容即時建立索引。
- **規劃目錄可能暫時不存在。** 新儲存庫在 Git 中可能還沒有 `openspec/changes/`、`openspec/specs/` 或 `openspec/changes/archive/`。Beta 階段允許這種情況；常規命令建立相應檔案後，目錄就會出現。
- **指標儲存庫仍然只是指標。** 只有設定檔案，且 `openspec/config.yaml` 聲明瞭 `store: <id>` 的儲存庫，會被視為外接規劃，而不是需要註冊的儲存庫檢出目錄。如果你明確希望把它轉換為本地儲存庫根目錄，請先刪除 `store:` 行。
- **部分命令仍固定在當前目錄中執行。** `templates` 和已棄用的名詞形式（`openspec change show` 等）只作用於當前目錄，不支援 `--store`。`schemas` 遵循標準根目錄選擇優先順序並接受 `--store <id>`，同時保持成功時 JSON 陣列的原有結構。
- **每臺機器的狀態彼此獨立。** 儲存庫登錄檔和工作集都是本地設定。機器的目錄佈局不會提交到共享規劃儲存庫。
- **工作集支援兩種啟動方式。** 無法透過工作區檔案或逐目錄附加標誌啟動的工具，不能作為 opener 新增。
- **智慧代理程式 JSON 中存在已知的鍵名大小寫差異**（store 系列使用 snake_case，workflow 系列使用 camelCase）。詳見[智慧代理程式契約](/zh-Hant/agent-contract/)；統一鍵名的工作會推遲到後續帶版本的釋出中。

## 檔案分別存放在哪裡

| 內容 | 位置 | 是否共享？ |
|---|---|---|
| 儲存庫規劃內容 | `<store>/openspec/`（規格說明、變更） | 是——提交併推送 |
| 儲存庫身份資訊 | `<store>/.openspec-store/store.yaml` | 是——隨儲存庫一起提交 |
| 儲存庫登錄檔 | `<data dir>/openspec/stores/registry.yaml` | 否——僅儲存在本機 |
| 工作集 | `<data dir>/openspec/worksets/` | 否——僅儲存在本機 |

在 macOS 和 Linux 上，`<data dir>` 是 `~/.local/share/openspec`（若設定了 `$XDG_DATA_HOME`，則使用 `$XDG_DATA_HOME/openspec`）；在 Windows 上則是 `%LOCALAPPDATA%\openspec`。

## 參考資料

本頁介紹的各命令的準確標誌和 JSON 結構見：[CLI 參考](/zh-Hant/cli/)（Stores、Doctor、Working context、Personal worksets）以及[智慧代理程式契約](/zh-Hant/agent-contract/)。
