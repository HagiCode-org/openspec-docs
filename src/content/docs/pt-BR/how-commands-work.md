---
title: "Como os comandos funcionam"
---

**O que você precisa saber: o OpenSpec tem dois tipos de comandos, e eles são executados em lugares diferentes.**

- Os comandos `openspec ...` são executados no **terminal**. (Exemplo: `openspec init`.)
- Os comandos `/opsx:...` são executados no **chat do seu assistente de IA**. (Exemplo: `/opsx:propose`.)

Se você já digitou `/opsx:propose` no terminal e nada aconteceu, esta página explica o motivo. Você está usando a metade errada do OpenSpec. Comandos de barra não são comandos de terminal; são instruções para seu assistente de programação com IA, na mesma caixa de chat em que você normalmente escreveria “adicione um formulário de login”.

Essa distinção é o obstáculo mais comum para novos usuários; vamos deixá-la bem clara.

## As duas metades

O OpenSpec é um projeto com duas funções.

**A CLI (metade do terminal).** Um programa chamado `openspec` que você instala e executa pelo shell. Ele configura seu projeto, lista e valida mudanças, mostra um painel e arquiva trabalhos concluídos. Você digita esses comandos no iTerm, no terminal do VS Code, no PowerShell — onde quer que execute `git` ou `npm`.

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**Os comandos de barra (metade do chat).** Comandos curtos, como `/opsx:propose` e `/opsx:apply`, que você digita no assistente de IA. Eles instruem a IA a seguir o fluxo de trabalho do OpenSpec: preparar uma proposta, escrever especificações, implementar com base na lista de tarefas e arquivar quando terminar. Você os digita no Claude Code, Cursor, Devin Desktop, Copilot ou no assistente que usar.

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

Veja o modelo mental em um diagrama:

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

Observe a seta. Executar `openspec init` no terminal é o que *instala* os comandos de barra na ferramenta de IA. A metade do terminal configura a metade do chat. Depois disso, o trabalho diário acontece principalmente no chat.

## “Como inicio o modo interativo?”

**Não há um modo interativo separado para iniciar.** Essa dúvida aparece com frequência e merece uma resposta direta.

Você não entra em um modo especial do OpenSpec. Basta abrir seu assistente de programação com IA como sempre e digitar um comando de barra no chat. O comando de barra *é* a forma de “entrar” no OpenSpec. Seu assistente o reconhece, carrega a skill correspondente do OpenSpec e começa a seguir o fluxo de trabalho.

As instruções, na prática, são:

1. Abra seu assistente de programação com IA (Claude Code, Cursor, Devin Desktop etc.) no projeto.
2. Digite `/opsx:propose` no chat, no mesmo lugar em que digitaria qualquer outro pedido.
3. Observe as sugestões de preenchimento automático: se o OpenSpec estiver instalado, `/opsx:propose`, `/opsx:apply` e outros comandos aparecerão quando você digitar a barra.

É só isso. Não há modo para alternar, daemon para iniciar ou janela separada.

Há um recurso realmente interativo no terminal: `openspec view`. Ele abre um painel para navegar pelas especificações e mudanças. Mas é um visualizador, não a ferramenta com que você prepara propostas e implementa. A construção acontece por meio dos comandos de barra no chat.

## Por que essa divisão existe

Vale a pena entender isso, pois explica por que o OpenSpec funciona com mais de 30 ferramentas de IA diferentes.

A CLI é o **motor**. Ela conhece as regras: como deve ser uma pasta de mudança, quais artefatos dependem de outros e como mesclar uma especificação delta à sua fonte de verdade. É igual em todas as ferramentas.

Os comandos de barra são o **volante**, e cada ferramenta de IA tem um modelo um pouco diferente. O Claude Code os chama de comandos. Cursor e Devin Desktop têm seus próprios formatos. Algumas ferramentas os chamam de skills. Ao executar `openspec init`, o OpenSpec gera o tipo correto de arquivo para cada ferramenta selecionada, para que a mesma intenção de `/opsx:propose` funcione com o assistente que você preferir.

Vantagem desse design: você aprende o fluxo uma vez e o leva de uma ferramenta para outra. A contrapartida: a sintaxe exata de um comando pode variar um pouco, como veremos na próxima seção.

## Sintaxe dos comandos de barra por ferramenta

A intenção é a mesma em todas as ferramentas. A grafia corresponde ao arquivo carregado pela ferramenta.

| Arquivo de comando da ferramenta | Como digitá-lo | Exemplos de ferramentas |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| nenhum — somente skills | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, `.agents` compartilhado |
| nenhum — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| nenhum — Codex CLI | `$openspec-propose` | Codex |

