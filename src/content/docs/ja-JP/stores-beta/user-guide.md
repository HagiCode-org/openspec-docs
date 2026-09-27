---
title: "Stores: 専用リポジトリで計画する"
---

> **ベータ版。** Stores、参照、作業コンテキスト、ワークセットは
> 新しい機能です。コマンド名、フラグ、ファイル形式、JSON 出力は
> リリース間で変更される可能性があります。以下の手順はすべて
> 現行ビルドで確認していますが、アップグレード後にこのガイドを読み直してください。

## 解決する問題

通常、OpenSpec は1つのコードリポジトリ内にあります。コードと並ぶ `openspec/` フォルダーに、そのリポジトリの仕様と change を格納します。

計画が複数リポジトリにまたがると、この方法では対応できなくなります。

- 作業が複数のリポジトリにまたがる — 1つの機能が API サーバー、Web アプリ、共有ライブラリに関係する場合、計画はどの `openspec/` フォルダーに置けばよいでしょうか？
- チームがコード作成前に計画したり、*この* リポジトリのコードにはならない作業を計画したりする。
- 要件を1つのチームが所有し、他のチームが利用する。Wiki の内容は次第に古くなり、コーディングエージェントはそもそも読めない。

**store** が解決策です。計画管理だけを目的とする独立したリポジトリです。
既知の `openspec/` 構成（仕様と change）に、小さな識別ファイルが加わります。
マシン上で名前を付けて一度登録すれば、どこからでも通常の OpenSpec コマンドで利用できます。

## 構成

```
            team-plans  (store: 専用リポジトリで計画を管理)
            ├── .openspec-store/store.yaml     識別情報: "これは team-plans"
            └── openspec/
                ├── specs/      現在の仕様
                └── changes/    進行中の変更
                      ▲
                      │ 各マシンで名前を付けて登録;
                      │ 他のリポジトリと同様に push/clone して共有
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (コードリポジトリ) (コードリポジトリ) (コードリポジトリ)
```

次の2つの原則でシンプルに保てます。

1. **store は単なる git リポジトリです。** 自分でコミット、push、pull、レビューします。OpenSpec が独自に clone、同期、push を行うことはありません。
2. **仕組みではなく宣言です。** リポジトリは store との関係を *宣言* できます（後述）。宣言によって OpenSpec が案内する内容は変わりますが、コマンドの実行場所は変わりません。

## 5分で最初の store を作る

2つのコマンドで、準備ゼロの状態から store を対象にした change を作成できます。

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store の準備完了: team-plans
場所: /Users/you/openspec/team-plans
OpenSpec ルート: ready
レジストリ: 登録済み

次に、この store に対して通常の OpenSpec コマンドを実行します。例:
  openspec new change <change-id> --store team-plans
他の Git リポジトリと同様に、コミットして push することで store を共有できます。
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
change 'add-login' を作成しました: /Users/you/openspec/team-plans/openspec/changes/add-login/
スキーマ: spec-driven
次: openspec status --change add-login --store team-plans
```

これが全体像です。以降のライフサイクルは従来どおりです。
各コマンドに `--store team-plans` を付けて `status`、`instructions`、`validate`、`archive` を実行します。
表示されるヒントには必要なフラグも含まれます。`Using OpenSpec root:` の行で、コマンドの実行対象を常に確認できます。

## 事例: 1つのチーム、1つの計画リポジトリ

チームは仕様と change をコードリポジトリに分散させず、`team-plans` にまとめて管理します。

**初日（セットアップ担当者）:**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote` を指定すると、初回コミット時に clone URL が store の識別ファイル（`.openspec-store/store.yaml`）に記録されます。以降の clone では取得元が自動的に分かるため、未登録のメンバー向けにヘルスチェックとエラーメッセージが貼り付けて使える完全な修正コマンドを表示できます。

**各チームメンバー（マシンごとに1回）:**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

以降は、全員が名前を使って同じ計画リポジトリで作業できます。

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**意図的に git で作業を共有します。** 作成した change は、コードと同様、コミットして push するまでは自分のチェックアウトにしか存在しません。store は通常のリポジトリなので、計画もブランチ、プルリクエスト、レビューの恩恵を受けます。

