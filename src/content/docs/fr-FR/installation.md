---
title: "Installation"
---

## Installer

OpenSpec est un fichier unique. Il ne nécessite ni Node.js ni aucun autre logiciel (sous Alpine Linux, exécutez d'abord `apk add libstdc++ libgcc`).

macOS et Linux :

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
```

Windows (PowerShell) :

```powershell
irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
```

Le programme d'installation choisit la version la plus récente dont tous les fichiers sont publiés, ainsi que le fichier adapté à votre machine, le vérifie par rapport au `SHA256SUMS` de la version et l'installe dans `~/.local/bin` (Windows : `%LOCALAPPDATA%\Programs\openspec`, ajouté à votre `PATH` utilisateur). Définissez `OPENSPEC_INSTALL_DIR` pour choisir un autre dossier, ou `OPENSPEC_VERSION=v1.15.0` pour figer une version. Vous préférez npm ou un autre gestionnaire de paquets ? Voir [Gestionnaires de paquets](#gestionnaires-de-paquets).

Pour une installation manuelle, téléchargez le fichier de votre plateforme depuis la [dernière version](https://github.com/Fission-AI/OpenSpec/releases/latest), renommez-le `openspec` (`openspec.exe` sous Windows), rendez-le exécutable sous macOS et Linux (`chmod +x openspec`), puis placez-le dans votre `PATH` :

| Plateforme | Fichier |
|---|---|
| macOS 13+ (Apple Silicon / Intel) | `openspec-darwin-arm64` / `openspec-darwin-x64` |
| Linux (glibc 2.17+) | `openspec-linux-x64` / `openspec-linux-arm64` |
| Alpine 3.17+ (nécessite `apk add libstdc++ libgcc`) | `openspec-linux-x64-musl` / `openspec-linux-arm64-musl` |
| Windows 10+ | `openspec-windows-x64.exe` / `openspec-windows-arm64.exe` |

Sous macOS, un fichier téléchargé avec un navigateur reste bloqué tant que vous n'avez pas exécuté `xattr -d com.apple.quarantine openspec` ; le script d'installation évite ce blocage. Sous Windows, SmartScreen peut afficher un avertissement la première fois que vous l'exécutez depuis l'Explorateur.

## Installer avec votre assistant IA

Vous préférez ne pas effectuer ces opérations à la main ? Collez le prompt ci-dessous dans un assistant de programmation capable d'exécuter des commandes shell — Claude Code, Codex, Cursor, Gemini CLI, Copilot ou tout autre [outil pris en charge](/fr-FR/supported-tools/). Il installe la CLI, initialise ce projet et vous indique ce qui s'est réellement passé.

Les étapes manuelles ci-dessous font autorité ; le prompt les exécute simplement à votre place. Si l'assistant s'arrête et vous laisse terminer certaines étapes, c'est voulu : il demande votre accord avant toute opération privilégiée et ne modifie jamais les fichiers de démarrage du shell. Terminez vous-même ces étapes en consultant [Installer](#installer) et [Dépannage](/fr-FR/troubleshooting/).

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

Le prompt n'est lié à aucun fournisseur : il s'agit de consignes ordinaires et des mêmes commandes que celles documentées sur cette page. Elle fonctionne sous macOS, Linux et Windows et s'arrête délibérément plutôt que d'improviser lorsqu'une étape nécessite votre autorisation. Votre assistant doit toutefois pouvoir exécuter des commandes shell ; certaines intégrations d'IDE ne le permettent pas.

## Gestionnaires de paquets

Pour installer avec un gestionnaire de paquets, **Node.js 20.19.0 ou une version ultérieure** est requis (vérifiez avec `node --version`).

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

Yarn 2 et les versions ultérieures (Berry) ne proposent plus la commande `global`. Dans ces versions, installez OpenSpec avec npm, pnpm ou bun : une CLI globale n'a pas besoin d'utiliser le même gestionnaire que votre projet.

### deno

Deno rencontre parfois des difficultés à analyser l'étiquette @latest, mais vous pouvez indiquer une version lors de l'installation initiale.
Dans ce cas, remplacez @latest par la version voulue, par exemple `@^1.3.1`.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Remarque : si vos sous-commandes lancent des outils externes — par exemple config edit, feedback ou workspace open — une option --allow-run=<program> limitée peut être nécessaire.

### bun

Bun peut installer OpenSpec globalement, mais OpenSpec s'exécute actuellement avec Node.js. Node.js 20.19.0 ou une version ultérieure doit donc être disponible dans votre `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Exécutez OpenSpec directement sans l'installer :

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Vous pouvez aussi l'installer dans votre profile :

```bash
nix profile install github:Fission-AI/OpenSpec
```

Ou l'ajouter à votre environnement de développement dans `flake.nix` :

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

## Vérifier l'installation

```bash
openspec --version
```

## Passer de npm à l'installation autonome

Vos paramètres et vos projets sont conservés ; seul le programme change.

1. Exécutez `openspec install`. Il installe la copie autonome et affiche la commande qui supprime votre ancienne copie.
2. Exécutez cette commande, par exemple `npm uninstall -g @fission-ai/openspec` (Homebrew : `brew uninstall openspec`). Tant que vous ne l'avez pas fait, l'ancienne copie reste celle qui s'exécute en premier dans votre PATH.
3. Dans un nouveau terminal, exécutez `openspec version`. Elle doit afficher `OpenSpec <version> (standalone)`. Si elle mentionne un gestionnaire de paquets, une autre copie se trouve encore dans votre PATH : `which -a openspec` (Windows : `where.exe openspec`) les répertorie.

## Mise à jour

Mettez à niveau la CLI en exécutant de nouveau la [commande d'installation](#installer) (avec un gestionnaire de paquets : `npm install -g @fission-ai/openspec@latest` ou son équivalent pnpm/yarn/bun). Actualisez ensuite les fichiers générés de chaque projet :

```bash
openspec update   # run inside each project
```

`openspec update` régénère les fichiers de skills et de commandes pour les outils configurés, afin que vos commandes slash correspondent à la version installée. La commande vérifie également si une CLI plus récente a été publiée et propose de la mettre à niveau, car c'est cette mise à niveau qui rend les nouveaux workflows disponibles — voir [Référence CLI](/fr-FR/cli/#openspec-update).

## Désinstallation

Il n'existe pas de commande `openspec uninstall`, car OpenSpec n'est qu'un seul programme et quelques fichiers de votre projet. La désinstallation s'effectue en quelques étapes manuelles, sans toucher au code source.

**1. Supprimer la CLI.** Supprimez le fichier installé par le programme d'installation : `~/.local/bin/openspec`, ou sous Windows `%LOCALAPPDATA%\Programs\openspec\openspec.exe` (et retirez ce dossier de votre `PATH` utilisateur). Si vous avez installé avec un gestionnaire de paquets :

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

Le binaire autonome conserve aussi, lorsque ce dossier est accessible en écriture, une copie de ses schémas intégrés dans votre répertoire de données OpenSpec (`~/.local/share/openspec/binary-schemas` sous macOS et Linux, `%LOCALAPPDATA%\openspec\binary-schemas` sous Windows), que vous pouvez aussi supprimer.

**2. Supprimer OpenSpec d'un projet (facultatif).** Supprimez le répertoire `openspec/` si vous ne voulez plus conserver ses spécifications et changements :

```bash
rm -rf openspec/
```

Réfléchissez avant de le faire : `openspec/specs/` et `openspec/changes/archive/` conservent l'historique du comportement du système et des raisons de ses évolutions. Si vous souhaitez conserver cet historique, gardez le dossier (ou conservez-le dans git) même après la désinstallation.

**3. Supprimer les fichiers générés pour les outils IA (facultatif).** OpenSpec écrit des skills et fichiers de commande dans des répertoires propres à chaque outil, comme `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*`, etc. Supprimez les skills `openspec-*` et commandes `opsx-*` associés aux outils configurés. La page [Outils pris en charge](/fr-FR/supported-tools/) répertorie les chemins exacts.

Si des blocs de marqueur OpenSpec figurent aussi dans des fichiers comme `CLAUDE.md` ou `AGENTS.md`, supprimez-les manuellement ; votre propre contenu dans ces fichiers doit être conservé.

## Étapes suivantes

Après l'installation, initialisez OpenSpec dans votre projet :

```bash
cd your-project
openspec init
```

Consultez [Bien démarrer](/fr-FR/getting-started/) pour suivre le guide complet.
