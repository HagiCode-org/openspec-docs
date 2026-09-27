---
title: "Fluxo de trabalho OPSX"
---

> Comentários são bem-vindos no [Discord](https://discord.gg/YctCnvvshC).

## O que é?

OPSX é agora o fluxo de trabalho padrão do OpenSpec.

É um **fluxo de trabalho fluido e iterativo** para mudanças do OpenSpec. Sem
fases rígidas: apenas ações que você pode executar a qualquer momento.

## Por que isso existe

O fluxo de trabalho legado do OpenSpec funciona, mas é **engessado**:

- **Instruções fixas no código** — ficam escondidas no TypeScript e não podem ser alteradas
- **Tudo ou nada** — um comando grande cria tudo, sem permitir testar cada parte
- **Estrutura fixa** — o mesmo fluxo para todos, sem personalização
- **Caixa-preta** — quando a saída da IA é ruim, não dá para ajustar os prompts

**O OPSX torna tudo isso aberto.** Agora qualquer pessoa pode:

1. **Experimentar com instruções** — editar um template e ver se a IA melhora
2. **Testar cada parte** — validar separadamente as instruções de cada artefato
3. **Personalizar fluxos de trabalho** — definir seus próprios artefatos e dependências
4. **Iterar rapidamente** — alterar um template e testá-lo na hora, sem recompilar

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**Este recurso é para todos:**
- **Equipes** — criar fluxos de trabalho compatíveis com a forma como realmente trabalham
- **Usuários avançados** — ajustar prompts para obter melhores resultados da IA na sua base de código
- **Colaboradores do OpenSpec** — experimentar novas abordagens sem lançar versões

Ainda estamos aprendendo o que funciona melhor. O OPSX nos permite aprender em conjunto.

## Experiência de uso

**O problema dos fluxos lineares:**
Você está “na fase de planejamento”, depois “na fase de implementação” e, por
fim, “concluiu”. Mas o trabalho real não funciona assim. Você implementa algo,
percebe que o projeto estava errado, precisa atualizar as especificações e
continua implementando. As fases lineares vão contra a forma como o trabalho
realmente acontece.

**A abordagem do OPSX:**
- **Ações, não fases** — criar, implementar, atualizar e arquivar a qualquer momento
- **Dependências viabilizam o trabalho** — mostram o que é possível fazer, não o que é obrigatório fazer em seguida

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuração

```bash
# Confirme que o openspec está instalado — as skills são geradas automaticamente
openspec init
```

Isso cria skills em `.claude/skills/` (ou diretório equivalente), que os
assistentes de programação com IA detectam automaticamente.

Por padrão, o OpenSpec usa o perfil de fluxo de trabalho `core` (`propose`,
`explore`, `apply`, `update`, `sync`, `archive`). Para usar os comandos
expandidos (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`),
configure-os com `openspec config profile` e aplique-os com `openspec update`.

Durante a configuração, será oferecida a opção de criar um **arquivo de
configuração do projeto** (`openspec/config.yaml`). É opcional, mas recomendado.

## Configuração do projeto

A configuração do projeto permite definir padrões e incluir contexto específico
do projeto em todos os artefatos.

### Criar a configuração

A configuração é criada durante `openspec init` ou manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Campos de configuração

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `schema` | string | Schema padrão para novas mudanças (por exemplo, `spec-driven`) |
| `context` | string | Contexto do projeto incluído em todas as instruções dos artefatos |
| `rules` | object | Regras por artefato, indexadas pelo ID do artefato |

### Como funciona

**Precedência dos schemas** (da maior para a menor):
1. Opção da CLI (`--schema <name>`)
2. Metadados da mudança (`.openspec.yaml` no diretório da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

**Inclusão do contexto:**
- O contexto é acrescentado antes das instruções de cada artefato
- É envolvido pelas tags `<context>...</context>`
- Ajuda a IA a entender as convenções do projeto

**Inclusão das regras:**
- As regras são incluídas somente nos artefatos correspondentes
- São envolvidas pelas tags `<rules>...</rules>`
- Aparecem depois do contexto e antes do template

### IDs de artefatos por schema

**spec-driven** (padrão):
- `proposal` — Proposta de mudança
- `specs` — Especificações
- `design` — Projeto técnico
- `tasks` — Tarefas de implementação

### Validação da configuração

- IDs de artefato desconhecidos em `rules` geram avisos
- Os nomes dos schemas são validados em relação aos schemas disponíveis
- O contexto tem limite de 50 KB
- Erros de YAML são informados com números de linha

### Solução de problemas

**“ID de artefato desconhecido em rules: X”**
- Confira se os IDs de artefato correspondem ao schema (consulte a lista acima)
- Execute `openspec schemas --json` para ver os IDs de artefato de cada schema

**A configuração não está sendo aplicada:**
- Confirme que o arquivo está em `openspec/config.yaml` (não `.yml`)
- Verifique a sintaxe YAML com um validador
- As alterações de configuração têm efeito imediato (não é necessário reiniciar)

**O contexto é grande demais:**
- O limite do contexto é 50 KB
- Resuma-o ou, em vez disso, inclua links para documentos externos

## Comandos

| Comando | O que faz |
|---------|--------------|
| `/opsx:propose` | Criar uma mudança e gerar artefatos de planejamento em uma etapa (caminho rápido padrão) |
| `/opsx:explore` | Refletir sobre ideias, investigar problemas e esclarecer requisitos |
| `/opsx:new` | Iniciar a estrutura de uma mudança (fluxo expandido) |
| `/opsx:continue` | Criar o próximo artefato (fluxo expandido) |
| `/opsx:ff` | Criar rapidamente os artefatos de planejamento (fluxo expandido) |
| `/opsx:apply` | Implementar tarefas e atualizar os artefatos conforme necessário |
| `/opsx:update` | Revisar e manter coerentes os artefatos de planejamento de uma mudança |
| `/opsx:verify` | Validar a implementação em relação aos artefatos (fluxo expandido) |
| `/opsx:sync` | Mesclar especificações delta às principais (opcional) |
| `/opsx:archive` | Arquivar quando terminar |
| `/opsx:bulk-archive` | Arquivar várias mudanças concluídas (fluxo expandido) |
| `/opsx:onboard` | Percorrer uma mudança de ponta a ponta com orientação (fluxo expandido) |

## Uso

### Explorar uma ideia
```
/opsx:explore
```
Reflita sobre ideias, investigue problemas e compare opções. Não é necessária
uma estrutura: o comando é apenas um parceiro de reflexão. Quando as ideias se
consolidarem, prossiga para `/opsx:propose` (padrão) ou
`/opsx:new`/`/opsx:ff` (fluxo expandido).

### Iniciar uma nova mudança
```
/opsx:propose
```
Cria a mudança e gera os artefatos de planejamento necessários antes da implementação.

Se você habilitou os fluxos expandidos, pode usar:

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### Criar artefatos
```
/opsx:continue
```
Mostra o que está pronto para ser criado com base nas dependências e cria um
artefato. Repita o comando para desenvolver a mudança de forma incremental.

```
/opsx:ff add-dark-mode
```
Cria todos os artefatos de planejamento de uma vez. Use quando souber claramente
o que está construindo.

### Implementar (a parte flexível)
```
/opsx:apply
```
Executa as tarefas e as marca à medida que são concluídas. Se estiver
trabalhando em várias mudanças, execute `/opsx:apply <name>`; caso contrário,
o comando deverá inferir a mudança pela conversa ou pedir que você a selecione
se não conseguir identificá-la.

### Atualizar uma mudança
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Revisa os artefatos de planejamento existentes da mudança e os mantém
coerentes em qualquer direção (uma edição do projeto pode afetar a proposta).
Nunca edita código. Cada edição é confirmada com você antes de ser gravada.
Consulte a [referência de update](/pt-BR/commands/#opsxupdate) para saber como
o comando lida com arquivos ausentes sem iniciar um artefato novo.

Se a mudança já foi implementada, o comando recomenda `/opsx:apply` para
atualizar o código de acordo com o plano revisado. Se a revisão alterar a
*intenção* da mudança, comece outra. Consulte [Quando atualizar ou começar do
zero](#quando-atualizar-ou-começar-do-zero).

### Sincronizar especificações delta
```text
/opsx:sync
```
Mescla as especificações delta da mudança atual às especificações principais em
`openspec/specs/`, sem arquivá-la — a mudança permanece ativa. Aplica o delta
completo: um requisito sob `## REMOVED` é excluído da especificação principal,
um requisito renomeado recebe o novo título no mesmo lugar, e o conteúdo não
mencionado no delta permanece intacto. A sincronização é opcional: se ainda não
tiver sido feita, `archive` perguntará se você quer sincronizar. Use-a quando
quiser atualizar as especificações principais antes de arquivar, quando uma
mudança paralela precisar usar as especificações que esta acabou de adicionar
ou quando quiser revisar a especificação principal mesclada antes do
arquivamento.

### Finalizar
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## Quando atualizar ou começar do zero

Você sempre pode editar a proposta ou as especificações antes da
implementação. Mas quando um refinamento passa a ser “um trabalho diferente”?

### O que uma proposta registra

A proposta define três elementos:
1. **Intenção** — que problema você está resolvendo?
2. **Escopo** — o que está dentro ou fora do escopo?
3. **Abordagem** — como você resolverá o problema?

A pergunta é: qual deles mudou e quanto?

### Atualize a mudança existente quando:

**A intenção é a mesma, mas a execução foi refinada**
- Você descobre casos extremos que não havia considerado
- A abordagem precisa de ajustes, mas o objetivo não mudou
- A implementação revela que o projeto não estava totalmente correto

**O escopo diminui**
- Você percebe que o escopo completo é grande demais e quer lançar o MVP primeiro
- “Adicionar modo escuro” → “Adicionar alternância para modo escuro (preferência do sistema na versão 2)”

**Correções com base em novas descobertas**
- A base de código não está estruturada como você imaginava
- Uma dependência não funciona como esperado
- “Usar variáveis CSS” → “Usar o prefixo dark: do Tailwind”

### Comece uma nova mudança quando:

**A intenção mudou fundamentalmente**
- O próprio problema agora é outro
- “Adicionar modo escuro” → “Adicionar um sistema de temas abrangente, com cores, fontes e espaçamentos personalizados”

**O escopo cresceu demais**
- A mudança cresceu tanto que passou a ser outro trabalho
- Após as atualizações, a proposta original ficaria irreconhecível
- “Corrigir um bug de login” → “Reescrever o sistema de autenticação”

**A mudança original pode ser concluída**
- A mudança original pode ser marcada como concluída
- O novo trabalho é independente, não um refinamento
- Concluir “Adicionar MVP de modo escuro” → arquivar → nova mudança “Aprimorar o modo escuro”

### Critérios práticos

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Teste | Atualizar | Nova mudança |
|------|--------|------------|
| **Identidade** | “A mesma coisa, refinada” | “Um trabalho diferente” |
| **Sobreposição do escopo** | Mais de 50% de sobreposição | Menos de 50% de sobreposição |
| **Conclusão** | Não pode ser concluída sem as alterações | A mudança original pode ser concluída; o novo trabalho é independente |
| **Histórico** | A sequência de atualizações conta uma história coerente | As alterações causariam mais confusão do que clareza |

### Princípio

> **Atualizar preserva o contexto. Uma nova mudança traz clareza.**
>
> Atualize quando o histórico do seu raciocínio for valioso.
> Crie uma mudança nova quando começar do zero for mais claro do que fazer ajustes.

Pense nisso como branches do Git:
- Continue fazendo commits enquanto trabalha na mesma funcionalidade
- Crie uma nova branch quando o trabalho for realmente novo
- Às vezes, mescle uma funcionalidade parcial e comece do zero para a fase 2

## O que mudou?

| | Legado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estrutura** | Um documento grande de proposta | Artefatos separados com dependências |
| **Fluxo de trabalho** | Fases lineares: planejar → implementar → arquivar | Ações flexíveis — faça qualquer coisa a qualquer momento |
| **Iteração** | Difícil voltar atrás | Atualize os artefatos à medida que aprende |
| **Personalização** | Estrutura fixa | Orientada por schema (defina seus próprios artefatos) |

**A ideia principal:** o trabalho não é linear. O OPSX deixa de fingir que é.

## Arquitetura em detalhes

Esta seção explica como o OPSX funciona internamente e como se compara ao
fluxo legado. Os exemplos usam o conjunto expandido de comandos (`new`,
`continue` etc.); quem usa o perfil padrão `core` pode aplicar o mesmo fluxo
com `propose → apply → sync → archive`.

### Filosofia: fases ou ações

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitetura dos componentes

O **fluxo legado** usa templates fixos no código TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

O **OPSX** usa schemas externos e um mecanismo de grafo de dependências:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Devin)                    │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modelo do grafo de dependências

Os artefatos formam um grafo direcionado acíclico (DAG). As dependências
**viabilizam o trabalho**, não são barreiras:

```
                              proposal
                             (root node)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transições de estado:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Fluxo de informações

**Fluxo legado** — o agente recebe instruções estáticas:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create delta spec files              │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — o agente consulta informações detalhadas:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked",                          │  │
  │  │       "missingDeps": ["specs", "design"]}                          │  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modelo de iteração

**Fluxo legado** — difícil de iterar:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — iteração natural:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### Schemas personalizados

Crie fluxos de trabalho personalizados usando os comandos de gerenciamento de schemas:

```bash
# Criar um schema do zero (interativo)
openspec schema init my-workflow

# Ou criar uma cópia de um schema existente como ponto de partida
openspec schema fork spec-driven my-workflow

# Validar a estrutura do schema
openspec schema validate my-workflow

# Ver de onde vem a resolução do schema (útil para depuração)
openspec schema which my-workflow
```

Os schemas são armazenados em `openspec/schemas/` (locais ao projeto e
versionados) ou `~/.local/share/openspec/schemas/` (globais do usuário).

**Estrutura do schema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Exemplo de schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Grafo de dependências:**
```
   research ──► proposal ──► tasks
```

### Resumo

| Aspecto | Legado | OPSX |
|--------|----------|------|
| **Templates** | TypeScript fixo no código | YAML + Markdown externos |
| **Dependências** | Nenhuma (tudo de uma vez) | DAG com ordenação topológica |
| **Estado** | Modelo mental baseado em fases | Existência no sistema de arquivos |
| **Personalização** | Editar o código-fonte e recompilar | Criar schema.yaml |
| **Iteração** | Fases rígidas | Flexível, permite editar qualquer coisa |
| **Suporte a editores** | Configuradores/adaptadores específicos da ferramenta | Um único diretório de skills |

## Schemas

Schemas definem quais artefatos existem e suas dependências. Atualmente, está
disponível:

- **spec-driven** (padrão): proposta → especificações → projeto → tarefas

```bash
# Listar schemas disponíveis
openspec schemas

# Ver todos os schemas e suas origens de resolução
openspec schema which --all

# Criar um novo schema interativamente
openspec schema init my-workflow

# Criar uma cópia de um schema existente para personalizá-lo
openspec schema fork spec-driven my-workflow

# Validar a estrutura do schema antes de usá-lo
openspec schema validate my-workflow
```

## Dicas

- Use `/opsx:explore` para refletir sobre uma ideia antes de se comprometer com uma mudança
- Use `/opsx:ff` quando souber o que quer e `/opsx:continue` enquanto estiver explorando
- Durante `/opsx:apply`, se algo estiver errado, corrija o artefato e continue
- As tarefas acompanham o progresso por meio das caixas de seleção em `tasks.md`
- Consulte o status a qualquer momento: `openspec status --change "name"`

## Comentários

Este material ainda está em desenvolvimento. Isso é intencional: estamos
aprendendo o que funciona.

Encontrou um bug? Tem ideias? Participe pelo [Discord](https://discord.gg/YctCnvvshC)
ou abra uma issue no [GitHub](https://github.com/Fission-AI/openspec/issues).
