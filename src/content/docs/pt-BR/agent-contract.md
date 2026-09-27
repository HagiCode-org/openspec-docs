---
title: "Contrato de agente do OpenSpec"
---

Superfícies legíveis por máquina da CLI `openspec`, verificadas em `src/` (auditoria final, 11/06/2026). Cada estrutura abaixo está documentada com base no código que a emite.

## 1. Convenções gerais

- **Um documento JSON por invocação.** No modo `--json`, stdout contém exatamente um documento JSON (formatado com recuo de 2 espaços). O texto destinado a pessoas, os indicadores de progresso e o banner da store são enviados para stderr.
- **Banner da store.** No modo legível por pessoas, quando a raiz é selecionada por uma store, `Using OpenSpec root: <id> (<path>)` é enviado para stderr. Ele nunca é exibido no modo JSON.
- **O uso de maiúsculas e minúsculas nas chaves depende da superfície** (consulte Inconsistências conhecidas): os payloads de store/doctor/context usam `snake_case`; os payloads do fluxo de trabalho (`status`, `instructions`, `new change`, `validate`, `list`) usam `camelCase`, com exceção do objeto `root` incorporado, que sempre usa `store_id`.
- **Na maioria dos payloads, chaves opcionais são omitidas, não recebem `null`** (por exemplo, `root.store_id`, `member.path`). As exceções que usam `null` explícito são indicadas em cada estrutura ( `git.*` do store doctor e payloads de falha).

## 2. Envelope de diagnóstico

Todos os diagnósticos legíveis por máquina (`StoreDiagnostic`) compartilham o mesmo formato de envelope:

```json
{
  "severity": "error" | "warning" | "info",
  "code": "snake_case_string",
  "message": "human sentence",
  "target": "dotted.surface (optional)",
  "fix": "one actionable sentence/command (optional)"
}
```

Os diagnósticos aparecem em dois lugares: **arrays `status`** (`status: StoreDiagnostic[]` no nível superior ou em cada item) para indicar problemas de integridade; e **erros lançados**, convertidos em um array `status` com um único elemento quando um comando falha.

## 3. Seleção da raiz e `RootOutput`

Todos os comandos que resolvem a raiz (`list`, `show`, `validate`, `status`, `instructions`, `instructions apply`, `instructions archive`, `new change`, `archive`, `doctor`, `context`, `schemas`) resolvem uma única raiz do OpenSpec, seguindo esta ordem de precedência:

1. `--store <id>` → a raiz da store registrada (`source: "store"`).
2. Caso contrário, o ancestral mais próximo que contém `openspec/`: estrutura de planejamento → `source: "nearest"` (um ponteiro `store:` é ignorado, com um aviso em stderr); diretório somente de configuração com um ponteiro `store:` válido → a store indicada, `source: "declared"`.
3. Sem raiz próxima e com `defaultStore` global definido (`openspec config set defaultStore <id>`) → essa store, `source: "global_default"`; um ID obsoleto falha com o erro correspondente da store e um `fix` que indica `openspec config unset defaultStore`.
4. Sem raiz próxima, sem padrão e com stores registradas → erro `no_root_with_registered_stores`.
5. Sem raiz, padrão ou stores: os comandos podem tratar o diretório de trabalho atual como `source: "implicit"`; já `doctor`, `context`, `list` e `validate` em lote falham com `no_openspec_root`. `list` mantém a alternativa implícita para projetos legados com `openspec/project.md`.

Os payloads JSON bem-sucedidos normalmente incluem a raiz. Por compatibilidade, `schemas --json` continua deliberadamente sendo o array simples descrito na seção 4.13:

```json
"root": { "path": "/abs/path", "source": "store" | "declared" | "global_default" | "nearest" | "implicit", "store_id": "id (only when store-selected)" }
```

**Contrato de falha na resolução da raiz**: no modo JSON, uma falha de resolução imprime `{ ...commandNullShape, "status": [diagnostic] }` em stdout e termina com código 1.

## 4. Estruturas JSON dos comandos

