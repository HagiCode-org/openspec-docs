---
title: "시작하기"
---

이 안내서는 OpenSpec을 설치하고 초기화한 뒤 사용하는 방법을 설명합니다. 설치 방법은 [기본 README](https://github.com/Fission-AI/openspec/blob/79b6aa9c98f1e36795b2bc4ef2a8f770c6d3a777/README.md#quick-start) 또는 [설치 안내서](/ko-KR/installation/)를 참조하세요. 문서 전체를 처음 접하나요? [문서 홈](/ko-KR/)에서 전체 구성을 확인할 수 있습니다.

> **이 명령은 어디에 입력하나요?** 입력 위치는 두 곳이며 이를 혼동하는 경우가 가장 흔합니다.
>
> - `openspec ...` 명령(`openspec init` 등)은 **터미널**에서 실행합니다.
> - `/opsx:...` 명령(`/opsx:propose` 등)은 코드를 작성해 달라고 요청할 때 사용하는 **AI 어시스턴트 채팅창**에서 실행합니다.
>
> 별도로 시작할 "대화형 모드"는 없습니다. 채팅에 슬래시 명령을 입력하면 어시스턴트가 이어서 처리합니다. 자세한 설명은 [명령 작동 방식](/ko-KR/how-commands-work/)을 참조하세요.

## 처음 5분 동안 할 일

각 단계를 실행하는 위치와 함께 전체 작업 흐름을 살펴보세요.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

터미널에서 두 단계를 설정한 뒤에는 채팅에서 작업합니다. 이 안내서의 나머지 부분에서 각 단계의 기능과 예상 결과를 설명합니다.

**터미널에서 직접 설정하고 싶지 않나요?** [설정 프롬프트](/ko-KR/installation/#install-with-your-ai-assistant)를 어시스턴트에 붙여 넣으면 두 명령을 처리하고 생성된 내용을 알려 줍니다.

> **무엇을 만들지 아직 확신이 없나요? `/opsx:explore`로 시작하세요.** 코드를 작성하기 전에 코드베이스를 읽고 선택지를 비교하며 막연한 아이디어를 구체적인 계획으로 발전시키는 부담 없는 사고 파트너입니다. 방향이 명확해지면 `/opsx:propose`로 이어집니다. 엉뚱한 내용을 자신 있게 구현할 수 있는 AI와 작업할 때 꼭 익혀야 할 습관입니다. [탐색 안내서](/ko-KR/explore/)를 참조하세요.

## 작동 방식

OpenSpec은 코드 작성 전에 사용자와 AI 코딩 어시스턴트가 무엇을 만들지 합의하도록 돕습니다.

**기본 빠른 경로(core 프로필):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

무엇을 할지 고민 중이라면 `/opsx:explore`부터 시작하고, 이미 알고 있다면 바로 `/opsx:propose`로 넘어가세요. `explore`는 기본 프로필에 포함되어 있으므로 언제든 사용할 수 있습니다.

**확장 경로(사용자 지정 워크플로 선택):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

기본 전역 프로필은 `core`이며 `propose`, `explore`, `apply`, `update`, `sync`, `archive`가 포함됩니다. `openspec config profile`로 확장 워크플로 명령을 활성화한 뒤 `openspec update`를 실행하세요.

## OpenSpec이 생성하는 항목

`openspec init`을 실행하면 프로젝트에 다음 구조가 생성됩니다.

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**중요한 디렉터리 두 개:**

- **`specs/`** — 기준 정보입니다. 현재 시스템의 동작을 설명하는 사양을 도메인별로 구성합니다(예: `specs/auth/`, `specs/payments/`).

- **`changes/`** — 제안된 수정 사항입니다. 각 변경 사항은 관련 산출물을 모두 포함한 자체 폴더를 가집니다. 변경 사항이 완료되면 사양이 기본 `specs/` 디렉터리에 병합됩니다.

## 산출물 이해하기

각 변경 사항 폴더에는 작업을 안내하는 산출물이 포함됩니다.

| 산출물 | 목적 |
|----------|---------|
| `proposal.md` | "이유"와 "내용" — 의도, 범위, 접근 방식을 기록합니다. |
| `specs/` | 추가/수정/삭제할 요구 사항을 나타내는 델타 사양 |
| `design.md` | "방법" — 기술적 접근 방식과 아키텍처 결정을 기록합니다. |
| `tasks.md` | 체크박스로 구성된 구현 체크리스트 |

**산출물은 서로를 바탕으로 작성됩니다.**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

구현 도중 더 많은 내용을 알게 되면 언제든 이전 산출물로 돌아가 다듬을 수 있습니다.

## 델타 사양의 작동 방식

델타 사양은 OpenSpec의 핵심 개념입니다. 현재 사양과 비교해 바뀌는 내용을 보여 줍니다.

### 형식

델타 사양에서는 섹션으로 변경 유형을 표시합니다.

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 보관 시 발생하는 일

변경 사항을 보관하면 다음과 같이 처리됩니다.

1. **ADDED** 요구 사항이 기본 사양에 추가됩니다.
2. **MODIFIED** 요구 사항이 기존 버전을 대체합니다.
3. **REMOVED** 요구 사항이 기본 사양에서 삭제됩니다.

감사 이력을 위해 변경 사항 폴더는 `openspec/changes/archive/`로 이동합니다.

## 예제: 첫 변경 사항

애플리케이션에 다크 모드를 추가하는 과정을 살펴보겠습니다.

### 1. 변경 사항 시작(기본 방식)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

확장 워크플로 프로필을 활성화했다면 두 단계로 진행할 수도 있습니다. 먼저 `/opsx:new`를 실행한 다음 `/opsx:ff`를 실행하거나 `/opsx:continue`로 하나씩 진행하세요.

### 2. 생성되는 항목

**proposal.md** — 의도를 기록합니다.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — 새로운 요구 사항을 나타내는 델타입니다.

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — 구현 체크리스트입니다.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. 구현

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

구현 도중 설계를 조정해야 한다는 것을 알게 되면 산출물을 업데이트하고 계속 진행하세요.

### 4. 보관

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

이제 델타 사양이 기본 사양의 일부가 되어 시스템의 동작 방식을 기록합니다.

## 검증 및 검토

CLI를 사용해 변경 사항을 확인하세요.

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## 다음 단계

- [먼저 탐색하기](/ko-KR/explore/) — 확정하기 전에 `/opsx:explore`로 아이디어를 검토하세요.
- [변경 사항 검토](/ko-KR/reviewing-changes/) — 코드 작성 전에 AI가 만든 계획에서 확인할 내용
- [좋은 사양 작성하기](/ko-KR/writing-specs/) — 강력한 요구 사항과 시나리오의 조건
- [기존 프로젝트에서 OpenSpec 사용하기](/ko-KR/existing-projects/) — 대규모 기존 코드베이스에서 시작하기
- [변경 사항 편집 및 반복 개선](/ko-KR/editing-changes/) — 산출물 업데이트, 이전 단계로 돌아가기, 직접 편집한 내용 조정
- [핵심 개념 한눈에 보기](/ko-KR/overview/) — 전체 개념을 한 페이지로 확인
- [예제 및 레시피](/ko-KR/examples/) — 실제 변경 사항의 시작부터 끝까지
- [워크플로](/ko-KR/workflows/) — 일반적인 패턴과 명령별 사용 시점
- [명령](/ko-KR/commands/) — 모든 슬래시 명령의 전체 참조
- [개념](/ko-KR/concepts/) — 사양, 변경 사항, 스키마에 대한 자세한 설명
- [사용자 지정](/ko-KR/customization/) — OpenSpec을 원하는 방식으로 구성하기
- [Stores](/ko-KR/stores-beta/user-guide/) — 저장소나 팀을 아우르는 계획을 전용 저장소에 저장(베타)
- [자주 묻는 질문](/ko-KR/faq/) 및 [문제 해결](/ko-KR/troubleshooting/) — 막혔을 때 참고
