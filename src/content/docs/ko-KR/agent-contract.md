---
title: "OpenSpec 에이전트 계약"
---

`openspec` CLI의 기계 판독 가능한 인터페이스를 `src/` 코드와 대조해 검증했습니다(최종 감사, 2026-06-11). 아래 형식은 모두 해당 출력을 생성하는 코드를 바탕으로 문서화했습니다.

## 1. 일반 규칙

- **호출 한 번에 JSON 문서 하나를 출력합니다.** `--json` 모드에서 표준 출력에는 들여쓰기 2칸으로 정돈된 JSON 문서가 정확히 하나 출력됩니다. 사용자용 문장, 스피너, store 배너는 표준 오류로 출력됩니다.
- **Store 배너.** 사람이 읽는 모드에서는 store로 선택한 루트가 `Using OpenSpec root: <id> (<path>)`를 표준 오류로 출력합니다. JSON 모드에서는 출력하지 않습니다.
- **키 대소문자는 인터페이스에 따라 다릅니다**(불일치 항목 참조). store/doctor/context 페이로드는 `snake_case`, 워크플로 페이로드(`status`, `instructions`, `new change`, `validate`, `list`)는 `camelCase`를 사용합니다. 단, 포함된 `root` 객체는 항상 `store_id`를 사용합니다.
- 대부분의 페이로드에서 **선택 키는 `null`이 아니라 생략됩니다**(예: `root.store_id`, `member.path`). 명시적으로 `null`을 사용하는 예외는 각 형식에 표시되어 있습니다(store doctor의 `git.*`, 실패 페이로드).

## 2. 진단 엔벨로프

모든 기계 판독 가능한 진단(`StoreDiagnostic`)은 하나의 엔벨로프 형식을 공유합니다.

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

진단은 두 위치에 나타납니다. 상태 확인 결과에는 최상위 또는 항목별 **상태 배열**(`status: StoreDiagnostic[]`)을 사용하고, 명령 실패 시 발생한 오류는 요소 하나로 된 `status` 배열로 변환합니다.

## 3. 루트 선택 및 `RootOutput`

