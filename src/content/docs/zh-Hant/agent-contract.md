---
title: "OpenSpec 智慧代理程式契約"
---

`openspec` CLI 的機器可讀介面，已根據 `src/` 驗證（capstone 審計，2026-06-11）。以下每種資料結構均依據實際輸出程式碼記錄。

## 1. 通用約定

- **每次呼叫輸出一個 JSON 文件。** 在 `--json` 模式中，stdout 只包含一個 JSON 文件（縮排 2 格）。面向人的說明、載入動畫和儲存庫橫幅都會輸出到 stderr。
- **儲存庫橫幅。** 在人類可讀模式中，選擇了儲存庫根目錄時會向 stderr 輸出 `Using OpenSpec root: <id> (<path>)`。JSON 模式下不會輸出。
- **鍵名大小寫取決於介面**（參見“已知的不一致”）：store/doctor/context 的載荷使用 `snake_case`；工作流程載荷（`status`、`instructions`、`new change`、`validate`、`list`）使用 `camelCase`，但嵌入的 `root` 物件始終使用 `store_id`。
- **多數情況下會省略可選鍵，而不是設為 null**（例如 `root.store_id`、`member.path`）。對於使用顯式 `null` 的例外情況（store doctor 的 `git.*`、失敗載荷），會在相應結構中註明。

## 2. 診斷信封

所有機器可讀診斷 (`StoreDiagnostic`) 共用以下信封結構：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

診斷資訊會出現在兩個位置：用於報告健康檢查結果的**狀態陣列**（頂層或每個條目中的 `status: StoreDiagnostic[]`），以及命令失敗時轉換為單元素 `status` 陣列的**丟擲錯誤**。

## 3. 根目錄選擇與 `RootOutput`

所有需要解析根目錄的命令（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`instructions archive`、`new change`、`archive`、`doctor`、`context`、`schemas`）都按同一優先順序解析一個 OpenSpec 根目錄：

1. `--store <id>` → 註冊儲存庫的根目錄（`source: "store"`）。
2. 否則，查詢最近的祖先目錄中的 `openspec/`：若為規劃目錄結構，則使用 `source: "nearest"`（若有 `store:` 指標則忽略，並向 stderr 輸出警告）；若只有設定檔案且 `store:` 指標有效，則使用該儲存庫（`source: "declared"`）。
3. 沒有最近根目錄，但已設定全域 `defaultStore`（`openspec config set defaultStore <id>`）→ 使用該儲存庫（`source: "global_default"`）；若 ID 已失效，則返回底層儲存庫錯誤，並在 `fix` 中指出應執行 `openspec config unset defaultStore`。
4. 沒有最近根目錄、沒有預設值，但存在已註冊儲存庫 → 返回錯誤 `no_root_with_registered_stores`。
5. 沒有根目錄、預設值或儲存庫時：命令可能會將當前工作目錄視為 `source: "implicit"`；但 `doctor`、`context`、`list` 和批次 `validate` 會返回 `no_openspec_root`。對於包含 `openspec/project.md` 的舊專案，`list` 仍保留隱式根目錄回退行為。

成功的 JSON 載荷通常會嵌入根目錄；成功的 `schemas --json` 則有意保持為相容用的裸陣列，見 §4.13：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**根目錄解析失敗約定：** JSON 模式下，解析失敗會在 stdout 輸出 `{ ...commandNullShape, "status": [diagnostic] }` 並以 1 退出。

## 4. 命令 JSON 結構

### 4.1 `list --json`

`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` ——注意此處每項變更的 `status` 是字串列舉。`--specs`：`{ "specs": [ { "id", "requirementCount" } ], "root" }`。

`warnings` 在非空時才出現，用於報告 `changes/` 下並非變更的目錄。目前唯一的程式碼是 `nested_change_directory`：名稱空間資料夾包含了變更目錄；OpenSpec 無法定位這類變更，因為變更必須是 `changes/` 下的直接子目錄。列出的變更條目也會包含 `nested`，此時它的 `status` 沒有意義。不要把這類條目當作變更；只報告提示資訊，不要改動這些目錄。

