---
title: "OPSX 워크플로"
---

> [Discord](https://discord.gg/YctCnvvshC)에서 의견을 들려주세요.

## OPSX란?

OPSX는 이제 OpenSpec의 표준 워크플로입니다.

OpenSpec 변경 사항을 위한 **유연하고 반복적인 워크플로**입니다. 경직된 단계 대신 언제든 수행할 수 있는 동작만 있습니다.

## OPSX가 만들어진 이유

기존 OpenSpec 워크플로는 작동하지만 **제한적**입니다.

- **지침이 하드코딩됨** — TypeScript 내부에 숨겨져 있어 수정할 수 없습니다.
- **전부 아니면 전무** — 큰 명령 하나로 모든 내용을 만들며 개별 부분을 테스트할 수 없습니다.
- **고정된 구조** — 모두가 같은 워크플로를 사용하며 사용자 지정할 수 없습니다.
- **블랙박스** — AI 출력이 좋지 않아도 프롬프트를 조정할 수 없습니다.

**OPSX는 이를 개방합니다.** 이제 누구나 다음 작업을 할 수 있습니다.

1. **지침 실험** — 템플릿을 편집하고 AI 결과가 개선되는지 확인
2. **세분화된 테스트** — 각 산출물의 지침을 독립적으로 검증
3. **워크플로 사용자 지정** — 자체 산출물과 의존성을 정의
4. **빠른 반복** — 템플릿을 변경하고 빌드 없이 즉시 테스트

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**누구나 사용할 수 있습니다.**
- **팀** — 실제 작업 방식에 맞는 워크플로 생성
- **고급 사용자** — 코드베이스에 맞게 프롬프트를 조정해 AI 출력 개선
- **OpenSpec 기여자** — 릴리스 없이 새로운 접근 방식 실험

모두가 아직 최선의 방법을 찾아가는 중입니다. OPSX를 통해 함께 배울 수 있습니다.

## 사용자 경험

**선형 워크플로의 문제:**
"계획 단계"를 거쳐 "구현 단계"로 이동한 뒤 "완료"합니다. 하지만 실제 작업은 그렇게 진행되지 않습니다. 무언가를 구현하다 설계가 잘못됐음을 깨닫고 사양을 업데이트한 다음 다시 구현해야 할 수 있습니다. 선형적인 단계는 실제 작업 방식에 맞지 않습니다.

**OPSX의 접근 방식:**
- **단계가 아닌 동작** — 생성, 구현, 업데이트, 보관을 언제든 수행할 수 있습니다.
- **의존성은 촉진 요소** — 다음에 가능한 작업을 보여 줄 뿐 다음 작업을 강제하지 않습니다.

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## 설정

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

AI 코딩 어시스턴트가 자동으로 검색하는 스킬을 `.claude/skills/`(또는 이에 해당하는 위치)에 생성합니다.

기본적으로 OpenSpec은 `core` 워크플로 프로필(`propose`, `explore`, `apply`, `update`, `sync`, `archive`)을 사용합니다. 확장 워크플로 명령(`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard)을 사용하려면 `openspec config profile`로 구성하고 `openspec update`를 실행해 적용하세요.

설정 과정에서 **프로젝트 구성**(`openspec/config.yaml`)을 만들지 묻습니다. 선택 사항이지만 권장합니다.

## 프로젝트 구성

프로젝트 구성에서 기본값을 설정하고 프로젝트별 컨텍스트를 모든 산출물에 주입할 수 있습니다.

### 구성 만들기

구성 파일은 `openspec init`에서 생성하거나 직접 만들 수 있습니다.

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### 구성 필드

| 필드 | 유형 | 설명 |
|-------|------|-------------|
| `schema` | 문자열 | 새 변경 사항의 기본 스키마(예: `spec-driven`) |
| `context` | 문자열 | 모든 산출물 지침에 주입되는 프로젝트 컨텍스트 |
| `rules` | 객체 | 산출물 ID를 키로 사용하는 산출물별 규칙 |

### 작동 방식

**스키마 우선순위**(높은 순):
1. CLI 플래그(`--schema <name>`)
2. 변경 사항 메타데이터(변경 사항 디렉터리의 `.openspec.yaml`)
3. 프로젝트 구성(`openspec/config.yaml`)
4. 기본값(`spec-driven`)

**컨텍스트 주입:**
- 모든 산출물 지침 앞에 컨텍스트를 추가합니다.
- `<context>...</context>` 태그로 감쌉니다.
- AI가 프로젝트 관례를 이해하도록 돕습니다.

**규칙 주입:**
- 일치하는 산출물에만 규칙을 주입합니다.
- `<rules>...</rules>` 태그로 감쌉니다.
- 컨텍스트 뒤, 템플릿 앞에 표시됩니다.

### 스키마별 산출물 ID

**spec-driven**(기본값):
- `proposal` — 변경 사항 제안
- `specs` — 사양
- `design` — 기술 설계
- `tasks` — 구현 작업

### 구성 검증

- `rules`의 알 수 없는 산출물 ID는 경고를 생성합니다.
- 스키마 이름을 사용 가능한 스키마와 대조해 검증합니다.
- 컨텍스트는 최대 50KB까지 허용됩니다.
- 유효하지 않은 YAML은 줄 번호와 함께 보고됩니다.

### 문제 해결

**"Unknown artifact ID in rules: X"**
- 산출물 ID가 스키마와 일치하는지 확인합니다(위 목록 참조).
- 스키마별 산출물 ID를 보려면 `openspec schemas --json`을 실행합니다.

**구성이 적용되지 않음:**
- 파일이 `.yml`이 아니라 `openspec/config.yaml`에 있는지 확인합니다.
- 검증기로 YAML 구문을 확인합니다.
- 구성 변경 사항은 즉시 적용되므로 다시 시작할 필요가 없습니다.

**컨텍스트가 너무 큼:**
- 컨텍스트는 50KB로 제한됩니다.
- 내용을 요약하거나 외부 문서 링크를 추가하세요.

## 명령

| 명령 | 기능 |
|---------|--------------|
| `/opsx:propose` | 변경 사항을 만들고 계획 산출물을 한 단계에서 생성(기본 빠른 경로) |
| `/opsx:explore` | 아이디어 검토, 문제 조사, 요구 사항 명확화 |
| `/opsx:new` | 변경 사항 기본 구조 시작(확장 워크플로) |
| `/opsx:continue` | 다음 산출물 생성(확장 워크플로) |
| `/opsx:ff` | 계획 산출물 빠르게 생성(확장 워크플로) |
| `/opsx:apply` | 필요에 따라 산출물을 업데이트하며 작업 구현 |
| `/opsx:update` | 변경 사항의 계획 산출물을 수정하고 일관성 유지 |
| `/opsx:verify` | 산출물과 대조해 구현 검증(확장 워크플로) |
| `/opsx:sync` | 델타 사양을 기본 사양에 병합(선택 사항) |
| `/opsx:archive` | 작업이 끝났을 때 보관 |
| `/opsx:bulk-archive` | 완료된 변경 사항을 여러 개 보관(확장 워크플로) |
| `/opsx:onboard` | 처음부터 끝까지 안내하는 변경 사항 워크플로(확장 워크플로) |

## 사용 방법

### 아이디어 탐색하기
```
/opsx:explore
```
아이디어를 검토하고 문제를 조사하며 선택지를 비교합니다. 정해진 구조 없이 사고 파트너와 대화하면 됩니다. 생각이 구체화되면 `/opsx:propose`(기본) 또는 `/opsx:new`/`/opsx:ff`(확장)로 이어가세요.

### 새 변경 사항 시작하기
```
/opsx:propose
```
변경 사항을 만들고 구현 전에 필요한 계획 산출물을 생성합니다.

확장 워크플로를 활성화했다면 대신 다음 명령을 사용할 수 있습니다.

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### 산출물 생성하기
```
/opsx:continue
```
의존성에 따라 생성할 준비가 된 산출물을 표시한 뒤 하나를 생성합니다. 변경 사항을 점진적으로 작성하려면 반복해서 사용하세요.

```
/opsx:ff add-dark-mode
```
모든 계획 산출물을 한 번에 생성합니다. 무엇을 만들지 명확히 파악했을 때 사용하세요.

### 구현(유연한 단계)
```
/opsx:apply
```
작업을 진행하면서 완료 항목을 표시합니다. 여러 변경 사항을 동시에 진행한다면 `/opsx:apply <name>`을 실행하세요. 그렇지 않으면 대화에서 변경 사항을 추론하며 식별할 수 없으면 선택을 요청합니다.

### 변경 사항 업데이트하기
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
변경 사항의 기존 계획 산출물을 수정해 어느 방향으로든 일관성을 유지합니다(설계 편집이 제안에 영향을 줄 수 있음). 코드는 편집하지 않습니다. 변경 사항을 기록하기 전에 매번 확인을 요청합니다. 새 산출물을 시작하지 않고 누락 파일을 처리하는 방법은 [업데이트 참조](/ko-KR/commands/#opsxupdate)를 확인하세요.

변경 사항을 이미 구현했다면 수정된 계획에 코드가 맞춰지도록 `/opsx:apply`를 권장합니다. 수정으로 변경 사항의 *의도*가 달라지면 새로 시작하세요. [업데이트와 새로 시작하기](#when-to-update-vs-start-fresh)를 참조하세요.

### 델타 사양 동기화
```text
/opsx:sync
```
보관하지 않고 현재 변경 사항의 델타 사양을 기본 `openspec/specs/`에 병합합니다. 변경 사항은 진행 중 상태로 남습니다. 델타 전체를 적용합니다. `## REMOVED` 아래 요구 사항은 기본 사양에서 삭제되고 이름이 바뀐 요구 사항은 그 자리에서 제목을 변경하며, 델타에 언급되지 않은 내용은 그대로 둡니다. 동기화는 선택 사항이며 미리 동기화하지 않았다면 archive에서 실행 여부를 묻습니다. 보관 전에 기본 사양을 업데이트하고 싶거나 병렬 변경 사항에서 이 변경 사항이 추가한 사양을 사용해야 하거나 병합된 기본 사양을 먼저 검토하고 싶은 경우 사용하세요.

### 마무리
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## 업데이트와 새로 시작하기의 기준

구현하기 전에 언제든 제안이나 사양을 편집할 수 있습니다. 하지만 언제 다듬기가 "다른 작업"이 될까요?

### 제안에 포함되는 내용

제안은 다음 세 가지를 정의합니다.
1. **의도** — 어떤 문제를 해결하나요?
2. **범위** — 무엇이 포함되거나 제외되나요?
3. **접근 방식** — 어떻게 해결하나요?

질문은 다음과 같습니다. 어떤 항목이 얼마나 바뀌었나요?

### 다음 경우 기존 변경 사항을 업데이트하세요

**의도는 같고 실행 방법을 다듬는 경우**
- 고려하지 않았던 경계 사례를 발견함
- 목표는 그대로지만 접근 방법을 조정해야 함
- 구현 과정에서 설계가 약간 잘못됐음을 알게 됨

**범위가 좁아지는 경우**
- 전체 범위가 너무 커서 MVP를 먼저 출시하고 싶음
- "다크 모드 추가" → "다크 모드 전환 추가(v2에서 시스템 환경 설정 지원)"

**새로 알게 된 내용에 따른 수정**
- 코드베이스 구조가 예상과 다름
- 의존성이 예상대로 작동하지 않음
- "CSS 변수 사용" → "대신 Tailwind의 dark: 접두사 사용"

### 다음 경우 새 변경 사항을 시작하세요

**의도가 근본적으로 바뀐 경우**
- 해결할 문제가 달라짐
- "다크 모드 추가" → "사용자 지정 색상, 글꼴, 간격을 지원하는 전체 테마 시스템 추가"

**범위가 크게 확장된 경우**
- 변경 사항이 크게 늘어 사실상 다른 작업이 됨
- 업데이트 후 원래 제안을 알아볼 수 없음
- "로그인 버그 수정" → "인증 시스템 재작성"

**원래 변경 사항을 완료할 수 있는 경우**
- 원래 변경 사항을 "완료"로 표시할 수 있음
- 새 작업은 다듬기가 아니라 독립된 작업임
- "다크 모드 MVP 추가" 완료 → 보관 → "다크 모드 개선" 새 변경 사항 생성

### 판단 기준

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| 기준 | 업데이트 | 새 변경 사항 |
|------|--------|------------|
| **정체성** | "같은 작업을 다듬음" | "별개의 작업" |
| **범위 중복** | 50% 초과 중복 | 50% 미만 중복 |
| **완료** | 수정 없이는 "완료"할 수 없음 | 원래 작업을 마무리하고 새 작업을 독립적으로 진행할 수 있음 |
| **이력** | 업데이트 과정이 일관된 이야기를 이룸 | 수정 사항이 명확하게 하기보다 혼란을 줌 |

### 원칙

> **업데이트는 맥락을 보존하고 새 변경 사항은 명확성을 제공합니다.**
>
> 생각의 이력이 중요하다면 업데이트하세요.
> 기존 내용을 수정하는 것보다 새로 시작하는 편이 명확하다면 새 변경 사항을 만드세요.

git 브랜치와 비슷하게 생각하세요.
- 같은 기능을 작업하는 동안 커밋을 계속합니다.
- 실제로 새로운 작업이라면 브랜치를 새로 만듭니다.
- 부분적으로 구현한 기능을 병합한 뒤 2단계를 새로 시작할 수도 있습니다.

## 달라진 점

| 항목 | 기존(`/openspec:proposal`) | OPSX(`/opsx:*`) |
|---|---|---|
| **구조** | 하나의 큰 제안 문서 | 의존성이 있는 개별 산출물 |
| **워크플로** | 계획 → 구현 → 보관의 선형 단계 | 유연한 동작 — 언제든 작업 수행 |
| **반복 개선** | 이전 단계로 돌아가기 어려움 | 새로운 내용을 알게 될 때 산출물 업데이트 |
| **사용자 지정** | 고정된 구조 | 스키마 기반(자체 산출물 정의) |

**핵심 통찰:** 작업은 선형적이지 않습니다. OPSX는 작업이 선형적인 척하지 않습니다.

## 아키텍처 자세히 살펴보기

이 섹션에서는 OPSX의 내부 작동 방식과 기존 워크플로와의 차이를 설명합니다.
이 섹션의 예제는 확장 명령 모음(`new`, `continue` 등)을 사용합니다. 기본 `core` 사용자는 같은 흐름을 `propose → apply → sync → archive`에 대응할 수 있습니다.

### 철학: 단계와 동작

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 구성 요소 아키텍처

**기존 워크플로**는 TypeScript에 하드코딩된 템플릿을 사용합니다.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX**는 외부 스키마와 의존성 그래프 엔진을 사용합니다.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Devin)                    │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 의존성 그래프 모델

산출물은 방향성 비순환 그래프(DAG)를 구성합니다. 의존성은 관문이 아니라 **촉진 요소**입니다.

```
                              proposal
                             (root node)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**상태 전이:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### 정보 흐름

**기존 워크플로** — 에이전트가 정적 지침을 받습니다.

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create delta spec files              │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — 에이전트가 풍부한 컨텍스트를 조회합니다.

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked",                          │  │
  │  │       "missingDeps": ["specs", "design"]}                          │  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### 반복 모델

**기존 워크플로** — 반복 개선이 불편합니다.

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — 자연스러운 반복 개선:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### 사용자 지정 스키마

스키마 관리 명령을 사용해 사용자 지정 워크플로를 만드세요.

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

스키마는 `openspec/schemas/`(프로젝트 로컬, 버전 관리) 또는 `~/.local/share/openspec/schemas/`(사용자 전역)에 저장됩니다.

**스키마 구조:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**schema.yaml 예:**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**의존성 그래프:**
```
   research ──► proposal ──► tasks
```

### 요약

| 항목 | 기존 방식 | OPSX |
|--------|----------|------|
| **템플릿** | TypeScript에 하드코딩 | 외부 YAML + Markdown |
| **의존성** | 없음(모두 한 번에 생성) | 위상 정렬을 사용하는 DAG |
| **상태** | 단계 기반 개념 모델 | 파일 시스템의 존재 여부 |
| **사용자 지정** | 소스를 편집한 뒤 다시 빌드 | schema.yaml 작성 |
| **반복 개선** | 단계에 고정 | 유연하며 무엇이든 편집 가능 |
| **편집기 지원** | 도구별 구성기/어댑터 | 단일 스킬 디렉터리 |

## 스키마

스키마는 산출물의 종류와 의존성을 정의합니다. 현재 사용 가능한 스키마:

- **spec-driven**(기본값): proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## 팁

- 변경 사항을 확정하기 전에 `/opsx:explore`로 아이디어를 검토하세요.
- 원하는 바를 알고 있으면 `/opsx:ff`, 탐색하며 진행하려면 `/opsx:continue`를 사용하세요.
- `/opsx:apply` 중 문제가 있으면 산출물을 수정한 뒤 계속 진행하세요.
- `tasks.md`의 체크박스로 진행 상황을 추적합니다.
- 언제든 `openspec status --change "name"`으로 상태를 확인하세요.

## 의견

아직 다듬는 중입니다. 더 나은 방식을 찾아가는 과정이므로 의도된 상태입니다.

버그를 발견했거나 아이디어가 있나요? [Discord](https://discord.gg/YctCnvvshC)에 참여하거나 [GitHub](https://github.com/Fission-AI/openspec/issues)에서 이슈를 등록하세요.
