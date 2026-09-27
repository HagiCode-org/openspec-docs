---
title: "Guía multilingüe"
---

Configura OpenSpec para que genere artefactos en idiomas distintos del inglés.

## Configuración rápida

En un proyecto nuevo, establece el idioma durante la inicialización:

```bash
openspec init --language "Portuguese (pt-BR)"
```

Esto escribe la instrucción de idioma en `openspec/config.yaml`. Si el proyecto
ya tiene un archivo de configuración, edita directamente el campo `context`
para conservar las instrucciones existentes del proyecto.

También puedes configurar este comportamiento manualmente:

Añade una instrucción de idioma a `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Eso es todo. A partir de ahora, todos los artefactos generados estarán en portugués.

La estructura de los documentos de OpenSpec y las palabras clave normativas
`SHALL`/`MUST` se mantienen en inglés porque la validación depende de ellas.
El texto de requisitos y escenarios puede estar en el idioma que elijas.

## Ejemplos de idiomas

### Portugués (Brasil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Español

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chino (simplificado)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonés

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Francés

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Alemán

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Consejos

### Cómo tratar los términos técnicos

Decide cómo tratar la terminología técnica:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combinar con otro contexto

La configuración del idioma se combina con el resto del contexto del proyecto:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verificación

Para comprobar que la configuración de idioma funciona:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentación relacionada

- [Guía de personalización](/es-ES/customization/) — opciones de configuración del proyecto
- [Guía de flujos de trabajo](/es-ES/workflows/) — documentación completa del flujo
