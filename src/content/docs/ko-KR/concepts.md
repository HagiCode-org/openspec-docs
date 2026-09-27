---
title: "개념"
---

이 안내서에서는 OpenSpec의 핵심 개념과 각 개념의 관계를 설명합니다. 실제 사용 방법은 [시작하기](/ko-KR/getting-started/)와 [워크플로](/ko-KR/workflows/)를 참조하세요.

## 철학

OpenSpec은 다음 네 가지 원칙을 바탕으로 합니다.

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### 이 원칙이 중요한 이유

**유연하고 경직되지 않음.** 기존 사양 시스템은 먼저 계획한 뒤 구현하고 완료하는 단계에 사용자를 가둡니다. OpenSpec은 더 유연합니다. 작업에 적합한 순서대로 산출물을 만들 수 있습니다.

**폭포수 방식이 아닌 반복 방식.** 요구 사항은 바뀌고 이해는 깊어집니다. 처음에 좋아 보였던 접근 방식이 코드베이스를 살펴본 뒤에는 적절하지 않을 수도 있습니다. OpenSpec은 이러한 현실을 수용합니다.

**복잡하지 않고 쉬움.** 일부 사양 프레임워크에는 광범위한 설정, 엄격한 형식, 무거운 프로세스가 필요합니다. OpenSpec은 작업을 방해하지 않습니다. 몇 초 만에 초기화하고 바로 시작하며 필요할 때만 사용자 지정하세요.

**기존 시스템 우선.** 대부분의 소프트웨어 작업은 처음부터 새로 만드는 것이 아니라 기존 시스템을 수정하는 일입니다. OpenSpec의 델타 기반 접근 방식은 새로운 시스템뿐 아니라 기존 동작의 변경 사항도 쉽게 사양화할 수 있습니다.

## 전체 구조

OpenSpec은 작업을 두 가지 주요 영역으로 구성합니다.

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**사양**은 기준 정보로서 현재 시스템이 어떻게 동작하는지 설명합니다.

**변경 사항**은 제안된 수정 내용이며 병합할 준비가 될 때까지 별도 폴더에 저장됩니다.

이러한 분리가 핵심입니다. 충돌 없이 여러 변경 사항을 병렬로 작업하고 기본 사양에 영향을 주기 전에 변경 사항을 검토할 수 있습니다. 변경 사항을 보관할 때 해당 델타가 기준 정보에 깔끔하게 병합됩니다.

## 사양

사양은 구조화된 요구 사항과 시나리오를 사용해 시스템의 동작을 설명합니다.

### 구조

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

시스템에 적합한 논리적 그룹인 도메인별로 사양을 구성하세요. 일반적인 패턴은 다음과 같습니다.

- **기능 영역별**: `auth/`, `payments/`, `search/`
- **구성 요소별**: `api/`, `frontend/`, `workers/`
- **바운디드 컨텍스트별**: `ordering/`, `fulfillment/`, `inventory/`

### 사양 형식

사양은 요구 사항을 포함하며 각 요구 사항에는 시나리오가 있습니다.

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**주요 요소:**

| 요소 | 목적 |
|---------|---------|
| `## Purpose` | 사양의 도메인에 대한 상위 수준 설명 |
| `### Requirement:` | 시스템이 갖춰야 할 구체적인 동작 |
| `#### Scenario:` | 요구 사항이 실제로 적용되는 구체적인 예 |
| SHALL/MUST/SHOULD | 요구 사항의 강도를 나타내는 RFC 2119 키워드 |

### 사양을 이렇게 구성하는 이유

**요구 사항은 "무엇을"에 해당합니다.** 구현 방법을 지정하지 않고 시스템이 수행해야 할 작업을 명시합니다.

**시나리오는 "언제"에 해당합니다.** 검증 가능한 구체적 예를 제공합니다. 좋은 시나리오는 다음과 같습니다.
- 테스트할 수 있습니다(자동화 테스트를 작성할 수 있음).
- 정상 흐름과 경계 사례를 모두 다룹니다.
- Given/When/Then 또는 유사한 구조화 형식을 사용합니다.

