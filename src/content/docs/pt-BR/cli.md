---
title: "Referência da CLI"
---

A CLI do OpenSpec (`openspec`) oferece comandos de terminal para configurar
projetos, validar conteúdo, consultar status e gerenciar recursos. Esses
comandos complementam os comandos de barra para IA (como `/opsx:propose`)
descritos em [Comandos](/pt-BR/commands/).

## Resumo

| Categoria | Comandos | Finalidade |
|----------|----------|---------|
| **Configuração** | `init`, `update` | Inicializar e atualizar o OpenSpec no projeto |
| **Stores (repositórios OpenSpec independentes)** | `store setup`, `store register`, `store unregister`, `store remove`, `store list`, `store doctor` | Gerenciar stores — repositórios OpenSpec independentes que você registrou |
| **Integridade** | `doctor` | Informar a integridade das relações da raiz resolvida |
| **Contexto de trabalho** | `context` | Reunir o conjunto de trabalho (raiz + stores referenciadas) |
| **Worksets pessoais** | `workset create`, `workset list`, `workset open`, `workset remove` | Manter e abrir visões de trabalho locais e pessoais na sua ferramenta |
| **Navegação** | `list`, `view`, `show` | Explorar mudanças e especificações |
| **Validação** | `validate` | Verificar se há problemas nas mudanças e especificações |
| **Ciclo de vida** | `archive` | Finalizar mudanças concluídas |
| **Fluxo de trabalho** | `new change`, `status`, `instructions`, `templates`, `schemas` | Oferecer suporte a fluxos orientados por artefatos |
| **Schemas** | `schema init`, `schema fork`, `schema validate`, `schema which` | Criar e gerenciar fluxos de trabalho personalizados |
| **Configuração** | `config` | Consultar e modificar configurações |
| **Utilitários** | `feedback`, `completion` | Enviar comentários e integrar ao shell |

---

## Comandos para pessoas e agentes

A maioria dos comandos da CLI foi projetada para **uso por pessoas** no
terminal. Alguns também aceitam **uso por agentes/scripts**, por meio de saída
JSON.

### Comandos somente para pessoas

Estes comandos são interativos e foram projetados para uso no terminal:

| Comando | Finalidade |
|---------|---------|
| `openspec init` | Inicializar o projeto (prompts interativos) |
| `openspec view` | Abrir painel interativo |
| `openspec workset open <name>` | Abrir um workset salvo (janela do editor ou sessão de agente no terminal) |
| `openspec config edit` | Abrir a configuração no editor |
| `openspec feedback` | Enviar comentários pelo GitHub |
| `openspec completion install` | Instalar conclusões de comando no shell |

### Comandos compatíveis com agentes

Estes comandos aceitam a saída `--json` para uso programático por agentes de IA e scripts:

| Comando | Uso por pessoas | Uso por agentes |
|---------|-----------|-----------|
| `openspec list` | Navegar por mudanças/especificações | `--json` para dados estruturados |
| `openspec show <item>` | Ler conteúdo | `--json` para análise |
| `openspec validate` | Verificar problemas | `--all --json` para validação em lote |
| `openspec status` | Consultar o progresso dos artefatos | `--json` para um status estruturado |
| `openspec instructions` | Obter as próximas etapas | `--json` para instruções do agente |
| `openspec templates` | Localizar caminhos dos templates | `--json` para resolver caminhos |
| `openspec schemas` | Listar schemas disponíveis | `--json` para descobrir schemas; `--store <id>` para selecionar uma raiz registrada |
| `openspec store setup <id>` | Criar e registrar uma store local | `--json` com entradas explícitas para uma saída estruturada |
| `openspec store register <path>` | Registrar uma store existente | `--json` para uma saída estruturada do registro |
| `openspec store unregister <id>` | Esquecer um registro local de store | `--json` para uma saída estruturada da limpeza |
| `openspec store remove <id>` | Excluir a pasta de uma store local registrada | `--yes --json` para excluir sem interação |
| `openspec store list` | Navegar pelas stores registradas | `--json` para registros estruturados |
| `openspec store doctor` | Verificar a configuração da store local | `--json` para diagnósticos estruturados |
| `openspec new change <id>` | Criar a estrutura de uma mudança local ao repositório | `--json` e `--store <id>` para usar uma store registrada como raiz do OpenSpec |
| `openspec workset create [name]` | Compor uma visão de trabalho pessoal | `--member <path> --json` para compor sem interação |
| `openspec workset list` | Navegar pelos worksets salvos | `--json` para visões estruturadas |
| `openspec workset remove <name>` | Excluir uma visão salva | `--yes --json` para remover sem interação |

---

## Opções globais

Estas opções funcionam com todos os comandos:

| Opção | Descrição |
|--------|-------------|
| `--version`, `-V` | Exibir o número da versão |
| `--no-color` | Desabilitar cores na saída |
| `--help`, `-h` | Exibir a ajuda do comando |

---

## Comandos de configuração

### `openspec init`

Inicialize o OpenSpec no projeto. Cria a estrutura de pastas e configura as
integrações com ferramentas de IA.

Por padrão, usa os valores globais: perfil `core`, distribuição `both` e fluxos
de trabalho `propose, explore, apply, update, sync, archive`.

```
openspec init [path] [options]
```