### 4.2 `show <item> --json`

變更：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。規格說明：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`

`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。任何條目驗證失敗時以 1 退出。

### 4.4 `status --json`

`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`。`isPlanningComplete` 表示所有未跳過的規劃產物均已存在；跳過的產物視為滿足要求，無需建立。它不表示實作任務已經完成。為保持相容，`isComplete` 仍保留，且含義相同。每個產物的 `requires` 是其直接依賴 ID（所有狀態均存在，因此即使產物為 `done`，也能計算傳遞依賴集合）；只有狀態為 `blocked` 時才會出現 `missingDeps`。

`artifacts` 陣列按依賴順序排列。如果多個產物同時就緒，則依照模式中 `artifacts:` 的宣告順序排列（絕非按字母排序）。因此，第一個 `ready` 條目就是接下來應編寫的產物；`missingDeps` 也按相同順序排列。若某項產物的 `generates` 路徑位於 `specs/` 下，且變更的 `.openspec.yaml` 聲明瞭 `skip_specs: true`，其狀態會標記為 `"skipped"`；它滿足依賴關係，但不得建立。沒有活動變更時返回 `{ "changes": [], "message", "root" }`，退出碼為 0。

`--all`（批次模式，不能與 `--change` 同時使用；若同時指定，會返回 `{ "changes": [], "root": null, "status": [d] }` 形式的空值載荷）：`{ "changes": [ <per-change status object, no per-change root>, ... ], "root" }`，按變更名稱排序。載入失敗的變更會在對應位置返回 `{ "changeName", "status": [d] }`；遍歷會繼續，保留完整信封，並在文字和 JSON 模式下都以 1 退出。即使不存在任何變更，無效的 `--schema` 也會導致整個呼叫失敗並返回空值載荷。

### 4.5 `instructions <artifact> --json`

`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`。`unlocks` 會按模式的宣告順序列出此產物會解鎖的產物（與 `status` 建議的順序相同）。如果變更聲明瞭 `skip_specs: true`，而當前產物被跳過，則會出現 `"skipped": true`（以及 `"warning"`）；不要建立該產物的檔案。依賴條目若包含 `skipped: true`，表示無需檔案便已滿足依賴；不要嘗試讀取其路徑。

`ReferenceIndexEntry`：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` ——已解析條目包含 root/specs/fetch；未解析條目包含 store_id 和 warning 狀態。索引上限為 50KB（`reference_index_truncated`）。

### 4.6 `instructions apply --json`

`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`。`missingArtifacts` 列出 apply 會因之受阻的內容（模式的 `apply.requires`）；`missingPrerequisites` 則按建置順序列出執行 apply 前仍需建立的全部內容，即這些依賴的傳遞閉包，因此可能更長。`warnings` 列出與變更本身相關、但不會阻止流程的問題；目前包括變更已可實作、但沒有差異規格說明且未設定 `skip_specs: true` 的情況，這種狀態會被 `openspec validate` 拒絕。

每次呼叫都會從所選根目錄讀取可選欄位 `context` 和 `operationGuidance`。`context` 是提示詞層面的必需輸入，必須應用其中相關的專案事實、約定和限制；`operationGuidance` 是建議性輸入，只在適用且與內建工作流程相容時遵循。兩者都與狀態、任務、進度、上下文檔案及內建指令分開。

### 4.7 `instructions archive --json`

`{ "changeName", "context"?, "operationGuidance"?, "root" }`。要求解析後的儲存庫根目錄中存在有效的 `--change`，並採用與 apply 相同的必需上下文/建議性指引語義。這是隻讀的執行時輸入介面：不會返回靜態歸檔工作流程，不會檢查或合併差異規格說明，不會寫入主規格說明，也不會移動變更。

### 4.8 `new change <name> --json`

成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失敗：`{ "change": null, "status": [d] }`，退出碼為 1。

### 4.9 `archive <name> --json`

成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`。失敗：`{ "archive": null, "root"?, "status": [d] }`，退出碼為 1。只有至少寫入或廢棄了一份規格檔案時，`specsUpdated` 才為 true。（如果變更刪除了某項能力的最後一條需求，該能力的規格檔案會被刪除；這要求變更的 `.openspec.yaml` 中設定 `retire_capabilities: true`。每次廢棄都會列入 `warnings`；只有規格檔案位於呼叫者當前檢出目錄時，才會附上可貼上執行的 Git 恢復命令。）已經同步過的變更仍會歸檔，但 totals 全為零，並在 `warnings` 中列出跳過的內容。JSON 模式嚴格禁止互動：每個原本的提示點都會轉換成 `archive_*` 程式碼。

