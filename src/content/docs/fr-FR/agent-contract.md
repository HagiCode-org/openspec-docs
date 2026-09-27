---
title: "Contrat de l'agent OpenSpec"
---

Surfaces lisibles par machine de la CLI `openspec`, vérifiées à partir de `src/` (audit final, 2026-06-11). Chaque forme ci-dessous est documentée à partir du code qui la produit.

## 1. Conventions générales

- **Un document JSON par exécution.** En mode `--json`, stdout contient exactement un document JSON (indentation de deux espaces). Le texte destiné aux personnes, les spinners et la bannière du store sont envoyés à stderr.
- **Bannière du store.** En mode humain, une racine sélectionnée depuis un store affiche `Using OpenSpec root: <id> (<path>)` sur stderr. Elle n'est jamais affichée en mode JSON.
- **La casse des clés dépend de la surface** (voir « Incohérences connues ») : les charges utiles store/doctor/context utilisent `snake_case` ; celles des workflows (`status`, `instructions`, `new change`, `validate`, `list`) utilisent `camelCase`, sauf l'objet `root` intégré, qui utilise toujours `store_id`.
- **Les clés facultatives sont omises, pas définies à `null**, dans la plupart des charges utiles (par ex. `root.store_id`, `member.path`). Les exceptions qui utilisent explicitement `null` sont indiquées pour chaque forme (`git.*` de store doctor et charges utiles d'échec).

## 2. Enveloppe de diagnostic

La même enveloppe est partagée par tous les diagnostics lisibles par machine (`StoreDiagnostic`) :

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Les diagnostics apparaissent à deux endroits : dans des **tableaux de statut** (`status: StoreDiagnostic[]` au niveau supérieur ou par entrée) pour les problèmes de santé, ou sous forme d'**erreurs levées**, converties en un tableau `status` à un seul élément lorsque la commande échoue.

## 3. Sélection de la racine et `RootOutput`

Toutes les commandes qui résolvent une racine (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas`) utilisent une seule racine OpenSpec selon cet ordre de priorité :

1. `--store <id>` → racine du store enregistré (`source: "store"`).
2. Sinon, ancêtre le plus proche contenant `openspec/` : structure de planification → `source: "nearest"` (un pointeur `store:` est ignoré, avec avertissement sur stderr) ; répertoire contenant uniquement une configuration et un pointeur `store:` valide → store correspondant, `source: "declared"`.
3. Aucune racine proche, mais `defaultStore` global défini (`openspec config set defaultStore <id>`) → ce store, `source: "global_default"`. Un identifiant obsolète échoue avec l'erreur du store sous-jacent et un `fix` indiquant `openspec config unset defaultStore`.
4. Aucune racine, aucune valeur par défaut, mais des stores enregistrés → erreur `no_root_with_registered_stores`.
5. Aucune racine, aucune valeur par défaut, aucun store : les commandes peuvent considérer le répertoire de travail courant comme `source: "implicit"`. `doctor`, `context`, `list` et la validation groupée échouent plutôt avec `no_openspec_root`. `list` conserve le repli implicite pour les anciens projets contenant `openspec/project.md`.

Les charges utiles JSON réussies incluent généralement la racine. En revanche, `schemas --json` conserve délibérément le tableau brut documenté à la section 4.13, par souci de compatibilité :

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrat d'échec de résolution :** en mode JSON, un échec de résolution affiche `{ ...commandNullShape, "status": [diagnostic] }` sur stdout et quitte avec le code 1.

## 4. Formes JSON des commandes

### 4.1 `list --json`

`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — noter que `status` de chaque changement est ici une valeur d'énumération de type chaîne. `--specs` : `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

La clé `warnings` (omise si vide) signale les répertoires sous `changes/` qui ne sont pas des changements. Actuellement, le seul code est `nested_change_directory` : un dossier d'espace de noms contenant des dossiers de changement, qu'OpenSpec ne peut pas cibler puisqu'un changement doit se trouver directement sous `changes/`. La même entrée affiche `nested` sur le changement listé ; son `status` n'a alors aucun sens. Ne traitez pas cette entrée comme un changement : signalez le message et ne touchez pas aux dossiers.

### 4.2 `show <item> --json`

Changement : `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Spécification : `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`

`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. La commande quitte avec le code 1 si un élément échoue.

### 4.4 `status --json`

