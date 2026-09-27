---
title: "カスタマイズ"
---

OpenSpec では、次の3つのレベルでカスタマイズできます。

| レベル | 内容 | 最適な対象 |
|-------|--------------|----------|
| **プロジェクト設定** | 既定値の設定、コンテキスト/ルールの注入 | ほとんどのチーム |
| **カスタムスキーマ** | 独自のワークフロー成果物を定義 | 独自のプロセスを持つチーム |
| **グローバルオーバーライド** | すべてのプロジェクトでスキーマを共有 | 上級ユーザー |

---

## プロジェクト設定

`openspec/config.yaml` ファイルは、チーム向けに OpenSpec をカスタマイズする最も簡単な方法です。次のことができます。

- **既定のスキーマを設定する** — 各コマンドで `--schema` を省略できる
- **プロジェクトのコンテキストを注入する** — AI が技術スタックや規約などを把握する
- **成果物ごとのルールを追加する** — 特定の成果物に独自のルールを適用する
- **操作ごとのガイダンスを追加する** — apply や archive の作業に関する助言的な設定を行う
- **統合に関する選択を記憶する** — 例: [GitHub Copilot クラウドコーディングエージェント](/ja-JP/supported-tools/#github-copilot-cloud-coding-agent)のオプトイン

### クイックセットアップ

```bash
openspec init
```

対話形式で設定ファイルを作成できます。または、手動で作成します。

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  技術スタック: TypeScript、React、Node.js、PostgreSQL
  API の形式: RESTful。docs/api.md に記載
  テスト: Jest + React Testing Library
  すべての公開 API で後方互換性を重視する

rules:
  proposal:
    - ロールバック計画を含める
    - 影響を受けるチームを特定する
  specs:
    - Given/When/Then 形式を使う
    - 新しいパターンを考案する前に既存のパターンを参照する

operations:
  apply:
    guidance:
      - 全体のテストスイートの前に対象を絞ったテストを実行する
  archive:
    guidance:
      - 完了サマリーを簡潔にする

# GitHub Copilot クラウドコーディングエージェントを選択（または拒否）すると、
# `openspec init` によって設定される。`init`/`update` でのファイル生成を制御する。
githubCopilot:
  cloudAgent: false
```

### 仕組み

**Default schema:**

```bash
# 設定なし
openspec new change my-feature --schema spec-driven

# 設定あり — スキーマが自動的に適用される
openspec new change my-feature
```

**Context and rules injection:**

成果物の生成時には、コンテキストとルールが AI プロンプトに注入されます。

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- ロールバック計画を含める
- 影響を受けるチームを特定する
</rules>

<template>
[スキーマに組み込まれたテンプレート]
</template>
```

- **コンテキスト** はすべての成果物に含まれる
- **ルール** は一致する成果物にのみ含まれる

**操作ガイダンス:**

`operations.apply.guidance` と `operations.archive.guidance` は、エージェントが各操作を
どのように行うかについての助言的な指示を含む任意の配列です。
`rules` とは別の設定です。操作ガイダンスは成果物の内容を制約せず、
成果物のルールが操作ガイダンスとして扱われることもありません。

apply と archive は、実行時にこれらの入力を取得します。

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

どちらのインターフェイスも、現在のプロジェクトの `context` と対応する
`operationGuidance` を独立した任意フィールドとして返します。呼び出しごとに
解決済みルートから最新のスナップショットを読み込みます。`--store <id>` が選択されている場合、
change、コンテキスト、ガイダンスは現在のリポジトリではなく、その store から取得されます。
archive の指示コマンドは読み取り専用です。差分仕様の確認やマージ、メイン仕様への書き込み、
change の移動、静的な archive ワークフローの実行は行いません。

プロジェクトコンテキストはプロンプトレベルで必須の入力です。生成されたワークフローはそれを読み、
関連するプロジェクト情報、規約、制約を適用します。操作ガイダンスは任意の追加的な助言です。
ワークフローはすべての項目を確認し、組み込みワークフローに適用できて矛盾しない項目に従います。

両フィールドは、CLI が制御する状態、解決済みパス、組み込み手順、明示的なユーザーの選択、
成果物のルールとは別に保持されます。ワークフローは優先される値を保持しながら、コンテキストの
競合を報告します。適用できない、または矛盾するガイダンスには従わず、その理由を説明します。
どちらのフィールドも強制的な検証項目ではありません。ユーザーが別途依頼しない限り、
ワークフローはその文章を実装ファイル、仕様、change の成果物、サマリーにコピーしません。

**Archive と仕様同期の入力安全性:**

Archive、一括 archive、単独の sync は
`openspec status --json` の `artifactPaths.specs.existingOutputPaths` を差分仕様の唯一の入力元として使います。`specs` 成果物のないスキーマや、具体的な出力一覧が
空の change には同期対象がありません。他の成果物から差分仕様を推測することもありません。

意味的なマージによってメイン仕様を書き込む前に、ワークフローは
`openspec instructions specs --change <name> --json` の最新の出力を読み込みます。
返された `specs` ルールは、そのマージで生成するメイン仕様のみに適用されます。単一の archive は
このスナップショットを内部 sync に渡し、単独の sync は直接取得し、一括 archive は最初の仕様を
書き込む前に必要なスナップショットをすべて取得します。archive/specs の指示に対する
ゼロ以外の終了コードや無効な JSON 応答は、空の入力ではなく検索失敗です。ワークフローは
対象の仕様を書き込んだり change を移動したりする前に停止します（一括 archive では
バッチの書き込みや移動を開始する前に停止します）。

この設定によって、archive の実行フェーズ、ユーザープロンプト、ファイルシステム操作、
意味的マージの所有権、`openspec archive` コマンド、成果物 `rules` の構成や出力が
変わることはありません。

### スキーマの解決順序

OpenSpec がスキーマを必要とするときは、次の順番で確認します。

1. CLI フラグ: `--schema <name>`
2. change のメタデータ（change フォルダー内の `.openspec.yaml`）
3. プロジェクト設定（`openspec/config.yaml`）
4. 既定値（`spec-driven`）

---

## カスタムスキーマ

プロジェクト設定だけでは不十分な場合、完全に独自のワークフローを持つスキーマを作成できます。カスタムスキーマはプロジェクトの `openspec/schemas/` ディレクトリに置き、コードとともにバージョン管理します。

```text
your-project/
├── openspec/
│   ├── config.yaml        # プロジェクト設定
│   ├── schemas/           # カスタムスキーマを格納
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # プロジェクトの変更
└── src/
```

### 既存のスキーマをフォークする

最も手早くカスタマイズする方法は、組み込みスキーマをフォークすることです。

```bash
openspec schema fork spec-driven my-workflow
```

`spec-driven` スキーマ全体が `openspec/schemas/my-workflow/` にコピーされ、自由に編集できます。

**作成される内容:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # ワークフローの定義
└── templates/
    ├── proposal.md       # proposal 成果物のテンプレート
    ├── spec.md           # specs のテンプレート
    ├── design.md         # design のテンプレート
    └── tasks.md          # tasks のテンプレート
```

`schema.yaml` を編集してワークフローを変更するか、テンプレートを編集して AI の生成内容を変更します。

### スキーマを新規作成する

まったく新しいワークフローを作成する場合:

```bash
# 対話形式
openspec schema init research-first

# 非対話形式
openspec schema init rapid \
  --description "高速な反復ワークフロー" \
  --artifacts "proposal,tasks" \
  --default
```

### スキーマの構成

スキーマでは、ワークフローの成果物と、その依存関係を定義します。

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: チーム独自のワークフロー

artifacts:
  - id: proposal
    generates: proposal.md
    description: 最初の提案ドキュメント
    template: proposal.md
    instruction: |
      この変更が必要な理由を説明する提案を作成してください。
      解決策ではなく問題に焦点を当ててください。
    requires: []

  - id: design
    generates: design.md
    description: 技術設計
    template: design.md
    instruction: |
      実装方法を説明する設計ドキュメントを作成してください。
    requires:
      - proposal    # proposal が存在するまで design を作成できない

  - id: tasks
    generates: tasks.md
    description: 実装チェックリスト
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**主なフィールド:**

| フィールド | 目的 |
|-------|---------|
| `id` | コマンドやルールで使う一意の識別子 |
| `generates` | 出力ファイル名（`specs/**/*.md` のような glob に対応） |
| `template` | `templates/` ディレクトリ内のテンプレートファイル |
| `instruction` | この成果物を作成するための AI 向け指示 |
| `requires` | 依存関係 — 先に存在する必要のある成果物 |

成果物は作成したい順に一覧へ記述してください。`requires` は作成可能なものを決め、
複数の成果物が同時に準備できた場合は `artifacts:` リストの順序によって
どれを先に作成するかが決まります。

### テンプレート

テンプレートは AI を導く Markdown ファイルです。その成果物を作成するときにプロンプトに注入されます。

```markdown
<!-- templates/proposal.md -->
## 理由

<!-- この変更の動機を説明してください。どの問題を解決しますか？ -->

## 変更内容

<!-- 何が変わるかを説明してください。新機能や変更を具体的に記述します。 -->

## 影響

<!-- 影響を受けるコード、API、依存関係、システム -->
```

テンプレートには次の内容を含められます。
- AI が記入する節見出し
- AI 向けのガイダンスを含む HTML コメント
- 期待する構成を示す形式例

### スキーマを検証する

カスタムスキーマを使う前に、検証してください。

```bash
openspec schema validate my-workflow
```

次の点を確認します。
- `schema.yaml` の構文が正しい
- 参照先のテンプレートがすべて存在する
- 循環依存がない
- 成果物 ID が有効である

### カスタムスキーマを使う

作成したスキーマは次のように使用します。

```bash
# コマンドで指定
openspec new change feature --schema my-workflow

# または config.yaml で既定値として設定
schema: my-workflow
```

### スキーマの解決をデバッグする

どのスキーマが使われているか分からない場合は、次で確認します。

```bash
# 特定のスキーマの解決元を表示
openspec schema which my-workflow

# 利用可能なスキーマをすべて表示
openspec schema which --all
```

出力には、プロジェクト、ユーザーディレクトリ、パッケージのどこから読み込まれたかが示されます。

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注:** OpenSpec は、複数プロジェクトで共有するユーザーレベルのスキーマ（`~/.local/share/openspec/schemas/`）にも対応しています。ただし、コードとともにバージョン管理できるため、プロジェクトレベルの `openspec/schemas/` を推奨します。

---

## 例

### 高速な反復ワークフロー

素早く反復するための最小限のワークフローです。

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: 最小限の負担で素早く反復

artifacts:
  - id: proposal
    generates: proposal.md
    description: 簡易な提案
    template: proposal.md
    instruction: |
      この変更について簡潔な提案を作成してください。
      何を、なぜ行うかに焦点を当て、詳細な仕様は省略します。
    requires: []

  - id: tasks
    generates: tasks.md
    description: 実装チェックリスト
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### レビュー成果物を追加する

既定のスキーマをフォークして、レビュー手順を追加します。

```bash
openspec schema fork spec-driven with-review
```

次に `schema.yaml` を編集して追加します。

```yaml
  - id: review
    generates: review.md
    description: 実装前レビューのチェックリスト
    template: review.md
    instruction: |
      設計に基づいてレビュー用チェックリストを作成してください。
      セキュリティ、パフォーマンス、テストに関する確認事項を含めます。
    requires:
      - design

  - id: tasks
    # ... 既存の tasks 設定 ...
    requires:
      - specs
      - design
      - review    # tasks にも review が必要
```

---

## コミュニティスキーマ

OpenSpec は、独立したリポジトリで配布されるコミュニティ保守のスキーマにも対応しています。これらは OpenSpec を他のツールやシステムと連携させる、意見の明確なワークフローを提供します。[github/spec-kit のコミュニティ拡張カタログ](https://github.com/github/spec-kit/tree/main/extensions)が spec-kit で機能する方法と似ています。

コミュニティスキーマは OpenSpec のコアに同梱されません。それぞれ独自のリポジトリで独自のリリース周期に沿って管理されます。使用するには、スキーマ一式をプロジェクトの `openspec/schemas/<schema-name>/` ディレクトリにコピーしてください（インストール方法は各リポジトリの README を参照）。

| スキーマ | メンテナー | リポジトリ | 説明 |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | 実装前に、変更の目的、観測可能な動作、技術設計、長期にわたるアーキテクチャ上の決定を記録します。change 固有の ADR レビューマニフェストを追加し、長期的に有効な決定を変更不能かつ後継版で置き換え可能な ADR として記録します。 |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec の成果物ガバナンスを [obra/superpowers](https://github.com/obra/superpowers) の実行スキル（ブレインストーミング、計画の作成、サブエージェントを使った TDD、コードレビュー、仕上げ）と統合します。Superpowers が標準ではカバーしない部分を補う、証拠を重視する `retrospective` 成果物を追加します。 |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | PM 主導のワークフローです。実装の前段階で [nanopm](https://github.com/nmrtn/nanopm) の計画パイプライン（監査 → 戦略 → ロードマップ → PRD）を実行します。製品計画と OpenSpec の仕様駆動エンジニアリングワークフローを橋渡しします。`.nanopm/` があれば成果物がその内容を読み込み、proposal は監査、design は戦略、tasks は PRD の分解内容を参照します。 |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 機能単位のエンドツーエンドテスト用ランブックです。各機能に変更不能な仕様、変更不能なタスクテンプレート、実行ごとにタイムスタンプ付きの実行記録を用意します。アサーションは観測可能な動作のみを対象とします（HTTP ステータス、レスポンス本文、永続化された状態。ログの部分文字列は対象外）。各実行では開始/終了時刻（UTC）、所要時間、LLM トークン消費量の推定値を記録します。 |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | TDD の規律と対立的なレビュー手順を含む仕様駆動ワークフローです。流れ: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`。`review` は新しいコンテキストで読み取り専用のレビュアー（利用できる場合は2つ目のモデル）が作成し、エージェントに `test-plan`、`tasks`、`apply` の開始条件を指示する `VERDICT:` 行を出力します。OpenSpec は成果物の存在のみを確認するため、ゲートは独自の CI またはフックで強制してください。`test-plan` は各仕様シナリオを名前付きテストに対応付け、`verify` が監査する red/green 台帳としても機能します。 |

> コミュニティスキーマを追加したい場合は、リポジトリへのリンクを添えて Issue を作成するか、この表に1行追加する PR を送ってください。

---

## 関連ページ

- [CLI リファレンス: スキーマコマンド](/ja-JP/cli/#schema-commands) — コマンドの詳細
