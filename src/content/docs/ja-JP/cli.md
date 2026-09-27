---
title: "CLI リファレンス"
---

OpenSpec CLI（`openspec`）は、プロジェクトのセットアップ、検証、状態確認、管理に使うターミナルコマンドを提供します。これらのコマンドは、[コマンド](/ja-JP/commands/)で説明する `/opsx:propose` などの AI スラッシュコマンドを補完します。

## 概要

| カテゴリ | コマンド | 目的 |
|----------|----------|---------|
| **セットアップ** | `init`、`update` | プロジェクトで OpenSpec を初期化・更新 |
| **Stores（独立した OpenSpec リポジトリ）** | `store setup`、`store register`、`store unregister`、`store remove`、`store list`、`store doctor` | 登録済みの独立した OpenSpec リポジトリである store を管理 |
| **ヘルス** | `doctor` | 解決済みルートの関係状態を報告 |
| **作業コンテキスト** | `context` | 作業セット（ルート + 参照先 store）をまとめる |
| **個人用ワークセット** | `workset create`、`workset list`、`workset open`、`workset remove` | ツール内で個人用のローカル作業ビューを保存し、開く |
| **閲覧** | `list`、`view`、`show` | change と仕様を確認 |
| **検証** | `validate` | change と仕様の問題を確認 |
| **ライフサイクル** | `archive` | 完了した change を確定 |
| **ワークフロー** | `new change`、`status`、`instructions`、`templates`、`schemas` | 成果物駆動ワークフローを支援 |
| **スキーマ** | `schema init`、`schema fork`、`schema validate`、`schema which` | カスタムワークフローを作成・管理 |
| **設定** | `config` | 設定を表示・変更 |
| **ユーティリティ** | `feedback`、`completion` | フィードバックとシェル統合 |

---

## 人間向けコマンドとエージェント向けコマンド

CLI コマンドの多くはターミナルでの **人間による利用** を想定しています。一部のコマンドは JSON 出力による **エージェント/スクリプトからの利用** にも対応しています。

### 人間専用コマンド

これらのコマンドは対話型で、ターミナルでの利用を想定しています。

| コマンド | 目的 |
|---------|---------|
| `openspec init` | プロジェクトを初期化（対話型プロンプト） |
| `openspec view` | 対話型ダッシュボード |
| `openspec workset open <name>` | 保存済みワークセットを開く（エディターウィンドウまたはターミナルエージェントセッション） |
| `openspec config edit` | エディターで設定を開く |
| `openspec feedback` | GitHub からフィードバックを送信 |
| `openspec completion install` | シェル補完をインストール |

### エージェント対応コマンド

これらのコマンドは、AI エージェントやスクリプトからのプログラム利用に対応する `--json` 出力をサポートします。

| コマンド | 人間による利用 | エージェントによる利用 |
|---------|-----------|-----------|
| `openspec list` | change/仕様を閲覧 | 構造化データには `--json` |
| `openspec show <item>` | 内容を読む | 解析用に `--json` |
| `openspec validate` | 問題を確認 | 一括検証には `--all --json` |
| `openspec status` | 成果物の進捗を確認 | 構造化状態には `--json` |
| `openspec instructions` | 次の手順を取得 | エージェント向け指示には `--json` |
| `openspec templates` | テンプレートのパスを確認 | パス解決には `--json` |
| `openspec schemas` | 利用可能なスキーマを一覧表示 | スキーマの検出には `--json`。登録済みルートの選択には `--store <id>` |
| `openspec store setup <id>` | ローカル store を作成・登録 | 構造化セットアップ出力には、明示的な入力と `--json` |
| `openspec store register <path>` | 既存 store を登録 | 構造化登録出力には `--json` |
| `openspec store unregister <id>` | ローカル store 登録を解除 | 構造化クリーンアップ出力には `--json` |
| `openspec store remove <id>` | 登録済みローカル store フォルダーを削除 | 非対話型削除には `--yes --json` |
| `openspec store list` | 登録済み store を閲覧 | 構造化登録情報には `--json` |
| `openspec store doctor` | ローカル store のセットアップを確認 | 構造化診断には `--json` |
| `openspec new change <id>` | リポジトリ内 change のひな型を作成 | `--json`。登録済み store を OpenSpec ルートに使う場合は `--store <id>` も指定 |
| `openspec workset create [name]` | 個人用作業ビューを構成 | 非対話型構成には `--member <path> --json` |
| `openspec workset list` | 保存済みワークセットを閲覧 | 構造化ビューには `--json` |
| `openspec workset remove <name>` | 保存済みビューを削除 | 非対話型削除には `--yes --json` |

---

## グローバルオプション

これらのオプションはすべてのコマンドで使えます。

| オプション | 説明 |
|--------|-------------|
| `--version`、`-V` | バージョン番号を表示 |
| `--no-color` | カラー出力を無効化 |
| `--help`、`-h` | コマンドのヘルプを表示 |

---

## セットアップコマンド

### `openspec init`

プロジェクト内で OpenSpec を初期化します。フォルダー構成を作成し、AI ツールとの統合を設定します。

既定ではグローバル設定を使用します。プロファイルは `core`、配布方式は `both`、ワークフローは `propose, explore, apply, update, sync, archive` です。

```
openspec init [path] [options]
```

