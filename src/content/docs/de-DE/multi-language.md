---
title: "Leitfaden zur Mehrsprachigkeit"
---

Konfigurieren Sie OpenSpec so, dass Artefakte auch in anderen Sprachen als Englisch erstellt werden.

## Schnelleinrichtung

Legen Sie bei einem neuen Projekt die Sprache während der Initialisierung fest:

```bash
openspec init --language "Portuguese (pt-BR)"
```

Dadurch wird die Sprachanweisung in `openspec/config.yaml` geschrieben. Wenn
das Projekt bereits eine Konfigurationsdatei besitzt, bearbeiten Sie direkt
deren Feld `context`, damit die vorhandenen Projekthinweise erhalten bleiben.

Sie können dasselbe Verhalten auch manuell konfigurieren:

Fügen Sie Ihrer `openspec/config.yaml` eine Sprachanweisung hinzu:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Das ist alles. Alle generierten Artefakte werden nun auf Portugiesisch verfasst.

Die Dokumentstruktur von OpenSpec und die normativen Schlüsselwörter
`SHALL`/`MUST` bleiben auf Englisch, da die Validierung von ihnen abhängt. Der
übrige Text der Anforderungen und Szenarien kann in der ausgewählten Sprache
verfasst werden.

## Sprachbeispiele

### Portugiesisch (Brasilien)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spanisch

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinesisch (vereinfacht)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japanisch

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Französisch

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Deutsch

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Tipps

### Umgang mit Fachbegriffen

Legen Sie fest, wie mit Fachbegriffen umgegangen werden soll:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Mit anderem Kontext kombinieren

Spracheinstellungen gelten zusätzlich zu Ihrem sonstigen Projektkontext:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Überprüfung

So überprüfen Sie, ob Ihre Sprachkonfiguration funktioniert:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Weiterführende Dokumentation

- [Anleitung zur Anpassung](/de-DE/customization/) – Konfigurationsoptionen für Projekte
- [Workflow-Leitfaden](/de-DE/workflows/) – vollständige Workflow-Dokumentation