### 4.10 `doctor --json`

`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`。僅當儲存庫是基於 Git 的檢出且設定了上游追蹤引用時，才會出現 `drift`；其中 ahead/behind 數量是相對於上次獲取的上游，而非即時遠端。任何嚴重級別的健康問題都以 0 退出。失敗載荷為 `{ "root": null, "store": null, "references": [], "status": [d] }`，退出碼為 1。

### 4.11 `context --json`

`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE 表示路徑存在且狀態為空。`--code-workspace <path>` 會寫入 `{folders:[{name,path}]}`（僅包含可用的被引用儲存庫，並帶 `ref:` 字首）；JSON 模式會先寫檔案，再輸出結果，以確保即使寫入失敗，stdout 仍只包含一個文件。失敗載荷為 `{ "root": null, "members": [], "status": [d] }`，退出碼為 1。

### 4.12 `store ... --json`

setup/register：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list：`{ "stores": [{id, root}], "status": [] }`。doctor：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` 表示未知/未檢查）。健康問題以 0 退出；失敗時使用相應空值載荷並以 1 退出。取消提示時以 130 退出。

### 4.13 `schemas --json` / `templates --json`

`schemas`：成功時仍返回裸陣列 `[ {name, description, artifacts, source} ]；按标准根目录选择顺序解析，并接受 `--store <id>`。根目录解析失败时返回 `{ "schemas": [], "root": null, "status": [d] }`，退出码为 1。`templates`：返回以键组织的对象 `{ "<artifactId>": {path, source} }`，仍依据当前工作目录运行，不包含 root/status 字段。

## 5. 退出码约定

| 情形 | 退出码 | Stdout |
|---|---|---|
| 成功，包括健康检查发现问题（doctor/context/store doctor） | 0 | 载荷 |
| `--json` 模式下命令失败 | 1 | 一个含 `status: [d]` 和命令空值载荷的 JSON 文档 |
| `validate` 中有失败条目 | 1 | 完整报告 |
| 取消提示（store 命令组，人类可读模式） | 130 | 仅 stderr |

## 6. 诊断代码目录

### 解析

`no_openspec_root`、`no_root_with_registered_stores`、`no_registered_stores`、`unknown_store`、`store_identity_mismatch`、`unhealthy_store_root`、`store_path_not_supported`、`invalid_store_pointer`、`initiative_option_removed`、`areas_option_removed`；透传代码：`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`。

### OpenSpec 根目录健康状态（错误，无修复指引）

`openspec_store_root_missing`、`openspec_store_root_not_directory`、`openspec_root_missing`、`openspec_root_not_directory`、`openspec_config_missing`、`openspec_config_not_file`、`openspec_specs_not_directory`、`openspec_changes_not_directory`、`openspec_archive_not_directory`。在 stores beta 期间，健康根目录中可以缺少 `openspec/specs/`、`openspec/changes/` 和 `openspec/changes/archive/`；仅当这些路径存在但不是目录时，才报告健康错误。

### 存储库注册表、身份和状态

`invalid_store_id`、`invalid_store_registry`、`invalid_store_metadata`、`store_registry_busy`、`store_not_found`、`no_store_registry`、`store_registry_changed`、`store_metadata_missing`、`store_metadata_id_mismatch`、`store_metadata_invalid`、`store_id_conflict`、`store_path_conflict`、`store_already_registered`（info）。

### 存储库设置、注册和移除

`store_setup_id_required`、`store_setup_path_required`、`store_setup_path_not_directory`、`store_setup_inside_git_repo`、`store_setup_non_empty_directory`、`store_setup_cancelled`、`store_path_required`、`store_path_missing`、`store_path_not_directory`、`store_root_pointer_declared`、`store_register_root_unhealthy`、`store_register_identity_confirmation_required`、`store_register_cancelled`、`store_remote_empty`、`store_remote_requires_hand_edit`、`store_remove_confirmation_required`、`store_remove_cancelled`、`store_remove_path_not_directory`、`store_remove_metadata_missing`、`store_remove_contains_registered_store`、`store_root_missing`（remove 时为 warning，store doctor 时为 error）、`store_root_not_directory`。

### 存储库 Git

`store_git_init_failed`、`store_git_identity_missing`、`store_git_commit_failed`、`store_git_no_commits`（warning）、`store_clone_fragile_directories`（warning）、`store_remote_divergence`（info，doctor）、`store_checkout_drift`（info，doctor）。

### 引用（warning）

`reference_invalid_id`、`reference_registry_unreadable`、`reference_unresolved`、`reference_root_unhealthy`、`reference_index_truncated`。

### 关系（warning；doctor 会报告，context 仅保留注册表相关项）

`relationship_registry_unreadable`、`root_pointer_ignored`、`root_pointer_invalid`、`pointer_declarations_inert`。

### 归档（JSON 模式）

`archive_change_name_required`、`archive_change_not_found`、`archive_change_symlink`、`archive_validation_failed`、`archive_confirmation_required`、`archive_tasks_incomplete`、`archive_spec_update_failed`、`archive_spec_validation_failed`、`archive_target_exists`、`archive_error`。

### 上下文写入

`context_file_exists`、`context_output_dir_missing`。

### 回退错误

`doctor_failed`、`context_failed`、`store_error`、`change_error`、`archive_error`。

## 已知的不一致

capstone 审计记录了以下问题；发布键名重命名属于产品决策，推迟到此版本之后：

1. ~~在 `--json` 模式下，若干失败路径只输出 stderr，不提供 JSON 文档。~~ 已在 capstone gauntlet 阶段修复：`show`/`validate` 遇到未知或有歧义的条目时会输出 `{status:[{code: unknown_item | ambiguous_item, ...}]}`；`status`/`instructions`/`list`/`show`/`validate` 中抛出的错误会经由支持 JSON 的失败处理函数（命令空值载荷 + `status`）；`store <unknown subcommand> --json` 会输出 `{status:[{code: unknown_store_subcommand}]}`；`list` 在根目录解析失败时会带上 `{changes|specs: [], root: null}` 空值载荷。
2. `store_root_missing` 会带有两种严重级别（remove 时为 warning，store doctor 时为 error），具体取决于上下文，详见上文。
3. 键名大小写：store 系列使用 snake_case，workflow 系列使用 camelCase；`root.store_id` 在任何位置都使用 snake_case。
4. `src` 中存在四组并行的信封类型声明；archive 诊断从不携带 `target`。
5. `list --json` 会将每项变更的 `status` 字段用作字符串枚举。
6. 只有 `validate` 输出包含 `version` 字段。
7. `templates` 忽略根目录选择（基于当前工作目录，不支持 `--store`）。
8. 已弃用的名词形式（`change`/`spec` 子命令）会输出未封装的载荷，不包含 `root`/`status`。
