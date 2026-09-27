---
title: "OPSX への移行"
---

このガイドでは、従来の OpenSpec ワークフローから OPSX へ移行する方法を説明します。既存の作業を保持し、新しいシステムの柔軟性を活かせるよう、スムーズに移行できる設計になっています。

## 何が変わるのか

OPSX は、従来のフェーズ固定型ワークフローを柔軟なアクションベースの方法に置き換えます。主な違いは次のとおりです。

| 項目 | 従来方式 | OPSX |
|--------|--------|------|
| **コマンド** | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | 既定: `/opsx:propose`、`/opsx:explore`、`/opsx:apply`、`/opsx:update`、`/opsx:sync`、`/opsx:archive`（拡張ワークフローコマンドは任意） |
| **ワークフロー** | すべての成果物を一度に作成 | 段階的または一括で作成 — 選択可能 |
| **前の段階に戻る** | 戻りにくいフェーズの関門 | 自然に戻れる — いつでも成果物を更新 |
| **カスタマイズ** | 固定された構成 | スキーマ駆動で自由にカスタマイズ |
| **設定** | マーカーを含む `CLAUDE.md` + `project.md` | `openspec/config.yaml` に整理された設定 |

**基本理念の変化:** 作業は直線的ではありません。OPSX はそのように扱うことをやめます。

---

## 始める前に

### 既存の作業は安全に保持される

移行プロセスは、既存の内容を保持するよう設計されています。

- **`openspec/changes/` 内の作業中の change** — 完全に保持されます。OPSX コマンドで続行できます。
- **アーカイブ済みの change** — 変更されません。履歴はそのまま残ります。
- **`openspec/specs/` 内のメイン仕様** — 変更されません。これらは真実の情報源です。
- **CLAUDE.md、AGENTS.md などの独自の内容** — 保持されます。OpenSpec のマーカーブロックだけが削除され、自分で書いた内容は残ります。

### 削除されるもの

置き換え対象となる OpenSpec 管理ファイルのみです。

| 対象 | 理由 |
|------|-----|
| 従来のスラッシュコマンド用ディレクトリ/ファイル | 新しいスキルシステムに置き換わる |
| `openspec/AGENTS.md` | 古いワークフローのトリガー |
| `CLAUDE.md`、`AGENTS.md` などの OpenSpec マーカー | 不要になる |

**ツールごとの従来コマンドの場所**（例。使用ツールによって異なる場合があります）:

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop（旧 Windsurf）: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`（IDE 拡張機能のみ。Copilot CLI は非対応）
- Codex: OpenSpec は標準の `.agents/skills/openspec-*` パスを使うようになりました。旧 `.codex/skills` にある OpenSpec 管理の `SKILL.md` ファイルは、置き換え先が作成された後にのみ整理されます。カスタムファイルと差異のあるコピーは保持されます。マーカーのない `.agents` ツリーに OpenSpec スキルがすでにある場合、OpenSpec は従来のディレクトリから推測せず、既存の Codex（`$openspec-*`）または汎用（`/openspec-*`）形式を保持します。所有権を切り替えるには、`openspec init` で `codex` を明示的に選択してください。従来のプロンプトの整理対象は、`$CODEX_HOME/prompts` または `~/.codex/prompts` にある OpenSpec の許可リスト記載ファイル名のみです。
- その他（Augment、Continue、Amazon Q など）

移行処理では設定済みツールを検出し、それらの従来ファイルを整理します。

削除対象の一覧は長く見えるかもしれませんが、いずれも OpenSpec が作成したファイルです。独自の内容が削除されることはありません。

### 対応が必要なもの

1つのファイルは手動で移行する必要があります。

**`openspec/project.md`** — 自分で記述したプロジェクトコンテキストが含まれている可能性があるため、このファイルは自動削除されません。次の対応が必要です。

1. 内容を確認する
2. 有用なコンテキストを `openspec/config.yaml` に移す（下記の説明を参照）
3. 準備ができたらファイルを削除する

**この変更を行った理由:**

従来の `project.md` は受動的なものでした。エージェントが読むこともあれば、読まないこともあり、読んだ内容を忘れることもあります。そのため信頼性にばらつきがありました。

新しい `config.yaml` のコンテキストは、**すべての OpenSpec 計画リクエストに明示的に注入** されます。AI が成果物を作成するとき、プロジェクトの規約、技術スタック、ルールが常に含まれるため、信頼性が高まります。

**トレードオフ:**

コンテキストはすべてのリクエストに注入されるため、簡潔に記述してください。本当に重要な内容に絞ります。
- 技術スタックと主要な規約
- AI が知っておく必要のある、分かりにくい制約
- 以前によく無視されていたルール

完璧にする必要はありません。最適な方法はまだ検討中であり、実験しながらコンテキスト注入の仕組みも改善していきます。

---

## 移行の実行

`openspec init` と `openspec update` はどちらも従来のファイルを検出し、同じ整理プロセスを案内します。状況に合う方を使ってください。

- 新規インストールの既定プロファイルは `core`（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）です。
- 移行時は必要に応じて `custom` プロファイルを作成し、以前にインストールされていたワークフローを保持します。

### `openspec init` を使う

新しいツールを追加する場合や、セットアップ済みのツールを再設定する場合に実行します。

```bash
openspec init
```

init コマンドは従来のファイルを検出し、整理の手順を案内します。

```
新しい OpenSpec にアップグレード

