---
title: "Usando o OpenSpec em um projeto existente"
---

**Você não precisa documentar toda a base de código para começar. Escreva especificações apenas para o que pretende alterar.** Essa é a informação mais importante para adotar o OpenSpec em um projeto existente e o motivo pelo qual ele prioriza projetos já estabelecidos.

Uma preocupação comum é: “Meu aplicativo já tem 80 mil linhas. Preciso escrever especificações para tudo antes que o OpenSpec seja útil?”. Não. Você odiaria isso, e nós também. O OpenSpec amplia suas especificações uma mudança por vez. A primeira mudança documenta a parte que afeta, a seguinte documenta a sua parte e, ao longo dos meses, as especificações se completam naturalmente em torno do trabalho que você realmente faz.

Este guia mostra como começar no primeiro dia sem tentar resolver tudo de uma vez.

## A versão de trinta segundos

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Depois, no chat da IA:

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Agora, suas especificações descrevem exatamente a parte do sistema afetada pela mudança, e nada além disso. É assim mesmo. Você não precisa mais se preocupar com as outras 80 mil linhas.

## Por que começar pelas diferenças é o segredo

As mudanças do OpenSpec são descritas como **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Uma delta descreve o que muda em relação ao comportamento atual, não o sistema inteiro.

É exatamente disso que o trabalho em projetos existentes precisa. Raramente se constrói tudo do zero: você adiciona um campo, corrige um redirecionamento ou reduz um tempo limite. Uma delta permite especificar essa única mudança com precisão, sem antes escrever uma especificação de 40 páginas sobre tudo ao redor.

Portanto, o diretório `openspec/specs/` não começa completo. Ele começa quase vazio e vai crescendo. Cada mudança arquivada incorpora sua delta. A especificação de `auth/` só fica detalhada depois que você faz várias mudanças relacionadas à autenticação — justamente quando esse nível de detalhe se torna útil.

