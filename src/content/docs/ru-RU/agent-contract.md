---
title: "Контракт агента OpenSpec"
---

Машиночитаемые интерфейсы CLI `openspec`, проверенные по `src/` (итоговый аудит от 2026-06-11). Все приведённые ниже структуры документированы по исходному коду, который их формирует.

## 1. Общие соглашения

- **Один документ JSON на вызов.** В режиме `--json` stdout содержит ровно один документ JSON с отступами в два пробела. Читаемый текст, индикаторы выполнения и баннер хранилища выводятся в stderr.
- **Баннер хранилища.** В человекочитаемом режиме при выборе корня-хранилища в stderr выводится `Using OpenSpec root: <id> (<path>)`. В режиме JSON он не выводится.
- **Формат регистра ключей зависит от интерфейса** (см. «Известные несоответствия»): полезные данные store/doctor/context используют `snake_case`, а полезные данные рабочих процессов (`status`, `instructions`, `new change`, `validate`, `list`) — `camelCase`, кроме встроенного объекта `root`, где всегда используется `store_id`.
- **Необязательные ключи обычно опускаются, а не задаются как null** (например, `root.store_id`, `member.path`). Исключения с явным значением `null` указаны в описании структуры (например, `git.*` в store doctor и полезные данные при ошибке).

## 2. Обёртка диагностики

Все машиночитаемые диагностические сообщения (`StoreDiagnostic`) используют одну структуру обёртки:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "понятное пользователю сообщение",
  "target": "интерфейс с точками (необязательно)",
  "fix": "конкретная рекомендация/команда (необязательно)"
}
```

Диагностика встречается в двух местах: **массивы status** (`status: StoreDiagnostic[]` верхнего уровня или отдельной записи) содержат результаты проверки состояния; при ошибке команды **выброшенная ошибка** преобразуется в массив `status` из одного элемента.

## 3. Выбор корня и `RootOutput`

Все команды, выбирающие корень (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas`), находят один корень OpenSpec в следующем порядке:

1. `--store <id>` → корень зарегистрированного хранилища (`source: "store"`).
2. Иначе ближайший родительский каталог с `openspec/`: структура планирования → `source: "nearest"` (указатель `store:` игнорируется с предупреждением в stderr); каталог только с конфигурацией и допустимым указателем `store:` → соответствующее хранилище, `source: "declared"`.
3. Нет ближайшего корня, но задан глобальный `defaultStore` (`openspec config set defaultStore <id>`) → соответствующее хранилище, `source: "global_default"`; устаревший ID вызывает ошибку хранилища и содержит в `fix` команду `openspec config unset defaultStore`.
4. Нет ближайшего корня или значения по умолчанию, но существуют зарегистрированные хранилища → ошибка `no_root_with_registered_stores`.
5. Нет корня, значения по умолчанию и хранилищ: команды могут считать текущий каталог корнем (`source: "implicit"`); `doctor`, `context`, `list` и пакетная `validate` вместо этого завершаются с `no_openspec_root`. Для старых проектов с `openspec/project.md` команда `list` сохраняет неявный вариант.

Успешные полезные данные JSON обычно содержат объект корня; успешная команда
`schemas --json` намеренно оставляет совместимый массив без обёртки, описанный в §4.13:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (только для выбранного хранилища)" }
```

**Контракт ошибки выбора корня:** в режиме JSON ошибка разрешения выводит в stdout `{ ...commandNullShape, "status": [diagnostic] }` и завершается с кодом 1.

## 4. Структуры JSON-команд

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — обратите внимание, что для каждого изменения `status` здесь является строковым перечислением. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

`warnings` (опускается, если массив пуст) сообщает о каталогах под `changes/`, которые не являются изменениями. Сейчас используется только код `nested_change_directory`: это пространство имён, содержащее каталоги изменений. OpenSpec не может адресовать его напрямую, поскольку изменение всегда является каталогом непосредственно в `changes/`. В соответствующей записи изменения также содержится `nested`, поэтому её `status` не имеет смысла. Не считайте такую запись изменением: передайте сообщение и не меняйте каталоги.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. При ошибке любого элемента возвращается код завершения 1.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` означает, что существуют все артефакты планирования, кроме пропущенных; пропущенные артефакты считаются выполненными, хотя не создаются. Это не означает, что завершены задачи реализации. `isComplete` сохранён как совместимый псевдоним с тем же значением. Для каждого артефакта `requires` содержит ID его непосредственных зависимостей (поле присутствует при любом статусе, поэтому можно вычислить и транзитивный набор зависимостей, даже когда артефакт уже `done`); `missingDeps` присутствует только при `blocked`. Массив `artifacts` упорядочен по зависимостям. Если несколько артефактов становятся готовыми одновременно, порядок задаётся объявлением `artifacts:` в схеме (не алфавитом), поэтому первым создаётся первый элемент `ready`; `missingDeps` использует тот же порядок. Статус `"skipped"` указывает на артефакт, путь `generates` которого находится в `specs/`, если `.openspec.yaml` изменения содержит `skip_specs: true`. Такой артефакт удовлетворяет зависимостям, но создавать его не нужно. Нет активных изменений: `{ "changes": [], "message", "root" }`, код завершения 0.