新しいプロジェクトの `openspec/config.yaml` に言語の指示を追加するには、`--language <language>` を使います。
既存プロジェクトでは、OpenSpec がプロジェクト固有のガイダンスを上書きしないよう、設定ファイルの
`context` フィールドを編集してください。

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ（既定: 現在のディレクトリ） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--tools <list>` | AI ツールを非対話形式で設定。`all`、`none`、またはカンマ区切りのリストを指定 |
| `--language <language>` | 新しい設定を作成するとき、成果物をこの言語で記述 |
| `--force` | 確認せずに従来のファイルを自動整理 |
| `--profile <profile>` | 今回の init に限りグローバルプロファイルを上書き（`core` または `custom`） |
| `--no-animation` | アニメーションの代わりに静止画のウェルカム画面を表示 |
| `--copilot-cloud` | 確認せずに GitHub Copilot の[クラウドコーディングエージェント用ファイル](/ja-JP/supported-tools/#github-copilot-クラウドコーディングエージェント)をセットアップ |
| `--no-copilot-cloud` | GitHub Copilot のクラウドコーディングエージェント用ファイルを確認せずにスキップ |

`--profile custom` は、グローバル設定で現在選択されているワークフロー（`openspec config profile`）を使います。

`OPENSPEC_NO_ANIMATION` 環境変数が設定されている場合（空の値を含む）、`NO_COLOR` に空でない値が設定されている場合、または OS の視差効果を減らす設定が有効な場合（macOS の Reduce Motion、GNOME のアニメーション無効化）も、ウェルカムアニメーションは省略されます。

**対応ツール ID（`--tools`）** — `devin` の別名として `windsurf` も使用できます: `amazon-q`、`antigravity`、`auggie`、`bob`、`claude`、`cline`、`command-code`、`codeartsagent`、`codex`、`devin`、`forgecode`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`factory`、`gemini`、`github-copilot`、`hermes`、`iflow`、`junie`、`kilocode`、`kimi`、`kiro`、`lingma`、`minimax-code`、`vibe`、`oh-my-pi`、`opencode`、`pi`、`codeassistant`、`qoder`、`qwen`、`rovodev`、`roocode`、`trae`、`zed`、`zcode`、`agents`

> この一覧は `src/core/config.ts` の `AI_TOOLS` と一致します。ツールごとのスキルとコマンドのパスは[対応ツール](/ja-JP/supported-tools/)を参照してください。

**例:**

```bash
# 対話形式で初期化
openspec init

# 特定のディレクトリで初期化
openspec init ./my-project

# 非対話形式: Claude と Cursor を設定
openspec init --tools claude,cursor

# 非対話形式: グローバル MiniMax Code スキルを設定
openspec init --tools minimax-code

# 対応するすべてのツールを設定
openspec init --tools all

# 今回の実行に限りプロファイルを上書き
openspec init --profile core

# 確認を省略し、従来ファイルを自動整理
openspec init --force
```

**作成されるもの:**

```
openspec/
├── specs/              # 仕様（真実の情報源）
├── changes/            # 提案中の変更
└── config.yaml         # プロジェクト設定

.claude/skills/         # Claude Code スキル（claude を選択した場合）
.cursor/skills/         # Cursor スキル（cursor を選択した場合）
.cursor/commands/       # Cursor OPSX コマンド（配布方式にコマンドを含む場合）
.agents/skills/         # AGENTS.md 対応ツールの共有スキル（agents を選択した場合）
... (その他のツール設定)
```

---

### `openspec update`

CLI のアップグレード後に OpenSpec の指示ファイルを更新します。現在のグローバルプロファイル、選択されたワークフロー、配布方式に基づき、AI ツールの設定ファイルを再生成します。

```
openspec update [path] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `path` | いいえ | 対象ディレクトリ（既定: 現在のディレクトリ） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--force` | ファイルが最新でも強制的に更新 |

**例:**

```bash
# npm のアップグレード後に指示ファイルを更新
npm install -g @fission-ai/openspec@latest
openspec update
```

先にパッケージをアップグレードしてください。指示ファイルはインストール済み CLI が生成します。そのため古い CLI で `openspec update` を実行すると、新しいリリースのワークフローを追加せずに、すべて最新と報告することがあります。

この状態を分かりやすくするため、`openspec update` は npm レジストリに新しい CLI が公開されているか問い合わせます。使用中のものが古い場合、アップグレードを提案します。

```text
新しい OpenSpec CLI が利用可能です (v1.6.0 → v1.7.0)。
  実行元: /usr/local/lib/node_modules/@fission-ai/openspec
? 今すぐ v1.7.0 にアップグレードしますか？ (Y/n)
```

「はい」と答えると `npm install -g @fission-ai/openspec@latest` を実行し、新しい CLI で update を再実行するため、新しいワークフローが同じコマンドで反映されます。npm の終了コードを信用するのではなく、インストール済みのバイナリにバージョンを問い合わせてアップグレードを確認します。そのため PATH 上で別のインストールが優先されている場合も、成功したと偽らずに通知します。「いいえ」と答えると、コマンドを表示して現在の CLI で更新します。Ctrl-C でコマンドを停止します。

アップグレードの提案は、対話型ターミナルで、かつ npm がインストールを管理している場合に限って表示されます。これは `npm install -g` で実際に修正できる唯一のケースです。それ以外では、インストール方法に応じたコマンドを表示します。

| OpenSpec のインストール方法 | 表示内容 |
|---------------------------|--------------|
| グローバル npm インストール | 対話型ターミナルでは確認後にアップグレードを実行します。出力をパイプした場合は、代わりにコマンドを表示します。 |
| グローバル pnpm、bun、yarn、または volta インストール | 各マネージャー固有のコマンド: `pnpm add -g …@latest`、`bun add -g …@latest`、`yarn global add …@latest`、または `volta install …@latest` |
| プロジェクトの依存関係 | lockfile をパッケージマネージャーが管理するため、依存関係を更新するよう案内 |
| `npx` / `dlx` キャッシュ | `npx @fission-ai/openspec@latest update` — このコマンド自体が更新を行うため、追加の手順は不要 |
| git clone | 何もしない — 使用中のバージョンはブランチの内容に依存 |

何かが表示される場合、実行中の CLI が読み込まれたディレクトリも併記されます。アップグレード後も古い shim が `PATH` 上で優先される場合は、ここを確認してください。

レジストリへの問い合わせには、npm が `npm_config_registry` を設定している場合はその値を使い、それ以外では `https://registry.npmjs.org` を使います。`.npmrc` は読み込みません。ファイルの内容に外部リクエスト先を決めさせるのは避けるべきであり、プロジェクトの `.npmrc` はリポジトリとともに共有されるためです。プライベートミラーを使う場合は `npm_config_registry` を export するか、`OPENSPEC_NO_UPDATE_CHECK` を設定して確認を完全にスキップしてください。`CI` に明示的な無効値（`false`、`0`、`no`、`off`、空文字列）以外が設定されている場合、`NODE_ENV=test` の場合、または `OPENSPEC_NO_UPDATE_CHECK`（任意の値）、`DO_NOT_TRACK=1`、`OPENSPEC_TELEMETRY=0` のいずれかが設定されている場合は確認をスキップします。確認は更新前に実行され、最大1.5秒の遅延が発生する可能性があります。ネットワークがパケットを黙って破棄する場合でも、その時間を過ぎると諦め、レジストリに到達できない場合も何も表示しません。

