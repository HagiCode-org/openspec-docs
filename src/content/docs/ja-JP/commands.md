---
title: "コマンド"
---

OpenSpec のスラッシュコマンドのリファレンスです。これらのコマンドは、Claude Code、Cursor、Devin Desktop など、AI コーディングアシスタントのチャット画面で実行します。

ワークフローのパターンと各コマンドを使うタイミングは[ワークフロー](/ja-JP/workflows/)、CLI コマンドは[CLI](/ja-JP/cli/)を参照してください。

このページでは `/opsx:<command>` を標準名として使います。一部のツールでは表記が異なります。Cursor と GitHub Copilot では `/opsx-propose`、Codex では `$openspec-propose` を使います。ツールに応じた形式は[呼び出し方法](/ja-JP/supported-tools/#how-to-invoke)で確認してください。OpenSpec が生成するファイルには、すでに適切な形式が使われています。

## クイックリファレンス

### 既定の簡易フロー（`core` プロファイル）

| コマンド | 目的 |
|---------|---------|
| `/opsx:propose` | change と計画成果物を一度に作成 |
| `/opsx:explore` | change に着手する前にアイデアを検討 |
| `/opsx:apply` | change のタスクを実装 |
| `/opsx:update` | change の計画成果物を見直し、一貫性を保つ |
| `/opsx:sync` | 差分仕様をメイン仕様にマージ |
| `/opsx:archive` | 完了した change をアーカイブ |

### 拡張ワークフローコマンド（カスタムワークフローの選択）

| コマンド | 目的 |
|---------|---------|
| `/opsx:new` | 新しい change のひな型を作成 |
| `/opsx:continue` | 依存関係に基づいて次の成果物を作成 |
| `/opsx:ff` | 一括作成: すべての計画成果物を一度に作成 |
| `/opsx:verify` | 実装が成果物に一致するか検証 |
| `/opsx:bulk-archive` | 複数の change を一度にアーカイブ |
| `/opsx:onboard` | ワークフロー全体をガイド付きで学ぶ |

既定のグローバルプロファイルは `core` です。拡張ワークフローコマンドを有効にするには、`openspec config profile` を実行してワークフローを選択し、プロジェクト内で `openspec update` を実行します。

---

## コマンドリファレンス

### `/opsx:propose`

新しい change を作成し、計画成果物を一度に生成します。`core` プロファイルの既定の開始コマンドです。

**構文:**
```text
/opsx:propose [change-name-or-description]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name-or-description` | いいえ | ケバブケースの名前、または変更内容を平易な言葉で記述 |

**動作:**
- `openspec/changes/<change-name>/` を作成
- 実装前に必要な成果物を生成（`spec-driven` の場合: proposal、specs、design、tasks）
- change が `/opsx:apply` を実行できる状態になったら停止

**例:**
```text
あなた: /opsx:propose add-dark-mode

AI:  openspec/changes/add-dark-mode/ を作成しました
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     実装を開始できます。/opsx:apply を実行してください。
```

**ヒント:**
- 最も速く最初から最後まで進める場合に使います。
- 成果物を段階的に制御したい場合は、拡張ワークフローを有効にして `/opsx:new` と `/opsx:continue` を使います。

---

### `/opsx:explore`

> **迷っている場合はここから始めましょう。** explore はリスクのない思考パートナーです。コードを書く前にコードベースを読み、選択肢を比較し、曖昧なアイデアを具体的な計画にします。既定のプロファイルに含まれます。詳しい説明とその他の例は[まず Explore](/ja-JP/explore/)ガイドを参照してください。

change に着手する前にアイデアを検討し、問題を調査し、要件を明確にします。

**構文:**
```
/opsx:explore [topic]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `topic` | いいえ | 調査または検討したい内容 |

**動作:**
- 決まった構成を必要としない探索的な対話を開始
- 質問に答えるためにコードベースを調査
- 選択肢や方針を比較
- 考えを明確にするための図を作成
- 依頼するか提示に同意すると、調査内容を記録。`openspec new change` で change のひな型を作成し、指定された計画成果物を作成するか、既存 change の成果物を更新
- 考えがまとまったら、既定の `/opsx:propose` または拡張ワークフローの `/opsx:new` に移行可能

**例:**
```text
あなた: /opsx:explore

AI:  何を調べましょうか？

あなた: モバイルアプリの認証にはどのように対応すればよいでしょうか？

AI:  現在の認証設定を調べます...
     [コードベースを分析]

     Web アプリではセッションベース認証を使っていますね。
     モバイル向けの主な選択肢は3つあります。

     1. JWT トークン（ステートレスで、オフラインでも動作）
     2. OAuth2（サードパーティログインが必要な場合）
     3. 現在のセッションを拡張（単純ですが、接続が必要）

     API にはすでに CORS が設定されています。どの方法に関心がありますか？

あなた: JWT で進めましょう。

AI:  その判断は記録しておくとよさそうです。
     add-jwt-auth という change を開始しましょうか？
     まず change フォルダーだけ作成し、他はまだ作成しません。

あなた: はい。

AI:  openspec/changes/add-jwt-auth/ を開始しました。
     指示をいただければ、今検討した内容を基に proposal、specs、tasks を
     作成します。
```

**ヒント:**
- 要件が不明確な場合や、調査が必要な場合に使います。
- コードを書くことはなく、依頼するか提示に同意しない限り、他の内容も書き込みません。
- 決定前に複数の方針を比較するのに適しています。
- ファイルを読み、コードベースを検索できます。

---

### `/opsx:new`

新しい change のひな型を作成します。change フォルダーを作り、`/opsx:continue` または `/opsx:ff` で成果物が生成されるのを待ちます。

このコマンドは拡張ワークフローセットの一部です（既定の `core` プロファイルには含まれません）。

**構文:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | change フォルダーの名前（省略すると入力を求められる） |
| `--schema` | いいえ | 使用するワークフロースキーマ（既定値: 設定または `spec-driven`） |

**動作:**
- `openspec/changes/<change-name>/` ディレクトリを作成
- change フォルダー内に `.openspec.yaml` メタデータファイルを作成
- 作成可能な最初の成果物テンプレートを表示
- change 名またはスキーマが指定されていない場合は入力を求める

**作成されるもの:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # change のメタデータ（スキーマ、作成日）
```

**例:**
```
あなた: /opsx:new add-dark-mode

AI:  openspec/changes/add-dark-mode/ を作成しました
     スキーマ: spec-driven

     作成可能: proposal
     作成するには /opsx:continue、すべての成果物を作成するには /opsx:ff を使ってください。
```

**ヒント:**
- `add-feature`、`fix-bug`、`refactor-module` のような説明的な名前を使います。
- `update`、`changes`、`wip` のような一般的な名前は避けます。
- スキーマはプロジェクト設定（`openspec/config.yaml`）でも指定できます。

---

### `/opsx:continue`

依存関係チェーンの次の成果物を作成します。段階的に進めるため、成果物を1つずつ作成します。

**構文:**
```
/opsx:continue [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 続行する change（省略すると文脈から推測） |

**動作:**
- 成果物の依存関係グラフを照会
- 作成可能な成果物とブロック中の成果物を表示
- 最初に作成可能な成果物を作成
- コンテキストとして依存ファイルを読み込む
- 作成後に利用可能となる成果物を表示

**例:**
```
あなた: /opsx:continue

AI:  change: add-dark-mode

     成果物の状態:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     specs を作成しています...

     [proposal.md を読み込み、要件に基づいて specs を作成]

     ✓ openspec/changes/add-dark-mode/specs/ui/spec.md を作成しました

     作成可能: design
     次の成果物を作成するには /opsx:continue を実行してください。
```

**ヒント:**
- 次に進む前に各成果物をレビューしたい場合に使います。
- 制御しながら進めたい複雑な change に適しています。
- 複数の成果物が同時に作成可能になる場合があります。
- 続行する前に、作成された成果物を編集できます。

---

### `/opsx:ff`

成果物の作成を一気に進め、すべての計画成果物を一度に作成します。

**構文:**
```
/opsx:ff [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 一気に進める change（省略すると文脈から推測） |

**動作:**
- 依存関係の順にすべての成果物を作成
- todo リストで進捗を追跡
- `apply-required` の成果物がすべて完了すると停止
- 次の成果物を作成する前に依存先を読み込む

**例:**
```
あなた: /opsx:ff add-dark-mode

AI:  add-dark-mode の作成を一気に進めています...

     ✓ proposal.md を作成
     ✓ specs/ui/spec.md を作成
     ✓ design.md を作成
     ✓ tasks.md を作成

     すべての計画成果物が完了しました。
     実装の準備ができました。開始するには /opsx:apply を実行してください。
```

**ヒント:**
- 作成するものが明確な場合に使います。
- 単純な change では `/opsx:continue` より速く進められます。
- 作成後に成果物を編集することもできます。
- 小〜中規模の機能に適しています。

---

### `/opsx:apply`

change のタスクを実装します。タスクリストに沿ってコードを書き、完了した項目にチェックを付けます。

**構文:**
```
/opsx:apply [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 実装する change（省略すると文脈から推測） |

**動作:**
- `tasks.md` を読み、未完了のタスクを特定
- タスクを1つずつ実施
- 必要に応じてコードを書き、ファイルを作成し、テストを実行
- `[x]` チェックボックスでタスクを完了として記録

**例:**
```
あなた: /opsx:apply

AI:  add-dark-mode を実装しています...

     tasks.md を読み込み中:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     1.1: ThemeContext の作成に取り組んでいます...
     [src/context/ThemeContext.tsx を作成]

     ✓ 1.1 完了

     1.2: CSS カスタムプロパティの追加に取り組んでいます...
     [src/styles/globals.css を更新]

     ✓ 1.2 完了
     ...
```

**ヒント:**
- 中断した場合、前回の続きから再開できます。
- 複数の change を並行する場合は change 名を指定します。
- 完了状態は `tasks.md` のチェックボックスで追跡されます。

---

### `/opsx:update`

change の既存の計画成果物を見直し、相互の一貫性を保ちます。変更対象は計画成果物のみで、コードは編集しません。

**構文:**

```text
/opsx:update [change-name]
```

**引数:**

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 更新する change（省略すると文脈から推測） |

**動作:**

- `openspec status --change <name> --json` を使って change の成果物を読み込む
- 指定された修正を適用するか、修正内容が指定されていない場合は成果物間の矛盾を確認
- 他の既存成果物との整合をあらゆる方向で取る（設計の編集が提案に影響することもある）
- 書き込む前に、成果物ごとに編集内容を確認
- 最後に次の手順を提案: `/opsx:continue`（未作成の成果物がある）、`/opsx:apply`（更新した計画をコードに反映）、`/opsx:archive`（すべて完了）

**ファイルが不足している場合:**

- `specs/**/*.md` のような glob 成果物で既存ファイルが1つ以上ある場合、update は不足している関連ファイルの作成を提案できます。スキーマの指示に従い、作成前に具体的なパスを確認します。
- ファイルがまだない成果物は `/opsx:continue` で作成します。意図的にスキップした成果物には触れません。
- 新しいファイルは change ディレクトリ内に作成する必要があります。確認済みのパスに作成前にファイルが現れた場合、update は上書きせず停止します。

**例:**

```text
あなた: /opsx:update add-dark-mode - テーマを localStorage ではなく Cookie に保存することにしました

AI:  add-dark-mode の成果物を読んでいます...

     設計では2箇所で localStorage に言及しています。タスク1.3は
     localStorage への保存を扱っていますが、提案には保存方法の記載がありません。

     修正案:
     1. design.md — localStorage を使う判断を Cookie に変更
     2. tasks.md — タスク1.3を Cookie への保存に合わせて修正

     修正案1を適用しますか？（design.md）
```

**ヒント:**

- ファイルのない成果物の作成は開始しません。その場合は `/opsx:continue` を有効にするか、その任意ワークフローが未インストールなら `openspec status` と `openspec instructions` を使ってください。
- change がすでに実装済みの場合は、更新後の計画にコードを合わせるため `/opsx:apply` を実行します。
- 修正によって change の *目的* が変わる場合は、新しい change を作成してください（[更新するか新しく始めるか](/ja-JP/opsx/#when-to-update-vs-start-fresh)を参照）。

---

### `/opsx:verify`

実装が change の成果物に一致するか検証します。完全性、正確性、一貫性を確認します。

**構文:**
```
/opsx:verify [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 検証する change（省略すると文脈から推測） |

**動作:**
- 実装品質を3つの観点で確認
- 実装を裏付ける情報をコードベースから検索
- CRITICAL、WARNING、SUGGESTION に分類して問題を報告
- アーカイブは妨げず、問題点を提示

**検証の観点:**

| 観点 | 検証内容 |
|-----------|-------------------|
| **完全性** | すべてのタスクが完了し、すべての要件が実装され、シナリオが網羅されている |
| **正確性** | 実装が仕様の意図に一致し、境界ケースに対応している |
| **一貫性** | 設計上の判断がコードに反映され、パターンが一貫している |

**例:**
```
あなた: /opsx:verify

AI:  add-dark-mode を検証しています...

     完全性
     ✓ tasks.md の8つのタスクすべてにチェック済み
     ✓ specs のすべての要件に対応するコードがある
     ⚠ シナリオ「システム設定の検出」がテストでカバーされていない

     正確性
     ✓ 実装が仕様の意図に一致
     ✓ シナリオの境界ケースに対応
     ✓ エラー状態が仕様の定義に一致

     一貫性
     ✓ 設計上の判断がコード構成に反映
     ✓ design.md と命名規約が一致
     ⚠ 設計では「CSS 変数」としていますが、実装では Tailwind クラスを使用

     サマリー
     ─────────────────────────────
     重大な問題: 0
     警告: 2
     アーカイブ可能: はい（警告あり）

     推奨事項:
     1. システム設定の検出に関するテストを追加
     2. Tailwind の使用を反映するよう design.md を更新するか、CSS 変数を使うようリファクタリング
```

**ヒント:**
- 不一致を早期に発見するため、アーカイブ前に実行します。
- 警告はアーカイブを妨げませんが、潜在的な問題を示します。
- コミット前に AI の作業をレビューするのに役立ちます。
- 成果物と実装のずれを見つけられます。

---

### `/opsx:sync`

**任意のコマンドです。** change の差分仕様をメイン仕様にマージします。必要な場合は archive が同期を確認するため、通常は手動で実行する必要はありません。

**構文:**
```
/opsx:sync [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | 同期する change（省略すると文脈から推測） |

**動作:**
- change フォルダーから差分仕様を読み込む
- ADDED/MODIFIED/REMOVED/RENAMED の各セクションを解析
- 変更をメインの `openspec/specs/` ディレクトリにマージ
- 差分に記載されていない既存の内容を保持
- change はアーカイブせず、作業中のままにする

**例:**
```text
あなた: /opsx:sync

AI:  add-dark-mode の差分仕様を同期しています...

     読み込み元: openspec/changes/add-dark-mode/specs/ui/spec.md
     対象:       openspec/specs/ui/spec.md

     適用する変更:
     ✓ ADDED: テーマ選択の要件（シナリオ2件）
     ✓ ADDED: アクセシビリティの要件（シナリオ1件）

     マージしています...
     ✓ openspec/specs/ui/spec.md を更新しました

     change は作業中のままです。完了したら /opsx:archive を実行してください。
```

**手動で実行する場合:**

| 状況 | sync を使うか |
|----------|-----------|
| 長期にわたる change で、アーカイブ前にメイン仕様を更新したい | はい |
| 複数の並行 change で更新後の基本仕様が必要 | はい |
| マージ内容を別途プレビュー/レビューしたい | はい |
| 簡単な change で、そのままアーカイブする | いいえ（archive が処理） |

**ヒント:**
- sync は単純なコピーではなく、内容を考慮してマージします。
- 要件を重複させずに、既存要件へシナリオを追加できます。
- sync 後も change は作業中のままです（アーカイブされません）。
- archive が必要に応じて確認するため、ほとんどのユーザーは直接実行する必要がありません。

---

### `/opsx:archive`

完了した change をアーカイブします。change を確定し、アーカイブフォルダーに移動します。

**構文:**
```
/opsx:archive [change-name]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-name` | いいえ | アーカイブする change（省略すると文脈から推測） |

**動作:**
- 成果物の完了状態を確認
- タスクの完了状態を確認（未完了の場合は警告）
- 未同期の場合、差分仕様の同期を提案
- change フォルダーを `openspec/changes/archive/YYYY-MM-DD-<name>/` に移動
- 監査証跡としてすべての成果物を保持

**例:**
```text
あなた: /opsx:archive

AI:  add-dark-mode をアーカイブしています...

     成果物の状態:
     ✓ proposal.md が存在
     ✓ specs/ が存在
     ✓ design.md が存在
     ✓ tasks.md が存在（8/8件のタスクが完了）

     差分仕様: 未同期
     → 今すぐ同期しますか？（推奨）

あなた: はい

AI:  ✓ 仕様を openspec/specs/ui/spec.md に同期しました
     ✓ openspec/changes/archive/2025-01-24-add-dark-mode/ に移動しました

     change をアーカイブしました。
```

**ヒント:**
- Archive は未完了タスクでブロックしませんが、警告を表示します。
- 差分仕様はアーカイブ中または事前に同期できます。
- アーカイブされた change は履歴として保持されます。
- 問題を見つけるために、先に `/opsx:verify` を使います。

---

### `/opsx:bulk-archive`

複数の完了済み change を一度にアーカイブします。change 間の仕様競合にも対応します。

**構文:**
```
/opsx:bulk-archive [change-names...]
```

**引数:**
| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `change-names` | いいえ | アーカイブする change（省略すると選択を求める） |

**動作:**
- 完了済みの change をすべて一覧表示
- アーカイブ前に各 change を検証
- change 間の仕様競合を検出
- 実際の実装を確認して競合を解決
- 時系列順にアーカイブ

**例:**
```
あなた: /opsx:bulk-archive

AI:  完了済みの change が3件見つかりました。
     - add-dark-mode（8/8件のタスクが完了）
     - fix-login-bug（3/3件のタスクが完了）
     - update-footer（2/2件のタスクが完了）

     仕様の競合を確認しています...
     ⚠ add-dark-mode と update-footer の両方が specs/ui/ を変更しています

     解決のためコードベースを確認しています...
     どちらの change も実装済みです。時系列順にマージします。
     1. add-dark-mode（1月20日作成）
     2. update-footer（1月22日作成）

     3件すべての change をアーカイブしますか？

あなた: はい

AI:  ✓ add-dark-mode をアーカイブしました
     ✓ fix-login-bug をアーカイブしました
     ✓ update-footer をアーカイブしました
     add-dark-mode → update-footer の順に仕様をマージしました
```

**ヒント:**
- 並行作業に適しています。
- エージェントがコードベースを確認して競合を解決します。
- change は作成順にアーカイブされます。
- 仕様内容を上書きする前に確認を求めます。

---

### `/opsx:onboard`

OpenSpec のワークフロー全体をガイド付きで学びます。実際のコードベースを使った対話型チュートリアルです。

**構文:**
```
/opsx:onboard
```

**動作:**
- 説明を交えながらワークフロー全体を進行
- 実際の改善機会を探してコードベースをスキャン
- 実際の成果物を伴う change を作成
- 実際の作業を実装（小さく安全な変更）
- 完了した change をアーカイブ
- 各手順をその場で説明

**手順:**
1. ようこそメッセージとコードベースの分析
2. 改善機会を発見
3. change を作成（`/opsx:new`）
4. 提案を作成
5. 仕様を作成
6. 設計を作成
7. タスクを作成
8. タスクを実装（`/opsx:apply`）
9. 実装を検証
10. change をアーカイブ
11. サマリーと次の手順

**例:**
```
あなた: /opsx:onboard

AI:  OpenSpec へようこそ。

     実際のコードベースを使って、ワークフロー全体を案内します。
     小さな改善点を見つけ、適切な change を作成して実装し、
     アーカイブします。

     コードベースから改善機会を探します...

     [コードベースを分析]

     改善できそうな項目がいくつか見つかりました。
     1. お問い合わせフォームに入力検証を追加
     2. 認証フローのエラーメッセージを改善
     3. 非同期ボタンに読み込み状態を追加

     どれに興味がありますか？（または別の案を提案してください）
```

**ヒント:**
- ワークフローを学ぶ新規ユーザーに最適です。
- 練習用の例ではなく、実際のコードを使います。
- 保持するか破棄するかを選べる実際の change を作成します。
- 完了まで15〜30分かかります。

---

## AI ツールごとのコマンド構文

AI ツールによってコマンド構文が少しずつ異なります。使用するツールに合った形式を使ってください。

| ツールのコマンドファイル | 構文例 | ツールの例 |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot (IDE), Trae, Oh My Pi |
| なし — スキルのみ | `/openspec-propose`、`/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, shared `.agents` |
| なし — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| なし — Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop と Devin Local:** `.devin/workflows/opsx-*.md` ファイルを使うと
> Devin Desktop では `/opsx-propose` を実行できます。Devin Local はワークフローに
> 対応しないため、OpenSpec が `.devin/skills/` に作成するスキル（例: `/openspec-propose`）を
> 使用してください。これらは両方のエージェントで使えます。

意図はどのツールでも同じですが、コマンドの表示方法は統合によって異なる場合があります。[呼び出し方法](/ja-JP/supported-tools/#how-to-invoke)に対応するすべてのツールを記載しています。この表は各形式の例のみを示します。

> **注:** GitHub Copilot のコマンド（`.github/prompts/*.prompt.md`）は IDE 拡張機能（VS Code、JetBrains、Visual Studio）でのみ利用できます。現在 GitHub Copilot CLI はカスタムプロンプトファイルに対応していません。詳細と回避策は[対応ツール](/ja-JP/supported-tools/)を参照してください。

---

## 従来のコマンド

これらのコマンドは、以前の「一括」ワークフローを使います。引き続き利用できますが、OPSX コマンドを推奨します。

| コマンド | 動作 |
|---------|--------------|
| `/openspec:proposal` | すべての成果物を一度に作成（proposal、specs、design、tasks） |
| `/openspec:apply` | change を実装 |
| `/openspec:archive` | change をアーカイブ |

**従来のコマンドを使う場合:**
- 旧ワークフローを使う既存プロジェクト
- 成果物を段階的に作成する必要がない単純な change
- 一括方式を使いたい場合

**OPSX への移行:**
従来方式の change は OPSX コマンドで続行できます。成果物の構成には互換性があります。

---

## トラブルシューティング

### 「Change not found」

コマンドが作業対象の change を特定できませんでした。

**解決策:**
- change 名を明示します: `/opsx:apply add-dark-mode`
- change フォルダーが存在するか確認します: `openspec list`
- 正しいプロジェクトディレクトリにいることを確認します。

### 「No artifacts ready」

すべての成果物が完了しているか、不足している依存先によってブロックされています。

**解決策:**
- `openspec status --change <name>` を実行し、何がブロックしているか確認します。
- 必要な成果物が存在するか確認します。
- 依存関係として必要な成果物を先に作成します。

### 「Schema not found」

指定されたスキーマが存在しません。

**解決策:**
- 利用可能なスキーマを一覧表示します: `openspec schemas`
- スキーマ名のスペルを確認します。
- カスタムスキーマの場合は作成します: `openspec schema init <name>`

### コマンドが認識されない

AI ツールが OpenSpec コマンドを認識しません。

**解決策:**
- OpenSpec が初期化されていることを確認します: `openspec init`
- スキルを再生成します: `openspec update`
- `.claude/skills/` ディレクトリがあるか確認します（Claude Code の場合）。
- 新しいスキルを認識させるため AI ツールを再起動します。

### 成果物が正しく生成されない

AI が不完全または誤った成果物を作成します。

**解決策:**
- `openspec/config.yaml` にプロジェクトのコンテキストを追加します。
- 詳細なガイダンスのため、成果物ごとのルールを追加します。
- change の説明をより詳しく記述します。
- より細かく制御するには `/opsx:ff` ではなく `/opsx:continue` を使います。

---

## 次の手順

- [ワークフロー](/ja-JP/workflows/) — よくあるパターンと各コマンドを使うタイミング
- [CLI](/ja-JP/cli/) — 管理と検証を行うターミナルコマンド
- [カスタマイズ](/ja-JP/customization/) — カスタムスキーマとワークフローを作成
