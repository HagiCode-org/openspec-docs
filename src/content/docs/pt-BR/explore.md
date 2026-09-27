---
title: "Comece explorando"
---

**`/opsx:explore` é seu parceiro de reflexão. Use-o sempre que tiver um problema, mas ainda não tiver um plano.** Ele investiga sua base de código, avalia opções com você e esclarece o que você realmente quer, tudo antes que uma linha de código seja escrita. Quando tudo estiver claro, ele passa o trabalho para `/opsx:propose`.

Se você adotar apenas um hábito desta documentação, adote este: **quando tiver dúvidas, explore antes de propor.**

Veja por que isso importa. Assistentes de programação com IA são ávidos para agir. Faça um pedido vago e eles construirão com confiança *alguma coisa* — talvez não o que você precisava. Explore é a solução: uma conversa sem compromisso na qual você e a IA descobrem juntos o caminho certo, para que, quando chegar a hora de propor, você proponha a coisa certa.

## Quando explorar

Explore é o primeiro passo certo com mais frequência do que as pessoas imaginam. Use-o quando qualquer uma destas situações se aplicar:

- Você conhece o *problema*, mas não a *solução*. (“As páginas estão lentas.” “A autenticação está uma bagunça.” “Continuamos recebendo pedidos duplicados.”)
- Está escolhendo entre abordagens e quer comparar as vantagens e desvantagens no contexto do código real.
- É novo na base de código e precisa entender como algo funciona antes de alterá-lo.
- Os requisitos são vagos e você quer refiná-los antes de se comprometer.
- Suspeita que o trabalho é maior ou menor do que parece e quer definir o escopo com honestidade.

Pule explore apenas quando já souber exatamente o que quer e como fazer. Nesse caso, vá direto para [`/opsx:propose`](/pt-BR/commands/#opsxpropose).

## O que faz (e o que não faz)

Explore é uma **conversa**, não um gerador.

**O que faz:**
- Lê e pesquisa sua base de código para responder a perguntas reais.
- Compara opções e identifica as vantagens e desvantagens de cada uma.
- Desenha diagramas para tornar um design compreensível.
- Ajuda você a transformar uma ideia vaga em um escopo concreto e implementável.
- Registra a exploração quando você pede ou aceita a oferta: cria a estrutura da mudança com `openspec new change` e escreve os artefatos de planejamento que você especificar, ou atualiza os artefatos de uma mudança existente.
- Passa para `/opsx:propose` quando você estiver pronto.

**O que não faz:**
- Não escreve nem modifica código. Explore nunca escreve código, nem mesmo ao registrar uma exploração.
- Não cria nem edita esquemas ou modelos. Moldá-los é uma mudança, não uma etapa de reflexão.
- Não inicia uma mudança nem escreve artefatos por conta própria. Não escreve nada a menos que você peça ou aceite uma oferta; nesse caso, escreve apenas o que você aprovou, além dos arquivos de configuração necessários para iniciar uma mudança (veja abaixo).
- Não pressiona você a registrar a exploração. A opção é oferecida quando as ideias se consolidam; a decisão é sua.

Esse é o objetivo. Explorar não custa nada nem obriga você a nada até que decida prosseguir. Você pode explorar três caminhos sem saída, aprender algo com cada um e só então propor o caminho que restou.

## Já está instalado

Boas notícias: `/opsx:explore` vem no perfil padrão **core**, junto com `propose`, `apply`, `update`, `sync` e `archive`. Você não precisa ativar nada. Se o OpenSpec estiver configurado no projeto, explore estará pronto no chat da IA. (Como todos os comandos `/opsx:*`, ele é digitado no chat do assistente, não no terminal. Consulte [Como os comandos funcionam](/pt-BR/how-commands-work/).)

## Exemplo completo

Veja como uma preocupação vaga se transforma em uma mudança bem definida e implementável.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Observe o que aconteceu. O ponto de partida foi “algo está errado e tenho medo de mexer”. Vinte segundos de exploração transformaram isso em uma causa raiz identificada, três opções classificadas, uma recomendação baseada no código existente e uma mudança precisa. A proposta que vem em seguida é clara porque a reflexão aconteceu primeiro.

## Passando para propose

Explore não arquiva nada. Quando estiver pronto, basta iniciar uma mudança; a IA leva o contexto da conversa para os artefatos.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Você pode pedir em linguagem simples (“vamos transformar isso em uma mudança”) ou executar `/opsx:propose <name>` diretamente. De qualquer forma, a exploração que você acabou de fazer se torna a base da proposta, em vez de ser apenas uma conversa descartável.

Você também pode pedir a explore que registre a própria mudança sem sair da conversa: “inicie uma mudança para isto” cria a estrutura da pasta, e “escreva a proposta também” gera exatamente os artefatos que você indicou. A criação da estrutura também inclui os metadados da mudança e completa o que estiver faltando no nível superior do projeto (`openspec/specs/`, `openspec/changes/archive/`, um `config.yaml`).

O resultado é o mesmo de passar o trabalho adiante, com uma diferença: propose escreve o conjunto completo exigido pelo esquema para chegar à implementação, enquanto o registro cria apenas os artefatos indicados por você.

Se você usa o conjunto expandido de comandos, explore pode passar o trabalho para `/opsx:new`, que cria os artefatos passo a passo. Consulte [Fluxos de trabalho](/pt-BR/workflows/).

## Dicas para uma boa exploração

- **Apresente o problema, não a solução.** “Os logins parecem lentos” dá espaço para a IA investigar. “Adicione um cache Redis” já compromete você com uma solução que ainda não foi testada.
- **Pergunte explicitamente sobre as contrapartidas.** “Quais são as desvantagens de cada opção?” resulta em uma comparação mais honesta.
- **Deixe a IA ler primeiro.** As melhores explorações começam com a IA examinando seu código, em vez de fazer suposições. Se ajudar, indique a área relevante.
- **Tudo bem desistir.** Se a exploração revelar que a ideia não vale a pena, isso é um bom resultado. Você descobriu isso a baixo custo.
- **Explore novamente durante uma mudança.** Travou durante `/opsx:apply`? Volte e explore um problema menor, depois retome.

## As contrapartidas, sem rodeios

**O que você ganha:** explore identifica desvios no momento de menor custo, antes que você se comprometa com algo. É especialmente útil em códigos desconhecidos, nos quais a capacidade da IA de ler e resumir o sistema poupa uma tarde de investigação.

**O que custa:** um pouco de paciência. Explore é uma conversa e, portanto, é mais lento do que executar `/opsx:propose` e torcer para dar certo. Se você já entende bem o trabalho, essa etapa extra é apenas um custo, então pule-a.

Regra prática: quanto mais vaga a tarefa, maior o benefício de explore. Quanto mais clara, mais direto você pode ir para propose.

## Próximos passos

- [Comandos: `/opsx:explore`](/pt-BR/commands/#opsxexplore): referência detalhada
- [Fluxos de trabalho](/pt-BR/workflows/): explore como parte do ciclo diário
- [Exemplos e receitas](/pt-BR/examples/#receita-3-explorando-antes-de-se-comprometer): explore em um guia completo
- [Primeiros passos](/pt-BR/getting-started/): guia da primeira mudança, incluindo a exploração
