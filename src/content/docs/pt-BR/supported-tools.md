---
title: "Ferramentas compatíveis"
---

O OpenSpec funciona com muitos assistentes de programação com IA. Ao executar `openspec init`, ele configura as ferramentas selecionadas de acordo com o perfil/fluxo de trabalho ativo e o modo de distribuição.

## Como funciona

Para cada ferramenta selecionada, o OpenSpec pode instalar:

1. **Skills** (se o modo de distribuição incluir skills): `.../skills/openspec-*/SKILL.md`
2. **Comandos** (se o modo de distribuição incluir comandos): arquivos de comando `opsx-*` específicos da ferramenta

O Codex usa apenas skills: o OpenSpec instala `.agents/skills/openspec-*/SKILL.md` para o Codex mesmo quando o modo de distribuição está definido como `commands`, e não gera arquivos de prompt personalizados para ele. As skills existentes gerenciadas pelo OpenSpec no caminho legado `.codex/skills` são conciliadas depois que suas substitutas são gravadas; arquivos personalizados ou divergentes são preservados.

Por padrão, o OpenSpec usa o perfil `core`, que inclui:
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

Você pode habilitar os fluxos expandidos (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) com `openspec config profile` e depois executar `openspec update`.

## Como invocar

Esta documentação usa `/opsx:propose` como nome canônico, mas cada ferramenta o
escreve conforme carrega o arquivo criado pelo OpenSpec. Encontre o caminho do comando
da sua ferramenta na [Referência de diretórios das ferramentas](#referência-de-diretórios-das-ferramentas) abaixo e compare-o com os formatos desta tabela.

| Arquivo de comando gravado pelo OpenSpec | Como invocar | Ferramentas |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — a pasta `opsx/` define o namespace | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — o nome do arquivo é o comando | `/opsx-<id>` | Todas as demais ferramentas com arquivos de comando gerados, exceto Amazon Q e Devin |
| `.devin/workflows/opsx-<id>.md` — lido por apenas um dos dois agentes Devin | `/opsx-<id>` no Devin Desktop, `/openspec-<skill>` no Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — um prompt, não um comando | `@opsx-<id>` | Amazon Q Developer |
| nenhum — somente skills | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, `.agents` compartilhado |
| nenhum — Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| nenhum — Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` não é reconhecido](https://github.com/openai/codex/issues/11817)) |

Assim, `/opsx:propose` é `/opsx-propose` no Cursor, `@opsx-propose` no Amazon Q e
`$openspec-propose` no Codex.

Dois elementos variam de forma independente, por isso as linhas não podem ser combinadas:

- **O nome.** As linhas 1–2 diferem apenas na forma como o arquivo nomeia o comando; a
  base `opsx-<id>` / `opsx:<id>` é a mesma em todas as ferramentas com arquivos de comando
  gerados.
- **O invólucro.** O Amazon Q carrega os arquivos em uma biblioteca de prompts invocada com
  `@`. Ferramentas que usam apenas skills não geram arquivos de comando, então as três
  últimas linhas usam nomes de *skills* — listados em
  [Nomes de skills geradas](#nomes-de-skills-geradas) — que não correspondem um a um
  aos IDs de comando (`/opsx:apply` corresponde à skill `openspec-apply-change`).

Os padrões de caminho dos comandos acima não especificam a extensão (`.*`) de propósito: a
extensão depende da ferramenta (`.toml` para Gemini CLI, `.prompt` para Continue,
`.prompt.md` para Kiro e GitHub Copilot), e algumas ferramentas mostram o nome com
a extensão no seletor. Compare o formato do diretório, não a extensão.

Os arquivos gerados pelo OpenSpec e a indicação “Primeiros passos” exibida após a configuração
já usam o formato correto para as ferramentas selecionadas — portanto, a resposta mais rápida é
ler essa indicação.

## Referência de diretórios das ferramentas

| Ferramenta (ID) | Padrão do caminho de skills | Padrão do caminho de comandos |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use invocações `/openspec-*` baseadas em skills) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | Não gerado (somente skills; use `$openspec-*`) |
| Devin Desktop, anteriormente Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use invocações `/openspec-*` baseadas em skills) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Não gerado (sem adaptador de comandos; use invocações `/openspec-*` baseadas em skills) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use invocações `/skill:openspec-*` baseadas em skills) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use as skills do MiniMax Code) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use invocações `/openspec-*` baseadas em skills) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | Não gerado. O Rovo não oferece comandos de barra — encontra skills automaticamente ou por solicitação (por exemplo, “use a skill openspec-propose”); `/skills` serve apenas para gerenciá-las. O conteúdo gerado menciona as skills pelo nome, nunca como comandos `/openspec-*`. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | Não gerado (somente skills; use `/openspec-*` ou `@openspec-*`) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| Skills compartilhadas `.agents` (`agents`) | `.agents/skills/openspec-*/SKILL.md` | Não gerado (sem adaptador de comandos; use invocações `/openspec-*` baseadas em skills) |

\*\* Os arquivos de prompt do GitHub Copilot são reconhecidos como comandos de barra personalizados nas extensões de IDE (VS Code, JetBrains, Visual Studio). Atualmente, a CLI do Copilot não consome diretamente `.github/prompts/*.prompt.md`. Selecionar `github-copilot` também pode configurar o **agente de codificação na nuvem** hospedado no GitHub — consulte [Agente de codificação na nuvem do GitHub Copilot](#agente-de-codificação-na-nuvem-do-github-copilot) abaixo.

\*\*\* Por padrão, Hermes carrega skills de `~/.hermes/skills/`. Para usar skills do OpenSpec locais ao projeto, adicione o diretório `.hermes/skills/` do projeto a `skills.external_dirs` em `~/.hermes/config.yaml`; Hermes então disponibiliza as skills com comandos de barra voltados ao usuário, como `/openspec-propose`.

\*\*\*\* O Windsurf foi [renomeado para Devin Desktop](https://docs.devin.ai/desktop/devin-desktop-faq) em 2 de junho de 2026, e seu diretório de configuração mudou: `.devin/` é o local preferencial para leitura e gravação; `.windsurf/` é um local legado somente para leitura. O OpenSpec acompanha a mudança de nome: o ID da ferramenta é `devin`, e `--tools windsurf` continua sendo resolvido para esse ID, para que os scripts de configuração existentes continuem funcionando. Se um projeto ainda tiver arquivos do OpenSpec em `.windsurf/`, a próxima execução de `openspec update` oferecerá movê-los; se você recusar, eles permanecerão no lugar, e arquivos criados por você nunca serão alterados. Os fluxos são invocados pelo nome do arquivo, então `.devin/workflows/opsx-apply.md` é `/opsx-apply`. O [agente Devin Local não oferece suporte a fluxos de trabalho](https://docs.devin.ai/desktop/devin-local) — apenas a skills, e não lê `.windsurf/` —, portanto, quando o OpenSpec grava skills para o Devin, o conteúdo delas e a indicação inicial usam invocações `/openspec-*`, compatíveis com os dois agentes. Com a distribuição somente de comandos, nenhuma skill é gravada, e ambos usam `/opsx-*`.

O suporte ao SourceCraft Code Assistant destina-se à extensão do VS Code. Seus [comandos personalizados](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands) e [skills](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills) estão disponíveis apenas no VS Code. Esta integração não configura o SourceCraft na web nem no JetBrains.

Com a distribuição somente de skills, peça ao Code Assistant que use a skill `openspec-propose` para trabalhar na sua ideia. As skills são ativadas conforme a correspondência com a solicitação; o OpenSpec não gera comandos `/openspec-*` para essa ferramenta.

MiniMax Code é uma integração global que usa apenas skills. O OpenSpec grava somente seus
diretórios `openspec-*` em `~/.minimax/skills/`; ele não cria
diretórios `.minimax` ou `.mavis` locais ao repositório. A distribuição somente de comandos deixa
intactas as skills globais existentes do MiniMax Code, para que a configuração de distribuição de um projeto
não possa remover skills usadas por outro.

### Agente de codificação na nuvem do GitHub Copilot

O [agente de codificação do Copilot](https://docs.github.com/en/copilot/using-github-copilot/coding-agent) do GitHub é executado no GitHub, em um ambiente do GitHub Actions — separado do Copilot no editor. O OpenSpec pode configurá-lo para usar a CLI do OpenSpec, gerando dois arquivos:

- `.github/workflows/copilot-setup-steps.yml` — installs `@fission-ai/openspec` in the agent's environment
- `.github/agents/openspec.agent.md` — tells the agent how to drive OpenSpec

Como isso grava um fluxo do GitHub Actions no repositório, o recurso é **opcional**:

| Como | Comportamento |
|-----|----------|
| `openspec init` (interativo) | Pergunta se deve configurar os arquivos na nuvem. O padrão é **Não**. |
| `openspec init --copilot-cloud` | Configura-os sem perguntar (para scripts/CI). |
| `openspec init --no-copilot-cloud` | Ignora-os sem perguntar e remove os arquivos gerados anteriormente. |
| `openspec update` | Nunca pergunta. Atualiza os arquivos somente se você optou por usá-los (ou se o projeto já os tiver). Se você optou por não usá-los, remove os arquivos de nuvem gerenciados pelo OpenSpec. |

Sua escolha é salva em `openspec/config.yaml` como `githubCopilot.cloudAgent: true|false`, e é respeitada por atualizações não interativas. O OpenSpec só grava ou remove arquivos cujo conteúdo tenha gerado — se você personalizar `copilot-setup-steps.yml` ou `openspec.agent.md`, ou se já tiver arquivos próprios, eles não serão alterados (e `init`/`update` informarão isso).

### Quando escolher o destino compartilhado `.agents`

`agents` é a opção independente de fornecedor: grava skills em `.agents/skills/`, a
raiz compartilhada lida por muitas ferramentas de agente, em vez de usar um diretório específico da ferramenta.

| Situação | Escolha |
|-----------|------|
| Sua ferramenta tem uma linha própria acima | O ID dela — você terá a integração específica, incluindo comandos de barra se houver suporte |
| Vários agentes no mesmo repositório, todos lendo `.agents/skills` | `agents` — uma árvore de skills em vez de uma por ferramenta |
| Sua ferramenta ainda não está listada, mas lê `.agents/skills` | `agents` |

Você pode selecioná-la junto com um ID específico de ferramenta; normalmente cada um grava em sua
própria raiz. Codex e Zed Agent são exceções porque usam a mesma raiz canônica
`.agents` root. If Codex is selected with Zed or `agents`, OpenSpec keeps one
Codex-led tree. Its handoffs name both `$openspec-*` for Codex and
`/openspec-*` for other agents, so `--tools all` and existing multi-agent
setups keep working without two writers overwriting the same files.
O OpenSpec também oferece essa opção automaticamente quando o projeto tem um diretório `.agents/skills/` —
um `.agents/` vazio não basta, pois as ferramentas também usam essa raiz para regras
e definições de subagentes. Observe que `.agents` não é `.agent`: o diretório no singular
pertence ao Antigravity.

Há duas coisas importantes:

- **Somente skills.** Não existe adaptador de comandos, então nenhum arquivo de comando `opsx-*` é
  gravado; com um modo de distribuição que inclui comandos, `openspec init` lista `agents`
  entre as ferramentas informadas em `Commands skipped for: … (no adapter)`.
  Invoque os fluxos de trabalho pelo nome da skill —
  a maioria dos assistentes que leem `.agents/skills` usa `/openspec-propose`, o formato
  indicado pela mensagem de configuração do OpenSpec. O destino é independente de fornecedor, então confira a
  documentação do assistente se ele usar outro formato.
- **Nenhum `AGENTS.md` é criado ou editado.** O destino é o diretório `.agents/`.
  Se o `AGENTS.md` raiz ainda contiver blocos marcadores do OpenSpec de uma
  versão anterior, `openspec update` os removerá — consulte o [Guia de migração](/pt-BR/migration-guide/).

O suporte ao Zed aqui é para o Zed Agent integrado. Zed External Agents e Terminal
Threads usam suas próprias integrações. Agent Skills requerem
[Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) ou superior.
As skills locais ao projeto ficam indisponíveis em uma árvore de trabalho não confiável até que você
[conceda confiança](https://zed.dev/docs/worktree-trust).

Como `.agents/skills/` é compartilhado pelo Codex, pelo Zed Agent e pelo destino independente de fornecedor,
vale a pena saber o que o OpenSpec gerencia nesse local:
o OpenSpec grava, atualiza e remove apenas os diretórios de skills `openspec-*` dos
fluxos de trabalho selecionados, além de um marcador `.openspec-target` que registra se o Codex,
Zed Agent ou o destino independente de fornecedor criou essa árvore compartilhada. Todo o restante desse
diretório é preservado. Considere os nomes `openspec-*` e o marcador como pertencentes ao OpenSpec —
alterações dentro deles serão substituídas na próxima execução de `openspec update`, assim como acontece com
qualquer outra ferramenta.

Em projetos sem marcador, o OpenSpec infere a propriedade pelas referências das skills gerenciadas:
`$openspec-*` indica Codex, e `/openspec-*` indica o destino independente de fornecedor. Uma
árvore canônica genérica ao lado de `.codex/skills` legado é tratada como uma instalação
antiga com dois destinos e consolidada na árvore compartilhada compatível.

`openspec update` também respeita essa propriedade. Se o projeto usa `.agents` como
destino independente de fornecedor e uma instalação antiga do Codex for detectada apenas por
arquivos de prompt avulsos, a atualização mantém a árvore `agents` estabelecida em vez de
reescrevê-la com a sintaxe do Codex, e preserva esses arquivos de prompt legados
em vez de excluí-los. Para transferir a árvore compartilhada ao Codex, execute explicitamente
`openspec init --tools codex`.

## Configuração não interativa

Para CI/CD ou configurações feitas por script, use `--tools` (e, se necessário, `--profile`):

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**IDs de ferramentas disponíveis (`--tools`)** — `windsurf` também é aceito como alias de `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`

## Instalação conforme o fluxo de trabalho

O OpenSpec instala artefatos de fluxo de trabalho de acordo com os fluxos selecionados:

- **Perfil core (padrão):** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Seleção personalizada:** qualquer subconjunto de todos os IDs de fluxo de trabalho:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Em outras palavras, a quantidade de skills e comandos depende do perfil e do modo de distribuição, não é fixa.

## Nomes de skills geradas

Quando selecionadas na configuração do perfil/fluxo de trabalho, o OpenSpec gera estas skills:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Consulte [Comandos](/pt-BR/commands/) para entender o comportamento dos comandos e [CLI](/pt-BR/cli/) para ver as opções de `init`/`update`.

## Conteúdo relacionado

- [Referência da CLI](/pt-BR/cli/) — comandos de terminal
- [Comandos](/pt-BR/commands/) — comandos de barra e skills
- [Primeiros passos](/pt-BR/getting-started/) — configuração inicial