루트를 확인하는 모든 명령(`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas)은 다음 우선순위에 따라 하나의 OpenSpec 루트를 결정합니다.

1. `--store <id>` → 등록된 store의 루트(`source: "store"`).
2. 그렇지 않으면 `openspec/`가 있는 가장 가까운 상위 디렉터리를 확인합니다. 계획 구조가 있으면 `source: "nearest"`입니다(`store:` 포인터는 무시하고 표준 오류에 경고를 출력). 유효한 `store:` 포인터가 있는 구성 전용 디렉터리라면 해당 store를 선택하며 `source: "declared"`입니다.
3. 가까운 루트가 없고 전역 `defaultStore`가 설정되어 있으면(`openspec config set defaultStore <id>`) 해당 store를 선택하고 `source: "global_default"`로 표시합니다. 유효하지 않은 ID는 store 오류와 `openspec config unset defaultStore`를 안내하는 `fix`를 반환합니다.
4. 가까운 루트와 기본값은 없지만 등록된 store가 있으면 `no_root_with_registered_stores` 오류를 반환합니다.
5. 루트, 기본값, store가 없으면 명령에 따라 현재 작업 디렉터리를 `source: "implicit"`로 처리할 수 있습니다. `doctor`, `context`, `list`, 일괄 `validate`는 대신 `no_openspec_root` 오류로 실패합니다. 단, `list`는 `openspec/project.md`가 있는 이전 프로젝트에서 암시적 루트를 유지합니다.

성공한 JSON 페이로드에는 보통 루트가 포함됩니다. 단, 성공한 `schemas --json`은 §4.13에 설명된 하위 호환성을 위해 루트 없는 배열을 의도적으로 유지합니다.

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**루트 실패 계약:** JSON 모드에서 루트 확인에 실패하면 표준 출력에 `{ ...commandNullShape, "status": [diagnostic] }`를 출력하고 종료 코드 1을 반환합니다.

## 4. 명령별 JSON 형식

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — note the per-change `status` is a string enum here. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

`warnings`(비어 있으면 생략)는 변경 사항이 아닌 `changes/` 아래 디렉터리를 보고합니다. 현재 유일한 코드는 `nested_change_directory`이며 변경 사항 디렉터리를 감싸는 네임스페이스 폴더를 나타냅니다. 변경 사항은 항상 `changes/` 바로 아래에 있는 디렉터리이므로 OpenSpec은 이 폴더를 대상으로 지정할 수 없습니다. 같은 항목이 나열된 변경 사항에 `nested` 값을 포함하면 해당 `status`는 의미가 없습니다. 이를 변경 사항으로 취급하지 마세요. 메시지를 보고하고 디렉터리는 그대로 두세요.

### 4.2 `show <item> --json`
변경 사항: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. 사양: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. 항목이 하나라도 실패하면 종료 코드 1을 반환합니다.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete`은 건너뛴 항목을 제외한 계획 산출물이 모두 있는지 나타냅니다. 건너뛴 산출물은 실제로 생성하지 않아도 완료된 것으로 간주합니다. 구현 작업의 완료 여부를 의미하지는 않습니다. `isComplete`는 같은 값을 사용하는 하위 호환 별칭입니다. 각 산출물의 `requires`에는 직접 의존 ID가 포함됩니다(모든 상태에서 제공되므로 산출물이 `done`이어도 전이 의존성을 계산할 수 있음). `missingDeps`는 상태가 `blocked`일 때만 나타납니다. `artifacts` 배열은 의존성 순서로 정렬하며 동시에 준비되는 산출물은 스키마의 `artifacts:` 선언 순서로 정렬합니다(알파벳순 아님). 따라서 첫 번째 `ready` 항목이 다음에 작성할 산출물입니다. `missingDeps`도 같은 순서를 사용합니다. `"skipped"`는 변경 사항의 `.openspec.yaml`에 `skip_specs: true`가 선언되어 있고 `generates` 경로가 `specs/` 아래인 산출물을 나타냅니다. 의존성은 충족하지만 파일을 만들면 안 됩니다. 진행 중인 변경 사항이 없으면 `{ "changes": [], "message", "root" }`를 반환하고 종료 코드 0으로 끝납니다.

`--all`(일괄 모드, `--change`와 함께 사용할 수 없음 — 함께 지정하면 `{ "changes": [], "root": null, "status": [d] }`의 null 형식으로 오류 발생): `{ "changes": [ <per-change status object, no per-change root>, ... ], "root" }`를 변경 사항 이름순으로 반환합니다. 로드할 수 없는 변경 사항에는 해당 위치에 `{ "changeName", "status": [d] }`가 들어갑니다. 나머지 항목의 검색을 계속하고 전체 엔벨로프를 유지하며 텍스트 및 JSON 모드 모두에서 종료 코드 1을 반환합니다. 유효하지 않은 `--schema`는 변경 사항이 없더라도 전체 호출을 null 형식과 함께 실패시킵니다.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks`에는 이 산출물을 통해 작성할 수 있게 되는 다음 산출물이 스키마 선언 순서(`status`에서 권장하는 순서와 동일)로 나열됩니다. 변경 사항에서 `skip_specs: true`를 선언해 이 산출물을 건너뛴 경우 `"skipped": true`(및 `"warning"`)가 표시됩니다. 파일을 만들면 안 됩니다. 의존 항목에 `skipped: true`가 있으면 파일 없이 의존성이 충족된 것이므로 경로를 읽으려 하지 마세요.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — 확인된 항목에는 root/specs/fetch가 포함되고 확인되지 않은 항목에는 store_id와 경고 상태가 포함됩니다. 색인은 50KB로 제한됩니다(`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts`는 apply가 차단되는 직접 원인(스키마의 `apply.requires`)이고 `missingPrerequisites`는 apply를 실행하기 전에 작성해야 할 모든 항목을 빌드 순서대로 나열합니다. 이 값은 직접 의존성의 전이 폐쇄이므로 더 길 수 있습니다. `warnings`에는 변경 사항 자체의 비차단 문제가 나열됩니다. 현재는 델타 사양이나 `skip_specs: true`가 없지만 구현 준비가 된 상태이며 `openspec validate`에서 거부됩니다. 선택적 루트 필드(`context`, `operationGuidance`)는 호출할 때마다 선택된 루트에서 읽습니다. `context`는 관련 프로젝트 정보, 관례, 제약 조건을 적용해야 하는 필수 프롬프트 입력입니다. `operationGuidance`는 안내 입력이며 내장 워크플로에 적용 가능하고 호환되는 항목만 따릅니다. 두 필드는 상태, 작업, 진행률, 컨텍스트 파일, 내장 지침과 별도로 유지됩니다.

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. 확인된 저장소/store 루트에 유효한 `--change`가 필요하며 apply와 동일하게 필수 컨텍스트/권고 안내를 처리합니다. 읽기 전용 런타임 입력 인터페이스입니다. 정적인 보관 워크플로를 반환하거나 델타 사양을 검사 또는 병합하지 않으며 기본 사양을 작성하거나 변경 사항을 이동하지 않습니다.

### 4.8 `new change <name> --json`
성공: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. 실패: `{ "change": null, "status": [d] }`, 종료 코드 1.

### 4.9 `archive <name> --json`
성공: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. 실패: `{ "archive": null, "root"?, "status": [d] }`, 종료 코드 1. `specsUpdated`는 사양 파일을 하나 이상 작성하거나 폐기했을 때만 true입니다(변경 사항에서 마지막 요구 사항을 제거한 기능은 사양이 삭제되며 변경 사항의 `.openspec.yaml`에 `retire_capabilities: true`가 필요합니다. 폐기 항목은 모두 `warnings`에 표시되며 사양이 호출자의 체크아웃에 있을 때만 복사해 사용할 수 있는 Git 복구 명령이 포함됨). 이미 동기화된 변경 사항은 모든 합계가 0인 상태로 보관되며 건너뛴 항목은 `warnings`에 표시됩니다. JSON 모드는 대화형 입력을 허용하지 않으므로 모든 확인 요청이 `archive_*` 코드로 바뀝니다.

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift`(Git 기반 store 체크아웃에 업스트림 추적 참조가 있을 때만 표시)는 현재 원격 저장소가 아니라 마지막으로 가져온 업스트림 기준 앞섬/뒤처짐 횟수입니다. 심각도와 관계없이 상태 진단 결과는 종료 코드 0을 반환합니다. 실패 페이로드: `{ "root": null, "store": null, "references": [], "status": [d] }`, 종료 코드 1.

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE은 경로가 있고 상태가 비어 있는 항목입니다. `--code-workspace <path>`는 `{folders:[{name,path}]}`를 작성합니다(사용 가능한 참조 store만 포함하며 폴더 이름에는 `ref:` 접두사를 사용). JSON 모드에서는 출력 전에 파일을 작성하므로 파일 쓰기 실패 시에도 표준 출력에는 문서 하나만 나옵니다. 실패: `{ "root": null, "members": [], "status": [d] }`, 종료 코드 1.

### 4.12 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }`(`null`은 알 수 없거나 확인하지 않은 값을 의미). 상태 진단 결과는 종료 코드 0을 반환하며 실패 시 해당 null 형식과 함께 종료 코드 1을 반환합니다. 프롬프트 취소 시 종료 코드 130을 반환합니다.

### 4.13 `schemas --json` / `templates --json`
`schemas`: 성공 시 일반 배열 `[ {name, description, artifacts, source} ]을 반환하며 표준 루트 선택 우선순위를 따르고 `--store <id>`를 허용합니다. 루트 선택 실패: `{ "schemas": [], "root": null, "status": [d] }`, 종료 코드 1. `templates`: 키 기반 객체 `{ "<artifactId>": {path, source} }`를 반환하며 여전히 현재 작업 디렉터리를 기준으로 하고 root/status 키는 없습니다.

## 5. 종료 코드 계약

| 상황 | 종료 코드 | 표준 출력 |
|---|---|---|
| 성공(doctor/context/store doctor의 상태 진단 포함) | 0 | 페이로드 |
| `--json` 모드의 명령 실패 | 1 | `status: [d]`와 명령의 null 형식을 포함한 JSON 문서 하나 |
| 실패 항목이 있는 `validate` | 1 | 전체 보고서 |
| 프롬프트 취소(`store` 그룹, 대화형 모드) | 130 | 표준 오류만 |

## 6. 진단 코드 목록

### 루트 확인
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### OpenSpec 루트 상태(오류, 해결 방법 없음)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Stores 베타 기간에는 정상 루트에서도 `openspec/specs/`, `openspec/changes/`, `openspec/changes/archive/`가 없을 수 있습니다. 존재하지만 디렉터리가 아닌 경우에만 상태 오류로 처리합니다.

### Store 레지스트리/ID/상태
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Store 설정/등록/제거
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`.

### Store Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### 참조(경고)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### 관계(경고; doctor에서는 모두 표시하고 context에는 레지스트리 항목만 표시)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### 보관(JSON 모드)
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### 컨텍스트 파일 쓰기
`context_file_exists`, `context_output_dir_missing`.

### 기타 오류
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## 알려진 불일치

최종 감사에서 기록했습니다. 게시된 키 이름 변경은 이번 릴리스 이후로 미룬 제품 결정입니다.

1. ~~`--json` 모드에서 일부 실패 경로가 JSON 문서 없이 표준 오류만 출력했습니다.~~ 최종 테스트 라운드에서 수정했습니다. `show`/`validate`의 알 수 없거나 모호한 항목은 `{status:[{code: unknown_item | ambiguous_item, ...}]}`를 출력합니다. `status`/`instructions`/`list`/`show`/`validate`에서 발생한 오류는 JSON 인식 실패 헬퍼(명령의 null 형식 + `status`)를 사용합니다. `store <unknown subcommand> --json`은 `{status:[{code: unknown_store_subcommand}]}`를 출력하며 `list`는 루트 확인에 실패해도 `{changes|specs: [], root: null}` null 형식을 포함합니다.
2. `store_root_missing`은 두 가지 심각도로 출력됩니다(remove에서는 경고, store doctor에서는 오류). 위 설명처럼 맥락에 따라 달라집니다.
3. store 계열은 snake_case, 워크플로 계열은 camelCase 키를 사용합니다. `root.store_id`는 모든 경우에 snake_case입니다.
4. src에는 엔벨로프 형식 선언이 네 개 병렬로 존재하며 보관 진단에는 `target`이 포함되지 않습니다.
5. `list --json`은 변경 사항별 문자열 열거형에 `status` 키를 재사용합니다.
6. `version` 필드는 `validate` 출력에만 포함됩니다.
7. `templates`는 루트 선택을 무시하고 현재 작업 디렉터리를 기준으로 실행되며 `--store`를 지원하지 않습니다.
8. 더 이상 사용하지 않는 명사형 하위 명령(`change`/`spec`)은 `root`/`status`가 없는 엔벨로프 외부 형식을 출력합니다.