**チームのコードリポジトリを接続する。** 計画を完全に外部化したコードリポジトリでは、`openspec/config.yaml` に1行だけ記述します。

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

これで `web-app` 内で実行するすべての OpenSpec コマンドは、フラグなしで `team-plans` を対象にします。

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

このポインターはフォールバックであり、上書き設定ではありません。明示的に指定した `--store` が常に優先されます。また、リポジトリ内に独自の計画フォルダーを作成すると、そちらが優先されます（古いポインターを削除するよう警告が出ます）。

**マシン上のすべてのリポジトリに1つの既定値を設定する。** 多くのコードリポジトリで同じ store を使う場合は、各リポジトリに `store:` の行を追加する代わりに、グローバルに一度だけ設定します。

```bash
openspec config set defaultStore team-plans
```

これで計画ルートの外で実行され、`--store` とプロジェクトポインターのどちらも指定されていないコマンドは `team-plans` に解決されます。優先順位の最下位にあるため、`--store`、ローカルルート、プロジェクトの `store:` ポインターがあれば、引き続きそちらが優先されます。ルートバナーと JSON の `root` ブロックには store ID とともに `source: "global_default"` が表示されるため、マシン全体の既定値とリポジトリ固有のポインターを区別できます。`openspec config unset defaultStore` で解除できます。ID が未登録の場合、コマンドはエラーになり、登録または古い既定値の解除を案内します。

## 例: 1つの機能、2つのコンポーネントリポジトリ

`add-checkout-promo` が `checkout-api` と `checkout-web` の両方を変更するとします。チームは製品の共通契約を1つにまとめたい一方、各コードリポジトリには独自の実装タスク、ブランチ、レビューが必要です。

2つのレイヤーを使います。

1. 共通の動作を `team-plans` に置く。
2. 各コンポーネントリポジトリに実装計画を置き、読み取り専用の上流コンテキストとして store を参照する。

まず store で共通契約を計画します。

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

提案と仕様には、コンポーネント間の境界にある動作を記述します。たとえば、サービスが返すプロモーションフィールドや、フロントエンドで対象外のチェックアウトをどのように扱うかです。他のブランチやプルリクエストと同じように、store リポジトリでこの change をレビューします。

### 計画で参照できるコンテキスト

store を選択すると OpenSpec のルートは変わりますが、その store を使うすべてのコードリポジトリを自動検出して読み込むわけではありません。store の指示は、store 内の成果物と設定済みのコンテキストを参照します。エージェントやエディターからコンポーネントのフォルダーを利用でき、エージェントがそれを読み込んだ場合に限り、コンポーネントのコードも参照されます。

ワークセットを使うと、計画 store と2つのコードリポジトリをまとめて開けます。

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

これにより、1つの IDE ワークスペースに各フォルダーが表示されます。ソースのコンテキストを store にコピーしたり、影響を受けるリポジトリを選択したり、エージェントに編集権限を付与したりするわけではありません。複数コンポーネントにまたがる長期的な情報は共有仕様に記載してください。計画担当者がたまたま調べたソースを覚えていることに頼らないでください。

### 各リポジトリで実装を始める方法

明示的な `--store` も近くの `openspec/` ルートもない場合、`store: team-plans` ポインターによってコマンドはその store を対象にします。`apply` を実行したディレクトリに応じて、store のタスクリストを分割することはありません。 OpenSpec
現時点では、タスクをリポジトリに振り分ける機能はありません。

各コンポーネントに独立した apply/review サイクルが必要な場合は、中央 store を直接指定せず、それぞれにローカル OpenSpec ルートを設けて中央 store を参照します。

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

共通契約が承認され、store のメイン仕様として利用できるようになったら、コンポーネントの担当分について小さなローカル change を作成します。

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

各リポジトリの指示に含まれる参照索引には、store の仕様の概要と、取得用の正確な `openspec show ... --store team-plans` コマンドが示されます。各ローカル提案では共通契約を参照し、タスクにはそのコンポーネントの作業だけを記述します。その後、各リポジトリで個別に `/opsx:apply` を実行します。ルート解決によって成果物と実装の編集対象は各リポジトリに限定されます。これでサービス側とフロントエンド側の変更を独立してテスト、レビュー、マージ、アーカイブできます。

