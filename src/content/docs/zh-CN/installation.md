---
title: "安装"
---

## 安装

OpenSpec 是单个文件，无需 Node.js 或其他任何依赖（在 Alpine Linux 上，请先运行 `apk add libstdc++ libgcc`）。

macOS 和 Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
```

Windows（PowerShell）：

```powershell
irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
```

安装程序会选择文件齐全且适用于你机器的最新版本，使用该版本的 `SHA256SUMS` 进行校验，然后将其安装到 `~/.local/bin`（Windows 为 `%LOCALAPPDATA%\Programs\openspec`，并添加到你的用户 `PATH`）。设置 `OPENSPEC_INSTALL_DIR` 可选择其他文件夹，设置 `OPENSPEC_VERSION=v1.15.0` 可固定到指定版本。更想使用 npm 或其他包管理器？请参阅[包管理器](#包管理器)。

如需手动安装，请从[最新发布](https://github.com/Fission-AI/OpenSpec/releases/latest)下载适用于你平台的文件，将其重命名为 `openspec`（Windows 上为 `openspec.exe`），在 macOS 和 Linux 上执行 `chmod +x openspec` 使其可执行，然后将其放到你的 `PATH` 中：

| 平台 | 文件 |
|---|---|
| macOS 13+（Apple Silicon / Intel） | `openspec-darwin-arm64` / `openspec-darwin-x64` |
| Linux（glibc 2.17+） | `openspec-linux-x64` / `openspec-linux-arm64` |
| Alpine 3.17+（需要 `apk add libstdc++ libgcc`） | `openspec-linux-x64-musl` / `openspec-linux-arm64-musl` |
| Windows 10+ | `openspec-windows-x64.exe` / `openspec-windows-arm64.exe` |

在 macOS 上，通过浏览器下载的文件会被拦截，直到你运行 `xattr -d com.apple.quarantine openspec`；安装脚本可避免这一问题。在 Windows 上，首次从资源管理器运行时，SmartScreen 可能会发出警告。

## 使用 AI 助手安装

不想手动操作？将下面的提示词粘贴给任何能够运行 shell 命令的编程助手——例如 Claude Code、Codex、Cursor、Gemini CLI、Copilot，以及其他[受支持的工具](/zh-CN/supported-tools/)。它会安装 CLI、初始化当前项目，并向你报告实际完成的操作。

下方的手动步骤才是权威说明——提示词只是替你执行这些步骤。如果助手停止并把某些操作交还给你，这是有意设计的：涉及特权的操作前会先征求你的同意，并且绝不会修改 shell 启动文件。请根据[安装](#安装)和[故障排除](/zh-CN/troubleshooting/)指南自行完成这些步骤。

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

提示词本身不依赖任何特定厂商：它只是普通指令和本页记录的相同命令。它适用于 macOS、Linux 和 Windows；如果某一步需要你的许可，它会停下来，而不是擅自采取措施。你的助手还必须能够运行 shell 命令——部分 IDE 集成不具备此能力。

## 包管理器

使用包管理器安装需要 **Node.js 20.19.0 或更高版本**（可使用 `node --version` 检查）。

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

Yarn 2 及更高版本（Berry）已移除 `global` 命令。使用这些版本时，请改用 npm、pnpm 或 bun 安装 OpenSpec——全局 CLI 无需使用与你项目相同的包管理器。

### deno

Deno 有时无法正确解析 @latest 标签，但可以在首次安装时指定版本。
遇到这种情况时，可以尝试将 @latest 换成版本号，例如 `@^1.3.1`。

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

注意：如果子命令会启动外部工具（例如配置编辑、反馈或打开工作区），可能需要为其指定范围受限的 --allow-run=<program> 权限。

### bun

Bun 可以全局安装 OpenSpec，但目前 OpenSpec 仍在 Node.js 上运行。
因此，`PATH` 中仍需提供 Node.js 20.19.0 或更高版本。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

无需安装即可直接运行 OpenSpec：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

也可以将其安装到配置档案中：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或者将它添加到 `flake.nix` 的开发环境中：

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

## 验证安装

```bash
openspec --version
```

## 从 npm 切换到独立安装版

你的设置和项目会保留，只有程序本身会被替换。

1. 运行 `openspec install`。它会安装独立版本，并输出用于移除旧版本的命令。
2. 运行该命令，例如 `npm uninstall -g @fission-ai/openspec`（Homebrew 用户为 `brew uninstall openspec`）。在此之前，PATH 中优先运行的仍是旧副本。
3. 在新终端中运行 `openspec version`，输出应为 `OpenSpec <version> (standalone)`。如果输出中提到某个包管理器，说明 PATH 中仍有另一个副本：运行 `which -a openspec`（Windows：`where.exe openspec`）可列出所有副本。

## 更新

再次运行[安装命令](#安装)即可升级 CLI（若使用包管理器，则运行 `npm install -g @fission-ai/openspec@latest` 或其 pnpm/yarn/bun 等效命令）。然后刷新每个项目生成的文件：

```bash
openspec update   # run inside each project
```

`openspec update` 会为已配置的工具重新生成技能和命令文件，确保斜杠命令与当前安装的版本一致。它还会检查是否发布了更新的 CLI，并提供升级选项；升级是启用新工作流的前提。参阅 [CLI 参考](/zh-CN/cli/#openspec-update)。

## 卸载

没有 `openspec uninstall` 命令，因为 OpenSpec 只是一个程序和项目中的一些文件。卸载需要手动执行几个步骤，但不会触碰源代码。

**1. 移除 CLI。** 删除安装程序放置的文件：`~/.local/bin/openspec`，或在 Windows 上删除 `%LOCALAPPDATA%\Programs\openspec\openspec.exe`（并从你的用户 `PATH` 中移除该文件夹）。如果你使用包管理器安装：

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

独立二进制文件还会在你的 OpenSpec 数据目录下保留一份内置 schema 副本，前提是该目录可写（macOS 和 Linux 为 `~/.local/share/openspec/binary-schemas`，Windows 为 `%LOCALAPPDATA%\openspec\binary-schemas`），你也可以一并删除。

**2. 从项目中移除 OpenSpec（可选）。** 如果不再需要规格说明和变更，可以删除 `openspec/` 目录：

```bash
rm -rf openspec/
```

执行前请仔细考虑：`openspec/specs/` 和 `openspec/changes/archive/` 记录了系统的行为以及变更原因。如果将来可能需要这些历史记录，即使卸载后也应保留该文件夹（或将其留在 git 中）。

**3. 移除生成的 AI 工具文件（可选）。** OpenSpec 会将技能和命令文件写入各工具自己的目录，例如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等。请删除你配置过的工具对应的 `openspec-*` 技能和 `opsx-*` 命令。各工具的具体路径见[支持的工具](/zh-CN/supported-tools/)。

如果 `CLAUDE.md` 或 `AGENTS.md` 等文件中还包含 OpenSpec 标记块，请手动删除这些标记块；文件中你自己的内容应予以保留。

## 后续步骤

安装完成后，在项目中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

完整操作流程请参阅[快速入门](/zh-CN/getting-started/)。