Use `--language <language>` para adicionar uma instrução de idioma ao
`openspec/config.yaml` de um projeto novo. Em um projeto existente, edite o
campo `context` da configuração para que o OpenSpec nunca substitua as
orientações específicas do projeto.

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--tools <list>` | Configurar ferramentas de IA sem interação. Use `all`, `none` ou uma lista separada por vírgulas |
| `--language <language>` | Usar este idioma nos artefatos ao criar uma nova configuração |
| `--force` | Limpar arquivos legados automaticamente, sem perguntar |
| `--profile <profile>` | Substituir o perfil global nesta execução de init (`core` ou `custom`) |
| `--no-animation` | Exibir uma tela de boas-vindas estática em vez da animada |
| `--copilot-cloud` | Configurar, sem perguntar, os [arquivos do agente de codificação na nuvem](/pt-BR/supported-tools/#agente-de-codificação-na-nuvem-do-github-copilot) do GitHub Copilot |
| `--no-copilot-cloud` | Ignorar, sem perguntar, os arquivos do agente de codificação na nuvem do GitHub Copilot |

`--profile custom` usa os fluxos de trabalho selecionados atualmente na configuração global (`openspec config profile`).

A animação de boas-vindas também é ignorada quando a variável de ambiente
`OPENSPEC_NO_ANIMATION` está definida (com qualquer valor, inclusive vazio),
quando `NO_COLOR` tem um valor não vazio ou quando a preferência de movimento
reduzido do sistema operacional está habilitada (Reduce Motion no macOS ou
animações desabilitadas no GNOME).

**IDs de ferramentas aceitos (`--tools`)** — `windsurf` também é aceito como alias de `devin`: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `codeassistant`, `qoder`, `qwen`, `rovodev`, `roocode`, `trae`, `zed`, `zcode`, `agents`

> Esta lista corresponde a `AI_TOOLS` em `src/core/config.ts`. Consulte
> [Ferramentas compatíveis](/pt-BR/supported-tools/) para ver os caminhos de
> skills e comandos de cada ferramenta.

**Exemplos:**

```bash
# Interactive initialization
openspec init

# Initialize in a specific directory
openspec init ./my-project

# Non-interactive: configure for Claude and Cursor
openspec init --tools claude,cursor

# Non-interactive: configure global MiniMax Code skills
openspec init --tools minimax-code

# Configure for all supported tools
openspec init --tools all

# Override profile for this run
openspec init --profile core

# Skip prompts and auto-cleanup legacy files
openspec init --force
```

**O que cria:**

```
openspec/
├── specs/              # Your specifications (source of truth)
├── changes/            # Proposed changes
└── config.yaml         # Project configuration

.claude/skills/         # Claude Code skills (if claude selected)
.cursor/skills/         # Cursor skills (if cursor selected)
.cursor/commands/       # Cursor OPSX commands (if delivery includes commands)
.agents/skills/         # Shared skills for AGENTS.md-compatible tools (if agents selected)
... (other tool configs)
```

---

### `openspec update`

Atualize os arquivos de instruções do OpenSpec depois de atualizar a CLI. O
comando gera novamente os arquivos de configuração das ferramentas de IA com
base no perfil global, nos fluxos de trabalho selecionados e no modo de
distribuição atuais.

```
openspec update [path] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `path` | Não | Diretório de destino (padrão: diretório atual) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Forçar a atualização mesmo quando os arquivos estiverem atualizados |

**Exemplo:**

```bash
# Update instruction files after npm upgrade
npm install -g @fission-ai/openspec@latest
openspec update
```

Atualize primeiro o pacote. Os arquivos de instruções são gerados pela CLI
instalada; portanto, executar `openspec update` com uma instalação desatualizada
informa que tudo está atualizado, sem adicionar os fluxos de trabalho incluídos
em versões mais recentes.

Para deixar isso claro, `openspec update` consulta o registro do npm para saber
se foi publicada uma CLI mais recente. Se a sua estiver desatualizada, o
comando oferecerá uma atualização:

```text
A newer OpenSpec CLI is available (v1.6.0 → v1.7.0).
  Running from: /usr/local/lib/node_modules/@fission-ai/openspec
? Upgrade to v1.7.0 now? (Y/n)
```

Se você responder sim, o comando executará `npm install -g
@fission-ai/openspec@latest` e, em seguida, repetirá a atualização com a nova
CLI para incluir os novos fluxos no mesmo comando. A confirmação da
atualização consulta a versão do executável instalado, em vez de confiar no
código de saída do npm. Assim, se outra instalação anterior no `PATH` ainda
estiver sendo usada, o comando avisará você em vez de declarar sucesso. Se
responder não, ele exibirá o comando e atualizará usando a CLI atual. `Ctrl-C`
interrompe o comando.

A oferta aparece somente em um terminal interativo e quando a instalação é
gerenciada pelo npm — o único caso em que `npm install -g` realmente resolve o
problema. Para os demais casos, é exibido o comando correspondente ao método
de instalação:

| Como o OpenSpec foi instalado | O que será exibido |
|---------------------------|--------------|
| Instalação global com npm | O prompt, com atualização automática no terminal interativo; em saídas redirecionadas, é exibido o comando |
| Instalação global com pnpm, bun, yarn ou volta | O comando do respectivo gerenciador: `pnpm add -g …@latest`, `bun add -g …@latest`, `yarn global add …@latest` ou `volta install …@latest` |
| Dependência do projeto | Um aviso para atualizar a dependência, pois o gerenciador do projeto controla o arquivo de lock |
| Cache de `npx`/`dlx` | `npx @fission-ai/openspec@latest update` — esse comando já faz a atualização, sem uma segunda etapa |
| Clone do Git | Nenhum — a versão é determinada pela branch |

Sempre que algo for exibido, será indicado o diretório de onde a CLI em execução
foi carregada — confira-o caso você tenha atualizado, mas um shim antigo ainda
esteja sendo usado pelo `PATH`.

O registro consultado é o indicado por `npm_config_registry`, quando exportado
pelo npm; caso contrário, usa-se `https://registry.npmjs.org`. Nenhum arquivo
`.npmrc` é lido: não é recomendável deixar o conteúdo de um arquivo determinar
o destino de uma solicitação externa, e o `.npmrc` do projeto acompanha o
repositório. Para usar um espelho privado, exporte `npm_config_registry` ou
defina `OPENSPEC_NO_UPDATE_CHECK` para ignorar completamente a verificação.
Ela também é ignorada quando `CI` está definido com qualquer valor que não
seja explicitamente desativado (`false`, `0`, `no`, `off` ou vazio), quando
`NODE_ENV=test` e quando `OPENSPEC_NO_UPDATE_CHECK` (qualquer valor),
`DO_NOT_TRACK=1` ou `OPENSPEC_TELEMETRY=0` estiver definido. A verificação
ocorre antes da atualização e pode atrasá-la em no máximo 1,5 segundo; depois
desse limite, desiste mesmo que a rede esteja descartando pacotes sem aviso e
permanece silenciosa se o registro estiver indisponível.

