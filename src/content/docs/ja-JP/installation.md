---
title: "インストール"
---

## インストール

OpenSpec は単一のファイルです。Node.js などの追加のソフトウェアは必要ありません（Alpine Linux では、先に `apk add libstdc++ libgcc` を実行してください）。

macOS と Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
```

Windows（PowerShell）：

```powershell
irm https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.ps1 | iex
```

インストーラーは、必要なファイルがすべて添付された最新のリリースを選び、お使いのマシンに合ったファイルを選択して、リリースの `SHA256SUMS` と照合したうえで `~/.local/bin` にインストールします（Windows では `%LOCALAPPDATA%\Programs\openspec` にインストールされ、ユーザーの `PATH` に追加されます）。別のフォルダーを指定するには `OPENSPEC_INSTALL_DIR` を、リリースを固定するには `OPENSPEC_VERSION=v1.15.0` を設定してください。npm や他のパッケージマネージャーを使いたい場合は、[パッケージマネージャー](#パッケージマネージャー)を参照してください。

手動でインストールするには、[最新のリリース](https://github.com/Fission-AI/OpenSpec/releases/latest)からお使いのプラットフォームのファイルをダウンロードし、`openspec`（Windows では `openspec.exe`）に名前を変更して、macOS と Linux では実行権限を付与（`chmod +x openspec`）したうえで、`PATH` 上に配置してください。

| プラットフォーム | ファイル |
|---|---|
| macOS 13+（Apple Silicon / Intel） | `openspec-darwin-arm64` / `openspec-darwin-x64` |
| Linux（glibc 2.17+） | `openspec-linux-x64` / `openspec-linux-arm64` |
| Alpine 3.17+（`apk add libstdc++ libgcc` が必要） | `openspec-linux-x64-musl` / `openspec-linux-arm64-musl` |
| Windows 10+ | `openspec-windows-x64.exe` / `openspec-windows-arm64.exe` |

macOS では、ブラウザでダウンロードしたファイルは `xattr -d com.apple.quarantine openspec` を実行するまでブロックされます。インストールスクリプトを使えば、この操作は不要です。Windows では、エクスプローラーから初めて実行するときに SmartScreen の警告が表示されることがあります。

## AI アシスタントを使ってインストールする

手動で操作したくない場合は、以下のプロンプトをシェルコマンドを実行できるコーディングアシスタント（Claude Code、Codex、Cursor、Gemini CLI、Copilot などの[対応ツール](/ja-JP/supported-tools/)）に貼り付けてください。CLI をインストールし、このプロジェクトを初期化して、実際に行った内容を報告します。

以下の手動手順が正式な情報源であり、プロンプトはその手順を代わりに実行するだけです。アシスタントが途中で停止し、作業を引き継いでも、それは意図された動作です。権限が必要な操作の前に確認し、シェルの起動ファイルを編集することはありません。[インストール](#インストール)と[トラブルシューティング](/ja-JP/troubleshooting/)を参照して、残りの作業を自分で完了してください。

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

このプロンプトにベンダー固有の要素はありません。このページで説明するコマンドと通常の指示だけです。macOS、Linux、Windows で動作し、許可が必要な手順では勝手に進めずに停止します。ただし、アシスタントはシェルコマンドを実行できる必要があります。一部の IDE 統合では実行できません。

## パッケージマネージャー

パッケージマネージャーでインストールするには、**Node.js 20.19.0 以降**が必要です（`node --version` で確認できます）。

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

Yarn 2 以降（Berry）では `global` コマンドが削除されました。該当するバージョンでは、代わりに npm、pnpm、または bun で OpenSpec をインストールしてください。グローバル CLI はプロジェクトのパッケージマネージャーと同じである必要はありません。

### deno

Deno では @latest タグの解析に問題が生じることがあります。その場合、最初のインストール時にはバージョンを指定できます。
問題が発生したときは @latest を `@^1.3.1` のようなバージョン指定に置き換えてみてください。

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

注： config edit、feedback、workspace open などのサブコマンドが外部ツールを起動する場合、対象を指定した --allow-run=<program> が必要になることがあります。

### bun

Bun で OpenSpec をグローバルにインストールできますが、現在 OpenSpec は Node.js 上で実行されます。
引き続き、`PATH` 上で Node.js 20.19.0 以降を利用できる必要があります。

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

インストールせずに OpenSpec を直接実行します。

```bash
nix run github:Fission-AI/OpenSpec -- init
```

または、プロファイルにインストールします。

```bash
nix profile install github:Fission-AI/OpenSpec
```

または、`flake.nix` の開発環境に追加します。

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

## インストールの確認

```bash
openspec --version
```

## npm から単体版へ切り替える

設定とプロジェクトはそのまま引き継がれ、変わるのはプログラムだけです。

1. `openspec install` を実行します。単体版をインストールし、古いコピーを削除するためのコマンドが表示されます。
2. そのコマンドを実行します。例：`npm uninstall -g @fission-ai/openspec`（Homebrew の場合：`brew uninstall openspec`）。それまでは、古いコピーが PATH 上で先に実行されます。
3. 新しいターミナルで `openspec version` を実行します。`OpenSpec <version> (standalone)` と表示されるはずです。パッケージマネージャーの名前が表示される場合は、別のコピーがまだ PATH 上にあります。`which -a openspec`（Windows: `where.exe openspec`）で一覧を確認できます。

## 更新

[インストールコマンド](#インストール)をもう一度実行して CLI をアップグレードします（パッケージマネージャーを使う場合は、`npm install -g @fission-ai/openspec@latest`、または pnpm、yarn、bun の同等コマンドを実行します）。その後、各プロジェクトの生成ファイルを更新します：

```bash
openspec update   # run inside each project
```

`openspec update` は設定済みツールのスキルとコマンドファイルを再生成し、インストール済みのバージョンに合わせてスラッシュコマンドを最新に保ちます。また、新しい CLI が公開されていないか確認してアップグレードを提示します。新しいワークフローを利用するには、まずアップグレードが必要です。[CLI リファレンス](/ja-JP/cli/#openspec-update)を参照してください。

## アンインストール

OpenSpec は1つのプログラムとプロジェクト内のいくつかのファイルだけで構成されるため、`openspec uninstall` コマンドはありません。いくつかの手順を手動で行いますが、ソースコードに触れることはありません。

**1. CLI を削除する。** インストーラーが配置したファイルを削除します。`~/.local/bin/openspec`、または Windows では `%LOCALAPPDATA%\Programs\openspec\openspec.exe`（そのフォルダーをユーザーの `PATH` からも削除します）。パッケージマネージャーでインストールした場合は、次のコマンドを実行します：

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

単体版のバイナリは、そのディレクトリに書き込めるときに限り、組み込みスキーマのコピーを OpenSpec のデータディレクトリ（macOS と Linux では `~/.local/share/openspec/binary-schemas`、Windows では `%LOCALAPPDATA%\openspec\binary-schemas`）に保持します。これも削除して構いません。

**2. プロジェクトから OpenSpec を削除する（任意）。** 仕様や change が不要であれば `openspec/` ディレクトリを削除します。

```bash
rm -rf openspec/
```

削除する前によく考えてください。`openspec/specs/` と `openspec/changes/archive/` には、システムの動作や変更理由が記録されています。履歴が必要になる可能性があるなら、アンインストール後もフォルダーを残すか、git に保管してください。

**3. 生成された AI ツールファイルを削除する（任意）。** OpenSpec は `.claude/skills/openspec-*/`、`.cursor/commands/opsx-*` などのツールごとのディレクトリに、スキルやコマンドファイルを作成します。設定したツールの `openspec-*` スキルと `opsx-*` コマンドを削除してください。ツールごとの正確なパスは[対応ツール](/ja-JP/supported-tools/)に記載されています。

`CLAUDE.md` や `AGENTS.md` などに OpenSpec のマーカーブロックがある場合は、そのブロックを手動で削除してください。これらのファイルにあるあなた自身の内容は残してください。

## 次の手順

インストール後、プロジェクトで OpenSpec を初期化します。

```bash
cd your-project
openspec init
```

一連の手順については、[はじめに](/ja-JP/getting-started/)を参照してください。
