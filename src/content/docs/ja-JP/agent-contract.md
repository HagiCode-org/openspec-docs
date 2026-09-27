---
title: "OpenSpec エージェント契約"
---

`openspec` CLI の機械可読インターフェイスを `src/` と照合して検証したものです（最終監査、2026-06-11）。以下の各形式は、出力元のコードに基づいて記載しています。

## 1. 一般的な規約

- **1回の実行につき JSON ドキュメントは1つ。** `--json` モードでは、stdout にインデント2文字で整形された JSON ドキュメントが正確に1つ出力されます。人間向けの文章、スピナー、store バナーは stderr に出力されます。
- **Store バナー。** 人間向けモードでは、store から選択されたルートを `Using OpenSpec root: <id> (<path>)` の形式で stderr に出力します。JSON モードでは出力されません。
- **キーの大文字・小文字の形式はインターフェイスによって異なる**（「既知の不整合」を参照）。store/doctor/context のペイロードは `snake_case`、ワークフローのペイロード（`status`、`instructions`、`new change`、`validate`、`list`）は `camelCase` を使います。ただし、埋め込みの `root` オブジェクトは常に `store_id` を使います。
- **ほとんどのペイロードでは、省略可能なキーは null ではなく省略されます**（例: `root.store_id`、`member.path`）。明示的な `null` を使う例外は各形式に記載しています（store doctor の `git.*`、失敗ペイロード）。

## 2. 診断エンベロープ

すべての機械可読診断（`StoreDiagnostic`）で、次の共通エンベロープ形式を使います。

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "人間向けのメッセージ",
  "target": "ドット区切りの対象（任意）",
  "fix": "実行可能な説明またはコマンド1つ（任意）"
}
```

診断が出力される場所は2つあります。健全性の情報はトップレベルまたは各エントリの **status 配列**（`status: StoreDiagnostic[]`）に、コマンド失敗時に **スローされるエラー** は1要素の `status` 配列に変換されて出力されます。

## 3. ルートの選択と `RootOutput`

ルートを解決するすべてのコマンド（`list`、`show`、`validate`、`status`、`instructions`、`instructions apply`、`instructions archive`、`new change`、`archive`、`doctor`、`context`、`schemas`）は、次の優先順位で1つの OpenSpec ルートを解決します。

1. `--store <id>` → 登録済み store のルート（`source: "store"`）。
2. それ以外では、最も近い親ディレクトリにある `openspec/` を使う。計画用の構成があれば `source: "nearest"`（`store:` ポインターは無視され、stderr に警告が出る）。有効な `store:` ポインターを持つ設定のみのディレクトリなら、その store を使い `source: "declared"`。
3. 近くにルートがなく、グローバル `defaultStore` が設定されている（`openspec config set defaultStore <id>`）→ その store を使い `source: "global_default"`。古い ID は元の store エラーで失敗し、`fix` に `openspec config unset defaultStore` が示されます。
4. 近くにルートも既定値もなく、登録済み store がある → `no_root_with_registered_stores` エラー。
5. ルート、既定値、store がない場合、コマンドによっては現在の作業ディレクトリを `source: "implicit"` として扱います。一方、`doctor`、`context`、`list`、一括 `validate` は `no_openspec_root` で失敗します。`list` は `openspec/project.md` を持つ旧形式プロジェクト用に、暗黙のフォールバックを維持します。

成功時の JSON ペイロードには通常ルートが含まれます。成功時の `schemas --json` は、互換性維持のため §4.13 に記載のとおり意図的に配列のみを返します。

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**ルート解決失敗時の仕様:** JSON モードでは、解決に失敗すると `{ ...commandNullShape, "status": [diagnostic] }` を stdout に出力し、終了コード1で終了します。

## 4. コマンドの JSON 形式

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — change ごとの `status` は文字列の列挙値です。`--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`。

`warnings`（空の場合は省略）は、`changes/` 以下にある change ではないディレクトリを報告します。現時点のコードは `nested_change_directory` のみです。change ディレクトリを包む名前空間フォルダーのことですが、OpenSpec は change を常に `changes/` の直下にあるディレクトリとして扱うため、この構成には対応できません。同じ項目は一覧表示された change に `nested` を含めますが、その場合 `status` は意味を持ちません。この項目を change として扱わないでください。メッセージを報告し、ディレクトリには手を加えないでください。

### 4.2 `show <item> --json`
変更: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`。仕様: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`。

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. 項目が1つでも失敗すると、終了コード1になります。

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` は、スキップされていない計画成果物がすべて存在することを示します。スキップされた成果物は作成しなくても充足したものと見なされます。実装タスクが完了したという意味ではありません。`isComplete` は同じ値を持つ互換性用エイリアスとして残されています。各成果物の `requires` は直接の依存 ID であり（すべての状態で存在するため、成果物が `done` でも推移的な依存関係を計算できます）、`missingDeps` は `blocked` の場合だけ表示されます。`artifacts` 配列は依存関係の順で、同時に準備可能になる成果物の順序はスキーマの `artifacts:` 宣言順（アルファベット順ではない）で決まります。そのため最初の `ready` 項目が次に作成する成果物です。`missingDeps` にも同じ順序が適用されます。`"skipped"` は、`.openspec.yaml` に `skip_specs: true` が指定された change で、成果物の `generates` パスが `specs/` 以下にあることを示します。依存関係は満たしますが、作成してはいけません。作業中の change がない場合は `{ "changes": [], "message", "root" }` を返し、終了コード0になります。

