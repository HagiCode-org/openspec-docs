---
title: "Contrato de agente de OpenSpec"
---

Interfaces legibles por máquina de la CLI `openspec`, verificadas con `src/`
(auditoría final, 2026-06-11). Cada estructura que sigue se ha documentado a
partir del código que la genera.

## 1. Convenciones generales

- **Un documento JSON por invocación.** En modo `--json`, stdout contiene exactamente un documento JSON (con sangría de 2 espacios). El texto para personas, los indicadores de progreso y el aviso de Store se escriben en stderr.
- **Aviso de Store.** En modo normal, si se selecciona una raíz de Store, se escribe `Using OpenSpec root: <id> (<path>)` en stderr. Nunca aparece en modo JSON.
- **Las mayúsculas de las claves dependen de la interfaz** (consulta «Incoherencias conocidas»): los resultados de store/doctor/context usan `snake_case`; los de flujo de trabajo (`status`, `instructions`, `new change`, `validate`, `list`) usan `camelCase`, salvo el objeto `root` incluido, que siempre usa `store_id`.
- **La mayoría de las claves opcionales se omiten en vez de tener valor null**, por ejemplo, `root.store_id` y `member.path`. Las excepciones que usan `null` explícitamente se indican para cada estructura (los campos `git.*` de store doctor y los resultados de error).

## 2. Envoltura de diagnósticos

Todos los diagnósticos legibles por máquina (`StoreDiagnostic`) comparten esta estructura:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Los diagnósticos aparecen en dos lugares: en **matrices de estado** (`status: StoreDiagnostic[]`, en el nivel superior o en cada elemento) para indicar problemas de estado, y como **errores lanzados**, que se convierten en una matriz `status` de un solo elemento cuando falla un comando.

## 3. Selección de la raíz y `RootOutput`

Todos los comandos que resuelven la raíz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas`) determinan una única raíz de OpenSpec mediante este orden de prioridad:

1. `--store <id>` → la raíz del Store registrado (`source: "store"`).
2. En su defecto, el ancestro más cercano con `openspec/`: estructura de planificación → `source: "nearest"` (se ignora un puntero `store:` con un aviso en stderr); directorio que solo contiene configuración con un puntero `store:` válido → ese Store, `source: "declared"`.
3. Sin raíz cercana y con `defaultStore` global configurado (`openspec config set defaultStore <id>`) → ese Store, `source: "global_default"`; un identificador obsoleto produce el error subyacente del Store y un `fix` con `openspec config unset defaultStore`.
4. Sin raíz cercana ni valor predeterminado, pero con Stores registrados → error `no_root_with_registered_stores`.
5. Sin raíz, valor predeterminado ni Stores: los comandos pueden tratar el directorio de trabajo actual como `source: "implicit"`; en cambio, `doctor`, `context`, `list` y `validate` por lotes fallan con `no_openspec_root`. `list` conserva el comportamiento alternativo implícito para proyectos antiguos con `openspec/project.md`.

Los resultados JSON satisfactorios normalmente incluyen la raíz; `schemas --json`
sigue devolviendo deliberadamente la matriz sin envolver, por compatibilidad, tal como se documenta en §4.13:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de error de raíz**: en modo JSON, si falla la resolución, se imprime `{ ...commandNullShape, "status": [diagnostic] }` en stdout y se devuelve el código de salida 1.

## 4. Estructuras JSON de los comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — en este caso, el campo `status` de cada cambio es un valor enumerado de tipo cadena. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

`warnings` (omitido si está vacío) informa de los directorios de `changes/` que
no son cambios. Actualmente, el único código es `nested_change_directory`: una
carpeta de espacio de nombres que contiene directorios de cambios, que OpenSpec
no puede abordar porque un cambio siempre debe ser un directorio directamente
bajo `changes/`. La misma entrada incluye `nested` en el cambio enumerado; en
ese caso, `status` no tiene significado. No trates esa entrada como un cambio:
informa del mensaje y deja los directorios tal como están.

### 4.2 `show <item> --json`
Change: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spec: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Devuelve el código de salida 1 si falla algún elemento.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` indica que existe cada artefacto de planificación que no se haya omitido; los omitidos se consideran satisfechos sin crearlos. No indica si se completaron las tareas de implementación. `isComplete` se conserva como alias de compatibilidad con el mismo valor. `requires` de cada artefacto contiene los ID de sus dependencias directas (siempre está presente, así que se pueden calcular todas las dependencias transitivas incluso cuando el artefacto está `done`); `missingDeps` solo aparece cuando está `blocked`. La matriz `artifacts` sigue el orden de dependencias. Si varios artefactos quedan listos al mismo tiempo, se respeta el orden en que aparecen en la declaración `artifacts:` del esquema (nunca el orden alfabético), así que la primera entrada `ready` indica qué artefacto escribir a continuación; `missingDeps` sigue ese mismo orden. `"skipped"` identifica un artefacto cuya ruta `generates` está bajo `specs/` y cuyo cambio declara `skip_specs: true` en `.openspec.yaml`; satisface las dependencias, pero no se debe crear. Si no hay cambios activos: `{ "changes": [], "message", "root" }`, código de salida 0.