共通 store の change が作業中のまま実装を始める必要がある場合は、`openspec show add-checkout-promo --store team-plans` で明示的に取得してください。参照索引に含まれるのは標準の store 仕様であり、作業中の store change ではありません。各実装がどのバージョンの契約に従っているかレビュアーが分かるよう、プルリクエストの説明で store のブランチとコンポーネントのブランチを相互にリンクしてください。

## 事例: チームをまたぐ要件

プラットフォームチームが要件を所有し、プロダクトチームは独自の設計を使いながら、自分たちのリポジトリでその要件に基づいて開発します。参照を使うと、作業場所を移動せずにこの関係を表せます。

```
   platform-reqs (store)                 api-server (コードリポジトリ)
   プラットフォームチームが所有           プロダクトチームが所有
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ 読み込み │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │             │   （独自の設計）         │
   │   プラットフォームの作業          │          │ openspec/changes/        │
   │                          │          │   （独自の作業）       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**プロダクトチームは参照先を** リポジトリの `openspec/config.yaml` で宣言します。

```yaml
references:
  - platform-reqs
```

参照は読み取り専用のコンテキストです。リポジトリは独自の `openspec/` ルートを保ち、作業もそこに保存されます。変わるのは、リポジトリ内の `openspec instructions` に参照先 store の仕様索引が含まれることです。各仕様には1行の概要と、正確な取得コマンド（`openspec show <spec-id> --type spec --store platform-reqs`）が示されます。`api-server` のエージェントは上流の決済要件を見つけて参照し、誰かがコンテキストを貼り付けなくても、自分のリポジトリのルートに詳細設計を記述できます。

参照には clone 元を含めることができるため、まだ store を持っていないチームメンバーにも、行き詰まらずに完全な修正方法が案内されます。

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**計画とコードを一緒に開きたい場合は、ワークセットを作成します。** 個人用かつ明示的な設定であり、各自が自分のマシンで実際に使うフォルダーを選択します。ローカルのチェックアウトパスが共有計画リポジトリにコミットされることはありません。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## いつでも確認できる2つの質問

**「セットアップは正常か？」** — `openspec doctor` は現在のルートと参照先 store を読み取り専用で確認し、各問題に貼り付け可能な修正方法を示します。

```
診断

ルート
  場所: /Users/you/src/api-server
  OpenSpec ルート: 正常

参照
  - platform-reqs: 正常 (/Users/you/openspec/platform-reqs)
  - design-system: 参照先 store 'design-system' はこのマシンに登録されていません。
    修正: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**「何を使って作業しているか？」** — `openspec context` は OpenSpec の宣言から、ルートと参照先 store を含む作業セットをまとめます。

```
api-server の作業コンテキスト (/Users/you/src/api-server)

OpenSpec ルート
  api-server  /Users/you/src/api-server

参照先 store
  platform-reqs  /Users/you/openspec/platform-reqs
    取得: openspec show <spec-id> --type spec --store platform-reqs
```

どちらもエージェント向けの `--json` に対応しています。さらに `openspec context --code-workspace
<path>` は、作業セット全体を含む VS Code ワークスペースファイルを書き込みます。このコマンドが行う書き込みはこれだけです。

## ワークセット: 一緒に作業するフォルダーを再び開く

これまでの機能とは別に、ほとんどの人は各セッションで同じフォルダーをまとめて開きます。計画リポジトリと2〜3個のコードリポジトリなどです。**ワークセット** は、それらを個人用の名前付きビューとして保存し、好きなツールで1つのコマンドから再度開けるようにします。

```
  ワークセット "platform"            openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       3つすべてをツールで開く
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (VS Code で開く)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` を実行すると、保存したツールが起動します。エディター（VS Code、Cursor）はすべてのメンバーを1つのウィンドウで開き、その後処理を戻します。最初のメンバーがプライマリです。`--tool <id>` でいつでもツールを上書きできます。

