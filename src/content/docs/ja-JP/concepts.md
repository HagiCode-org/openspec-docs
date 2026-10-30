---
title: "概念"
---

このガイドでは、OpenSpec の基本概念と、それらがどのように関係するかを説明します。実践的な使い方は[はじめに](/ja-JP/getting-started/)と[ワークフロー](/ja-JP/workflows/)を参照してください。

## 基本理念

OpenSpec は4つの原則を基礎としています。

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### これらの原則が重要な理由

**柔軟であり、硬直しない。** 従来の仕様システムでは、まず計画し、次に実装し、最後に完了するというフェーズに固定されます。OpenSpec はより柔軟で、作業に合った任意の順序で成果物を作成できます。

**反復的であり、ウォーターフォールではない。** 要件は変化し、理解は深まります。最初はよいと思えた方法も、コードベースを確認した後では適切でないかもしれません。OpenSpec はこの現実を受け入れます。

**簡単であり、複雑ではない。** 仕様フレームワークの中には、広範なセットアップ、厳格な形式、重いプロセスを必要とするものがあります。OpenSpec は作業を妨げません。数秒で初期化してすぐに始められ、必要な場合だけカスタマイズできます。

**既存システムを重視。** ソフトウェア開発の多くはゼロからの構築ではなく、既存システムの変更です。OpenSpec の差分ベースの方法では、新しいシステムの説明だけでなく、既存の動作に対する変更も簡単に仕様化できます。

## 全体像

OpenSpec では作業を2つの主要領域に整理します。

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**仕様** は真実の情報源であり、現在のシステムの動作を記述します。

**変更** は提案中の修正であり、マージする準備ができるまで別々のフォルダーに保存されます。

この分離が重要です。複数の変更を競合せずに並行して進められます。メインの仕様に影響する前に変更をレビューできます。変更をアーカイブすると、その差分が真実の情報源に整然とマージされます。

## 仕様

仕様では、構造化された要件とシナリオを使ってシステムの動作を記述します。

### 構成

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

仕様はシステムにとって意味のある論理的なまとまりであるドメインごとに整理します。一般的なパターンは次のとおりです。

- **機能領域ごと：** `auth/`、`payments/`、`search/`
- **コンポーネントごと：** `api/`、`frontend/`、`workers/`
- **境界づけられたコンテキストごと：** `ordering/`、`fulfillment/`、`inventory/`

### 仕様の形式

仕様には要件が含まれ、各要件にはシナリオがあります。

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**主な要素：**

| 要素 | 目的 |
|---------|---------|
| `## Purpose` | 仕様のドメインを大まかに説明 |
| `### Requirement:` | システムが備えるべき具体的な動作 |
| `#### Scenario:` | 要件の動作を示す具体例 |
| SHALL/MUST/SHOULD | 要件の強さを示す RFC 2119 キーワード |

### このように仕様を構成する理由

**要件は「何をするか」** を示します。実装方法を指定せずに、システムが何をすべきかを記述します。

**シナリオは「どのような場合に」** を示します。検証可能な具体例を提供します。良いシナリオは次のようなものです。
- テスト可能（自動テストを作成できる）
- 正常系と境界ケースの両方をカバーする
- Given/When/Then または同様の構造化形式を使う

**RFC 2119 キーワード**（SHALL、MUST、SHOULD、MAY）は意図を伝えます。
- **MUST/SHALL** — 絶対的な要件
- **SHOULD** — 推奨されるが、例外を認める
- **MAY** — 任意

### 仕様に含めるもの・含めないもの

仕様は **動作に関する契約** であり、実装計画ではありません。

仕様に含める内容：
- ユーザーや下流システムが依存する、観測可能な動作
- 入力、出力、エラー条件
- 外部制約（セキュリティ、プライバシー、信頼性、互換性）
- テストまたは明示的な検証が可能なシナリオ

仕様に含めない内容：
- 内部のクラス名や関数名
- ライブラリやフレームワークの選択
- 実装の詳細な手順
- 詳細な作業計画（`design.md` または `tasks.md` に記述）

簡単な判断基準：
- 外部から見える動作を変えずに実装を変更できるなら、おそらく仕様に含める内容ではありません。

### 軽量さを保つ：段階的な厳密さ

OpenSpec は官僚的な手続きを避けることを目指しています。変更を検証できる範囲で、最も軽いレベルを使ってください。