OpenSpec は、コーディングエージェント間で標準になりつつある
エージェントスキルを使用します。これにより、従来どおり機能させながら
セットアップを簡素化できます。

削除するファイル
保持するユーザーコンテンツはありません:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

更新するファイル
OpenSpec マーカーを削除し、独自の内容は保持します:
  • CLAUDE.md
  • AGENTS.md

対応が必要:
  • openspec/project.md
    このファイルは削除しません。有用なプロジェクトコンテキストが
    含まれている可能性があります。

    新しい openspec/config.yaml には、計画用コンテキストの
    "context:" セクションがあります。これはすべての OpenSpec リクエストに
    含まれ、従来の project.md より確実に機能します。

    project.md を確認し、有用な内容を config.yaml の context
    セクションに移してから、準備ができたらファイルを削除してください。

? アップグレードして従来のファイルを整理しますか？ (Y/n)
```

**「はい」と答えた場合の動作:**

1. 従来のスラッシュコマンドディレクトリを削除
2. `CLAUDE.md`、`AGENTS.md` などから OpenSpec マーカーを削除（独自の内容は保持）
3. `openspec/AGENTS.md` を削除
4. `.claude/skills/` に新しいスキルをインストール
5. 既定スキーマを含む `openspec/config.yaml` を作成

### `openspec update` を使う

移行のみを行い、既存ツールを最新バージョンに更新する場合に実行します。

```bash
openspec update
```

update コマンドも従来の成果物を検出して整理し、現在のプロファイルと配布設定に合わせて生成済みのスキル/コマンドを更新します。

### 非対話環境 / CI

スクリプトで移行する場合:

```bash
openspec init --force --tools claude
```

`--force` フラグは確認を省略し、整理を自動的に承認します。

これには、Codex のグローバルプロンプトディレクトリにある OpenSpec 管理のプロンプトファイルの整理も含まれます。対象は OpenSpec の許可リストにある従来の Codex プロンプトファイル名に限られます。置き換え先の `.agents/skills/openspec-*` スキルが存在する場合にのみ削除し、それ以外のファイルはすべて保持します。

---

## project.md を config.yaml に移行する

従来の `openspec/project.md` は、プロジェクトのコンテキストを記述する自由形式の Markdown ファイルでした。新しい `openspec/config.yaml` は構造化されており、重要な点として、**すべての計画リクエストに注入** されるため、AI の作業時に規約が常に含まれます。

### 変更前（project.md）

```markdown
# プロジェクトコンテキスト