ワークセットは意図的に共有状態ではありません。自分のマシンに保存され、コミットされることはなく、作業内容について何かを宣言するものでもありません。一緒に開きたいフォルダーを記録するだけです。ワークセットを削除してもメンバーフォルダーには触れません。新しいツールの追加はコード変更ではなく設定です。ワークスペースファイルまたはフォルダーごとのアタッチフラグで起動するツールは、グローバル設定（`openspec config edit`）の `openers` キーに追加できます。

## コマンドの実行場所の決定方法

通常のコマンドはすべて、次の順序でルートを解決します。

```
1. --store <id>          明示的に指定                 → その store
2. 最も近い openspec/    実際の計画ルートがある       → このリポジトリ
   (現在のディレクトリから親へたどる)
3. store: ポインター     config.yaml が store を宣言  → その store
4. defaultStore          グローバル設定にマシンの    → その store
                         既定値がある
5. 上記に該当しない      マシンに store が登録済み?   → 選択候補付きエラー
                         store 未登録?                → 現在の
                                                         ディレクトリ
                                                         (従来の動作)
```

`Using OpenSpec root:` の行（および `--json` 出力の `root` ブロック）で、どのケースに該当するか確認できます。

## 既知の制限

- **ベータ版の仕様です。** このページの内容は、名称、フラグ、ファイル形式、JSON キーを含め、リリース間で変更される可能性があります。
- **1台のマシンでは store ID ごとに1つのチェックアウトのみ。** 同じ ID で2つ目を登録すると、先に `store unregister` を実行するよう案内されて失敗します。
- **意図的に同期は行いません。** OpenSpec が clone、pull、push を行うことはありません。古いチェックアウトは、*あなたが* pull するまで古い仕様を表示します。参照はディスク上の内容からリアルタイムに索引化されます。
- **空の計画フォルダーは存在しない場合があります。** 新しい store では `openspec/changes/`、`openspec/specs/`、`openspec/changes/archive/` がまだ Git に存在しないことがあります。ベータ期間中はこれを許容します。通常のコマンドがファイルを作成するとフォルダーも作成されます。
- **ポインターリポジトリはポインターのままです。** `openspec/config.yaml` で `store: <id>` を宣言する設定専用リポジトリは、計画を外部化していると扱われ、登録対象の store チェックアウトにはなりません。意図的にローカル store ルートへ変換する場合は、先に `store:` 行を削除してください。
- **一部のコマンドは実行場所が固定です。** `templates` と非推奨の名詞形式（`openspec change show` など）は、現在のディレクトリだけを対象とし、`--store` は使えません。`schemas` は標準のルート選択順序に従い、成功時の JSON 配列形式を維持したまま `--store <id>` に対応します。
- **マシンごとの状態はそのマシンに限定されます。** store レジストリとワークセットはローカル設定です。マシン上の配置情報が共有の計画リポジトリにコミットされることはありません。
- **ワークセットの起動方式は2種類です。** ワークスペースファイルまたはフォルダーごとのアタッチフラグで起動できないツールは、オープナーに追加できません。
- **エージェント向け JSON には大文字・小文字形式の不一致があります**（store 系のキーは snake_case、workflow 系は camelCase）。[エージェント契約](/ja-JP/agent-contract/)に記載されています。統一はバージョン付きリリース以降に延期されています。

## ファイルの保存場所

| 対象 | 場所 | 共有されるか |
|---|---|---|
| store の計画 | `<store>/openspec/`（仕様、change） | はい — commit と push を行う |
| store の識別情報 | `<store>/.openspec-store/store.yaml` | はい — store とともにコミット |
| store レジストリ | `<data dir>/openspec/stores/registry.yaml` | いいえ — このマシンのみ |
| ワークセット | `<data dir>/openspec/worksets/` | いいえ — このマシンのみ |

macOS と Linux では `<data dir>` は `~/.local/share/openspec`（`$XDG_DATA_HOME` が設定されている場合は `$XDG_DATA_HOME/openspec`）、Windows では `%LOCALAPPDATA%\openspec` です。

## リファレンス

このページで説明したすべてのコマンドの正確なフラグと JSON 形式は、[CLI リファレンス](/ja-JP/cli/)（Stores、Doctor、作業コンテキスト、個人用ワークセット）と[エージェント契約](/ja-JP/agent-contract/)を参照してください。