**「最新」の判定方法:** スキルファイルには生成時のバージョンが記録されるため、OpenSpec はそれをインストール済み CLI と比較します。コマンドファイルにはバージョン情報がないため、スキルを使わずコマンドのみを使うツール（配布方式 `commands`）では、現在生成されるファイルと内容を比較します。手動編集は差分と見なされ、上書きされます。配布方式が `skills` または `both` の場合は記録されたバージョンのみを確認するため、バージョンが一致していれば手動編集したファイルはそのまま残ります。上書きするには `--force` を使ってください。いずれの場合も生成ファイルは OpenSpec の管理対象です。独自の指示は別の場所に保存してください。

---

## Stores（独立した OpenSpec リポジトリ）

> **ベータ版。** Stores と、その上に構築される機能（参照、作業コンテキスト、ワークセット）は新しい機能です。コマンド名、フラグ、ファイル形式、JSON 出力はリリース間で変更される可能性があります。問題の説明から始める手順は[Stores ガイド](/ja-JP/stores-beta/user-guide/)を参照してください。

store は、このマシンに登録した独立した OpenSpec リポジトリです。計画リポジトリや契約リポジトリなどが該当します。store を登録すると、どこからでも `--store <id>` を指定して通常のコマンド（`list`、`show`、`status`、`validate`、`new change`、`archive` など）を実行できます。

### `openspec store setup`

ローカル store を作成して登録します。ターミナルで引数なしに実行すると、
OpenSpec がセットアップを案内します。エージェントやスクリプトからは、
入力を明示して `--json` を使ってください。

```bash
openspec store setup [id] [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--path <path>` | store の保存先フォルダー（例: `~/openspec/<id>`） |
| `--remote <url>` | 正規のリモート URL を新しい store の `store.yaml` に記録 |
| `--init-git` | 初回コミットを含む Git リポジトリを初期化（既定） |
| `--no-init-git` | Git 操作をすべてスキップ（初期化も初回コミットも行わない） |
| `--json` | JSON を出力 |

非対話形式（`--json`、スクリプト、エージェント）では、store ID と `--path` の両方を指定する必要があります。対話型ターミナルでは、ユーザーが確認できて管理する場所（例: `~/openspec/<id>`）を編集可能な候補として表示し、保存先を尋ねます。OpenSpec 管理のデータディレクトリが既定値になることはありません。

例:

```bash
openspec store setup
openspec store setup team-context
openspec store setup team-context --path ~/openspec/team-context --no-init-git
openspec store setup team-context --path ~/openspec/team-context --no-init-git --json
```

### `openspec store register`

既存のローカル store フォルダーを登録します。Stores ベータ期間中は、change が作成される前、仕様が適用される前、または change がアーカイブされる前でもルートを登録できます。この場合、通常のコマンドが作成するまで `openspec/changes/`、`openspec/specs/`、`openspec/changes/archive/` が存在しない場合があります。`store: <id>` を宣言した設定のみのリポジトリは、別の store を指すポインターとして扱われます。そのポインターを削除しない限り、store ルートとして登録されません。

```bash
openspec store register [path] [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--id <id>` | store ID。既定では store のメタデータまたはフォルダー名を使用 |
| `--yes` | 正常な OpenSpec ルートに store 識別メタデータを作成することを確認 |
| `--json` | JSON を出力 |

### `openspec store unregister`

ファイルを削除せず、ローカルの store 登録を解除します。

```bash
openspec store unregister <id> [--json]
```

store を移動した場合、別の場所に clone した場合、またはこのマシン上で OpenSpec に表示する必要がなくなった場合に使います。

### `openspec store remove`

ローカルの store 登録を解除し、ローカルフォルダーを削除します。

```bash
openspec store remove <id> [--yes] [--json]
```

対話型ターミナルでは、`remove` は削除前にフォルダーの正確なパスを表示します。
エージェント、スクリプト、JSON モードでは、削除を確認するために `--yes` を指定する必要があります。
一致する store メタデータを含まないフォルダーは削除されません。

### `openspec store list`

ローカルに登録された store を一覧表示します。

```bash
openspec store list [--json]
openspec store ls [--json]
```

### `openspec store doctor`

ローカル store の登録状態、メタデータ、Git の有無を確認します。

```bash
openspec store doctor [id] [--json]
```

Doctor は診断専用です。store を変更せずに、ルートの不足、メタデータの不一致、ローカルレジストリの無効な状態を報告します。

### プロジェクトから store を参照する

プロジェクトリポジトリでは、作業で参照する store を `openspec/config.yaml` に宣言できます。

```yaml
schema: spec-driven
references:
  - team-context
```

以降、そのリポジトリの `openspec instructions` 出力（成果物ごとの指示と `apply` の両方、人間向け/JSON モードの両方）には、参照先 store の仕様索引が含まれます。索引には仕様 ID、各仕様の Purpose 節から取得した1行の概要、取得コマンド（`openspec show <spec-id> --type spec --store <id>`）が含まれます。索引は実行ごとに登録済みチェックアウトから生成され、仕様の内容が出力にコピーされることはありません。

参照は読み取り専用のコンテキストです。コマンドの実行場所は変わりません。作業はリポジトリ自身のルートで行い、参照先 store への書き込みには明示的な `--store` 指定が必要です。解決できない参照（例: このマシンに未登録の store）は、正確な修正方法を含む警告として索引に表示されますが、指示は引き続き生成されます。参照の状態は `openspec doctor` で一元的に確認できます。

### store の clone 元を記録する

store のコミット済み識別ファイルに正規の clone 元を記録できます。これにより、導入時に「store を登録してください」で行き詰まることがありません。