**RFC 2119 키워드**(SHALL, MUST, SHOULD, MAY)는 의도를 전달합니다.
- **MUST/SHALL** — 절대적인 요구 사항
- **SHOULD** — 권장 사항이지만 예외가 있을 수 있음
- **MAY** — 선택 사항

### 사양의 의미와 범위

사양은 **동작 계약**이지 구현 계획이 아닙니다.

사양에 적합한 내용:
- 사용자 또는 다운스트림 시스템이 의존하는 관찰 가능한 동작
- 입력, 출력, 오류 조건
- 외부 제약 조건(보안, 개인정보 보호, 신뢰성, 호환성)
- 테스트 또는 명시적으로 검증할 수 있는 시나리오

사양에서 피해야 할 내용:
- 내부 클래스/함수 이름
- 라이브러리 또는 프레임워크 선택
- 단계별 구현 세부 정보
- 상세한 실행 계획(`design.md` 또는 `tasks.md`에 작성)

간단한 확인 방법:
- 외부에 보이는 동작을 바꾸지 않고 구현 방식을 변경할 수 있다면 해당 내용은 사양에 들어가지 않아야 합니다.

### 가볍게 유지하기: 점진적 엄밀성

OpenSpec은 관료적인 절차를 피하고자 합니다. 변경 사항을 검증할 수 있는 가장 가벼운 수준을 사용하세요.

**Lite 사양(기본값):**
- 짧고 동작을 우선하는 요구 사항
- 명확한 범위와 비목표
- 구체적인 승인 확인 항목 몇 가지

**Full 사양(위험도가 높은 경우):**
- 팀 또는 저장소를 넘나드는 변경 사항
- API/계약 변경, 마이그레이션, 보안/개인정보 보호 문제
- 모호함으로 인해 비용이 큰 재작업이 발생할 수 있는 변경 사항

대부분의 변경 사항은 Lite 모드로 작성해야 합니다.

### 사용자와 에이전트의 협업

많은 팀에서 사용자는 탐색을 진행하고 에이전트는 산출물 초안을 작성합니다. 권장되는 순서는 다음과 같습니다.

1. 사용자가 의도, 컨텍스트, 제약 조건을 제공합니다.
2. 에이전트가 이를 동작 우선 요구 사항과 시나리오로 변환합니다.
3. 에이전트는 구현 세부 정보를 `spec.md`가 아니라 `design.md`와 `tasks.md`에 기록합니다.
4. 검증을 통해 구현 전에 구조와 명확성을 확인합니다.

이렇게 하면 사람이 읽기 쉽고 에이전트가 일관되게 처리할 수 있는 사양이 됩니다.

## 변경 사항

변경 사항은 시스템에 대한 수정 제안이며 이를 이해하고 구현하는 데 필요한 모든 내용을 폴더 하나에 담습니다.

### 변경 사항 구조

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

각 변경 사항은 자체적으로 완결됩니다. 다음 항목이 포함됩니다.
- **산출물** — 의도, 설계, 작업을 기록하는 문서
- **델타 사양** — 추가, 수정 또는 삭제할 내용을 설명하는 사양
- **메타데이터** — 이 변경 사항을 위한 선택적 구성

### 변경 사항을 폴더로 구성하는 이유

변경 사항을 폴더 하나로 묶으면 다음과 같은 이점이 있습니다.

1. **모든 내용이 한곳에 있습니다.** 제안, 설계, 작업, 사양이 모두 한곳에 있어 여러 위치를 찾아다닐 필요가 없습니다.

2. **병렬 작업이 가능합니다.** 서로 충돌하지 않고 여러 변경 사항을 동시에 진행할 수 있습니다. `fix-auth-bug`가 진행되는 동안 `add-dark-mode`를 작업할 수 있습니다.

3. **이력이 깔끔합니다.** 보관하면 변경 사항의 전체 컨텍스트를 보존한 채 `changes/archive/`로 이동합니다. 나중에 무엇이 바뀌었는지뿐 아니라 이유도 확인할 수 있습니다.

4. **검토하기 쉽습니다.** 변경 사항 폴더를 열어 제안을 읽고 설계를 확인한 다음 사양 델타를 살펴보면 됩니다.