`--all` (lote, incompatible con `--change`; combinarlos genera un error con la
estructura nula `{ "changes": [], "root": null, "status": [d] }`): `{ "changes":
[ <objeto de estado por cambio, sin root individual>, ... ], "root" }`, ordenado
por nombre de cambio. Si no se puede cargar un cambio, su posición contiene
`{ "changeName", "status": [d] }`; el recorrido continúa, conserva el sobre
completo y devuelve 1 tanto en modo texto como JSON. Un `--schema` no válido
hace fallar toda la invocación con la estructura nula, incluso si no hay
cambios.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` enumera los artefactos que quedan listos al crear este, en el orden declarado por el esquema (el mismo que recomienda `status`). `"skipped": true` (junto con `"warning"`) aparece cuando el cambio declara `skip_specs: true` y se omite este artefacto; no crees sus archivos. Una dependencia con `skipped: true` se considera satisfecha aunque no haya archivos; no intentes leer sus rutas.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }`: las entradas resueltas incluyen root/specs/fetch; las no resueltas contienen store_id y el estado de advertencia. El índice tiene un límite de 50 KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` indica qué bloquea apply (`apply.requires` del esquema); `missingPrerequisites` enumera, en el orden de creación, todo lo que aún debe prepararse antes de ejecutar apply: el cierre transitivo de esos requisitos, por lo que la lista puede ser más larga. `warnings` enumera problemas no bloqueantes del propio cambio; actualmente, un cambio listo para implementarse que no tenga especificaciones delta ni `skip_specs: true`, estado que `openspec validate` rechaza. Los dos campos opcionales de la raíz (`context`, `operationGuidance`) se leen en cada invocación desde la raíz seleccionada. `context` es una entrada obligatoria de la instrucción: se deben aplicar los datos, convenciones y restricciones pertinentes del proyecto. `operationGuidance` es una entrada orientativa cuyas recomendaciones solo se siguen cuando son aplicables y compatibles con el flujo integrado. Ambos campos se mantienen separados del estado, las tareas, el progreso, los archivos de contexto y las instrucciones integradas.

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. Requiere un
`--change` válido en la raíz resuelta del repositorio o del almacén y aplica
las mismas reglas de contexto obligatorio e indicaciones orientativas que
apply. Esta interfaz de entradas de ejecución es de solo lectura: no devuelve
el flujo estático de archivado, no inspecciona ni combina especificaciones
delta, no escribe las especificaciones principales ni mueve el cambio.

### 4.8 `new change <name> --json`
Correcto: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`.
Error: `{ "change": null, "status": [d] }`, código de salida 1.

