---
title: "명령"
---

이 문서는 OpenSpec 슬래시 명령 참조입니다. 이 명령은 Claude Code, Cursor, Devin Desktop과 같은 AI 코딩 어시스턴트의 채팅 인터페이스에서 실행합니다.

워크플로 패턴과 명령별 사용 시점은 [워크플로](/ko-KR/workflows/)를, CLI 명령은 [CLI](/ko-KR/cli/)를 참조하세요.

이 문서에서는 표준 이름으로 `/opsx:<command>`를 사용합니다. 일부 도구에서는 다르게 표기합니다. Cursor와 GitHub Copilot은 `/opsx-propose`, Codex는 `$openspec-propose`를 사용하므로 도구에 맞는 형식은 [호출 방법](/ko-KR/supported-tools/#how-to-invoke)을 확인하세요. OpenSpec이 생성하는 파일에는 올바른 형식이 이미 사용됩니다.

## 빠른 참조

### 기본 빠른 경로(`core` 프로필)

| 명령 | 목적 |
|---------|---------|
| `/opsx:propose` | 변경 사항을 만들고 계획 산출물을 한 단계에서 생성 |
| `/opsx:explore` | 변경 사항을 확정하기 전에 아이디어 검토 |
| `/opsx:apply` | 변경 사항의 작업 구현 |
| `/opsx:update` | 변경 사항의 계획 산출물을 수정하고 일관성 유지 |
| `/opsx:sync` | 델타 사양을 기본 사양에 병합 |
| `/opsx:archive` | 완료된 변경 사항 보관 |

### 확장 워크플로 명령(사용자 지정 워크플로 선택)

| 명령 | 목적 |
|---------|---------|
| `/opsx:new` | 새 변경 사항의 기본 구조 시작 |
| `/opsx:continue` | 의존성에 따라 다음 산출물 생성 |
| `/opsx:ff` | 빠른 진행: 모든 계획 산출물을 한 번에 생성 |
| `/opsx:verify` | 구현이 산출물과 일치하는지 검증 |
| `/opsx:bulk-archive` | 여러 변경 사항을 한 번에 보관 |
| `/opsx:onboard` | 전체 워크플로를 안내하는 튜토리얼 |

기본 전역 프로필은 `core`입니다. 확장 워크플로 명령을 사용하려면 `openspec config profile`을 실행해 워크플로를 선택한 다음 프로젝트에서 `openspec update`를 실행하세요.

---

## 명령 참조

### `/opsx:propose`

변경 사항을 만들고 계획 산출물을 한 단계에서 생성합니다. `core` 프로필의 기본 시작 명령입니다.

**구문:**
```text
/opsx:propose [change-name-or-description]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name-or-description` | 아니요 | kebab-case 이름 또는 일반 언어로 작성한 변경 사항 설명 |

**수행 작업:**
- `openspec/changes/<change-name>/` 생성
- 구현 전에 필요한 산출물 생성(`spec-driven`에서는 제안, 사양, 설계, 작업)
- 변경 사항이 `/opsx:apply`를 실행할 준비가 되면 중지

**예:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**팁:**
- 처음부터 끝까지 가장 빠르게 진행하려면 사용하세요.
- 산출물을 단계별로 제어하려면 확장 워크플로를 활성화하고 `/opsx:new`와 `/opsx:continue`를 사용하세요.

---

### `/opsx:explore`

> **확신이 없을 때는 여기서 시작하세요.** 탐색은 코드를 작성하기 전에 코드베이스를 읽고 선택지를 비교하며 모호한 아이디어를 구체적인 계획으로 다듬는 부담 없는 사고 파트너입니다. 기본 프로필에 포함되어 있습니다. 자세한 설명과 추가 예제는 [먼저 탐색하기](/ko-KR/explore/)를 참조하세요.

변경 사항을 확정하기 전에 아이디어를 검토하고 문제를 조사하며 요구 사항을 명확히 합니다.

**구문:**
```
/opsx:explore [topic]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `topic` | 아니요 | 탐색하거나 조사하려는 내용 |

**수행 작업:**
- 정해진 구조 없이 탐색 대화를 시작합니다.
- 질문에 답하기 위해 코드베이스를 조사합니다.
- 선택지와 접근 방식을 비교합니다.
- 생각을 명확히 하기 위한 시각적 다이어그램을 작성합니다.
- 요청하거나 제안을 수락하면 탐색 내용을 기록합니다. `openspec new change`로 변경 사항 기본 구조를 만들고 지정한 계획 산출물을 작성하거나 기존 변경 사항의 산출물을 업데이트합니다.
- 생각이 구체화되면 `/opsx:propose`(기본값) 또는 `/opsx:new`(확장 워크플로)로 이어갈 수 있습니다.

**예:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**팁:**
- 요구 사항이 불분명하거나 조사가 필요할 때 사용하세요.
- 코드를 작성하지 않으며 사용자에게 요청을 받거나 제안을 수락하지 않는 한 다른 내용도 작성하지 않습니다.
- 결정 전에 여러 접근 방식을 비교할 때 유용합니다.
- 파일을 읽고 코드베이스를 검색할 수 있습니다.

---

### `/opsx:new`

새 변경 사항의 기본 구조를 만듭니다. 변경 사항 폴더를 생성한 뒤 `/opsx:continue` 또는 `/opsx:ff`로 산출물을 만들 때까지 대기합니다.

이 명령은 확장 워크플로에 포함되며 기본 `core` 프로필에서는 사용할 수 없습니다.

**구문:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 변경 사항 폴더 이름(생략하면 입력 요청) |
| `--schema` | 아니요 | 사용할 워크플로 스키마(기본값: 구성 파일 또는 `spec-driven`) |

**수행 작업:**
- `openspec/changes/<change-name>/` 디렉터리 생성
- 변경 사항 폴더에 `.openspec.yaml` 메타데이터 파일 생성
- 작성 준비가 된 첫 산출물 템플릿 표시
- 이름이나 스키마가 지정되지 않으면 입력 요청

**생성 항목:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**예:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**팁:**
- `add-feature`, `fix-bug`, `refactor-module`처럼 설명이 명확한 이름을 사용하세요.
- `update`, `changes`, `wip`와 같이 일반적인 이름은 피하세요.
- 프로젝트 구성(`openspec/config.yaml`)에서도 스키마를 지정할 수 있습니다.

---

### `/opsx:continue`

의존성 체인에서 다음 산출물을 만듭니다. 점진적으로 진행할 수 있도록 한 번에 산출물 하나씩 작성합니다.

**구문:**
```
/opsx:continue [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 이어서 진행할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- 산출물 의존성 그래프를 확인합니다.
- 작성 준비가 된 산출물과 차단된 산출물을 표시합니다.
- 첫 번째 준비된 산출물을 생성합니다.
- 컨텍스트를 위해 의존 파일을 읽습니다.
- 생성 후 사용할 수 있게 되는 산출물을 표시합니다.

**예:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**팁:**
- 다음 단계로 넘어가기 전에 각 산출물을 검토하고 싶을 때 사용하세요.
- 직접 제어하려는 복잡한 변경 사항에 적합합니다.
- 여러 산출물이 동시에 준비될 수 있습니다.
- 계속 진행하기 전에 생성된 산출물을 편집할 수 있습니다.

---

### `/opsx:ff`

산출물 생성을 빠르게 진행합니다. 모든 계획 산출물을 한 번에 만듭니다.

**구문:**
```
/opsx:ff [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 빠르게 진행할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- 의존성 순서에 따라 모든 산출물을 생성합니다.
- 할 일 목록에서 진행 상황을 추적합니다.
- `apply-required` 산출물을 모두 완료하면 중지합니다.
- 다음 산출물을 만들기 전에 각 의존 산출물을 읽습니다.

**예:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**팁:**
- 무엇을 만들지 명확하게 파악한 경우 사용하세요.
- 단순한 변경 사항에서는 `/opsx:continue`보다 빠릅니다.
- 이후에도 산출물을 편집할 수 있습니다.
- 중소 규모 기능에 적합합니다.

---

### `/opsx:apply`

변경 사항의 작업을 구현합니다. 작업 목록을 따라 코드를 작성하고 완료 항목을 표시합니다.

**구문:**
```
/opsx:apply [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 구현할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- `tasks.md`를 읽고 미완료 작업을 확인합니다.
- 작업을 하나씩 진행합니다.
- 필요에 따라 코드를 작성하고 파일을 만들며 테스트를 실행합니다.
- 완료한 작업을 체크박스 `[x]`로 표시합니다.

**예:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**팁:**
- 중단된 경우 마지막 진행 지점부터 다시 시작할 수 있습니다.
- 병렬로 진행 중인 변경 사항은 이름을 지정해 선택하세요.
- 완료 상태는 `tasks.md` 체크박스로 추적합니다.

---

### `/opsx:update`

변경 사항의 기존 계획 산출물을 수정해 서로 일관되게 유지합니다. 계획 산출물만 다루며 코드는 편집하지 않습니다.

**구문:**

```text
/opsx:update [change-name]
```

**인수:**

| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 업데이트할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**

- `openspec status --change <name> --json`으로 변경 사항의 산출물을 읽습니다.
- 요청된 수정을 반영하거나 구체적인 요청이 없으면 산출물 간 모순을 검토합니다.
- 다른 기존 산출물도 어느 방향으로든 조정합니다(설계 수정이 제안에 영향을 줄 수 있음).
- 산출물 하나씩 수정 내용을 기록하기 전에 사용자에게 확인합니다.
- 마지막에 다음 단계를 제안합니다. `/opsx:continue`(아직 시작하지 않은 산출물), `/opsx:apply`(수정된 계획을 코드에 반영), `/opsx:archive`(모든 작업 완료)

**누락된 파일:**

- 기존 파일이 하나 이상 있는 `specs/**/*.md` 같은 glob 산출물의 경우 누락된 관련 파일을 제안할 수 있습니다. 스키마 지침을 따르며 파일을 만들기 전에 구체적인 경로를 확인합니다.
- 파일이 아직 없는 산출물은 `/opsx:continue`로 작성합니다. 의도적으로 건너뛴 산출물은 그대로 둡니다.
- 새 파일은 변경 사항 디렉터리 안에 있어야 합니다. 생성 전에 확인된 경로에 파일이 생기면 덮어쓰지 않고 중지합니다.

**예:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**팁:**

- 기존 파일이 없는 산출물은 시작하지 않습니다. 이 경우 `/opsx:continue`를 활성화하거나 선택적 워크플로를 설치하지 않았다면 `openspec status`와 `openspec instructions`를 사용하세요.
- 변경 사항을 이미 구현했다면 `/opsx:apply`를 실행해 코드가 수정된 계획과 일치하도록 하세요.
- 수정으로 변경 사항의 *의도*가 달라지면 새 변경 사항을 시작하세요([업데이트와 새로 시작하기](/ko-KR/opsx/#when-to-update-vs-start-fresh) 참조).

---

### `/opsx:verify`

구현이 변경 산출물과 일치하는지 검증합니다. 완전성, 정확성, 일관성을 확인합니다.

**구문:**
```
/opsx:verify [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 검증할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- 구현 품질의 세 가지 측면을 확인합니다.
- 구현 근거를 찾기 위해 코드베이스를 검색합니다.
- 문제를 CRITICAL, WARNING, SUGGESTION으로 분류해 보고합니다.
- 보관을 차단하지 않고 문제를 표시합니다.

**검증 항목:**

| 측면 | 검증 내용 |
|-----------|-------------------|
| **완전성** | 모든 작업 완료, 모든 요구 사항 구현, 시나리오 적용 |
| **정확성** | 구현이 사양의 의도와 일치하며 경계 사례 처리 |
| **일관성** | 설계 결정의 코드 반영, 패턴의 일관성 |

**예:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**팁:**
- 보관 전에 실행해 불일치를 일찍 찾아내세요.
- 경고가 보관을 차단하지는 않지만 잠재적 문제를 나타냅니다.
- 커밋하기 전에 AI 작업을 검토하는 데 유용합니다.
- 산출물과 구현 간의 차이를 발견할 수 있습니다.

---

### `/opsx:sync`

**선택적 명령.** 변경 사항의 델타 사양을 기본 사양에 병합합니다. 필요한 경우 archive에서 동기화 여부를 묻기 때문에 보통 직접 실행할 필요는 없습니다.

**구문:**
```
/opsx:sync [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 동기화할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- 변경 사항 폴더에서 델타 사양을 읽습니다.
- ADDED/MODIFIED/REMOVED/RENAMED 섹션을 분석합니다.
- 변경 내용을 기본 `openspec/specs/` 디렉터리에 병합합니다.
- 델타에 언급되지 않은 기존 내용을 보존합니다.
- 변경 사항을 보관하지 않고 진행 중 상태로 유지합니다.

**예:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**직접 실행할 시점:**

| 상황 | sync 사용 여부 |
|----------|-----------|
| 장기 변경 사항에서 보관 전에 기본 사양에 반영하고 싶은 경우 | 예 |
| 병렬 변경 사항 여러 개에서 업데이트된 기본 사양이 필요한 경우 | 예 |
| 병합 결과를 별도로 미리 보거나 검토하고 싶은 경우 | 예 |
| 빠른 변경 사항을 바로 보관할 경우 | 아니요(archive에서 처리) |

**팁:**
- sync는 단순 복사/붙여넣기가 아니라 지능적으로 병합합니다.
- 기존 요구 사항을 중복하지 않고 시나리오를 추가할 수 있습니다.
- 동기화 후에도 변경 사항은 진행 중 상태로 남습니다(보관되지 않음).
- 대부분의 사용자는 직접 실행할 필요가 없습니다. 필요한 경우 archive에서 확인을 요청합니다.

---

### `/opsx:archive`

완료된 변경 사항을 보관합니다. 변경 사항을 마무리하고 보관 폴더로 이동합니다.

**구문:**
```
/opsx:archive [change-name]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-name` | 아니요 | 보관할 변경 사항(생략하면 컨텍스트에서 추론) |

**수행 작업:**
- 산출물 완료 상태를 확인합니다.
- 작업 완료 여부를 확인합니다(미완료 시 경고).
- 델타 사양을 아직 동기화하지 않았다면 동기화를 제안합니다.
- 변경 사항 폴더를 `openspec/changes/archive/YYYY-MM-DD-<name>/`으로 이동합니다.
- 감사 이력을 위해 모든 산출물을 보존합니다.

**예:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**팁:**
- 미완료 작업이 있어도 보관은 차단되지 않지만 경고가 표시됩니다.
- 델타 사양은 보관 중 또는 그 전에 동기화할 수 있습니다.
- 보관된 변경 사항은 이력을 위해 보존됩니다.
- 문제를 찾으려면 먼저 `/opsx:verify`를 실행하세요.

---

### `/opsx:bulk-archive`

완료된 변경 사항을 여러 개 한꺼번에 보관합니다. 변경 사항 간 사양 충돌을 처리합니다.

**구문:**
```
/opsx:bulk-archive [change-names...]
```

**인수:**
| 인수 | 필수 여부 | 설명 |
|----------|----------|-------------|
| `change-names` | 아니요 | 보관할 변경 사항(생략하면 선택 요청) |

**수행 작업:**
- 완료된 변경 사항을 모두 나열합니다.
- 보관하기 전에 각 변경 사항을 검증합니다.
- 변경 사항 간 사양 충돌을 감지합니다.
- 실제 구현 내용을 확인해 충돌을 해결합니다.
- 시간순으로 보관합니다.

**예:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**팁:**
- 병렬 작업 흐름에 유용합니다.
- 에이전트 방식으로 코드베이스를 확인해 충돌을 해결합니다.
- 변경 사항을 생성한 순서대로 보관합니다.
- 사양 내용을 덮어쓰기 전에 확인을 요청합니다.

---

### `/opsx:onboard`

OpenSpec 워크플로 전체를 안내하는 온보딩입니다. 실제 코드베이스를 활용하는 대화형 튜토리얼입니다.

**구문:**
```
/opsx:onboard
```

**수행 작업:**
- 전체 워크플로 주기를 설명과 함께 진행합니다.
- 코드베이스를 살펴 실제 개선 기회를 찾습니다.
- 산출물이 포함된 실제 변경 사항을 만듭니다.
- 실제 작업을 구현합니다(작고 안전한 변경).
- 완료된 변경 사항을 보관합니다.
- 각 단계를 진행하면서 설명합니다.

**단계:**
1. 환영 인사 및 코드베이스 분석
2. 개선 기회 찾기
3. 변경 사항 생성(`/opsx:new`)
4. 제안 작성
5. 사양 생성
6. 설계 작성
7. 작업 목록 생성
8. 작업 구현(`/opsx:apply`)
9. 구현 검증
10. 변경 사항 보관
11. 요약 및 다음 단계

**예:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**팁:**
- 워크플로를 배우는 신규 사용자에게 적합합니다.
- 장난감 예제가 아니라 실제 코드를 사용합니다.
- 유지하거나 버릴 수 있는 실제 변경 사항을 만듭니다.
- 완료하는 데 15~30분 정도 걸립니다.

---

## AI 도구별 명령 구문

AI 도구마다 명령 구문이 약간씩 다릅니다. 해당 도구에 맞는 형식을 사용하세요.

| 도구별 명령 파일 | 구문 예 | 도구 예 |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot(IDE), Trae, Oh My Pi |
| 없음 — 스킬만 사용 | `/openspec-propose`, `/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, 공유 `.agents` |
| 없음 — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| 없음 — Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop과 Devin Local 비교:** `.devin/workflows/opsx-*.md` 파일을 사용하는
> Devin Desktop에서는 `/opsx-propose`를 사용합니다. Devin Local은 워크플로를 지원하지 않으므로
> OpenSpec이 `.devin/skills/`에 작성하는 스킬(예: `/openspec-propose`)을 사용하세요.
> 이 스킬은 두 에이전트에서 모두 작동합니다.

모든 도구에서 명령의 의도는 같지만 통합 방식에 따라 명령을 표시하는 방법이 다를 수 있습니다. [호출 방법](/ko-KR/supported-tools/#how-to-invoke)에 지원 도구가 모두 나와 있으며 이 표는 각 형식의 예만 보여 줍니다.

> **참고:** GitHub Copilot 명령(`.github/prompts/*.prompt.md`)은 IDE 확장(VS Code, JetBrains, Visual Studio)에서만 사용할 수 있습니다. 현재 GitHub Copilot CLI는 사용자 지정 프롬프트 파일을 지원하지 않습니다. 자세한 내용과 대안은 [지원 도구](/ko-KR/supported-tools/)를 참조하세요.

---

## 기존 명령

이 명령은 이전의 "한 번에 모두 처리" 워크플로를 사용합니다. 계속 사용할 수 있지만 OPSX 명령을 권장합니다.

| 명령 | 기능 |
|---------|--------------|
| `/openspec:proposal` | 모든 산출물을 한 번에 생성(제안, 사양, 설계, 작업) |
| `/openspec:apply` | 변경 사항 구현 |
| `/openspec:archive` | 변경 사항 보관 |

**기존 명령을 사용할 시점:**
- 이전 워크플로를 사용하는 기존 프로젝트
- 산출물을 점진적으로 만들 필요가 없는 단순한 변경 사항
- 한 번에 모두 처리하는 접근 방식을 선호하는 경우

**OPSX로 마이그레이션:**
기존 변경 사항을 OPSX 명령으로 이어서 진행할 수 있습니다. 산출물 구조가 호환됩니다.

---

## 문제 해결

### "Change not found"(변경 사항을 찾을 수 없음)

명령에서 작업할 변경 사항을 확인할 수 없습니다.

**해결 방법:**
- 변경 사항 이름을 명시적으로 지정합니다: `/opsx:apply add-dark-mode`
- 변경 사항 폴더가 있는지 확인합니다: `openspec list`
- 올바른 프로젝트 디렉터리에 있는지 확인합니다.

### "No artifacts ready"(작성 준비가 된 산출물 없음)

모든 산출물이 완료됐거나 누락된 의존성으로 차단된 상태입니다.

**해결 방법:**
- 차단 원인을 확인하려면 `openspec status --change <name>`을 실행합니다.
- 필요한 산출물이 있는지 확인합니다.
- 누락된 의존 산출물을 먼저 만듭니다.

### "Schema not found"(스키마를 찾을 수 없음)

지정한 스키마가 없습니다.

**해결 방법:**
- 사용 가능한 스키마를 나열합니다: `openspec schemas`
- 스키마 이름의 철자를 확인합니다.
- 사용자 지정 스키마라면 생성합니다: `openspec schema init <name>`

### 명령이 인식되지 않음

AI 도구가 OpenSpec 명령을 인식하지 못합니다.

**해결 방법:**
- OpenSpec이 초기화됐는지 확인합니다: `openspec init`
- 스킬을 다시 생성합니다: `openspec update`
- `.claude/skills/` 디렉터리가 있는지 확인합니다(Claude Code).
- 새 스킬을 불러오도록 AI 도구를 다시 시작합니다.

### 산출물이 올바르게 생성되지 않음

AI가 산출물을 불완전하거나 잘못 작성합니다.

**해결 방법:**
- `openspec/config.yaml`에 프로젝트 컨텍스트를 추가합니다.
- 구체적인 지침을 위해 산출물별 규칙을 추가합니다.
- 변경 사항 설명을 더 자세히 작성합니다.
- 세부 제어가 필요하면 `/opsx:ff` 대신 `/opsx:continue`를 사용합니다.

---

## 다음 단계

- [워크플로](/ko-KR/workflows/) — 일반적인 패턴과 명령별 사용 시점
- [CLI](/ko-KR/cli/) — 관리 및 검증을 위한 터미널 명령
- [사용자 지정](/ko-KR/customization/) — 사용자 지정 스키마 및 워크플로 생성