### 4.1 `list --json`
`{ "changes": [ { "name", "completedTasks", "totalTasks", "lastModified", "status": "no-tasks"|"complete"|"in-progress", "nested"?: ["<area>/<name>", ...] } ], "warnings"?: [ { "code", "name", "nested", "message" } ], "root": RootOutput }` — observe que, neste caso, `status` por mudança é uma enumeração de texto. `--specs`: `{ "specs": [ { "id", "requirementCount" } ], "root" }`.

`warnings` (omitido quando vazio) informa sobre diretórios em `changes/` que não são mudanças. No momento, o único código é `nested_change_directory`: uma pasta de namespace que contém diretórios de mudanças, os quais o OpenSpec não consegue endereçar porque uma mudança precisa ser um diretório diretamente dentro de `changes/`. O mesmo item inclui `nested` na mudança listada; nesse caso, o campo `status` não tem significado. Não trate esse item como uma mudança: informe a mensagem e não altere os diretórios.

### 4.2 `show <item> --json`
Mudança: `{ "id", "title", "deltaCount", "deltas": [...], "root" }`. Especificação: `{ "id", "title", "overview", "requirementCount", "requirements": [...], "metadata": { "version", "format", "sourcePath"? }, "root" }`.

### 4.3 `validate --json`
`{ "items": [ { "id", "type": "change"|"spec", "valid", "issues": [ { "level", "path", "message", "line"?, "column"? } ], "durationMs" } ], "summary": { "totals": {items,passed,failed}, "byType": {...} }, "version": "1.0", "root" }`. Termina com código 1 se algum item falhar.

### 4.4 `status --json`
`{ "changeName", "schemaName", "planningHome"?: { "kind", "root", "changesDir", "defaultSchema" }, "changeRoot", "artifactPaths": { "<id>": {outputPath, resolvedOutputPath, existingOutputPaths} }, "nextSteps": ["..."], "actionContext": { "mode": "repo-local", "sourceOfTruth": "repo", "planningArtifacts", "linkedContext", "allowedEditRoots", "requiresAffectedAreaSelection", "constraints" }, "isPlanningComplete", "isComplete", "applyRequires", "artifacts": [ {id, outputPath, status: "done"|"skipped"|"ready"|"blocked", requires, missingDeps?} ], "root" }`. `isPlanningComplete` significa que todos os artefatos de planejamento não ignorados existem; artefatos ignorados contam como concluídos sem serem criados. Isso não significa que as tarefas de implementação estejam concluídas. `isComplete` é mantido como alias de compatibilidade com o mesmo valor. O campo `requires` de cada artefato contém os IDs de suas dependências diretas (presente em todos os status, permite calcular o conjunto transitivo de dependências mesmo quando o artefato está `done`); `missingDeps` só aparece quando o status é `blocked`. O array `artifacts` segue a ordem das dependências. Em caso de empate entre artefatos que ficam prontos ao mesmo tempo, prevalece a ordem declarada em `artifacts:` no schema (nunca a ordem alfabética); assim, o primeiro item `ready` é o próximo artefato a escrever. `missingDeps` segue essa mesma ordem. `"skipped"` indica um artefato cujo caminho `generates` fica em `specs/` em uma mudança cujo `.openspec.yaml` declara `skip_specs: true`; ele satisfaz as dependências, mas não deve ser criado. Sem mudanças ativas: `{ "changes": [], "message", "root" }`, código de saída 0.

`--all` (lote, incompatível com `--change` — combiná-los gera um erro com a estrutura nula `{ "changes": [], "root": null, "status": [d] }`): `{ "changes": [ <objeto de status por mudança, sem root por mudança>, ... ], "root" }`, em ordem alfabética pelo nome da mudança. Uma mudança que não puder ser carregada contribui com `{ "changeName", "status": [d] }` na posição correspondente; a varredura continua, preserva o envelope completo e termina com código 1, tanto no modo de texto quanto no modo JSON. Um `--schema` inválido faz toda a invocação falhar com a estrutura nula, mesmo quando não há mudanças.

