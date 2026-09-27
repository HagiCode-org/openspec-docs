---
title: "Migrar para o OPSX"
---

Este guia ajuda você a migrar do fluxo de trabalho legado do OpenSpec para o
OPSX. A migração foi projetada para ser simples: o trabalho existente é
preservado, e o novo sistema oferece mais flexibilidade.

## O que está mudando?

O OPSX substitui o antigo fluxo de trabalho dividido em fases por uma abordagem
fluida e baseada em ações. Esta é a principal mudança:

| Aspecto | Legado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Padrão: `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive` (comandos do fluxo expandido são opcionais) |
| **Fluxo de trabalho** | Criar todos os artefatos de uma vez | Criar aos poucos ou todos de uma vez — você escolhe |
| **Voltar atrás** | Etapas obrigatórias difíceis de reverter | Natural: atualize qualquer artefato a qualquer momento |
| **Personalização** | Estrutura fixa | Baseada em schemas e totalmente personalizável |
| **Configuração** | `CLAUDE.md` com marcadores + `project.md` | Configuração simples em `openspec/config.yaml` |

**A mudança de filosofia:** o trabalho não é linear. O OPSX deixa de fingir que é.

---

## Antes de começar

### Seu trabalho existente está seguro

O processo de migração foi projetado para preservar o que já existe:

- **Mudanças ativas em `openspec/changes/`** — totalmente preservadas. Você pode continuá-las com os comandos OPSX.
- **Mudanças arquivadas** — não são alteradas. Seu histórico permanece intacto.
- **Especificações principais em `openspec/specs/`** — não são alteradas; elas são sua fonte da verdade.
- **Seu conteúdo em CLAUDE.md, AGENTS.md etc.** — preservado. Somente os blocos de marcadores do OpenSpec são removidos; tudo o que você escreveu permanece.

### O que será removido

Somente arquivos gerenciados pelo OpenSpec que serão substituídos:

| O quê | Por quê |
|------|-----|
| Diretórios/arquivos de comandos de barra legados | Substituídos pelo novo sistema de skills |
| `openspec/AGENTS.md` | Acionador de fluxo de trabalho obsoleto |
| Marcadores do OpenSpec em `CLAUDE.md`, `AGENTS.md` etc. | Não são mais necessários |

**Locais dos comandos legados por ferramenta** (exemplos; os caminhos podem variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop, anteriormente Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (somente extensões de IDE; não é compatível com a CLI do Copilot)
- Codex: o OpenSpec agora usa o caminho canônico `.agents/skills/openspec-*`. Arquivos `SKILL.md` gerenciados pelo OpenSpec no antigo caminho `.codex/skills` só são conciliados depois que as substituições existirem; arquivos personalizados e cópias divergentes são mantidos. Se uma árvore `.agents` sem marcadores já contiver skills do OpenSpec, ele preserva a renderização atual do Codex (`$openspec-*`) ou genérica (`/openspec-*`), em vez de tentar deduzi-la pelo diretório legado. Selecione `codex` explicitamente com `openspec init` para alterar a propriedade. A limpeza de prompts legados ainda se limita aos nomes de arquivo permitidos pelo OpenSpec em `$CODEX_HOME/prompts` ou `~/.codex/prompts`.
- E outras (Augment, Continue, Amazon Q etc.)

A migração detecta as ferramentas configuradas e limpa os arquivos legados correspondentes.

A lista de remoções pode parecer extensa, mas contém apenas arquivos criados originalmente pelo OpenSpec. Seu conteúdo nunca é excluído.

### O que exige sua atenção

Um arquivo precisa ser migrado manualmente:

**`openspec/project.md`** — Este arquivo não é excluído automaticamente, pois pode conter informações de contexto do projeto que você escreveu. Será necessário:

1. Revisar o conteúdo
2. Mover as informações úteis de contexto para `openspec/config.yaml` (consulte as orientações abaixo)
3. Excluir o arquivo quando estiver tudo pronto

**Por que fizemos essa mudança:**

O antigo `project.md` era passivo: os agentes podiam lê-lo ou não, e podiam esquecer o conteúdo. A confiabilidade era inconsistente.

O contexto do novo `config.yaml` é **incluído ativamente em todas as solicitações de planejamento do OpenSpec**. Assim, as convenções, a pilha tecnológica e as regras do projeto estão sempre disponíveis quando a IA cria artefatos, aumentando a confiabilidade.

**A contrapartida:**

Como o contexto é incluído em todas as solicitações, procure ser conciso. Concentre-se no que realmente importa:
- Pilha tecnológica e convenções principais
- Restrições não óbvias que a IA precisa conhecer
- Regras que costumavam ser ignoradas

Não se preocupe em acertar tudo de primeira. Ainda estamos aprendendo o que funciona melhor e aprimoraremos a inclusão de contexto à medida que experimentarmos.

---

## Executar a migração

`openspec init` e `openspec update` detectam arquivos legados e orientam você pelo mesmo processo de limpeza. Use o comando mais adequado à sua situação:

- Novas instalações usam por padrão o perfil `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`).
- Instalações migradas preservam os fluxos de trabalho instalados anteriormente, criando um perfil `custom` quando necessário.

