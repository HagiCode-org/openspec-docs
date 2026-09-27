---
title: "OpenSpec 智能体契约"
---

`openspec` CLI 的机器可读接口，已根据 `src/` 验证（capstone 审计，2026-06-11）。以下每种数据结构均依据实际输出代码记录。

## 1. 通用约定

- **每次调用输出一个 JSON 文档。** 在 `--json` 模式中，stdout 只包含一个 JSON 文档（缩进 2 格）。面向人的说明、加载动画和存储库横幅都会输出到 stderr。
- **存储库横幅。** 在人类可读模式中，选择了存储库根目录时会向 stderr 输出 `Using OpenSpec root: <id> (<path>)`。JSON 模式下不会输出。
- **键名大小写取决于接口**（参见“已知的不一致”）：store/doctor/context 的载荷使用 `snake_case`；工作流载荷（`status`、`instructions`、`new change`、`validate`、`list`）使用 `camelCase`，但嵌入的 `root` 对象始终使用 `store_id`。
- **多数情况下会省略可选键，而不是设为 null**（例如 `root.store_id`、`member.path`）。对于使用显式 `null` 的例外情况（store doctor 的 `git.*`、失败载荷），会在相应结构中注明。

## 2. 诊断信封

所有机器可读诊断 (`StoreDiagnostic`) 共用以下信封结构：

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

诊断信息会出现在两个位置：用于报告健康检查结果的**状态数组**（顶层或每个条目中的 `status: StoreDiagnostic[]`），以及命令失败时转换为单元素 `status` 数组的**抛出错误**。

## 3. 根目录选择与 `RootOutput`

所有需要解析根目录的命令（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`instructions archive`、`new change`、`archive`、`doctor`、`context`、`schemas`）都按同一优先顺序解析一个 OpenSpec 根目录：

1. `--store <id>` → 注册存储库的根目录（`source: "store"`）。
2. 否则，查找最近的祖先目录中的 `openspec/`：若为规划目录结构，则使用 `source: "nearest"`（若有 `store:` 指针则忽略，并向 stderr 输出警告）；若只有配置文件且 `store:` 指针有效，则使用该存储库（`source: "declared"`）。
3. 没有最近根目录，但已设置全局 `defaultStore`（`openspec config set defaultStore <id>`）→ 使用该存储库（`source: "global_default"`）；若 ID 已失效，则返回底层存储库错误，并在 `fix` 中指出应运行 `openspec config unset defaultStore`。
4. 没有最近根目录、没有默认值，但存在已注册存储库 → 返回错误 `no_root_with_registered_stores`。
5. 没有根目录、默认值或存储库时：命令可能会将当前工作目录视为 `source: "implicit"`；但 `doctor`、`context`、`list` 和批量 `validate` 会返回 `no_openspec_root`。对于包含 `openspec/project.md` 的旧项目，`list` 仍保留隐式根目录回退行为。

成功的 JSON 载荷通常会嵌入根目录；成功的 `schemas --json` 则有意保持为兼容用的裸数组，见 §4.13：

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**根目录解析失败约定：** JSON 模式下，解析失败会在 stdout 输出 `{ ...commandNullShape, "status": [diagnostic] }` 并以 1 退出。

## 4. 命令 JSON 结构

### 4.1 `list --json`

`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` ——注意此处每项变更的 `status` 是字符串枚举。`--specs`：`{ "specs": [ { "id", "requirementCount" } ], "root" }`。

`warnings` 在非空时才出现，用于报告 `changes/` 下并非变更的目录。目前唯一的代码是 `nested_change_directory`：命名空间文件夹包含了变更目录；OpenSpec 无法定位这类变更，因为变更必须是 `changes/` 下的直接子目录。列出的变更条目也会包含 `nested`，此时它的 `status` 没有意义。不要把这类条目当作变更；只报告提示信息，不要改动这些目录。

### 4.2 `show <item> --json`

变更：`{ "id", "title", "deltaCount", "deltas": [...], "root" }`。规格说明：`{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`

`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`。任何条目验证失败时以 1 退出。

### 4.4 `status --json`

`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`。`isPlanningComplete` 表示所有未跳过的规划产物均已存在；跳过的产物视为满足要求，无需创建。它不表示实现任务已经完成。为保持兼容，`isComplete` 仍保留，且含义相同。每个产物的 `requires` 是其直接依赖 ID（所有状态均存在，因此即使产物为 `done`，也能计算传递依赖集合）；只有状态为 `blocked` 时才会出现 `missingDeps`。

`artifacts` 数组按依赖顺序排列。如果多个产物同时就绪，则依照模式中 `artifacts:` 的声明顺序排列（绝非按字母排序）。因此，第一个 `ready` 条目就是接下来应编写的产物；`missingDeps` 也按相同顺序排列。若某项产物的 `generates` 路径位于 `specs/` 下，且变更的 `.openspec.yaml` 声明了 `skip_specs: true`，其状态会标记为 `"skipped"`；它满足依赖关系，但不得创建。没有活动变更时返回 `{ "changes": [], "message", "root" }`，退出码为 0。

