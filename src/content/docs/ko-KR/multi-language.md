---
title: "다국어 안내서"
---

OpenSpec이 영어 이외의 언어로 산출물을 생성하도록 구성합니다.

## 빠른 설정

새 프로젝트에서는 초기화할 때 언어를 지정하세요.

```bash
openspec init --language "Portuguese (pt-BR)"
```

언어 지침이 `openspec/config.yaml`에 기록됩니다. 프로젝트에 구성 파일이 이미 있다면 기존 지침을 보존할 수 있도록 `context` 필드를 직접 편집하세요.

같은 설정을 직접 구성할 수도 있습니다.

`openspec/config.yaml`에 언어 지침을 추가하세요.

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

이제 모든 산출물이 포르투갈어로 생성됩니다.

검증 과정에서 사용하므로 OpenSpec 문서 구조와 규범적 키워드 `SHALL`/`MUST`는 영어로 유지됩니다. 요구 사항 및 시나리오의 나머지 설명은 선택한 언어로 작성할 수 있습니다.

## 언어 예제

### 포르투갈어(브라질)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 스페인어

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 중국어(간체)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 일본어

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 프랑스어

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### 독일어

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## 팁

### 기술 용어 처리

기술 용어를 어떻게 처리할지 정하세요.

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 다른 컨텍스트와 함께 사용하기

언어 설정은 프로젝트의 다른 컨텍스트와 함께 적용됩니다.

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 확인

언어 설정이 적용되는지 확인하려면 다음을 실행하세요.

```bash
# Check the instructions - should show your language context
openspec instructions proposal --change my-change

# Output will include your language context
```

## 관련 문서

- [사용자 지정 안내서](/ko-KR/customization/) — 프로젝트 구성 옵션
- [워크플로 안내서](/ko-KR/workflows/) — 전체 워크플로 문서
