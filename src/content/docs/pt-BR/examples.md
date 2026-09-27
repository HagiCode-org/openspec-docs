---
title: "Exemplos e receitas"
---

Mudanças reais, do início ao fim. Cada receita mostra os comandos que você digitaria e as respostas que receberia, para que possa encontrar um padrão adequado à sua situação e copiá-lo. Os exemplos usam os comandos padrão do perfil **core** (`propose`, `explore`, `apply`, `update`, `sync`, `archive`); quando o conjunto expandido for útil, isso será indicado.

Antes de começar, lembre-se: comandos de barra, como `/opsx:propose`, são digitados no **chat do assistente de IA**, e comandos `openspec` são executados no **terminal**. Se isso é novidade, leia primeiro [Como os comandos funcionam](/pt-BR/how-commands-work/). Nas transcrições abaixo, `You:` e `AI:` representam o chat, e as linhas que começam com `$` representam o terminal.

> **Ainda não sabe o que vai construir?** A maioria destas receitas fica mais precisa se você começar com `/opsx:explore` para refletir sobre a ideia. A [Receita 3](#receita-3-explorando-antes-de-se-comprometer) mostra isso na prática, e o guia [Comece explorando](/pt-BR/explore/) explica todos os benefícios.

## Receita 1: um recurso pequeno, pelo caminho rápido

**Quando usar:** você sabe o que quer, e o trabalho tem escopo limitado. Esta é a receita mais comum.

São apenas três comandos: propor, implementar e arquivar.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Agora, leia o plano. Abra a proposta e a especificação delta. É para isso que o OpenSpec foi criado: detectar uma suposição incorreta quando ainda ocupa um parágrafo, não 400 linhas de código. Se algo estiver errado, edite o artefato diretamente e continue.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Pronto. O comportamento de logout agora faz parte das especificações, e a mudança foi arquivada com todo o seu contexto.

## Receita 2: corrigindo um bug

**Quando usar:** algo está quebrado e você quer registrar a correção como uma mudança deliberada de comportamento, não como um commit misterioso.

Correções de bugs funcionam exatamente como recursos. A diferença está na forma de apresentar a proposta: descreva o comportamento *correto*, não apenas “corrija o bug”.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Como a correção é registrada como um requisito `MODIFIED` com um novo cenário, a próxima pessoa (ou sessão de IA) verá não apenas que você corrigiu o problema, mas também o que significa “correto”. Depois, execute `/opsx:apply` e `/opsx:archive` como de costume.

Dica: em uma correção, um bom cenário descreve em prosa o teste de regressão. “GIVEN um usuário desconectado, WHEN ele envia credenciais válidas, THEN chega ao painel e não é redirecionado novamente.” Escreva isso para definir um objetivo claro para a implementação.

## Receita 3: explorando antes de se comprometer

**Quando usar:** você tem um problema, mas ainda não tem um plano. Não sabe o que construir ou qual abordagem é adequada.

Comece com `/opsx:explore`. É um parceiro de reflexão sem estrutura predefinida. Ele nunca escreve código nem cria outros arquivos, a menos que você peça para registrar sua decisão ou aceite quando ele oferecer essa opção. Ele lê a base de código e ajuda você a decidir.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

A exploração esclarece suas ideias *antes* de você dedicar uma mudança a elas. Quando a ideia estiver definida, faça a proposta e a IA levará o contexto adiante.

## Receita 4: trabalhando em duas mudanças ao mesmo tempo

**Quando usar:** você está no meio de um recurso e uma correção urgente passa à frente.

As mudanças ficam em pastas independentes, então o trabalho em paralelo não entra em conflito. Comece pela correção, entregue-a e depois retome o recurso exatamente de onde parou.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Indicar o nome da mudança em `/opsx:apply add-dark-mode` permite direcionar a IA para uma mudança específica quando há mais de uma ativa. Como as tarefas registram o progresso em `tasks.md`, a IA sabe exatamente onde você parou.

Quando várias mudanças forem concluídas ao mesmo tempo, o comando expandido `/opsx:bulk-archive` arquiva todas juntas e resolve conflitos nas especificações verificando o que foi realmente implementado. Consulte [Fluxos de trabalho](/pt-BR/workflows/#mudanças-em-paralelo).

## Receita 5: refatoração sem alteração de comportamento

**Quando usar:** você está reorganizando o código e o comportamento visível externamente deve continuar igual.

Este é um caso interessante, pois uma refatoração pura não tem *nada a acrescentar às especificações*. O contrato de comportamento não muda; apenas a implementação muda. Portanto, o trabalho fica no design e nas tarefas, e a especificação delta fica vazia ou não existe.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Declare explicitamente que a delta está vazia definindo `skip_specs: true` no `.openspec.yaml` da mudança:

```yaml
schema: spec-driven
skip_specs: true
```

Sem esse marcador, `openspec validate` rejeita uma mudança sem deltas (o que também detecta uma etapa de especificação esquecida); com ele, a validação é aprovada e `openspec status` mostra a etapa de especificações como explicitamente ignorada, não pendente. Se a refatoração acabar alterando o comportamento, remova `skip_specs` de `.openspec.yaml` e escreva as especificações delta — a validação trata o marcador e os arquivos de especificação em conjunto como um conflito, impedindo que o marcador desatualizado permaneça sem aviso.

Arquivar uma mudança marcada não requer opções extras (não há deltas para mesclar). Separadamente, a opção `--skip-specs` instrui o comando de terminal a ignorar explicitamente a etapa de especificações:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

A mesma opção é útil para ferramentas, CI e mudanças apenas na documentação. O princípio é: especificações descrevem comportamento; se o comportamento não mudou, a especificação também não deve mudar. Consulte [Conceitos](/pt-BR/concepts/#o-que-uma-especificação-é-e-o-que-não-é).

## Receita 6: controle passo a passo (comandos expandidos)

**Quando usar:** uma mudança complexa ou arriscada cujos artefatos você quer revisar um a um.

O comando core `/opsx:propose` prepara tudo de uma vez. Se preferir avançar uma etapa por vez, ative os comandos expandidos:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Agora você pode criar a estrutura e avançar aos poucos:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Revise cada artefato assim que for criado, edite à vontade e continue quando estiver satisfeito. Se quiser gerar o restante de uma só vez, `/opsx:ff` avança rapidamente pelos artefatos de planejamento restantes. Antes de arquivar, `/opsx:verify` verifica se a implementação realmente corresponde às especificações. Consulte [Fluxos de trabalho](/pt-BR/workflows/#opsxff-ou-opsxcontinue).

## Receita 7: aprendendo o ciclo completo na prática

**Quando usar:** você instalou o OpenSpec e quer *vivenciar* o fluxo de trabalho no seu próprio código, não em um exemplo artificial.

Ative os comandos expandidos (consulte a Receita 6) e depois execute:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` encontra uma melhoria real (e pequena), cria uma mudança para ela, implementa-a e arquiva-a, explicando cada etapa. O processo leva de 15 a 30 minutos e deixa uma mudança real que você pode manter ou descartar. É a forma mais tranquila de aprender. Consulte [Comandos](/pt-BR/commands/#opsxonboard).

## Verificando seu trabalho no terminal

Você pode verificar o estado do trabalho no terminal a qualquer momento:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Essas ferramentas servem para consultar e inspecionar. As propostas e implementações continuam sendo feitas por meio de comandos de barra no chat. Veja todos os detalhes na [referência da CLI](/pt-BR/cli/).

## Próximos passos

- [Comece explorando](/pt-BR/explore/): a forma recomendada de começar quando tiver dúvidas
- [Fluxos de trabalho](/pt-BR/workflows/): os padrões acima e orientações para decidir quando usar cada um
- [Comandos](/pt-BR/commands/): detalhes de todos os comandos de barra
- [Primeiros passos](/pt-BR/getting-started/): guia de referência para sua primeira mudança
- [Conceitos](/pt-BR/concepts/): por que os elementos se encaixam dessa forma
