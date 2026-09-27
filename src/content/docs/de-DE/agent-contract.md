---
title: "OpenSpec-Agentvertrag"
---

Maschinenlesbare Schnittstellen der `openspec`-CLI, anhand von `src/` überprüft (abschließende Prüfung, 2026-06-11). Jede der folgenden Strukturen ist durch den Code dokumentiert, der sie ausgibt.

## 1. Allgemeine Konventionen

- **Ein JSON-Dokument pro Aufruf.** Im Modus `--json` enthält stdout genau ein JSON-Dokument (mit zwei Leerzeichen eingerückt). Für Menschen lesbare Texte, Spinner und das Store-Banner werden nach stderr geschrieben.
- **Store-Banner.** Im menschenlesbaren Modus gibt ein Store-ausgewählter Stamm `Using OpenSpec root: <id> (<path>)` nach stderr aus. Im JSON-Modus erscheint es nie.
- **Die Schreibweise der Schlüssel hängt von der Schnittstelle ab** (siehe „Bekannte Inkonsistenzen“): Store-, Doctor- und Context-Payloads verwenden `snake_case`; Workflow-Payloads (`status`, `instructions`, `new change`, `validate`, `list`) verwenden `camelCase`. Eine Ausnahme bildet das eingebettete Objekt `root`, das immer `store_id` verwendet.
- **Optionale Schlüssel werden in den meisten Payloads ausgelassen und nicht auf `null` gesetzt** (z. B. `root.store_id`, `member.path`). Ausnahmen, die ausdrücklich `null` verwenden, sind bei der jeweiligen Struktur vermerkt (Store-Doctor `git.*`, Fehler-Payloads).

## 2. Diagnostische Hülle

Alle maschinenlesbaren Diagnosen (`StoreDiagnostic`) verwenden dieselbe Hüllstruktur:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Diagnosen treten an zwei Stellen auf: als **Status-Arrays** (`status: StoreDiagnostic[]` auf oberster Ebene oder pro Eintrag) für Gesundheitsbefunde sowie als **ausgelöste Fehler**, die bei einem Befehlsfehler in ein `status`-Array mit einem Element umgewandelt werden.

## 3. Stammdatenauswahl und `RootOutput`

