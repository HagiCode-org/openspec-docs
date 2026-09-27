---
title: "Руководство по многоязычной работе"
---

Настройте OpenSpec для создания артефактов на языках, отличных от английского.

## Быстрая настройка

Для нового проекта укажите язык при инициализации:

```bash
openspec init --language "Portuguese (pt-BR)"
```

При этом указание языка добавляется в `openspec/config.yaml`. Если конфигурационный файл уже есть, измените непосредственно его поле `context`, чтобы сохранить существующие инструкции проекта.

То же поведение можно настроить вручную:

Добавьте в `openspec/config.yaml` инструкцию для выбранного языка:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Готово. Теперь все создаваемые артефакты будут на португальском языке.

Структура документов OpenSpec и нормативные ключевые слова `SHALL`/`MUST` остаются на английском, поскольку на них опирается проверка. Текст требований и сценариев вокруг них может быть на выбранном вами языке.

## Примеры для разных языков

### Португальский (Бразилия)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Испанский

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Китайский (упрощённый)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Японский

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Французский

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Немецкий

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Советы

### Работа с техническими терминами

Определите, как следует обращаться с технической терминологией:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Сочетание с другим контекстом

Языковые настройки действуют вместе с остальным контекстом проекта:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Проверка

Чтобы убедиться, что языковая настройка работает:

```bash
# Проверьте инструкции: в них должен отображаться языковой контекст
openspec instructions proposal --change my-change

# В выводе будет указан языковой контекст
```

## Связанная документация

- [Руководство по настройке](/ru-RU/customization/) — параметры конфигурации проекта
- [Руководство по рабочим процессам](/ru-RU/workflows/) — подробное описание рабочих процессов
