---
title: "Conceitos essenciais em resumo"
---

**O OpenSpec é uma camada leve de acordo entre você e sua IA.** Você registra o que uma mudança deve fazer, a IA prepara os detalhes, vocês analisam o mesmo plano e só então o código é escrito. Esta página resume todo o modelo mental em uma única tela. Para uma explicação completa, consulte [Conceitos](/pt-BR/concepts/).

Em cinco palavras, a ideia toda é: **combine primeiro, construa com confiança.**

## As cinco ideias

Tudo no OpenSpec se baseia em cinco conceitos. Aprenda-os e o restante serão detalhes.

**1. As especificações são a verdade.** Uma especificação descreve como seu sistema se comporta *agora*. Ela fica em `openspec/specs/`, organizada por domínio (`auth/`, `payments/`, `ui/`). As especificações são compostas por requisitos (“o sistema DEVE expirar sessões após 30 minutos”) e cenários (exemplos concretos em formato dado/quando/então). Pense nelas como a resposta única e acordada à pergunta “o que este software faz?”.

**2. Uma mudança é uma unidade de trabalho.** Quando quiser adicionar, modificar ou remover um comportamento, crie uma mudança: uma pasta em `openspec/changes/` que reúne tudo sobre esse trabalho em um só lugar — proposta, design, lista de tarefas e alterações nas especificações. Uma mudança, uma pasta, um recurso.

**3. Especificações delta descrevem o que está mudando, não o mundo inteiro.** Dentro de uma mudança, você não reescreve toda a especificação. Escreve uma pequena diferença: este requisito foi `ADDED` (adicionado), aquele foi `MODIFIED` (modificado) e outro foi `REMOVED` (removido). Esse é o recurso que torna o OpenSpec útil para modificar sistemas existentes, não apenas para projetos novos. Você descreve a diferença, não o destino.

**4. Os artefatos se complementam.** Uma mudança contém alguns documentos, criados em uma ordem natural, cada um servindo de base para o seguinte:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Você pode revisitar qualquer um deles a qualquer momento. Eles facilitam o trabalho; não são etapas obrigatórias. (Mais sobre isso adiante.)

**5. O arquivamento incorpora a mudança à verdade.** Quando o trabalho termina, você arquiva a mudança. Suas especificações delta são mescladas às especificações principais, e a pasta da mudança é movida para `changes/archive/` com uma data no nome. Agora as especificações descrevem a nova realidade, e você está pronto para a próxima mudança. O ciclo se fecha.

## O diagrama

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Duas pastas. `specs/` contém o que é verdade. `changes/` contém o que você está propondo. Arquivar incorpora uma proposta à verdade.

## O ciclo que você realmente usará

Na configuração padrão, seu fluxo será assim. Se quiser, pense primeiro sobre o assunto; depois um comando prepara o plano, você o lê, o próximo o implementa e o último o arquiva.

```text
/opsx:explore                   →  (optional) think it through with the AI first
/opsx:propose add-dark-mode     →  AI drafts proposal, specs, design, tasks
        (you read and adjust the plan)
/opsx:apply                     →  AI builds it, checking off tasks
/opsx:archive                   →  specs updated, change archived
```

**Em caso de dúvida, comece explorando.** `/opsx:explore` é um parceiro de reflexão sem compromisso: ele lê seu código, apresenta opções e transforma uma ideia vaga em um plano concreto antes que qualquer código seja escrito. É o melhor antídoto para uma IA que, de outra forma, poderia construir *qualquer coisa* a partir de um pedido impreciso. Já sabe exatamente o que quer? Vá direto para `/opsx:propose`. De todo modo, explore faz parte do perfil padrão e está sempre disponível. Consulte o [guia Explorar](/pt-BR/explore/).

Esses são comandos de barra, digitados no chat do seu assistente de IA. A configuração (`openspec init`) é feita no terminal. Se essa divisão é novidade para você, leia primeiro [Como os comandos funcionam](/pt-BR/how-commands-work/); essa é a dúvida mais comum.

## “Facilitadores, não barreiras”

Essa frase aparece por toda parte no OpenSpec. Veja o que ela significa, em termos simples.

Os processos tradicionais de especificação seguem um modelo em cascata: termine o planejamento e *só então* você pode implementar; voltar atrás é difícil. O OpenSpec não impõe isso. A ordem `proposal → specs → design → tasks` indica o que se torna *possível* em seguida, não o que você é *obrigado* a fazer.

Percebeu durante a implementação que o design estava errado? Edite `design.md` e continue. Descobriu que o escopo deve ser menor? Atualize a proposta. Nada fica bloqueado. As dependências existem apenas para fornecer à IA o contexto necessário (não dá para escrever boas tarefas sem especificações que as fundamentem), e não para limitar você.

O ponto forte é a honestidade: o trabalho real é confuso e iterativo, e o OpenSpec permite que seja assim. A contrapartida é a disciplina: como nada obriga você a avançar, cabe a você manter o foco da mudança em vez de deixá-la crescer sem limites. O guia de [Fluxos de trabalho](/pt-BR/workflows/) apresenta boas práticas para isso.

## Por que esse pequeno esforço vale a pena

A verdade é simples: o OpenSpec acrescenta uma etapa. Você escreve um plano curto antes de começar a construir. O que ganha com isso?

- **Você identifica desvios antes que custem caro.** Corrigir um mal-entendido em uma proposta de um parágrafo não custa nada. Corrigi-lo depois que a IA escreveu 400 linhas, sim.
- **O plano e o código ficam no mesmo repositório.** Seis meses depois, a especificação explica a você (e à próxima sessão de IA) por que o sistema funciona daquela maneira.
- **As mudanças podem ser revisadas.** Uma pasta de mudança é um pacote organizado: leia a proposta, confira as diferenças e verifique as tarefas. Sem arqueologia no histórico do chat.
- **Funciona com bases de código existentes.** Com as diferenças, você consegue especificar uma mudança em um aplicativo de 50 mil linhas sem documentar tudo primeiro.

E há uma contrapartida: para uma correção realmente trivial de uma linha, o processo talvez não compense — e tudo bem. O OpenSpec foi projetado para ser leve, mas não é gratuito em termos de esforço. Use-o quando o alinhamento for importante, o que acontece na maior parte das vezes quando se trabalha com uma IA que construirá com confiança qualquer coisa que você tenha pedido de forma vaga.

## Próximos passos

- Está começando? [Primeiros passos](/pt-BR/getting-started/) explica a primeira mudança por completo.
- Ainda não sabe o que construir? Comece por [Explore primeiro](/pt-BR/explore/).
- Não sabe onde executar os comandos? Leia [Como os comandos funcionam](/pt-BR/how-commands-work/).
- Quer uma explicação detalhada de tudo isso? Consulte [Conceitos](/pt-BR/concepts/).
- Prefere aprender por exemplos? Veja [Exemplos e receitas](/pt-BR/examples/).
- Precisa da definição de um termo? Consulte o [Glossário](/pt-BR/glossary/).