Alle Befehle, die einen Stamm auflösen (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas`), ermitteln einen OpenSpec-Stamm anhand folgender Prioritätsreihenfolge:

1. `--store <id>` → der Stamm des registrierten Stores (`source: "store"`).
2. Andernfalls wird der nächste übergeordnete Ordner mit `openspec/` verwendet: mit Planungsstruktur gilt `source: "nearest"` (ein `store:`-Verweis wird ignoriert und eine Warnung nach stderr ausgegeben); ein Ordner, der nur eine Konfiguration mit gültigem `store:`-Verweis enthält, verweist auf diesen Store (`source: "declared"`).
3. Gibt es keinen nächstgelegenen Stamm und ist global `defaultStore` festgelegt (`openspec config set defaultStore <id>`), wird dieser Store verwendet (`source: "global_default"`). Eine veraltete ID führt zum zugrunde liegenden Store-Fehler; als Korrekturhinweis (`fix`) wird `openspec config unset defaultStore` genannt.
4. Gibt es keinen nächstgelegenen Stamm und keinen Standardwert, aber registrierte Stores, tritt der Fehler `no_root_with_registered_stores` auf.
5. Gibt es weder einen Stamm noch einen Standardwert oder Stores, können Befehle das aktuelle Arbeitsverzeichnis als `source: "implicit"` verwenden. `doctor`, `context`, `list` und eine gebündelte `validate`-Ausführung schlagen stattdessen mit `no_openspec_root` fehl. `list` behält den impliziten Fallback für ältere Projekte mit `openspec/project.md` bei.

Erfolgreiche JSON-Payloads enthalten normalerweise den Stamm. Eine erfolgreiche Ausgabe von `schemas --json`
bleibt aus Kompatibilitätsgründen absichtlich das in §4.13 dokumentierte Array ohne Hülle:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Vertrag für Stammfehler:** Im JSON-Modus gibt ein Auflösungsfehler `{ ...commandNullShape, "status": [diagnostic] }` auf stdout aus und endet mit Exitcode 1.

## 4. JSON-Strukturen der Befehle

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` – beachten Sie, dass `status` hier pro Änderung ein String-Enum ist. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

`warnings` (wird ausgelassen, wenn leer) meldet Verzeichnisse unter `changes/`, die keine Änderungen sind. Derzeit gibt es nur den Code `nested_change_directory`: einen Namensraumordner, der Änderungsordner enthält. OpenSpec kann einen solchen Ordner nicht adressieren, da eine Änderung immer direkt unter `changes/` liegt. Derselbe Eintrag enthält bei der aufgeführten Änderung `nested`; deren `status` ist dann bedeutungslos. Behandeln Sie diesen Eintrag nicht als Änderung. Melden Sie die Warnung und lassen Sie die Verzeichnisse unverändert.

### 4.2 `show <item> --json`
Änderung: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spezifikation: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Exitcode 1, wenn ein Element fehlschlägt.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` bedeutet, dass jedes nicht übersprungene Planungsartefakt vorhanden ist. Übersprungene Artefakte gelten als erfüllt, ohne erstellt zu werden. Es bedeutet nicht, dass die Implementierungsaufgaben abgeschlossen sind. `isComplete` bleibt als abwärtskompatibler Alias mit demselben Wert erhalten. `requires` jedes Artefakts enthält dessen direkte Abhängigkeits-IDs (bei jedem Status vorhanden, sodass auch dann der transitive Abhängigkeitssatz berechnet werden kann, wenn das Artefakt `done` ist). `missingDeps` erscheint nur bei `blocked`. Das Array `artifacts` ist nach Abhängigkeiten geordnet. Bei Gleichstand gilt die Reihenfolge der Deklarationen unter `artifacts:` im Schema (niemals alphabetisch). Daher ist der erste Eintrag mit Status `ready` das als Nächstes zu schreibende Artefakt; `missingDeps` verwendet dieselbe Reihenfolge. `"skipped"` kennzeichnet ein Artefakt, dessen `generates`-Pfad unter `specs/` liegt und dessen Änderung in `.openspec.yaml` `skip_specs: true` festlegt. Es erfüllt Abhängigkeiten, darf aber nicht erstellt werden. Keine aktiven Änderungen: `{ "changes": [], "message", "root" }`, Exitcode 0.

`--all` (Stapelverarbeitung, nicht mit `--change` kombinierbar – bei gemeinsamer Verwendung tritt ein Fehler mit der Nullstruktur `{ "changes": [], "root": null, "status": [d] }` auf): `{ "changes": [ <per-change status object, no per-change root>, ... ], "root" }`, nach Änderungsnamen sortiert. Eine Änderung, die nicht geladen werden kann, wird an ihrer Stelle durch `{ "changeName", "status": [d] }` dargestellt. Die Verarbeitung wird fortgesetzt, die vollständige Hülle bleibt erhalten und sowohl im Text- als auch im JSON-Modus lautet der Exitcode 1. Ein ungültiges `--schema` lässt den gesamten Aufruf mit der Nullstruktur fehlschlagen, auch wenn keine Änderungen vorhanden sind.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` listet die Artefakte in der Deklarationsreihenfolge des Schemas auf, die dadurch bereit werden (dieselbe Reihenfolge, die `status` empfiehlt). `"skipped": true` (mit `"warning"`) erscheint, wenn die Änderung `skip_specs: true` festlegt und dieses Artefakt übersprungen wird – erstellen Sie seine Dateien nicht. Ein Abhängigkeitseintrag mit `skipped: true` gilt ohne Dateien als erfüllt. Versuchen Sie nicht, seine Pfade zu lesen.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` – aufgelöste Einträge enthalten root/specs/fetch; nicht aufgelöste enthalten store_id und einen Warnstatus. Der Index ist auf 50 KB begrenzt (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` benennt, woran `apply` scheitert (die Werte unter `apply.requires` im Schema). `missingPrerequisites` umfasst alles, was vor dem Start von `apply` noch erstellt werden muss, in Erstellungsreihenfolge – die transitive Hülle dieser Anforderungen, also möglicherweise eine längere Liste. `warnings` führt nicht blockierende Probleme der Änderung auf. Derzeit ist dies eine umsetzungsbereite Änderung ohne Delta-Spezifikationen und ohne `skip_specs: true`, die `openspec validate` zurückweisen würde. Die beiden optionalen Stammfelder (`context`, `operationGuidance`) werden bei jedem Aufruf aus dem ausgewählten Stamm gelesen. `context` ist eine erforderliche Eingabe auf Prompt-Ebene; relevante Projektfakten, Konventionen und Einschränkungen müssen berücksichtigt werden. `operationGuidance` ist eine beratende Eingabe, deren Einträge nur dann befolgt werden, wenn sie anwendbar und mit dem integrierten Workflow vereinbar sind. Beide bleiben getrennt von Status, Aufgaben, Fortschritt, Kontextdateien und der integrierten Anweisung.

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. Erfordert ein gültiges `--change` im aufgelösten Repository- oder Store-Stamm und verwendet dieselbe Semantik für erforderlichen Kontext und optionale Hinweise wie `apply`. Dies ist eine schreibgeschützte Schnittstelle für Laufzeiteingaben: Sie gibt weder den statischen Archivierungs-Workflow zurück noch prüft oder führt Delta-Spezifikationen zusammen, schreibt Hauptspezifikationen oder verschiebt die Änderung.

### 4.8 `new change <name> --json`
Erfolg: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Fehler: `{ "change": null, "status": [d] }`, Exitcode 1.

### 4.9 `archive <name> --json`
Erfolg: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. Fehler: `{ "archive": null, "root"?, "status": [d] }`, Exitcode 1. `specsUpdated` ist nur dann `true`, wenn mindestens eine Spezifikationsdatei geschrieben oder ausgemustert wurde (wird die letzte Anforderung einer Funktion entfernt, wird ihre Spezifikation gelöscht. Dafür muss `retire_capabilities: true` in der `.openspec.yaml` der Änderung stehen. Jede Ausmusterung wird unter `warnings` aufgeführt; ein kopierbarer Git-Wiederherstellungsbefehl erscheint nur, wenn sich die Spezifikation im Checkout des Aufrufers befand). Eine bereits synchronisierte Änderung wird mit ausschließlich Nullwerten archiviert; übersprungene Schritte sind unter `warnings` aufgeführt. Der JSON-Modus ist strikt nicht-interaktiv: Jeder Punkt, an dem eine Rückfrage gestellt würde, wird zu einem Code `archive_*`.

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (nur bei einem Git-basierten Store-Checkout mit Upstream-Tracking-Referenz vorhanden) gibt an, wie viele Commits der zuletzt abgerufene Upstream voraus oder zurück liegt, nicht der aktuelle Remote. Gesundheitsbefunde jeder Schwere führen zu Exitcode 0. Fehler-Payload: `{ "root": null, "store": null, "references": [], "status": [d] }`, Exitcode 1.

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = Pfad vorhanden UND Status leer. `--code-workspace <path>` schreibt `{folders:[{name,path}]}` (nur verfügbare referenzierte Stores, mit Präfixen `ref:`). Im JSON-Modus erfolgt der Schreibvorgang vor der Ausgabe, sodass stdout auch bei einem Schreibfehler genau ein Dokument enthält. Fehler: `{ "root": null, "members": [], "status": [d] }`, Exitcode 1.

### 4.12 `store ... --json`
Einrichten/Registrieren: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Registrierung aufheben/Entfernen: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Auflisten: `{ "stores": [{id, root}], "status": [] }`. Doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = unbekannt/nicht geprüft). Gesundheitsbefunde führen zu Exitcode 0; Fehler zu Exitcode 1 mit der passenden Nullstruktur. Abbruch einer Eingabeaufforderung führt zu Exitcode 130.

