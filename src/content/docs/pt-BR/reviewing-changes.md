---
title: "Revisando uma mudança"
---

A proposta central do OpenSpec é que você e sua IA **combinem o que será construído antes que qualquer código seja escrito.** Esse acordo só tem valor se você realmente ler o que a IA preparou. Esta página trata dos dois minutos que você dedica a isso: o que abrir, em que ordem e o que procurar.

A aposta é simples: identificar um desvio em um plano de um parágrafo é quase gratuito. Encontrar o mesmo desvio em 300 linhas de código não é. A revisão é o momento de colher os benefícios dessa aposta.

## Os dois momentos de revisão

There are exactly two:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Depois de `/opsx:propose`** (ou `/opsx:ff`), antes de `/opsx:apply`: leia o plano enquanto ele ainda é apenas texto.
2. **Depois da implementação**, com `/opsx:verify`: confira se o código realmente fez o que o plano descrevia.

A primeira revisão é a que mais poupa trabalho, e também a que as pessoas mais ignoram. Por isso, ela recebe a maior parte da atenção desta página.

## Leia nesta ordem

Uma mudança é uma pasta de arquivos Markdown simples em `openspec/changes/<name>/`. Leia os arquivos na ordem que permita parar o quanto antes se algo estiver errado:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

Você não precisa ler cada linha. Precisa responder a três perguntas, uma por arquivo.

## A proposta: este é o problema certo?

Abra `proposal.md` primeiro. Ele registra o “porquê” e o “o quê” — a intenção, o escopo e a abordagem em um ou dois parágrafos.

**O que é bom:** uma intenção clara, um escopo reconhecível e um motivo para fazer isso agora.

**Sinais de alerta:**

- Resolve um problema um pouco *diferente* daquele que você pediu.
- O escopo cresceu: você pediu uma opção de tema e a proposta também altera a autenticação “já que estamos mexendo nisso”.
- É vago. “Melhorar a página de configurações” não é um escopo; “adicionar uma opção de modo escuro que respeite a preferência do sistema operacional” é.

**A pergunta a responder:** *Isto corresponde ao que realmente pedi, e há algo sendo incluído sem eu perceber?* Se a resposta for não, pare — não continue lendo; corrija a proposta (consulte [Contestar é fácil](#contestar-é-fácil)).

## As especificações delta: “concluído” está definido corretamente?

Este é o centro da revisão. As especificações delta em `specs/` declaram o que será *verdadeiro* quando a mudança for entregue, por meio de requisitos e dos cenários que os comprovam:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**O que é um bom requisito:** uma declaração clara com `SHALL`/`MUST` que você poderia entregar a alguém para testar, e pelo menos um cenário cujo GIVEN/WHEN/THEN realmente exercite essa declaração.

**Sinais de alerta:**

- **Um requisito vago.** “O sistema SHALL ser rápido” não pode ser implementado nem testado. O que significa “rápido”?
- **Um requisito sem cenário** ou um cenário que não testa o requisito correspondente.
- **A descoberta mais valiosa: o que está faltando.** A IA registra fielmente o que você *disse*. Seu trabalho é notar o que *esqueceu* de dizer. Se o caso mais importante para você era a preferência do sistema operacional e nenhum cenário a menciona, a revisão já valeu a pena.

Leia as deltas perguntando: *eu ficaria satisfeito se o sistema fizesse exatamente isto — e nada além disto?* Ainda não há código envolvido, então alterar algo continua sendo simples.

## As tarefas: o plano de trabalho faz sentido?

Abra `tasks.md` por último. É a lista de verificação que a IA percorrerá durante a implementação.

**O que é bom:** etapas ordenadas, cada uma vinculada a um requisito, sem nada misterioso.

**Sinais de alerta:**

- Uma tarefa sem requisito correspondente (de onde ela veio?).
- Uma tarefa enorme, como “implementar o recurso”, que oculta todas as decisões importantes.
- Uma tarefa que altera algo fora do escopo que você acabou de aprovar.

Aqui, você não está estimando nem microgerenciando — está verificando se o plano corresponde aos requisitos que já aceitou.

## Contestar é fácil

Se alguma das três respostas estiver errada, diga isso. Não há fases nem nada bloqueado — corrija e continue. Há duas formas de fazer isso, como em [Editando uma mudança](/pt-BR/editing-changes/):

- **Edite o arquivo você mesmo.** É Markdown simples: altere a linha do escopo, refine um requisito ou exclua uma tarefa.
- **Diga à IA o que está errado** e deixe que ela revise: *“remova as mudanças de autenticação — estão fora do escopo”*, *“adicione um cenário para quando o usuário já tiver escolhido um tema”*, *“divida a tarefa 3 em esquema e interface”*.

Depois, releia a parte alterada. Continue revisando até que o plano seja algo que você assinaria. Esse processo de idas e vindas *é* o produto funcionando.

## Depois do código: verifique

Depois da implementação, `/opsx:verify` é sua segunda revisão. Ele relê os artefatos e o código e informa divergências em três dimensões:

| Dimensão | O que verifica |
|-----------|----------------|
| **Completude** | Todas as tarefas concluídas, todos os requisitos implementados, cenários cobertos |
| **Correção** | A implementação corresponde à intenção da especificação e trata os casos extremos |
| **Coerência** | As decisões de design realmente aparecem no código |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Ele sinaliza problemas como CRITICAL, WARNING ou SUGGESTION e **não** bloqueia o arquivamento — apenas revela as lacunas e deixa a decisão para você. Essa é a diferença entre “a IA escreveu código?” e “ela construiu o que combinamos?”.

`/opsx:verify` faz parte do perfil expandido. Se não estiver disponível, ative-o com `openspec config profile` (e depois execute `openspec update`) ou releia a mudança e as diferenças por conta própria.

## Ajuste o tamanho da revisão

Nem toda mudança precisa de uma revisão completa. Uma correção de erro de digitação em um arquivo merece uma olhada de vinte segundos. Uma mudança que afeta autenticação, pagamentos ou dados irrecuperáveis merece todas as verificações acima. O objetivo nunca foi criar burocracia: é dedicar atenção onde um erro custaria caro e fazer uma revisão rápida onde não custaria.

## Lista de verificação de dois minutos

- [ ] A intenção da proposta corresponde ao que pedi.
- [ ] Nada foi acrescentado ao escopo sem necessidade.
- [ ] Cada requisito é específico o bastante para ser testado.
- [ ] Cada requisito tem um cenário que realmente o exercita.
- [ ] O caso que mais me importa está coberto.
- [ ] As tarefas correspondem aos requisitos; nada é misterioso nem está fora do escopo.
- [ ] Eu ficaria confortável se a IA implementasse exatamente isto e nada além.

Se os sete itens forem aprovados, execute `/opsx:apply` com confiança. Se algum falhar, isso não é um retrocesso — significa que os dois minutos fizeram seu trabalho.

## Próximos passos

- [Escrevendo boas especificações](/pt-BR/writing-specs/) — o outro lado: como preparar requisitos e cenários que valem a pena aprovar.
- [Editando e iterando em uma mudança](/pt-BR/editing-changes/) — como alterar um plano depois de começar.
- [Fluxos de trabalho](/pt-BR/workflows/) — onde a revisão se encaixa no ciclo completo.