**Lite 仕様（既定）:**
- 動作を中心にした短い要件
- 明確な範囲と対象外事項
- いくつかの具体的な受け入れ確認

**Full 仕様（高リスク向け）:**
- チームやリポジトリをまたぐ変更
- API/契約の変更、移行、セキュリティ/プライバシー上の懸念
- 曖昧さが高コストの手戻りにつながる可能性がある変更

ほとんどの変更は Lite モードで十分です。

### 人間とエージェントの協働

多くのチームでは、人間が検討し、エージェントが成果物を下書きします。想定される流れは次のとおりです。

1. 人間が目的、コンテキスト、制約を提供する。
2. エージェントがそれを動作中心の要件とシナリオに変換する。
3. エージェントは実装の詳細を `spec.md` ではなく `design.md` と `tasks.md` に記述する。
4. 実装前に検証し、構成と明確さを確認する。

これによって仕様が人間にとって読みやすく、エージェントにとって一貫したものになります。

## 変更

change は、システムに対する変更案をフォルダーにまとめたものです。理解と実装に必要な内容がすべて含まれます。

### change の構成

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities, plus your own x-* keys
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

各 change は自己完結しており、次のものを含みます。
- **成果物** — 目的、設計、タスクを記録するドキュメント
- **差分仕様** — 追加、変更、削除する内容の仕様
- **メタデータ** — この change 固有の任意の設定

### change をフォルダーにする理由

変更をフォルダーにまとめることには、次の利点があります。

1. **すべてを一か所に。** 提案、設計、タスク、仕様を1つの場所に保存するため、あちこち探す必要がありません。

2. **並行作業。** 複数の change を競合せずに同時に進められます。`fix-auth-bug` の作業中に `add-dark-mode` に取り組めます。

3. **明確な履歴。** アーカイブすると、変更はすべての文脈を保ったまま `changes/archive/` に移動します。後から何が変わったかだけでなく、その理由も確認できます。

4. **レビューしやすい。** change フォルダーを開いて提案を読み、設計を確認し、仕様の差分を見るだけです。

## 成果物

成果物は、change 内で作業を導くドキュメントです。

### 成果物の流れ

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

成果物は互いに積み重なります。それぞれの成果物が次のものにコンテキストを与えます。

### 成果物の種類

#### 提案（`proposal.md`）

提案では、**目的**、**範囲**、**方針**を大まかに記録します。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**提案を更新するタイミング：**
- 範囲が変わった（縮小または拡大した）
- 目的が明確になった（問題をより深く理解できた）
- 方針が根本的に変わった

#### 仕様（`specs/` 以下の差分仕様）

