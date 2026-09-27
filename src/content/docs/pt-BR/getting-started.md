---
title: "Primeiros passos"
---

Este guia explica como o OpenSpec funciona depois de instalado e inicializado. Para instruções de instalação, consulte o [README principal](https://github.com/Fission-AI/openspec/blob/79b6aa9c98f1e36795b2bc4ef2a8f770c6d3a777/README.md#quick-start) ou o [guia de instalação](/pt-BR/installation/). Está conhecendo a documentação agora? A [página inicial da documentação](/pt-BR/) apresenta todos os tópicos.

> **Onde digito esses comandos?** Em dois lugares — confundi-los é o tropeço inicial mais comum.
>
> - Os comandos `openspec ...` (como `openspec init`) são executados no **terminal**.
> - Os comandos `/opsx:...` (como `/opsx:propose`) são executados no **chat do seu assistente de IA**, na mesma caixa em que você pediria para ele escrever código.
>
> Não há um “modo interativo” separado para iniciar. Basta digitar o comando de barra no chat e deixar o assistente cuidar do resto. Explicação completa: [Como os comandos funcionam](/pt-BR/how-commands-work/).

## Seus primeiros cinco minutos

O ciclo completo, com cada etapa identificada pelo local em que acontece:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

São duas etapas de configuração no terminal; depois, você trabalha no chat. O restante deste guia explica o que cada etapa faz e o que você verá.

**Não quer fazer a parte do terminal por conta própria?** Cole o [prompt de configuração](/pt-BR/installation/#instale-com-seu-assistente-de-ia) no assistente. Ele executará as duas linhas e informará o que criou.

> **Ainda não sabe o que construir? Comece com `/opsx:explore`.** É um parceiro de reflexão sem compromisso que lê sua base de código, avalia opções e transforma uma ideia vaga em um plano concreto antes que qualquer código seja escrito. Quando tudo estiver claro, ele passa o trabalho para `/opsx:propose`. Esse é o melhor hábito para trabalhar com uma IA que, de outra forma, poderia construir com confiança a coisa errada. Consulte o [guia Explorar](/pt-BR/explore/).

## Como funciona

O OpenSpec ajuda você e seu assistente de programação com IA a combinar o que será construído antes que qualquer código seja escrito.

**Fluxo rápido padrão (perfil core):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Comece com `/opsx:explore` quando ainda estiver decidindo o que fazer, ou vá direto para `/opsx:propose` quando já souber. Explore faz parte do perfil padrão e estará disponível sempre que você quiser.

**Fluxo expandido (seleção de fluxo personalizado):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

O perfil global padrão é `core`, que inclui `propose`, `explore`, `apply`, `update`, `sync` e `archive`. Para habilitar os comandos de fluxo expandidos, use `openspec config profile` e depois `openspec update`.

## O que o OpenSpec cria

Depois de executar `openspec init`, seu projeto terá esta estrutura:

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**Dois diretórios principais:**

- **`specs/`** — a fonte de verdade. Essas especificações descrevem o comportamento atual do sistema e são organizadas por domínio (por exemplo, `specs/auth/`, `specs/payments/`).

- **`changes/`** — modificações propostas. Cada mudança tem sua própria pasta com todos os artefatos relacionados. Quando uma mudança é concluída, suas especificações são mescladas ao diretório principal `specs/`.

## Entendendo os artefatos

Cada pasta de mudança contém artefatos que orientam o trabalho:

| Artefato | Finalidade |
|----------|---------|
| `proposal.md` | O “porquê” e o “o quê” — registra intenção, escopo e abordagem |
| `specs/` | Especificações delta que mostram requisitos ADDED/MODIFIED/REMOVED |
| `design.md` | O “como” — abordagem técnica e decisões de arquitetura |
| `tasks.md` | Lista de verificação da implementação |

**Os artefatos se complementam:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Você pode voltar e refinar os artefatos anteriores sempre que aprender algo novo durante a implementação.

## Como funcionam as especificações delta

As especificações delta são o conceito central do OpenSpec. Elas mostram o que está mudando em relação às especificações atuais.

### O formato

As especificações delta usam seções para indicar o tipo de mudança:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### O que acontece ao arquivar

Ao arquivar uma mudança:

1. Os requisitos **ADDED** são acrescentados à especificação principal.
2. Os requisitos **MODIFIED** substituem a versão existente.
3. Os requisitos **REMOVED** são excluídos da especificação principal.

A pasta da mudança é movida para `openspec/changes/archive/` para manter o histórico de auditoria.

## Exemplo: sua primeira mudança

Vamos percorrer as etapas para adicionar modo escuro a um aplicativo.

### 1. Inicie a mudança (padrão)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Se você habilitou o perfil de fluxo expandido, também pode fazer isso em duas etapas: `/opsx:new` e depois `/opsx:ff` (ou avançar aos poucos com `/opsx:continue`).

### 2. O que é criado

**proposal.md** — registra a intenção:

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — diferença que mostra os novos requisitos:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — lista de verificação da implementação:

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implemente

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Durante a implementação, se perceber que o design precisa de ajustes, atualize o artefato e continue.

### 4. Arquive

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Agora suas especificações delta fazem parte das especificações principais e documentam como seu sistema funciona.

## Verificação e revisão

Use a CLI para verificar suas mudanças:

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Próximos passos

- [Comece explorando](/pt-BR/explore/) — use `/opsx:explore` para refletir sobre uma ideia antes de se comprometer com ela.
- [Revisando uma mudança](/pt-BR/reviewing-changes/) — o que conferir no plano preparado pela IA antes de escrever código.
- [Escrevendo boas especificações](/pt-BR/writing-specs/) — como criar requisitos e cenários sólidos.
- [Usando o OpenSpec em um projeto existente](/pt-BR/existing-projects/) — como começar em uma base de código grande e já estabelecida.
- [Editando e iterando em uma mudança](/pt-BR/editing-changes/) — atualizar artefatos, voltar e conciliar edições manuais.
- [Conceitos essenciais em resumo](/pt-BR/overview/) — todo o modelo mental em uma página.
- [Exemplos e receitas](/pt-BR/examples/) — mudanças reais, do início ao fim.
- [Fluxos de trabalho](/pt-BR/workflows/) — padrões comuns e quando usar cada comando.
- [Comandos](/pt-BR/commands/) — referência completa de todos os comandos de barra.
- [Conceitos](/pt-BR/concepts/) — entenda melhor especificações, mudanças e esquemas.
- [Personalização](/pt-BR/customization/) — adapte o OpenSpec à sua maneira de trabalhar.
- [Stores](/pt-BR/stores-beta/user-guide/) — planejamento que abrange repositórios ou equipes? Mantenha-o em um repositório próprio (beta).
- [Perguntas frequentes](/pt-BR/faq/) e [solução de problemas](/pt-BR/troubleshooting/) — quando algo não funcionar como esperado.
