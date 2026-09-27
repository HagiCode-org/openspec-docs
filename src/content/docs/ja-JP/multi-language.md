---
title: "多言語ガイド"
---

OpenSpec が英語以外の言語で成果物を生成するよう設定します。

## クイックセットアップ

新規プロジェクトでは、初期化時に言語を設定します。

```bash
openspec init --language "Portuguese (pt-BR)"
```

言語の指示が `openspec/config.yaml` に書き込まれます。プロジェクトに設定ファイルがすでにある場合は、既存のプロジェクト向けガイダンスを保持できるように、`context` フィールドを直接編集してください。

同じ動作を手動で設定することもできます。

`openspec/config.yaml` に言語の指示を追加します。

```yaml
schema: spec-driven

context: |
  言語: ポルトガル語（ブラジル、pt-BR）
  すべての成果物はブラジルポルトガル語で記述してください。
  OpenSpec の構造見出しと SHALL/MUST キーワードは英語のままにしてください。

  # その他のプロジェクトコンテキストを以下に記述...
  技術スタック: TypeScript、React、Node.js
```

これで完了です。以降、生成されるすべての成果物がポルトガル語になります。

検証で使用されるため、OpenSpec のドキュメント構造と規範キーワード `SHALL`/`MUST` は英語のままにします。要件やシナリオの周辺の文章には、選択した言語を使用できます。

## 言語の設定例

### ポルトガル語（ブラジル）

```yaml
context: |
  言語: ポルトガル語（ブラジル、pt-BR）
  すべての成果物はブラジルポルトガル語で記述してください。
```

### スペイン語

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 中国語（簡体字）

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 日本語

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### フランス語

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### ドイツ語

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## ヒント

### 技術用語を扱う

技術用語の扱いを決めます。

```yaml
context: |
  言語: 日本語
  日本語で記述しますが、次の点に従ってください。
  - "API"、"REST"、"GraphQL" などの技術用語は英語のままにする
  - コード例とファイルパスは英語のままにする
```

### 他のコンテキストと組み合わせる

言語設定は、他のプロジェクトコンテキストと併用できます。

```yaml
schema: spec-driven

context: |
  言語: ポルトガル語（ブラジル、pt-BR）
  すべての成果物はブラジルポルトガル語で記述してください。

  技術スタック: TypeScript、React 18、Node.js 20
  データベース: Prisma ORM を使用する PostgreSQL
```

## 設定の確認

言語設定が機能していることを確認するには、次を実行します。

```bash
# 指示を確認する — 言語コンテキストが表示されるはずです
openspec instructions proposal --change my-change

# 出力に言語コンテキストが含まれます
```

## 関連ドキュメント

- [カスタマイズガイド](/ja-JP/customization/) — プロジェクト設定のオプション
- [ワークフローガイド](/ja-JP/workflows/) — ワークフローの全体的な説明
