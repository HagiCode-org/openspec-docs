---
title: "インストール"
---

## 前提条件

- **Node.js 20.19.0 以降** — `node --version` でバージョンを確認してください。

## AI アシスタントを使ってインストールする

手動で操作したくない場合は、以下のプロンプトをシェルコマンドを実行できるコーディングアシスタント（Claude Code、Codex、Cursor、Gemini CLI、Copilot などの[対応ツール](/ja-JP/supported-tools/)）に貼り付けてください。CLI をインストールし、このプロジェクトを初期化して、実際に行った内容を報告します。

以下の手動手順が正式な情報源であり、プロンプトはその手順を代わりに実行するだけです。アシスタントが途中で停止し、作業を引き継いでも、それは意図された動作です。権限が必要な操作の前に確認し、シェルの起動ファイルを編集することはありません。[パッケージマネージャー](#package-managers)と[トラブルシューティング](/ja-JP/troubleshooting/)を参照して、残りの作業を自分で完了してください。

```text
このプロジェクトに OpenSpec をインストールしてセットアップしてください。以下の手順を順番に実行し、停止するよう指示された箇所で停止してください。

1. ランタイム。`node --version` を実行してください。OpenSpec には Node.js 20.19.0 以降が必要です。
   Node がインストールされていないか、バージョンが古い場合は、その旨を伝えて停止してください。
   Node のインストール、バージョン切り替え、バージョンマネージャーの再設定は行わないでください。

2. インストール。すでに PATH 上にあるパッケージマネージャーを使い、npm を優先してください。
     npm install -g @fission-ai/openspec@latest
     pnpm add -g @fission-ai/openspec@latest
     bun add -g @fission-ai/openspec@latest
     yarn global add @fission-ai/openspec@latest   (Yarn 1.x only)
   このプロジェクトの lockfile を基準に選ばないでください。グローバルインストールは、
   このリポジトリ自体の依存関係のインストール方法とは無関係です。上記4つのどれも
   利用できない場合は停止して伝えてください。別の方法を勝手に試さないでください。
   （Nix を使っている場合は、OpenSpec のインストールガイドにある Nix の節を案内してください。）
   正確なコマンドを表示し、実行前に私の確認を得てください。プロジェクト外に
   ソフトウェアをインストールするため、別のパッケージマネージャーを使いたい場合があります。
   インストールに sudo または管理者権限が必要な場合、権限エラーが発生した場合、
   グローバル bin ディレクトリが見つからない、または未設定と報告された場合は、
   もう一度停止して確認してください。シェルの起動ファイル（.bashrc、.zshrc、.profile、
   fish、PowerShell profile）を編集したり、それらを編集するセットアップコマンドを
   実行したりしないでください。変更内容を表示し、私自身が反映できるようにしてください。

3. PATH。`openspec --version` を実行してください。コマンドが見つからない場合は、
   このシェルの PATH にないだけかもしれません。パッケージマネージャーのインストール先と、
   使用中のシェルおよび OS でそのディレクトリを PATH に追加する方法を伝え、私の確認が
   得られるまで停止してください。インストール時に報告されたバージョンより古いものが
   表示された場合、PATH 上の以前のコピーが優先されています。続行せず、両方のバージョンを
   伝えてください。バージョンマネージャーを使っている場合は、PATH を直接変更せず、
   その旨を伝えてください。nvm または fnm では CLI がインストール時に有効だった Node の
   バージョンに紐付き、asdf または volta では shim の再生成が必要になることがあります。

4. 初期化。使用している AI コーディングツールを尋ね、それぞれを
   `openspec init --help` に記載された ID に対応付けてください（Copilot は
   `github-copilot`、Zoo Code は `roocode`）。`--tools` はカンマ区切りのリストを
   受け取るため、使用するものをすべて指定してください。
   `openspec init --tools <ids>` は、ホームディレクトリ内の `opsx-*.md` プロンプト
   ファイル（Codex の場合は ~/.codex/prompts にあります）を含め、以前の OpenSpec
   バージョンの残存ファイルを確認なしに自動削除します。実行前に、これらを探してください。
   `.../commands/openspec/` フォルダー、CLAUDE.md や AGENTS.md などのファイルにある
   OpenSpec マーカーブロック、ホームディレクトリにある `opsx-*.md` プロンプトが対象です。
   見つけたものを一覧表示して、私の許可を待ってください。何も見つからなければ、その旨を
   伝えて、確認を求めずに続行してください。既存の `openspec/` フォルダーは問題ありません。
   init はそこを更新し、仕様や change はそのまま保持します。
   正しいフォルダーにいることも確認してください。モノレポのパッケージ内を含め、
   init は実行された場所に `openspec/` を作成します。
   その後、次を実行してください: openspec init --tools <ids>

5. 報告。何が作られるはずかを推測せず、init が実際に表示した内容を伝えてください。
   作成したスキルやコマンドの数と場所、設定ファイルに関する行、"Setup required" の
   注記、再起動または再読み込みが必要なものを報告します。スキルのみを使うツールでは、
   コマンドファイルが0個でも正常です。init が何も生成しなかった場合は、再試行せず、
   提示された修正方法を伝えてください。最後に、OpenSpec の呼び出し方法を説明します。
   要約行ではなく、init が作成したファイルから正確な表記を使ってください。句読点は
   ツールごとに異なります（/opsx:propose の場合、/opsx-propose の場合、Amazon Q の
   @opsx-propose など）。コマンドではなくスキルを使うツールではスキル名で呼び出します
   （/openspec-propose、Codex では $openspec-propose、Kimi Code では
   /skill:openspec-propose）。
```

このプロンプトにベンダー固有の要素はありません。このページで説明するコマンドと通常の指示だけです。macOS、Linux、Windows で動作し、許可が必要な手順では勝手に進めずに停止します。ただし、アシスタントはシェルコマンドを実行できる必要があります。一部の IDE 統合では実行できません。

## パッケージマネージャー

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

Deno では `@latest` タグの解析に問題が生じることがあります。その場合、最初のインストール時にはバージョンを指定できます。
問題が発生したときは `@latest` を `@^1.3.1` のようなバージョン指定に置き換えてみてください。

```bash
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@latest
# or
deno install --global \
  --allow-read --allow-write --allow-env --allow-sys=cpus,homedir --allow-net=edge.openspec.dev \
  npm:@fission-ai/openspec@^1.3.1
```

注: config edit、feedback、workspace open などのサブコマンドが外部ツールを起動する場合、対象を指定した `--allow-run=<program>` が必要になることがあります。

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

## 更新

パッケージをアップグレードし、各プロジェクトの生成ファイルを更新します。

```bash
npm install -g @fission-ai/openspec@latest   # または pnpm/yarn/bun の同等コマンド
openspec update                              # 各プロジェクト内で実行
```

`openspec update` は設定済みツールのスキルとコマンドファイルを再生成し、インストール済みのバージョンに合わせてスラッシュコマンドを最新に保ちます。また、新しい CLI が公開されていないか確認してアップグレードを提示します。新しいワークフローを利用するには、まずアップグレードが必要です。[CLI リファレンス](/ja-JP/cli/#openspec-update)を参照してください。

## アンインストール

OpenSpec はグローバルパッケージとプロジェクト内のファイルだけで構成されるため、`openspec uninstall` コマンドはありません。いくつかの手順を手動で行いますが、ソースコードに触れることはありません。

**1. グローバルパッケージを削除する:**

```bash
npm uninstall -g @fission-ai/openspec   # or: pnpm rm -g / yarn global remove / bun rm -g
```

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
