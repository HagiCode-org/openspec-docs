---
title: "はじめに"
---

このガイドでは、OpenSpec をインストールして初期化した後の使い方を説明します。インストール方法は、[README](https://github.com/Fission-AI/openspec/blob/79b6aa9c98f1e36795b2bc4ef2a8f770c6d3a777/README.md#quick-start)または[インストールガイド](/ja-JP/installation/)を参照してください。ドキュメント全体を初めて読む場合は、[ドキュメントホーム](/ja-JP/)で全体像を確認できます。

> **これらのコマンドはどこに入力しますか？** 入力場所は2つあり、混同することが初心者が最もよくつまずく原因です。
>
> - `openspec ...` コマンド（`openspec init` など）は **ターミナル** で実行します。
> - `/opsx:...` コマンド（`/opsx:propose` など）は、コード作成を依頼するのと同じ **AI アシスタントとのチャット** で実行します。
>
> 別の「対話モード」を開始する必要はありません。チャットにスラッシュコマンドを入力すると、アシスタントが処理します。詳しくは[コマンドの実行方法](/ja-JP/how-commands-work/)を参照してください。

## 最初の5分

各手順の実行場所を示した全体の流れです。

```text
ターミナル   $ npm install -g @fission-ai/openspec@latest
ターミナル   $ cd your-project && openspec init
AI チャット   /opsx:explore                    (任意: 先に考えを整理)
AI チャット   /opsx:propose add-dark-mode      (AI が計画を下書きし、あなたがレビュー)
AI チャット   /opsx:apply                      (AI が実装)
AI チャット   /opsx:archive                    (仕様を更新し、change を保管)
```

セットアップはターミナルで2手順。その後はチャットで作業します。このガイドの残りでは、各手順で何が行われ、何が表示されるかを説明します。

**ターミナル操作を自分で行いたくない場合は？** アシスタントに[セットアップ用プロンプト](/ja-JP/installation/#install-with-your-ai-assistant)を貼り付けると、2つのコマンドを実行し、作成した内容を報告します。

> **何を作るかまだ決まっていませんか？ `/opsx:explore` から始めましょう。** リスクのない思考パートナーとしてコードベースを読み、選択肢を比較し、コードを書く前に曖昧なアイデアを具体的な計画にします。全体像が見えたら `/opsx:propose` に引き継ぎます。自信満々に間違ったものを作る AI と作業するうえで、最も効果的な習慣です。[Explore ガイド](/ja-JP/explore/)を参照してください。

## 仕組み

OpenSpec は、コードを書く前に何を構築するかについて、あなたと AI コーディングアシスタントが合意できるよう支援します。

**既定の簡易フロー（core プロファイル）:**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

何をすべきか検討中なら `/opsx:explore` から始め、すでに決まっているなら `/opsx:propose` に進んでください。Explore は既定のプロファイルに含まれているため、いつでも使えます。

**拡張フロー（カスタムワークフローの選択）:**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

既定のグローバルプロファイルは `core` で、`propose`、`explore`、`apply`、`update`、`sync`、`archive` が含まれます。`openspec config profile` で拡張ワークフローコマンドを有効にし、`openspec update` で適用できます。

## OpenSpec が作成するもの

`openspec init` を実行すると、プロジェクトに次の構成が作成されます。

```
openspec/
├── specs/              # 真実の情報源（システムの動作）
│   └── <domain>/
│       └── spec.md
├── changes/            # 提案する更新（change ごとに1フォルダー）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 差分仕様（変更内容）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # プロジェクト設定（任意）
```

**重要なディレクトリは2つです。**

- **`specs/`** — 真実の情報源です。現在のシステムの動作を仕様として記述します。ドメインごとに整理します（例: `specs/auth/`、`specs/payments/`）。

- **`changes/`** — 提案中の変更です。各 change に関連する成果物が専用フォルダーに格納されます。change が完了すると、その仕様がメインの `specs/` ディレクトリにマージされます。

## 成果物を理解する

各 change フォルダーには、作業を進めるための成果物が含まれます。

| 成果物 | 目的 |
|----------|---------|
| `proposal.md` | 「なぜ」「何を」 — 目的、範囲、方針を記録 |
| `specs/` | ADDED/MODIFIED/REMOVED の要件を示す差分仕様 |
| `design.md` | 「どのように」 — 技術的な方針とアーキテクチャ上の判断 |
| `tasks.md` | チェックボックス付きの実装チェックリスト |

**成果物は互いに積み重なります。**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            学びに合わせて更新
```

実装中に新しいことが分かったら、いつでも前の成果物に戻って内容を洗練できます。

## 差分仕様の仕組み

差分仕様は OpenSpec の重要な概念です。現在の仕様に対する変更点を示します。

### 形式

差分仕様では、変更の種類を節で示します。

```markdown
# Auth の差分

## ADDED Requirements

### Requirement: 二要素認証
システムはログイン時に第2要素を要求しなければならない。

#### Scenario: OTP が必要
- GIVEN 2FA を有効にしたユーザーがいる
- WHEN ユーザーが有効な認証情報を送信する
- THEN OTP チャレンジが表示される

## MODIFIED Requirements

### Requirement: セッションタイムアウト
システムは、30分間操作がなければセッションを期限切れにしなければならない。
(変更前: 60分)

#### Scenario: アイドルタイムアウト
- GIVEN 認証済みのセッションがある
- WHEN 操作せずに30分が経過する
- THEN セッションが無効になる

## REMOVED Requirements

### Requirement: ログイン状態を保持
(2FA に移行するため非推奨)
```

### アーカイブ時に行われること

change をアーカイブすると、次の処理が行われます。

1. **ADDED** 要件がメイン仕様に追加される
2. **MODIFIED** 要件が既存の内容を置き換える
3. **REMOVED** 要件がメイン仕様から削除される

監査履歴として change フォルダーが `openspec/changes/archive/` に移動します。

## 例: 最初の変更

アプリケーションにダークモードを追加する手順を見てみましょう。

### 1. change を開始する（既定）

```text
あなた: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ を作成しました
     ✓ proposal.md — 実施理由と変更内容
     ✓ specs/       — 要件とシナリオ
     ✓ design.md    — 技術的な方針
     ✓ tasks.md     — 実装チェックリスト
     実装を開始できます。
```

拡張ワークフロープロファイルを有効にしている場合は、`/opsx:new`、次に `/opsx:ff`（または `/opsx:continue` で段階的に進める）の2段階で行うこともできます。

### 2. 作成されるもの

**proposal.md** — 目的を記録します。

```markdown
# 提案: ダークモードを追加

## 目的
夜間の使用時に目の負担を軽減するため、ユーザーから
ダークモードの選択肢が求められています。

## 範囲
- 設定にテーマ切り替えを追加する
- システム設定の検出に対応する
- localStorage に設定を保存する

## 方針
テーマ設定には CSS カスタムプロパティを使い、状態管理には
React context を使います。
```

**specs/ui/spec.md** — 新しい要件を示す差分です。

```markdown
# UI の差分

## ADDED Requirements

### Requirement: テーマの選択
システムは、ユーザーがライトテーマとダークテーマを選択できるようにしなければならない。

#### Scenario: 手動切り替え
- GIVEN いずれかのページを表示しているユーザーがいる
- WHEN ユーザーがテーマ切り替えをクリックする
- THEN テーマがすぐに切り替わる
- AND 設定がセッションをまたいで保持される

#### Scenario: システム設定
- GIVEN 保存済みの設定がないユーザーがいる
- WHEN アプリケーションが読み込まれる
- THEN システムの優先カラースキームが使われる
```

**tasks.md** — 実装チェックリストです。

```markdown
# タスク

## 1. テーマ基盤
- [ ] 1.1 ライト/ダークの状態を持つ ThemeContext を作成する
- [ ] 1.2 色の CSS カスタムプロパティを追加する
- [ ] 1.3 localStorage への保存を実装する

## 2. UI コンポーネント
- [ ] 2.1 ThemeToggle コンポーネントを作成する
- [ ] 2.2 設定ページに切り替えを追加する
- [ ] 2.3 Header に簡易切り替えを追加する

## 3. スタイル
- [ ] 3.1 ダークテーマのカラーパレットを定義する
- [ ] 3.2 CSS 変数を使うようコンポーネントを更新する
```

### 3. 実装する

```
あなた: /opsx:apply

AI:  タスクを進めています...
     ✓ 1.1 ライト/ダークの状態を持つ ThemeContext を作成
     ✓ 1.2 globals.css に CSS カスタムプロパティを追加
     ✓ 1.3 localStorage への保存を実装
     ✓ 2.1 ThemeToggle コンポーネントを作成
     ...
     すべてのタスクが完了しました。
```

実装中に設計の調整が必要だと分かったら、成果物を更新して作業を続けてください。

### 4. アーカイブする

```
あなた: /opsx:archive

AI:  add-dark-mode をアーカイブしています...
     ✓ 仕様を openspec/specs/ui/spec.md にマージしました
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ に移動しました
     完了しました。次の機能に進めます。
```

これで差分仕様がメイン仕様の一部となり、システムの動作が記録されます。

## 検証とレビュー

CLI を使って変更を確認します。

```bash
# 作業中の change を一覧表示
openspec list

# change の詳細を表示
openspec show add-dark-mode

# 仕様の形式を検証
openspec validate add-dark-mode

# 対話型ダッシュボード
openspec view
```

## 次の手順

- [まず Explore](/ja-JP/explore/) — `/opsx:explore` でアイデアを検討してから change に着手する
- [変更のレビュー](/ja-JP/reviewing-changes/) — コードを書く前に、AI が下書きした計画を確認する
- [良い仕様を書く](/ja-JP/writing-specs/) — 優れた要件とシナリオとは
- [既存プロジェクトで OpenSpec を使う](/ja-JP/existing-projects/) — 大規模な既存コードベースで始める
- [変更の編集と反復](/ja-JP/editing-changes/) — 成果物の更新、前の段階への移動、手動編集との整合
- [コア概念の概要](/ja-JP/overview/) — 考え方の全体像を1ページで紹介
- [例とレシピ](/ja-JP/examples/) — 実際の変更を最初から最後まで紹介
- [ワークフロー](/ja-JP/workflows/) — よくあるパターンと各コマンドを使うタイミング
- [コマンド](/ja-JP/commands/) — すべてのスラッシュコマンドのリファレンス
- [概念](/ja-JP/concepts/) — 仕様、change、スキーマの詳しい説明
- [カスタマイズ](/ja-JP/customization/) — OpenSpec を自分のやり方に合わせる
- [Stores](/ja-JP/stores-beta/user-guide/) — リポジトリやチームをまたぐ計画には専用リポジトリを使用（ベータ）
- [よくある質問](/ja-JP/faq/)と[トラブルシューティング](/ja-JP/troubleshooting/) — 行き詰まったときに確認
