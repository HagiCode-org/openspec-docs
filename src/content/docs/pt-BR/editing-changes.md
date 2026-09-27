---
title: "Editando e iterando em uma mudança"
---

**Todo artefato de uma mudança é apenas um arquivo Markdown que você pode editar a qualquer momento.** Não existe uma “fase de planejamento” bloqueada, etapa de aprovação ou modo especial de edição. Quer alterar a proposta depois de começar a implementação? Abra `proposal.md` e edite-o. Percebeu no meio da implementação que o design está errado? Corrija `design.md` e continue. Essa é toda a resposta — e foi assim que o processo foi projetado.

Esta página é para quando você pensa: “espera, posso voltar e mudar isso?”. Sim. Veja como fazer em cada situação comum.

## Duas formas de editar qualquer coisa

Você sempre pode escolher entre estas duas opções:

1. **Edite o arquivo diretamente.** Os artefatos são arquivos Markdown simples em `openspec/changes/<name>/`. Abra `proposal.md`, `design.md`, `tasks.md` ou uma especificação delta em `specs/` no editor e faça as alterações. Não é necessário fazer mais nada.

2. **Peça à sua IA para revisar o arquivo.** No chat, diga o que você quer: “Atualize a proposta para remover a ideia de cache e adicionar uma seção sobre limite de taxa” ou “o design deve usar uma fila, não polling”. A IA edita o artefato usando o restante da mudança como contexto.

Use a opção que fizer mais sentido. É só um pequeno ajuste de texto? Edite o arquivo. É uma reconsideração mais profunda? Peça à IA para revisá-lo com o contexto completo.

## “Como atualizo a proposta (ou as especificações) depois de começar?”

É só atualizá-la. É a mesma mudança, refinada.

Se você usa os comandos expandidos, o fluxo natural é editar o artefato e executar `/opsx:continue` para retomar a partir do novo estado, ou `/opsx:apply` para continuar implementando com base no plano atualizado. Se usa os comandos padrão do perfil `core`, edite o artefato e execute `/opsx:apply`; ele lê os arquivos atuais e, portanto, implementa o que os artefatos descrevem naquele momento.

O modelo mental é este: os artefatos são o plano vigente, não um contrato assinado. A IA sempre trabalha com o conteúdo atual deles, então editá-los direciona o trabalho.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

Isso responde a uma dúvida muito comum: não há um comando separado para “atualizar a proposta” porque ele não é necessário. O arquivo é a fonte de verdade, e editá-lo (manualmente ou com ajuda da IA) é a atualização.

## “Como volto à revisão depois de implementar?”

Você não precisa “voltar”, porque nunca saiu da revisão. O fluxo é flexível: revisão, edição e implementação não são fases sequenciais que prendem você.

Na prática, depois de executar `/opsx:apply` por algum tempo:

- Quer reexaminar o plano? Abra os artefatos e leia-os ou execute `openspec show <change>` no terminal para ver tudo de forma consolidada.
- Encontrou algo que deseja alterar? Edite o artefato (ou peça à IA para fazê-lo) e continue.
- Quer verificar de forma estruturada se o código corresponde ao plano? Execute `/opsx:verify` (comando expandido). Ele informa se o trabalho está completo, correto e coerente, sem bloquear nada. Consulte [Fluxos de trabalho: verificar](/pt-BR/workflows/#verificar-confira-seu-trabalho).

Não existe uma “fase de revisão” à qual seja preciso retornar, pois você pode revisar em qualquer momento, inclusive depois da implementação.

## “Editei o código manualmente. Como faço para conciliá-lo com o OpenSpec?”

Isso acontece o tempo todo, e não há problema. Você ajustou algo no editor e agora o código e os artefatos estão em desacordo. Sincronize-os na direção que corresponda à realidade:

- **O código está correto, mas a especificação ficou desatualizada.** Atualize a especificação delta (e as tarefas, se necessário) para descrever o comportamento que você realmente entregou. Antes de arquivar, a especificação deve corresponder à realidade, pois o arquivamento a incorpora à sua fonte de verdade.
- **A especificação está correta, mas o código divergiu.** Continue implementando ou corrigindo até que o código corresponda à especificação.

Uma forma rápida de identificar divergências é executar `/opsx:verify`: o comando lê os artefatos e o código e mostra onde eles não correspondem. Use o resultado como uma lista de tarefas para conciliá-los e arquive quando estiverem alinhados.

O princípio é: ao arquivar, suas especificações passam a ser o registro oficial. Portanto, antes de arquivar, garanta que elas descrevam fielmente o que o código faz. Edições manuais são bem-vindas; apenas não deixe que elas dessincronizem silenciosamente a especificação.

## Refinando uma proposta que não agradou

Se uma proposta gerada não atender ao que você esperava, há três boas opções:

- **Itere no próprio artefato.** Diga à IA o que está errado (“o escopo é amplo demais; remova os recursos administrativos”) e peça uma revisão. É a opção mais simples e geralmente a melhor.
- **Explore primeiro e proponha novamente.** Se o problema é a falta de clareza da ideia, volte a `/opsx:explore`, pense melhor e deixe que disso surja uma proposta mais precisa. Consulte [Comece explorando](/pt-BR/explore/).
- **Comece do zero.** Se a intenção mudou fundamentalmente, criar uma nova mudança pode ser mais claro do que remendar a antiga.

A próxima seção traz um guia para decidir quando usar essa última opção.

## Quando atualizar ou iniciar uma nova mudança

Em resumo: **atualize quando for o mesmo trabalho, apenas refinado; comece uma nova mudança quando a intenção mudar fundamentalmente ou o escopo se expandir para um trabalho diferente.**

- Mesmo objetivo, abordagem melhor? Atualize.
- Escopo menor (entregar o MVP agora e o restante depois)? Atualize, arquive e crie uma nova mudança para a segunda etapa.
- O problema mudou (“adicionar modo escuro” virou “criar um sistema completo de temas”)? Crie uma nova mudança.

Há um fluxograma completo e exemplos práticos em [Fluxos de trabalho: quando atualizar ou começar do zero](/pt-BR/workflows/#quando-atualizar-ou-começar-do-zero) e uma explicação mais detalhada em [OPSX: quando atualizar ou começar do zero](/pt-BR/opsx/#quando-atualizar-ou-começar-do-zero).

## Uma observação sobre tarefas

`tasks.md` é uma lista de verificação dinâmica, não um plano imutável. Durante a implementação, você pode adicionar tarefas que descobrir, remover as que se mostrarem desnecessárias ou alterar a ordem delas. A IA marca os itens como concluídos à medida que os finaliza durante `/opsx:apply` e, se você voltar mais tarde, retoma a partir da primeira tarefa não marcada. É esperado que a lista seja editada durante o trabalho.

## Próximos passos

- [Fluxos de trabalho](/pt-BR/workflows/) — padrões e um guia para decidir entre atualizar ou criar uma nova mudança
- [Revisando uma mudança](/pt-BR/reviewing-changes/) — uma análise de dois minutos do plano antes de começar a implementação
- [Comece explorando](/pt-BR/explore/) — onde voltar quando uma ideia precisa ser repensada
- [Comandos](/pt-BR/commands/) — detalhes sobre `/opsx:continue`, `/opsx:apply` e `/opsx:verify`
- [Conceitos: artefatos](/pt-BR/concepts/#artefatos) — para que serve cada artefato