### 4.13 `schemas --json` / `templates --json`
`schemas`: Eine erfolgreiche Ausgabe bleibt ein einfaches Array `[ {name, description, artifacts, source} ]`. Der Befehl verwendet die kanonische Prioritätsreihenfolge zur Stammdatenauswahl und akzeptiert `--store <id>`. Fehler bei der Stammdatenauswahl: `{ "schemas": [], "root": null, "status": [d] }`, Exitcode 1. `templates`: ein Objekt mit Schlüsseln `{ "<artifactId>": {path, source} }`, weiterhin anhand des aktuellen Arbeitsverzeichnisses und ohne Schlüssel für Stamm oder Status.

## 5. Exitcode-Vertrag

| Situation | Exitcode | Stdout |
|---|---|---|
| Erfolg, einschließlich Gesundheitsbefunden (doctor/context/store doctor) | 0 | die Payload |
| Befehlsfehler im Modus `--json` | 1 | ein JSON-Dokument mit `status: [d]` und der Nullstruktur des Befehls |
| `validate` mit fehlerhaften Elementen | 1 | vollständiger Bericht |
| Abbruch einer Eingabeaufforderung (Gruppe `store`, menschenlesbarer Modus) | 130 | nur stderr |

## 6. Katalog der Diagnosecodes