### 4.5 `instructions <artifact> --json`
`{ "changeName", "artifactId", "schemaName", "changeDir", "planningHome"?, "outputPath", "resolvedOutputPath", "existingOutputPaths", "description", "instruction"?, "context"?, "rules"?, "references"?: ReferenceIndexEntry[], "skipped"?, "warning"?, "template", "dependencies": [{id,done,path,description,skipped?}], "unlocks", "root" }`. `unlocks` lista os artefatos que ficam prontos após este, na ordem declarada no schema (a mesma ordem recomendada por `status`). `"skipped": true` (com `"warning"`) aparece quando a mudança declara `skip_specs: true` e este artefato é ignorado — não crie os arquivos correspondentes. Uma dependência com `skipped: true` é satisfeita sem arquivos — não tente ler os caminhos dela.

`ReferenceIndexEntry`: `{ "store_id", "root"?, "specs"?: [{id,summary}], "fetch"?, "status": [] }` — itens resolvidos incluem root/specs/fetch; os não resolvidos incluem store_id e o status de aviso. O índice tem limite de 50 KB (`reference_index_truncated`).

### 4.6 `instructions apply --json`
`{ "changeName", "changeDir", "schemaName", "contextFiles": { "<artifactId>": ["/abs", ...] }, "progress": {total,complete,remaining}, "tasks": [{id,description,done}], "state": "blocked"|"all_done"|"ready", "missingArtifacts"?, "missingPrerequisites"?, "warnings"?, "instruction", "references"?, "context"?, "operationGuidance"?, "root" }`. `missingArtifacts` contém os itens que impedem `apply` de prosseguir (`apply.requires` do schema); `missingPrerequisites` contém tudo que ainda precisa ser criado antes da execução de `apply`, em ordem de criação — o fechamento transitivo desses requisitos, que pode formar uma lista mais longa. `warnings` lista problemas não bloqueantes da própria mudança — atualmente, uma mudança pronta para implementação sem especificações delta e sem `skip_specs: true`, situação rejeitada por `openspec validate`. Os dois campos opcionais da raiz (`context`, `operationGuidance`) são lidos da raiz selecionada a cada invocação. `context` é uma entrada obrigatória do prompt; os fatos relevantes, as convenções e as restrições do projeto precisam ser aplicados. `operationGuidance` é uma entrada consultiva, cujas orientações só devem ser seguidas quando forem aplicáveis e compatíveis com o fluxo de trabalho integrado. Ambos permanecem separados do estado, das tarefas, do progresso, dos arquivos de contexto e da instrução integrada.

### 4.7 `instructions archive --json`
`{ "changeName", "context"?, "operationGuidance"?, "root" }`. Requer um `--change` válido na raiz resolvida do repositório/da store e usa a mesma semântica de contexto obrigatório e orientações consultivas de `apply`. Esta é uma superfície de entrada de execução somente para leitura: não retorna o fluxo estático de arquivamento, não inspeciona nem mescla especificações delta, não grava especificações principais e não move a mudança.

### 4.8 `new change <name> --json`
Sucesso: `{ "change": { "id", "path", "metadataPath", "schema" }, "root" }`. Falha: `{ "change": null, "status": [d] }`, código de saída 1.

### 4.9 `archive <name> --json`
Sucesso: `{ "archive": { "change", "archivedAs": "YYYY-MM-DD-name", "path", "specsUpdated", "totals"?, "warnings"? }, "root" }`. Falha: `{ "archive": null, "root"?, "status": [d] }`, código de saída 1. `specsUpdated` é `true` somente quando pelo menos um arquivo de especificação foi gravado ou retirado (a especificação de uma capacidade cuja última exigência foi removida pela mudança é excluída; isso requer `retire_capabilities: true` no `.openspec.yaml` da mudança; cada retirada é listada em `warnings`, com um comando Git recuperável para copiar e colar apenas quando a especificação estava no checkout de quem chamou); uma mudança já sincronizada é arquivada com totais zerados e as ações ignoradas listadas em `warnings`. O modo JSON é estritamente não interativo: cada ponto de confirmação gera um código `archive_*`.

