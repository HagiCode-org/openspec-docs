---
title: "Personalização"
---

O OpenSpec oferece três níveis de personalização:

| Nível | O que faz | Ideal para |
|-------|--------------|----------|
| **Configuração do projeto** | Define padrões e inclui contexto/regras | A maioria das equipes |
| **Schemas personalizados** | Define artefatos para seu próprio fluxo de trabalho | Equipes com processos específicos |
| **Substituições globais** | Compartilha schemas entre todos os projetos | Usuários avançados |

---

## Configuração do projeto

O arquivo `openspec/config.yaml` é a maneira mais simples de personalizar o OpenSpec para sua equipe. Com ele, você pode:

- **Definir um schema padrão** — omitir `--schema` em todos os comandos
- **Incluir o contexto do projeto** — a IA conhece sua pilha tecnológica, convenções etc.
- **Adicionar regras por artefato** — regras personalizadas para artefatos específicos
- **Adicionar orientações por operação** — preferências consultivas para as operações `apply` e `archive`
- **Memorizar escolhas de integração** — por exemplo, a opção de habilitar o [agente de codificação na nuvem do GitHub Copilot](/pt-BR/supported-tools/#agente-de-codificação-na-nuvem-do-github-copilot)

### Configuração rápida

```bash
openspec init
```

O comando orienta você interativamente na criação de uma configuração. Se preferir, crie uma manualmente:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Pilha tecnológica: TypeScript, React, Node.js, PostgreSQL
  Estilo de API: RESTful, documentada em docs/api.md
  Testes: Jest + React Testing Library
  Valorizamos a compatibilidade retroativa de todas as APIs públicas

rules:
  proposal:
    - Incluir um plano de reversão
    - Identificar as equipes afetadas
  specs:
    - Usar o formato Dado/Quando/Então
    - Consultar padrões existentes antes de criar novos

operations:
  apply:
    guidance:
      - Executar testes direcionados antes do conjunto completo
  archive:
    guidance:
      - Manter o resumo da conclusão conciso

# Definido por `openspec init` quando você opta por usar (ou não) o agente de
# codificação na nuvem do GitHub Copilot; controla se `init`/`update` geram os arquivos dele.
githubCopilot:
  cloudAgent: false
```

### Como funciona

**Schema padrão:**

```bash
# Sem configuração
openspec new change my-feature --schema spec-driven

# Com configuração — o schema é selecionado automaticamente
openspec new change my-feature
```

**Inclusão de contexto e regras:**

Ao gerar qualquer artefato, o contexto e as regras são incluídos no prompt da IA:

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **Context** aparece em TODOS os artefatos
- **Rules** aparece SOMENTE no artefato correspondente

**Orientações por operação:**

`operations.apply.guidance` e `operations.archive.guidance` são arrays opcionais
de orientações consultivas sobre como um agente deve executar essas operações.
Elas são independentes de `rules`: as orientações por operação não restringem o
conteúdo dos artefatos, e as regras dos artefatos nunca são reclassificadas como
orientações por operação.

`apply` e `archive` obtêm essas entradas no momento da execução:

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

Ambas as superfícies retornam o `context` atual do projeto e o
`operationGuidance` correspondente em campos opcionais distintos. Cada invocação
lê um snapshot atualizado da raiz resolvida. Quando `--store <id>` é selecionado,
a mudança, o contexto e as orientações vêm dessa store, não do repositório atual.
O comando de instruções de arquivamento é somente para leitura: não inspeciona
nem mescla especificações delta, não grava especificações principais, não move a
mudança nem executa o fluxo estático de arquivamento.

O contexto do projeto é uma entrada obrigatória no nível do prompt. Os fluxos
gerados o leem e aplicam os fatos, convenções e restrições relevantes. As
orientações por operação são recomendações adicionais opcionais: os fluxos
consideram cada item e seguem os que forem aplicáveis e compatíveis com o fluxo
integrado.

Ambos os campos permanecem separados do estado controlado pela CLI, dos
caminhos resolvidos, das etapas integradas, das escolhas explícitas da pessoa
usuária e das regras dos artefatos. O fluxo informa sobre conflitos de contexto,
preservando o valor que prevalece. Ele não segue orientações inaplicáveis ou
conflitantes e explica o motivo. Nenhum dos campos é uma verificação obrigatória,
e os fluxos não copiam seu texto para arquivos de implementação, especificações,
artefatos de mudança ou resumos, a menos que a pessoa usuária solicite esse
conteúdo separadamente.

**Segurança das entradas de arquivamento e sincronização de especificações:**

O arquivamento, o arquivamento em lote e a sincronização independente usam
`artifactPaths.specs.existingOutputPaths` de `openspec status --json` como única
fonte de especificações delta. Se um schema não tiver um artefato `specs` ou a
lista concreta de saídas de uma mudança estiver vazia, não há nada para
sincronizar; outros artefatos não são usados para inferir especificações delta.

Antes de uma mesclagem semântica gravar uma especificação principal, o fluxo
usa a saída atual de `openspec instructions specs --change <name> --json`. As
regras `specs` retornadas restringem apenas as especificações principais
produzidas por essa mesclagem. O arquivamento individual repassa esse snapshot
para a sincronização integrada, a sincronização independente o obtém diretamente
e o arquivamento em lote obtém todos os snapshots necessários antes da primeira
gravação de especificação. Uma resposta não nula ou com JSON inválido às
instruções de arquivamento/especificações é uma falha de consulta, não uma
entrada vazia: o fluxo é interrompido antes de gravar a especificação afetada ou
mover a mudança (no arquivamento em lote, antes de qualquer gravação ou
movimentação do lote).

Essa configuração não altera as fases de execução do arquivamento, os prompts
para a pessoa usuária, as operações no sistema de arquivos, a responsabilidade
pela mesclagem semântica, o comando direto `openspec archive` nem a estrutura e
a saída das `rules` dos artefatos.

### Ordem de resolução do schema

Quando o OpenSpec precisa de um schema, verifica nesta ordem:

1. Opção da CLI: `--schema <name>`
2. Metadados da mudança (`.openspec.yaml` na pasta da mudança)
3. Configuração do projeto (`openspec/config.yaml`)
4. Padrão (`spec-driven`)

---

## Schemas personalizados

Quando a configuração do projeto não for suficiente, crie seu próprio schema
com um fluxo de trabalho totalmente personalizado. Os schemas personalizados
ficam no diretório `openspec/schemas/` do projeto e são versionados junto com o
código.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Configuração do projeto
│   ├── schemas/           # Schemas personalizados ficam aqui
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Suas mudanças
└── src/
```

### Criar uma cópia de um schema existente

A maneira mais rápida de personalizar é criar uma cópia de um schema integrado:

```bash
openspec schema fork spec-driven my-workflow
```

Isso copia todo o schema `spec-driven` para `openspec/schemas/my-workflow/`,
onde você poderá editá-lo livremente.

**O que será criado:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Definição do fluxo de trabalho
└── templates/
    ├── proposal.md       # Template do artefato proposal
    ├── spec.md           # Template de especificações
    ├── design.md         # Template de design
    └── tasks.md          # Template de tarefas
```

Agora edite `schema.yaml` para alterar o fluxo de trabalho ou os templates para
alterar o que a IA gera.

### Criar um schema do zero

Para criar um fluxo de trabalho inteiramente novo:

```bash
# Interativo
openspec schema init research-first

# Não interativo
openspec schema init rapid \
  --description "Fluxo de iteração rápida" \
  --artifacts "proposal,tasks" \
  --default
```

### Estrutura do schema

Um schema define os artefatos do seu fluxo de trabalho e as dependências entre eles:

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: Fluxo de trabalho personalizado da minha equipe

artifacts:
  - id: proposal
    generates: proposal.md
    description: Documento da proposta inicial
    template: proposal.md
    instruction: |
      Criar uma proposta que explique POR QUE esta mudança é necessária.
      Focar no problema, não na solução.
    requires: []

  - id: design
    generates: design.md
    description: Projeto técnico
    template: design.md
    instruction: |
      Criar um documento de projeto que explique COMO implementar.
    requires:
      - proposal    # Não é possível criar o design antes da proposta

  - id: tasks
    generates: tasks.md
    description: Lista de verificação da implementação
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Campos principais:**

| Campo | Finalidade |
|-------|---------|
| `id` | Identificador único, usado em comandos e regras |
| `generates` | Nome do arquivo de saída (aceita padrões glob, como `specs/**/*.md`) |
| `template` | Arquivo de template no diretório `templates/` |
| `instruction` | Instruções para a IA criar este artefato |
| `requires` | Dependências — artefatos que precisam existir primeiro |

Liste os artefatos na ordem em que devem ser escritos. `requires` determina o
que pode ser feito; a ordem da lista `artifacts:` determina o que vem primeiro
quando vários artefatos ficam prontos ao mesmo tempo.

### Templates

Os templates são arquivos Markdown que orientam a IA. Eles são incluídos no
prompt durante a criação do artefato correspondente.

```markdown
<!-- templates/proposal.md -->
## Por quê

<!-- Explique a motivação desta mudança. Que problema ela resolve? -->

## O que muda

<!-- Descreva o que vai mudar. Seja específico sobre novos recursos ou modificações. -->

## Impacto

<!-- Código, APIs, dependências e sistemas afetados -->
```

Os templates podem incluir:
- Títulos de seção que a IA deve preencher
- Comentários HTML com orientações para a IA
- Exemplos de formato que mostrem a estrutura esperada

### Validar seu schema

Valide o schema personalizado antes de usá-lo:

```bash
openspec schema validate my-workflow
```

O comando verifica se:
- A sintaxe de `schema.yaml` está correta
- Todos os templates referenciados existem
- Não há dependências circulares
- Os IDs dos artefatos são válidos

### Usar seu schema personalizado

Depois de criá-lo, use o schema assim:

```bash
# Especificar no comando
openspec new change feature --schema my-workflow

# Ou defini-lo como padrão em config.yaml
schema: my-workflow
```

### Depurar a resolução do schema

Não sabe qual schema está sendo usado? Confira com:

```bash
# Ver de onde vem a resolução de um schema específico
openspec schema which my-workflow

# Listar todos os schemas disponíveis
openspec schema which --all
```

A saída informa se ele vem do projeto, do diretório do usuário ou do pacote:

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Observação:** O OpenSpec também aceita schemas no nível do usuário em
> `~/.local/share/openspec/schemas/`, para compartilhá-los entre projetos.
> Recomendamos, porém, os schemas no nível do projeto em `openspec/schemas/`,
> pois são versionados junto com o código.

---

## Exemplos

### Fluxo de trabalho de iteração rápida

Um fluxo de trabalho mínimo para iterações rápidas:

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Adicionar um artefato de revisão

Crie uma cópia do schema padrão e adicione uma etapa de revisão:

```bash
openspec schema fork spec-driven with-review
```

Em seguida, edite `schema.yaml` para adicionar:

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schemas da comunidade

O OpenSpec também aceita schemas mantidos pela comunidade e distribuídos em
repositórios independentes. Eles oferecem fluxos de trabalho opinativos que
integram o OpenSpec a outras ferramentas ou sistemas, de forma semelhante ao
[catálogo de extensões da comunidade do github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions) para o spec-kit.

Os schemas da comunidade não são incluídos no núcleo do OpenSpec: ficam em seus
próprios repositórios e seguem ciclos de lançamento independentes. Para usar um
deles, copie o pacote do schema para o diretório
`openspec/schemas/<schema-name>/` do projeto (o README de cada repositório
contém instruções de instalação).

| Schema | Mantenedor | Repositório | Descrição |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | Registra a intenção da mudança, o comportamento observável, o projeto técnico e as decisões arquiteturais duradouras antes da implementação. Adiciona um manifesto de revisão de ADR específico para cada mudança e registra como ADRs imutáveis e substituíveis as decisões que devam durar. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Integra a governança de artefatos do OpenSpec às habilidades de execução do [obra/superpowers](https://github.com/obra/superpowers) (brainstorming, elaboração de planos, TDD com subagentes, revisão de código e finalização). Adiciona o artefato `retrospective`, baseado em evidências, para cobrir algo que o Superpowers não oferece nativamente. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Fluxo de trabalho voltado primeiro à gestão de produto. Executa o pipeline de planejamento do [nanopm](https://github.com/nmrtn/nanopm) (auditoria → estratégia → roteiro → PRD) antes da implementação. Conecta o planejamento de produto ao fluxo de engenharia orientado a especificações do OpenSpec. Se existir `.nanopm/`, os artefatos usam seus arquivos como fonte: a proposta parte da auditoria, o projeto parte da estratégia e as tarefas partem da decomposição do PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Runbooks de testes de ponta a ponta no nível de capacidade. Cada capacidade recebe uma especificação imutável, um template imutável de tarefas e um registro de execução com data e hora. Asserções limitam-se a comportamentos observáveis (status HTTP, corpo da resposta, estado persistido — nunca trechos de logs); cada execução registra início e fim em UTC, duração e uma estimativa do consumo de tokens do LLM. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | Fluxo orientado a especificações, com disciplina de TDD e uma etapa de revisão adversarial. Etapas: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. `review` é escrito por um revisor somente para leitura, com contexto novo (um segundo modelo, quando disponível), e emite uma linha `VERDICT:` que instrui o agente a bloquear `test-plan`, `tasks` e `apply`; o OpenSpec só verifica se os artefatos existem, então aplique esse bloqueio com sua própria CI ou hook. `test-plan` associa cada cenário da especificação a um teste nomeado e também funciona como um registro red/green auditado por `verify`. |

> Quer contribuir com um schema da comunidade? Abra uma issue com o link do seu
> repositório ou envie um PR adicionando uma linha a esta tabela.

---

## Consulte também

- [Referência da CLI: comandos de schema](/pt-BR/cli/#comandos-de-schema) — documentação completa dos comandos