`--all` (пакетный режим, несовместим с `--change`; при их совместном использовании возвращается ошибка с пустой структурой `{ "changes": [], "root": null, "status": [d] }`): `{ "changes": [ <объект статуса изменения без отдельного root>, ... ], "root" }`; изменения отсортированы по имени. Если изменение не удалось загрузить, вместо него добавляется `{ "changeName", "status": [d] }`; обработка остальных продолжается, полная обёртка сохраняется, код завершения равен 1 как в текстовом режиме, так и в JSON. Недопустимый `--schema` завершает весь вызов с пустой структурой, даже если изменений нет.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` содержит артефакты, которые становятся готовыми благодаря текущему, в порядке их объявления в схеме (в том же порядке, что их рекомендует создавать `status`). `"skipped": true` (вместе с `"warning"`) появляется, если изменение объявляет `skip_specs: true` и данный артефакт пропущен: не создавайте его файлы. Зависимость со `skipped: true` считается выполненной без файлов — не пытайтесь читать указанные пути.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — разрешённые ссылки содержат root/specs/fetch; неразрешённые — store_id и статус-предупреждение. Индекс ограничен 50 КБ (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` — то, что блокирует apply (значение `apply.requires` схемы); `missingPrerequisites` — всё, что ещё требуется создать до запуска apply, в порядке создания, то есть транзитивное замыкание этих зависимостей, поэтому список может быть длиннее. `warnings` содержит неблокирующие проблемы самого изменения — сейчас это случай, когда изменение готово к реализации, но в нём нет дельта-спецификаций и не задано `skip_specs: true`, что отклоняет `openspec validate`. Оба необязательных поля корня (`context`, `operationGuidance`) считываются из выбранного корня при каждом вызове. `context` — обязательный вход запроса; нужно применить релевантные сведения о проекте, соглашения и ограничения. `operationGuidance` — рекомендательный ввод; отдельные пункты применяются, только если они уместны и совместимы со встроенным рабочим процессом. Оба поля отделены от состояния, задач, прогресса, файлов контекста и встроенной инструкции.

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. Требует допустимый `--change` в выбранном корне репозитория или хранилища и использует те же правила обязательного контекста и рекомендательных подсказок, что и apply. Это интерфейс получения входных данных во время выполнения, доступный только для чтения: он не возвращает статический рабочий процесс архивации, не проверяет и не объединяет дельта-спецификации, не записывает основные спецификации и не перемещает изменение.

### 4.8 `new change <name> --json`
Success: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Failure: `{ "change": null, "status": [d] }`, exit 1.

