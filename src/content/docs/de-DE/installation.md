---
title: "Installation"
---

## Voraussetzungen

- **Node.js 20.19.0 oder höher** – Überprüfen Sie Ihre Version mit `node --version`.

## Mit Ihrem KI-Assistenten installieren

Möchten Sie die Installation nicht selbst vornehmen? Fügen Sie die folgende Eingabe in einen beliebigen Codierassistenten ein, der Shell-Befehle ausführen kann – Claude Code, Codex, Cursor, Gemini CLI, Copilot und die übrigen [unterstützten Tools](/de-DE/supported-tools/). Der Assistent installiert die CLI, initialisiert dieses Projekt und berichtet, was tatsächlich geschehen ist.

Die manuellen Schritte unten sind maßgeblich – die Eingabe führt sie lediglich für Sie aus. Wenn Ihr Assistent anhält und Sie um etwas bittet, ist das beabsichtigt: Er fragt vor privilegierten Aktionen nach und bearbeitet niemals Ihre Shell-Startdateien. Erledigen Sie solche Schritte selbst anhand der Abschnitte [Paketmanager](#paketmanager) und [Fehlerbehebung](/de-DE/troubleshooting/).

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

Die Eingabe ist nicht an einen bestimmten Anbieter gebunden: Sie besteht aus einfachen Anweisungen und denselben Befehlen, die auf dieser Seite dokumentiert sind. Sie funktioniert unter macOS, Linux und Windows und hält bewusst an, statt eigenmächtig weiterzumachen, wenn für einen Schritt Ihre Zustimmung nötig ist. Ihr Assistent muss Shell-Befehle ausführen können – einige IDE-Integrationen können das nicht.

## Paketmanager

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

In Yarn 2 und höher (Berry) gibt es den Befehl `global` nicht mehr. Installieren Sie OpenSpec mit diesen Versionen stattdessen mit npm, pnpm oder bun – eine global installierte CLI muss nicht denselben Paketmanager verwenden wie Ihr Projekt.

### Deno

Deno kann gelegentlich Probleme damit haben, das Tag `@latest` zu verarbeiten. Bei der Installation lässt sich aber eine Version angeben.
Versuchen Sie in diesem Fall, `@latest` durch eine Versionsangabe wie `@^1.3.1` zu ersetzen.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Hinweis: Wenn Unterbefehle externe Programme starten – etwa `config edit`, `feedback` oder `workspace open` –, benötigen Sie möglicherweise eine gezielte Berechtigung `--allow-run=<program>`.

### Bun

Bun kann OpenSpec global installieren, OpenSpec wird derzeit jedoch mit Node.js ausgeführt.
Node.js 20.19.0 oder höher muss weiterhin über `PATH` verfügbar sein.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Führen Sie OpenSpec direkt aus, ohne es zu installieren:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Oder installieren Sie OpenSpec in Ihrem Profil:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Oder fügen Sie OpenSpec in `flake.nix` zu Ihrer Entwicklungsumgebung hinzu:

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

## Installation überprüfen

```bash
openspec --version
```

## Aktualisieren

Aktualisieren Sie das Paket und erneuern Sie anschließend die generierten Dateien der einzelnen Projekte:

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update` generiert die Skill- und Befehlsdateien für die konfigurierten Tools neu, sodass Ihre Slash-Befehle der installierten Version entsprechen. Außerdem wird geprüft, ob eine neuere CLI-Version veröffentlicht wurde, und gegebenenfalls ein Upgrade angeboten. Erst durch ein Upgrade werden neue Workflows verfügbar. Siehe [CLI-Referenz](/de-DE/cli/#openspec-update).

## Deinstallieren

Es gibt keinen Befehl `openspec uninstall`, denn OpenSpec besteht lediglich aus einem globalen Paket und einigen Dateien in Ihrem Projekt. Die Deinstallation umfasst wenige manuelle Schritte und berührt Ihren Quellcode nicht.

**1. Globales Paket entfernen:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. OpenSpec aus einem Projekt entfernen (optional).** Löschen Sie das Verzeichnis `openspec/`, wenn Sie dessen Spezifikationen und Änderungen nicht mehr benötigen:

```bash
rm -rf openspec/
```

Überlegen Sie es sich vorher gut: `openspec/specs/` und `openspec/changes/archive/` dokumentieren, wie sich das System verhält und warum es geändert wurde. Falls Sie diese Historie später benötigen könnten, behalten Sie den Ordner (oder lassen Sie ihn in Git), auch wenn Sie OpenSpec deinstallieren.

**3. Generierte Dateien für KI-Tools entfernen (optional).** OpenSpec schreibt Skill- und Befehlsdateien in tool-spezifische Verzeichnisse wie `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` und weitere. Löschen Sie die Skills `openspec-*` und die Befehle `opsx-*` für die von Ihnen konfigurierten Tools. Die genauen Pfade der jeweiligen Tools finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/).

Falls Dateien wie `CLAUDE.md` oder `AGENTS.md` außerdem OpenSpec-Markierungsblöcke enthalten, entfernen Sie diese von Hand. Ihre eigenen Inhalte in diesen Dateien bleiben erhalten.

## Nächste Schritte

Initialisieren Sie OpenSpec nach der Installation in Ihrem Projekt:

```bash
cd your-project
openspec init
```

Eine vollständige Anleitung finden Sie unter [Erste Schritte](/de-DE/getting-started/).
