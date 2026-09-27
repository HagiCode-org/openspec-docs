---
title: "Escrevendo boas especificações"
---

Raramente se começa uma especificação do zero. Você descreve uma mudança em linguagem simples, `/opsx:propose` prepara os requisitos e cenários, e então você os aprimora. Esta página trata dessa última parte: o que significa “bom” e como orientar a IA para chegar lá.

Esta página complementa [Revisando uma mudança](/pt-BR/reviewing-changes/): revisar é identificar os pontos fracos de um rascunho; escrever é saber do que é feita uma boa especificação.

## Uma especificação descreve comportamento, não código

Uma especificação diz o que seu sistema *faz*, em termos que qualquer pessoa possa verificar — não como ele foi construído. Ela é composta por **requisitos** (declarações de comportamento) e **cenários** (exemplos concretos que os comprovam).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Mantenha o *como* — a fila, a biblioteca, o esquema da tabela — em `design.md` ou no código. Quando comportamento e implementação são misturados em um único requisito, ele deixa de ser testável e começa a ficar desatualizado assim que o código muda.

## O que torna um requisito bom

Um bom requisito descreve um comportamento de forma tão clara que você poderia pedir a outra pessoa para testá-lo.

- **Uma declaração, um `SHALL`/`MUST`.** Se um requisito contém três cláusulas do tipo “e também”, na verdade são três requisitos. Separe-os.
- **Observável.** Alguém que não conhece o código deve conseguir verificar se o requisito foi atendido. “O sistema SHALL exibir um aviso de erro quando o envio ultrapassar 10 MB” é observável. “O sistema SHALL lidar bem com envios grandes” não é.
- **Nível de obrigatoriedade adequado.** O OpenSpec usa palavras-chave da RFC 2119, que têm significados diferentes:

  | Palavra-chave | Significado |
  |---------|---------|
  | `MUST` / `SHALL` | Requisito obrigatório, sem negociação. |
  | `SHOULD` | Recomendação forte, com possibilidade de exceção justificada. |
  | `MAY` | Realmente opcional. |

  Use `MUST`/`SHALL` por padrão. Use `SHOULD` apenas quando realmente quiser dizer “a menos que haja um bom motivo para não fazer isso”.

Teste o requisito com esta pergunta: *uma pessoa que nunca viu o código conseguiria dizer se ele foi atendido?* Se não, é preciso refiná-lo.

## O que torna um cenário bom

É nos cenários que um requisito mostra seu valor. Cada um é um exemplo concreto no formato GIVEN / WHEN / THEN que pode se tornar um teste automatizado.

- **Exercita o requisito.** Um cenário que apenas repete o requisito com outras palavras não testa nada. Descreva uma situação específica e um resultado específico.
- **Cubra os casos importantes, não apenas o caminho feliz.** O login válido é fácil. Entrada vazia, token expirado, segundo clique, algo que dá errado — é aí que surgem bugs e que um cenário tem mais valor.
- **Identifique o caso no título.** “Scenario: rejeita um token expirado” mostra rapidamente ao revisor o que está coberto; “Scenario: teste 2” não.

Um hábito útil: antes de aprovar, pergunte-se *qual é o caso cuja falha mais me incomodaria?* — e garanta que um cenário o descreva.

## Escolha o tipo correto de delta

Uma mudança descreve as edições nas especificações usando três tipos de seção. Usar o tipo correto mantém as especificações arquivadas fiéis à realidade:

- **`## ADDED Requirements`** — comportamento novo, que não existia antes.
- **`## MODIFIED Requirements`** — comportamento existente que será alterado. Inclua a versão nova completa; uma breve explicação da alteração ajuda quem revisa.
- **`## REMOVED Requirements`** — comportamento que será removido, com uma breve justificativa.

Ao arquivar, requisitos ADDED são acrescentados à especificação principal, MODIFIED substitui a versão anterior e REMOVED é excluído. Ao remover o último requisito de uma capacidade, você a aposenta: em vez de deixar uma especificação vazia, o arquivamento exclui `openspec/specs/<capability>/spec.md`. Como essa é a única etapa de arquivamento que remove um arquivo, ela precisa ser solicitada explicitamente — adicione `retire_capabilities: true` ao `.openspec.yaml` da mudança, junto com o `schema:` já necessário. Sem isso, o arquivamento é interrompido e informa o motivo. Como a aposentadoria exclui o arquivo inteiro, ela também é recusada se a especificação contiver algo além do título, de `## Purpose` e dos blocos de requisitos — por exemplo, uma seção `## Notes` ou um comentário sob um requisito. A mensagem de interrupção identifica essas linhas; mova-as para `## Purpose` ou para um requisito, ou exclua a especificação manualmente. Para especificações no checkout de quem executou o comando, a saída do arquivamento também indica o `git checkout` que restaura um arquivo versionado; para Stores selecionadas, as instruções de recuperação se referem ao checkout correspondente. Se você marcar uma mudança real como ADDED, terá dois requisitos concorrentes; se descrever um comportamento novo como MODIFIED, não haverá nada para substituir. Em caso de dúvida, abra a especificação atual e veja se o requisito já existe.

