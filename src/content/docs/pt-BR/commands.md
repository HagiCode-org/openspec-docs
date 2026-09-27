---
title: "Comandos"
---

Esta é a referência dos comandos de barra do OpenSpec. Eles são invocados na
interface de conversa do seu assistente de programação com IA (por exemplo,
Claude Code, Cursor ou Devin Desktop).

Para conhecer padrões de fluxo de trabalho e quando usar cada comando, consulte
[Fluxos de trabalho](/pt-BR/workflows/). Para os comandos da CLI, consulte
[CLI](/pt-BR/cli/).

Estas páginas usam `/opsx:<command>` como nome canônico. Algumas ferramentas
usam outra grafia — Cursor e GitHub Copilot registram `/opsx-propose`, enquanto
Codex usa `$openspec-propose` — portanto, consulte [Como invocar](/pt-BR/supported-tools/#como-invocar)
para encontrar a sintaxe da sua ferramenta. Os arquivos gerados pelo OpenSpec
já usam o formato correto.

## Referência rápida

### Caminho rápido padrão (perfil `core`)

| Comando | Finalidade |
|---------|---------|
| `/opsx:propose` | Criar uma mudança e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Refletir sobre ideias antes de se comprometer com uma mudança |
| `/opsx:apply` | Implementar as tarefas da mudança |
| `/opsx:update` | Revisar e manter coerentes os artefatos de planejamento de uma mudança |
| `/opsx:sync` | Mesclar especificações delta às principais |
| `/opsx:archive` | Arquivar uma mudança concluída |

### Comandos de fluxo de trabalho expandido (seleção personalizada)

| Comando | Finalidade |
|---------|---------|
| `/opsx:new` | Iniciar a estrutura de uma nova mudança |
| `/opsx:continue` | Criar o próximo artefato com base nas dependências |
| `/opsx:ff` | Avançar rapidamente: criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde aos artefatos |
| `/opsx:bulk-archive` | Arquivar várias mudanças de uma vez |
| `/opsx:onboard` | Tutorial guiado de todo o fluxo de trabalho |

O perfil global padrão é `core`. Para habilitar os comandos de fluxo de
trabalho expandido, execute `openspec config profile`, selecione os fluxos e
depois execute `openspec update` no projeto.

---

## Referência dos comandos

### `/opsx:propose`

Crie uma nova mudança e gere os artefatos de planejamento em uma etapa. Este é
o comando inicial padrão no perfil `core`.

**Sintaxe:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name-or-description` | Não | Nome em kebab-case ou descrição da mudança em linguagem simples |

**O que faz:**
- Cria `openspec/changes/<change-name>/`
- Gera os artefatos necessários antes da implementação (no `spec-driven`: proposal, specs, design e tasks)
- Para quando a mudança está pronta para `/opsx:apply`

**Exemplo:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Dicas:**
- Use-o para percorrer o caminho completo da forma mais rápida
- Para controlar cada artefato etapa por etapa, habilite os fluxos expandidos e use `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Comece aqui se estiver em dúvida.** Explore é um parceiro de reflexão sem
> compromisso: lê sua base de código, compara opções e transforma uma ideia
> vaga em um plano concreto antes que qualquer código seja escrito. Ele está
> incluído no perfil padrão. Para saber mais e ver outros exemplos, consulte o
> guia [Comece explorando](/pt-BR/explore/).

Reflita sobre ideias, investigue problemas e esclareça os requisitos antes de
se comprometer com uma mudança.

**Sintaxe:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `topic` | Não | O que você quer explorar ou investigar |

**O que faz:**
- Inicia uma conversa exploratória sem exigir uma estrutura
- Investiga a base de código para responder a perguntas
- Compara opções e abordagens
- Cria diagramas visuais para esclarecer as ideias
- Registra a exploração quando você pedir ou aceitar a oferta: cria a estrutura de uma mudança com `openspec new change` e escreve os artefatos de planejamento que você indicar, ou atualiza os artefatos de uma mudança existente
- Quando as ideias se consolidarem, pode prosseguir para `/opsx:propose` (padrão) ou `/opsx:new` (fluxo expandido)

**Exemplo:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**Dicas:**
- Use-o quando os requisitos não estiverem claros ou for preciso investigar
- Nunca escreve código nem altera qualquer outra coisa, a menos que você peça ou aceite uma oferta
- É útil para comparar várias abordagens antes de decidir
- Pode ler arquivos e pesquisar na base de código

---

### `/opsx:new`

Inicie a estrutura de uma nova mudança. Cria a pasta da mudança e aguarda que
você gere artefatos com `/opsx:continue` ou `/opsx:ff`.

Este comando faz parte do conjunto de fluxos expandidos (não está incluído no
perfil padrão `core`).

**Sintaxe:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Nome da pasta da mudança (perguntado se não for informado) |
| `--schema` | Não | Schema de fluxo de trabalho (padrão: o da configuração ou `spec-driven`) |

**O que faz:**
- Cria o diretório `openspec/changes/<change-name>/`
- Cria o arquivo de metadados `.openspec.yaml` na pasta da mudança
- Exibe o primeiro template de artefato pronto para ser criado
- Pergunta o nome da mudança e o schema, se não forem informados

**O que cria:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**Exemplo:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Dicas:**
- Use nomes descritivos: `add-feature`, `fix-bug`, `refactor-module`
- Evite nomes genéricos como `update`, `changes`, `wip`
- O schema também pode ser definido na configuração do projeto (`openspec/config.yaml`)

---

### `/opsx:continue`

Crie o próximo artefato da cadeia de dependências. Cria um artefato de cada vez
para permitir um progresso incremental.

**Sintaxe:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a continuar (inferida pelo contexto se não for informada) |

**O que faz:**
- Consulta o grafo de dependências dos artefatos
- Exibe quais artefatos estão prontos e quais estão bloqueados
- Cria o primeiro artefato pronto
- Lê os arquivos dos artefatos dependentes para obter contexto
- Mostra o que ficará disponível após a criação

**Exemplo:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**Dicas:**
- Use-o quando quiser revisar cada artefato antes de prosseguir
- É útil para mudanças complexas que você quer controlar
- Vários artefatos podem ficar prontos ao mesmo tempo
- Você pode editar os artefatos criados antes de continuar

---

### `/opsx:ff`

Avance rapidamente pela criação de artefatos. Cria todos os artefatos de
planejamento de uma só vez.

**Sintaxe:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança para avançar rapidamente (inferida pelo contexto se não for informada) |

**O que faz:**
- Cria todos os artefatos na ordem de dependências
- Acompanha o progresso por meio de uma lista de tarefas
- Para quando todos os artefatos obrigatórios para `apply` estiverem concluídos
- Lê cada dependência antes de criar o próximo artefato

**Exemplo:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Dicas:**
- Use-o quando souber claramente o que está construindo
- É mais rápido que `/opsx:continue` para mudanças simples
- Você ainda pode editar os artefatos depois
- É útil para funcionalidades pequenas ou médias

---

### `/opsx:apply`

Implemente as tarefas da mudança. Percorre a lista de tarefas, escreve código e
marca os itens concluídos.

**Sintaxe:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a implementar (inferida pelo contexto se não for informada) |

**O que faz:**
- Lê `tasks.md` e identifica as tarefas incompletas
- Executa as tarefas uma por uma
- Escreve código, cria arquivos e executa testes conforme necessário
- Marca as tarefas concluídas com caixas `[x]`

**Exemplo:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Dicas:**
- Se for interrompido, pode retomar de onde parou
- Para trabalhar em mudanças paralelas, informe o nome da mudança
- O estado de conclusão é registrado nas caixas de seleção de `tasks.md`

---

### `/opsx:update`

Revise os artefatos de planejamento existentes de uma mudança e mantenha-os
coerentes entre si. Atua somente nos artefatos de planejamento; nunca edita
código.

**Sintaxe:**

```text
/opsx:update [change-name]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a atualizar (inferida pelo contexto se não for informada) |

**O que faz:**

- Lê os artefatos da mudança por meio de `openspec status --change <name> --json`
- Aplica a revisão solicitada ou, se você não indicar uma, procura contradições nos artefatos
- Harmoniza os demais artefatos existentes em qualquer direção (uma alteração no projeto pode afetar a proposta)
- Confirma cada edição com você antes de gravar, um artefato de cada vez
- Termina recomendando a próxima etapa: `/opsx:continue` (artefatos ainda não iniciados), `/opsx:apply` (levar um plano revisado para o código) ou `/opsx:archive` (tudo concluído)

**Arquivos ausentes:**

- Para um artefato glob como `specs/**/*.md` que já tenha ao menos um arquivo, update pode sugerir a criação de um arquivo complementar ausente. Usa as instruções do schema e pede confirmação do caminho exato antes de criá-lo.
- Artefatos sem arquivos ainda devem ser criados com `/opsx:continue`. Artefatos ignorados intencionalmente permanecem intactos.
- Arquivos novos precisam ficar dentro do diretório da mudança. Se um arquivo surgir no caminho confirmado antes da criação, update para em vez de sobrescrevê-lo.

**Exemplo:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Dicas:**

- Ele não inicia um artefato sem arquivos existentes. Habilite `/opsx:continue` para isso ou use `openspec status` e `openspec instructions` se esse fluxo opcional não estiver instalado.
- Se a mudança já foi implementada, execute `/opsx:apply` depois para alinhar o código ao plano revisado.
- Se a revisão alterar a *intenção* da mudança, comece outra em vez de atualizar a existente (consulte [Quando atualizar ou começar do zero](/pt-BR/opsx/#quando-atualizar-ou-começar-do-zero)).

---

### `/opsx:verify`

Valide se a implementação corresponde aos artefatos da mudança. Verifica
completude, correção e coerência.

**Sintaxe:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a verificar (inferida pelo contexto se não for informada) |

**O que faz:**
- Verifica três dimensões da qualidade da implementação
- Pesquisa na base de código evidências da implementação
- Relata problemas como CRITICAL, WARNING ou SUGGESTION
- Não bloqueia o arquivamento, mas revela problemas

**Dimensões da verificação:**

| Dimensão | O que valida |
|-----------|-------------------|
| **Completude** | Todas as tarefas concluídas, requisitos implementados e cenários cobertos |
| **Correção** | Implementação de acordo com a intenção da especificação e tratamento dos casos extremos |
| **Coerência** | Decisões do projeto refletidas no código e padrões consistentes |

**Exemplo:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Dicas:**
- Execute antes de arquivar para detectar divergências com antecedência
- Avisos não bloqueiam o arquivamento, mas indicam possíveis problemas
- É útil para revisar o trabalho da IA antes de fazer commit
- Pode revelar divergências entre os artefatos e a implementação

---

### `/opsx:sync`

**Comando opcional.** Mescla especificações delta de uma mudança às
especificações principais. O arquivamento pergunta se for necessário
sincronizar, então normalmente não é preciso executar este comando
manualmente.

**Sintaxe:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a sincronizar (inferida pelo contexto se não for informada) |

**O que faz:**
- Lê as especificações delta da pasta da mudança
- Analisa as seções ADDED/MODIFIED/REMOVED/RENAMED
- Mescla as alterações ao diretório `openspec/specs/` principal
- Preserva o conteúdo existente que não foi mencionado no delta
- Não arquiva a mudança (ela permanece ativa)

**Exemplo:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Quando usar manualmente:**

| Cenário | Usar sync? |
|----------|-----------|
| Mudança de longa duração; quer especificações principais atualizadas antes do arquivamento | Sim |
| Várias mudanças em paralelo precisam das especificações-base atualizadas | Sim |
| Quer visualizar/revisar a mesclagem separadamente | Sim |
| Mudança rápida, será arquivada em seguida | Não (archive cuida disso) |

**Dicas:**
- sync é inteligente, não uma operação de copiar e colar
- Pode adicionar cenários a requisitos existentes sem duplicá-los
- A mudança permanece ativa após a sincronização (não é arquivada)
- A maioria das pessoas nunca precisará chamar este comando diretamente: o arquivamento pergunta se necessário

---

### `/opsx:archive`

Arquive uma mudança concluída. Finaliza a mudança e a move para a pasta de arquivo.

**Sintaxe:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a arquivar (inferida pelo contexto se não for informada) |

**O que faz:**
- Verifica o status de conclusão dos artefatos
- Verifica se as tarefas foram concluídas (e avisa se não foram)
- Oferece sincronizar as especificações delta, caso ainda não estejam sincronizadas
- Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Preserva todos os artefatos para a trilha de auditoria

**Exemplo:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Dicas:**
- O arquivamento não bloqueia tarefas incompletas, mas exibe um aviso
- As especificações delta podem ser sincronizadas durante o arquivamento ou antes
- As mudanças arquivadas são preservadas no histórico
- Use `/opsx:verify` primeiro para detectar problemas

---

### `/opsx:bulk-archive`

Arquive várias mudanças concluídas de uma vez. Trata conflitos entre as
especificações das mudanças.

**Sintaxe:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-names` | Não | Mudanças específicas a arquivar (pergunta quais selecionar se não forem informadas) |

**O que faz:**
- Lista todas as mudanças concluídas
- Valida cada mudança antes de arquivá-la
- Detecta conflitos entre as especificações das mudanças
- Resolve conflitos verificando o que foi implementado de fato
- Arquiva as mudanças em ordem cronológica

**Exemplo:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Dicas:**
- É útil para frentes de trabalho paralelas
- A resolução de conflitos é feita por um agente (que verifica a base de código)
- As mudanças são arquivadas na ordem em que foram criadas
- Pergunta antes de sobrescrever o conteúdo de uma especificação

---

### `/opsx:onboard`

Integre-se ao fluxo completo do OpenSpec com orientação. Um tutorial
interativo que usa sua base de código real.

**Sintaxe:**
```
/opsx:onboard
```

**O que faz:**
- Percorre todo o ciclo de trabalho com explicações
- Analisa sua base de código à procura de oportunidades reais de melhoria
- Cria uma mudança real com artefatos reais
- Implementa trabalho real (mudanças pequenas e seguras)
- Arquiva a mudança concluída
- Explica cada etapa à medida que acontece

**Etapas:**
1. Boas-vindas e análise da base de código
2. Encontrar uma oportunidade de melhoria
3. Criar uma mudança (`/opsx:new`)
4. Escrever a proposta
5. Criar especificações
6. Escrever o projeto
7. Criar tarefas
8. Implementar tarefas (`/opsx:apply`)
9. Verificar a implementação
10. Arquivar a mudança
11. Resumo e próximas etapas

**Exemplo:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Dicas:**
- É ideal para quem está aprendendo o fluxo de trabalho
- Usa código real, não exemplos artificiais
- Cria uma mudança real, que você pode manter ou descartar
- Leva de 15 a 30 minutos para concluir

---

## Sintaxe dos comandos por ferramenta de IA

Diferentes ferramentas de IA usam sintaxes de comando ligeiramente diferentes.
Use o formato correspondente à sua ferramenta:

| Arquivo de comandos da ferramenta | Exemplo de sintaxe | Exemplos de ferramentas |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot (IDE), Trae, Oh My Pi |
| nenhum — somente skills | `/openspec-propose`, `/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, `.agents` compartilhado |
| nenhum — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| nenhum — Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop e Devin Local:** os arquivos
> `.devin/workflows/opsx-*.md` fornecem `/opsx-propose` ao Devin Desktop. O
> Devin Local não tem workflows; use as skills que o OpenSpec grava em
> `.devin/skills/`, como `/openspec-propose`, compatíveis com os dois agentes.

A intenção é a mesma em todas as ferramentas, mas a forma de apresentar os
comandos pode variar conforme a integração. [Como invocar](/pt-BR/supported-tools/#como-invocar)
lista todas as ferramentas compatíveis; esta tabela mostra apenas exemplos de
cada formato.

> **Observação:** os comandos do GitHub Copilot (`.github/prompts/*.prompt.md`)
> só estão disponíveis nas extensões de IDE (VS Code, JetBrains, Visual
> Studio). A CLI do GitHub Copilot ainda não aceita arquivos de prompt
> personalizados. Consulte [Ferramentas compatíveis](/pt-BR/supported-tools/)
> para obter detalhes e alternativas.

---

## Comandos legados

Estes comandos usam o fluxo de trabalho antigo, que cria tudo de uma vez.
Ainda funcionam, mas recomendamos os comandos OPSX.

| Comando | O que faz |
|---------|--------------|
| `/openspec:proposal` | Criar todos os artefatos de uma vez (proposta, especificações, projeto e tarefas) |
| `/openspec:apply` | Implementar a mudança |
| `/openspec:archive` | Arquivar a mudança |

**Quando usar comandos legados:**
- Projetos existentes que usam o fluxo de trabalho antigo
- Mudanças simples que não precisam da criação incremental de artefatos
- Preferência pela abordagem de tudo ou nada

**Migrar para o OPSX:**
É possível continuar mudanças legadas com comandos OPSX. A estrutura dos
artefatos é compatível.

---

## Solução de problemas

### “Mudança não encontrada”

O comando não conseguiu identificar em qual mudança trabalhar.

**Soluções:**
- Informe explicitamente o nome da mudança: `/opsx:apply add-dark-mode`
- Confira se a pasta da mudança existe: `openspec list`
- Confirme que está no diretório de projeto correto

### “Nenhum artefato está pronto”

Todos os artefatos foram concluídos ou estão bloqueados por dependências ausentes.

**Soluções:**
- Execute `openspec status --change <name>` para ver o que está bloqueando
- Confira se os artefatos necessários existem
- Crie primeiro os artefatos de dependência ausentes

### “Schema não encontrado”

O schema especificado não existe.

**Soluções:**
- Liste os schemas disponíveis: `openspec schemas`
- Confira a grafia do nome do schema
- Crie o schema se for personalizado: `openspec schema init <name>`

### Os comandos não são reconhecidos

A ferramenta de IA não reconhece os comandos do OpenSpec.

**Soluções:**
- Confirme que o OpenSpec foi inicializado: `openspec init`
- Gere novamente as skills: `openspec update`
- Confira se o diretório `.claude/skills/` existe (para Claude Code)
- Reinicie a ferramenta de IA para carregar as novas skills

### Os artefatos não são gerados corretamente

A IA cria artefatos incompletos ou incorretos.

**Soluções:**
- Adicione o contexto do projeto em `openspec/config.yaml`
- Adicione regras por artefato com orientações específicas
- Inclua mais detalhes na descrição da mudança
- Use `/opsx:continue` em vez de `/opsx:ff` para ter mais controle

---

## Próximos passos

- [Fluxos de trabalho](/pt-BR/workflows/) — padrões comuns e quando usar cada comando
- [CLI](/pt-BR/cli/) — comandos de terminal para gerenciamento e validação
- [Personalização](/pt-BR/customization/) — criar schemas e fluxos personalizados