**Como é determinada a atualização:** os arquivos de skills registram a versão
que os gerou, e o OpenSpec a compara com a CLI instalada. Arquivos de comando
não têm marca de versão; portanto, para uma ferramenta que usa comandos, mas
não skills (distribuição `commands`), o OpenSpec compara o conteúdo dos
arquivos com o que geraria agora. Alterações nesses arquivos são consideradas
divergências e sobrescritas. Com a distribuição `skills` ou `both`, somente a
versão registrada é verificada; um arquivo editado manualmente cuja versão
ainda corresponda é mantido. Use `--force` para regravá-lo. Em ambos os casos,
os arquivos gerados pertencem ao OpenSpec; mantenha suas próprias instruções
em outro lugar.

---

## Stores (repositórios OpenSpec independentes)

> **Beta.** Stores e os recursos que dependem delas (referências, contexto de
> trabalho e worksets) são novos; nomes de comandos, opções, formatos de arquivo
> e saídas JSON podem mudar entre versões. Para ver um guia organizado em torno
> dos problemas que eles resolvem, consulte o [guia de stores](/pt-BR/stores-beta/user-guide/).

Uma store é um repositório OpenSpec independente registrado nesta máquina —
por exemplo, um repositório de planejamento ou contratos. Ao registrar uma
store, os comandos normais (`list`, `show`, `status`, `validate`, `new change`,
`archive`...) podem atuar nela de qualquer lugar usando `--store <id>`.

### `openspec store setup`

Crie e registre uma store local. Se não forem fornecidos argumentos no
terminal, o OpenSpec orientará a pessoa usuária durante a configuração.
Agentes e scripts devem fornecer entradas explícitas e usar `--json`.

```bash
openspec store setup [id] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--path <path>` | Pasta da store (por exemplo, `~/openspec/<id>`) |
| `--remote <url>` | Registrar o remoto canônico no `store.yaml` da nova store |
| `--init-git` | Inicializar um repositório Git com um commit inicial (padrão) |
| `--no-init-git` | Ignorar todas as ações do Git: sem init e sem commit inicial |
| `--json` | Gerar saída JSON |

Execuções não interativas (`--json`, scripts, agentes) precisam receber o ID
da store e `--path`. Em um terminal interativo, `setup` pergunta o local e
sugere um caminho editável em um diretório visível e pertencente à pessoa
usuária (por exemplo, `~/openspec/<id>`); nunca usa como padrão o diretório de
dados gerenciado pelo OpenSpec.

Exemplos:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

Registre uma pasta de store local existente. Durante a versão beta, uma raiz
pode ser registrada antes que existam mudanças, especificações aplicadas ou
mudanças arquivadas; nesse caso, `openspec/changes/`, `openspec/specs/` e
`openspec/changes/archive/` podem não existir até que comandos normais as
criem. Um repositório somente de configuração que declare `store: <id>`
continua sendo um ponteiro para outra store e não é registrado como raiz de
store, a menos que esse ponteiro seja removido.

```bash
openspec store register [path] [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--id <id>` | ID da store; o padrão é o indicado nos metadados da store ou o nome da pasta |
| `--yes` | Confirmar a criação de metadados de identidade para uma raiz íntegra do OpenSpec |
| `--json` | Gerar saída JSON |

### `openspec store unregister`

Esqueça o registro de uma store local sem excluir arquivos.

```bash
openspec store unregister <id> [--json]
```

Use-o quando uma store tiver sido movida ou clonada para outro local, ou
quando não quiser mais que o OpenSpec a exiba nesta máquina.

### `openspec store remove`

Esqueça o registro de uma store local e exclua sua pasta.

```bash
openspec store remove <id> [--yes] [--json]
```

Em um terminal interativo, `remove` exibe o caminho exato antes de excluir a
pasta. Agentes, scripts e chamadas JSON precisam passar `--yes` para confirmar
a exclusão. O OpenSpec não exclui uma pasta sem os metadados correspondentes
da store.

### `openspec store list`

Liste as stores registradas localmente.

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

Verifique o registro local da store, seus metadados e a presença do Git.

```bash
openspec store doctor [id] [--json]
```

`doctor` serve apenas para diagnóstico: informa sobre raízes ausentes,
divergências nos metadados e estados inválidos do registro local, sem modificar
a store.

### Referenciar stores em um projeto

Um repositório de projeto pode declarar em `openspec/config.yaml` quais stores
servem de base ao trabalho:

```yaml
schema: spec-driven
references:
  - team-context
```

A partir daí, a saída de `openspec instructions` nesse repositório — tanto
para cada artefato quanto para `apply`, nos modos JSON e legível por pessoas —
inclui um índice das especificações de cada store referenciada: IDs de
especificação, um resumo de uma linha da seção Purpose e o comando para
consultá-la (`openspec show <spec-id> --type spec --store <id>`). O índice é
montado em tempo real a partir do checkout registrado a cada execução; o
conteúdo das especificações nunca é copiado para a saída.

As referências são contexto somente para leitura. Elas nunca alteram onde os
comandos atuam: o trabalho continua na raiz do próprio repositório, e gravar em
uma store referenciada ainda exige a opção explícita `--store`. Uma referência
que não puder ser resolvida (por exemplo, uma store não registrada nesta
máquina) é substituída por um aviso no índice com a correção exata, e as
instruções continuam sendo geradas. `openspec doctor` apresenta a integridade
das referências em um só lugar.

