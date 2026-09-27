---
title: "多语言指南"
---

配置 OpenSpec，使其以英语以外的语言生成产物。

## 快速设置

新项目可在初始化时设置语言：

```bash
openspec init --language "Portuguese (pt-BR)"
```

这会将语言指令写入 `openspec/config.yaml`。如果项目已经有配置文件，请直接编辑其 `context` 字段，以保留现有项目指引。

你也可以手动配置相同的行为：

在 `openspec/config.yaml` 中添加语言指令：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

完成。此后生成的所有产物都会使用葡萄牙语。

OpenSpec 的文档结构以及规范性关键词 `SHALL`/`MUST` 保持英语，因为验证依赖这些内容。周围的需求和场景描述可以使用你选择的语言。

## 语言示例

### 葡萄牙语（巴西）

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 西班牙语

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 中文（简体）

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 日语

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 法语

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### 德语

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## 提示

### 处理技术术语

决定如何处理技术术语：

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 与其他上下文结合

语言设置可以与其他项目上下文一起使用：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 验证

要验证语言配置是否生效：

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## 相关文档

- [自定义指南](/zh-CN/customization/) - 项目配置选项
- [工作流指南](/zh-CN/workflows/) - 完整的工作流文档
