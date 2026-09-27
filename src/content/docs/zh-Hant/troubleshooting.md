---
title: "故障排除"
---

針對具體問題的解決方法。每一項都會描述問題表現、簡要說明可能原因，並給出解決方式。如果這裡沒有列出你的問題，[常見問題](/zh-Hant/faq/)或許能幫上忙，[Discord](https://discord.gg/YctCnvvshC)也一定可以。

## 安裝與設定

### `openspec: command not found`

CLI 尚未安裝，或者 shell 找不到它。請全域安裝並檢查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果安裝成功但仍然找不到命令，很可能是全域 npm bin 目錄未加入 `PATH`。執行 `npm prefix -g` 檢視全域軟體包所在位置：在 macOS 和 Linux 上，可執行檔案位於該目錄的 `bin/` 中；在 Windows 上則直接位於該目錄中。請確保對應路徑已加入 `PATH`。（npm 9 已移除 `npm bin -g`。）

如果你使用[由 AI 助手協助安裝](/zh-Hant/installation/)，此時正是預期的交接點：提示詞會要求助手告知你如何修改 `PATH`，而不是自行編輯 shell 啟動檔案。

### “Requires Node.js 20.19.0 or higher”

OpenSpec 需要 Node 20.19.0 或更高版本。檢查版本，必要時升級：

```bash
node --version
```

如果你用 bun 安裝 OpenSpec，請注意 OpenSpec 仍然*執行*在 Node 上，因此無論如何都需要在 `PATH` 中提供 Node 20.19.0 或更高版本。參閱[安裝指南](/zh-Hant/installation/)。

### `openspec init` 沒有設定我的 AI 工具

Init 會詢問要設定哪些工具。如果你跳過了某個工具，或想新增其他工具，可以重新執行該命令，也可以使用非互動形式：

```bash
openspec init --tools claude,cursor
```

完整工具 ID 列表見[支援的工具](/zh-Hant/supported-tools/)。使用 `--tools all` 設定全部工具；使用 `--tools none` 跳過工具設定。

## 命令沒有顯示

如果 `/opsx:propose`（或你的工具使用的對應命令）沒有出現或沒有反應，請按以下列表逐項檢查。專案按最快可檢查的順序排列。

1. **你可能在錯誤的位置輸入了命令。** 斜槓命令應在 AI 助手聊天中輸入，而不是終端。如果你在 shell 中輸入了 `/opsx:propose`，這就是問題所在。參閱[命令的工作方式](/zh-Hant/how-commands-work/)。

2. **重新生成檔案。** 在專案根目錄執行：

   ```bash
   openspec update
   ```

   這會為你設定的所有工具重新寫入技能和命令檔案。

   指令檔案來自*已安裝的* CLI，因此舊版 CLI 可能會報告一切都是最新的，卻從未寫入較新的工作流程。現在 `openspec update` 會檢查這種情況並提供升級選項；如果出現提示，請接受升級。

3. **重新啟動助手。** 大多數工具會在啟動時掃描技能和命令。重新開啟一個視窗通常就能解決問題。

4. **確認檔案存在。** 對於 Claude Code，檢查 `.claude/skills/` 中是否有 `openspec-*` 資料夾。其他工具使用各自的目錄，完整列表見[支援的工具](/zh-Hant/supported-tools/)。

5. **確認已初始化當前專案。** 技能是按專案寫入的。如果你複製了儲存庫或切換了資料夾，請在對應目錄中執行 `openspec init`（或 `openspec update`）。

6. **確認你的工具支援命令檔案。** Codex、CodeArts、ForgeCode、Hermes、Kimi Code、Mistral Vibe、Zed Agent 和共享的 `.agents` 目標不會生成 `opsx-*` 命令檔案，而是透過技能呼叫，因此 `/opsx` 永遠不會在這些工具中自動補全。在 Codex 中輸入 `$openspec-propose`，在 Kimi Code 中輸入 `/skill:openspec-propose`，其他工具則輸入 `/openspec-propose`。共享的 `.agents` 目標不繫結廠商，因此 `/openspec-propose` 是通用形式，但不能保證所有助手都支援——如果助手沒有響應，請檢視它自己的技能呼叫說明。Amazon Q 會生成命令檔案，但會將其載入到提示詞庫，而不是斜槓選單；應輸入 `@opsx-propose`，而非 `/opsx`。每種工具的呼叫形式都列在[如何呼叫](/zh-Hant/supported-tools/)中。

## 使用變更

### “Change not found”

命令無法判斷你指的是哪項變更。請明確指定名稱，或檢查當前有哪些變更：

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

同時確認你位於正確的專案目錄。

### “No artifacts ready”

每項產物要麼已經建立，要麼因依賴項尚未完成而受阻。檢視阻塞原因：

```bash
openspec status --change <name>
```

然後先建立缺少的依賴項。請記住順序：提案使規格說明和設計可以開始；規格說明和設計共同使任務可以開始。

### `openspec validate` 報告警告或錯誤

驗證會檢查規格說明和變更是否存在結構問題。請閱讀提示，其中會指出檔案和問題所在。

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

常見原因包括缺少必需章節（例如規格說明沒有情境）或差異標題格式錯誤。修正檔案後重新執行。輸出格式見 [CLI 參考](/zh-Hant/cli/)。

有一條提示值得單獨說明：

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

`MODIFIED` 需求會替換整個需求塊，因此必須保留變更後仍然有效的所有情境，而不只是你修改的情境。請從 `openspec/specs/<capability-path>/spec.md` 複製指定情境回差異檔案，並保留路徑中的領域目錄。如果其他人的變更新增了同一需求的情境，這種提示常會出現在較早的變更中——無論如何，歸檔都會拒絕該變更；現在驗證階段會在你開始實作前就說明這一點。

### AI 建立的產物不完整或有誤

AI 獲得的上下文不足。以下方法可能有所幫助：

- 在 `openspec/config.yaml` 中新增專案上下文，使技術棧和約定注入每項請求。參閱[自訂](/zh-Hant/customization/)。
- 為特定產物新增 `rules:`，例如只針對規格說明的指引。
- 提案時提供更詳細的描述。
- 使用擴充套件命令 `/opsx:continue` 一次建立一個產物並逐一審查，而不是使用 `/opsx:ff` 一次性全部建立。

### 歸檔無法完成，或提示任務未完成

歸檔不會因為任務未完成而*阻止*操作，但會發出警告，因為歸檔通常意味著工作已經完成。如果任務確實可以暫緩（例如你要歸檔部分變更），可以繼續；否則應先完成任務。如果差異規格說明尚未同步到主規格說明，歸檔也會主動詢問是否同步；除非你有特殊理由，否則請同意。

### “User force closed the prompt with 0 null”

當某處在無法回答互動問題的環境中執行 `openspec archive` 時，就會出現此問題——例如由工具呼叫命令的 AI 智慧代理程式、CI 作業，或 stdin 已關閉的 shell。歸檔最多會詢問三次確認；以前無法回答的問題會以這條原始訊息失敗。

傳入 `--yes` 即可預先確認：

```bash
openspec archive <change-name> --yes
```

保留之前使用的其他標誌——`--skip-specs` 和 `--no-validate` 會改變歸檔行為，因此只使用 `--yes` 重試並不是相同命令。當前版本會指出需要新增的標誌，並列印一行可直接貼上的 `Fix:`。如果需要從列表中選擇，請明確傳入變更名稱：選擇器同樣需要回答。

如果你將歸檔輸出重定向到檔案，或由工具捕獲，並且*確實*透過管道傳入了應答（`printf 'y\n' | openspec archive …`），舊版本會在顯示提示時把終端轉義碼寫入捕獲內容；某些環境中，這些字元會讓檔案異常膨脹。當前版本在 stdout 不是終端時會以純文字讀取確認提示；如果不提供引數執行 `openspec archive`（本來會顯示互動式變更選擇器），它會要求你先提供變更名稱，而不是把選單渲染到捕獲內容中。無論哪種情況，重定向和智慧代理程式呼叫都能保持清晰；提供變更名稱並加上 `--yes` 則可完全跳過提示。

## 設定

### `config.yaml` 沒有生效

通常有三個原因：

1. **檔名錯誤。** 檔案必須是 `openspec/config.yaml`，而不是 `.yml`。
2. **YAML 無效。** 使用任意 YAML 驗證器檢查；CLI 也會報告語法錯誤及其行號。
3. **以為需要重啟。** 無需重啟。設定更改立即生效。

### “Unknown artifact ID in rules: X”

`rules:` 下的鍵與模式中的任何產物都不匹配。對於預設的 `spec-driven` 模式，有效 ID 是 `proposal`、`specs`、`design` 和 `tasks`。檢視任何模式的 ID：

```bash
openspec schemas --json
```

### “Context too large”

`context:` 欄位限制為 50KB，因為它會注入每個請求。請對內容進行概括，或連結到較長的文件，而不是直接貼上全部內容。精簡的上下文通常也能帶來更快、更好的結果。

### “Schema not found”

引用的模式名稱不存在。列出可用模式並檢查拼寫：

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

參閱[自訂](/zh-Hant/customization/)。

## 從舊版工作流程遷移

### “Legacy files detected in non-interactive mode”

你位於 CI 或非互動式 shell 中，OpenSpec 發現了需要清理的舊檔案，但無法詢問你是否批准。使用以下命令自動確認：

```bash
openspec init --force
```

對於 Codex，OpenSpec 可能會在 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 中檢測到舊的託管提示詞檔案。清理範圍僅限 OpenSpec 允許列表中的舊版 Codex 提示詞檔名；非互動式 `openspec init` 只會移除已有替代檔案 `.agents/skills/openspec-*` 的提示詞。除非傳入 `--force`，否則非互動式 `openspec update` 不會進行任何舊檔案清理。

### 遷移後沒有出現命令

重新啟動 IDE。技能會在啟動時檢測。如果仍未出現，請執行 `openspec update`，並根據[支援的工具](/zh-Hant/supported-tools/)檢查檔案位置。

### 舊的 `project.md` 沒有遷移

這是有意設計的。OpenSpec 不會自動刪除 `project.md`，因為其中可能有你編寫的重要上下文。將有用部分移到 `config.yaml` 的 `context:` 欄位中，然後自行刪除 `project.md`。有關遷移步驟（包括可以交給 AI 助手的提煉提示詞），請參閱[遷移指南](/zh-Hant/migration-guide/)。

## 仍然無法解決？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **在終端中：** 執行 `openspec feedback "what went wrong"` 為你開啟一個 issue。

報告問題時，請附上 OpenSpec 版本 (`openspec --version`)、Node 版本 (`node --version`)、所用 AI 工具，以及準確的命令和輸出。提供這些資訊可以大大加快排查速度。
