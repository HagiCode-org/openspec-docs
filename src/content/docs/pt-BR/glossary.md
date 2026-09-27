---
title: "Glossário"
---

Todos os termos do OpenSpec em um só lugar, definidos em linguagem simples. Leia esta página uma vez e o restante da documentação ficará mais fácil de acompanhar.

Os termos são agrupados por assunto e ordenados alfabeticamente dentro de cada grupo.

## Os conceitos essenciais

**Especificação.** Documento que descreve como uma parte do sistema se comporta. As especificações ficam em `openspec/specs/`, são organizadas por domínio e compostas por requisitos e cenários. A especificação é a resposta acordada à pergunta “o que este software faz?”. Consulte [Conceitos](/pt-BR/concepts/#especificações).

**Fonte de verdade.** O diretório `openspec/specs/` como um todo. Ele contém o comportamento atual e acordado do sistema. As mudanças propõem edições; o arquivamento as aplica.

**Mudança.** Uma unidade de trabalho, organizada como uma pasta em `openspec/changes/<name>/`. Ela contém tudo sobre o trabalho: a proposta, o design, as tarefas e as edições nas especificações. Uma mudança, um recurso ou uma correção.

**Artefato.** Um documento dentro de uma mudança. Os artefatos padrão são a proposta, as especificações delta, o design e as tarefas. Eles são criados na ordem das dependências e servem de base uns para os outros.

**Especificação delta.** Especificação dentro de uma mudança que descreve apenas o que está mudando, usando seções `ADDED`, `MODIFIED` e `REMOVED`, sem repetir a especificação inteira. É isso que permite ao OpenSpec modificar sistemas existentes de forma organizada. Consulte [Conceitos](/pt-BR/concepts/#especificações-delta).

**Domínio.** Agrupamento lógico de especificações, como `auth/`, `payments/` ou `ui/`. Você escolhe domínios que correspondam à forma como entende o sistema.

## Dentro de uma especificação

**Requisito.** Um comportamento que o sistema deve ter, normalmente expresso com uma palavra-chave da RFC 2119: “O sistema SHALL expirar as sessões após 30 minutos”. Os requisitos definem *o que* deve acontecer, não *como*.

**Cenário.** Exemplo concreto e testável de um requisito em ação, geralmente no formato Dado/Quando/Então. Os cenários tornam um requisito verificável: você pode criar um teste automatizado a partir deles.

**Palavras-chave da RFC 2119.** As palavras MUST, SHALL, SHOULD e MAY, que têm significados padronizados para indicar o nível de obrigatoriedade de um requisito. MUST e SHALL são absolutos. SHOULD é recomendado, mas admite exceções. MAY indica algo opcional. O nome vem do documento de padrões da internet que as definiu.

## Os artefatos

**Proposta (`proposal.md`).** O *porquê* e o *quê* de uma mudança: sua intenção, escopo e abordagem geral. É o primeiro artefato criado.

**Design (`design.md`).** O *como*: abordagem técnica, decisões de arquitetura e arquivos que você espera alterar. É opcional para mudanças simples.

**Tarefas (`tasks.md`).** Lista de verificação da implementação, com caixas de seleção. A IA percorre a lista durante `/opsx:apply` e marca os itens à medida que os conclui.

## O ciclo de vida

**Arquivamento.** A finalização de uma mudança. Suas especificações delta são mescladas às especificações principais, e a pasta da mudança é movida para `openspec/changes/archive/YYYY-MM-DD-<name>/`. Depois do arquivamento, as especificações descrevem a nova realidade. Consulte [Conceitos](/pt-BR/concepts/#arquivamento).

**Sincronização.** Mesclagem das especificações delta de uma mudança às especificações principais *sem* arquivar a mudança. Geralmente é automática (o arquivamento oferece essa opção), mas também está disponível como `/opsx:sync` para mudanças longas. Consulte [Comandos](/pt-BR/commands/#opsxsync).

## Fluxo de trabalho e comandos

**OPSX.** O fluxo de trabalho padrão atual do OpenSpec, baseado em ações flexíveis em vez de fases rígidas. Todos os seus comandos de barra começam com `/opsx:`. Consulte [Fluxo de trabalho OPSX](/pt-BR/opsx/).

**Comando de barra.** Um comando que você digita no chat do assistente de IA, como `/opsx:propose`. Os comandos de barra conduzem o fluxo de trabalho; não são comandos de terminal. Consulte [Como os comandos funcionam](/pt-BR/how-commands-work/).

**Explorar (`/opsx:explore`).** O comando que atua como parceiro de reflexão. Ele lê sua base de código, compara opções e transforma uma ideia vaga em um plano concreto. Nunca escreve código nem cria outros arquivos, a menos que você peça para registrar a exploração como uma mudança ou aceite quando ele oferecer essa opção. É o ponto de partida recomendado quando você tem um problema, mas ainda não tem um plano. Consulte [Comece explorando](/pt-BR/explore/).

**CLI.** O programa `openspec` que você executa no terminal. Ele configura projetos, lista e valida mudanças, abre o painel e arquiva. É a metade do terminal do OpenSpec. Consulte [CLI](/pt-BR/cli/).

**Skill.** Uma pasta de instruções (`.../skills/openspec-*/SKILL.md`) que seu assistente de IA detecta e segue automaticamente. Skills são o padrão multiplataforma emergente para disponibilizar o fluxo de trabalho do OpenSpec ao assistente.

**Arquivo de comando.** Arquivo de comando de barra específico de uma ferramenta (`.../commands/opsx-*`). É o mecanismo de distribuição mais antigo, ainda compatível com as skills. Raramente é necessário editá-lo diretamente.

**Perfil.** O conjunto de comandos de barra instalado no projeto. O perfil **core** (padrão) contém `propose`, `explore`, `apply`, `update`, `sync` e `archive`. O conjunto **expanded** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive` e `onboard`. Altere-o com `openspec config profile`.

**Distribuição.** Define se o OpenSpec instala skills, arquivos de comando ou ambos para suas ferramentas. É configurada globalmente e aplicada com `openspec update`.

## Personalização

**Esquema.** Define quais artefatos compõem um fluxo de trabalho e como dependem uns dos outros. O padrão integrado é `spec-driven` (proposal → specs → design → tasks). Você pode criar uma cópia dele ou escrever seu próprio esquema. Consulte [Personalização](/pt-BR/customization/#schemas-personalizados).

**Modelo.** Arquivo Markdown dentro de um esquema que determina o que a IA gera para um artefato. Editar um modelo altera imediatamente o resultado da IA, sem precisar recompilar.

**Configuração do projeto (`openspec/config.yaml`).** Configurações específicas do projeto: o esquema padrão, o `context:` incluído em cada solicitação de planejamento e as `rules:` de cada artefato. É a forma mais simples de informar ao OpenSpec qual é sua stack e quais convenções seguir. Consulte [Personalização](/pt-BR/customization/#configuração-do-projeto).

**Injeção de contexto.** Inclusão das informações do projeto no campo `context:` de `config.yaml`, para que sejam adicionadas automaticamente a cada artefato gerado pela IA. É mais confiável do que esperar que a IA leia um arquivo separado.

**Grafo de dependências.** Grafo direcionado formado pelas relações `requires:` entre artefatos. É um DAG (grafo acíclico direcionado: as setas seguem apenas para a frente, sem formar ciclos) que o OpenSpec usa para determinar o que você pode criar em seguida.

**Facilitadores, não barreiras.** Princípio segundo o qual as dependências entre artefatos indicam o que se torna *possível* em seguida, não o que é *obrigatório* fazer. Você pode revisitar e editar qualquer artefato a qualquer momento. Consulte [Conceitos essenciais em resumo](/pt-BR/overview/#facilitadores-não-barreiras).

## Coordenação entre repositórios (beta)

Estes termos se aplicam apenas quando o planejamento abrange mais de um repositório. O recurso está em beta; a maioria dos usuários pode ignorá-lo. Consulte o [Guia do usuário de Stores](/pt-BR/stores-beta/user-guide/).

**Store.** Repositório independente dedicado ao planejamento. Ele tem a mesma estrutura `openspec/` que você já conhece (especificações e mudanças), além de um pequeno arquivo de identidade. Você o registra uma vez na máquina, usando um nome, e depois qualquer comando do OpenSpec pode trabalhar nele a partir de qualquer local.

**Referência.** Declaração em `openspec/config.yaml` de um repositório de código que indica uma Store usada por ele. As referências são somente leitura: o repositório mantém sua própria raiz, e `openspec instructions` passa a incluir um índice das especificações da Store referenciada, cada uma com o comando exato para buscá-la.

**Contexto de trabalho.** O que `openspec context` reúne para o repositório atual: sua raiz do OpenSpec e cada Store referenciada, com instruções para buscar cada uma. É a resposta à pergunta “com o que estou trabalhando?”.

**Conjunto de trabalho.** Conjunto pessoal de pastas, local à máquina, que você abre em conjunto (uma Store e os repositórios de código em que trabalha). Criado explicitamente com `openspec workset create`; nenhum desses caminhos locais é enviado ao repositório de planejamento compartilhado.

## Veja também

- [Conceitos essenciais em resumo](/pt-BR/overview/): as cinco ideias em uma página
- [Conceitos](/pt-BR/concepts/): a explicação completa
- [Como os comandos funcionam](/pt-BR/how-commands-work/): comandos de barra e CLI