### Usar `openspec init`

Execute este comando para adicionar ferramentas ou reconfigurar quais ferramentas estão configuradas:

```bash
openspec init
```

O comando `init` detecta arquivos legados e orienta você durante a limpeza:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**O que acontece quando você confirma:**

1. Os diretórios de comandos de barra legados são removidos
2. Os marcadores do OpenSpec são removidos de `CLAUDE.md`, `AGENTS.md` etc. (seu conteúdo permanece)
3. `openspec/AGENTS.md` é excluído
4. As novas skills são instaladas em `.claude/skills/`
5. `openspec/config.yaml` é criado com um schema padrão

### Usar `openspec update`

Execute este comando para migrar e atualizar as ferramentas existentes para a versão mais recente:

```bash
openspec update
```

O comando de atualização também detecta e limpa artefatos legados e, em seguida, atualiza as skills/comandos gerados para corresponder ao perfil e às configurações de distribuição atuais.

### Ambientes não interativos/CI

Para migrações automatizadas por script:

```bash
openspec init --force --tools claude
```

A opção `--force` ignora as perguntas e confirma a limpeza automaticamente.

Isso inclui a limpeza dos arquivos de prompt do Codex gerenciados pelo OpenSpec no diretório global de prompts do Codex. A limpeza abrange apenas os nomes de arquivos de prompt legados do Codex permitidos pelo OpenSpec; eles só são removidos depois que as skills substitutas `.agents/skills/openspec-*` existirem. Todos os outros arquivos são preservados.

---

## Migrar project.md para config.yaml

O antigo `openspec/project.md` era um arquivo Markdown livre para registrar o contexto do projeto. O novo `openspec/config.yaml` tem uma estrutura definida e, mais importante, é **incluído em todas as solicitações de planejamento**, garantindo que suas convenções estejam sempre disponíveis durante o trabalho da IA.

### Antes (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Depois (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Principais diferenças

| project.md | config.yaml |
|------------|-------------|
| Markdown livre | YAML estruturado |
| Um bloco de texto | Contexto separado de regras por artefato |
| Não fica claro quando é usado | O contexto aparece em TODOS os artefatos; as regras aparecem somente nos artefatos correspondentes |
| Sem seleção de schema | O campo explícito `schema:` define o fluxo de trabalho padrão |

### O que manter e o que remover

Durante a migração, seja seletivo. Pergunte a si: “A IA precisa disso em *todas* as solicitações de planejamento?”

**Bons candidatos a `context:`**
- Pilha tecnológica (linguagens, frameworks, bancos de dados)
- Padrões de arquitetura importantes (monorepo, microsserviços etc.)
- Restrições não óbvias (“não podemos usar a biblioteca X porque...”)
- Convenções essenciais que costumam ser ignoradas

