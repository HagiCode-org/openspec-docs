---
title: "Stores: planeje no próprio repositório"
---

> **Beta.** Stores, referências, contexto de trabalho e worksets são recursos
> novos. Os nomes dos comandos, opções, formatos de arquivo e saídas JSON ainda
> podem mudar entre versões. Todos os exemplos abaixo foram executados na
> compilação atual, mas releia este guia após atualizar.

## O problema que isso resolve

Normalmente, o OpenSpec fica dentro de um repositório de código: uma pasta
`openspec/` ao lado do código, com as especificações e mudanças daquele
repositório.

Isso deixa de funcionar quando o planejamento ultrapassa os limites de um
repositório:

- Seu trabalho abrange vários repositórios — uma funcionalidade afeta o
  servidor de API, o aplicativo web e uma biblioteca compartilhada. Em qual
  pasta `openspec/` deve ficar o plano?
- Sua equipe planeja antes da existência do código ou planeja algo que nunca
  se tornará código *neste* repositório.
- Uma equipe é responsável pelos requisitos, mas outras os consomem. A versão
  na wiki fica desatualizada e, de qualquer forma, seu agente de programação
  não consegue lê-la.

Uma **store** é a solução: um repositório independente dedicado ao
planejamento. Ela tem a mesma estrutura `openspec/` que você já conhece —
especificações e mudanças — e um pequeno arquivo de identidade. Basta
registrá-la uma vez na sua máquina, pelo nome; depois, qualquer comando normal
do OpenSpec poderá usá-la de qualquer lugar.

## Estrutura

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Duas regras mantêm tudo simples:

1. **Uma store é apenas um repositório Git.** Você faz commit, push, pull e
   revisão por conta própria. O OpenSpec nunca clona, sincroniza ou envia
   alterações por conta própria.
2. **Declarações, não mecanismos.** Repositórios podem *declarar* sua relação
   com stores (como mostrado abaixo). As declarações alteram as informações que
   o OpenSpec apresenta, mas nunca o destino dos comandos.

## Sua primeira store em cinco minutos

Dois comandos bastam para criar uma mudança funcional associada a uma store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Esse é o modelo completo. Daqui em diante, o ciclo de vida é o mesmo que você
já conhece — `status`, `instructions`, `validate`, `archive` — usando
`--store team-plans` em cada comando. Todas as sugestões impressas já incluem
essa opção. A linha `Using OpenSpec root:` sempre informa onde o comando está
atuando.

## Exemplo: uma equipe, um repositório de planejamento

Uma equipe mantém suas especificações e mudanças em `team-plans`, em vez de
espalhá-las pelos repositórios de código.

**Primeiro dia (quem fizer a configuração):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Informar `--remote` registra a URL de clone no arquivo de identidade da
própria store (`.openspec-store/store.yaml`), no commit inicial. Assim, cada
clone futuro já sabe de onde veio, e as verificações de integridade e mensagens
de erro podem exibir uma correção completa, pronta para copiar e colar, para
quem ainda não a tiver.

**Cada pessoa da equipe (uma vez por máquina):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

A partir daí, todos trabalham no mesmo repositório de planejamento pelo nome:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**O trabalho é compartilhado pelo Git, intencionalmente.** Uma mudança que
você cria só existe no seu checkout até que faça commit e push, assim como o
código. Os planos recebem branches, pull requests e revisão sem nenhum esforço
extra, pois uma store é um repositório comum.