React と Node.js を使う TypeScript モノレポです。
テストには Jest を使用し、厳格な ESLint ルールに従います。
API は RESTful で、docs/api.md に記載されています。

## 規約

- すべての公開 API で後方互換性を維持する
- 新機能にはテストを含める
- 仕様には Given/When/Then 形式を使う
```

### 変更後（config.yaml）

```yaml
schema: spec-driven

context: |
  技術スタック: TypeScript、React、Node.js
  テスト: Jest と React Testing Library
  API: RESTful、docs/api.md に記載
  すべての公開 API で後方互換性を維持する

rules:
  proposal:
    - リスクの高い変更にはロールバック計画を含める
  specs:
    - シナリオには Given/When/Then 形式を使う
    - 新しいパターンを考案する前に既存のパターンを参照する
  design:
    - 複雑なフローにはシーケンス図を含める
```

### 主な違い

| project.md | config.yaml |
|------------|-------------|
| 自由形式の Markdown | 構造化された YAML |
| 1つのテキストの塊 | コンテキストと成果物ごとのルールを分離 |
| 使用タイミングが不明確 | コンテキストはすべての成果物に、ルールは一致する成果物にのみ適用 |
| スキーマを選択できない | `schema:` フィールドで既定ワークフローを明示 |

### 残すもの、削除するもの

移行時は内容を選別します。「AI は *すべての* 計画リクエストでこれを必要とするか？」と自問してください。

**`context:` に適した内容**
- 技術スタック（言語、フレームワーク、データベース）
- 重要なアーキテクチャパターン（モノレポ、マイクロサービスなど）
- 分かりにくい制約（「理由 X によりライブラリ Y は使えない」など）
- よく無視されてしまう重要な規約

**代わりに `rules:` に移す内容**
- 成果物固有の形式（「specs では Given/When/Then を使う」など）
- レビュー基準（「提案にはロールバック計画を必ず含める」など）
- 一致する成果物にのみ適用されるため、他のリクエストを簡潔に保てる

**完全に省く内容**
- AI がすでに知っている一般的なベストプラクティス
- 要約できる長い説明
- 現在の作業に影響しない過去の経緯

### 移行手順

1. **config.yaml を作成する**（init で未作成の場合）:
   ```yaml
   schema: spec-driven
   ```

2. **コンテキストを追加する**（すべてのリクエストに含まれるため、簡潔に記述）:
   ```yaml
   context: |
     プロジェクトの背景をここに記述します。
     AI が本当に知る必要のある内容に絞ってください。
   ```

3. **成果物ごとのルールを追加する**（任意）:
   ```yaml
   rules:
     proposal:
       - 提案固有のガイダンス
     specs:
       - 仕様作成のルール
   ```

4. 有用な内容をすべて移したら、**project.md を削除する**。

**考えすぎないでください。** 必須の内容から始めて、反復しながら整えます。AI が重要な内容を見落としたら追加し、コンテキストが膨らみすぎたら削ります。これは更新を続けるドキュメントです。

### 困った場合はこのプロンプトを使う

project.md の内容をどう整理すればよいか分からない場合は、AI アシスタントに依頼してください。

```
OpenSpec の古い project.md から、新しい config.yaml 形式に移行しています。

現在の project.md は次のとおりです。
[project.md の内容を貼り付け]

次の内容を含む config.yaml の作成を手伝ってください。
1. 簡潔な `context:` セクション（すべての計画リクエストに注入されるため、技術スタック、重要な制約、よく無視される規約に絞る）
2. 成果物固有の内容がある場合は、その成果物向けの `rules:`（例:「Given/When/Then を使う」はグローバルコンテキストではなく specs のルールにする）