**Em vez disso, mova para `rules:`**
- Formatação específica de artefatos (“usar Given/When/Then nas especificações”)
- Critérios de revisão (“as propostas devem incluir planos de reversão”)
- Essas regras aparecem somente no artefato correspondente, mantendo mais leves as outras solicitações

**Remova por completo**
- Boas práticas gerais que a IA já conhece
- Explicações extensas que poderiam ser resumidas
- Contexto histórico que não afeta o trabalho atual

### Etapas da migração

1. **Criar config.yaml** (se `init` ainda não o tiver criado):
   ```yaml
   schema: spec-driven
   ```

2. **Adicionar seu contexto** (seja conciso: ele será incluído em todas as solicitações):
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **Adicionar regras por artefato** (opcional):
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **Excluir project.md** depois de mover tudo que for útil.

**Não complique demais.** Comece pelo essencial e vá aprimorando. Se perceber que a IA está deixando passar algo importante, adicione-o. Se o contexto parecer extenso demais, reduza-o. Este é um documento vivo.

### Precisa de ajuda? Use este prompt

Se não souber como resumir seu project.md, peça ajuda ao seu assistente de IA:

```
Estou migrando do antigo project.md do OpenSpec para o novo formato config.yaml.

Este é meu project.md atual:
[cole aqui o conteúdo do project.md]

Ajude-me a criar um config.yaml com:
1. Uma seção `context:` concisa (ela é incluída em todas as solicitações de planejamento, então mantenha-a breve e foque na pilha tecnológica, nas principais restrições e nas convenções que costumam ser ignoradas)
2. `rules:` para artefatos específicos, caso algum conteúdo seja específico de um artefato (por exemplo, “usar Given/When/Then” pertence às regras de especificações, não ao contexto global)

Exclua informações genéricas que os modelos de IA já conhecem. Seja rigoroso com a concisão.
```

A IA ajudará você a identificar o que é essencial e o que pode ser reduzido.

---

## Os novos comandos

A disponibilidade dos comandos depende do perfil:

**Padrão (perfil `core`):**

| Comando | Finalidade |
|---------|---------|
| `/opsx:propose` | Criar uma mudança e gerar artefatos de planejamento em uma etapa |
| `/opsx:explore` | Refletir sobre ideias sem uma estrutura predefinida |
| `/opsx:apply` | Implementar as tarefas de tasks.md |
| `/opsx:update` | Revisar os artefatos de planejamento de uma mudança e mantê-los coerentes |
| `/opsx:sync` | Mesclar especificações delta às especificações principais |
| `/opsx:archive` | Finalizar e arquivar a mudança |

**Fluxo de trabalho expandido (seleção personalizada):**

| Comando | Finalidade |
|---------|---------|
| `/opsx:new` | Iniciar a estrutura de uma nova mudança |
| `/opsx:continue` | Criar o próximo artefato (um de cada vez) |
| `/opsx:ff` | Avançar rapidamente — criar todos os artefatos de planejamento de uma vez |
| `/opsx:verify` | Validar se a implementação corresponde às especificações |
| `/opsx:bulk-archive` | Arquivar várias mudanças de uma vez |
| `/opsx:onboard` | Fluxo guiado de integração de ponta a ponta |

Habilite os comandos expandidos com `openspec config profile` e execute `openspec update`.

### Mapeamento dos comandos legados

| Legado | Equivalente no OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (padrão) ou `/opsx:new` e depois `/opsx:ff` (expandido) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Novos recursos

Esses recursos fazem parte do conjunto expandido de comandos de fluxo de trabalho.

**Criação granular de artefatos:**
```
/opsx:continue
```
Cria um artefato de cada vez, com base nas dependências. Use-o quando quiser revisar cada etapa.

**Modo de exploração:**
```
/opsx:explore
```
Reflita sobre ideias com um parceiro antes de se comprometer com uma mudança.

---

## Entender a nova arquitetura

### De fases rígidas a um fluxo flexível

O fluxo de trabalho legado impunha uma progressão linear:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