Devin é a única ferramenta que aparece em duas linhas. O Devin Desktop lê
`.devin/workflows/`, então `/opsx-propose` funciona nele; o [Devin Local não oferece
suporte](https://docs.devin.ai/desktop/devin-local), portanto, nesse agente use a
skill `/openspec-propose`. As skills que o OpenSpec grava em
`.devin/skills/` funcionam nos dois agentes, e é por isso que eles se referenciam pelo nome da skill.

Todas as ferramentas estão listadas em [Como invocar](/pt-BR/supported-tools/#como-invocar) — essa
tabela é a fonte de verdade. Duas linhas nem sequer representam comandos de barra: o Amazon Q
carrega os arquivos em uma biblioteca de prompts invocada com `@`, e as últimas linhas
usam o nome da *skill*, que não é o ID do comando (`/opsx:apply` corresponde à skill
`openspec-apply-change`).

Se tiver dúvidas, leia a linha “Primeiros passos” exibida por `openspec init`: ela já
usa o formato registrado pelas suas ferramentas. Também é possível digitar uma barra
e observar as sugestões de preenchimento automático, nas ferramentas que oferecem comandos de barra.

## Como os comandos foram instalados: skills e comandos

Quando você executa `openspec init` (ou `openspec update`), o OpenSpec grava arquivos pequenos no projeto para que sua ferramenta de IA encontre o fluxo de trabalho. Conforme a ferramenta e as configurações, esses arquivos são **skills**, **comandos** ou ambos.

- **Skills** ficam em locais como `.claude/skills/openspec-*/SKILL.md`. São o padrão multiplataforma emergente: uma pasta de instruções detectada automaticamente pelo assistente.
- **Comandos** ficam em locais como `.cursor/commands/opsx-<id>.md` ou `.claude/commands/opsx/<id>.md` — o formato pertence à ferramenta e determina como digitar o comando. São os antigos arquivos de comando de barra específicos de cada ferramenta. O Codex não recebe arquivos de comando gerados; use `.agents/skills/openspec-*`.

Você não precisa se preocupar com qual formato sua ferramenta usa. Basta digitar o comando de barra. Mas saber que esses arquivos existem ajuda quando algo dá errado: se os comandos desaparecerem, normalmente esses arquivos estão ausentes ou desatualizados, e `openspec update` os gera novamente.

Consulte [Ferramentas compatíveis](/pt-BR/supported-tools/) para ver os caminhos exatos de cada ferramenta e o [Guia de migração](/pt-BR/migration-guide/) para saber como as skills substituíram a antiga abordagem baseada apenas em comandos.

## Confirmando a instalação

Verificações rápidas, da mais simples à mais demorada:

1. **Digite uma barra no chat da IA.** Comece a digitar `/opsx` e observe as sugestões de preenchimento automático. Se aparecerem, está tudo pronto. Em ferramentas que usam apenas skills (Codex, Kimi Code, CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent ou o destino compartilhado `.agents`), `/opsx` nunca será completado, mesmo com uma instalação correta — em vez disso, tente o nome da skill indicado na tabela acima.
2. **Procure os arquivos.** No Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. Outras ferramentas usam seus próprios diretórios, listados em [Ferramentas compatíveis](/pt-BR/supported-tools/).
3. **Execute a configuração novamente.** Na raiz do projeto, execute `openspec update`. O comando gera novamente os arquivos de skills e comandos das ferramentas configuradas.
4. **Reinicie o assistente.** Muitas ferramentas procuram skills e comandos ao iniciar, então abrir uma nova janela pode resolver o problema.

## Quais comandos estão disponíveis?

Por padrão, o OpenSpec instala o conjunto **core** de comandos de barra:

- `/opsx:explore`: reflita sobre uma ideia com a IA antes de se comprometer com uma mudança (ótimo primeiro passo quando há dúvidas)
- `/opsx:propose`: crie uma mudança e prepare todos os artefatos de planejamento em uma etapa
- `/opsx:apply`: implemente a mudança percorrendo a lista de tarefas
- `/opsx:update`: revise os artefatos de planejamento e mantenha-os coerentes
- `/opsx:sync`: mescle as atualizações das especificações da mudança às especificações principais (geralmente automático)
- `/opsx:archive`: finalize uma mudança e arquive-a

Um bom ritmo padrão é usar `explore` enquanto decide o que fazer, e depois `propose`, `apply` e `archive`. O guia [Comece explorando](/pt-BR/explore/) explica por que essa etapa inicial vale a pena.

Também há um conjunto **expandido** para quem deseja um controle mais detalhado (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Ative-o com `openspec config profile` e aplique a configuração usando `openspec update`.

Está começando? `/opsx:onboard` (do conjunto expandido) conduz você por uma mudança completa na sua própria base de código, explicando cada etapa. É a introdução mais acessível possível.

Para saber em detalhes o que cada comando faz, consulte [Comandos](/pt-BR/commands/). Para decidir quando usar cada um, veja [Fluxos de trabalho](/pt-BR/workflows/).

## Uma primeira execução sem complicações

Reunindo tudo, veja a sequência completa com cada etapa identificada pelo local em que acontece.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

São duas etapas de configuração no terminal. Depois, você trabalha no chat. Esse é o ritmo.

## Conteúdo relacionado

- [Primeiros passos](/pt-BR/getting-started/): guia completo para sua primeira mudança
- [Comandos](/pt-BR/commands/): detalhes de todos os comandos de barra
- [CLI](/pt-BR/cli/): detalhes de todos os comandos de terminal
- [Ferramentas compatíveis](/pt-BR/supported-tools/): sintaxe e locais de arquivos de cada ferramenta
- [Perguntas frequentes](/pt-BR/faq/): mais respostas rápidas
- [Solução de problemas](/pt-BR/troubleshooting/): correções quando os comandos não aparecem