`--all`（一括処理。`--change` とは併用不可で、併用すると `{ "changes": [], "root": null, "status": [d] }` の null 形式でエラーになります）: `{ "changes": [ <change ごとの status オブジェクト。change ごとの root なし>, ... ], "root" }` を change 名順で返します。読み込みに失敗した change はその位置に `{ "changeName", "status": [d] }` として含まれます。一覧処理は続行され、エンベロープ全体が保持され、テキストと JSON の両モードで終了コード1になります。無効な `--schema` は、change が存在しない場合でも呼び出し全体を null 形式で失敗させます。

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` には、この成果物によって作成可能になる成果物をスキーマの宣言順（`status` が推奨する順序と同じ）で列挙します。change に `skip_specs: true` が指定され、この成果物がスキップされる場合は `"skipped": true`（および `"warning"`）が含まれます。ファイルを作成しないでください。依存エントリに `skipped: true` がある場合、ファイルがなくても依存関係は満たされています。パスを読み込もうとしないでください。

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 解決済みのエントリには root/specs/fetch が含まれ、未解決の場合は store_id と警告 status が含まれます。索引の上限は50 KBです（`reference_index_truncated`）。

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` は apply が処理をブロックする要因（スキーマの `apply.requires`）です。`missingPrerequisites` は apply を実行する前に作成すべき残りの項目をビルド順に示します。依存関係の推移的閉包であるため、より長い一覧になる場合があります。`warnings` は change 自体に関する、処理を妨げない問題を示します。現時点では、差分仕様も `skip_specs: true` もなく実装可能な状態になっている change が該当し、`openspec validate` はこれを拒否します。省略可能なルートフィールド（`context`、`operationGuidance`）は、呼び出しごとに選択されたルートから読み取られます。`context` はプロンプトレベルで必須の入力であり、関連するプロジェクト情報、規約、制約を適用する必要があります。`operationGuidance` は助言的な入力で、組み込みワークフローに適用でき、かつ矛盾しない項目だけを使用します。どちらも状態、タスク、進捗、コンテキストファイル、組み込みの指示とは別に保持されます。

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. 解決されたリポジトリ/store ルート内に有効な `--change` が必要です。apply と同じく、コンテキストは必須、ガイダンスは助言として扱います。これは実行時入力を読み取り専用で提供するインターフェイスです。静的な archive ワークフローを返したり、差分仕様を確認・マージしたり、メイン仕様を書き込んだり、change を移動したりはしません。

### 4.8 `new change <name> --json`
成功時: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`。失敗時: `{ "change": null, "status": [d] }`、終了コード1。

### 4.9 `archive <name> --json`
成功時: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`。失敗時: `{ "archive": null, "root"?, "status": [d] }`、終了コード1。`specsUpdated` が true になるのは、仕様ファイルが1つ以上書き込まれるか廃止された場合に限ります（change が機能の最後の要件を削除したとき仕様を削除します。この操作には change の `.openspec.yaml` に `retire_capabilities: true` が必要です。廃止はすべて `warnings` に示され、呼び出し元のチェックアウトにあった仕様についてのみ、貼り付け可能な Git 復旧コマンドが含まれます）。すでに同期済みの change をアーカイブすると、合計はすべて0になり、スキップした内容が `warnings` に記載されます。JSON モードは完全な非対話型です。確認プロンプトはすべて `archive_*` コードに置き換わります。

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift`（Git を使った store のチェックアウトに upstream の追跡参照がある場合のみ出力）は、最後に取得した upstream に対する進行・遅れの件数です。現在のリモートに対する値ではありません。健全性の指摘は重要度に関係なく終了コード0です。失敗時のペイロード: `{ "root": null, "store": null, "references": [], "status": [d] }`、終了コード1。

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = path があり、かつ status が空。`--code-workspace <path>` は `{folders:[{name,path}]}` を書き込みます（参照可能な store のみ。`ref:` プレフィックス付き）。JSON モードでは出力前に書き込みを行うため、書き込みに失敗しても stdout には JSON ドキュメントが正確に1つ出力されます。失敗時: `{ "root": null, "members": [], "status": [d] }`、終了コード1。

### 4.12 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`。unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`。list: `{ "stores": [{id, root}], "status": [] }`。doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`（`null` = 不明/未検査）。健全性の指摘では終了コード0、失敗時は対応する null 形式で終了コード1になります。プロンプトのキャンセル時は終了コード130です。