### Auflösung
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; unverändert durchgereicht: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Gesundheitszustand des OpenSpec-Stamms (Fehler, keine Behebung)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Während der Store-Beta können `openspec/specs/`, `openspec/changes/` und `openspec/changes/archive/` in einem gesunden Stamm fehlen. Sie gelten nur dann als Gesundheitsfehler, wenn sie vorhanden, aber keine Verzeichnisse sind.

### Store-Registrierung/-Identität/-Zustand
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (Info).

### Store einrichten/registrieren/entfernen
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (Warnung bei remove, Fehler bei doctor), `store_root_not_directory`.

### Store-Git
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (Warnung), `store_clone_fragile_directories` (Warnung), `store_remote_divergence` (Info, Doctor), `store_checkout_drift` (Info, Doctor).

### Referenzen (Warnung)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Beziehungen (Warnung; Doctor; Context behält nur den Registrierungsfehler bei)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archivierung (JSON-Modus)
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Context-Schreibvorgänge
`context_file_exists`, `context_output_dir_missing`.

### Rückfallcodes
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Bekannte Inkonsistenzen

Bei der abschließenden Prüfung erfasst; Umbenennungen veröffentlichter Schlüssel sind Produktentscheidungen, die auf eine spätere Version verschoben wurden:

1. ~~Im Modus `--json` gaben mehrere Fehlerpfade nur stderr aus und lieferten kein JSON-Dokument.~~ In der abschließenden Prüfrunde behoben: Unbekannte und mehrdeutige Elemente bei `show`/`validate` geben `{status:[{code: unknown_item | ambiguous_item, ...}]}` aus. Ausgelöste Fehler in `status`/`instructions`/`list`/`show`/`validate` verwenden den JSON-fähigen Fehlerhelfer (Nullstruktur des Befehls plus `status`). `store <unknown subcommand> --json` gibt `{status:[{code: unknown_store_subcommand}]}` aus. Bei Auflösungsfehlern enthält `list` seine Nullstruktur `{changes|specs: [], root: null}`.
2. `store_root_missing` wird mit zwei Schweregraden ausgegeben (Warnung bei remove, Fehler bei Store-Doctor) – abhängig vom Kontext, wie oben beschrieben.
3. Die Schreibweise der Schlüssel wechselt zwischen `snake_case` (Store-Familie) und `camelCase` (Workflow-Familie); `root.store_id` verwendet immer `snake_case`.
4. In `src` gibt es vier parallele Deklarationen von Hülltypen; Archivdiagnosen enthalten niemals `target`.
5. `list --json` verwendet den Schlüssel `status` pro Änderung erneut als String-Enum.
6. Nur die Ausgabe von `validate` enthält ein Feld `version`.
7. `templates` ignoriert die Stammdatenauswahl (basiert auf cwd, kein `--store`).
8. Veraltete Substantivformen von Befehlen (`change`-/`spec`-Unterbefehle) geben Payloads ohne Hülle und ohne `root`/`status` aus.