**Conectar os repositórios de código da equipe.** Um repositório de código
cujo planejamento foi totalmente externalizado precisa de apenas uma linha em
`openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Agora, todo comando do OpenSpec executado dentro de `web-app` atua em
`team-plans`, sem nenhuma opção adicional:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

O ponteiro é uma alternativa, nunca uma substituição: uma opção `--store`
explícita sempre prevalece. Se o repositório ganhar pastas de planejamento
próprias, elas prevalecem (e um aviso recomendará remover o ponteiro obsoleto).

**Um padrão para todos os repositórios da sua máquina.** Se você trabalha em
vários repositórios de código que usam a mesma store para planejar, defina um
padrão global uma única vez, em vez de adicionar a linha `store:` a cada
repositório:

```bash
openspec config set defaultStore team-plans
```

Agora, qualquer comando executado fora de uma raiz de planejamento — sem
`--store` nem ponteiro no projeto — será direcionado a `team-plans`. Essa
opção tem a menor prioridade, portanto `--store`, uma raiz local e um ponteiro
`store:` do projeto continuam prevalecendo. O banner da raiz e o bloco JSON
`root` informam `source: "global_default"` e o ID da store, para que você
sempre consiga distinguir um padrão global de um ponteiro próprio do
repositório. Remova-o com `openspec config unset defaultStore`. Se o ID não
estiver registrado, os comandos falharão e orientarão você a registrá-lo ou
remover o padrão obsoleto.

## Exemplo: uma funcionalidade, dois repositórios de componentes

Suponha que `add-checkout-promo` altere `checkout-api` e `checkout-web`. A
equipe quer um único contrato de produto compartilhado, mas cada repositório de
código ainda precisa ter suas próprias tarefas de implementação, branch e
revisão.

Use duas camadas:

1. Mantenha o comportamento compartilhado em `team-plans`.
2. Mantenha os planos de implementação em cada repositório de componente e
   referencie a store como contexto upstream somente para leitura.

Primeiro, planeje o contrato compartilhado na store:

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

A proposta e as especificações devem descrever o comportamento na interface
entre os componentes — por exemplo, os campos de promoção retornados pelo
serviço e como o frontend trata um checkout não elegível. Revise essa mudança
no repositório da store como faria com qualquer outra branch ou pull request.

### Qual contexto fica disponível durante o planejamento?

Selecionar uma store altera a raiz do OpenSpec; não faz com que ele descubra
ou leia todos os repositórios de código que usam essa store. As instruções da
store veem os artefatos e o contexto configurado nela. O código dos componentes
só fica disponível quando essas pastas também estão acessíveis ao agente ou
editor e são lidas pelo agente.

Um workset é uma forma prática de abrir juntos a store de planejamento e os
dois repositórios de código:

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

Isso torna as pastas visíveis em um único workspace do IDE. Não copia o
contexto das fontes para a store, não seleciona os repositórios afetados nem
autoriza um agente a editá-los. Registre fatos duradouros entre componentes
nas especificações compartilhadas; não dependa de que o agente se lembre de
uma fonte que tenha consultado por acaso.

### Como a implementação começa em cada repositório?

Quando não há uma opção `--store` explícita nem uma raiz `openspec/` mais
próxima, o ponteiro `store: team-plans` direciona os comandos para essa store.
Ele não divide uma lista de tarefas da store com base no diretório de onde
`apply` foi invocado. Atualmente, o OpenSpec não direciona tarefas a
repositórios.

Quando cada componente precisar de um ciclo independente de implementação e
revisão, crie para ele uma raiz local do OpenSpec e referencie a store central,
em vez de apontar para ela:

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

Depois que o contrato compartilhado for aprovado e estiver disponível nas
especificações principais da store, crie uma pequena mudança local para a
parte de cada componente:

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

O índice de referências nas instruções de cada repositório fornece o resumo da
especificação da store e o comando exato `openspec show ... --store
team-plans` para consultá-la. Cada proposta local cita esse contrato
compartilhado, e suas tarefas descrevem apenas o trabalho daquele componente.
Em seguida, execute `/opsx:apply` separadamente em cada repositório; a
resolução da raiz mantém os artefatos e as alterações de implementação no
escopo do repositório correspondente. Agora, as mudanças do serviço e do
frontend podem ser testadas, revisadas, mescladas e arquivadas de forma
independente.

Se a implementação precisar começar enquanto a mudança compartilhada ainda
estiver ativa na store, consulte-a explicitamente com
`openspec show add-checkout-promo --store team-plans`; os índices de
referências listam especificações canônicas da store, não mudanças ativas.
Vincule a branch da store às branches dos componentes nas descrições dos pull
requests, para que as pessoas revisoras vejam qual versão do contrato cada
implementação segue.

## Exemplo: requisitos que atravessam os limites das equipes

A equipe de plataforma é responsável pelos requisitos. As equipes de produto
desenvolvem com base neles, em seus próprios repositórios e com seus próprios
projetos. Uma referência descreve essa relação sem mover o trabalho de
ninguém.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**A equipe de produto declara aquilo em que se baseia** em
`openspec/config.yaml` no próprio repositório:

```yaml
references:
  - platform-reqs
