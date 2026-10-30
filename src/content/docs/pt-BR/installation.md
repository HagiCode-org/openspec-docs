---
title: "Instalação"
---

## Instalar

O OpenSpec é um único arquivo. Ele não precisa de Node.js nem de nada mais (no Alpine Linux, primeiro execute `apk add libstdc++ libgcc`).

macOS e Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
```

O instalador escolhe a versão mais recente cujos arquivos estão todos disponíveis e o arquivo correto para a sua máquina, verifica-o contra o `SHA256SUMS` da versão e o instala em `~/.local/bin` (Windows: `%LOCALAPPDATA%\Programs\openspec`, adicionado ao seu `PATH` de usuário). Defina `OPENSPEC_INSTALL_DIR` para escolher outra pasta, ou `OPENSPEC_VERSION=v1.15.0` para fixar uma versão. Prefere npm ou outro gerenciador de pacotes? Consulte [Gerenciadores de pacotes](#gerenciadores-de-pacotes).

Para instalar manualmente, baixe o arquivo da sua plataforma na [versão mais recente](https://github.com/Fission-AI/OpenSpec/releases/latest), renomeie-o para `openspec` (`openspec.exe` no Windows), torne-o executável no macOS e no Linux (`chmod +x openspec`) e coloque-o no seu `PATH`:

| Plataforma | Arquivo |
|---|---|
| macOS 13+ (Apple Silicon / Intel) | `openspec-darwin-arm64` / `openspec-darwin-x64` |
| Linux (glibc 2.17+) | `openspec-linux-x64` / `openspec-linux-arm64` |
| Alpine 3.17+ (requer `apk add libstdc++ libgcc`) | `openspec-linux-x64-musl` / `openspec-linux-arm64-musl` |
| Windows 10+ | `openspec-windows-x64.exe` / `openspec-windows-arm64.exe` |

No macOS, um arquivo baixado pelo navegador fica bloqueado até que você execute `xattr -d com.apple.quarantine openspec`; o script de instalação evita isso. No Windows, o SmartScreen pode exibir um aviso na primeira vez que você executar o arquivo pelo Explorer.

## Instale com seu assistente de IA

Prefere não fazer isso manualmente? Cole o prompt abaixo em qualquer assistente de programação capaz de executar comandos shell — Claude Code, Codex, Cursor, Gemini CLI, Copilot ou qualquer outra das [ferramentas compatíveis](/pt-BR/supported-tools/). Ele instala a CLI, inicializa este projeto e informa o que realmente aconteceu.

As etapas manuais abaixo são a fonte de verdade — o prompt apenas as executa para você. Se o assistente parar e pedir que você faça algo, isso é intencional: ele solicita confirmação antes de operações privilegiadas e nunca edita os arquivos de inicialização do shell. Conclua essas etapas por conta própria com ajuda de [Instalar](#instalar) e [Solução de problemas](/pt-BR/troubleshooting/).

```text
Install OpenSpec in this project and set it up for me. Follow these steps in
order, and stop where a step tells you to stop.

1. INSTALL. Run `openspec --version` first. If it prints a version, OpenSpec is
   already installed: run `openspec version --check`, which prints the update
   command for how it was installed when it can tell (otherwise update it the
   way it was installed, e.g. `brew upgrade openspec`), offer to run that, and
   skip to step 3. If I installed it with a package manager, mention once that
   `openspec install` switches to the standalone install, but only switch if I
   ask; never switch it to a different install method on your own. Otherwise install
   the standalone OpenSpec binary, which needs no Node.js. Show me the command
   for my OS and run it only once I confirm, then skip to step 3:
     macOS / Linux:        curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
     Windows (PowerShell): irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
   If I'd rather use a package manager, or the installer fails, go to step 2.

