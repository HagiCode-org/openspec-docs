---
title: "OpenSpec em equipe"
---

Tudo nos outros guias funciona da mesma forma, quer você trabalhe sozinho ou em uma equipe de vinte pessoas. Em equipe, surgem outras dúvidas: onde ficam as especificações, como os colegas revisam um plano e como tudo isso se encaixa no fluxo de pull requests que já usamos?

Em resumo: uma mudança é apenas um conjunto de arquivos, e o OpenSpec nunca mexe no Git. Portanto, ele se encaixa no fluxo de trabalho existente em vez de substituí-lo. Esta página apresenta convenções que funcionam bem.

## Uma regra: o OpenSpec não mexe no Git

O OpenSpec lê e grava arquivos Markdown simples em `openspec/`. Ele nunca cria commits, branches, pushes ou pulls no projeto — e nunca clona ou sincroniza uma [Store](/pt-BR/stores-beta/user-guide/) por conta própria. Isso significa:

- **Faça commit de `openspec/` como qualquer outro código-fonte.** As especificações, as mudanças ativas e o arquivo fazem parte do histórico do projeto. (Sim, faça commit da pasta inteira — consulte as [Perguntas frequentes](/pt-BR/faq/#devo-incluir-a-pasta-openspec-no-git).)
- **Uma mudança é uma pasta que você versiona como código.** `openspec/changes/add-dark-mode/` contém apenas arquivos em um branch.
- **Tudo abaixo é convenção, não imposição.** O OpenSpec não obriga você a seguir esse processo; ele apenas se encaixa bem.

## O ciclo diário

Um fluxo de trabalho eficaz associa cada mudança a um branch e a um pull request:

```
git switch -c add-dark-mode        start a branch, as usual
   │
/opsx:propose add-dark-mode        draft the plan (proposal + specs + tasks)
   │
REVIEW THE PLAN                    you read it before any code — see Reviewing a Change
   │
/opsx:apply                        build it; artifacts + code change together
   │
git commit && open a PR            the PR contains the spec delta AND the code
   │
teammate reviews, merges
   │
/opsx:archive                      fold the delta into specs/, move the change to archive/
```

O plano e o código ficam lado a lado no mesmo branch, para que os colegas revisem ambos juntos; seis meses depois, a especificação arquivada ainda explicará por que o código é como é.

## Revisando especificações em um pull request

É aqui que a equipe percebe os benefícios. Quando um PR inclui a especificação delta da mudança, o revisor recebe algo que uma comparação bruta de diferenças não oferece: **uma descrição em linguagem simples do que a mudança deve fazer**, antes de ler uma única linha de código.

Uma boa ordem para a revisão:

1. **Leia `proposal.md`** — o problema e o escopo são os corretos?
2. **Leia a especificação delta em `specs/`** — a definição de “concluído” está correta? (É a revisão de dois minutos de [Revisando uma mudança](/pt-BR/reviewing-changes/), agora feita dentro do PR.)
3. **Depois leia as diferenças no código** — a implementação atende exatamente a esses requisitos?

Um revisor que discorde da *abordagem* pode apontar isso na proposta, com pouco esforço, em vez de reabrir a discussão em 300 linhas de código. Coloque a especificação delta no início da descrição do PR ou indique a pasta da mudança para que os revisores comecem por ela.

## Quando arquivar

O arquivamento incorpora as diferenças da mudança a `openspec/specs/` e move a pasta para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Como `specs/` é a **fonte de verdade compartilhada**, o momento do arquivamento importa para uma equipe. Duas convenções possíveis:

- **Arquive depois que o PR for mesclado (recomendado).** O branch contém a mudança ativa; depois de mesclá-lo ao branch principal, arquive-a nele (geralmente em um commit de acompanhamento pequeno ou durante uma limpeza programada). Assim, as `specs/` compartilhadas avançam apenas com o trabalho realmente entregue.
- **Arquive dentro do PR.** Mais simples para equipes pequenas: o mesmo PR que adiciona o código também sincroniza e arquiva. A contrapartida é que as diferenças em `specs/` e no código entram juntas, o que pode deixar o PR mais carregado.

Escolha uma opção e mantenha a consistência. De qualquer forma, `/opsx:archive` verifica se as tarefas estão concluídas e oferece sincronizá-las primeiro, evitando que algo inacabado seja mesclado por acidente.

## Duas pessoas, mudanças paralelas

Como as mudanças ficam em pastas separadas, elas não entram em conflito:

- **Pessoas diferentes, mudanças diferentes — sem problema.** `add-dark-mode` e `rate-limit-login` são pastas diferentes em branches diferentes; não se afetam até serem arquivadas.
- **Uma mudança, uma pessoa responsável.** Duas pessoas editando a mesma pasta de mudança entram em conflito como se estivessem editando o mesmo arquivo. Mantenha um único autor por mudança ou divida o trabalho em duas mudanças (mais um motivo para [dimensionar corretamente](/pt-BR/writing-specs/#dimensione-corretamente-a-mudança)).
- **O único lugar em que surgem conflitos é `specs/`.** Se duas mudanças modificarem o *mesmo* requisito, o arquivamento da segunda causará um conflito em `openspec/specs/…/spec.md` — resolva-o como qualquer conflito de mesclagem, mantendo o requisito que reflita a realidade. Isso é raro e é um recurso: o Git está informando que duas mudanças discordaram sobre o comportamento do sistema.

## Quando o planejamento ultrapassa um repositório

Tudo acima pressupõe que o plano fica na pasta `openspec/` do próprio repositório de código, o que é a opção padrão correta. Quando o planejamento realmente abrange vários repositórios ou equipes — um recurso que afeta três serviços ou requisitos de uma equipe consumidos por outras — use o recurso beta **stores**: o planejamento ganha um repositório próprio ao qual qualquer repositório de código pode apontar. Comece pelo [Guia do usuário de Stores](/pt-BR/stores-beta/user-guide/).

## Próximos passos

- [Revisando uma mudança](/pt-BR/reviewing-changes/) — como revisar dentro do seu PR.
- [Escrevendo boas especificações](/pt-BR/writing-specs/) — inclui como dimensionar uma mudança para que caiba em um branch.
- [Guia do usuário de Stores](/pt-BR/stores-beta/user-guide/) — para planejar mudanças que abrangem repositórios e equipes.
