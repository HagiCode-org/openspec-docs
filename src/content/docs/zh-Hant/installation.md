---
title: "安裝"
---

## 先決條件

- **Node.js 20.19.0 或更高版本**——執行 `node --version` 檢查版本。

## 使用 AI 助手安裝

不想手動操作？將下面的提示詞貼上給任何能夠執行 shell 命令的程式設計助手——例如 Claude Code、Codex、Cursor、Gemini CLI、Copilot，以及其他[受支援的工具](/zh-Hant/supported-tools/)。它會安裝 CLI、初始化當前專案，並向你報告實際完成的操作。

下方的手動步驟才是權威說明——提示詞只是替你執行這些步驟。如果助手停止並把某些操作交還給你，這是有意設計的：涉及特權的操作前會先徵求你的同意，並且絕不會修改 shell 啟動檔案。請根據[包管理器](/zh-Hant/installation/)和[故障排除](/zh-Hant/troubleshooting/)指南自行完成這些步驟。

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

提示詞本身不依賴任何特定廠商：它只是普通指令和本頁記錄的相同命令。它適用於 macOS、Linux 和 Windows；如果某一步需要你的許可，它會停下來，而不是擅自採取措施。你的助手還必須能夠執行 shell 命令——部分 IDE 整合不具備此能力。

## 包管理器

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

Yarn 2 及更高版本（Berry）已移除 `global` 命令。使用這些版本時，請改用 npm、pnpm 或 bun 安裝 OpenSpec——全域 CLI 無需使用與你專案相同的包管理器。

### deno

Deno 有時無法正確解析 `@latest` 標籤，但可以在首次安裝時指定版本。
遇到這種情況時，可以嘗試將 `@latest` 換成版本號，例如 `@^1.3.1`。

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

注意：如果子命令會啟動外部工具（例如設定編輯、回饋或開啟工作區），可能需要為其指定範圍受限的 `--allow-run=<program>` 權限。

### bun

Bun 可以全域安裝 OpenSpec，但目前 OpenSpec 仍在 Node.js 上執行。
因此，`PATH` 中仍需提供 Node.js 20.19.0 或更高版本。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

無需安裝即可直接執行 OpenSpec：

```bash
nix run github:Fission-AI/OpenSpec -- init
```

也可以將其安裝到設定檔案中：

```bash
nix profile install github:Fission-AI/OpenSpec
```

或者將它新增到 `flake.nix` 的開發環境中：

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

## 驗證安裝

```bash
openspec --version
```

## 更新

升級軟體包，然後重新整理每個專案生成的檔案：

```bash
npm install -g @fission-ai/openspec@latest   # or pnpm/yarn/bun equivalent
openspec update                              # run inside each project
```

`openspec update` 會為已設定的工具重新生成技能和命令檔案，確保斜槓命令與當前安裝的版本一致。它還會檢查是否釋出了更新的 CLI，並提供升級選項；升級是啟用新工作流程的前提。參閱 [CLI 參考](/zh-Hant/cli/)。

## 解除安裝

沒有 `openspec uninstall` 命令，因為 OpenSpec 只是一個全域軟體包和專案中的一些檔案。解除安裝需要手動執行幾個步驟，但不會觸碰原始碼。

**1. 移除全域軟體包：**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

**2. 從專案中移除 OpenSpec（可選）。** 如果不再需要規格說明和變更，可以刪除 `openspec/` 目錄：

```bash
rm -rf openspec/
```

執行前請仔細考慮：`openspec/specs/` 和 `openspec/changes/archive/` 記錄了系統的行為以及變更原因。如果將來可能需要這些歷史記錄，即使解除安裝後也應保留該資料夾（或將其留在 git 中）。

**3. 移除生成的 AI 工具檔案（可選）。** OpenSpec 會將技能和命令檔案寫入各工具自己的目錄，例如 `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` 等。請刪除你設定過的工具對應的 `openspec-*` 技能和 `opsx-*` 命令。各工具的具體路徑見[支援的工具](/zh-Hant/supported-tools/)。

如果 `CLAUDE.md` 或 `AGENTS.md` 等檔案中還包含 OpenSpec 標記塊，請手動刪除這些標記塊；檔案中你自己的內容應予以保留。

## 後續步驟

安裝完成後，在專案中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

完整操作流程請參閱[快速入門](/zh-Hant/getting-started/)。