AI モデルがすでに知っている一般的な内容は省いてください。徹底して簡潔にしてください。
```

AI が、残すべき必須事項と削れる内容を見分けるのを手伝います。

---

## 新しいコマンド

利用可能なコマンドはプロファイルによって異なります。

**既定（`core` プロファイル）:**

| コマンド | 目的 |
|---------|---------|
| `/opsx:propose` | change と計画成果物を一度に作成 |
| `/opsx:explore` | 形式にとらわれずアイデアを検討 |
| `/opsx:apply` | tasks.md のタスクを実装 |
| `/opsx:update` | change の計画成果物を見直し、一貫性を保つ |
| `/opsx:sync` | 差分仕様をメイン仕様にマージ |
| `/opsx:archive` | change を確定してアーカイブ |

**拡張ワークフロー（カスタム選択）:**

| コマンド | 目的 |
|---------|---------|
| `/opsx:new` | 新しい change のひな型を作成 |
| `/opsx:continue` | 次の成果物を1つ作成 |
| `/opsx:ff` | 一気に進め、計画成果物を一度に作成 |
| `/opsx:verify` | 実装が仕様に一致するか検証 |
| `/opsx:bulk-archive` | 複数の change を一度にアーカイブ |
| `/opsx:onboard` | 全工程をガイド付きで学ぶワークフロー |

`openspec config profile` で拡張コマンドを有効にし、`openspec update` を実行します。

### 従来コマンドとの対応

| 従来方式 | OPSX での対応 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (default) or `/opsx:new` then `/opsx:ff` (expanded) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新しい機能

これらの機能は拡張ワークフローコマンドセットに含まれます。

**成果物を細かく作成:**
```
/opsx:continue
```
依存関係に基づき、成果物を1つずつ作成します。各手順をレビューしたい場合に使います。

**探索モード:**
```
/opsx:explore
```
change に着手する前に、パートナーとアイデアを検討します。

---

## 新しいアーキテクチャを理解する

### フェーズ固定から柔軟なフローへ

従来のワークフローでは、直線的な進行を強制していました。

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│     計画     │ ───► │     実装     │ ───► │ アーカイブ   │
│   フェーズ   │      │   フェーズ   │      │ フェーズ     │
└──────────────┘      └──────────────┘      └──────────────┘

実装中に設計が誤っていると分かったらどうなるでしょうか？
従来のフェーズの関門では、簡単に戻れません。
```

OPSX はフェーズではなくアクションを使います。

```
         ┌───────────────────────────────────────────────┐
         │        アクション（フェーズではない）          │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    任意の順序                  │
         └───────────────────────────────────────────────┘
```

### 依存関係グラフ

成果物は有向グラフを形成します。依存関係は関門ではなく、進行を可能にするものです。

```
                        proposal
                       (ルートノード)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (必要:                       (必要:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (必要:
                     specs, design)
```

`/opsx:continue` を実行すると、作成可能な成果物を確認して次の成果物を提示します。複数の成果物が作成可能な場合は、任意の順序で作成することもできます。

### スキルとコマンド

従来のシステムではツール固有のコマンドファイルを使っていました。

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX は標準になりつつある **スキル** 形式を使います。

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

スキルは複数の AI コーディングツールで認識され、より豊富なメタデータを提供します。

OPSX では Codex はスキルのみを使います。OpenSpec は Codex のカスタムプロンプトファイルを生成しなくなりました。代わりに生成される `.agents/skills/openspec-*` ディレクトリを使ってください。

---

## 既存の change を続ける

作業中の change は OPSX コマンドでそのまま続行できます。

**従来のワークフローで作成した作業中の change がある場合:**

```
/opsx:apply add-my-feature
```

OPSX は既存の成果物を読み込み、中断したところから続行します。

**既存の change に成果物を追加する場合:**

```
/opsx:continue add-my-feature
```

すでに存在する成果物に基づいて、作成可能なものを表示します。

**状態を確認する場合:**

```bash
openspec status --change add-my-feature
```

---

## 新しい設定システム

### config.yaml の構成

