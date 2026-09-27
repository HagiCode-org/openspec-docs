---
title: "Solução de problemas"
---

Soluções concretas para problemas concretos. Cada entrada descreve um sintoma, explica sua provável causa e apresenta uma correção. Se seu problema não estiver aqui, consulte as [Perguntas frequentes](/pt-BR/faq/) ou peça ajuda no [Discord](https://discord.gg/YctCnvvshC).

## Instalação e configuração

### `openspec: command not found`

A CLI não está instalada ou seu shell não consegue encontrá-la. Instale-a globalmente e confira:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Se a instalação ocorreu, mas o comando ainda não é encontrado, provavelmente o diretório global de binários do npm não está no `PATH`. Execute `npm prefix -g` para ver onde ficam os pacotes globais: no macOS e Linux, os binários ficam no subdiretório `bin/`; no Windows, ficam diretamente nesse diretório. Confira se o caminho está incluído no `PATH`. (`npm bin -g` foi removido no npm 9.)

Se você usou a [instalação assistida por IA](/pt-BR/installation/#instale-com-seu-assistente-de-ia), esta é a etapa esperada de transferência: o prompt pede ao assistente que mostre a alteração do `PATH`, em vez de editar os arquivos de inicialização do shell por conta própria.

### "Requires Node.js 20.19.0 or higher"

O OpenSpec requer Node 20.19.0 ou superior. Confira sua versão e atualize se necessário:

```bash
node --version
```

Se você usar bun para instalar o OpenSpec, lembre-se de que ele ainda é *executado* no Node; portanto, é necessário ter Node 20.19.0 ou superior disponível no `PATH`. Consulte [Instalação](/pt-BR/installation/).

### `openspec init` didn't configure my AI tool

O comando init pergunta quais ferramentas devem ser configuradas. Se você ignorou sua ferramenta ou quer adicionar outra, basta executá-lo novamente ou usar o modo não interativo:

```bash
openspec init --tools claude,cursor
```

A lista completa de IDs de ferramentas está em [Ferramentas compatíveis](/pt-BR/supported-tools/). Use `--tools all` para selecionar todas e `--tools none` para ignorar a configuração de ferramentas.

## Os comandos não aparecem

Se `/opsx:propose` (ou o comando equivalente da sua ferramenta) não aparecer ou não fizer nada, percorra esta lista, começando pelas verificações mais rápidas.

1. **Talvez você esteja no lugar errado.** Comandos de barra são digitados no chat do assistente de IA, não no terminal. Se você digitou `/opsx:propose` no shell, encontrou o problema. Consulte [Como os comandos funcionam](/pt-BR/how-commands-work/).

2. **Gere os arquivos novamente.** Na raiz do projeto:

   ```bash
   openspec update
   ```

   Isso regrava os arquivos de skills e comandos para todas as ferramentas configuradas.

   Os arquivos de instrução são gerados pela CLI *instalada*. Uma CLI desatualizada pode informar que tudo está atualizado sem gravar os fluxos de trabalho mais recentes. `openspec update` agora verifica isso e oferece uma atualização — aceite se a opção aparecer.

3. **Reinicie o assistente.** A maioria das ferramentas procura skills e comandos ao iniciar. Muitas vezes, basta abrir uma nova janela.

4. **Confirme que os arquivos existem.** No Claude Code, verifique se `.claude/skills/` contém pastas `openspec-*`. As outras ferramentas usam diretórios próprios, listados em [Ferramentas compatíveis](/pt-BR/supported-tools/).

5. **Confira se você inicializou este projeto.** As skills são gravadas por projeto. Se você clonou um repositório ou mudou de pasta, execute `openspec init` (ou `openspec update`) nele.

6. **Confirme se sua ferramenta aceita arquivos de comando.** Codex, CodeArts, ForgeCode, Hermes, Kimi Code, Mistral Vibe, Zed Agent e o destino compartilhado `.agents` não recebem arquivos `opsx-*` gerados; eles usam invocações baseadas em skills, então `/opsx` nunca será completado automaticamente. Digite `$openspec-propose` no Codex, `/skill:openspec-propose` no Kimi Code e `/openspec-propose` nas demais ferramentas. O destino compartilhado `.agents` é independente de fornecedor, então `/openspec-propose` é a forma comum, mas não garantida — se o assistente não responder, consulte a documentação da ferramenta para saber como invocar uma skill. O Amazon Q recebe arquivos de comando, mas os carrega na biblioteca de prompts, não no menu de barra — use `@opsx-propose`, não `/opsx`. O formato de cada ferramenta está listado em [Como invocar](/pt-BR/supported-tools/#como-invocar).

## Trabalhando com mudanças

### "Change not found"

O comando não conseguiu determinar a qual mudança você se referia. Especifique o nome ou confira quais mudanças existem:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Confira também se você está no diretório correto do projeto.

### "No artifacts ready"

Cada artefato já foi criado ou está bloqueado à espera de uma dependência. Veja o que está impedindo o avanço:

```bash
openspec status --change <name>
```

Depois, crie primeiro a dependência ausente. Lembre-se da ordem: a proposta habilita especificações e design; especificações e design juntos habilitam as tarefas.

### `openspec validate` reports warnings or errors

A validação verifica se as especificações e mudanças têm problemas estruturais. Leia a mensagem: ela indica o arquivo e o problema.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

Causas comuns incluem uma seção obrigatória ausente (por exemplo, uma especificação sem cenários) ou um cabeçalho delta malformado. Corrija o arquivo e execute novamente. A [referência da CLI](/pt-BR/cli/#openspec-validate) documenta o formato da saída.

Uma mensagem merece uma observação própria:

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

Um requisito `MODIFIED` substitui todo o bloco do requisito; por isso, deve incluir todos os cenários que permanecem após a mudança, não apenas os que você editou. Copie os cenários indicados de `openspec/specs/<capability-path>/spec.md` de volta para a delta, preservando todos os diretórios de domínio do caminho. Isso costuma acontecer em uma mudança antiga depois que outra pessoa adiciona um cenário ao mesmo requisito — o arquivamento recusará a mudança de qualquer forma, e agora a validação informa isso antes da implementação.

### The AI created incomplete or wrong artifacts

A IA não tinha contexto suficiente. Estas opções podem ajudar:

- Adicione contexto do projeto a `openspec/config.yaml` para incluir sua stack e convenções em cada solicitação. Consulte [Personalização](/pt-BR/customization/#configuração-do-projeto).
- Adicione `rules:` por artefato para fornecer orientações aplicáveis apenas, por exemplo, às especificações.
- Forneça uma descrição mais detalhada ao propor a mudança.
- Use `/opsx:continue`, do conjunto expandido, para criar e revisar um artefato por vez, em vez de deixar `/opsx:ff` criar tudo de uma vez.

### Archive won't finish, or warns about incomplete tasks

O arquivamento não *bloqueia* a operação quando há tarefas incompletas, mas exibe um aviso, pois arquivar normalmente significa que o trabalho terminou. Se as tarefas restantes forem intencionais (você está registrando uma mudança parcial), prossiga. Caso contrário, conclua-as primeiro. O arquivamento também oferece sincronizar suas especificações delta às principais, caso ainda não tenha feito isso; aceite, a menos que haja um motivo para não aceitar.

### "User force closed the prompt with 0 null"

`openspec archive` foi executado em um ambiente incapaz de responder a uma pergunta — por exemplo, por um agente de IA usando uma ferramenta, em um job de CI ou em um shell com stdin fechado. O arquivamento solicita até três confirmações, e uma confirmação impossível de responder costumava falhar com essa mensagem bruta.

Passe `--yes` para responder a todas de antemão:

```bash
openspec archive <change-name> --yes
```

Mantenha as opções que já estava usando — `--skip-specs` e `--no-validate` alteram o comportamento do arquivamento, então repetir o comando apenas com `--yes` não é equivalente. As versões atuais indicam a opção e exibem uma linha `Fix:` que você pode copiar. Se pretendia escolher em uma lista, informe explicitamente o nome da mudança: o seletor também precisa de uma resposta.

Se, em vez disso, você redirecionou a saída do arquivamento para um arquivo ou a capturou com uma ferramenta e *passou* uma resposta por pipe (`printf 'y\n' | openspec archive …`), versões antigas gravavam códigos de escape do terminal nessa captura ao exibir o prompt — em alguns ambientes, isso podia aumentar muito o arquivo. As versões atuais leem os prompts de confirmação como texto simples sempre que stdout não é um terminal; além disso, `openspec archive` sem argumentos (que normalmente abriria um seletor interativo de mudanças) pede o nome da mudança antecipadamente em vez de renderizar um menu na captura. De qualquer forma, execuções com saída redirecionada ou por agentes permanecem limpas; passar `--yes` (junto com o nome da mudança) ignora todos os prompts.

## Configuração

### My `config.yaml` isn't being applied

Três causas comuns:

1. **Nome de arquivo incorreto.** Deve ser `openspec/config.yaml`, não `.yml`.
2. **YAML inválido.** Verifique-o com qualquer validador YAML; a CLI também informa erros de sintaxe com o número da linha.
3. **Você esperava precisar reiniciar.** Não é necessário. Alterações na configuração têm efeito imediato.

### "Unknown artifact ID in rules: X"

A chave em `rules:` não corresponde a nenhum artefato do esquema. No esquema padrão `spec-driven`, os IDs válidos são `proposal`, `specs`, `design` e `tasks`. Para ver os IDs de qualquer esquema:

```bash
openspec schemas --json
```

### "Context too large"

O campo `context:` tem um limite de 50 KB porque seu conteúdo é incluído em cada solicitação. Resuma-o ou inclua links para documentos longos em vez de colá-los. Um contexto conciso também produz resultados melhores e mais rápidos.

### "Schema not found"

O esquema indicado não existe. Liste os esquemas disponíveis e confira a grafia:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

See [Customization](/pt-BR/customization/#schemas-personalizados).

## Migração do fluxo legado

### "Legacy files detected in non-interactive mode"

Você está em uma CI ou shell não interativo. O OpenSpec encontrou arquivos antigos para limpar, mas não pode pedir confirmação. Aprove a operação automaticamente:

```bash
openspec init --force
```

No Codex, o OpenSpec pode detectar arquivos antigos de prompt gerenciados em `$CODEX_HOME/prompts` ou `~/.codex/prompts`. A limpeza se limita aos nomes de arquivo de prompt legado do Codex permitidos pelo OpenSpec, e o `openspec init` não interativo remove apenas os arquivos que têm uma skill substituta `.agents/skills/openspec-*`. O `openspec update` não interativo não altera nenhum arquivo legado, a menos que você passe `--force`.

### Commands didn't appear after migrating

Reinicie o IDE. As skills são detectadas na inicialização. Se ainda não aparecerem, execute `openspec update` e confira os locais de arquivos em [Ferramentas compatíveis](/pt-BR/supported-tools/).

### My old `project.md` wasn't migrated

Isso é intencional. O OpenSpec nunca exclui `project.md` automaticamente porque o arquivo pode conter contexto escrito por você. Mova o conteúdo útil para a seção `context:` de `config.yaml` e depois exclua o arquivo manualmente. O [Guia de migração](/pt-BR/migration-guide/#migrar-projectmd-para-configyaml) explica o processo, incluindo um prompt que você pode fornecer à IA para resumir o conteúdo.

## Ainda precisa de ajuda?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **No terminal:** `openspec feedback "o que deu errado"` abre uma issue para você.

Ao relatar um problema, inclua a versão do OpenSpec (`openspec --version`), a versão do Node (`node --version`), a ferramenta de IA usada e o comando e a saída exatos. Isso torna a assistência muito mais rápida.
