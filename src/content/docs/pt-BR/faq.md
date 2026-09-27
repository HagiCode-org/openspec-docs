---
title: "Perguntas frequentes"
---

Respostas rápidas às dúvidas mais comuns. Se sua pergunta é sobre algo que não está funcionando, consulte [Solução de problemas](/pt-BR/troubleshooting/). Para encontrar a definição de um termo, veja o [Glossário](/pt-BR/glossary/).

## Noções básicas

### O que é o OpenSpec, em uma frase?

Uma camada leve que ajuda você e seu assistente de programação com IA a combinar por escrito o que será construído, antes que qualquer código seja escrito.

### Por que eu iria querer isso?

Porque assistentes de IA são confiantes até quando estão errados. Quando os requisitos existem apenas em uma conversa, a IA preenche as lacunas com suposições, e você só descobre isso depois que o código está pronto. O OpenSpec antecipa o alinhamento, quando os erros são baratos de corrigir. Para entender melhor, consulte [Conceitos essenciais em resumo](/pt-BR/overview/).

### Preciso usá-lo para tudo?

Não. Use-o quando o alinhamento for importante, o que se aplica à maioria dos trabalhos não triviais. Para corrigir um erro de digitação de um caractere, o processo provavelmente não compensa — e tudo bem.

### Posso usá-lo em uma base de código grande e existente ou apenas em projetos novos?

Bases de código existentes são o caso de uso principal. O OpenSpec prioriza projetos já estabelecidos: você não precisa documentar o aplicativo inteiro logo de início. Escreva especificações apenas para o que cada mudança afeta; com o tempo, elas vão sendo preenchidas de acordo com o trabalho que você realmente faz. Há um guia dedicado: [Usando o OpenSpec em um projeto existente](/pt-BR/existing-projects/).

### Ele está vinculado a uma única ferramenta de IA?

Não. O OpenSpec funciona com mais de 30 assistentes, incluindo Claude Code, Cursor, Devin Desktop, GitHub Copilot, Gemini CLI, Codex e outros. A lista completa e os detalhes por ferramenta estão em [Ferramentas compatíveis](/pt-BR/supported-tools/).

## Executando comandos

### Onde digito `/opsx:propose`?

No chat do seu assistente de IA, não no terminal. Essa é a dúvida mais comum e, por isso, tem uma página própria: [Como os comandos funcionam](/pt-BR/how-commands-work/). Resumindo: `openspec ...` é executado no terminal; `/opsx:...`, no chat.

### Como “inicio o modo interativo”?

Não existe um modo separado para iniciar. Abra seu assistente de IA normalmente e digite um comando de barra no chat. É assim que você “entra” no OpenSpec. (O recurso realmente interativo no terminal é `openspec view`, um painel para navegar pelas especificações e mudanças.) A explicação completa está em [Como os comandos funcionam](/pt-BR/how-commands-work/).

### Digitei um comando de barra e nada aconteceu. Por quê?