`--all`（批量模式，不能与 `--change` 同时使用；若同时指定，会返回 `{ "changes": [], "root": null, "status": [d] }` 形式的空值载荷）：`{ "changes": [ <per-change status object, no per-change root>, ... ], "root" }`，按变更名称排序。加载失败的变更会在对应位置返回 `{ "changeName", "status": [d] }`；遍历会继续，保留完整信封，并在文本和 JSON 模式下都以 1 退出。即使不存在任何变更，无效的 `--schema` 也会导致整个调用失败并返回空值载荷。

### 4.5 `instructions <artifact> --json`

`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`。`unlocks` 会按模式的声明顺序列出此产物会解锁的产物（与 `status` 建议的顺序相同）。如果变更声明了 `skip_specs: true`，而当前产物被跳过，则会出现 `"skipped": true`（以及 `"warning"`）；不要创建该产物的文件。依赖条目若包含 `skipped: true`，表示无需文件便已满足依赖；不要尝试读取其路径。

`ReferenceIndexEntry`：`{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` ——已解析条目包含 root/specs/fetch；未解析条目包含 store_id 和 warning 状态。索引上限为 50KB（`reference_index_truncated`）。

### 4.6 `instructions apply --json`

`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`。`missingArtifacts` 列出 apply 会因之受阻的内容（模式的 `apply.requires`）；`missingPrerequisites` 则按构建顺序列出运行 apply 前仍需创建的全部内容，即这些依赖的传递闭包，因此可能更长。`warnings` 列出与变更本身相关、但不会阻止流程的问题；目前包括变更已可实现、但没有差异规格说明且未设置 `skip_specs: true` 的情况，这种状态会被 `openspec validate` 拒绝。

每次调用都会从所选根目录读取可选字段 `context` 和 `operationGuidance`。`context` 是提示词层面的必需输入，必须应用其中相关的项目事实、约定和限制；`operationGuidance` 是建议性输入，只在适用且与内置工作流相容时遵循。两者都与状态、任务、进度、上下文文件及内置指令分开。

### 4.7 `instructions archive --json`

`{ "changeName", "context"?, "operationGuidance"?, "root" }`。要求解析后的仓库/存储库根目录中存在有效的 `--change`，并采用与 apply 相同的必需上下文/建议性指引语义。这是只读的运行时输入接口：不会返回静态归档工作流，不会检查或合并差异规格说明，不会写入主规格说明，也不会移动变更。

### 4.8 `new change <name> --json`

成功：`{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失败：`{ "change": null, "status": [d] }`，退出码为 1。

### 4.9 `archive <name> --json`

成功：`{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`。失败：`{ "archive": null, "root"?, "status": [d] }`，退出码为 1。只有至少写入或废弃了一份规格文件时，`specsUpdated` 才为 true。（如果变更删除了某项能力的最后一条需求，该能力的规格文件会被删除；这要求变更的 `.openspec.yaml` 中设置 `retire_capabilities: true`。每次废弃都会列入 `warnings`；只有规格文件位于调用者当前检出目录时，才会附上可粘贴执行的 Git 恢复命令。）已经同步过的变更仍会归档，但 totals 全为零，并在 `warnings` 中列出跳过的内容。JSON 模式严格禁止交互：每个原本的提示点都会转换成 `archive_*` 代码。

### 4.10 `doctor --json`

`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`。仅当存储库是基于 Git 的检出且配置了上游跟踪引用时，才会出现 `drift`；其中 ahead/behind 数量是相对于上次获取的上游，而非实时远端。任何严重级别的健康问题都以 0 退出。失败载荷为 `{ "root": null, "store": null, "references": [], "status": [d] }`，退出码为 1。

### 4.11 `context --json`

`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`。AVAILABLE 表示路径存在且状态为空。`--code-workspace <path>` 会写入 `{folders:[{name,path}]}`（仅包含可用的被引用存储库，并带 `ref:` 前缀）；JSON 模式会先写文件，再输出结果，以确保即使写入失败，stdout 仍只包含一个文档。失败载荷为 `{ "root": null, "members": [], "status": [d] }`，退出码为 1。

### 4.12 `store ... --json`

setup/register：`{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove：`{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list：`{ "stores": [{id, root}], "status": [] }`。doctor：`{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` 表示未知/未检查）。健康问题以 0 退出；失败时使用相应空值载荷并以 1 退出。取消提示时以 130 退出。

### 4.13 `schemas --json` / `templates --json`

`schemas`：成功时仍返回裸数组 `[ {name, description, artifacts, source} ]；按标准根目录选择顺序解析，并接受 `--store <id>`。根目录解析失败时返回 `{ "schemas": [], "root": null, "status": [d] }`，退出码为 1。`templates`：返回以键组织的对象 `{ "<artifactId>": {path, source} }`，仍依据当前工作目录运行，不包含 root/status 字段。

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