Para entender melhor o funcionamento, consulte [Conceitos: especificações delta](/pt-BR/concepts/#especificações-delta).

## Sua primeira mudança em uma base de código real

Escolha algo pequeno e real. Nada de exercício artificial ou reescrita completa: escolha uma mudança que você já pretendia fazer nesta semana. Mudanças pequenas ensinam o fluxo de trabalho sem grandes riscos.

**Etapa 1: deixe a IA ler a área relevante.** É aqui que `/opsx:explore` se mostra útil em uma base de código desconhecida ou grande. Indique a parte que pretende alterar e deixe a IA entender como ela funciona antes de propor qualquer coisa.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Observe que agora a IA entende a estrutura real do seu projeto, então a proposta que escreverá se encaixará no seu código em vez de ser um modelo genérico. Em uma base de código grande, esse hábito evita muitos problemas. Consulte [Comece explorando](/pt-BR/explore/).

**Etapa 2: proponha a mudança.** A proposta e sua especificação delta registram apenas essa mudança.

```text
You: /opsx:propose add-api-rate-limiting
```

**Etapa 3: implemente e arquive** com `/opsx:apply` e `/opsx:archive`, como em qualquer mudança. Depois de arquivar, você terá uma especificação real sobre o comportamento de limitação de taxa, criada a partir de uma mudança que já precisava fazer.

## Prefere um tour guiado? Use onboard

Se preferir acompanhar todo o ciclo, com explicações, no seu próprio código, o comando expandido `/opsx:onboard` faz exatamente isso: examina a base de código em busca de uma melhoria pequena e segura e, em seguida, orienta você ao propô-la, implementá-la e arquivá-la, explicando cada etapa.

Primeiro, ative os comandos expandidos:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Depois, no chat:

```text
/opsx:onboard
```

É a introdução mais tranquila possível a um projeto real, e você termina com uma mudança genuína (e pequena) que pode manter ou descartar. Consulte [Comandos: `/opsx:onboard`](/pt-BR/commands/#opsxonboard).

## “Mas já tenho documentos de requisitos”

Talvez você tenha um PRD, um SRS, uma especificação formal ou até modelos TLA+. Ótimo. Você não os importa na íntegra, mas também não precisa descartá-los.

Trate os documentos existentes como **material de referência para exploração**, não como especificações a converter. Ao iniciar uma mudança, cole a seção relevante ou indique-a à IA e deixe que ela crie uma delta focada para o OpenSpec. A delta registra o comportamento que você está alterando agora no formato testável de requisitos e cenários do OpenSpec. Os documentos originais permanecem onde estão como material de apoio.

A razão é simples: as especificações do OpenSpec são deliberadamente centradas no comportamento e limitadas às mudanças. Um PRD de 40 páginas é outro artefato, com outra finalidade. Forçar uma conversão em massa de uma só vez tende a produzir uma especificação extensa e desatualizada, na qual ninguém confia. Deixar as especificações crescerem a partir de mudanças reais as mantém precisas.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Organizando especificações em uma base de código grande

As especificações ficam em `openspec/specs/`, agrupadas por **domínio**: uma área lógica que corresponde à forma como sua equipe entende o sistema. Você não precisa definir toda a taxonomia de antemão. Crie uma pasta de domínio quando a primeira mudança naquela área precisar dela.

Formas comuns de dividir os domínios:

- **By feature area:** `auth/`, `payments/`, `search/`
- **By component:** `api/`, `frontend/`, `workers/`
- **By bounded context:** `ordering/`, `fulfillment/`, `inventory/`

Escolha uma organização que faça sentido para quem está chegando. Você pode refiná-la depois. Consulte [Conceitos: especificações](/pt-BR/concepts/#especificações).

## Monorepos e trabalhos que abrangem repositórios

Em um monorepo, o modelo mais simples é ter um diretório `openspec/` na raiz do repositório e domínios correspondentes aos pacotes ou serviços. Isso atende à maioria das equipes.

Se o trabalho realmente abranger **vários repositórios** (ou vários pacotes tratados separadamente), o OpenSpec tem o recurso beta **stores**: o planejamento fica em um repositório independente que pode ser referenciado por qualquer repositório de código, em vez de ficar dentro da pasta `openspec/` de um único repositório. Como está em beta, considere que seus comandos e seu estado ainda podem mudar. Comece pelo [Guia do usuário de Stores](/pt-BR/stores-beta/user-guide/) para entender o modelo e o caminho mais simples.

## Algumas ressalvas importantes

- **Resista à tentação de preencher tudo retroativamente.** Escrever especificações para código que você não está alterando parece produtivo, mas geralmente não é. Essas especificações ficam desatualizadas porque nada as obriga a acompanhar a realidade. Deixe que mudanças reais orientem suas especificações.
- **Mantenha pequenas as primeiras mudanças.** As primeiras mudanças servem tanto para aprender o ritmo quanto para entregar algo. Um escopo restrito torna o ciclo rápido e o aprendizado barato.
- **Faça commit de `openspec/` no Git.** Suas especificações e o arquivo de mudanças arquivadas pertencem ao controle de versão junto com o código que descrevem.
- **Forneça contexto à IA.** Em uma base de código grande e com convenções bem definidas, preencha `context:` em `openspec/config.yaml` para que cada proposta respeite sua stack e seus padrões. Consulte [Personalização](/pt-BR/customization/#configuração-do-projeto).

## Próximos passos

- [Comece explorando](/pt-BR/explore/) — o hábito essencial para entender o código antes de alterá-lo.
- [Primeiros passos](/pt-BR/getting-started/) — guia completo da primeira mudança.
- [Editando e iterando em uma mudança](/pt-BR/editing-changes/) — ajuste uma mudança conforme aprende.
- [Conceitos: especificações delta](/pt-BR/concepts/#especificações-delta) — por que as deltas simplificam o trabalho em projetos existentes.
- [Personalização](/pt-BR/customization/) — ensine ao OpenSpec as convenções do seu projeto.
