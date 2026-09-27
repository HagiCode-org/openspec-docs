---
title: "Instalación"
---

## Requisitos previos

- **Node.js 20.19.0 o posterior** — Comprueba la versión con `node --version`.

## Instalar con tu asistente de IA

¿Prefieres no hacerlo a mano? Pega el prompt siguiente en cualquier asistente de programación que pueda ejecutar comandos del shell, como Claude Code, Codex, Cursor, Gemini CLI, Copilot y las demás [herramientas compatibles](/es-ES/supported-tools/). Instala la CLI, inicializa este proyecto e informa de lo que ha ocurrido.

Los pasos manuales que siguen son la referencia oficial; el prompt solo los ejecuta por ti. Si el asistente se detiene y te devuelve el control, es intencional: pregunta antes de realizar acciones privilegiadas y nunca modifica los archivos de inicio de tu shell. Completa esos pasos por tu cuenta con [Administradores de paquetes](#administradores-de-paquetes) y [Solución de problemas](/es-ES/troubleshooting/).

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

El prompt no depende de ningún proveedor: contiene instrucciones sencillas y los mismos comandos documentados en esta página. Funciona en macOS, Linux y Windows y se detiene deliberadamente en vez de improvisar cuando un paso requiere tu autorización. El asistente debe poder ejecutar comandos del shell; algunas integraciones de IDE no pueden hacerlo.

## Administradores de paquetes

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

Yarn 2 y versiones posteriores (Berry) eliminaron el comando `global`. En esas versiones, instala OpenSpec con npm, pnpm o bun: una CLI global no tiene por qué usar el administrador de paquetes del proyecto.

### deno

Deno a veces tiene problemas para analizar la etiqueta @latest, pero al principio se puede especificar una versión durante la instalación.
Si ocurre, prueba a sustituir la etiqueta @latest por una versión, como `@^1.3.1`.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Nota: si los subcomandos inician herramientas externas, como `config edit`, `feedback` o `workspace open`, quizá necesites autorizar un programa concreto con `--allow-run=<program>`.

### bun

Bun puede instalar OpenSpec globalmente, pero OpenSpec se ejecuta actualmente en Node.js.
Necesitas tener Node.js 20.19.0 o posterior disponible en el `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Ejecuta OpenSpec directamente sin instalarlo:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Or install to your profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

O añádelo a tu entorno de desarrollo en `flake.nix`:

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

## Verificar la instalación

```bash
openspec --version
```

## Actualizar

Actualiza el paquete y luego renueva los archivos generados en cada proyecto:

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update` regenera los archivos de habilidades y comandos para las herramientas que hayas configurado y mantiene tus comandos de barra al día con la versión instalada. También comprueba si se ha publicado una CLI más reciente y ofrece actualizarla, ya que eso es lo que permite acceder a nuevos flujos de trabajo. Consulta la [referencia de la CLI](/es-ES/cli/#openspec-update).

## Desinstalar

No hay un comando `openspec uninstall`, porque OpenSpec solo consta de un paquete global y algunos archivos del proyecto. Para eliminarlo, basta con unos pasos manuales que no afectan al código fuente.

**1. Elimina el paquete global:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Elimina OpenSpec del proyecto (opcional).** Borra el directorio `openspec/` si ya no quieres conservar sus especificaciones y cambios:

```bash
rm -rf openspec/
```

Piénsalo antes de hacerlo: `openspec/specs/` y `openspec/changes/archive/` registran cómo se comporta el sistema y por qué cambió. Si te puede interesar ese historial, conserva la carpeta (o guárdala en Git) incluso después de desinstalar.

**3. Elimina los archivos generados para las herramientas de IA (opcional).** OpenSpec escribe archivos de habilidades y comandos en directorios específicos de cada herramienta, como `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` y otros. Elimina las habilidades `openspec-*` y los comandos `opsx-*` correspondientes a las herramientas que configuraste. Las rutas exactas de cada herramienta están en [Herramientas compatibles](/es-ES/supported-tools/).

Si también tienes bloques de marcadores de OpenSpec en archivos como `CLAUDE.md` o `AGENTS.md`, elimínalos a mano; puedes conservar el contenido propio de esos archivos.

## Siguientes pasos

Tras la instalación, inicializa OpenSpec en el proyecto:

```bash
cd your-project
openspec init
```

Consulta [Primeros pasos](/es-ES/getting-started/) para obtener una guía completa.
