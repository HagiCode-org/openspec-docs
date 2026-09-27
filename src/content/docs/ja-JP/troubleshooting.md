---
title: "トラブルシューティング"
---

具体的な問題に対する具体的な解決策を紹介します。各項目では症状と考えられる原因を説明し、対処方法を示します。ここに問題が見つからない場合は、[よくある質問](/ja-JP/faq/)が役立つかもしれません。[Discord](https://discord.gg/YctCnvvshC)でも相談できます。

## インストールとセットアップ

### `openspec: command not found`

CLI がインストールされていないか、シェルから見つけられません。グローバルにインストールして確認してください。

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

インストール後も見つからない場合、npm のグローバル bin ディレクトリが `PATH` に含まれていない可能性があります。`npm prefix -g` を実行すると、グローバルパッケージの場所が分かります。macOS と Linux では、そのディレクトリ内の `bin/` にバイナリがあり、Windows ではディレクトリ直下にあります。そのパスが `PATH` に含まれていることを確認してください（`npm bin -g` は npm 9 で削除されました）。

[AI を使ったインストール](/ja-JP/installation/#install-with-your-ai-assistant)を利用した場合、ここで引き継ぐのが想定された動作です。その指示では、アシスタント自身がシェルの起動ファイルを編集するのではなく、`PATH` の変更方法を表示するよう求めます。

### "Requires Node.js 20.19.0 or higher"

OpenSpec の実行には Node 20.19.0 以降が必要です。バージョンを確認し、必要ならアップグレードしてください。

```bash
node --version
```

bun で OpenSpec をインストールした場合も、OpenSpec は引き続き Node 上で *実行される* 点に注意してください。そのため、`PATH` 上に Node 20.19.0 以降が必要です。[インストール](/ja-JP/installation/)を参照してください。

### `openspec init` didn't configure my AI tool

init はセットアップするツールを尋ねます。使用するツールを選び忘れた場合や、別のツールを追加する場合は、もう一度実行するか、非対話形式を使ってください。

```bash
openspec init --tools claude,cursor
```

ツール ID の全一覧は[対応ツール](/ja-JP/supported-tools/)にあります。すべてのツールを指定するには `--tools all`、ツールのセットアップを省略するには `--tools none` を使ってください。

## コマンドが表示されない

`/opsx:propose`（または使用ツールでの同等コマンド）が表示されない、または何も起きない場合は、次のリストを上から確認してください。確認が簡単な順に並べています。

1. **入力場所が違う可能性があります。** スラッシュコマンドはターミナルではなく AI アシスタントとのチャットで入力します。シェルに `/opsx:propose` と入力したのであれば、それが原因です。[コマンドの実行方法](/ja-JP/how-commands-work/)を参照してください。

2. **ファイルを再生成する。** プロジェクトのルートから次を実行します。

   ```bash
   openspec update
   ```

   設定済みのすべてのツールについて、スキルとコマンドのファイルを書き直します。

   指示ファイルは *インストール済み* の CLI から生成されるため、CLI が古いと新しいワークフローを書き込まずに「最新です」と報告することがあります。`openspec update` は現在、その状態を確認してアップグレードを提示します。表示されたらアップグレードしてください。

3. **アシスタントを再起動する。** ほとんどのツールは起動時にスキルとコマンドを検索します。新しいウィンドウを開くと解決することがあります。

4. **ファイルの存在を確認する。** Claude Code では `.claude/skills/` に `openspec-*` フォルダーがあるか確認します。他のツールはそれぞれのディレクトリを使います。すべて[対応ツール](/ja-JP/supported-tools/)に記載されています。

5. **このプロジェクトを初期化したか確認する。** スキルはプロジェクトごとに作成されます。リポジトリを clone した場合や、別のフォルダーに切り替えた場合は、その場所で `openspec init`（または `openspec update`）を実行してください。

6. **ツールがコマンドファイルに対応しているか確認する。** Codex、CodeArts、ForgeCode、Hermes、Kimi Code、Mistral Vibe、Zed Agent、共有 `.agents` ターゲットには `opsx-*` コマンドファイルは生成されません。代わりにスキルを使うため、`/opsx` は補完候補に表示されません。Codex では `$openspec-propose`、Kimi Code では `/skill:openspec-propose`、その他では `/openspec-propose` と入力してください。共有 `.agents` ターゲットはベンダー中立なので、`/openspec-propose` は一般的な形式であり、必ず機能するとは限りません。アシスタントが応答しない場合は、スキルの呼び出し方法をそのツールのドキュメントで確認してください。Amazon Q にはコマンドファイルが生成されますが、スラッシュメニューではなくプロンプトライブラリに読み込まれるため、`/opsx` ではなく `@opsx-propose` と入力します。各ツールの形式は[呼び出し方法](/ja-JP/supported-tools/#how-to-invoke)に記載されています。

## change の操作

### "Change not found"

コマンドは対象の change を特定できませんでした。名前を明示するか、存在する change を確認してください。

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

正しいプロジェクトディレクトリにいることも確認してください。

### "No artifacts ready"

すべての成果物がすでに作成済みか、依存する成果物を待っていてブロックされています。何が妨げているか確認してください。

```bash
openspec status --change <name>
```

次に、不足している依存成果物を先に作成します。順序を思い出してください。proposal によって specs と design が作成可能になり、specs と design の両方がそろうと tasks を作成できます。

### `openspec validate` reports warnings or errors

検証では、仕様と change の構造上の問題を確認します。メッセージにはファイル名と問題が示されるため、内容を確認してください。

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

よくある原因は必須の節がないこと（シナリオのない仕様など）や、差分ヘッダーの形式が正しくないことです。ファイルを修正して、再実行してください。出力形式は[CLI リファレンス](/ja-JP/cli/#openspec-validate)に記載されています。

特に次のメッセージには補足が必要です。

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

`MODIFIED` 要件は要件ブロック全体を置き換えるため、編集したシナリオだけでなく、変更後も残すシナリオすべてを含める必要があります。名前が示されたシナリオを `openspec/specs/<capability-path>/spec.md` から差分にコピーし、パス内のドメインディレクトリも維持してください。他の人の変更で同じ要件にシナリオが追加された後、古い change に対してこのメッセージが表示されることがあります。その change はいずれにせよアーカイブできません。現在は実装前の検証でこの問題を知らせます。

### AI が不完全または誤った成果物を作成する

AI に十分なコンテキストがありません。次の方法で改善できます。

- `openspec/config.yaml` にプロジェクトのコンテキストを追加し、技術スタックや規約をすべての依頼に反映します。[カスタマイズ](/ja-JP/customization/#project-configuration)を参照してください。
- 仕様だけに適用するガイダンスなど、成果物ごとの `rules:` を追加します。
- 提案時に、より詳しい説明を入力します。
- 拡張コマンド `/opsx:continue` を使って成果物を1つずつ作成・レビューします。`/opsx:ff` のように一度にすべてを作成する必要はありません。

### Archive が完了しない、または未完了のタスクを警告する

Archive は未完了のタスクを理由に *ブロック* はしませんが、通常は作業完了後にアーカイブするため、警告を表示します。意図的にタスクを残している（部分的な change を保管している）場合は、そのまま進めてください。それ以外の場合は先にタスクを完了します。差分仕様をまだ同期していない場合、Archive はメイン仕様への同期も提示します。特別な理由がなければ同意してください。

### "User force closed the prompt with 0 null"

AI エージェントがツールから呼び出した場合、CI ジョブ内、または stdin が閉じられたシェル内など、質問に答えられない環境で `openspec archive` が実行されました。Archive は最大3つの確認を求めますが、答えられない場合、以前はこの生のエラーメッセージで失敗していました。

事前に確認に同意するには `--yes` を指定します。

```bash
openspec archive <change-name> --yes
```

すでに指定していたフラグはそのまま付けてください。`--skip-specs` と `--no-validate` は Archive の動作を変えるため、`--yes` だけで再実行すると同じコマンドにはなりません。現在のバージョンではフラグが表示され、貼り付けて使える `Fix:` 行が出力されます。一覧から選ぼうとしていた場合は、change 名を明示してください。選択画面にも回答が必要です。

代わりに Archive の出力をファイルにリダイレクトしたりツールで取得したりし、回答をパイプで渡した場合（`printf 'y\n' | openspec archive …`）、以前のバージョンではプロンプト表示時にターミナルのエスケープコードも出力に含まれていました。環境によってはファイルが大きく膨らむことがありました。現在のバージョンでは、stdout がターミナルでない場合、確認プロンプトをプレーンテキストとして読み取ります。また、引数なしの `openspec archive`（本来は対話型の change 選択画面を表示する）では、メニューを出力に含めず、先に change 名を指定するよう求めます。いずれの場合も、リダイレクト時やエージェントからの実行をクリーンに保てます。change 名と `--yes` を指定すれば、確認自体を省略できます。

## 設定

### My `config.yaml` isn't being applied

よくある原因は3つです。

1. **ファイル名が違う。** `openspec/config.yaml` でなければなりません。`.yml` ではありません。
2. **YAML が無効。** YAML バリデーターで確認してください。CLI も行番号付きで構文エラーを報告します。
3. **再起動が必要だと思っている。** 再起動は不要です。設定の変更はすぐに反映されます。

### "Unknown artifact ID in rules: X"

`rules:` 以下のキーがスキーマ内の成果物と一致していません。既定の `spec-driven` スキーマで有効な ID は `proposal`、`specs`、`design`、`tasks` です。各スキーマの ID を確認するには次を実行します。

```bash
openspec schemas --json
```

### "Context too large"

`context:` フィールドは意図的に最大50 KBに制限されています。すべての依頼に追加されるためです。長いドキュメントを貼り付けるのではなく、要約するかリンクを記載してください。コンテキストを絞ると、より良い結果を速く得られます。

### "Schema not found"

参照したスキーマ名が存在しません。利用可能なスキーマ一覧を表示し、スペルを確認してください。

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

[カスタマイズ](/ja-JP/customization/#custom-schemas)を参照してください。

## 以前のワークフローからの移行

### "Legacy files detected in non-interactive mode"

CI または非対話型シェルで実行されているため、OpenSpec は削除対象の古いファイルを見つけましたが確認を求められません。自動的に承認するには次を実行します。

```bash
openspec init --force
```

Codex では、OpenSpec が `$CODEX_HOME/prompts` または `~/.codex/prompts` 内の古い管理対象プロンプトファイルを検出することがあります。削除対象は OpenSpec が許可リストに登録した従来の Codex プロンプトファイル名に限定されます。非対話型の `openspec init` は、置き換え先の `.agents/skills/openspec-*` スキルがあるファイルだけを削除します。非対話型の `openspec update` は、`--force` を指定しない限り、従来ファイルを削除しません。

### Commands didn't appear after migrating

IDE を再起動してください。スキルは起動時に検出されます。それでも表示されない場合は、`openspec update` を実行し、[対応ツール](/ja-JP/supported-tools/)でファイルの場所を確認してください。

### My old `project.md` wasn't migrated

意図された動作です。OpenSpec は、あなたが書いたコンテキストが含まれている可能性があるため、`project.md` を自動で削除しません。有用な内容を `config.yaml` の `context:` 節に移してから、自分で削除してください。[移行ガイド](/ja-JP/migration-guide/#migrating-projectmd-to-configyaml)では、この手順と、AI に要約を依頼するためのプロンプトを紹介しています。

## まだ解決しませんか？

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub の Issue:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ターミナルから:** `openspec feedback "what went wrong"` で Issue を作成できます。

問題を報告するときは、OpenSpec のバージョン（`openspec --version`）、Node のバージョン（`node --version`）、AI ツール名、正確なコマンドと出力を含めてください。より早くサポートできます。