### 4.9 `archive <name> --json`
Correcto: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. Error: `{ "archive": null, "root"?, "status": [d] }`, código de salida 1. `specsUpdated` es verdadero únicamente si se escribió o retiró al menos un archivo de especificación (si el cambio elimina el último requisito de una capacidad, se borra su especificación, lo que requiere `retire_capabilities: true` en `.openspec.yaml`; cada retirada aparece en `warnings`, con un comando de recuperación de Git listo para pegar solo si la especificación estaba en la copia de trabajo del invocador). Un cambio ya sincronizado se archiva con todos los totales en cero y los elementos omitidos en `warnings`. El modo JSON es estrictamente no interactivo: cada punto en que se haría una pregunta devuelve un código `archive_*`.

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (solo presente en copias de almacenes respaldadas por Git que tengan una referencia de seguimiento ascendente) contiene el número de commits adelantados o atrasados respecto de la última referencia ascendente obtenida, no del remoto en tiempo real. Los problemas de estado de cualquier gravedad devuelven el código 0. Resultado de error: `{ "root": null, "store": null, "references": [], "status": [d] }`, código de salida 1.

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. Un miembro está AVAILABLE si existe su ruta Y su estado está vacío. `--code-workspace <path>` escribe `{folders:[{name,path}]}` (solo los almacenes referenciados disponibles, con prefijos `ref:`); en modo JSON, primero se escribe el archivo y luego se muestra la salida, de modo que stdout contiene exactamente un documento incluso si falla la escritura. Error: `{ "root": null, "members": [], "status": [d] }`, código de salida 1.

### 4.12 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconocido/no comprobado). Los problemas de estado devuelven el código 0; los errores, el código 1 y la estructura nula correspondiente. Si se cancela una pregunta, se devuelve 130.

### 4.13 `schemas --json` / `templates --json`
`schemas`: la salida correcta sigue siendo una matriz sin envoltura `[ {name, description, artifacts, source} ]`; aplica el orden canónico de selección de la raíz y acepta `--store <id>`. Error al resolver la raíz: `{ "schemas": [], "root": null, "status": [d] }`, código de salida 1. `templates`: objeto indexado por clave `{ "<artifactId>": {path, source} }`, sigue dependiendo de cwd y no incluye claves root/status.

## 5. Exit-code contract

| Situación | Salida | Stdout |
|---|---|---|
| Ejecución correcta, incluidos problemas de estado (doctor/context/store doctor) | 0 | La carga |
| Error del comando en modo `--json` | 1 | Un documento JSON con `status: [d]` y la estructura nula del comando |
| `validate` con elementos no válidos | 1 | Informe completo |
| Cancelación de pregunta (grupo `store`, modo para personas) | 130 | Solo stderr |

## 6. Diagnostic code catalog

### Resolución
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Estado de la raíz de OpenSpec (error, sin solución)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. During the stores beta, `openspec/specs/`, `openspec/changes/`, and `openspec/changes/archive/` may be absent in a healthy root; they are only health errors when present but not directories.

### Registro, identidad y estado de almacenes
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configurar, registrar y eliminar almacenes
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`.

### Git del almacén
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referencias (advertencia)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relaciones (advertencia; doctor; context solo conserva la del registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivado (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Escrituras de contexto
`context_file_exists`, `context_output_dir_missing`.

### Alternativas
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Known inconsistencies

Registrado por la auditoría final; los cambios de nombres de claves publicadas
son decisiones de producto aplazadas hasta después de esta versión:

1. ~~En modo `--json`, algunas rutas de error solo escribían en stderr y no emitían un documento JSON.~~ Corregido en la ronda final de pruebas: los elementos desconocidos o ambiguos de `show`/`validate` generan `{status:[{code: unknown_item | ambiguous_item, ...}]}`; los errores lanzados en `status`/`instructions`/`list`/`show`/`validate` pasan por el asistente de errores compatible con JSON (estructura nula del comando + `status`); `store <unknown subcommand> --json` genera `{status:[{code: unknown_store_subcommand}]}`; `list` incluye su estructura nula `{changes|specs: [], root: null}` si falla la resolución.
2. `store_root_missing` se emite con dos niveles de gravedad (advertencia en remove, error en store doctor), según el contexto, como se documentó anteriormente.
3. Las claves de la familia store usan `snake_case`, mientras que las de la familia de flujos de trabajo usan `camelCase`; `root.store_id` usa `snake_case` en todas partes.
4. En src existen cuatro declaraciones paralelas de tipos de sobre; los diagnósticos de archive nunca incluyen `target`.
5. `list --json` reutiliza la clave `status` como valor enumerado de tipo cadena para cada cambio.
6. Solo la salida de `validate` incluye el campo `version`.
7. `templates` ignora la selección de la raíz (depende de cwd y no admite `--store`).
8. Las formas nominales obsoletas (subcomandos `change`/`spec`) generan cargas sin envoltura, sin `root` ni `status`.