## 산출물

산출물은 변경 사항에 포함되어 작업을 안내하는 문서입니다.

### 산출물 흐름

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

산출물은 서로를 바탕으로 작성됩니다. 각 산출물은 다음 단계에 컨텍스트를 제공합니다.

### 산출물 유형

#### 제안(`proposal.md`)

제안에는 **의도**, **범위**, **접근 방식**을 상위 수준에서 기록합니다.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**제안을 업데이트할 시점:**
- 범위가 바뀐 경우(축소 또는 확대)
- 문제를 더 잘 이해해 의도가 명확해진 경우
- 접근 방식이 근본적으로 바뀐 경우

#### 사양(`specs/`의 델타 사양)

델타 사양은 현재 사양과 비교해 **무엇이 바뀌는지** 설명합니다. 아래 [델타 사양](#델타-사양)을 참조하세요.

#### 설계(`design.md`)

설계에는 **기술적 접근 방식**과 **아키텍처 결정**을 기록합니다.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**설계를 업데이트할 시점:**
- 구현 과정에서 접근 방식이 작동하지 않는다는 사실이 드러난 경우
- 더 나은 해결책을 찾은 경우
- 의존성 또는 제약 조건이 바뀐 경우

#### 작업(`tasks.md`)

작업은 체크박스가 있는 구체적인 단계로 이루어진 **구현 체크리스트**입니다.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**작업 목록 작성 모범 사례:**
- 관련 작업을 제목 아래 그룹화합니다.
- 계층형 번호를 사용합니다(1.1, 1.2 등).
- 한 세션에서 완료할 수 있을 정도로 작업을 작게 나눕니다.
- 각 작업을 확인하는 방법(테스트, 명령, 관찰 가능한 결과)을 명시합니다.
- 각 그룹에서 필요한 테스트와 문서를 마지막의 별도 정리 그룹이 아니라 해당 그룹 안에서 완료합니다.
- 작업을 완료할 때마다 체크 표시합니다.

## 델타 사양

델타 사양은 기존 시스템 개발에서 OpenSpec을 효과적으로 사용할 수 있게 하는 핵심 개념입니다. 전체 사양을 다시 쓰는 대신 **무엇이 바뀌는지** 설명합니다.

### 형식

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### 델타 섹션

| 섹션 | 의미 | 보관 시 처리 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 새로운 동작 | 기본 사양에 추가 |
| `## MODIFIED Requirements` | 변경된 동작 | 기존 요구 사항 대체 |
| `## REMOVED Requirements` | 더 이상 사용하지 않는 동작 | 기본 사양에서 삭제. 마지막 요구 사항을 제거하면 기능을 폐기하고 사양 파일을 삭제합니다. 변경 사항에 `retire_capabilities: true`가 선언된 경우에만 수행됩니다. |
| `## Purpose` | 새 기능의 목적 | 생성하는 기본 사양의 Purpose를 설정합니다. 사양이 이미 있으면 무시됩니다. |

### 전체 사양 대신 델타를 사용하는 이유

**명확성.** 델타는 바뀌는 내용을 정확히 보여 줍니다. 전체 사양을 읽으면 현재 버전과 머릿속으로 비교해야 합니다.

**충돌 방지.** 요구 사항이 다르면 변경 사항 두 개가 같은 사양 파일을 수정해도 충돌하지 않습니다.

**검토 효율성.** 검토자는 바뀌지 않은 맥락이 아니라 변경 사항을 확인할 수 있습니다. 중요한 부분에 집중하세요.

**기존 시스템에 적합.** 대부분의 작업은 기존 동작을 수정합니다. 델타를 사용하면 수정 사항을 부가 요소가 아닌 핵심 내용으로 다룰 수 있습니다.

## 스키마

스키마는 워크플로의 산출물 유형과 의존성을 정의합니다.

### 스키마 작동 방식

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**산출물은 의존성 그래프를 구성합니다.**

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
```

**의존성은 관문이 아니라 촉진 요소입니다.** 다음에 만들 수 있는 산출물을 표시할 뿐 반드시 다음에 만들 항목을 지정하지 않습니다. 설계가 필요하지 않다면 건너뛸 수 있습니다. 사양과 설계는 모두 제안에만 의존하므로 먼저 만들 항목을 선택할 수 있습니다.

### 기본 제공 스키마

**spec-driven**(기본값)

사양 주도 개발을 위한 표준 워크플로입니다.

```
proposal → specs → design → tasks → implement
```

적합한 작업: 구현 전에 사양을 합의하고자 하는 대부분의 기능 작업

### 사용자 지정 스키마

팀의 워크플로에 맞춰 사용자 지정 스키마를 만드세요.

```bash
# 처음부터 만들기
openspec schema init research-first

# 또는 기존 스키마 포크
openspec schema fork spec-driven research-first
```

**사용자 지정 스키마 예:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

사용자 지정 스키마 생성 및 사용에 관한 전체 내용은 [사용자 지정](/ko-KR/customization/)을 참조하세요.

## 보관

보관하면 델타 사양이 기본 사양에 병합되고 변경 사항은 이력용으로 보존되어 작업이 완료됩니다.

### 보관 시 처리 과정

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 보관 절차

1. **델타 병합.** 델타 사양의 각 섹션(ADDED/MODIFIED/REMOVED)을 해당 기본 사양에 적용합니다.

2. **보관 폴더로 이동.** 시간순으로 정렬할 수 있도록 날짜 접두사를 붙여 변경 사항 폴더를 `changes/archive/`로 이동합니다.

3. **컨텍스트 보존.** 모든 산출물이 보관 폴더에 그대로 남습니다. 변경 사항이 만들어진 이유를 언제든 확인할 수 있습니다.

### 보관이 중요한 이유

**깔끔한 상태.** 진행 중인 변경 사항(`changes/`)만 표시되고 완료된 작업은 별도로 이동합니다.

**감사 이력.** 보관 폴더에는 변경 내용뿐 아니라 이유를 설명하는 제안, 방법을 설명하는 설계, 수행 작업을 보여 주는 목록까지 변경 사항 전체 맥락을 보존합니다.

**사양의 발전.** 변경 사항을 보관하면서 사양이 자연스럽게 확장됩니다. 보관할 때마다 델타가 병합되어 시간이 지날수록 포괄적인 사양이 만들어집니다.

## 전체 흐름의 관계

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**선순환:**

1. 사양에서 현재 동작을 설명합니다.
2. 변경 사항에서 수정 내용을 델타로 제안합니다.
3. 구현을 통해 변경 사항을 실제로 반영합니다.
4. 보관 시 델타를 사양에 병합합니다.
5. 사양이 새로운 동작을 설명합니다.
6. 다음 변경 사항은 업데이트된 사양을 바탕으로 합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **산출물** | 변경 사항 안의 문서(제안, 설계, 작업, 델타 사양) |
| **보관** | 변경 사항을 완료하고 델타를 기본 사양에 병합하는 과정 |
| **변경 사항** | 산출물을 포함한 폴더로 묶인 시스템 수정 제안 |
| **델타 사양** | 현재 사양과 비교해 변경 사항(ADDED/MODIFIED/REMOVED)을 설명하는 사양 |
| **도메인** | 사양을 논리적으로 묶는 단위(예: `auth/`, `payments/`) |
| **요구 사항** | 시스템이 갖춰야 하는 구체적인 동작 |
| **시나리오** | 보통 Given/When/Then 형식으로 작성하는 요구 사항의 구체적인 예 |
| **스키마** | 산출물 유형과 의존성을 정의하는 것 |
| **사양** | 요구 사항과 시나리오를 포함해 시스템 동작을 설명하는 문서 |
| **기준 정보** | 현재 합의된 동작이 저장된 `openspec/specs/` 디렉터리 |

## 다음 단계

- [시작하기](/ko-KR/getting-started/) — 실용적인 첫 단계
- [워크플로](/ko-KR/workflows/) — 일반적인 패턴과 사용 시점
- [명령](/ko-KR/commands/) — 전체 명령 참조
- [사용자 지정](/ko-KR/customization/) — 사용자 지정 스키마 생성 및 프로젝트 구성