```

As referências são um contexto somente para leitura. O repositório mantém sua
própria raiz `openspec/`, e o trabalho continua nela. A diferença é que
`openspec instructions`, nesse repositório, passa a incluir um índice das
especificações da store referenciada — cada uma com um resumo de uma linha e o
comando exato para consultá-la (`openspec show <spec-id> --type spec --store
platform-reqs`). Um agente que trabalha em `api-server` consegue encontrar e
citar os requisitos de pagamento upstream e escrever seu projeto detalhado na
raiz local do repositório, sem que ninguém precise copiar o contexto para lá.

Uma referência pode incluir a origem do clone. Assim, colegas que ainda não
têm a store recebem uma solução completa, em vez de ficarem sem saber como
prosseguir:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Se quiser abrir juntos o plano e o código, crie um workset.** A escolha é
pessoal e explícita: cada pessoa seleciona as pastas com que realmente
trabalha na própria máquina. Os caminhos locais de checkout nunca são
registrados no repositório de planejamento compartilhado.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Duas perguntas que você sempre pode fazer

**“Minha configuração está íntegra?”** — `openspec doctor` verifica a raiz
atual e as stores referenciadas em modo somente leitura, e oferece uma
correção pronta para copiar e colar para cada problema:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**“Com o que estou trabalhando?”** — `openspec context` reúne o conjunto de
trabalho a partir das declarações do OpenSpec: a raiz e as stores que ela
referencia.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Ambos aceitam `--json` para uso por agentes. Além disso,
`openspec context --code-workspace <path>` grava um arquivo de workspace do VS
Code com todo o conjunto — a única gravação feita por esse comando.

## Worksets: reabra as pastas usadas em conjunto

Isso é independente de tudo o que foi descrito até aqui: a maioria das
pessoas abre as mesmas pastas em conjunto a cada sessão — o repositório de
planejamento e mais dois ou três repositórios de código. Um **workset** é uma
visão pessoal, identificada por um nome, que reúne exatamente essas pastas e
pode ser reaberta com um único comando na ferramenta que você escolher.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

Em seguida, `openspec workset open platform` inicia a ferramenta salva:
editores (VS Code, Cursor) abrem uma janela com todos os membros e retornam.
O primeiro membro é o principal. Você pode substituir a ferramenta a qualquer
momento com `--tool <id>`.

Intencionalmente, os worksets *não* são compartilhados. Eles ficam na sua
máquina, nunca são registrados em commits e não descrevem o trabalho: apenas
registram quais pastas você prefere abrir juntas. Remover um workset nunca
altera as pastas dos membros. Novas ferramentas são configuradas, não exigem
código: qualquer uma que possa ser iniciada por um arquivo de workspace ou por
opções para anexar pastas pode ser adicionada à chave `openers` da configuração
global (`openspec config edit`).

## Como os comandos decidem onde atuar

Todos os comandos normais resolvem a raiz da mesma forma e nesta ordem:

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

A linha `Using OpenSpec root:` (e o bloco `root` na saída de `--json`) informa
qual caso se aplica.

## Limitações conhecidas

- **Estrutura beta.** Tudo nesta página pode mudar entre versões — nomes,
  opções, formatos de arquivo e chaves JSON.
- **Um checkout por ID de store em cada máquina.** O registro de um segundo
  checkout com o mesmo ID falha e recomenda primeiro executar
  `store unregister`.
- **Nunca há sincronização, por projeto.** O OpenSpec nunca clona, faz pull
  nem push. Um checkout desatualizado exibe especificações antigas até que
  *você* faça pull; as referências são indexadas em tempo real com base no que
  está no disco.
- **As pastas de planejamento vazias podem não existir.** Uma store nova pode
  ainda não conter `openspec/changes/`, `openspec/specs/` ou
  `openspec/changes/archive/` no Git. Isso é aceito durante a versão beta; as
  pastas aparecem quando comandos normais criam arquivos nelas.
- **Repositórios com ponteiros continuam sendo apenas ponteiros.** Um
  repositório somente de configuração cujo `openspec/config.yaml` declare
  `store: <id>` é tratado como planejamento externalizado, não como um
  checkout de store a registrar. Remova primeiro a linha `store:` se quiser
  intencionalmente converter o repositório em uma raiz de store local.
- **Alguns comandos permanecem no diretório atual.** `templates` e as formas
  nominais obsoletas (`openspec change show` etc.) atuam somente no diretório
  atual e não aceitam `--store`. `schemas` segue a precedência canônica de
  seleção de raiz e aceita `--store <id>`, mantendo inalterada a estrutura do
  array JSON retornado em caso de sucesso.
- **O estado local é específico de cada máquina.** O registro de stores e os
  worksets são configurações locais. O layout da sua máquina nunca é incluído
  em commits do repositório de planejamento compartilhado.
- **Há dois estilos de inicialização para worksets.** Uma ferramenta que não
  possa ser iniciada com um arquivo de workspace ou opções para anexar pastas
  não pode ser adicionada como iniciador.
- **O JSON do agente tem diferenças conhecidas no uso de maiúsculas e
  minúsculas** (chaves da família store usam `snake_case`; as da família de
  fluxos de trabalho usam `camelCase`). Consulte o
  [contrato do agente](/pt-BR/agent-contract/); a unificação foi adiada para
  uma versão futura.

## Onde ficam os arquivos

| O quê | Onde | Compartilhado? |
|---|---|---|
| Planejamento da store | `<store>/openspec/` (especificações, mudanças) | Sim — faça commit e push |
| Identidade da store | `<store>/.openspec-store/store.yaml` | Sim — incluída no commit da store |
| Registro de stores | `<data dir>/openspec/stores/registry.yaml` | Não — somente nesta máquina |
| Worksets | `<data dir>/openspec/worksets/` | Não — somente nesta máquina |

`<data dir>` é `~/.local/share/openspec` no macOS e Linux (ou
`$XDG_DATA_HOME/openspec` quando definida; no Windows, é
`%LOCALAPPDATA%\openspec`.

## Referência

Opções e estruturas JSON exatas de cada comando desta página:
[referência da CLI](/pt-BR/cli/) (stores, doctor, contexto de trabalho e
worksets pessoais) e [contrato do agente](/pt-BR/agent-contract/).