```yaml
# 必須: 新しい change の既定スキーマ
schema: spec-driven

# 任意: プロジェクトコンテキスト（最大50 KB）
# すべての成果物の指示に注入
context: |
  プロジェクトの背景、技術スタック、
  規約、制約を記述します。

# 任意: 成果物ごとのルール
# 一致する成果物にのみ注入
rules:
  proposal:
    - ロールバック計画を含める
  specs:
    - Given/When/Then 形式を使う
  design:
    - フォールバックの方針を記述する
  tasks:
    - 各タスクを最大2時間で完了する大きさに分割する
```

### スキーマの解決

使用するスキーマを決定するとき、OPSX は次の順に確認します。

1. **CLI フラグ**: `--schema <name>`（最優先）
2. **change のメタデータ**: change ディレクトリ内の `.openspec.yaml`
3. **プロジェクト設定**: `openspec/config.yaml`
4. **既定値**: `spec-driven`

### 利用可能なスキーマ

| スキーマ | 成果物 | 最適な対象 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | ほとんどのプロジェクト |

利用可能なスキーマをすべて一覧表示します。

```bash
openspec schemas
```

### カスタムスキーマ

独自のワークフローを作成します。

```bash
openspec schema init my-workflow
```

または、既存のスキーマをフォークします。

```bash
openspec schema fork spec-driven my-workflow
```

詳しくは[カスタマイズ](/ja-JP/customization/)を参照してください。

---

## トラブルシューティング

### 「非対話モードで従来ファイルが検出された」

CI または非対話環境で実行しています。次を使ってください。

```bash
openspec init --force
```

### 移行後にコマンドが表示されない

IDE を再起動してください。スキルは起動時に検出されます。

### 「rules に未知の成果物 ID がある」

`rules:` のキーがスキーマの成果物 ID と一致するか確認してください。

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

有効な成果物 ID を確認するには次を実行します。

```bash
openspec schemas --json
```

### 設定が適用されない

1. ファイルが `openspec/config.yaml` にあることを確認する（`.yml` ではない）
2. YAML 構文を検証する
3. 設定変更はすぐに反映される — 再起動は不要

### project.md が移行されない

独自の内容が含まれている可能性があるため、システムは意図的に `project.md` を保持します。内容を手動で確認し、有用な部分を `config.yaml` に移してから削除してください。

### 整理される内容を確認するには

init を実行し、整理の確認を拒否してください。変更を加えずに、検出内容のサマリー全体を確認できます。

---

## クイックリファレンス

### 移行後のファイル

```
project/
├── openspec/
│   ├── specs/                    # 変更なし
│   ├── changes/                  # 変更なし
│   │   └── archive/              # 変更なし
│   └── config.yaml               # 新規: プロジェクト設定
├── .claude/
│   └── skills/                   # 新規: OPSX スキル
│       ├── openspec-propose/     # 既定の core プロファイル
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # 拡張プロファイルでは new/continue/ff などを追加
├── CLAUDE.md                     # OpenSpec マーカーを削除し、独自の内容を保持
└── AGENTS.md                     # OpenSpec マーカーを削除し、独自の内容を保持
```

### 削除されるもの

- `.claude/commands/openspec/` — `.claude/skills/` に置き換え
- `openspec/AGENTS.md` — 廃止
- `openspec/project.md` — `config.yaml` に移行後、削除
- `CLAUDE.md`、`AGENTS.md` などにある OpenSpec のマーカーブロック

### コマンド早見表

```text
/opsx:propose      すぐに開始（既定の core プロファイル）
/opsx:apply        タスクを実装
/opsx:archive      完了してアーカイブ

# 拡張ワークフロー（有効な場合）:
/opsx:new          change のひな型を作成
/opsx:continue     次の成果物を作成
/opsx:ff           計画成果物を作成
```

---

## ヘルプを受ける

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub の Issue**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **ドキュメント**: OPSX の全リファレンスは[OPSX ガイド](/ja-JP/opsx/)を参照してください。