`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` signifie que chaque artefact de planification non ignoré existe ; un artefact ignoré est considéré comme satisfait sans avoir été créé. Cela ne signifie pas que les tâches d'implémentation sont terminées. `isComplete` est conservé comme alias de compatibilité ayant la même valeur. `requires` de chaque artefact indique ses dépendances directes (présentes quel que soit son statut ; l'ensemble transitif des dépendances nécessaires peut donc être calculé même si l'artefact est `done`) ; `missingDeps` n'est présent que lorsque l'état est `blocked`. Le tableau `artifacts` suit l'ordre des dépendances ; en cas d'égalité entre artefacts prêts en même temps, l'ordre de déclaration `artifacts:` du schéma prime (jamais l'ordre alphabétique). Le premier élément `ready` est donc celui à rédiger ensuite ; `missingDeps` suit le même ordre. `"skipped"` désigne un artefact dont le chemin `generates` se trouve sous `specs/` dans un changement dont `.openspec.yaml` déclare `skip_specs: true` : ses dépendances sont satisfaites, mais il ne faut pas le créer. Lorsqu'il n'y a aucun changement actif : `{ "changes": [], "message", "root" }`, code de sortie 0.

`--all` (traitement groupé, incompatible avec `--change` : les combiner est une erreur avec la forme nulle `{ "changes": [], "root": null, "status": [d] }`) : `{ "changes": [ <objet status du changement, sans root par changement>, ... ], "root" }`, triés par nom de changement. Si le chargement d'un changement échoue, l'entrée `{ "changeName", "status": [d] }` est ajoutée à sa place ; le traitement continue, conserve l'enveloppe complète et quitte avec le code 1 en mode texte comme en mode JSON. Un `--schema` invalide fait échouer toute l'exécution avec la forme nulle, même s'il n'y a aucun changement.

### 4.5 `instructions <artifact> --json`

`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` énumère, dans l'ordre déclaré par le schéma (identique à celui recommandé par `status`), les artefacts que celui-ci rend prêts. `"skipped": true` (avec `"warning"`) apparaît quand le changement déclare `skip_specs: true` et que cet artefact est ignoré : ne créez pas ses fichiers. Une dépendance indiquant `skipped: true` est satisfaite sans fichiers ; n'essayez pas de lire les chemins correspondants.

`ReferenceIndexEntry` : `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — les entrées résolues contiennent `root`/`specs`/`fetch` ; les entrées non résolues contiennent `store_id` et le statut d'avertissement. L'index est limité à 50 Ko (`reference_index_truncated`).

### 4.6 `instructions apply --json`

`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` liste les artefacts qui bloquent `apply` (ceux de `apply.requires` du schéma) ; `missingPrerequisites` énumère tous les éléments restant à créer avant l'exécution de `apply`, dans l'ordre de construction : il s'agit de la fermeture transitive des dépendances et la liste peut donc être plus longue. `warnings` signale les problèmes non bloquants du changement lui-même — actuellement, un changement prêt à être implémenté sans spécification différentielle ni `skip_specs: true`, état que `openspec validate` rejette. Les deux champs facultatifs `context` et `operationGuidance` sont relus à chaque invocation depuis la racine sélectionnée. `context` est une entrée obligatoire au niveau du prompt ; les informations, conventions et contraintes pertinentes du projet doivent être respectées. `operationGuidance` est une entrée consultative dont les éléments ne sont suivis que s'ils sont applicables et compatibles avec le workflow intégré. Ces deux champs restent distincts de l'état, des tâches, de la progression, des fichiers de contexte et des instructions intégrées.

### 4.7 `instructions archive --json`

`{ "changeName", "context"?, "operationGuidance"?, "root" }`. Nécessite un `--change` valide dans la racine du dépôt/store résolue et utilise la même sémantique de contexte obligatoire et de consignes consultatives que `apply`. Il s'agit d'une surface d'entrée d'exécution en lecture seule : elle ne renvoie pas le workflow d'archivage statique, n'examine ni ne fusionne les spécifications différentielles, n'écrit pas dans les spécifications principales et ne déplace pas le changement.

### 4.8 `new change <name> --json`

Réussite : `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Échec : `{ "change": null, "status": [d] }`, code de sortie 1.

### 4.9 `archive <name> --json`

Réussite : `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. Échec : `{ "archive": null, "root"?, "status": [d] }`, code de sortie 1. `specsUpdated` n'est vrai que si au moins un fichier de spécification a été écrit ou retiré (si le changement supprime la dernière exigence d'une fonctionnalité, sa spécification est supprimée ; `retire_capabilities: true` doit alors figurer dans le `.openspec.yaml` du changement. Chaque retrait est signalé dans `warnings`, avec une commande Git de restauration prête à coller uniquement si la spécification se trouvait dans le checkout appelant). Un changement déjà synchronisé est archivé avec des totaux nuls et les éléments ignorés indiqués dans `warnings`. Le mode JSON est strictement non interactif : chaque demande de confirmation produit un code `archive_*`.

### 4.10 `doctor --json`

`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (présent uniquement pour un checkout de store Git dont la branche suit une référence amont) indique le nombre de commits en avance ou en retard sur la dernière version amont récupérée, et non sur le dépôt distant en direct. Quel que soit le niveau des problèmes de santé, le code de sortie est 0. Charge utile d'échec : `{ "root": null, "store": null, "references": [], "status": [d] }`, code de sortie 1.

### 4.11 `context --json`

`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. Un élément est AVAILABLE si son chemin est présent et que son statut est vide. `--code-workspace <path>` écrit `{folders:[{name,path}]}` (uniquement les stores référencés disponibles, préfixe `ref:`) ; en mode JSON, l'écriture a lieu avant l'affichage afin que stdout contienne exactement un document, même en cas d'échec d'écriture. Échec : `{ "root": null, "members": [], "status": [d] }`, code de sortie 1.

### 4.12 `store ... --json`

configuration/enregistrement : `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. Désenregistrement/suppression : `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. Liste : `{ "stores": [{id, root}], "status": [] }`. Doctor : `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` signifie inconnu/non vérifié). Les problèmes de santé n'empêchent pas une sortie 0 ; les échecs produisent une sortie 1 avec la forme nulle correspondante. L'annulation d'une invite produit le code 130.

### 4.13 `schemas --json` / `templates --json`

`schemas` : en cas de réussite, conserve un tableau brut `[ {name, description, artifacts, source} ]`. La commande respecte l'ordre canonique de sélection de racine et accepte `--store <id>`. Échec de sélection de racine : `{ "schemas": [], "root": null, "status": [d] }`, code de sortie 1. `templates` : objet indexé `{ "<artifactId>": {path, source} }`, toujours basé sur le répertoire courant et sans clé `root` ni `status`.

## 5. Contrat des codes de sortie

| Situation | Code de sortie | Stdout |
|-----------|----------------|--------|
| Réussite, y compris les problèmes de santé (`doctor`/`context`/`store doctor`) | 0 | la charge utile |
| Échec d'une commande en mode `--json` | 1 | un document JSON avec `status: [d]` et la forme nulle de la commande |
| Éléments en échec avec `validate` | 1 | rapport complet |
| Annulation d'une invite (groupe `store`, mode humain) | 130 | stderr uniquement |

## 6. Catalogue des codes de diagnostic

### Résolution

`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed` ; propagation : `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Santé de la racine OpenSpec (erreur, sans correction proposée)

`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Pendant la bêta des stores, `openspec/specs/`, `openspec/changes/` et `openspec/changes/archive/` peuvent être absents d'une racine saine ; ils ne constituent une erreur de santé que s'ils existent mais ne sont pas des répertoires.

### Registre, identité et état des stores

`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuration/enregistrement/suppression d'un store

`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (avertissement lors de la suppression, erreur dans doctor), `store_root_not_directory`.

### Git du store

`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (avertissement), `store_clone_fragile_directories` (avertissement), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Références (avertissement)

`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relations (avertissement ; doctor ; context ne conserve que celui du registre)

`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Archive (mode JSON)

`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Écriture du contexte

`context_file_exists`, `context_output_dir_missing`.

### Replis

`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Incohérences connues

Recensées lors de l'audit final ; les renommages de clés publiées, qui relèvent de décisions produit, sont reportés après cette version :

1. ~~En mode `--json`, certains chemins d'échec n'affichaient que stderr, sans document JSON.~~ Corrigé lors de la campagne de tests finale : `show`/`validate` pour les éléments inconnus ou ambigus émettent `{status:[{code: unknown_item | ambiguous_item, ...}]}` ; les erreurs levées dans `status`/`instructions`/`list`/`show`/`validate` utilisent l'aide à l'échec compatible JSON (forme nulle de la commande + `status`) ; `store <unknown subcommand> --json` émet `{status:[{code: unknown_store_subcommand}]}` ; `list` conserve sa forme nulle `{changes|specs: [], root: null}` en cas d'échec de résolution.
2. `store_root_missing` est émis avec deux niveaux de gravité (avertissement lors de la suppression, erreur dans store doctor) — le sens dépend du contexte, comme indiqué plus haut.
3. Les clés utilisent `snake_case` dans la famille store et `camelCase` dans la famille workflow ; `root.store_id` reste en `snake_case` partout.
4. Le code source contient quatre déclarations parallèles du type d'enveloppe ; les diagnostics d'archive ne contiennent jamais `target`.
5. `list --json` réutilise la clé `status` comme valeur d'énumération sous forme de chaîne pour chaque changement.
6. Seule la sortie de `validate` contient un champ `version`.
7. `templates` ignore la sélection de racine (basée sur le répertoire courant, sans `--store`).
8. Les anciennes formes nominales (sous-commandes `change`/`spec`) émettent des charges utiles sans enveloppe, ni `root` ni `status`.
