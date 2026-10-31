---
title: "Установка"
---

## Установка

OpenSpec — это один файл. Ему не нужны Node.js и что-либо ещё (в Alpine Linux сначала выполните `apk add libstdc++ libgcc`).

macOS и Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
```

Установщик выбирает самый новый релиз, у которого прикреплены все файлы, и нужный файл для вашей машины, проверяет его по `SHA256SUMS` этого релиза и устанавливает в `~/.local/bin` (в Windows: `%LOCALAPPDATA%\Programs\openspec`, каталог добавляется в ваш пользовательский `PATH`). Чтобы выбрать другой каталог, задайте `OPENSPEC_INSTALL_DIR`, или `OPENSPEC_VERSION=v1.15.0`, чтобы закрепить версию релиза. Предпочитаете npm или другой менеджер пакетов? См. [Менеджеры пакетов](#менеджеры-пакетов).

Чтобы установить вручную, скачайте файл для вашей платформы из [последнего релиза](https://github.com/Fission-AI/OpenSpec/releases/latest), переименуйте его в `openspec` (в Windows — `openspec.exe`), сделайте исполняемым в macOS и Linux (`chmod +x openspec`) и поместите в `PATH`:

| Платформа | Файл |
|---|---|
| macOS 13+ (Apple Silicon / Intel) | `openspec-darwin-arm64` / `openspec-darwin-x64` |
| Linux (glibc 2.17+) | `openspec-linux-x64` / `openspec-linux-arm64` |
| Alpine 3.17+ (нужно `apk add libstdc++ libgcc`) | `openspec-linux-x64-musl` / `openspec-linux-arm64-musl` |
| Windows 10+ | `openspec-windows-x64.exe` / `openspec-windows-arm64.exe` |

В macOS файл, скачанный через браузер, блокируется, пока вы не выполните `xattr -d com.apple.quarantine openspec`; сценарий установки этого избегает. В Windows SmartScreen может показать предупреждение при первом запуске из Проводника.

## Установка с помощью ИИ-ассистента

Не хотите выполнять эти действия вручную? Вставьте приведённый ниже prompt в любой ассистент для программирования, умеющий запускать команды оболочки, например Claude Code, Codex, Cursor, Gemini CLI, Copilot или другие [поддерживаемые инструменты](/ru-RU/supported-tools/). Ассистент установит CLI, инициализирует проект и сообщит, что именно было сделано.

Ручные шаги ниже — источник истины; prompt лишь выполняет их за вас. Если ассистент остановится и попросит вас продолжить, это предусмотрено: перед действиями с повышенными привилегиями он запрашивает разрешение и никогда не изменяет файлы запуска оболочки. Выполните оставшиеся шаги самостоятельно, воспользовавшись разделом [Установка](#установка) и [Устранение неполадок](/ru-RU/troubleshooting/).

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

Prompt не привязан к конкретному поставщику: это обычные указания и те же команды, что описаны на этой странице. Она работает в macOS, Linux и Windows и намеренно останавливается, а не импровизирует, когда требуется ваше разрешение. Ассистент должен уметь запускать команды оболочки — некоторые интеграции с IDE этого не умеют.

## Менеджеры пакетов

Для установки через менеджер пакетов нужен **Node.js версии 20.19.0 или новее** (проверьте версию командой `node --version`).

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

В Yarn 2 и более поздних версиях (Berry) команда `global` удалена. В этих версиях установите OpenSpec с помощью npm, pnpm или bun: глобальный CLI не обязан использовать тот же менеджер пакетов, что и проект.

### deno

Deno иногда не может обработать тег @latest, но при первоначальной установке можно указать версию.
В этом случае попробуйте заменить @latest номером версии, например `@^1.3.1`.

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

Примечание: если подкоманды запускают внешние инструменты, например config edit, feedback или workspace open, может понадобиться точечное разрешение --allow-run=<program>.

### bun

Bun может установить OpenSpec глобально, но сейчас OpenSpec работает на Node.js.
Node.js версии 20.19.0 или новее всё равно должна быть доступна в `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Запускайте OpenSpec напрямую, без установки:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Или установите его в свой profile:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Или добавьте его в среду разработки в `flake.nix`:

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

## Проверка установки

```bash
openspec --version
```

## Переход с npm на автономную установку

Настройки и проекты сохраняются; меняется только программа.

1. Выполните `openspec install`. Она установит автономную копию и выведет команду, которая удаляет старую.
2. Выполните эту команду, например `npm uninstall -g @fission-ai/openspec` (для Homebrew: `brew uninstall openspec`). До этого старая копия остаётся первой в PATH и продолжает запускаться.
3. В новом терминале выполните `openspec version`. Должно вывестись `OpenSpec <version> (standalone)`. Если указан менеджер пакетов, в PATH всё ещё есть другая копия: `which -a openspec` (в Windows: `where.exe openspec`) покажет все копии.

## Обновление

Обновите CLI, выполнив [команду установки](#установка) ещё раз (при использовании менеджера пакетов: `npm install -g @fission-ai/openspec@latest` или её аналог для pnpm/yarn/bun). Затем обновите сгенерированные файлы в каждом проекте:

```bash
openspec update   # run inside each project
```

Команда `openspec update` повторно создаёт файлы навыков и команд для настроенных инструментов, чтобы slash-команды соответствовали установленной версии. Она также проверяет, не выпущена ли новая версия CLI, и предлагает обновиться: именно обновление позволяет использовать новые рабочие процессы. См. [Справочник по CLI](/ru-RU/cli/#openspec-update).

## Удаление

Команды `openspec uninstall` нет, поскольку OpenSpec — это одна программа и несколько файлов в проекте. Удаление выполняется вручную в несколько шагов и не затрагивает исходный код.

**1. Удалите CLI.** Удалите файл, который установщик разместил: `~/.local/bin/openspec` или в Windows `%LOCALAPPDATA%\Programs\openspec\openspec.exe` (а также уберите эту папку из пользовательского `PATH`). Если вы устанавливали через менеджер пакетов:

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

Автономный бинарный файл также хранит, если этот каталог доступен для записи, копию своих встроенных схем в каталоге данных OpenSpec (`~/.local/share/openspec/binary-schemas` в macOS и Linux, `%LOCALAPPDATA%\openspec\binary-schemas` в Windows); её тоже можно удалить.

**2. Удалите OpenSpec из проекта (необязательно).** Если спецификации и изменения больше не нужны, удалите каталог `openspec/`:

```bash
rm -rf openspec/
```

Прежде чем делать это, подумайте: `openspec/specs/` и `openspec/changes/archive/` хранят сведения о поведении системы и причинах изменений. Если эта история может понадобиться, оставьте каталог (или сохраните его в git) даже после удаления OpenSpec.

**3. Удалите сгенерированные файлы ИИ-инструментов (необязательно).** OpenSpec записывает файлы навыков и команд в каталоги отдельных инструментов, например `.claude/skills/openspec-*/`, `.cursor/commands/opsx-*` и другие. Удалите навыки `openspec-*` и команды `opsx-*` для настроенных инструментов. Точные пути для каждого инструмента приведены в разделе [Поддерживаемые инструменты](/ru-RU/supported-tools/).

Если в файлах вроде `CLAUDE.md` или `AGENTS.md` есть блоки-маркеры OpenSpec, удалите их вручную; остальное ваше содержимое в этих файлах можно оставить.

## Следующие шаги

После установки инициализируйте OpenSpec в проекте:

```bash
cd your-project
openspec init
```

Полное руководство см. в разделе [Начало работы](/ru-RU/getting-started/).
