---
title: "コマンドの実行方法"
---

**知っておくべきことは1つです。OpenSpec のコマンドには2種類あり、それぞれ別の場所で実行します。**

- `openspec ...` コマンドは **ターミナル** で実行します（例: `openspec init`）。
- `/opsx:...` コマンドは **AI アシスタントとのチャット** で実行します（例: `/opsx:propose`）。

ターミナルに `/opsx:propose` を入力しても何も起きない場合、このページがその理由です。OpenSpec の使う場所を間違えています。スラッシュコマンドはターミナルコマンドではなく、「ログインフォームを追加して」と普段入力するのと同じチャット欄で、AI コーディングアシスタントに与える指示です。

この違いは、新しい利用者が最もよくつまずく点です。はっきり説明しましょう。

## 2つの機能

OpenSpec は2つの役割を持つ1つのプロジェクトです。

**CLI（ターミナル側）。** シェルからインストールして実行する `openspec` というプログラムです。プロジェクトのセットアップ、change の一覧表示や検証、ダッシュボードの表示、完了した作業のアーカイブを行います。iTerm、VS Code のターミナル、PowerShell など、`git` や `npm` を実行する場所で入力します。

```bash
openspec init        # このプロジェクトで OpenSpec をセットアップ
openspec list        # 作業中の change を表示
openspec view        # 対話型ダッシュボードを開く
```

**スラッシュコマンド（チャット側）。** `/opsx:propose` や `/opsx:apply` のように、AI アシスタントに入力する短いコマンドです。提案の下書き、仕様の作成、タスクリストに基づく実装、完了後のアーカイブなど、OpenSpec のワークフローに従うよう AI に指示します。Claude Code、Cursor、Devin Desktop、Copilot など、使用するアシスタントに入力します。

```text
/opsx:propose add-dark-mode    (AI とのチャットに入力)
/opsx:apply                    (AI とのチャットに入力)
/opsx:archive                  (AI とのチャットに入力)
```

全体像を図にすると次のようになります。

```text
        ターミナル                              AI アシスタントとのチャット
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   インストール │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   コマンド    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        ここで openspec を実行                    ここで /opsx:* を実行
```

矢印に注目してください。ターミナルで `openspec init` を実行すると、AI ツールにスラッシュコマンドが *インストール* されます。ターミナル側でチャット側をセットアップします。その後の日常的な操作は、ほとんどチャットで行います。

## 「対話モード」はどうやって開始しますか？

**別の対話モードを開始する必要はありません。** よくある質問なので、明確に答えます。

特別な OpenSpec モードに入る必要はありません。いつもどおり AI コーディングアシスタントを開き、チャットにスラッシュコマンドを入力するだけです。スラッシュコマンドが OpenSpec を「開始」する方法です。アシスタントがコマンドを認識して対応する OpenSpec スキルを読み込み、ワークフローに従います。

手順は次のとおりです。

1. プロジェクトで AI コーディングアシスタント（Claude Code、Cursor、Devin Desktop など）を開きます。
2. 他の依頼を入力するのと同じチャット欄に `/opsx:propose` と入力します。
3. 入力補完を確認します。OpenSpec がインストールされていれば、スラッシュを入力すると `/opsx:propose`、`/opsx:apply` などが表示されます。

これだけです。モードの切り替えも、デーモンの起動も、別ウィンドウも不要です。

本当に対話型の機能が1つだけターミナルにあります。それが `openspec view` です。仕様や change を閲覧するダッシュボードを開きます。ただし、これは閲覧ツールであり、提案や実装に使うものではありません。実装はチャット内のスラッシュコマンドで行います。

## なぜ分かれているのか

この仕組みを理解すると、OpenSpec が30以上の異なる AI ツールに対応できる理由が分かります。

CLI は **エンジン** です。change フォルダーの構成、成果物の依存関係、差分仕様を真実の情報源にマージする方法などのルールを把握しています。どの環境でも同じです。

スラッシュコマンドは **ハンドル** で、AI ツールごとに少しずつ異なります。Claude Code は「commands」と呼び、Cursor と Devin Desktop は独自の形式を使い、一部のツールは「skills」と呼びます。`openspec init` を実行すると、選択した各ツールに適した種類のファイルが生成されるため、どのアシスタントを選んでも同じ `/opsx:propose` の意図を実行できます。

この設計の利点は、一度ワークフローを覚えれば複数のツールで活用できることです。一方、コマンドの正確な構文はツールごとに多少異なります。次の節で説明します。

## ツールごとのスラッシュコマンド構文

意図はどのツールでも同じです。表記はツールが読み込むファイルに従います。

| ツールのコマンドファイル | 入力方法 | ツールの例 |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| none — skills only | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, shared `.agents` |
| none — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| none — Codex CLI | `$openspec-propose` | Codex |

