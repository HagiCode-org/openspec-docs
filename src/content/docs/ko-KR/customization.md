---
title: "사용자 지정"
---

OpenSpec은 세 가지 수준으로 사용자 지정할 수 있습니다.

| 수준 | 기능 | 적합한 대상 |
|-------|--------------|----------|
| **프로젝트 구성** | 기본값 설정, 컨텍스트/규칙 주입 | 대부분의 팀 |
| **사용자 지정 스키마** | 자체 워크플로 산출물 정의 | 고유한 프로세스를 가진 팀 |
| **전역 재정의** | 모든 프로젝트에서 스키마 공유 | 고급 사용자 |

---

## 프로젝트 구성

`openspec/config.yaml` 파일은 팀에 맞게 OpenSpec을 사용자 지정하는 가장 쉬운 방법입니다. 다음 작업을 수행할 수 있습니다.

- **기본 스키마 설정** — 모든 명령에서 `--schema` 생략
- **프로젝트 컨텍스트 주입** — AI가 기술 스택, 관례 등을 파악
- **산출물별 규칙 추가** — 특정 산출물에 적용할 사용자 지정 규칙
- **작업별 지침 추가** — apply 및 archive 작업에 권고할 선호 설정
- **통합 선택 사항 기억** — 예: [GitHub Copilot 클라우드 코딩 에이전트](/ko-KR/supported-tools/#github-copilot-cloud-coding-agent) 사용 여부

### 빠른 설정

```bash
openspec init
```

대화형으로 구성을 만드는 과정을 안내합니다. 또는 직접 구성 파일을 만드세요.

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones

operations:
  apply:
    guidance:
      - Run focused tests before the full suite
  archive:
    guidance:
      - Keep the completion summary concise

# Set by `openspec init` when you choose (or decline) the GitHub Copilot
# cloud coding agent; controls whether `init`/`update` generate its files.
githubCopilot:
  cloudAgent: false
```

### 작동 방식

**기본 스키마:**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**컨텍스트 및 규칙 주입:**

산출물을 생성할 때 컨텍스트와 규칙이 AI 프롬프트에 주입됩니다.

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **컨텍스트**는 모든 산출물에 포함됩니다.
- **규칙**은 해당 규칙이 적용되는 산출물에만 포함됩니다.

**작업 지침:**

`operations.apply.guidance`와 `operations.archive.guidance`는 에이전트가 해당 작업을 수행하는 방법에 대한 선택적 권고 지침 배열입니다. `rules`와는 별개입니다. 작업 지침은 산출물 내용을 제한하지 않으며 산출물 규칙을 작업 지침으로 이름만 바꾸지 않습니다.

apply와 archive는 실행할 때 다음 입력을 가져옵니다.

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

두 인터페이스 모두 현재 프로젝트 `context`와 일치하는 `operationGuidance`를 별도의 선택 필드로 반환합니다. 호출할 때마다 확인된 루트에서 최신 스냅샷을 읽습니다. `--store <id>`를 선택하면 변경 사항, 컨텍스트, 지침은 현재 저장소가 아니라 해당 store에서 가져옵니다. archive 지침 명령은 읽기 전용이며 델타 사양을 검사하거나 병합하고, 기본 사양을 작성하거나 변경 사항을 이동하거나 정적 보관 워크플로를 실행하지 않습니다.

프로젝트 컨텍스트는 프롬프트에 반드시 포함해야 하는 입력입니다. 생성된 워크플로는 컨텍스트를 읽고 관련 프로젝트 사실, 관례, 제약 조건을 적용합니다. 작업 지침은 선택적인 추가 조언입니다. 워크플로는 모든 항목을 고려하고 내장 워크플로에 적용 가능하며 호환되는 항목을 따릅니다.

두 필드는 CLI가 관리하는 상태, 확인된 경로, 내장 단계, 명시적 사용자 선택, 산출물 규칙과 별도로 유지됩니다. 워크플로는 우선 적용되는 값을 보존하면서 컨텍스트 충돌을 보고합니다. 적용할 수 없거나 충돌하는 지침은 따르지 않고 이유를 설명합니다. 두 필드 모두 강제되는 검사는 아니며 사용자가 별도로 요청하지 않는 한 워크플로가 해당 내용을 구현 파일, 사양, 변경 산출물, 요약에 복사하지 않습니다.

**보관 및 사양 동기화 입력의 안전성:**

Archive, bulk archive, 독립 실행 sync는
`openspec status --json`의 `artifactPaths.specs.existingOutputPaths`만 델타 사양의 원본으로 사용합니다. `specs` 산출물이 없는 스키마 또는 구체적인 출력 목록이 비어 있는 변경 사항은 동기화할 내용이 없습니다. 다른 산출물에서 델타 사양을 추론하지 않습니다.

의미 기반 병합에서 기본 사양을 작성하기 전에 워크플로는 현재
`openspec instructions specs --change <name> --json` output. The returned
`specs` 규칙을 가져와 병합으로 생성되는 기본 사양에만 적용합니다. 단일 archive는 해당 스냅샷을 내부 sync에 전달하고 독립 실행 sync는 직접 가져오며 bulk archive는 첫 사양 작성 전에 필요한 모든 스냅샷을 확보합니다. archive/specs 지침 응답이 0이 아닌 종료 코드로 끝나거나 JSON이 유효하지 않으면 입력이 비어 있는 것이 아니라 조회 실패입니다. 워크플로는 영향을 받는 사양을 작성하거나 변경 사항을 이동하기 전에 중지합니다(bulk archive에서는 일괄 작성 또는 이동 전에 중지).

이 구성은 archive 실행 단계, 사용자 프롬프트, 파일 시스템 작업, 의미 기반 병합의 소유권, 직접 실행하는 `openspec archive` 명령, 산출물 `rules`의 구조 및 출력을 변경하지 않습니다.

### 스키마 확인 순서

OpenSpec은 다음 순서로 스키마를 확인합니다.

1. CLI 플래그: `--schema <name>`
2. 변경 사항 메타데이터(변경 사항 폴더의 `.openspec.yaml`)
3. 프로젝트 구성(`openspec/config.yaml`)
4. 기본값(`spec-driven`)

---

## 사용자 지정 스키마

프로젝트 구성을 넘어 완전히 사용자 지정한 워크플로가 필요하면 직접 스키마를 만드세요. 사용자 지정 스키마는 프로젝트의 `openspec/schemas/` 디렉터리에 저장되며 코드와 함께 버전 관리됩니다.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### 기존 스키마 포크하기

사용자 지정의 가장 빠른 방법은 기본 제공 스키마를 포크하는 것입니다.

```bash
openspec schema fork spec-driven my-workflow
```

`spec-driven` 스키마 전체를 `openspec/schemas/my-workflow/`에 복사해 자유롭게 편집할 수 있습니다.

**생성되는 항목:**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

이제 `schema.yaml`을 편집해 워크플로를 바꾸거나 템플릿을 편집해 AI가 생성하는 내용을 변경하세요.

### 스키마를 처음부터 만들기

새 워크플로를 처음부터 만들려면 다음을 실행하세요.

```bash
# 대화형
openspec schema init research-first

# 비대화형
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 스키마 구조

스키마는 워크플로에 포함되는 산출물과 산출물 간 의존성을 정의합니다.

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**주요 필드:**

| 필드 | 목적 |
|-------|---------|
| `id` | 명령 및 규칙에서 사용하는 고유 식별자 |
| `generates` | 출력 파일 이름(`specs/**/*.md`와 같은 glob 지원) |
| `template` | `templates/` 디렉터리의 템플릿 파일 |
| `instruction` | 이 산출물을 생성하기 위한 AI 지침 |
| `requires` | 의존성 — 먼저 존재해야 하는 산출물 |

산출물을 작성하려는 순서대로 나열하세요. `requires`는 작성 가능한 항목을 결정하고 `artifacts:` 목록 순서는 여러 산출물이 동시에 준비됐을 때 먼저 처리할 항목을 결정합니다.

### 템플릿

템플릿은 AI의 작성을 안내하는 Markdown 파일입니다. 해당 산출물을 만들 때 프롬프트에 삽입됩니다.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

템플릿에는 다음 내용을 포함할 수 있습니다.
- AI가 채워야 할 섹션 제목
- AI 지침이 담긴 HTML 주석
- 기대하는 구조를 보여 주는 형식 예제

### 스키마 검증하기

사용자 지정 스키마를 사용하기 전에 검증하세요.

```bash
openspec schema validate my-workflow
```

다음 내용을 확인합니다.
- `schema.yaml` 구문이 올바른지
- 참조된 모든 템플릿이 존재하는지
- 순환 의존성이 없는지
- 산출물 ID가 유효한지

### 사용자 지정 스키마 사용하기

스키마를 만든 뒤 다음과 같이 사용하세요.

```bash
# 명령에서 지정
openspec new change feature --schema my-workflow

# 또는 config.yaml에서 기본값으로 설정
schema: my-workflow
```

### 스키마 확인 문제 디버깅하기

어떤 스키마가 사용되는지 확실하지 않나요? 다음 명령으로 확인하세요.

```bash
# 특정 스키마의 확인 위치 보기
openspec schema which my-workflow

# 사용 가능한 스키마 모두 나열
openspec schema which --all
```

출력에서 스키마가 프로젝트, 사용자 디렉터리, 패키지 중 어디에서 왔는지 확인할 수 있습니다.

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **참고:** OpenSpec은 프로젝트 간 공유를 위해 `~/.local/share/openspec/schemas/`에 사용자 수준 스키마를 두는 것도 지원하지만 코드와 함께 버전 관리할 수 있는 `openspec/schemas/`의 프로젝트 수준 스키마를 권장합니다.

---

## 예제

### 빠른 반복 워크플로

빠른 반복 작업을 위한 최소한의 워크플로입니다.

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 검토 산출물 추가하기

기본 스키마를 포크해 검토 단계를 추가하세요.

```bash
openspec schema fork spec-driven with-review
```

그런 다음 `schema.yaml`을 편집해 다음 내용을 추가하세요.

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## 커뮤니티 스키마

OpenSpec은 독립 저장소를 통해 배포되는 커뮤니티 관리 스키마도 지원합니다. 이는 다른 도구나 시스템과 OpenSpec을 통합하는 관점이 명확한 워크플로를 제공하며 spec-kit을 위한 [github/spec-kit 커뮤니티 확장 카탈로그](https://github.com/github/spec-kit/tree/main/extensions)와 비슷합니다.

커뮤니티 스키마는 OpenSpec 코어에 포함되지 않고 자체 릴리스 주기에 따라 각 저장소에서 관리됩니다. 사용하려면 스키마 묶음을 프로젝트의 `openspec/schemas/<schema-name>/` 디렉터리에 복사하세요(설치 방법은 각 저장소의 README 참조).

| 스키마 | 관리자 | 저장소 | 설명 |
|--------|-----------|-----------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | 구현 전에 변경 의도, 관찰 가능한 동작, 기술 설계, 장기적인 아키텍처 결정을 기록합니다. 변경 사항별 ADR 검토 매니페스트를 추가하고, 기준을 충족하는 장기 결정은 불변이며 대체 가능한 ADR로 작성합니다. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | OpenSpec의 산출물 거버넌스를 [obra/superpowers](https://github.com/obra/superpowers)의 실행 스킬(브레인스토밍, 계획 작성, 하위 에이전트를 통한 TDD, 코드 검토, 마무리)과 통합합니다. Superpowers에서 기본적으로 다루지 않는 부분을 채우는 증거 우선 `retrospective` 산출물을 추가합니다. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | 제품 관리 우선 워크플로입니다. [nanopm](https://github.com/nmrtn/nanopm)의 계획 파이프라인(audit → strategy → roadmap → PRD)을 구현 전에 실행합니다. 제품 계획을 OpenSpec의 사양 주도 엔지니어링 워크플로와 연결합니다. `.nanopm/`이 있으면 산출물에서 이를 읽습니다. 제안은 audit, 설계는 strategy, 작업은 PRD 분석을 기반으로 합니다. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | 기능 단위의 종단 간 테스트 실행 안내서입니다. 각 기능에는 불변 사양, 불변 작업 템플릿, 실행마다 타임스탬프가 포함된 실행 기록 하나가 제공됩니다. 단언은 관찰 가능한 동작만 대상으로 합니다(HTTP 상태, 응답 본문, 저장된 상태. 로그 부분 문자열은 사용하지 않음). 각 실행에는 시작/종료 UTC 시각, 소요 시간, 추정 LLM 토큰 소비량을 기록합니다. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | TDD 규율과 적대적 검토 단계를 포함하는 사양 주도 워크플로입니다. 순서: `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. `review`는 새 컨텍스트에서 읽기 전용으로 검토하는 담당자(가능하면 두 번째 모델)가 작성하고 에이전트에 `test-plan`, `tasks`, `apply`를 관문으로 삼으라고 지시하는 `VERDICT:` 줄을 출력합니다. OpenSpec은 산출물 존재 여부만 검사하므로 자체 CI 또는 훅에서 이 관문을 강제해야 합니다. `test-plan`은 각 사양 시나리오를 이름이 있는 테스트에 대응시키며 `verify`가 감사하는 red/green 기록 역할도 합니다. |

> 커뮤니티 스키마에 기여하고 싶나요? 저장소 링크를 포함한 이슈를 열거나 이 표에 항목을 추가하는 PR을 제출하세요.

---

## 관련 문서

- [CLI 참조: 스키마 명령](/ko-KR/cli/#schema-commands) — 전체 명령 설명