E se você perceber durante a implementação que o projeto está errado?
Que pena: as etapas obrigatórias não permitem voltar com facilidade.
```

O OPSX usa ações, não fases:

```
         ┌───────────────────────────────────────────────┐
         │            AÇÕES (não fases)                  │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    qualquer ordem             │
         └───────────────────────────────────────────────┘
```

### Grafo de dependências

Os artefatos formam um grafo direcionado. As dependências viabilizam o trabalho; não são barreiras:

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
```

Ao executar `/opsx:continue`, o comando verifica o que está pronto e oferece o próximo artefato. Você também pode criar vários artefatos prontos em qualquer ordem.

### Skills e comandos

O sistema legado usava arquivos de comando específicos para cada ferramenta:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

O OPSX usa o padrão emergente de **skills**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

As skills são reconhecidas por várias ferramentas de programação com IA e oferecem metadados mais completos.

No OPSX, o Codex usa somente skills. O OpenSpec não gera mais arquivos de prompt personalizados para o Codex; use os diretórios `.agents/skills/openspec-*` gerados.

---

## Continuar mudanças existentes

As mudanças em andamento funcionam normalmente com os comandos OPSX.

**Tem uma mudança ativa do fluxo de trabalho legado?**

```
/opsx:apply add-my-feature
```

O OPSX lê os artefatos existentes e continua de onde você parou.

**Quer adicionar mais artefatos a uma mudança existente?**

```
/opsx:continue add-my-feature
```

Mostra o que está pronto para ser criado, com base no que já existe.

**Precisa consultar o status?**

```bash
openspec status --change add-my-feature
```

---

## O novo sistema de configuração

### Estrutura de config.yaml

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Resolução do schema

Para determinar qual schema usar, o OPSX verifica nesta ordem:

1. **Opção da CLI**: `--schema <name>` (prioridade mais alta)
2. **Metadados da mudança**: `.openspec.yaml` no diretório da mudança
3. **Configuração do projeto**: `openspec/config.yaml`
4. **Padrão**: `spec-driven`

### Schemas disponíveis

| Schema | Artefatos | Ideal para |
|--------|-----------|----------|
| `spec-driven` | proposta → especificações → projeto → tarefas | A maioria dos projetos |

Liste todos os schemas disponíveis:

```bash
openspec schemas
```

### Schemas personalizados

Crie seu próprio fluxo de trabalho:

```bash
openspec schema init my-workflow
```

Ou crie uma cópia de um existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulte [Personalização](/pt-BR/customization/) para obter detalhes.

---

## Solução de problemas

### “Arquivos legados detectados no modo não interativo”

Você está executando em um ambiente de CI ou não interativo. Use:

```bash
openspec init --force
```

### Os comandos não aparecem após a migração

Reinicie o IDE. As skills são detectadas na inicialização.

### “ID de artefato desconhecido em rules”

Confira se as chaves de `rules:` correspondem aos IDs de artefato do schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Execute este comando para ver os IDs de artefato válidos:

```bash
openspec schemas --json
```

### A configuração não está sendo aplicada

1. Confirme que o arquivo está em `openspec/config.yaml` (não `.yml`)
2. Valide a sintaxe YAML
3. As alterações na configuração têm efeito imediato — não é necessário reiniciar

### project.md não foi migrado

O sistema preserva `project.md` intencionalmente, pois ele pode conter conteúdo personalizado. Revise-o manualmente, mova as partes úteis para `config.yaml` e depois exclua-o.

### Quer saber o que seria removido?

Execute `init` e recuse a limpeza no prompt; você verá o resumo completo do que foi detectado sem que nenhuma alteração seja feita.

---

## Referência rápida

### Arquivos após a migração

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### O que foi removido

- `.claude/commands/openspec/` — substituído por `.claude/skills/`
- `openspec/AGENTS.md` — obsoleto
- `openspec/project.md` — migrar para `config.yaml` e depois excluir
- Blocos de marcadores do OpenSpec em `CLAUDE.md`, `AGENTS.md` etc.

### Resumo dos comandos

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## Obter ajuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Issues no GitHub**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentação**: [referência completa do OPSX](/pt-BR/opsx/)
