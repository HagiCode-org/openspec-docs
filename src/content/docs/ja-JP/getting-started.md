---
title: "はじめに"
---

このガイドでは、OpenSpec をインストールして初期化した後の使い方を説明します。インストール方法は、[README](https://github.com/Fission-AI/openspec/blob/dc37609827c8c3aba49e49347745f47aaa65cb1b/README.md#quick-start)または[インストールガイド](/ja-JP/installation/)を参照してください。ドキュメント全体を初めて読む場合は、[ドキュメントホーム](/ja-JP/)で全体像を確認できます。

> **これらのコマンドはどこに入力しますか？** 入力場所は2つあり、混同することが初心者が最もよくつまずく原因です。
>
> - `openspec ...` コマンド（`openspec init` など）は **ターミナル** で実行します。
> - `/opsx:...` コマンド（`/opsx:propose` など）は、コード作成を依頼するのと同じ **AI アシスタントとのチャット** で実行します。
>
> 別の「対話モード」を開始する必要はありません。チャットにスラッシュコマンドを入力すると、アシスタントが処理します。詳しくは[コマンドの実行方法](/ja-JP/how-commands-work/)を参照してください。

## 最初の5分

各手順の実行場所を示した全体の流れです。

```text
TERMINAL   $ curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

セットアップはターミナルで2手順。その後はチャットで作業します。（Windows、npm、その他のインストール方法は[インストール](/ja-JP/installation/)を参照してください。）このガイドの残りでは、各手順で何が行われ、何が表示されるかを説明します。

**ターミナル操作を自分で行いたくない場合は？** アシスタントに[セットアップ用 prompt](/ja-JP/installation/#ai-アシスタントを使ってインストールする)を貼り付けると、2つのコマンドを実行し、作成した内容を報告します。

> **何を作るかまだ決まっていませんか？ `/opsx:explore` から始めましょう。** リスクのない思考パートナーとしてコードベースを読み、選択肢を比較し、コードを書く前に曖昧なアイデアを具体的な計画にします。全体像が見えたら `/opsx:propose` に引き継ぎます。自信満々に間違ったものを作る AI と作業するうえで、最も効果的な習慣です。[Explore ガイド](/ja-JP/explore/)を参照してください。

## 仕組み

OpenSpec は、コードを書く前に何を構築するかについて、あなたと AI コーディングアシスタントが合意できるよう支援します。

**既定の簡易フロー（core profile）:**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

何をすべきか検討中なら `/opsx:explore` から始め、すでに決まっているなら `/opsx:propose` に進んでください。Explore は既定の profile に含まれているため、いつでも使えます。

**拡張フロー（カスタムワークフローの選択）:**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

既定のグローバル profile は `core` で、`propose`、`explore`、`apply`、`update`、`sync`、`archive` が含まれます。`openspec config profile` で拡張ワークフローコマンドを有効にし、`openspec update` で適用できます。

## OpenSpec が作成するもの

`openspec init` を実行すると、プロジェクトに次の構成が作成されます。

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**重要なディレクトリは2つです。**

- **`specs/`** — 真実の情報源です。現在のシステムの動作を仕様として記述します。ドメインごとに整理します（例：`specs/auth/`、`specs/payments/`）。

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
            update as you learn
```

実装中に新しいことが分かったら、いつでも前の成果物に戻って内容を洗練できます。

## 差分仕様の仕組み

差分仕様は OpenSpec の重要な概念です。現在の仕様に対する変更点を示します。

### 形式

差分仕様では、変更の種類を節で示します。

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### アーカイブ時に行われること

change をアーカイブすると、次の処理が行われます。

1. **ADDED** 要件がメイン仕様に追加される
2. **MODIFIED** 要件が既存の内容を置き換える
3. **REMOVED** 要件がメイン仕様から削除される

監査履歴として change フォルダーが `openspec/changes/archive/` に移動します。

## 例：最初の変更

アプリケーションにダークモードを追加する手順を見てみましょう。

### 1. change を開始する（既定）

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

拡張ワークフロー profile を有効にしている場合は、`/opsx:new`、次に `/opsx:ff`（または `/opsx:continue` で段階的に進める）の2段階で行うこともできます。

### 2. 作成されるもの

**proposal.md** — 目的を記録します。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — 新しい要件を示す差分です。

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — 実装チェックリストです。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 実装する

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

実装中に設計の調整が必要だと分かったら、成果物を更新して作業を続けてください。

### 4. アーカイブする

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

これで差分仕様がメイン仕様の一部となり、システムの動作が記録されます。

## 検証とレビュー

CLI を使って変更を確認します。

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
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
