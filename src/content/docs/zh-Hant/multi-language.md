---
title: "多語言指南"
---

設定 OpenSpec，使其以英語以外的語言生成產物。

## 快速設定

新專案可在初始化時設定語言：

```bash
openspec init --language "Portuguese (pt-BR)"
```

這會將語言指令寫入 `openspec/config.yaml`。如果專案已經有設定檔案，請直接編輯其 `context` 欄位，以保留現有專案指引。

你也可以手動設定相同的行為：

在 `openspec/config.yaml` 中新增語言指令：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

完成。此後生成的所有產物都會使用葡萄牙語。

OpenSpec 的文件結構以及規範性關鍵詞 `SHALL`/`MUST` 保持英語，因為驗證依賴這些內容。周圍的需求和情境描述可以使用你選擇的語言。

## 語言範例

### 葡萄牙語（巴西）

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 西班牙語

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 中文（簡體）

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 日語

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 法語

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### 德語

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## 提示

### 處理技術術語

決定如何處理技術術語：

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 與其他上下文結合

語言設定可以與其他專案上下文一起使用：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 驗證

要驗證語言設定是否生效：

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## 相關文件

- [自訂指南](/zh-Hant/customization/) - 專案設定選項
- [工作流程指南](/zh-Hant/workflows/) - 完整的工作流程文件