Há mais uma seção importante. Quando sua delta cria uma capacidade que ainda não existe, inclua `## Purpose` — uma ou duas frases sobre a finalidade dessa capacidade. O arquivamento usa esse conteúdo na seção Purpose da especificação principal criada; se você omiti-lo, será inserido o marcador `TBD`, que deverá ser preenchido manualmente. Uma especificação existente já tem uma seção Purpose, então a seção da delta é ignorada nesse caso — edite diretamente `openspec/specs/<capability-path>/spec.md` para alterá-la. `<capability-path>` é o diretório relativo a `specs/`, como `user-auth` em um projeto sem agrupamento por domínio ou `identity/user-auth` em um projeto organizado por domínios.

## Dimensione corretamente a mudança

O erro de autoria mais comum não é um requisito mal redigido: é tentar fazer três mudanças em uma só.

**Uma boa mudança tem uma intenção que cabe em uma frase.** “Adicionar uma opção de modo escuro.” “Limitar a taxa de solicitações no endpoint de login.” “Migrar as sessões para deixar de usar cookies.” Se você precisa dizer muitos “e também” para descrever a mudança, é sinal de que deve dividi-la.

Sinais de que uma mudança é grande demais:

- O escopo da proposta parece uma lista de recursos sem relação entre si.
- Revisá-la levaria uma tarde inteira, então ninguém fará isso.
- Duas pessoas não conseguiriam trabalhar nela sem entrar em conflito.
- Metade das tarefas poderia ser entregue de forma independente.

Mudanças menores são mais fáceis de revisar, de implementar em uma sessão focada e de entender seis meses depois, quando só restar o arquivo. Você sempre pode executar várias mudanças em paralelo — consulte [Editando e iterando](/pt-BR/editing-changes/) e [Fluxos de trabalho](/pt-BR/workflows/).

O contrário também é verdade: a correção de um erro de digitação em uma linha não precisa de três requisitos e um documento de design. Ajuste o nível de formalidade ao risco.

## Como orientar a IA para obter um bom rascunho

Como `/opsx:propose` prepara o primeiro rascunho, a qualidade do resultado depende da qualidade das informações que você fornece. Você não precisa escrever os requisitos manualmente — precisa orientar bem a IA:

- **Declare a intenção e os limites.** *“Adicione uma opção de modo escuro que siga a configuração do sistema no primeiro carregamento — não altere a API de temas existente.”* O que está fora do escopo importa tanto quanto o que está dentro dele.
- **Indique os casos importantes.** *“Inclua um cenário para quem já escolheu um tema manualmente.”* A IA cobre o que você apontar.
- **Depois, edite.** É Markdown simples. Especifique melhor um `SHALL` vago, remova um cenário que não testa nada, acrescente o caso que faltou — ou peça à IA: *“o requisito do tempo limite está vago; defina-o como 30 minutos.”*

Prepare um rascunho, refine-o e repita. Algumas rodadas produzem uma especificação em que você pode confiar — esse é o objetivo.

## Lista de verificação rápida

- [ ] Cada requisito descreve um comportamento observável com `SHALL`/`MUST`.
- [ ] Os requisitos não incluem detalhes de implementação.
- [ ] Cada requisito tem pelo menos um cenário que realmente o exercita.
- [ ] Os casos extremos e de erro importantes têm cenários, não apenas o caminho feliz.
- [ ] As deltas usam ADDED / MODIFIED / REMOVED corretamente em relação à especificação atual.
- [ ] A mudança inteira tem uma intenção que pode ser expressa em uma frase.

## Próximos passos

- [Revisando uma mudança](/pt-BR/reviewing-changes/) — a análise de dois minutos que identifica o que passou despercebido.
- [Conceitos](/pt-BR/concepts/) — o modelo aprofundado de especificações, mudanças e deltas.
- [Exemplos e receitas](/pt-BR/examples/) — mudanças reais do início ao fim.