Devin は2つの行にまたがる唯一のツールです。Devin Desktop は
`.devin/workflows/` を読むため、そこで `/opsx-propose` を使えます。[Devin Local は
対応していない](https://docs.devin.ai/desktop/devin-local)ため、そのエージェントでは
代わりに `/openspec-propose` スキルを使ってください。OpenSpec が
`.devin/skills/` に書き込むスキルはどちらでも使えるため、互いにスキル名で
参照します。

すべてのツールは[呼び出し方法](/ja-JP/supported-tools/#呼び出し方法)に記載されています。この表が正式な一覧です。2つの行はスラッシュコマンドではありません。Amazon Q はファイルを `@` で呼び出すプロンプトライブラリに読み込み、最後の3行ではコマンド ID ではなく *スキル名* を使用します（`/opsx:apply` のスキル名は `openspec-apply-change` です）。

迷ったときは、`openspec init` が出力した「はじめに」の行を確認してください。設定したツールに適した形式が使われています。ツールがスラッシュコマンドを表示する場合は、スラッシュを入力して補完候補を確認する方法もあります。

## コマンドの仕組み: スキルとコマンド

`openspec init`（または `openspec update`）を実行すると、AI ツールがワークフローを見つけられるよう、OpenSpec がプロジェクト内に小さなファイルを作成します。ツールや設定に応じて、**スキル**、**コマンド**、またはその両方が作られます。

- **スキル** は `.claude/skills/openspec-*/SKILL.md` のような場所にあります。アシスタントが自動検出する手順のフォルダーであり、複数のツールで使える標準として広まりつつあります。
- **コマンド** は `.cursor/commands/opsx-<id>.md` や `.claude/commands/opsx/<id>.md` のような場所にあります。構成はツールごとに異なり、コマンドの入力方法もツールによって決まります。従来のツール固有スラッシュコマンドファイルです。Codex にはコマンドファイルが生成されないため、`.agents/skills/openspec-*` を使います。

ツールがどちらを使うか気にする必要はありません。スラッシュコマンドを入力すれば動作します。ただし、問題発生時にはファイルの存在を知っていると役立ちます。コマンドが表示されない場合、通常はファイルがないか古くなっています。`openspec update` で再生成できます。

ツールごとの正確なパスは[対応ツール](/ja-JP/supported-tools/)に、従来のコマンドのみの方法がスキルに置き換わった経緯は[移行ガイド](/ja-JP/migration-guide/)にあります。

## インストールの確認

簡単な確認方法を、手早い順に示します。

1. **AI とのチャットでスラッシュを入力する。** `/opsx` と入力し始めて、補完候補が表示されるか確認します。候補があれば設定済みです。スキルのみを使うツール（Codex、Kimi Code、CodeArts、ForgeCode、Hermes、Mistral Vibe、Zed Agent、共有 `.agents` ターゲット）では、正常にインストールされていても `/opsx` は補完されません。代わりに上の表にあるスキル名を試してください。
2. **ファイルを確認する。** Claude Code の場合、`.claude/skills/` に `openspec-*` フォルダーがあるか確認します。他のツールではそれぞれのディレクトリを使います（一覧は[対応ツール](/ja-JP/supported-tools/)を参照）。
3. **セットアップを再実行する。** プロジェクトのルートから `openspec update` を実行します。設定したツール向けのスキルとコマンドファイルが再生成されます。
4. **アシスタントを再起動する。** 多くのツールは起動時にスキルとコマンドを検出するため、新しいウィンドウを開くと解決することがあります。

## どのコマンドを使えますか？

既定では、OpenSpec は **core** のスラッシュコマンドセットをインストールします。

- `/opsx:explore`: change に着手する前に AI とアイデアを検討する（迷っているときに最適な第一歩）
- `/opsx:propose`: change を作成し、すべての計画成果物を一度に下書きする
- `/opsx:apply`: タスクリストに沿って change を実装する
- `/opsx:update`: change の計画成果物を見直し、一貫性を保つ
- `/opsx:sync`: change の仕様変更をメイン仕様にマージする（通常は自動）
- `/opsx:archive`: change を完了して保管する

おすすめの基本の流れは、何をすべきか考えるときに `explore` を使い、続いて `propose`、`apply`、`archive` を実行することです。[まず Explore](/ja-JP/explore/)ガイドでは、最初の手順が役立つ理由を説明しています。

より細かく制御したい方向けに **expanded** セット（`/opsx:new`、`/opsx:continue`、`/opsx:ff`、`/opsx:verify`、`/opsx:bulk-archive`、`/opsx:onboard`）もあります。`openspec config profile` で有効にし、`openspec update` で適用します。

初めて使う場合は、拡張セットの `/opsx:onboard` が、各手順を説明しながら自分のコードベースで change の全工程を案内します。最も分かりやすい入門方法です。

各コマンドの詳しい説明は[コマンド](/ja-JP/commands/)を、どのコマンドをいつ使うかは[ワークフロー](/ja-JP/workflows/)を参照してください。

## 最初から順に実行する

全体をまとめると、各手順の実行場所は次のとおりです。

```text
ターミナル   $ npm install -g @fission-ai/openspec@latest
ターミナル   $ cd your-project
ターミナル   $ openspec init
              (AI ツールにスラッシュコマンドをインストール)

AI チャット   /opsx:explore
              (任意: 先に AI とアイデアを検討)

AI チャット   /opsx:propose add-dark-mode
              (AI が proposal、specs、design、tasks を下書き)

AI チャット   /opsx:apply
              (AI が実装し、完了したタスクにチェック)

AI チャット   /opsx:archive
              (change を仕様にマージして保管)
```

セットアップはターミナルで2手順。その後はチャットで作業します。これが基本の流れです。

## 関連ページ

- [はじめに](/ja-JP/getting-started/): 最初の change を一通り体験
- [コマンド](/ja-JP/commands/): すべてのスラッシュコマンドの詳細
- [CLI](/ja-JP/cli/): すべてのターミナルコマンドの詳細
- [対応ツール](/ja-JP/supported-tools/): ツールごとの構文とファイルの場所
- [よくある質問](/ja-JP/faq/): その他の簡潔な回答
- [トラブルシューティング](/ja-JP/troubleshooting/): コマンドが表示されない場合の解決策
