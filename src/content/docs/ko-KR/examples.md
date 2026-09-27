---
title: "예제 및 레시피"
---

실제 변경 사항의 처음부터 끝까지 살펴봅니다. 각 레시피는 입력할 명령과 결과를 보여 주므로 상황에 맞는 패턴을 찾아 복사해 사용할 수 있습니다. 예제는 기본 **core** 명령(`propose`, `explore`, `apply`, `update`, `sync`, `archive`)을 사용하며 확장 명령이 유용한 경우에는 따로 표시합니다.

시작하기 전에 다시 한번 확인하세요. `/opsx:propose`와 같은 슬래시 명령은 **AI 어시스턴트 채팅**에, `openspec` 명령은 **터미널**에 입력합니다. 익숙하지 않다면 먼저 [명령 작동 방식](/ko-KR/how-commands-work/)을 읽어 보세요. 아래 대화에서 `You:`와 `AI:`는 채팅을 나타내며 `$`로 시작하는 줄은 터미널입니다.

> **무엇을 만들지 아직 확신이 없나요?** 먼저 `/opsx:explore`로 생각을 정리하면 대부분의 레시피를 더 효과적으로 활용할 수 있습니다. [레시피 3](#recipe-3-exploring-before-you-commit)에서 사용 예를 볼 수 있으며, [먼저 탐색하기](/ko-KR/explore/)에서 자세히 설명합니다.

## 레시피 1: 작은 기능을 빠르게 구현하기

**사용 시점:** 원하는 내용을 알고 있으며 범위가 명확한 작업일 때 사용합니다. 가장 흔히 사용하는 레시피입니다.

명령 세 개로 모두 진행합니다. 제안하고, 구현한 다음, 보관합니다.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

이제 계획을 읽으세요. 제안과 델타 사양을 엽니다. OpenSpec은 바로 이 순간을 위해 만들어졌습니다. 코드 400줄을 작성하기 전에 한 문단에 담긴 잘못된 가정을 찾아냅니다. 문제가 있다면 산출물을 직접 편집한 뒤 계속 진행하세요.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

이제 로그아웃 동작이 사양에 포함되었으며 변경 사항은 전체 맥락과 함께 보관되었습니다.

## 레시피 2: 버그 수정

**사용 시점:** 문제가 발생했으며 수정 내용을 이유를 알 수 없는 커밋으로 남기는 대신 의도적인 동작 변경으로 기록하고 싶을 때 사용합니다.

버그 수정 절차는 기능 추가와 동일합니다. 제안의 표현만 다릅니다. 단순히 "버그 수정"이라고 하지 말고 *올바른* 동작을 설명하세요.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

수정 사항은 새로운 시나리오를 포함한 `MODIFIED` 요구 사항으로 기록되므로 다음 작업자(또는 다음 AI 세션)는 버그를 수정했다는 사실뿐 아니라 "올바른" 동작의 의미도 알 수 있습니다. 그런 다음 평소처럼 `/opsx:apply`와 `/opsx:archive`를 실행하세요.

팁: 버그 수정에는 회귀 테스트를 일반 문장으로 표현한 시나리오가 효과적입니다. "로그아웃한 사용자가 올바른 자격 증명을 제출하면 대시보드로 이동하고 다시 리디렉션되지 않는다." 이를 작성하면 구현 목표가 명확해집니다.

## 레시피 3: 확정 전에 탐색하기

**사용 시점:** 문제는 있지만 계획이 없거나 무엇을 만들어야 할지, 어떤 방법이 적절한지 확신이 없을 때 사용합니다.

`/opsx:explore`로 시작하세요. 구조를 강요하지 않는 사고 파트너입니다. 코드를 작성하지 않으며, 결정한 내용을 기록해 달라고 요청하거나 기록 제안에 동의하지 않는 한 다른 내용도 작성하지 않습니다. 코드베이스를 읽고 결정을 내리는 데 도움을 줍니다.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

변경 사항을 작성하기 *전에* 탐색을 통해 생각을 명확히 할 수 있습니다. 방향이 구체화되면 제안 단계로 넘어가세요. AI가 맥락을 이어서 반영합니다.

## 레시피 4: 변경 사항 두 개를 동시에 진행하기

**사용 시점:** 기능 구현 도중 긴급한 수정 작업이 우선순위에 들어온 경우입니다.

변경 사항은 서로 독립된 폴더이므로 병렬 작업이 충돌하지 않습니다. 수정을 시작해 배포한 뒤 기능 작업을 중단한 지점부터 계속 진행하세요.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

진행 중인 변경 사항이 여러 개라면 `/opsx:apply add-dark-mode`와 같이 이름을 지정해 AI가 작업할 대상을 선택합니다. `tasks.md`에서 완료 상태를 관리하므로 AI는 정확히 어디까지 진행했는지 알 수 있습니다.

여러 변경 사항을 함께 완료한 경우 확장 명령 `/opsx:bulk-archive`로 함께 보관하고 실제 구현 내용을 확인해 사양 충돌을 해결할 수 있습니다. [워크플로](/ko-KR/workflows/#parallel-changes)를 참조하세요.

## 레시피 5: 동작 변경 없는 리팩터링

**사용 시점:** 코드를 재구성하지만 외부에 보이는 동작은 동일하게 유지해야 할 때 사용합니다.

흥미로운 경우입니다. 순수 리팩터링은 사양에 *추가할 내용이 없습니다*. 동작 계약은 그대로이고 구현만 바뀝니다. 따라서 작업은 설계와 작업 목록에 기록하며 사양 델타는 비어 있거나 존재하지 않습니다.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

변경 사항의 `.openspec.yaml`에 `skip_specs: true`를 설정해 빈 델타임을 명시하세요.

```yaml
schema: spec-driven
skip_specs: true
```

표시가 없으면 `openspec validate`는 델타가 없는 변경 사항을 거부합니다(사양 단계를 빠뜨린 경우도 감지됨). 표시가 있으면 검증을 통과하고 `openspec status`에서 사양 단계를 대기 중이 아니라 명시적으로 건너뛴 것으로 표시합니다. 리팩터링이 실제 동작을 바꾸는 것으로 판명되면 `.openspec.yaml`에서 `skip_specs`를 제거하고 델타 사양을 작성하세요. 검증은 표시와 사양 파일이 함께 있는 경우 충돌로 처리하므로 오래된 표시가 조용히 남지 않습니다.

표시된 변경 사항을 보관할 때 추가 플래그는 필요하지 않습니다(병합할 델타가 없음). 별도로 `--skip-specs` 플래그를 사용하면 터미널 명령에서 사양 단계를 명시적으로 건너뜁니다.

```bash
$ openspec archive refactor-payment-module --skip-specs
```

같은 플래그는 도구, CI, 문서만 변경하는 작업에도 유용합니다. 원칙은 사양이 동작을 설명하므로 동작이 바뀌지 않았다면 사양도 바뀌지 않아야 한다는 것입니다. [개념](/ko-KR/concepts/#what-a-spec-is-and-is-not)을 참조하세요.

## 레시피 6: 단계별 제어(확장 명령)

**사용 시점:** 복잡하거나 위험한 변경 사항에서 다음 단계로 넘어가기 전에 각 산출물을 검토하고 싶은 경우입니다.

core 명령 `/opsx:propose`는 모든 내용을 한 번에 작성합니다. 단계별로 진행하고 싶다면 확장 명령을 활성화하세요.

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

이제 변경 사항의 기본 구조를 만든 뒤 점진적으로 작성할 수 있습니다.

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

각 산출물이 작성될 때 검토하고 자유롭게 편집한 다음 만족스러우면 계속 진행하세요. 나머지 산출물을 한꺼번에 작성하고 싶다면 `/opsx:ff`로 남은 계획 산출물을 빠르게 생성할 수 있습니다. 보관 전에 `/opsx:verify`를 실행해 구현이 사양과 실제로 일치하는지 확인하세요. [워크플로](/ko-KR/workflows/#opsxff-vs-opsxcontinue)를 참조하세요.

## 레시피 7: 전체 작업 흐름 직접 익히기

**사용 시점:** OpenSpec을 설치했으며 장난감 예제가 아니라 자신의 코드에서 워크플로를 직접 *경험*하고 싶은 경우입니다.

확장 명령을 활성화한 뒤(레시피 6 참조) 다음을 실행하세요.

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard`는 실제로 적용할 수 있는 작은 개선 사항을 찾아 변경 사항을 만들고 구현한 뒤 보관하며 모든 단계를 설명합니다. 15~30분 정도 걸리며 유지하거나 버릴 수 있는 실제 변경 사항을 남깁니다. 가장 부담 없이 배울 수 있는 방법입니다. [명령](/ko-KR/commands/#opsxonboard)을 참조하세요.

## 터미널에서 작업 확인하기

터미널에서 언제든 현재 상태를 확인할 수 있습니다.

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

이 도구는 내용을 읽고 확인하는 용도입니다. 제안과 구현은 여전히 채팅에서 슬래시 명령으로 진행합니다. 자세한 내용은 [CLI 참조](/ko-KR/cli/)를 확인하세요.

## 다음 단계

- [먼저 탐색하기](/ko-KR/explore/): 확신이 없을 때 권장되는 시작 방법
- [워크플로](/ko-KR/workflows/): 위 패턴 및 각 패턴을 사용할 시점에 대한 안내
- [명령](/ko-KR/commands/): 모든 슬래시 명령에 대한 자세한 설명
- [시작하기](/ko-KR/getting-started/): 첫 변경 사항의 전체 과정 안내
- [개념](/ko-KR/concepts/): 각 요소가 서로 맞물리는 이유