2. PACKAGE MANAGER (only if step 1 did not install it). Run `node --version`:
   this needs Node.js 20.19.0 or higher. If Node is missing or older, say so and
   stop — don't install Node, switch versions, or reconfigure my version
   manager for me. Otherwise use whichever package manager is already on my
   PATH, preferring npm:
     npm install -g @fission-ai/openspec@latest
     pnpm add -g @fission-ai/openspec@latest
     bun add -g @fission-ai/openspec@latest
     yarn global add @fission-ai/openspec@latest   (Yarn 1.x only)
   Don't pick based on this project's lockfile — a global install has nothing to
   do with how this repo's own dependencies are installed. If none of those four
   is available, stop and tell me — don't improvise an install. (If I'm on Nix,
   point me at the Nix section of the OpenSpec installation docs instead.)
   Show me the exact command and let me confirm before you run it; this installs
   software outside the project, and I may want a different package manager to
   own it.
   Stop and ask me again if the install needs sudo or admin rights, fails with a
   permissions error, or reports that its global bin directory is missing or
   unconfigured. Never edit my shell startup files (.bashrc, .zshrc, .profile,
   fish, PowerShell profile), and never run a setup command that edits them for
   me — show me the change and let me make it.

3. PATH. Run `openspec --version`. If the command isn't found, it may just be
   missing from this shell: tell me where it was installed (the standalone
   installer prints the folder, ~/.local/bin by default; a package manager has
   its own global bin folder) and how to add that folder to PATH for my shell
   and OS, then stop until I confirm. On Windows the standalone installer adds
   it for me; a new terminal picks it up. If it prints an older version than the one the install just
   reported, an earlier copy is shadowing it on PATH — tell me both versions
   instead of continuing. If I use a version manager, say so rather than editing
   PATH around it: with nvm or fnm the CLI is tied to the Node version that was
   active when you installed it, and with asdf or volta a shim may need
   regenerating.

4. INITIALIZE. Ask me which AI coding tool or tools I use and map each to an id
   from `openspec init --help` (Copilot is `github-copilot`, Zoo Code is
   `roocode`). `--tools` takes a comma-separated list, so name all of them.
   `openspec init --tools <ids>` deletes leftovers from older OpenSpec versions
   automatically, without asking — including `opsx-*.md` prompt files in my home
   directory (Codex keeps them in ~/.codex/prompts). Before you run it, look for
   those: `.../commands/openspec/` folders, OpenSpec marker blocks in files like
   CLAUDE.md or AGENTS.md, and home-directory `opsx-*.md` prompts. List whatever
   you find and wait for my go-ahead; if you find nothing, say so and carry on
   without asking. An existing `openspec/` folder is not a problem — init
   refreshes it and leaves my specs and changes alone.
   Confirm I'm in the right folder too: init creates `openspec/` wherever it
   runs, including inside a monorepo package.
   Then run: openspec init --tools <ids>

5. REPORT. Don't assume what should exist — tell me what init actually printed:
   how many skills and/or commands it created and where, the config file line,
   any "Setup required" note, and what to restart or reload. Some tools are
   skills-only and correctly create zero command files, so missing commands is
   not a failure on its own. If init said nothing was generated, relay the fix
   it suggested instead of retrying. Finish by telling me how to invoke OpenSpec
   in my tool, and take the exact spelling from the files init created rather
   than from its summary line: the punctuation differs per tool (/opsx:propose
   in some, /opsx-propose in others, @opsx-propose in Amazon Q), and tools that
   get skills instead of commands are invoked by skill name (/openspec-propose,
   or $openspec-propose in Codex, or /skill:openspec-propose in Kimi Code).
```

Nada no prompt é específico de um fornecedor: são instruções simples junto com os mesmos comandos documentados nesta página. Ele funciona no macOS, Linux e Windows e interrompe deliberadamente o processo em vez de improvisar quando uma etapa requer sua permissão. Seu assistente precisa conseguir executar comandos shell — algumas integrações de IDE não conseguem.

## Gerenciadores de pacotes

A instalação com um gerenciador de pacotes exige **Node.js 20.19.0 ou superior** (confira com `node --version`).

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

O Yarn 2 e versões posteriores (Berry) removeram o comando `global`. Nessas versões, instale o OpenSpec com npm, pnpm ou bun — uma CLI global não precisa usar o mesmo gerenciador de pacotes do projeto.

### deno

Às vezes, o Deno tem problemas para analisar a tag @latest, mas é possível especificar uma versão na instalação inicial.
Se isso acontecer, substitua a tag @latest pela versão, por exemplo, `@^1.3.1`.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Observação: se seus subcomandos iniciarem ferramentas externas, como config edit, feedback ou workspace open, talvez seja necessário conceder a permissão específica --allow-run=<program>.

### bun

O Bun pode instalar o OpenSpec globalmente, mas atualmente o OpenSpec é executado no Node.js.
Ainda é necessário ter Node.js 20.19.0 ou superior disponível no `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Run OpenSpec directly without installation:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Verifique a instalação