### Registrar a origem do clone de uma store

Uma store pode registrar a origem canônica do clone em seu arquivo de
identidade versionado, para que o processo de integração não pare em “registre
a store”:

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

O remoto é registrado em `.openspec-store/store.yaml` no commit inicial, para
que todo clone já o conheça. Em uma store existente, edite `store.yaml`
manualmente e faça commit. `store doctor` exibe o remoto registrado (e a
origem Git detectada no checkout); as instruções de compartilhamento de
setup/register o indicam; e `register` registra a origem do checkout no
registro local da máquina.

Uma declaração de referência também pode incluir a origem do clone, para que
quem ainda não tenha a store receba uma correção completa, pronta para copiar
e colar (`git clone <remote> <path> && openspec store register <path> --id <id>`):

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

Registrar um remoto não é sincronizar: o OpenSpec nunca clona, faz pull ou
push por conta própria.

### Declarar uma store padrão

Um repositório cujo planejamento foi totalmente externalizado — sem
`openspec/specs/` nem `openspec/changes/` locais — pode declarar sua store uma
única vez, em vez de passar `--store` a cada comando:

```yaml
# openspec/config.yaml (the only file under openspec/)
store: team-context
```

Os comandos normais passam a usar automaticamente a store declarada; o banner
da raiz e o bloco JSON `root` informam `source: "declared"` e o ID da store,
enquanto as sugestões impressas continuam incluindo `--store <id>`. A
declaração é uma alternativa, nunca uma substituição: `--store` explícito
sempre prevalece, e um diretório com pastas reais de planejamento ignora o
ponteiro (com um aviso). Para converter um repositório com ponteiro em uma raiz
local do OpenSpec, remova a linha `store:` e execute `openspec init` — `init`
não cria a estrutura enquanto a declaração existir.

A opção no nível da máquina cobre todos os repositórios de uma só vez:
`openspec config set defaultStore <id>` (consulte Configuração). Ela só é
considerada depois que `--store`, uma raiz local e um ponteiro do projeto não
conseguem resolver a raiz; então, o banner e o bloco JSON `root` informam
`source: "global_default"`.

## Doctor (integridade das relações)

Uma pergunta somente para leitura, respondida em um só lugar: a raiz do
OpenSpec está íntegra e as stores que ela referencia estão disponíveis nesta
máquina?

```bash
openspec doctor [--store <id>] [--json]
```

O relatório separa a integridade da raiz, dos metadados das stores (inclusive
avisos quando o remoto registrado diverge da origem do checkout ou quando o
checkout da store está atrasado em relação à sua referência de rastreamento
upstream atualizada pela última vez) e das referências (os mesmos diagnósticos
exibidos pelas instruções, com correções de clone para referências não
resolvidas). Problemas de integridade de qualquer gravidade resultam em código
de saída 0 — os agentes consultam os arrays `status`; somente falhas de comando
(raiz ausente, store desconhecida) resultam em código 1. `doctor` nunca clona,
sincroniza ou corrige nada. Para obter o conjunto reunido em vez do relatório
de integridade, use `openspec context`.

## Contexto de trabalho (o conjunto reunido)

Tudo o que está relacionado ao trabalho segundo as declarações do OpenSpec,
reunido em um único conjunto de trabalho: a raiz do OpenSpec e as stores que
ela referencia.

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

O resumo JSON pode ser usado por agentes (cada store referenciada disponível
inclui instruções para consultá-la; membros não resolvidos incluem as mesmas
correções exibidas por `instructions` e `doctor`). `--code-workspace` também
grava um arquivo de workspace do VS Code com a raiz e as stores referenciadas
disponíveis (pastas `ref:<id>`) — a única gravação feita pelo comando. Se o
arquivo já existir, a gravação é recusada sem `--force`. Membros indisponíveis
são informados, nunca presumidos.

“Contexto de trabalho” é o conjunto reunido. O campo `context:` em
`openspec/config.yaml` contém informações do projeto incluídas nas instruções;
são coisas diferentes. `openspec doctor` informa se o conjunto está íntegro;
`openspec context` informa o que faz parte dele.

## Worksets pessoais

