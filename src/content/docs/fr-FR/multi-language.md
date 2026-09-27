---
title: "Guide multilingue"
---

Configurez OpenSpec pour générer des artefacts dans d'autres langues que l'anglais.

## Configuration rapide

Pour un nouveau projet, définissez la langue pendant l'initialisation :

```bash
openspec init --language "Portuguese (pt-BR)"
```

Cette commande inscrit l'instruction de langue dans `openspec/config.yaml`. Si le projet possède déjà une configuration, modifiez directement son champ `context` afin de préserver les consignes déjà présentes.

Vous pouvez aussi configurer le même comportement manuellement.

Ajoutez une instruction de langue à `openspec/config.yaml` :

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

C'est tout. Tous les artefacts générés seront désormais en portugais.

La structure documentaire d'OpenSpec et les mots-clés normatifs `SHALL`/`MUST` restent en anglais, car la validation s'appuie sur eux. Le texte des exigences et des scénarios qui les entoure peut être rédigé dans la langue choisie.

## Exemples de langues

### Portugais (Brésil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Espagnol

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinois (simplifié)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonais

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Français

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Allemand

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Conseils

### Gérer les termes techniques

Décidez du traitement des termes techniques :

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combiner avec d'autres consignes

Les paramètres de langue coexistent avec les autres consignes de votre projet :

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Vérification

Pour vérifier que la configuration linguistique fonctionne :

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentation associée

- [Guide de personnalisation](/fr-FR/customization/) — options de configuration du projet
- [Guide des workflows](/fr-FR/workflows/) — documentation complète des workflows
