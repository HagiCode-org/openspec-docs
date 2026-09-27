---
title: "기존 프로젝트에서 OpenSpec 사용하기"
---

**시작하기 위해 코드베이스 전체를 문서화할 필요는 없습니다. 곧 변경할 내용에 대해서만 사양을 작성하면 됩니다.** 이것이 기존 프로젝트에 OpenSpec을 도입할 때 알아야 할 가장 중요한 점이며, OpenSpec이 기존 시스템(brownfield)을 우선으로 설계된 이유입니다.

흔히 이런 걱정을 합니다. "내 앱은 이미 코드가 8만 줄인데, OpenSpec을 유용하게 쓰려면 먼저 전체 사양을 작성해야 하나요?" 아닙니다. 여러분도 싫어할 테고 저희도 원하지 않습니다. OpenSpec에서는 변경 사항을 하나씩 진행하며 사양을 확장합니다. 첫 변경 사항은 자신이 건드리는 부분을 문서화하고, 다음 변경 사항도 해당 부분을 문서화합니다. 몇 달이 지나면 실제로 수행한 작업을 중심으로 사양이 자연스럽게 채워집니다.

이 안내서에서는 첫날부터 모든 것을 한꺼번에 해결하려 하지 않고 시작하는 방법을 보여 줍니다.

## 30초 만에 시작하기

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

그런 다음 AI 채팅에서 다음을 실행합니다.

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

이제 사양은 해당 변경 사항이 건드린 시스템 부분만 정확히 설명합니다. 그게 올바른 상태입니다. 나머지 8만 줄은 더 이상 걱정하지 않아도 됩니다.

## 델타 우선 접근이 핵심인 이유

OpenSpec 변경 사항은 `ADDED`, `MODIFIED`, `REMOVED`와 같은 **델타**로 작성합니다. 델타는 시스템 전체가 아니라 현재 동작과 비교해 무엇이 바뀌는지 설명합니다.

이것이 기존 시스템을 다룰 때 필요한 방식입니다. 처음부터 새로 만드는 경우는 드뭅니다. 필드를 추가하거나 리디렉션을 수정하거나 타임아웃을 줄이는 식입니다. 델타를 사용하면 주변의 모든 내용을 40페이지 분량으로 먼저 사양화하지 않고도 해당 변경 하나를 정확히 지정할 수 있습니다.

따라서 `openspec/specs/` 디렉터리는 처음부터 완전한 상태가 아닙니다. 거의 비어 있는 상태에서 시작해 점차 내용이 쌓입니다. 보관하는 각 변경 사항의 델타가 여기에 병합됩니다. `auth/` 사양은 인증 관련 변경을 여러 번 진행한 뒤에야 상세해지며, 바로 그때 상세한 사양이 필요해집니다.