### 4.9 `archive <name> --json`
Успешный ответ: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. Ошибка: `{ "archive": null, "root"?, "status": [d] }`, код завершения 1. `specsUpdated` равно true, только если был записан или выведен из эксплуатации хотя бы один файл спецификации (если изменение удалило последнее требование возможности, её спецификация удаляется; для этого в `.openspec.yaml` изменения требуется `retire_capabilities: true`; каждый такой случай перечисляется в `warnings`, а вставляемая команда восстановления Git приводится, только если спецификация была в рабочей копии вызывающего процесса). Уже синхронизированное изменение архивируется с нулевыми итогами и пропусками, перечисленными в `warnings`. Режим JSON строго неинтерактивный: каждому запросу соответствует код `archive_*`.

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (присутствует только для checkout-хранилища на основе Git с настроенной upstream-ссылкой) содержит количество коммитов впереди/позади относительно последнего полученного upstream, а не актуального удалённого репозитория. Диагностика о состоянии любого уровня завершается с кодом 0. Структура ошибки: `{ "root": null, "store": null, "references": [], "status": [d] }`, код завершения 1.

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE означает, что путь существует и status пуст. `--code-workspace <path>` записывает `{folders:[{name,path}]}` (только доступные связанные хранилища с префиксами `ref:`); в режиме JSON запись выполняется до вывода, поэтому stdout содержит ровно один документ даже при ошибке записи. Структура ошибки: `{ "root": null, "members": [], "status": [d] }`, код завершения 1.

### 4.12 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = unknown/not probed). Диагностика состояния завершается с кодом 0; ошибка — с кодом 1 и соответствующей структурой с null. Отмена запроса завершается с кодом 130.

### 4.13 `schemas --json` / `templates --json`
`schemas`: при успехе возвращается массив без обёртки `[ {name, description, artifacts, source} ]`; выбор корня соответствует общему приоритету и поддерживает `--store <id>`. Ошибка выбора корня: `{ "schemas": [], "root": null, "status": [d] }`, код завершения 1. `templates`: объект с ключами `{ "<artifactId>": {path, source} }`, по-прежнему зависит от текущего рабочего каталога и не содержит ключей root/status.

## 5. Контракт кодов завершения

| Ситуация | Код | Stdout |
|---|---|---|
| Успех, включая диагностику состояния (doctor/context/store doctor) | 0 | полезные данные |
| Ошибка команды в режиме `--json` | 1 | документ JSON с `status: [d]` и структурой null этой команды |
| `validate` обнаружила ошибочные элементы | 1 | полный отчёт |
| Отмена запроса (группа `store`, человекочитаемый режим) | 130 | только stderr |

## 6. Справочник кодов диагностики

### Разрешение корня и хранилища
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Состояние корня OpenSpec (ошибка без исправления)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. During the stores beta, В здоровом корне могут отсутствовать `openspec/specs/`, `openspec/changes/` и `openspec/changes/archive/`; это считается ошибкой состояния, только если такие пути существуют, но не являются каталогами.

### Реестр, идентификатор и состояние хранилища
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Настройка, регистрация и удаление хранилища
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`.

### Git хранилища
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Ссылки (предупреждение)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Связи (предупреждение; doctor; context сохраняет только ошибку реестра)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Архивация (режим JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Запись контекста
`context_file_exists`, `context_output_dir_missing`.

### Резервные коды
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Известные несоответствия

Зафиксировано итоговым аудитом; переименование опубликованных ключей отложено до следующих выпусков и будет отдельным продуктовыми решением:

1. ~~В режиме `--json` некоторые пути ошибки выводили только stderr, без документа JSON.~~ Исправлено в итоговом цикле проверок: неизвестные и неоднозначные элементы `show`/`validate` выдают `{status:[{code: unknown_item | ambiguous_item, ...}]}`; выброшенные ошибки в `status`/`instructions`/`list`/`show`/`validate` обрабатываются JSON-совместимым помощником ошибок (структура null команды + `status`); `store <unknown subcommand> --json` выдаёт `{status:[{code: unknown_store_subcommand}]}`; при ошибках выбора корня `list` содержит структуру null `{changes|specs: [], root: null}`.
2. `store_root_missing` может иметь два уровня серьёзности (предупреждение при remove, ошибка в store doctor) — это зависит от контекста и описано выше.
3. Регистр ключей `snake_case` (семейство store) и `camelCase` (семейство рабочих процессов); `root.store_id` всегда записывается в `snake_case`.
4. В src существуют четыре параллельных объявления типа обёртки; диагностика archive никогда не содержит `target`.
5. `list --json` использует ключ `status` повторно как строковое перечисление для каждого изменения.
6. Поле `version` есть только в выводе `validate`.
7. `templates` игнорирует выбор корня (использует cwd и не поддерживает `--store`).
8. Устаревшие формы существительных (подкоманды `change`/`spec`) выдают полезные данные без обёртки и без `root`/`status`.