```bash
openspec --version
```

## Mudar do npm para a instalação independente

Suas configurações e projetos são mantidos; só o programa muda.

1. Execute `openspec install`. Ele instala a cópia independente e exibe o comando que remove a antiga.
2. Execute esse comando, por exemplo `npm uninstall -g @fission-ai/openspec` (Homebrew: `brew uninstall openspec`). Até lá, a cópia antiga continua sendo executada primeiro no seu PATH.
3. Em um novo terminal, execute `openspec version`. Ele deve exibir `OpenSpec <version> (standalone)`. Se mencionar um gerenciador de pacotes, outra cópia ainda está no seu PATH: `which -a openspec` (Windows: `where.exe openspec`) as lista.

## Atualização

Atualize a CLI executando novamente o [comando de instalação](#instalar) (com um gerenciador de pacotes: `npm install -g @fission-ai/openspec@latest` ou o equivalente com pnpm/yarn/bun). Depois, atualize os arquivos gerados de cada projeto:

```bash
openspec update   # run inside each project
```

`openspec update` gera novamente os arquivos de skills e comandos das ferramentas que você configurou, mantendo os comandos de barra compatíveis com a versão instalada. O comando também verifica se uma CLI mais recente foi publicada e oferece a atualização, necessária para disponibilizar novos fluxos de trabalho. Consulte a [Referência da CLI](/pt-BR/cli/#openspec-update).

## Desinstalação

Não há um comando `openspec uninstall`, pois o OpenSpec é apenas um programa e alguns arquivos no projeto. A remoção exige algumas etapas manuais, e nenhuma delas altera o código-fonte.

**1. Remova a CLI.** Exclua o arquivo que o instalador colocou no lugar: `~/.local/bin/openspec` ou, no Windows, `%LOCALAPPDATA%\Programs\openspec\openspec.exe` (e remova essa pasta do seu `PATH` de usuário). Se você instalou com um gerenciador de pacotes:

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

O binário independente também mantém, quando esse diretório é gravável, uma cópia dos seus schemas integrados no diretório de dados do OpenSpec (`~/.local/share/openspec/binary-schemas` no macOS e no Linux, `%LOCALAPPDATA%\openspec\binary-schemas` no Windows), que você também pode excluir.

**2. Remova o OpenSpec de um projeto (opcional).** Exclua o diretório `openspec/` se não quiser mais manter as especificações e mudanças:

```bash
rm -rf openspec/
```

Pense bem antes de fazer isso: `openspec/specs/` e `openspec/changes/archive/` registram como o sistema se comporta e por que mudou. Se quiser preservar esse histórico, mantenha a pasta (ou mantenha-a no Git) mesmo depois de desinstalar.

**3. Remova os arquivos gerados para as ferramentas de IA (opcional).** O OpenSpec grava arquivos de skills e comandos em diretórios específicos de cada ferramenta, como `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` e outros. Exclua as skills `openspec-*` e os comandos `opsx-*` correspondentes às ferramentas configuradas. Os caminhos exatos de cada ferramenta estão em [Ferramentas compatíveis](/pt-BR/supported-tools/).

Se houver blocos marcadores do OpenSpec em arquivos como `CLAUDE.md` ou `AGENTS.md`, remova-os manualmente; o conteúdo criado por você nesses arquivos deve ser mantido.

## Próximos passos

Depois da instalação, inicialize o OpenSpec no projeto:

```bash
cd your-project
openspec init
```

Consulte [Primeiros passos](/pt-BR/getting-started/) para ver o guia completo.
