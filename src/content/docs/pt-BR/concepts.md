---
title: "Conceitos"
---

Este guia explica as ideias centrais do OpenSpec e como elas se conectam. Para orientações práticas, consulte [Primeiros passos](/pt-BR/getting-started/) e [Fluxos de trabalho](/pt-BR/workflows/).

## Filosofia

O OpenSpec se baseia em quatro princípios:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Por que esses princípios importam

**Fluido, não rígido.** Sistemas tradicionais de especificação prendem você a etapas: primeiro planejar, depois implementar e, por fim, concluir. O OpenSpec é mais flexível: você pode criar artefatos em qualquer ordem que faça sentido para o trabalho.

**Iterativo, não cascata.** Os requisitos mudam e a compreensão se aprofunda. Uma abordagem que parecia boa no início talvez não se sustente depois que você conhecer a base de código. O OpenSpec acolhe essa realidade.

**Simples, não complexo.** Alguns frameworks de especificação exigem muita configuração, formatos rígidos ou processos pesados. O OpenSpec não atrapalha: inicialize em segundos, comece a trabalhar na hora e personalize apenas se precisar.

**Prioriza projetos existentes.** A maior parte do trabalho de software não começa do zero: modifica sistemas existentes. A abordagem baseada em deltas do OpenSpec facilita especificar mudanças no comportamento existente, em vez de apenas descrever sistemas novos.

## Visão geral

O OpenSpec organiza o trabalho em duas áreas principais:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

As **especificações** são a fonte da verdade: descrevem como o sistema se comporta atualmente.

As **mudanças** são modificações propostas: ficam em pastas separadas até que você esteja pronto para mesclá-las.

Essa separação é fundamental. Você pode trabalhar em várias mudanças em paralelo sem conflitos, revisar uma mudança antes que ela afete as especificações principais e, ao arquivá-la, mesclar seus deltas de forma organizada à fonte da verdade.

## Especificações

As especificações descrevem o comportamento do sistema por meio de requisitos e cenários estruturados.

### Estrutura

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Organize as especificações por domínio — agrupamentos lógicos que façam sentido para seu sistema. Padrões comuns:

- **Por área de funcionalidade**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato das especificações

Uma especificação contém requisitos, e cada requisito tem cenários:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Elementos principais:**

| Elemento | Finalidade |
|---------|---------|
| `## Purpose` | Descrição geral do domínio desta especificação |
| `### Requirement:` | Um comportamento específico que o sistema deve ter |
| `#### Scenario:` | Um exemplo concreto do requisito em ação |
| SHALL/MUST/SHOULD | Termos da RFC 2119 que indicam a força do requisito |

### Por que estruturar as especificações assim

**Requisitos representam o “o quê”**: declaram o que o sistema deve fazer sem especificar a implementação.

**Cenários representam o “quando”**: fornecem exemplos concretos que podem ser verificados. Bons cenários:
- Podem ser testados (é possível escrever um teste automatizado para eles)
- Abrangem tanto o fluxo esperado quanto os casos extremos
- Usam Given/When/Then ou um formato estruturado semelhante

**Os termos da RFC 2119** (SHALL, MUST, SHOULD, MAY) comunicam a intenção:
- **MUST/SHALL** — requisito obrigatório
- **SHOULD** — recomendado, mas admite exceções
- **MAY** — opcional

### O que uma especificação é (e o que não é)

Uma especificação é um **contrato de comportamento**, não um plano de implementação.

Uma boa especificação descreve:
- Comportamentos observáveis dos quais dependem as pessoas usuárias ou os sistemas subsequentes
- Entradas, saídas e condições de erro
- Restrições externas (segurança, privacidade, confiabilidade, compatibilidade)
- Cenários que podem ser testados ou validados explicitamente

Evite incluir nas especificações:
- Nomes de classes ou funções internas
- Escolhas de bibliotecas ou frameworks
- Detalhes de implementação passo a passo
- Planos detalhados de execução (eles pertencem a `design.md` ou `tasks.md`)

Teste rápido:
- Se a implementação puder mudar sem alterar o comportamento visível externamente, provavelmente esse detalhe não pertence à especificação.

### Mantenha a leveza: rigor progressivo

O OpenSpec busca evitar burocracia. Use o nível mais simples que ainda permita verificar a mudança.

**Especificação Lite (padrão):**
- Requisitos curtos, centrados no comportamento
- Escopo e itens fora do escopo bem definidos
- Algumas verificações concretas de aceitação