差分仕様は、現在の仕様に対して **何が変わるか** を記述します。下記の[差分仕様](#差分仕様)を参照してください。

#### 設計（`design.md`）

設計では、**技術的な方針** と **アーキテクチャ上の判断** を記録します。

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**設計を更新するタイミング：**
- 実装により方針がうまくいかないと分かった
- より良い解決策が見つかった
- 依存関係や制約が変わった

#### タスク（`tasks.md`）

タスクは **実装チェックリスト** であり、チェックボックス付きの具体的な手順です。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**タスク作成のベストプラクティス：**
- 関連するタスクを見出しの下にまとめる
- 階層的な番号（1.1、1.2 など）を使う
- 1回のセッションで完了できる大きさにする
- 各タスクの検証方法（テスト、コマンド、または観測可能な結果）を記載する
- 各グループに必要なテストとドキュメントは、そのグループに含める。最後にまとめて対応するグループを作らない
- 完了したタスクにチェックを付ける

## 差分仕様

差分仕様は、OpenSpec が既存システムの開発で機能するための重要な概念です。仕様全体を書き直すのではなく、**何が変わるか** を記述します。

### 形式

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### 差分の節

| 節 | 意味 | アーカイブ時の処理 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新しい動作 | メイン仕様に追加 |
| `## MODIFIED Requirements` | 変更された動作 | 既存要件を置き換える |
| `## REMOVED Requirements` | 廃止する動作 | メイン仕様から削除。最後の要件を削除すると機能が廃止され、その change に `retire_capabilities: true` が指定されている場合は仕様ファイルも削除される |
| `## Purpose` | 新しい機能の目的 | 作成するメイン仕様の Purpose に設定。仕様がすでにある場合は無視 |

### 仕様全体ではなく差分を使う理由

**明確さ。** 差分には変更点が正確に示されます。仕様全体を読む場合、現在のバージョンと頭の中で比較する必要があります。

**競合の回避。** 異なる要件を変更する限り、2つの change が同じ仕様ファイルを扱っても競合しません。

**効率的なレビュー。** レビュアーは変更箇所を確認し、変更されていない文脈を読み込まずに済みます。重要な点に集中できます。

**既存システムとの相性。** 作業のほとんどは既存の動作を変更することです。差分によって、変更を後付けではなく中心的に扱えます。

## スキーマ

スキーマでは、ワークフローの成果物の種類と依存関係を定義します。

### スキーマの仕組み

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**成果物は依存関係グラフを形成します。**

```
                    proposal
                   (root node)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**依存関係は、助けであり関門ではありません。** 次に必ず作る成果物ではなく、作成可能なものを示します。不要なら design を省略できます。specs と design はどちらも proposal のみに依存するため、どちらを先に作成してもかまいません。

### 組み込みスキーマ

**spec-driven** (default)

仕様駆動開発の標準ワークフローです。

```
proposal → specs → design → tasks → implement
```

最適な用途：実装前に仕様について合意したい、ほとんどの機能開発。

### カスタムスキーマ

チームのワークフローに合わせてカスタムスキーマを作成します。

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**カスタムスキーマの例：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

カスタムスキーマの作成と使用の詳細は、[カスタマイズ](/ja-JP/customization/)を参照してください。

## アーカイブ

アーカイブでは、差分仕様をメイン仕様にマージして change を完了し、履歴として保存します。

### アーカイブ時の処理

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### アーカイブの手順

1. **差分をマージする。** 差分仕様の各節（ADDED/MODIFIED/REMOVED）を対応するメイン仕様に適用します。

2. **アーカイブに移動する。** change フォルダーは、時系列に並べるための日付プレフィックスを付けて `changes/archive/` に移動します。

3. **コンテキストを保持する。** すべての成果物がアーカイブにそのまま残ります。後から変更の理由をいつでも確認できます。

### アーカイブが重要な理由

**整理された状態。** 作業中の change（`changes/`）には進行中の作業のみが表示されます。完了した作業は別の場所に移動します。

**監査証跡。** アーカイブでは各 change のすべての文脈が保持されます。変更内容だけでなく、理由を説明する提案、方法を説明する設計、実施した作業を示すタスクも残ります。

**仕様の進化。** change のアーカイブに伴って仕様が自然に充実します。アーカイブごとに差分がマージされ、時間をかけて包括的な仕様が形成されます。

## 全体のつながり

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**好循環：**

1. 仕様が現在の動作を記述する
2. change が差分として修正を提案する
3. 実装によって変更が実現する
4. アーカイブが差分を仕様にマージする
5. 仕様が新しい動作を記述する
6. 次の change が更新済みの仕様を基礎にする

## 用語集

| 用語 | 定義 |
|------|------------|
| **Artifact（成果物）** | change 内のドキュメント（提案、設計、タスク、差分仕様など） |
| **Archive（アーカイブ）** | change を完了し、その差分をメイン仕様にマージするプロセス |
| **Change（変更）** | 成果物とともにフォルダーにまとめられた、システムへの変更案 |
| **Delta spec（差分仕様）** | 現在の仕様に対する変更（ADDED/MODIFIED/REMOVED）を記述した仕様 |
| **Domain（ドメイン）** | 仕様を論理的にまとめたもの（例：`auth/`、`payments/`） |
| **Requirement（要件）** | システムが備えるべき具体的な動作 |
| **Scenario（シナリオ）** | 要件の具体例。通常は Given/When/Then 形式で記述 |
| **Schema（スキーマ）** | 成果物の種類とその依存関係の定義 |
| **Spec（仕様）** | 要件とシナリオを含み、システムの動作を記述する仕様書 |
| **Source of truth（真実の情報源）** | 現在の合意済みの動作を含む `openspec/specs/` ディレクトリ |

## 次の手順

- [はじめに](/ja-JP/getting-started/) — 実践的な最初の手順
- [ワークフロー](/ja-JP/workflows/) — よくあるパターンとその使い分け
- [コマンド](/ja-JP/commands/) — コマンドの完全なリファレンス
- [カスタマイズ](/ja-JP/customization/) — カスタムスキーマの作成とプロジェクトの設定
