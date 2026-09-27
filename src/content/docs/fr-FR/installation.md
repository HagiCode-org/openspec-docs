---
title: "Installation"
---

## Prérequis

- **Node.js 20.19.0 ou une version ultérieure** — vérifiez votre version avec `node --version`.

<a id="install-with-your-ai-assistant"></a>

## Installer avec votre assistant IA

Vous préférez ne pas effectuer ces opérations à la main ? Collez l'instruction ci-dessous dans un assistant de programmation capable d'exécuter des commandes shell — Claude Code, Codex, Cursor, Gemini CLI, Copilot ou tout autre [outil pris en charge](/fr-FR/supported-tools/). Il installe la CLI, initialise ce projet et vous indique ce qui s'est réellement passé.

Les étapes manuelles ci-dessous font autorité ; l'instruction les exécute simplement à votre place. Si l'assistant s'arrête et vous laisse terminer certaines étapes, c'est voulu : il demande votre accord avant toute opération privilégiée et ne modifie jamais les fichiers de démarrage du shell. Terminez vous-même ces étapes en consultant [Gestionnaires de paquets](/fr-FR/installation/#gestionnaires-de-paquets) et [Dépannage](/fr-FR/troubleshooting/).

```text
Install OpenSpec in this project and set it up for me. Follow these steps in
order, and stop where a step tells you to stop.

1. RUNTIME. Run `node --version`. OpenSpec needs Node.js 20.19.0 or higher. If
   Node is missing or older, say so and stop — don't install Node, switch
   versions, or reconfigure my version manager for me.

2. INSTALL. Use whichever package manager is already on my PATH, preferring npm:
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
   missing from this shell: tell me where the package manager installed it and
   how to add that directory to PATH for my shell and OS, then stop until I
   confirm. If it prints an older version than the one the install just
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

L'instruction n'est liée à aucun fournisseur : il s'agit de consignes ordinaires et des mêmes commandes que celles documentées sur cette page. Elle fonctionne sous macOS, Linux et Windows et s'arrête délibérément plutôt que d'improviser lorsqu'une étape nécessite votre autorisation. Votre assistant doit toutefois pouvoir exécuter des commandes shell ; certaines intégrations d'IDE ne le permettent pas.

<a id="package-managers"></a>

## Gestionnaires de paquets

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

Deno rencontre parfois des difficultés à analyser l'étiquette `@latest`, mais vous pouvez indiquer une version lors de l'installation initiale.
Dans ce cas, remplacez `@latest` par la version voulue, par exemple `@^1.3.1`.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Remarque : si vos sous-commandes lancent des outils externes — par exemple `config edit`, `feedback` ou `workspace open` — une option `--allow-run=<program>` limitée peut être nécessaire.

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

Vous pouvez aussi l'installer dans votre profil :

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

## Mise à jour

Mettez à niveau le paquet, puis actualisez les fichiers générés dans chaque projet :

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update` régénère les fichiers de skills et de commandes pour les outils configurés, afin que vos commandes slash correspondent à la version installée. La commande vérifie également si une CLI plus récente a été publiée et propose de la mettre à niveau, car c'est cette mise à niveau qui rend les nouveaux workflows disponibles — voir [Référence CLI](/fr-FR/cli/#openspec-update).

<a id="uninstalling"></a>

## Désinstallation

Il n'existe pas de commande `openspec uninstall`, car OpenSpec n'est qu'un paquet global et quelques fichiers de votre projet. La désinstallation s'effectue en quelques étapes manuelles, sans toucher au code source.

**1. Supprimer le paquet global :**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

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