**Especificação completa (para riscos maiores):**
- Mudanças que envolvem várias equipes ou repositórios
- Mudanças em APIs/contratos, migrações ou questões de segurança/privacidade
- Mudanças em que a ambiguidade provavelmente causaria retrabalho dispendioso

A maioria das mudanças deve permanecer no modo Lite.

### Colaboração entre pessoas e agentes

Em muitas equipes, pessoas exploram o problema e agentes elaboram os artefatos. O ciclo esperado é:

1. A pessoa fornece a intenção, o contexto e as restrições.
2. O agente transforma essas informações em requisitos e cenários centrados no comportamento.
3. O agente mantém os detalhes de implementação em `design.md` e `tasks.md`, não em `spec.md`.
4. A validação confirma a estrutura e a clareza antes da implementação.

Isso mantém as especificações legíveis para pessoas e consistentes para agentes.

## Mudanças

Uma mudança é uma modificação proposta para seu sistema, agrupada em uma pasta com tudo o que é necessário para compreendê-la e implementá-la.

### Estrutura de uma mudança

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Cada mudança é autocontida. Ela contém:
- **Artefatos** — documentos que registram a intenção, o projeto e as tarefas
- **Especificações delta** — especificações do que será adicionado, alterado ou removido
- **Metadados** — configuração opcional específica da mudança

### Por que as mudanças são pastas

Agrupar uma mudança em uma pasta traz vários benefícios:

1. **Tudo no mesmo lugar.** Proposta, projeto, tarefas e especificações ficam juntos. Não é preciso procurá-los em locais diferentes.

2. **Trabalho em paralelo.** Várias mudanças podem coexistir sem conflitos. Trabalhe em `add-dark-mode` enquanto `fix-auth-bug` também está em andamento.

3. **Histórico organizado.** Ao serem arquivadas, as mudanças vão para `changes/archive/` com todo o contexto preservado. Assim, é possível entender não só o que mudou, mas também por quê.

4. **Fácil de revisar.** Uma pasta de mudança é simples de revisar: abra-a, leia a proposta, confira o projeto e veja os deltas das especificações.

## Artefatos

Artefatos são os documentos que orientam o trabalho dentro de uma mudança.

### Fluxo dos artefatos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Os artefatos se apoiam uns nos outros. Cada um fornece contexto para o seguinte.

### Tipos de artefato

#### Proposta (`proposal.md`)

A proposta registra, em alto nível, a **intenção**, o **escopo** e a **abordagem**.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Quando atualizar a proposta:**
- Quando o escopo mudar (for reduzido ou ampliado)
- Quando a intenção ficar mais clara (melhor compreensão do problema)
- Quando a abordagem mudar fundamentalmente

#### Especificações (deltas em `specs/`)

