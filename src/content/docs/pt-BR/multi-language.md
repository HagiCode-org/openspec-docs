---
title: "Guia de vários idiomas"
---

Configure o OpenSpec para gerar artefatos em idiomas diferentes do inglês.

## Configuração rápida

Em um projeto novo, defina o idioma durante a inicialização:

```bash
openspec init --language "Portuguese (pt-BR)"
```

Isso grava a instrução de idioma em `openspec/config.yaml`. Se o projeto
já tiver um arquivo de configuração, edite diretamente o campo `context` para
preservar as orientações existentes do projeto.

Você também pode configurar o mesmo comportamento manualmente:

Adicione uma instrução de idioma a `openspec/config.yaml`:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

Pronto. Agora todos os artefatos gerados estarão em português.

A estrutura dos documentos do OpenSpec e as palavras-chave normativas
`SHALL`/`MUST` permanecem em inglês porque a validação depende delas. O texto
dos requisitos e cenários pode estar no idioma escolhido.

## Exemplos de idiomas

### Português (Brasil)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### Spanish

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Chinese (Simplified)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japanese

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### French

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### German

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## Dicas

### Como lidar com termos técnicos

Decida como lidar com a terminologia técnica:

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### Combine com outros contextos

As configurações de idioma funcionam junto com os demais contextos do projeto:

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## Verificação

Para verificar se a configuração de idioma está funcionando:

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## Documentação relacionada

- [Guia de personalização](/pt-BR/customization/) — opções de configuração do projeto
- [Guia de fluxos de trabalho](/pt-BR/workflows/) — documentação completa do fluxo de trabalho