### 4.13 `schemas --json` / `templates --json`
`schemas`: 成功時は引き続き配列 `[ {name, description, artifacts, source} ]` のみを返します。標準のルート選択優先順位で解決し、`--store <id>` に対応します。ルート選択の失敗時: `{ "schemas": [], "root": null, "status": [d] }`、終了コード1。`templates`: キー付きオブジェクト `{ "<artifactId>": {path, source} }` です。引き続き現在の作業ディレクトリを基準とし、root/status キーはありません。

## 5. 終了コードの仕様

| 状況 | 終了コード | Stdout |
|---|---|---|
| 成功（doctor/context/store doctor の健全性の指摘も含む） | 0 | ペイロード |
| `--json` モードでコマンドが失敗 | 1 | `status: [d]` とコマンドの null 形式を含む JSON ドキュメント1つ |
| `validate` で失敗項目がある | 1 | 完全なレポート |
| プロンプトをキャンセル（store グループ、人間向けモード） | 130 | stderr のみ |

## 6. 診断コード一覧

### 解決
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; そのまま引き継がれるコード: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec ルートの健全性（エラー、修正方法なし）
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. stores ベータ期間中、正常なルートでも `openspec/specs/`、`openspec/changes/`、`openspec/changes/archive/` が存在しない場合があります。存在するのにディレクトリではない場合に限り、健全性エラーになります。

### Store のレジストリ/識別情報/状態
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered`（info）。

### Store のセットアップ/登録/削除
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing`（remove では warning、doctor では error）、`store_root_not_directory`。

### Store の Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits`（warning）、`store_clone_fragile_directories`（warning）、`store_remote_divergence`（info、doctor）、`store_checkout_drift`（info、doctor）。

### 参照（警告）
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### 関係（警告。doctor 用。context はレジストリ関連のみ保持）
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive（JSON モード）
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context の書き込み
`context_file_exists`, `context_output_dir_missing`.

### フォールバック
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## 既知の不整合

最終監査で記録された不整合です。公開キーの名称変更は製品上の判断により、今回のリリース以降に延期されています。

1. ~~`--json` モードで、一部の失敗経路は JSON ドキュメントを出力せず stderr のみを出力していました。~~ 最終総合テストで修正済みです。`show`/`validate` の未知または曖昧な項目は `{status:[{code: unknown_item | ambiguous_item, ...}]}` を出力します。`status`/`instructions`/`list`/`show`/`validate` でスローされたエラーは、JSON 対応の失敗ヘルパー（コマンドの null 形式 + `status`）を経由します。`store <unknown subcommand> --json` は `{status:[{code: unknown_store_subcommand}]}` を出力します。`list` はルート解決に失敗した場合、自身の `{changes|specs: [], root: null}` null 形式を含みます。
2. `store_root_missing` は2種類の重要度で出力されます（remove では warning、store doctor では error）。上記のとおり文脈に依存します。
3. キーの形式は snake_case（store 系）と camelCase（workflow 系）で異なります。`root.store_id` は常に snake_case です。
4. src には並行するエンベロープ型宣言が4つあります。archive の診断には `target` は含まれません。
5. `list --json` は change ごとの文字列列挙値として `status` キーを再利用します。
6. `version` フィールドを持つのは `validate` の出力だけです。
7. `templates` はルート選択を無視します（現在の作業ディレクトリを基準とし、`--store` はありません）。
8. 非推奨の名詞形式（`change`/`spec` サブコマンド）は、`root`/`status` のないエンベロープ非対応のペイロードを出力します。