As especificações delta descrevem **o que muda** em relação às especificações atuais. Consulte [Especificações delta](#especificações-delta) abaixo.

#### Projeto (`design.md`)

O projeto registra a **abordagem técnica** e as **decisões de arquitetura**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Quando atualizar o projeto:**
- A implementação mostrar que a abordagem não funciona
- Uma solução melhor for descoberta
- As dependências ou restrições mudarem

#### Tarefas (`tasks.md`)

As tarefas são a **lista de verificação da implementação**: etapas concretas com caixas de seleção.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Boas práticas para tarefas:**
- Agrupe tarefas relacionadas sob títulos
- Use numeração hierárquica (1.1, 1.2 etc.)
- Mantenha as tarefas pequenas o suficiente para serem concluídas em uma sessão
- Indique como cada tarefa será verificada (um teste, comando ou resultado observável)
- Inclua os testes e a documentação necessários em cada grupo, não em um grupo final para colocar tudo em dia
- Marque as tarefas à medida que forem concluídas

## Especificações delta

As especificações delta são o conceito-chave que permite ao OpenSpec trabalhar com bases de código existentes. Elas descrevem **o que muda**, em vez de repetirem a especificação inteira.

### Formato

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Seções delta

| Seção | Significado | O que acontece ao arquivar |
|---------|---------|------------------------|
| `## ADDED Requirements` | Novo comportamento | Adicionado à especificação principal |
| `## MODIFIED Requirements` | Comportamento alterado | Substitui o requisito existente |
| `## REMOVED Requirements` | Comportamento descontinuado | Excluído da especificação principal; remover o último requisito desativa a capacidade e exclui seu arquivo de especificação quando a mudança declara `retire_capabilities: true` |
| `## Purpose` | Finalidade de uma capacidade totalmente nova | Define a finalidade da especificação principal que será criada; ignorado se a especificação já existir |

### Por que usar deltas em vez de especificações completas

**Clareza.** Um delta mostra exatamente o que muda. Ao ler uma especificação completa, você teria de compará-la mentalmente com a versão atual.

**Prevenção de conflitos.** Duas mudanças podem alterar o mesmo arquivo de especificação sem conflitos, desde que modifiquem requisitos diferentes.

**Eficiência na revisão.** Quem revisa vê a mudança, não o contexto inalterado. O foco fica no que importa.

**Adequação a projetos existentes.** A maior parte do trabalho modifica comportamentos existentes. Os deltas tratam essas modificações como parte central do processo, não como algo secundário.

## Schemas

Schemas definem os tipos de artefato e suas dependências em um fluxo de trabalho.

### Como os schemas funcionam

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Os artefatos formam um grafo de dependências:**

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

**As dependências viabilizam o trabalho, não são barreiras.** Elas mostram o que pode ser criado, não o que você precisa criar em seguida. Você pode pular o projeto se não precisar dele. Pode criar as especificações antes ou depois do projeto: ambos dependem apenas da proposta.

### Schemas integrados

**spec-driven** (padrão)

O fluxo de trabalho padrão para desenvolvimento orientado a especificações:

```
proposal → specs → design → tasks → implement
```

Ideal para: a maioria das funcionalidades em que se deseja chegar a um acordo sobre as especificações antes da implementação.

### Schemas personalizados

Crie schemas personalizados para o fluxo de trabalho da sua equipe:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Exemplo de schema personalizado:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

Consulte [Personalização](/pt-BR/customization/) para obter todos os detalhes sobre a criação e o uso de schemas personalizados.

## Arquivamento

O arquivamento conclui uma mudança ao mesclar suas especificações delta às especificações principais e preservar a mudança no histórico.

### O que acontece ao arquivar

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Processo de arquivamento

1. **Mesclar os deltas.** Cada seção da especificação delta (ADDED/MODIFIED/REMOVED) é aplicada à especificação principal correspondente.

2. **Mover para o arquivo.** A pasta da mudança é movida para `changes/archive/` com um prefixo de data para manter a ordem cronológica.

3. **Preservar o contexto.** Todos os artefatos permanecem intactos no arquivo. Você pode consultá-los para entender por que a mudança foi feita.

### Por que arquivar é importante

**Estado organizado.** As mudanças ativas (`changes/`) mostram apenas o trabalho em andamento. O trabalho concluído sai do caminho.

**Trilha de auditoria.** O arquivo preserva todo o contexto de cada mudança: não só o que mudou, mas também a proposta que explica por quê, o projeto que explica como e as tarefas que mostram o trabalho realizado.

**Evolução das especificações.** As especificações crescem naturalmente à medida que as mudanças são arquivadas. Cada arquivamento mescla seus deltas e, com o tempo, constrói uma especificação abrangente.

## Como tudo se conecta

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**O ciclo virtuoso:**

1. As especificações descrevem o comportamento atual
2. As mudanças propõem modificações (como deltas)
3. A implementação concretiza as mudanças
4. O arquivamento mescla os deltas às especificações
5. As especificações passam a descrever o novo comportamento
6. A próxima mudança parte das especificações atualizadas

## Glossário

| Termo | Definição |
|------|------------|
| **Artefato** | Documento de uma mudança (proposta, projeto, tarefas ou especificações delta) |
| **Arquivamento** | Processo de conclusão de uma mudança e mesclagem dos deltas às especificações principais |
| **Mudança** | Modificação proposta para o sistema, agrupada em uma pasta com seus artefatos |
| **Especificação delta** | Especificação que descreve mudanças (ADDED/MODIFIED/REMOVED) em relação às especificações atuais |
| **Domínio** | Agrupamento lógico de especificações (por exemplo, `auth/`, `payments/`) |
| **Requisito** | Comportamento específico que o sistema deve ter |
| **Cenário** | Exemplo concreto de um requisito, normalmente no formato Given/When/Then |
| **Schema** | Definição dos tipos de artefato e suas dependências |
| **Especificação** | Documento que descreve o comportamento do sistema e contém requisitos e cenários |
| **Fonte da verdade** | Diretório `openspec/specs/`, que contém o comportamento atual acordado |

## Próximos passos

- [Primeiros passos](/pt-BR/getting-started/) — primeiros passos práticos
- [Fluxos de trabalho](/pt-BR/workflows/) — padrões comuns e quando usar cada um
- [Comandos](/pt-BR/commands/) — referência completa dos comandos
- [Personalização](/pt-BR/customization/) — criação de schemas personalizados e configuração do projeto