> **Beta.** Worksets fazem parte da nova versão beta; comandos, opções e
> formatos de arquivo podem mudar entre versões. Para ver um guia passo a
> passo, consulte o [guia de stores](/pt-BR/stores-beta/user-guide/#worksets-reabra-as-pastas-usadas-em-conjunto).

Um workset é uma visão pessoal, identificada por um nome, das pastas que você
usa em conjunto — uma raiz de planejamento e quaisquer outras que escolher.
Ele fica na sua máquina e pode ser reaberto pelo nome na sua ferramenta. É
puramente local: nunca é incluído em commits, compartilhado ou derivado de
declarações; sua remoção nunca afeta as pastas dos membros.

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` executa um fluxo guiado breve (ou recebe opções `--member` sem
interação; o primeiro membro é o principal e as sessões começam nele). `open`
inicia a ferramenta escolhida: editores (VS Code, Cursor) abrem uma janela com
todos os membros e retornam; agentes de CLI (Claude Code, codex) assumem este
terminal em uma sessão com todos os membros anexados e sem prompt pré-preenchido,
que termina quando você sai. Uma pasta de membro que não existir ao abrir será
ignorada, com um aviso; as demais serão abertas. A preferência de ferramenta
salva pode ser substituída em cada abertura com `--tool`.

O suporte a uma ferramenta nova é uma configuração, não uma alteração de
código. Cada ferramenta usa um de dois estilos de inicialização —
`workspace-file` (iniciada com o arquivo `.code-workspace` gerado) ou
`attach-dirs` (uma opção de anexo para cada membro). A chave `openers` do
`config.json` global (abra-o com `openspec config edit`) adiciona ferramentas
ou ajusta as opções integradas campo a campo:

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

Todo o estado dos worksets fica na pasta `worksets/` do diretório global de
dados (as visões salvas e os arquivos `<name>.code-workspace` gerados, que são
regenerados a cada abertura). Excluir essa pasta remove todos os vestígios.

---

## Comandos de navegação

### `openspec list`

Liste mudanças ou especificações do projeto.

```
openspec list [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--specs` | Listar especificações em vez de mudanças |
| `--changes` | Listar mudanças (padrão) |
| `--sort <order>` | Ordenar por `recent` (padrão) ou `name` |
| `--json` | Gerar saída JSON |

**Exemplos:**

```bash
# List all active changes
openspec list

# List all specs
openspec list --specs

# JSON output for scripts
openspec list --json
```

**Saída (texto):**

```
Changes:
  add-dark-mode     No tasks      just now
```

---

### `openspec view`

Exiba um painel interativo para explorar especificações e mudanças.

```
openspec view
```

Abre uma interface de terminal para navegar pelas especificações e mudanças do projeto.

---

### `openspec show`

Exiba detalhes de uma mudança ou especificação.

```
openspec show [item-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Nome da mudança ou especificação (pergunta se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--type <type>` | Especificar o tipo: `change` ou `spec` (detectado automaticamente se não houver ambiguidade) |
| `--json` | Gerar saída JSON |
| `--no-interactive` | Desabilitar prompts |

**Opções específicas de mudanças:**

| Opção | Descrição |
|--------|-------------|
| `--deltas-only` | Exibir somente especificações delta (modo JSON) |

**Opções específicas de especificações:**

| Opção | Descrição |
|--------|-------------|
| `--requirements` | Exibir somente requisitos, sem cenários (modo JSON) |
| `--no-scenarios` | Excluir o conteúdo dos cenários (modo JSON) |
| `-r, --requirement <id>` | Exibir um requisito específico pelo índice iniciado em 1 (modo JSON) |

**Exemplos:**

```bash
# Interactive selection
openspec show

# Show a specific change
openspec show add-dark-mode

# Show a specific spec
openspec show auth --type spec

# JSON output for parsing
openspec show add-dark-mode --json
```

---

## Comandos de validação

### `openspec validate`

Valide a estrutura de mudanças e especificações e confira se os requisitos
MODIFIED de uma mudança correspondem às especificações principais que
substituiriam.

```
openspec validate [item-name] [options]
```

Uma mudança sem deltas de especificação falha na validação, a menos que seu
`.openspec.yaml` declare `skip_specs: true` (para refatorações puras, ferramentas
ou documentação — consulte [Receita 5](/pt-BR/examples/#receita-5-refatoração-sem-alteração-de-comportamento)).

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `item-name` | Não | Item específico a validar (pergunta se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Validar todas as mudanças e especificações |
| `--changes` | Validar todas as mudanças |
| `--specs` | Validar todas as especificações |
| `--archived` | Validar se todas as tarefas das mudanças arquivadas foram concluídas (para lint no pre-commit) |
| `--type <type>` | Especificar o tipo quando o nome for ambíguo: `change` ou `spec` |
| `--strict` | Habilitar o modo de validação estrita |
| `--json` | Gerar saída JSON |
| `--concurrency <n>` | Máximo de validações paralelas (padrão: 6, ou variável de ambiente `OPENSPEC_CONCURRENCY`) |
| `--no-interactive` | Desabilitar prompts |

`--archived` tem seu próprio escopo: não valida especificações delta (já
aplicadas durante o arquivamento), mas verifica se todas as caixas de seleção
em `tasks.md` de cada mudança em `changes/archive/` estão marcadas. Se alguma
estiver desmarcada, termina com código diferente de zero. Assim, mudanças
arquivadas com trabalho incompleto podem ser detectadas, por exemplo, em um
hook de pre-commit.

**Exemplos:**

```bash
# Interactive validation
openspec validate

# Validate a specific change
openspec validate add-dark-mode

# Validate all changes
openspec validate --changes

# Validate everything with JSON output (for CI/scripts)
openspec validate --all --json

# Strict validation with increased parallelism
openspec validate --all --strict --concurrency 12

# Fail if any archived change still has unchecked tasks
openspec validate --archived
```

**Saída (texto):**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**Saída (JSON):**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## Comandos do ciclo de vida

### `openspec archive`

Arquive uma mudança concluída e mescle as especificações delta às principais.

```
openspec archive [change-name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `change-name` | Não | Mudança a arquivar (pergunta se omitido; obrigatório quando não houver quem responda ao prompt) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `-y, --yes` | Ignorar prompts de confirmação. Obrigatório quando não houver quem responda — agente de IA, job de CI ou execução com stdin fechado |
| `--skip-specs` | Ignorar atualizações das especificações nesta execução de arquivamento. Uma mudança sem deltas permanentes deve declarar `skip_specs: true` no `.openspec.yaml`; assim, será arquivada sem essa opção |
| `--no-validate` | Ignorar a validação (exige confirmação). Também desativa a descontinuação de capacidades: sem o parecer do validador, nada é descontinuado |

**Exemplos:**

```bash
# Interactive archive (asks which change, then confirms)
openspec archive

# Archive specific change
openspec archive add-dark-mode

# Archive without prompts (agents, CI, scripts)
openspec archive add-dark-mode --yes

# Archive a tooling change that doesn't affect specs
openspec archive update-ci-config --skip-specs
```

**Descontinuar uma capacidade:** adicione o marcador de descontinuação aos metadados da mudança:

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

Em seguida, arquive a mudança normalmente:

```bash
openspec archive retire-legacy --yes
```

Quando a mudança remove o último requisito de uma capacidade, o OpenSpec
exclui seu `spec.md` ativo. Os deltas de outras capacidades na mesma mudança
ainda atualizam suas especificações principais. Sem o marcador, o arquivamento
é interrompido antes de alterar arquivos e solicita que você o adicione.

**O que faz:**

1. Valida a mudança (a menos que `--no-validate` seja usado)
2. Solicita confirmação (a menos que `--yes` seja usado)
3. Reserva o destino do arquivo antes de alterar qualquer especificação principal
4. Valida e mescla as especificações delta ativas em `openspec/specs/` — uma capacidade cujo último requisito seja removido pela mudança é descontinuada e seu arquivo de especificação é excluído, mas somente se o `.openspec.yaml` da mudança declarar `retire_capabilities: true` junto a `schema:`
5. Move a pasta da mudança para `openspec/changes/archive/YYYY-MM-DD-<name>/`
6. Se uma alteração de especificação ou a movimentação final falhar antes da conclusão do arquivamento, restaura as especificações e mantém ou devolve a mudança ao caminho ativo
7. Se uma cópia alternativa verificada for concluída, mas a limpeza da origem em preparação falhar, mantém o arquivo completo e o estado confirmado das especificações para recuperação

**Sem um terminal:** um agente de IA, job de CI ou execução com stdin fechado
não consegue responder à etapa 2. Portanto, o arquivamento para antes de
alterar qualquer coisa, termina com código 1 e informa o comando a repetir —
`openspec archive <name> --yes`, mantendo as demais opções fornecidas. Passe
`--yes` (e o nome da mudança) desde o início para evitar essa etapa.

---

## Comandos de fluxo de trabalho

Estes comandos dão suporte ao fluxo OPSX orientado por artefatos. Eles são
úteis tanto para pessoas que verificam o progresso quanto para agentes que
determinam as próximas etapas.

### `openspec new change`

Crie um diretório de mudança e, opcionalmente, metadados versionados na raiz
resolvida do OpenSpec.

```bash
openspec new change <name> [options]
```

Os nomes de mudanças devem usar kebab-case em letras minúsculas: letras
minúsculas, números e hífens simples. Não podem conter espaços, sublinhados,
letras maiúsculas, hífens consecutivos ou hífens no início/fim. É permitido
começar com um número para ordenar mudanças ou indicar níveis, por exemplo,
`100-add-feature` ou `00001-add-auth`.

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição a adicionar a `README.md` |
| `--goal <text>` | Metadados opcionais de objetivo a armazenar com a mudança |
| `--schema <name>` | Schema de fluxo de trabalho a usar |
| `--store <id>` | ID da store a usar como raiz do OpenSpec (store é um repositório OpenSpec independente que você registrou) |
| `--json` | Gerar saída JSON |

Exemplos:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

Exiba o status de conclusão dos artefatos de uma mudança.

```
openspec status [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da mudança (pergunta se omitido) |
| `--schema <name>` | Substituição do schema (detectado automaticamente na configuração da mudança) |
| `--json` | Gerar saída JSON |

**Exemplos:**

```bash
# Consultar o status interativamente
openspec status

# Consultar o status de uma mudança específica
openspec status --change add-dark-mode

# JSON para uso por agentes
openspec status --change add-dark-mode --json
```

**Saída (texto):**

```
Change: add-dark-mode
Schema: spec-driven
Progress: 2/4 artifacts complete

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

Uma mudança que declara `skip_specs: true` exibe a etapa de especificações como `[~] specs (skipped: change declares skip_specs)` e a exclui da contagem de progresso.

**Saída (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` informa se existem todos os artefatos de planejamento não
ignorados; artefatos ignorados contam como satisfeitos, mesmo sem serem
criados. O campo não informa se as tarefas de implementação foram concluídas.
`isComplete` é mantido como alias de compatibilidade com o mesmo valor.

Os artefatos são listados na ordem das dependências — uma dependência nunca
aparece depois do artefato que a exige. Quando artefatos ficam prontos ao mesmo
tempo (`specs` e `design` do schema spec-driven só precisam de `proposal`),
mantêm a ordem declarada no schema, em vez da ordem alfabética. Portanto, o
primeiro item `ready` é o próximo artefato a escrever.

---

### `openspec instructions`

Obtenha instruções detalhadas para criar um artefato ou executar tarefas.
Agentes de IA usam esse comando para entender o que criar em seguida.

```
openspec instructions [artifact] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `artifact` | Não | ID do artefato ou superfície de entrada do fluxo: `apply` ou `archive` |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--change <id>` | Nome da mudança (obrigatório no modo não interativo) |
| `--schema <name>` | Substituição do schema |
| `--json` | Gerar saída JSON |

**Casos especiais:** use `apply` para obter instruções de implementação das
tarefas. Use `archive` para consultar as entradas atuais de arquivamento,
somente para leitura (`context` e `operationGuidance`), de uma mudança válida;
esse comando não arquiva nem altera nada.

**Exemplos:**

```bash
# Obter instruções para o próximo artefato
openspec instructions --change add-dark-mode

# Obter instruções para um artefato específico
openspec instructions design --change add-dark-mode

# Obter instruções de execução/implementação
openspec instructions apply --change add-dark-mode

# Obter as entradas atuais de arquivamento sem arquivar
openspec instructions archive --change add-dark-mode --json

# JSON para uso por agentes
openspec instructions design --change add-dark-mode --json
```

**A saída inclui:**

- Conteúdo do template do artefato
- Contexto do projeto, proveniente da configuração
- Conteúdo dos artefatos dependentes
- Regras da configuração para cada artefato
- Contexto atual do projeto e orientações correspondentes para as operações `apply`/`archive`

As entradas da operação são lidas do repositório resolvido ou da store
selecionada a cada invocação. O contexto do projeto é uma entrada obrigatória
no nível do prompt: os agentes o leem e aplicam os fatos, as convenções e as
restrições relevantes. As orientações por operação são recomendações
adicionais opcionais: os agentes consideram todos os itens e seguem somente
os que forem aplicáveis e compatíveis com o fluxo integrado. Ambos os campos
permanecem separados das escolhas explícitas da pessoa usuária, do estado
controlado pela CLI, das instruções integradas e das regras dos artefatos.
Conflitos no contexto são informados; orientações conflitantes ou inaplicáveis
não são seguidas, e o motivo é explicado. Esses são contratos de
comportamento para agentes gerados, não verificações impostas pela CLI.
`instructions archive` retorna somente a mudança selecionada, entradas
opcionais e metadados da raiz; não inclui o fluxo estático de arquivamento.

Para um artefato ignorado por `skip_specs: true`, a saída contém somente um
aviso (JSON adiciona os campos `skipped`/`warning`); o artefato não deve ser
criado.

---

### `openspec templates`

Exiba os caminhos resolvidos dos templates para todos os artefatos de um schema.

```
openspec templates [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--schema <name>` | Schema a inspecionar (padrão: `spec-driven`) |
| `--json` | Gerar saída JSON |

**Exemplos:**

```bash
# Exibir os caminhos dos templates do schema padrão
openspec templates

# Exibir os templates de um schema personalizado
openspec templates --schema my-workflow

# JSON para uso programático
openspec templates --json
```

**Saída (texto):**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

Liste os schemas de fluxo de trabalho disponíveis, com suas descrições e
sequências de artefatos.

```
openspec schemas [options]
```

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--json` | Gerar saída JSON |
| `--store <id>` | Usar uma store registrada como raiz do OpenSpec |

**Exemplo:**

```bash
openspec schemas
```

**Saída:**

```
Schemas disponíveis:

  spec-driven (package)
    Fluxo de trabalho padrão para desenvolvimento orientado a especificações
    Fluxo: proposta → especificações → projeto → tarefas

  my-custom (project)
    Fluxo de trabalho personalizado deste projeto
    Fluxo: pesquisa → proposta → tarefas
```

---

## Comandos de schema

Comandos para criar e gerenciar schemas de fluxos de trabalho personalizados.

### `openspec schema init`

Crie um novo schema local ao projeto.

```
openspec schema init <name> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Sim | Nome do schema (kebab-case) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--description <text>` | Descrição do schema |
| `--artifacts <list>` | IDs de artefato separados por vírgulas (padrão: `proposal,specs,design,tasks`) |
| `--default` | Definir como schema padrão do projeto |
| `--no-default` | Não perguntar se deve ser definido como padrão |
| `--force` | Sobrescrever o schema existente |
| `--json` | Gerar saída JSON |

**Exemplos:**

```bash
# Criar um schema interativamente
openspec schema init research-first

# Modo não interativo com artefatos específicos
openspec schema init rapid \
  --description "Fluxo de iteração rápida" \
  --artifacts "proposal,tasks" \
  --default
```

**O que cria:**

```
openspec/schemas/<name>/
├── schema.yaml           # Definição do schema
└── templates/
    ├── proposal.md       # Template de cada artefato
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

Copie um schema existente para o projeto e personalize-o.

```
openspec schema fork <source> [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `source` | Sim | Schema a copiar |
| `name` | Não | Nome do novo schema (padrão: `<source>-custom`) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--force` | Sobrescrever o destino existente |
| `--json` | Gerar saída JSON |

**Exemplo:**

```bash
# Criar uma cópia do schema spec-driven integrado
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

Valide a estrutura e os templates de um schema.

```
openspec schema validate [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Schema a validar (valida todos se omitido) |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--verbose` | Exibir etapas detalhadas da validação |
| `--json` | Gerar saída JSON |

**Exemplo:**

```bash
# Validar um schema específico
openspec schema validate my-workflow

# Validar todos os schemas
openspec schema validate
```

---

### `openspec schema which`

Exiba de onde vem a resolução de um schema (útil para depurar a precedência).

```
openspec schema which [name] [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `name` | Não | Nome do schema |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--all` | Listar todos os schemas e suas origens |
| `--json` | Gerar saída JSON |

**Exemplo:**

```bash
# Verificar a origem de um schema
openspec schema which spec-driven
```

**Saída:**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Precedência dos schemas:**

1. Projeto: `openspec/schemas/<name>/`
2. Usuário: `~/.local/share/openspec/schemas/<name>/`
3. Pacote: schemas integrados

---

## Comandos de configuração

### `openspec config`

Consulte e modifique a configuração global do OpenSpec.

```
openspec config <subcommand> [options]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `path` | Exibir o local do arquivo de configuração |
| `list` | Exibir todas as configurações atuais |
| `get <key>` | Obter um valor específico |
| `set <key> <value>` | Definir um valor |
| `unset <key>` | Remover uma chave |
| `reset` | Restaurar os valores padrão |
| `edit` | Abrir no `$EDITOR` |
| `profile [preset]` | Configurar o perfil do fluxo de trabalho interativamente ou por predefinição |

**Exemplos:**

```bash
# Exibir o caminho do arquivo de configuração
openspec config path

# Listar todas as configurações
openspec config list

# Obter um valor específico
openspec config get telemetry.enabled

# Definir um valor (desabilitar telemetria anônima de uso)
openspec config set telemetry.enabled false

# Definir explicitamente um valor de texto
openspec config set user.name "My Name" --string

# Remover uma configuração personalizada
openspec config unset user.name

# Definir uma store padrão no nível da máquina (raiz alternativa quando não
# houver resolução por --store, raiz local ou ponteiro store: do projeto)
openspec config set defaultStore team-plans

# Redefinir toda a configuração
openspec config reset --all --yes

# Editar a configuração no editor
openspec config edit

# Configurar o perfil com o assistente baseado em ações
openspec config profile

# Predefinição rápida: mudar os fluxos para core (mantém o modo de distribuição)
openspec config profile core
```

**Desativar a telemetria:** `telemetry.enabled` fica habilitada por padrão
quando não está definida (modelo de desativação opcional). Defina-a como
`false` para desabilitar as estatísticas anônimas de uso e a verificação de
versão de `openspec update`. As variáveis de ambiente têm prioridade sobre a
configuração: `OPENSPEC_TELEMETRY=0`, `DO_NOT_TRACK=1` e um valor verdadeiro de
`CI` (por exemplo, `true`/`1`/`yes`) sempre desabilitam a telemetria,
independentemente do valor configurado.

`openspec config profile` começa com um resumo do estado atual e permite escolher:
- Alterar a distribuição e os fluxos de trabalho
- Alterar somente a distribuição
- Alterar somente os fluxos de trabalho
- Manter as configurações atuais (sair)

Se você mantiver as configurações atuais, nenhuma alteração será gravada e
nenhum prompt de atualização será exibido. Se não houver alterações de
configuração, mas os arquivos atuais do projeto estiverem fora de sincronia com
o perfil/distribuição global, o OpenSpec exibirá um aviso e sugerirá
`openspec update`. Pressionar `Ctrl+C` também cancela o fluxo sem problemas
(sem stack trace) e encerra com o código `130`. Na lista de verificação dos
fluxos, `[x]` significa que o fluxo está selecionado na configuração global.
Para aplicar essas seleções aos arquivos do projeto, execute `openspec update`
(ou escolha `Apply changes to this project now?` quando essa pergunta for
exibida dentro de um projeto).

**Exemplos interativos:**

```bash
# Atualizar somente a distribuição
openspec config profile
# escolher: alterar somente a distribuição
# escolher a distribuição: somente skills

# Atualizar somente os fluxos de trabalho
openspec config profile
# escolher: alterar somente os fluxos de trabalho
# alternar fluxos na lista de verificação e confirmar
```

---

## Comandos utilitários

### `openspec feedback`

Envie comentários sobre o OpenSpec. O comando cria uma issue no GitHub.

```
openspec feedback <message> [options]
```

**Argumentos:**

| Argumento | Obrigatório | Descrição |
|----------|----------|-------------|
| `message` | Sim | Resumo dos comentários; textos longos são reduzidos no título da issue e preservados no corpo |

**Opções:**

| Opção | Descrição |
|--------|-------------|
| `--body <text>` | Detalhes adicionais incluídos após o resumo |

**Requisitos:** a CLI do GitHub (`gh`) precisa estar instalada e autenticada.

**Exemplo:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

Gerencie as conclusões de comandos do shell para a CLI do OpenSpec.

```
openspec completion <subcommand> [shell]
```

**Subcomandos:**

| Subcomando | Descrição |
|------------|-------------|
| `generate [shell]` | Enviar o script de conclusão para stdout |
| `install [shell]` | Instalar conclusões para o shell |
| `uninstall [shell]` | Remover as conclusões instaladas |

**Shells compatíveis:** `bash`, `zsh`, `fish`, `powershell`

**Exemplos:**

```bash
# Instalar conclusões (detecta o shell automaticamente)
openspec completion install

# Instalar para um shell específico
openspec completion install zsh

# Gerar script para instalação manual (bash)
openspec completion generate bash > ~/.bash_completion.d/openspec

# Desinstalar
openspec completion uninstall
```

**Windows (PowerShell):** instale conclusões no host atual do PowerShell:

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` informa ao OpenSpec qual perfil configurar nesta sessão. O
instalador cria os diretórios de perfil ausentes e adiciona um bloco gerenciado
que carrega `OpenSpecCompletion.ps1`. Recarregue o perfil para habilitar as
conclusões imediatamente.

Para desinstalar do host atual, execute:

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

Reinicie o PowerShell após a desinstalação para remover as conclusões da sessão atual.

As conclusões são opcionais. A CLI as menciona uma vez em stderr, na primeira
execução de um comando em um terminal interativo, e não volta a exibir essa
mensagem — ela também permanece silenciosa se as conclusões já estiverem
instaladas. Defina `OPENSPEC_NO_COMPLETIONS=1` para suprimir completamente essa
sugestão.

---

## Códigos de saída

| Código | Significado |
|------|---------|
| `0` | Sucesso |
| `1` | Erro (falha de validação, arquivos ausentes etc.) |

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | Defina como `0` para desativar a telemetria e a verificação de versão de `openspec update` (substitui `telemetry.enabled` na configuração global) |
| `DO_NOT_TRACK` | Defina como `1` para desativar a telemetria e a verificação de versão de `openspec update` (sinal DNT padrão; substitui a configuração) |
| `OPENSPEC_CONCURRENCY` | Concorrência padrão para validação em lote (padrão: 6) |
| `EDITOR` ou `VISUAL` | Editor de `openspec config edit` |
| `NO_COLOR` | Desabilita as cores da saída quando definida |
| `OPENSPEC_NO_ANIMATION` | Desabilita a animação de boas-vindas de `openspec init` quando definida |
| `OPENSPEC_NO_COMPLETIONS` | Defina como `1` para suprimir a sugestão única sobre conclusões do shell |
| `OPENSPEC_NO_UPDATE_CHECK` | Desabilita a verificação de uma CLI publicada mais recente por `openspec update` quando definida (qualquer valor, inclusive vazio). A verificação também é ignorada quando `CI` está definido (exceto `false`/`0`/`no`/`off`) ou quando `NODE_ENV=test` |
| `npm_config_registry` | Registro consultado pela verificação de versão de `openspec update`. Precisa ser uma URL `http(s)`; caso contrário, usa `https://registry.npmjs.org`. Nenhum arquivo `.npmrc` é lido |

---

## Documentação relacionada

- [Comandos](/pt-BR/commands/) — comandos de barra para IA (`/opsx:propose`, `/opsx:apply` etc.)
- [Fluxos de trabalho](/pt-BR/workflows/) — padrões comuns e quando usar cada comando
- [Personalização](/pt-BR/customization/) — criar schemas e templates personalizados
- [Primeiros passos](/pt-BR/getting-started/) — guia de configuração inicial