Provavelmente você digitou no terminal em vez do chat da IA, usou uma grafia que sua ferramenta não reconhece ou ainda não instalou os comandos. Se os arquivos não existirem — ou se você nunca configurou a ferramenta — execute `openspec init`; `openspec update` apenas atualiza arquivos já existentes. Depois, reinicie o assistente e use o formato indicado em “Primeiros passos”; consulte [Como invocar](/pt-BR/supported-tools/#como-invocar). A página de [Solução de problemas](/pt-BR/troubleshooting/#os-comandos-não-aparecem) traz a lista completa de verificações.

### Por que a sintaxe é `/opsx:propose` em uma ferramenta e `/opsx-propose` em outra?

Cada ferramenta de IA apresenta comandos personalizados de uma maneira diferente, e o OpenSpec usa a forma como sua ferramenta carrega o arquivo gerado. Um arquivo de comando chamado `opsx-propose.md` é invocado como `/opsx-propose`; um arquivo em `commands/opsx/` é invocado como `/opsx:propose`. Ferramentas que usam skills em vez de comandos usam o nome da skill — no Codex, `$openspec-propose`; no Kimi Code, `/skill:openspec-propose`. A linha “Primeiros passos” de `openspec init` já mostra o formato adequado às ferramentas escolhidas. A tabela completa está em [Como invocar](/pt-BR/supported-tools/#como-invocar).

### Qual é a diferença entre uma skill e um comando?

Ambos são arquivos que o OpenSpec grava para que seu assistente execute o fluxo de trabalho. Skills (`.../skills/openspec-*/SKILL.md`) são o padrão mais recente e multiplataforma; comandos (`.../commands/opsx-*`) são os antigos arquivos de barra específicos de cada ferramenta. Você não precisa escolher: basta digitar o comando de barra, e o OpenSpec instala o formato usado pela sua ferramenta.

## O fluxo de trabalho

### Por onde começo se não tenho certeza do que construir?

Com `/opsx:explore`. É um parceiro de reflexão sem compromisso que lê sua base de código, apresenta opções e transforma um problema vago em um plano concreto antes que qualquer código seja escrito. Faz parte do perfil padrão e está sempre disponível. Quando o plano estiver claro, ele passa o trabalho para `/opsx:propose`. Esse é o melhor hábito a desenvolver, pois impede uma IA entusiasmada de construir com confiança a coisa errada. Consulte [Comece explorando](/pt-BR/explore/).

### Qual é o fluxo mais simples possível?

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

Use explore para refletir, propose para preparar o plano, apply para implementá-lo e archive para guardá-lo. Pule explore se você já sabe exatamente o que quer.

### Qual é a diferença entre `/opsx:propose` e `/opsx:new`?

`/opsx:propose` é o comando padrão de uma etapa: cria a mudança e prepara todos os artefatos de planejamento de uma vez. `/opsx:new` faz parte do conjunto expandido e apenas cria a estrutura vazia da mudança; depois, você cria os artefatos um a um com `/opsx:continue` (ou todos de uma vez com `/opsx:ff`). Use propose, a menos que queira controlar cada etapa. Consulte [Comandos](/pt-BR/commands/).

### O que são os perfis `core` e expandido?

Um perfil determina quais comandos de barra serão instalados. O perfil **core** (padrão) inclui `propose`, `explore`, `apply`, `update`, `sync` e `archive`. O conjunto **expanded** adiciona `new`, `continue`, `ff`, `verify`, `bulk-archive` e `onboard` para oferecer controle mais detalhado. Troque o perfil com `openspec config profile` e aplique a mudança com `openspec update`.

### Preciso executar `/opsx:sync`?

Normalmente, não. Sync mescla as especificações delta de uma mudança às especificações principais, e `/opsx:archive` oferecerá fazer isso por você. Execute sync manualmente apenas se quiser mesclar as especificações antes de arquivar, por exemplo, em uma mudança de longa duração. Consulte [Comandos](/pt-BR/commands/#opsxsync).

### Como edito uma proposta, especificação ou tarefa depois de começar?

Basta editar o arquivo. Cada artefato é um arquivo Markdown simples em `openspec/changes/<name>/`; não há etapas bloqueadas nem modo especial de edição. Altere-o manualmente ou peça à IA para revisá-lo (“atualize o design para usar uma fila”) e continue. A IA sempre trabalha com o conteúdo atual do arquivo. Guia completo: [Editando e iterando em uma mudança](/pt-BR/editing-changes/).

### Posso voltar e alterar o plano depois de implementar parte dele?

Sim, a qualquer momento. O fluxo é flexível, então revisão e edição não são etapas das quais você fica excluído. Edite o artefato e continue. Se quiser uma verificação estruturada de que o código ainda corresponde ao plano, execute `/opsx:verify`. Consulte [Editando e iterando em uma mudança](/pt-BR/editing-changes/#como-volto-à-revisão-depois-de-implementar).

### Editei o código manualmente. Como faço para conciliá-lo com a especificação?

Sincronize os dois antes de arquivar, pois o arquivamento transforma suas especificações no registro oficial. Se o código estiver correto, atualize a especificação delta para corresponder ao que você entregou; se a especificação estiver correta, continue implementando até que o código corresponda a ela. `/opsx:verify` identifica as divergências. Consulte [Editando e iterando em uma mudança](/pt-BR/editing-changes/#editei-o-código-manualmente-como-faço-para-conciliá-lo-com-o-openspec).

### Quando devo atualizar uma mudança existente ou iniciar uma nova?

Atualize quando for o mesmo trabalho, apenas refinado. Comece do zero quando a intenção mudar fundamentalmente ou o escopo se expandir para um trabalho diferente. Há um fluxograma de decisão e exemplos em [Fluxos de trabalho](/pt-BR/workflows/#quando-atualizar-ou-começar-do-zero).

### E se minha sessão ficar sem contexto ou os requisitos mudarem no meio da implementação?

É aí que as especificações mostram seu valor. Como o plano fica em arquivos (e não apenas no histórico do chat), você pode limpar o contexto, iniciar uma nova sessão de IA e retomar com `/opsx:apply`; o comando lê os artefatos e continua na primeira tarefa não marcada. Se os requisitos mudarem, edite os artefatos para refletir a nova realidade e continue. Manter a janela de contexto limpa também melhora os resultados; limpe-a antes da implementação.

### Devo incluir a pasta `openspec/` no Git?

Sim. Suas especificações, mudanças ativas e arquivos arquivados fazem parte do histórico do projeto. Versione-os como qualquer outro código-fonte. Em particular, o arquivo de mudanças arquivadas se torna um registro duradouro dos motivos pelos quais seu sistema funciona como funciona.

## Especificações e mudanças

### O que deve entrar em uma especificação e o que deve entrar no design?

Uma especificação descreve o comportamento observável: o que o sistema faz, suas entradas, saídas e condições de erro. Um design descreve como você o construirá: a abordagem técnica, as decisões de arquitetura e as alterações nos arquivos. Se a implementação puder mudar sem alterar o comportamento visível externamente, o conteúdo pertence ao design, não à especificação. [Conceitos](/pt-BR/concepts/#o-que-uma-especificação-é-e-o-que-não-é) explica isso em mais detalhes.

### O que é uma especificação delta?

Uma especificação que descreve apenas o que está mudando, usando as seções `ADDED`, `MODIFIED` e `REMOVED`, em vez de repetir a especificação inteira. É assim que o OpenSpec lida de forma organizada com alterações em sistemas existentes. Consulte [Conceitos](/pt-BR/concepts/#especificações-delta).

### Para onde vão as mudanças arquivadas?

Para `openspec/changes/archive/YYYY-MM-DD-<name>/`, com todos os artefatos da mudança preservados. A mudança deixa de aparecer na lista de itens ativos. Uma mudança que declare explicitamente `retire_capabilities: true` também pode excluir uma especificação de capacidade principal quando remove seu último requisito.

## Configuração e personalização

### Como informo à IA qual é minha stack tecnológica?

Inclua essas informações em `openspec/config.yaml`, na seção `context:`. Esse texto é inserido em cada solicitação de planejamento, para que a IA conheça sempre sua stack e suas convenções. Consulte [Personalização](/pt-BR/customization/#configuração-do-projeto).

### Posso gerar especificações em outro idioma que não seja inglês?

Sim. Adicione uma instrução de idioma à seção `context:` da configuração. [Vários idiomas](/pt-BR/multi-language/) contém trechos prontos para copiar em vários idiomas.

### Posso alterar o próprio fluxo de trabalho?

Sim, usando esquemas personalizados. Um esquema define quais artefatos existem e como eles dependem uns dos outros. Crie uma cópia do padrão com `openspec schema fork spec-driven my-workflow` e depois edite-a. Consulte [Personalização](/pt-BR/customization/#schemas-personalizados).

## Modelos, privacidade e atualizações

### Qual modelo de IA devo usar?

O OpenSpec funciona melhor com modelos de alto poder de raciocínio. O README recomenda modelos como Codex 5.5 e Opus 4.7 tanto para planejamento quanto para implementação. Mantenha também a janela de contexto limpa: para obter melhores resultados, limpe-a antes da implementação.

### O OpenSpec coleta dados?

Ele coleta estatísticas anônimas de uso: apenas nomes de comandos e versões. Não coleta argumentos, caminhos, conteúdo ou dados pessoais, e a coleta é desativada automaticamente na CI. Para desativá-la, use `export OPENSPEC_TELEMETRY=0` ou `export DO_NOT_TRACK=1`.

### Como faço uma atualização?

São duas etapas. Atualize o pacote (`npm install -g @fission-ai/openspec@latest`) e depois execute `openspec update` em cada projeto para atualizar as skills e os comandos gerados.

### Como desinstalo o OpenSpec?

Não existe um comando de desinstalação, porque o OpenSpec consiste em um pacote global e arquivos no seu projeto. Remova o pacote (`npm uninstall -g @fission-ai/openspec`) e, se quiser, exclua o diretório `openspec/` e os arquivos gerados para as ferramentas. As instruções passo a passo, inclusive o que é seguro manter, estão em [Instalação: desinstalação](/pt-BR/installation/#desinstalação).

## Como obter ajuda

### Onde faço perguntas ou relato bugs?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **No terminal:** `openspec feedback "sua mensagem"` abre uma issue no GitHub para você.

### Esta documentação está errada ou confusa. O que faço?

Avise-nos ou corrija o problema. Contribuições para a documentação são bem-vindas e valorizadas. Abra uma issue ou envie um pull request.