### 4.10 `doctor --json`
`{ "root": { "path", "source", "store_id"?, "healthy", "status": [] }, "store": { "id", "metadata": {present,valid,remote?}, "origin_url"?, "drift"?: {ahead,behind}, "status": [] } | null, "references": [...], "status": [] }`. `drift` (presente somente em um checkout de store gerenciado pelo Git que tenha uma referência de rastreamento upstream) contém as contagens de commits à frente/atrás em relação à última atualização do upstream, não ao remoto ativo. Problemas de integridade de qualquer gravidade terminam com código 0. Payload de falha: `{ "root": null, "store": null, "references": [], "status": [d] }`, código de saída 1.

### 4.11 `context --json`
`{ "root": { "path", "source", "store_id"?, "role": "openspec_root" }, "members": [ { "role": "referenced_store", "id", "path"?, "remote"?, "fetch"?, "status": [] } ], "status": [] }`. AVAILABLE = caminho presente E `status` vazio. `--code-workspace <path>` grava `{folders:[{name,path}]}` (somente stores referenciadas disponíveis, com prefixo `ref:`); no modo JSON, a gravação ocorre antes da impressão, portanto stdout contém exatamente um documento mesmo se a gravação falhar. Falha: `{ "root": null, "members": [], "status": [d] }`, código de saída 1.

### 4.12 `store ... --json`
setup/register: `{ "store": {id, root, metadata_path?}, "registry": {path, registered, already_registered}, "git": {is_repository, initialized, committed}, "created_files": [], "status": [] }`. unregister/remove: `{ "store", "registry": {path, removed}, "files": {deleted, deleted_path, left_on_disk}, "status": [] }`. list: `{ "stores": [{id, root}], "status": [] }`. doctor: `{ "stores": [ { id, root, metadata_path?, openspec_root: {...healthy, status}, metadata: {present, valid, id?, remote}, git: {is_repository, has_commits, has_uncommitted_changes, has_remote, origin_url}, status } ], "status": [] }` (`null` = desconhecido/não verificado). Problemas de integridade terminam com código 0; falhas terminam com código 1 e a estrutura nula correspondente. O cancelamento de um prompt termina com código 130.

### 4.13 `schemas --json` / `templates --json`
`schemas`: em caso de sucesso, continua retornando um array simples `[ {name, description, artifacts, source} ]`; resolve a precedência canônica de seleção da raiz e aceita `--store <id>`. Falha na seleção da raiz: `{ "schemas": [], "root": null, "status": [d] }`, código de saída 1. `templates`: objeto indexado por chave `{ "<artifactId>": {path, source} }`, ainda baseado no diretório de trabalho atual, sem chaves `root`/`status`.

## 5. Contrato dos códigos de saída

| Situação | Saída | Stdout |
|---|---|---|
| Sucesso, inclusive problemas de integridade (`doctor`/`context`/`store doctor`) | 0 | o payload |
| Falha de comando no modo `--json` | 1 | um documento JSON com `status: [d]` e a estrutura nula do comando |
| `validate` com itens inválidos | 1 | relatório completo |
| Cancelamento de prompt (grupo `store`, modo legível por pessoas) | 130 | somente stderr |

## 6. Catálogo de códigos de diagnóstico

### Resolução
`no_openspec_root`, `no_root_with_registered_stores`, `no_registered_stores`, `unknown_store`, `store_identity_mismatch`, `unhealthy_store_root`, `store_path_not_supported`, `invalid_store_pointer`, `initiative_option_removed`, `areas_option_removed`; pass-through: `invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`.

### Integridade da raiz do OpenSpec (erro, sem correção)
`openspec_store_root_missing`, `openspec_store_root_not_directory`, `openspec_root_missing`, `openspec_root_not_directory`, `openspec_config_missing`, `openspec_config_not_file`, `openspec_specs_not_directory`, `openspec_changes_not_directory`, `openspec_archive_not_directory`. Durante a versão beta das stores, `openspec/specs/`, `openspec/changes/` e `openspec/changes/archive/` podem não existir em uma raiz íntegra; só são problemas de integridade quando existem, mas não são diretórios.