자세한 작동 방식은 [개념: 델타 사양](/ko-KR/concepts/#delta-specs)을 참조하세요.

## 실제 코드베이스에서 첫 변경 사항 만들기

작고 실제적인 작업을 고르세요. 장난감 예제나 재작성 작업이 아니라, 이번 주에 어차피 진행하려던 변경 사항이 좋습니다. 처음에는 작은 변경 사항으로 부담 없이 워크플로를 익히세요.

**1단계: AI가 관련 영역을 읽도록 합니다.** 익숙하지 않거나 규모가 큰 코드베이스에서 `/opsx:explore`가 특히 유용한 지점입니다. 곧 수정할 부분을 가리켜 주고, 제안하기 전에 작동 방식을 파악하도록 하세요.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

AI가 실제 프로젝트 구조를 파악했으므로 일반적인 템플릿이 아니라 코드에 맞는 제안을 작성하게 됩니다. 규모가 큰 코드베이스에서는 이 습관 하나만으로도 많은 문제를 예방할 수 있습니다. [먼저 탐색하기](/ko-KR/explore/)를 참조하세요.

**2단계: 변경 사항을 제안합니다.** 제안과 델타 사양에는 이 변경 사항만 기록됩니다.

```text
You: /opsx:propose add-api-rate-limiting
```

**3단계: `/opsx:apply`와 `/opsx:archive`로 구현하고 보관합니다.** 다른 변경 사항과 동일한 절차입니다. 보관을 마치면 어차피 필요했던 변경 사항을 통해 속도 제한 동작을 설명하는 실제 사양이 만들어집니다.

## 안내를 따라 진행하고 싶나요? onboard를 사용하세요

자신의 코드에서 전체 과정을 설명과 함께 진행하고 싶다면 확장 명령 `/opsx:onboard`를 사용하세요. 코드베이스에서 작고 안전한 개선 사항을 찾아 제안부터 구현, 보관까지 각 단계를 설명하며 안내합니다.

먼저 확장 명령을 활성화하세요.

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

그런 다음 채팅에서 다음을 입력하세요.

```text
/opsx:onboard
```

실제 프로젝트에서 부담 없이 입문할 수 있으며, 유지하거나 버릴 수 있는 실질적인(작은) 변경 사항을 남깁니다. [명령: `/opsx:onboard`](/ko-KR/commands/#opsxonboard)를 참조하세요.

## "이미 요구 사항 문서가 있는데요"

PRD, SRS, 공식 사양, 심지어 TLA+ 모델이 있을 수도 있습니다. 좋습니다. 그렇다고 이를 통째로 가져오거나 버릴 필요는 없습니다.

기존 문서는 변환할 사양이 아니라 **탐색을 위한 자료**로 사용하세요. 변경 사항을 시작할 때 관련 섹션을 붙여 넣거나 AI에게 가리켜 주고, 이를 바탕으로 범위가 명확한 OpenSpec 델타를 만들도록 하세요. 델타는 지금 변경하는 동작을 OpenSpec의 테스트 가능한 요구 사항과 시나리오 형식으로 기록합니다. 원본 문서는 배경 자료로서 원래 위치에 그대로 둡니다.

그 이유는 OpenSpec 사양이 의도적으로 동작을 우선하고 변경 사항의 범위에 맞춰 작성되기 때문입니다. 40페이지짜리 PRD는 다른 목적을 가진 별도의 산출물입니다. 한 번에 대량 변환하면 아무도 신뢰하지 않는 거대한 구식 사양이 되기 쉽습니다. 실제 변경 사항을 통해 사양을 확장하면 정확성을 유지할 수 있습니다.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## 대규모 코드베이스에서 사양 구성하기

사양은 `openspec/specs/` 아래에서 **도메인**별로 구성합니다. 도메인이란 팀이 시스템을 바라보는 방식에 맞는 논리적 영역입니다. 처음부터 전체 분류 체계를 설계할 필요는 없습니다. 해당 영역의 첫 변경 사항에서 필요할 때 도메인 폴더를 만드세요.

도메인을 나누는 일반적인 방법은 다음과 같습니다.

- **By feature area:** `auth/`, `payments/`, `search/`
- **By component:** `api/`, `frontend/`, `workers/`
- **By bounded context:** `ordering/`, `fulfillment/`, `inventory/`

새로 온 팀원도 쉽게 이해할 수 있는 방식을 고르세요. 나중에 다듬어도 됩니다. [개념: 사양](/ko-KR/concepts/#specs)을 참조하세요.

## 모노레포와 여러 저장소에 걸친 작업

모노레포에서는 저장소 루트에 `openspec/` 디렉터리를 하나 두고, 패키지나 서비스에 맞춰 도메인을 구성하는 것이 가장 간단합니다. 대부분의 팀에는 이 방식이면 충분합니다.

작업이 실제로 **여러 저장소**(또는 별개로 취급하는 여러 패키지)에 걸친다면 OpenSpec의 베타 **stores** 기능을 사용할 수 있습니다. 계획을 독립된 전용 저장소에 두고 코드 저장소에서 참조하므로 특정 저장소의 `openspec/` 폴더에 계획을 둘 필요가 없습니다. 베타 기능이므로 명령과 동작이 계속 바뀔 수 있다는 점에 유의하세요. 개념과 최소한의 사용 방법은 [Stores 사용자 안내서](/ko-KR/stores-beta/user-guide/)에서 확인하세요.

## 알아둘 주의 사항

- **모든 사양을 미리 채우려는 충동을 참으세요.** 변경하지 않을 코드의 사양을 작성하면 생산적인 것처럼 느껴지지만 대개 그렇지 않습니다. 현실을 반영하도록 강제하는 요소가 없으므로 사양이 오래될 수 있습니다. 실제 변경 사항을 바탕으로 사양을 작성하세요.
- **초기 변경 사항은 작게 유지하세요.** 처음 몇 번의 변경은 배포만큼이나 흐름을 익히는 과정이기도 합니다. 범위를 좁히면 빠르게 진행하고 부담 없이 배울 수 있습니다.
- **`openspec/`를 git에 커밋하세요.** 사양과 보관 기록은 설명하는 코드와 함께 버전 관리되어야 합니다.
- **AI에 맥락을 제공하세요.** 규칙이 명확한 대규모 코드베이스라면 `openspec/config.yaml`의 `context:`를 채워 모든 제안이 기술 스택과 패턴을 따르도록 하세요. [사용자 지정](/ko-KR/customization/#project-configuration)을 참조하세요.

## 다음 단계

- [먼저 탐색하기](/ko-KR/explore/) — 변경 전에 코드를 이해하는 핵심 습관
- [시작하기](/ko-KR/getting-started/) — 첫 변경 사항을 처음부터 끝까지 안내
- [변경 사항 편집 및 반복 개선](/ko-KR/editing-changes/) — 작업을 진행하며 변경 사항 조정하기
- [개념: 델타 사양](/ko-KR/concepts/#delta-specs) — 델타가 기존 시스템 작업을 명확하게 만드는 이유
- [사용자 지정](/ko-KR/customization/) — OpenSpec에 프로젝트 관례를 적용하기