```bash
openspec store setup team-context --path ~/openspec/team-context \
  --remote git@github.com:acme/team-context.git
```

リモートは初回コミットで `.openspec-store/store.yaml` に記録されるため、すべての clone が取得元を認識します。既存 store の場合は、`store.yaml` を手動編集してコミットしてください。`store doctor` は記録されたリモート（およびチェックアウトで確認した Git origin）を表示し、setup/register の共有ガイダンスでも示されます。また register は、チェックアウトの origin をマシンローカルのレジストリに記録します。

参照宣言には clone 元も含められます。これにより、store をまだ持っていないチームメンバーにも、貼り付けて実行できる完全な修正方法（`git clone <remote> <path> && openspec store register <path> --id <id>`）が表示されます。

```yaml
references:
  - { id: team-context, remote: "git@github.com:acme/team-context.git" }
```

リモートを記録しても同期は行われません。OpenSpec が独自に clone、pull、push することはありません。

### 既定の store を宣言する

計画を完全に外部化したリポジトリ（ローカルに `openspec/specs/` や `openspec/changes/` がない場合）では、各コマンドに `--store` を指定する代わりに、store を一度だけ宣言できます。

```yaml
# openspec/config.yaml（openspec/ 以下に置く唯一のファイル）
store: team-context
```

これで通常のコマンドは宣言された store に自動的に解決されます。ルートバナーと JSON の `root` ブロックには store ID とともに `source: "declared"` が表示され、出力されるヒントには引き続き `--store <id>` が含まれます。この宣言はフォールバックであり、上書きではありません。明示的な `--store` が常に優先され、実際の計画フォルダーがあるディレクトリではポインターが無視されます（警告あり）。ポインターリポジトリをローカル OpenSpec ルートに変換するには、`store:` 行を削除して `openspec init` を実行します。宣言が残っている間、init はひな型を作成しません。

マシン単位で全リポジトリに適用するには、`openspec config set defaultStore <id>` を使います（「設定」を参照）。`--store`、ローカルルート、プロジェクトポインターのいずれでも解決できない場合にのみ参照されます。この場合、ルートバナーと JSON の `root` ブロックには `source: "global_default"` と表示されます。

## Doctor（関係状態の健全性）

読み取り専用で一元的に、OpenSpec ルートが正常か、参照先の store がこのマシンで利用可能かを確認します。

```bash
openspec doctor [--store <id>] [--json]
```

レポートでは、ルートの状態、store メタデータの状態（記録されたリモートとチェックアウトの origin の不一致や、最後に取得した upstream 追跡参照より store のチェックアウトが古い場合の注記を含む）、参照先の状態（instructions に表示される診断と同じ。未解決の参照には clone による修正方法を含む）を分けて表示します。重要度に関係なく健全性の指摘は終了コード0になります。エージェントは `status` 配列を読み取ります。終了コード1になるのは、ルートがない、未知の store などのコマンド失敗だけです。Doctor が clone、同期、修復を行うことはありません。健全性ではなく、まとめられた作業セットを取得するには `openspec context` を使います。

## 作業コンテキスト（まとめられた作業セット）

OpenSpec の宣言を通してこの作業に関係する情報、つまり OpenSpec ルートと参照先 store を1つの作業セットにまとめます。

```bash
openspec context [--store <id>] [--json] [--code-workspace <path> [--force]]
```

JSON の概要はエージェントから利用できます（利用可能な参照先 store には取得方法が、未解決のメンバーには doctor と同じ修正方法が含まれます）。`--code-workspace` を指定すると、ルートと利用可能な参照先 store（`ref:<id>` フォルダー）を含む VS Code ワークスペースファイルも書き込みます。これがこのコマンドによる唯一の書き込みです。ファイルが存在する場合、`--force` なしでは拒否されます。利用できないメンバーは報告され、推測されることはありません。

「作業コンテキスト」はまとめられた作業セットです。一方、`openspec/config.yaml` の `context:` フィールドは指示に注入されるプロジェクトの背景情報です。両者は別のものです。`openspec doctor` は作業セットが正常かを答え、`openspec context` は作業セットの内容を答えます。

## 個人用ワークセット