### Registro, identidade e estado da store
`invalid_store_id`, `invalid_store_registry`, `invalid_store_metadata`, `store_registry_busy`, `store_not_found`, `no_store_registry`, `store_registry_changed`, `store_metadata_missing`, `store_metadata_id_mismatch`, `store_metadata_invalid`, `store_id_conflict`, `store_path_conflict`, `store_already_registered` (info).

### Configuração, registro e remoção da store
`store_setup_id_required`, `store_setup_path_required`, `store_setup_path_not_directory`, `store_setup_inside_git_repo`, `store_setup_non_empty_directory`, `store_setup_cancelled`, `store_path_required`, `store_path_missing`, `store_path_not_directory`, `store_root_pointer_declared`, `store_register_root_unhealthy`, `store_register_identity_confirmation_required`, `store_register_cancelled`, `store_remote_empty`, `store_remote_requires_hand_edit`, `store_remove_confirmation_required`, `store_remove_cancelled`, `store_remove_path_not_directory`, `store_remove_metadata_missing`, `store_remove_contains_registered_store`, `store_root_missing` (warning in remove, error in doctor), `store_root_not_directory`.

### Git da store
`store_git_init_failed`, `store_git_identity_missing`, `store_git_commit_failed`, `store_git_no_commits` (warning), `store_clone_fragile_directories` (warning), `store_remote_divergence` (info, doctor), `store_checkout_drift` (info, doctor).

### Referências (aviso)
`reference_invalid_id`, `reference_registry_unreadable`, `reference_unresolved`, `reference_root_unhealthy`, `reference_index_truncated`.

### Relações (aviso; `doctor`; `context` mantém apenas o diagnóstico do registro)
`relationship_registry_unreadable`, `root_pointer_ignored`, `root_pointer_invalid`, `pointer_declarations_inert`.

### Arquivamento (modo JSON)
`archive_change_name_required`, `archive_change_not_found`, `archive_change_symlink`, `archive_validation_failed`, `archive_confirmation_required`, `archive_tasks_incomplete`, `archive_spec_update_failed`, `archive_spec_validation_failed`, `archive_target_exists`, `archive_error`.

### Gravação do contexto
`context_file_exists`, `context_output_dir_missing`.

### Alternativas
`doctor_failed`, `context_failed`, `store_error`, `change_error`, `archive_error`.

## Inconsistências conhecidas

Registradas pela auditoria final; a renomeação de chaves publicadas é uma decisão de produto adiada para uma versão futura:

1. ~~No modo `--json`, alguns caminhos de falha exibiam apenas stderr, sem documento JSON.~~ Corrigido na rodada final de testes: itens desconhecidos ou ambíguos em `show`/`validate` emitem `{status:[{code: unknown_item | ambiguous_item, ...}]}`; erros lançados em `status`/`instructions`/`list`/`show`/`validate` passam pelo auxiliar de falhas compatível com JSON (estrutura nula do comando + `status`); `store <subcomando desconhecido> --json` emite `{status:[{code: unknown_store_subcommand}]}`; em falhas de resolução, `list` inclui a estrutura nula `{changes|specs: [], root: null}`.
2. `store_root_missing` é emitido com duas gravidades (aviso em `remove`, erro em `store doctor`), dependendo do contexto; consulte acima.
3. As chaves usam `snake_case` (família `store`) e `camelCase` (família de fluxo de trabalho); `root.store_id` usa `snake_case` em todos os casos.
4. Há quatro declarações paralelas do tipo de envelope em `src`; diagnósticos de arquivamento nunca incluem `target`.
5. `list --json` reutiliza a chave `status` como enumeração de texto para cada mudança.
6. Somente a saída de `validate` inclui o campo `version`.
7. `templates` ignora a seleção da raiz (baseia-se no diretório de trabalho atual e não aceita `--store`).
8. As formas nominais obsoletas (subcomandos `change`/`spec`) emitem payloads sem envelope e sem `root`/`status`.