> **ベータ版。** ワークセットは新しいベータ機能です。コマンド、フラグ、ファイル形式はリリース間で変更される可能性があります。手順は[Stores ガイド](/ja-JP/stores-beta/user-guide/#ワークセット-一緒に作業するフォルダーを再び開く)を参照してください。

ワークセットは、一緒に作業するフォルダー（計画ルートと必要な他のフォルダー）をまとめた、個人用の名前付きビューです。自分のマシンに保存され、ツールから名前を使って再度開けます。完全にローカルで、コミットも共有も宣言からの生成も行われません。ワークセットを削除してもメンバーフォルダーには触れません。

```bash
openspec workset create [name] [--member <path> | --member <name>=<path>]... [--tool <id>] [--json]
openspec workset list [--json]
openspec workset open <name> [--tool <id>]
openspec workset remove <name> [--yes] [--json]
```

`create` は簡単なガイド付きフローを開始します（または非対話形式で `--member` フラグを受け取ります。最初のメンバーがプライマリになり、セッションはそこから始まります）。`open` は選択されたツールを起動します。エディター（VS Code、Cursor）はすべてのメンバーを含むウィンドウを開いて制御を戻します。CLI エージェント（Claude Code、codex）は、すべてのメンバーをアタッチしたセッションとしてこのターミナルを引き継ぎます。プロンプトは事前入力されず、終了すると戻ります。open 時に存在しないメンバーフォルダーは注記付きでスキップされ、残りのフォルダーが開かれます。保存済みのツール設定は `--tool` で起動ごとに上書きできます。

新しいツールの対応はコードではなく設定で行います。ツールの起動方式は `workspace-file`（生成された `.code-workspace` で起動）または `attach-dirs`（メンバーごとにアタッチフラグを指定）のいずれかです。グローバル `config.json`（`openspec config edit` で開く）の `openers` キーで、ツールを追加したり、組み込み設定をフィールドごとに調整したりできます。

```json
{
  "openers": {
    "zed": { "style": "workspace-file" },
    "claude": { "attach_flag": "--dir" }
  }
}
```

ワークセットの状態はすべて、グローバルデータディレクトリの `worksets/` フォルダーに保存されます（保存済みビューと、open のたびに再生成される `<name>.code-workspace` ファイル）。このフォルダーを削除すると、痕跡はすべて削除されます。

---

## 閲覧コマンド

### `openspec list`

プロジェクト内の change または仕様を一覧表示します。

```
openspec list [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--specs` | change の代わりに仕様を一覧表示 |
| `--changes` | change を一覧表示（既定） |
| `--sort <order>` | `recent`（既定）または `name` で並べ替え |
| `--json` | JSON 形式で出力 |

**例:**

```bash
# 作業中の change をすべて一覧表示
openspec list

# 仕様をすべて一覧表示
openspec list --specs

# スクリプト向けに JSON 出力
openspec list --json
```

**出力（テキスト）:**

```
変更:
  add-dark-mode     タスクなし     たった今
```

---

### `openspec view`

仕様や change を確認するための対話型ダッシュボードを表示します。

```
openspec view
```

プロジェクトの仕様や change を操作するためのターミナルインターフェイスを開きます。

---

### `openspec show`

change または仕様の詳細を表示します。

```
openspec show [item-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | change または仕様の名前（省略すると入力を求める） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--type <type>` | 種類を指定: `change` または `spec`（一意に判断できる場合は自動検出） |
| `--json` | JSON 形式で出力 |
| `--no-interactive` | プロンプトを無効化 |

**change 固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--deltas-only` | 差分仕様のみを表示（JSON モード） |

**仕様固有のオプション:**

| オプション | 説明 |
|--------|-------------|
| `--requirements` | シナリオを除き、要件のみを表示（JSON モード） |
| `--no-scenarios` | シナリオの内容を除外（JSON モード） |
| `-r, --requirement <id>` | 1始まりのインデックスで特定の要件を表示（JSON モード） |

**例:**

```bash
# 対話形式で選択
openspec show

# 特定の change を表示
openspec show add-dark-mode

# 特定の仕様を表示
openspec show auth --type spec

# 解析用の JSON 出力
openspec show add-dark-mode --json
```

---

## 検証コマンド

### `openspec validate`

change と仕様の構造上の問題を検証し、change 内の MODIFIED 要件を、置き換え対象となるメイン仕様と照合します。

```
openspec validate [item-name] [options]
```

仕様の差分が0件の change は、`.openspec.yaml` に `skip_specs: true` が宣言されていない限り検証に失敗します（動作を変えないリファクタリング、ツール、ドキュメント作業の場合。[レシピ5](/ja-JP/examples/#レシピ5-動作を変えないリファクタリング)を参照）。

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `item-name` | いいえ | 検証する項目（省略すると入力を求める） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべての change と仕様を検証 |
| `--changes` | すべての change を検証 |
| `--specs` | すべての仕様を検証 |
| `--archived` | アーカイブ済み change のすべてのタスクが完了しているか検証（pre-commit lint 用） |
| `--type <type>` | 名前が曖昧な場合に種類を指定: `change` または `spec` |
| `--strict` | 厳格な検証モードを有効化 |
| `--json` | JSON 形式で出力 |
| `--concurrency <n>` | 並列検証の最大数（既定: 6、または `OPENSPEC_CONCURRENCY` 環境変数） |
| `--no-interactive` | プロンプトを無効化 |

`--archived` は独立した対象範囲です。仕様の差分は検証しません（アーカイブ時にすでに適用済みのため）。`changes/archive/` 以下のすべての change について、`tasks.md` のチェックボックスがすべてオンか確認します。未チェックが1つでもあると、ゼロ以外の終了コードで終了します。これにより未完了の作業を含む change がアーカイブされたことを検出できます。pre-commit フックに便利です。

**例:**

```bash
# 対話形式で検証
openspec validate

# 特定の change を検証
openspec validate add-dark-mode

# すべての change を検証
openspec validate --changes

# すべてを JSON 出力で検証（CI/スクリプト向け）
openspec validate --all --json

# 並列度を上げて厳格に検証
openspec validate --all --strict --concurrency 12

# アーカイブ済み change に未チェックのタスクがあれば失敗
openspec validate --archived
```

**出力（テキスト）:**

```
add-dark-mode を検証しています...
  ✓ proposal.md は有効
  ✓ specs/ui/spec.md は有効
  ⚠ design.md: "Technical Approach" セクションがありません

警告が1件見つかりました
```

**出力（JSON）:**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: 'Technical Approach' セクションがありません"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## ライフサイクルコマンド

### `openspec archive`

完了した change をアーカイブし、差分仕様をメイン仕様にマージします。

```
openspec archive [change-name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする change（省略すると入力を求める。プロンプトに応答できない場合は必須） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `-y, --yes` | 確認プロンプトを省略。AI エージェント、CI ジョブ、stdin が閉じられた実行など、応答できるものがない場合に必須 |
| `--skip-specs` | 1回のアーカイブで仕様更新をスキップ。仕様の差分が恒久的にない change では、代わりに `.openspec.yaml` に `skip_specs: true` を宣言すると、フラグなしでアーカイブ可能 |
| `--no-validate` | 検証をスキップ（確認が必要）。機能の廃止も無効化され、検証結果がないため何も廃止されない |

**例:**

```bash
# 対話形式でアーカイブ（対象 change を尋ねてから確認）
openspec archive

# 特定の change をアーカイブ
openspec archive add-dark-mode

# プロンプトなしでアーカイブ（エージェント、CI、スクリプト）
openspec archive add-dark-mode --yes

# 仕様に影響しないツール関連の change をアーカイブ
openspec archive update-ci-config --skip-specs
```

**機能を廃止する:** change のメタデータに廃止マーカーを追加します。

```yaml
# openspec/changes/retire-legacy/.openspec.yaml
schema: spec-driven
retire_capabilities: true
```

その後、通常どおり change をアーカイブします。

```bash
openspec archive retire-legacy --yes
```

change によって機能の最後の要件が削除されると、OpenSpec は有効な `spec.md` を削除します。
同じ change 内にある他の機能の差分は、引き続きメイン仕様を更新します。
マーカーがない場合、アーカイブはファイルを変更する前に停止し、マーカーを追加するよう通知します。

**動作:**

1. change を検証（`--no-validate` を指定しない場合）
2. 確認を求める（`--yes` を指定しない場合）
3. メイン仕様を変更する前にアーカイブ先を確保
4. 作業中の差分仕様を検証し、`openspec/specs/` にマージ。change が機能の最後の要件を削除する場合、その `.openspec.yaml` に `schema:` とともに `retire_capabilities: true` が宣言されている場合に限り、機能を廃止して仕様ファイルを削除
5. change フォルダーを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動
6. アーカイブが完全に確保される前に仕様の変更または最終移動が失敗した場合、仕様を復元し、change を作業中のパスに残すか戻す
7. 検証済みのフォールバックコピーが完了した後、ステージング元のクリーンアップに失敗した場合、復旧できるよう完全なアーカイブと確定済みの仕様を保持

**ターミナル以外での実行:** AI エージェント、CI ジョブ、stdin が閉じられた実行などでは手順2に回答できません。そのため archive は何も変更する前に停止して終了コード1で終了し、再実行するコマンド（指定した他のフラグも含む `openspec archive <name> --yes`）を示します。確認のやり取りを省くには、最初から `--yes`（および change 名）を指定してください。

---

## ワークフローコマンド

これらのコマンドは成果物駆動の OPSX ワークフローを支援します。人間が進捗を確認する場合にも、エージェントが次の手順を判断する場合にも便利です。

### `openspec new change`

解決済み OpenSpec ルートに change ディレクトリと任意のコミット対象メタデータを作成します。

```bash
openspec new change <name> [options]
```

change 名には小文字のケバブケースを使います。小文字、数字、単一のハイフンを使用できます。
空白、アンダースコア、大文字、連続するハイフン、先頭/末尾のハイフンは使用できません。
先頭に数字を付けることは可能です。たとえば `100-add-feature` や `00001-add-auth` のように、
change の順序付けや段階分けに使えます。

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | `README.md` に追加する説明 |
| `--goal <text>` | change とともに保存する任意の目標メタデータ |
| `--schema <name>` | 使用するワークフロースキーマ |
| `--store <id>` | OpenSpec ルートとして使う store ID（store は登録済みの独立した OpenSpec リポジトリ） |
| `--json` | JSON を出力 |

例:

```bash
openspec new change add-billing-api
openspec new change add-billing-api --store team-context --json
```

### `openspec status`

change の成果物の完了状態を表示します。

```
openspec status [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | change 名（省略すると入力を求める） |
| `--schema <name>` | スキーマを上書き（change の設定から自動検出） |
| `--json` | JSON を出力 |

**例:**

```bash
# 対話形式で状態を確認
openspec status

# 特定の change の状態
openspec status --change add-dark-mode

# エージェント向け JSON
openspec status --change add-dark-mode --json
```

**出力（テキスト）:**

```
change: add-dark-mode
スキーマ: spec-driven
進捗: 4成果物中2件完了

[x] proposal
[x] specs
[ ] design
[-] tasks (blocked by: design)
```

`skip_specs: true` を宣言した change では、specs 段階は `[~] specs (スキップ: change が skip_specs を宣言)` と表示され、進捗数には含まれません。

**Output (JSON):**

```json
{
  "changeName": "add-dark-mode",
  "schemaName": "spec-driven",
  "isPlanningComplete": false,
  "isComplete": false,
  "applyRequires": ["tasks"],
  "artifacts": [
    {"id": "proposal", "outputPath": "proposal.md", "status": "done", "requires": []},
    {"id": "specs", "outputPath": "specs/**/*.md", "status": "done", "requires": ["proposal"]},
    {"id": "design", "outputPath": "design.md", "status": "ready", "requires": ["proposal"]},
    {"id": "tasks", "outputPath": "tasks.md", "status": "blocked", "requires": ["specs", "design"], "missingDeps": ["design"]}
  ]
}
```

`isPlanningComplete` は、スキップされていない計画成果物がすべて存在するかを示します。
スキップされた成果物は、作成されなくても充足したものと見なされます。実装タスクの完了状態を
示すものではありません。`isComplete` は互換性のため同じ値を返す別名として維持されています。

成果物は依存関係の順に表示されます。ある成果物の依存先が、その成果物より後に表示されることは
ありません。同時に作成可能になる成果物（spec-driven では `specs` と `design` のどちらも
`proposal` のみが必要）は、アルファベット順ではなくスキーマで宣言された順序になります。
そのため、最初の `ready` 項目が次に書き込む成果物です。

---

### `openspec instructions`

成果物の作成またはタスクの適用に関する詳細な指示を取得します。AI エージェントが次に作成するものを判断するために使います。

```
openspec instructions [artifact] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `artifact` | いいえ | 成果物 ID、またはワークフロー入力用サーフェス: `apply` または `archive` |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--change <id>` | change 名（非対話モードでは必須） |
| `--schema <name>` | スキーマの上書き |
| `--json` | JSON を出力 |

**特別なケース:** タスクの実装指示を取得するには `apply` を使います。有効な change の現在の
アーカイブ入力（`context` と `operationGuidance`）を読み取り専用で取得するには `archive` を
使います。アーカイブや変更操作は行いません。

**例:**

```bash
# 次の成果物の指示を取得
openspec instructions --change add-dark-mode

# 特定の成果物の指示を取得
openspec instructions design --change add-dark-mode

# apply/実装の指示を取得
openspec instructions apply --change add-dark-mode

# アーカイブせずに現在の archive 操作入力を取得
openspec instructions archive --change add-dark-mode --json

# エージェント用の JSON
openspec instructions design --change add-dark-mode --json
```

**出力に含まれる内容:**

- 成果物のテンプレート内容
- 設定ファイルからのプロジェクトコンテキスト
- 依存成果物の内容
- 設定ファイルからの成果物ごとのルール
- `apply`/`archive` に対する現在のプロジェクトコンテキストと対応する操作ガイダンス

操作入力は呼び出しごとに、解決されたリポジトリまたは選択された store から読み込まれます。
プロジェクトコンテキストはプロンプトレベルで必須の入力です。エージェントはこれを読み、
関連するプロジェクト情報、規約、制約を適用します。操作ガイダンスは任意の追加的な助言です。
エージェントは各項目を検討し、組み込みワークフローに適用可能で矛盾しない項目のみを使用します。
どちらのフィールドも明示的なユーザー選択、CLI が制御する状態、組み込み指示、成果物ルールとは
別に保持されます。コンテキストの競合は報告され、矛盾する、または適用できないガイダンスは
使用せず、その理由が説明されます。これらは生成されたエージェントに対する動作上の契約であり、
CLI が強制できる検査ではありません。`instructions archive` は選択した change、任意の入力、
ルートメタデータのみを返し、静的な archive ワークフローは含みません。

`skip_specs: true` によってスキップされた成果物は、出力に警告のみを表示します（JSON では
`skipped`/`warning` フィールドを追加）。その成果物を作成してはいけません。

---

### `openspec templates`

スキーマ内のすべての成果物について、解決されたテンプレートのパスを表示します。

```
openspec templates [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--schema <name>` | 確認するスキーマ（既定: `spec-driven`） |
| `--json` | JSON を出力 |

**例:**

```bash
# 既定スキーマのテンプレートパスを表示
openspec templates

# カスタムスキーマのテンプレートを表示
openspec templates --schema my-workflow

# プログラム利用向けの JSON
openspec templates --json
```

**出力（テキスト）:**

```
スキーマ: spec-driven

テンプレート:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

利用可能なワークフロースキーマを、説明および成果物の流れとともに一覧表示します。

```
openspec schemas [options]
```

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--json` | JSON を出力 |
| `--store <id>` | 登録済み store を OpenSpec ルートとして使用 |

**例:**

```bash
openspec schemas
```

**出力:**

```
利用可能なスキーマ:

  spec-driven (package)
    既定の仕様駆動開発ワークフロー
    流れ: proposal → specs → design → tasks

  my-custom (project)
    このプロジェクト向けのカスタムワークフロー
    流れ: research → proposal → tasks
```

---

## スキーマコマンド

カスタムワークフロースキーマを作成・管理するコマンドです。

### `openspec schema init`

プロジェクトローカルの新しいスキーマを作成します。

```
openspec schema init <name> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | はい | スキーマ名（ケバブケース） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--description <text>` | スキーマの説明 |
| `--artifacts <list>` | 成果物 ID のカンマ区切りリスト（既定: `proposal,specs,design,tasks`） |
| `--default` | プロジェクトの既定スキーマとして設定 |
| `--no-default` | 既定値として設定するか確認しない |
| `--force` | 既存スキーマを上書き |
| `--json` | JSON を出力 |

**例:**

```bash
# 対話形式でスキーマを作成
openspec schema init research-first

# 特定の成果物を指定して非対話形式で作成
openspec schema init rapid \
  --description "高速な反復ワークフロー" \
  --artifacts "proposal,tasks" \
  --default
```

**作成されるもの:**

```
openspec/schemas/<name>/
├── schema.yaml           # スキーマ定義
└── templates/
    ├── proposal.md       # 各成果物のテンプレート
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

カスタマイズするため、既存スキーマをプロジェクトにコピーします。

```
openspec schema fork <source> [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `source` | はい | コピーするスキーマ |
| `name` | いいえ | 新しいスキーマ名（既定: `<source>-custom`） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--force` | 既存のコピー先を上書き |
| `--json` | JSON を出力 |

**例:**

```bash
# 組み込みの spec-driven スキーマをフォーク
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

スキーマの構成とテンプレートを検証します。

```
openspec schema validate [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | 検証するスキーマ（省略するとすべてを検証） |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--verbose` | 詳細な検証手順を表示 |
| `--json` | JSON を出力 |

**例:**

```bash
# 特定のスキーマを検証
openspec schema validate my-workflow

# すべてのスキーマを検証
openspec schema validate
```

---

### `openspec schema which`

スキーマの解決元を表示します（優先順位のデバッグに便利です）。

```
openspec schema which [name] [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `name` | いいえ | スキーマ名 |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--all` | すべてのスキーマを解決元とともに一覧表示 |
| `--json` | JSON を出力 |

**例:**

```bash
# スキーマの取得元を確認
openspec schema which spec-driven
```

**出力:**

```
spec-driven の解決元: package
  ソース: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**スキーマの優先順位:**

1. プロジェクト: `openspec/schemas/<name>/`
2. ユーザー: `~/.local/share/openspec/schemas/<name>/`
3. パッケージ: 組み込みスキーマ

---

## 設定コマンド

### `openspec config`

OpenSpec のグローバル設定を表示・変更します。

```
openspec config <subcommand> [options]
```

**サブコマンド:**

| サブコマンド | 説明 |
|------------|-------------|
| `path` | 設定ファイルの場所を表示 |
| `list` | 現在の設定をすべて表示 |
| `get <key>` | 指定した値を取得 |
| `set <key> <value>` | 値を設定 |
| `unset <key>` | キーを削除 |
| `reset` | 既定値に戻す |
| `edit` | `$EDITOR` で開く |
| `profile [preset]` | 対話形式またはプリセットでワークフロープロファイルを設定 |

**例:**

```bash
# 設定ファイルのパスを表示
openspec config path

# すべての設定を一覧表示
openspec config list

# 指定した値を取得
openspec config get telemetry.enabled

# 値を設定（匿名の利用状況テレメトリを無効化）
openspec config set telemetry.enabled false

# 文字列値を明示的に設定
openspec config set user.name "My Name" --string

# カスタム設定を削除
openspec config unset user.name

# マシン全体の既定 store を設定（--store、ローカルルート、
# プロジェクトの store: ポインターのいずれも解決できない場合のフォールバック）
openspec config set defaultStore team-plans

# すべての設定をリセット
openspec config reset --all --yes

# エディターで設定を編集
openspec config edit

# アクション形式のウィザードでプロファイルを設定
openspec config profile

# 簡易プリセット: ワークフローを core に切り替え（配布方式は維持）
openspec config profile core
```

**テレメトリのオプトアウト:** `telemetry.enabled` が未設定の場合、既定で有効です（オプトアウト方式）。
匿名利用統計と `openspec update` のバージョン確認を無効にするには `false` を設定します。
環境変数は設定より優先されます。`OPENSPEC_TELEMETRY=0`、`DO_NOT_TRACK=1`、
または truthy な `CI` 値（例: `true`/`1`/`yes）が設定されていると、設定値に関係なくテレメトリは無効になります。

`openspec config profile` は現在の状態のサマリーを表示し、続いて次の選択肢を提示します。
- 配布方式とワークフローを変更
- 配布方式のみ変更
- ワークフローのみ変更
- 現在の設定を維持（終了）

現在の設定を維持した場合、変更は書き込まれず、更新プロンプトも表示されません。
設定に変更がなくても、現在のプロジェクトファイルがグローバルプロファイル/配布方式と同期していない場合、OpenSpec は警告を表示し `openspec update` を提案します。
`Ctrl+C` を押すとスタックトレースなしで正常にキャンセルされ、終了コード `130` で終了します。
ワークフローのチェックリストでは、`[x]` はグローバル設定で選択されていることを示します。選択内容をプロジェクトファイルに適用するには `openspec update` を実行するか、プロジェクト内で確認されたときに `Apply changes to this project now?` を選択してください。

**対話形式の例:**

```bash
# 配布方式のみを更新
openspec config profile
# 選択: 配布方式のみ変更
# 配布方式を選択: スキルのみ

# ワークフローのみを更新
openspec config profile
# 選択: ワークフローのみ変更
# チェックリストでワークフローを切り替え、確認
```

---

## ユーティリティコマンド

### `openspec feedback`

OpenSpec に関するフィードバックを送信します。GitHub Issue を作成します。

```
openspec feedback <message> [options]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `message` | はい | フィードバックの概要。長文の場合は Issue のタイトルで短縮し、本文では保持 |

**オプション:**

| オプション | 説明 |
|--------|-------------|
| `--body <text>` | 概要の後に含める追加の詳細 |

**必要条件:** GitHub CLI（`gh`）がインストールされ、認証済みであること。

**例:**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

OpenSpec CLI のシェル補完を管理します。

```
openspec completion <subcommand> [shell]
```

**サブコマンド:**

| サブコマンド | 説明 |
|------------|-------------|
| `generate [shell]` | 補完スクリプトを stdout に出力 |
| `install [shell]` | 使用するシェルの補完をインストール |
| `uninstall [shell]` | インストール済み補完を削除 |

**対応シェル:** `bash`、`zsh`、`fish`、`powershell`

**例:**

```bash
# 補完をインストール（シェルを自動検出）
openspec completion install

# 特定のシェル用にインストール
openspec completion install zsh

# 手動インストール用スクリプトを生成（bash）
openspec completion generate bash > ~/.bash_completion.d/openspec

# アンインストール
openspec completion uninstall
```

**Windows（PowerShell）:** 現在の PowerShell ホストに補完をインストールします。

```powershell
$env:PROFILE = $PROFILE
openspec completion install powershell
. $PROFILE
```

`$env:PROFILE` は、このセッションで設定するプロファイルを OpenSpec に伝えます。
インストーラーは必要なプロファイルディレクトリを作成し、`OpenSpecCompletion.ps1` を読み込む
管理ブロックを追加します。プロファイルを再読み込みすると、補完がすぐに有効になります。

現在のホストからアンインストールするには、次を実行します。

```powershell
$env:PROFILE = $PROFILE
openspec completion uninstall powershell
```

アンインストール後、現在のセッションから補完を消去するため PowerShell を再起動してください。

補完はオプトイン方式です。対話型ターミナルでコマンドを初めて実行したときに限り、CLI は stderr に一度だけ案内を表示します。すでに補完がインストールされている場合は表示しません。案内を完全に抑制するには `OPENSPEC_NO_COMPLETIONS=1` を設定してください。

---

## 終了コード

| コード | 意味 |
|------|---------|
| `0` | 成功 |
| `1` | エラー（検証失敗、ファイル不足など） |

---

## 環境変数

| 変数 | 説明 |
|----------|-------------|
| `OPENSPEC_TELEMETRY` | `0` を設定するとテレメトリと `openspec update` のバージョン確認を無効化（グローバル設定の `telemetry.enabled` より優先） |
| `DO_NOT_TRACK` | `1` を設定するとテレメトリと `openspec update` のバージョン確認を無効化（標準 DNT 信号。設定より優先） |
| `OPENSPEC_CONCURRENCY` | 一括検証の既定並列度（既定: 6） |
| `EDITOR` または `VISUAL` | `openspec config edit` で使うエディター |
| `NO_COLOR` | 設定するとカラー出力を無効化 |
| `OPENSPEC_NO_ANIMATION` | 設定すると `openspec init` のウェルカムアニメーションを無効化 |
| `OPENSPEC_NO_COMPLETIONS` | `1` を設定するとシェル補完に関する一度限りの案内を抑制 |
| `OPENSPEC_NO_UPDATE_CHECK` | 設定すると公開済み CLI の新バージョン確認を無効化（空を含む任意の値）。`CI` が設定されている場合（`false`/`0`/`no`/`off` を除く）または `NODE_ENV=test` の場合もスキップ |
| `npm_config_registry` | `openspec update` のバージョン確認に使うレジストリ。`http(s)` URL でなければ `https://registry.npmjs.org` にフォールバック。`.npmrc` ファイルは読み込まない |

---

## 関連ドキュメント

- [コマンド](/ja-JP/commands/) — AI スラッシュコマンド（`/opsx:propose`、`/opsx:apply` など）
- [ワークフロー](/ja-JP/workflows/) — よくあるパターンと各コマンドを使うタイミング
- [カスタマイズ](/ja-JP/customization/) — カスタムスキーマとテンプレートを作成
- [はじめに](/ja-JP/getting-started/) — 初回セットアップガイド
