---
title: "먼저 탐색하기"
---

**`/opsx:explore`는 함께 생각해 주는 파트너입니다. 문제는 있지만 계획이 아직 없을 때 언제든 사용하세요.** 코드 한 줄을 작성하기 전에 코드베이스를 조사하고, 여러 선택지를 비교하며, 실제로 원하는 바를 구체화합니다. 방향이 명확해지면 `/opsx:propose`로 이어집니다.

이 문서에서 습관 하나만 익힌다면 다음을 기억하세요. **확신이 서지 않을 때는 제안하기 전에 먼저 탐색하세요.**

이 원칙이 중요한 이유는 AI 코딩 어시스턴트가 적극적으로 작업하기 때문입니다. 막연하게 요청하면 무언가를 자신 있게 만들겠지만, 필요한 결과가 아닐 수도 있습니다. 탐색이 해결책입니다. 부담 없이 AI와 함께 올바른 방향을 찾는 대화를 나누면, 제안할 때는 실제로 필요한 내용을 제안할 수 있습니다.

## 탐색이 필요한 경우

생각보다 자주 탐색부터 시작하는 것이 올바른 선택입니다. 다음 중 하나라도 해당하면 사용하세요.

- *문제*는 알지만 *해결책*은 모릅니다. ("페이지가 느립니다." "인증이 엉망입니다." "주문이 계속 중복됩니다.")
- 여러 접근 방법 중에서 선택해야 하며 실제 코드에 적용했을 때의 장단점을 알고 싶습니다.
- 코드베이스를 처음 접해 무언가를 변경하기 전에 작동 방식을 파악해야 합니다.
- 요구 사항이 모호해 확정하기 전에 명확하게 다듬고 싶습니다.
- 작업 규모가 겉보기보다 크거나 작을 것 같아 실제 범위를 파악하고 싶습니다.

원하는 결과와 방법을 정확히 알고 있을 때만 탐색을 건너뛰세요. 이 경우 바로 [`/opsx:propose`](/ko-KR/commands/#opsxpropose)로 시작하면 됩니다.

## 탐색이 하는 일과 하지 않는 일

탐색은 생성기가 아니라 **대화**입니다.

**하는 일:**
- 실제 질문에 답하기 위해 코드베이스를 읽고 검색합니다.
- 여러 선택지를 비교하고 각각의 장단점을 설명합니다.
- 설계를 이해하기 쉽게 다이어그램으로 표현합니다.
- 막연한 아이디어를 구체적이고 구현 가능한 범위로 좁히도록 돕습니다.
- 요청하거나 제안을 수락하면 탐색 내용을 기록합니다. `openspec new change`로 변경 사항의 기본 구조를 만들고 지정한 계획 산출물을 작성하거나 기존 변경 사항의 산출물을 업데이트합니다.
- 준비가 되면 `/opsx:propose`로 전환합니다.

**하지 않는 일:**
- 코드를 작성하거나 수정하지 않습니다. 탐색 내용을 기록하는 경우에도 어떤 경로에서든 코드는 작성하지 않습니다.
- 스키마나 템플릿을 설계하거나 편집하지 않습니다. 이를 구성하는 것은 생각하는 일이 아니라 변경 사항에 해당합니다.
- 스스로 변경 사항을 시작하거나 산출물을 작성하지 않습니다. 요청하거나 제안에 동의하지 않는 한 아무것도 작성하지 않습니다. 동의하더라도 합의한 내용과 변경 사항을 시작하는 데 필요한 설정 파일만 작성합니다(아래 참조).
- 기록하도록 재촉하지 않습니다. 생각이 구체화되면 선택지를 제안할 뿐, 결정은 여러분이 합니다.

그것이 탐색의 목적입니다. 직접 동의하기 전까지 탐색에는 비용도 의무도 따르지 않습니다. 세 가지 막다른 길을 살펴 각각에서 배우고, 끝까지 남은 방향만 제안할 수 있습니다.

## 이미 설치되어 있습니다

좋은 소식입니다. `/opsx:explore`는 `propose`, `apply`, `update`, `sync`, `archive`와 함께 기본 **core** 프로필에 포함되어 있습니다. 별도로 활성화할 필요가 없습니다. 프로젝트에 OpenSpec이 설정되어 있다면 AI 채팅에서 바로 탐색을 사용할 수 있습니다. (다른 `/opsx:*` 명령과 마찬가지로 터미널이 아니라 어시스턴트 채팅에서 입력합니다. [명령 작동 방식](/ko-KR/how-commands-work/)을 참조하세요.)

## 전체 예제

막연한 걱정이 구체적이고 구현 가능한 변경 사항으로 바뀌는 과정을 살펴보세요.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

어떤 일이 일어났는지 살펴보세요. 처음에는 "문제가 있는 것 같은데 건드리기 겁난다"는 막연한 생각뿐이었습니다. 20초 동안 탐색한 결과 원인이 밝혀지고, 순위가 매겨진 세 가지 선택지와 기존 코드에 맞춘 권장 사항, 명확한 변경 사항이 도출됐습니다. 먼저 충분히 생각했기 때문에 이어지는 제안도 구체적입니다.

## 제안 단계로 이어가기

탐색 단계에서 어떤 것도 보관하지 않습니다. 준비가 되면 변경 사항을 시작하기만 하면 되고, AI가 대화의 맥락을 산출물에 반영합니다.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

일반적인 표현으로("이 내용을 변경 사항으로 만들자") 요청하거나 바로 `/opsx:propose <name>`을 실행할 수 있습니다. 어느 쪽이든 방금 진행한 탐색이 버려지는 채팅이 아니라 제안의 기반이 됩니다.

대화를 나가지 않고 탐색에 변경 사항 기록을 요청할 수도 있습니다. "이 내용을 위한 변경 사항을 시작해"라고 하면 폴더를 만들고, "제안도 작성해"라고 하면 지정한 산출물만 작성합니다. 기본 구조를 만들 때 변경 사항의 메타데이터도 생성하며, 프로젝트에 없는 최상위 항목(`openspec/specs/`, `openspec/changes/archive/`, `config.yaml`)도 추가합니다.

결과는 다음 단계로 넘기는 것과 같지만 한 가지 차이가 있습니다. `propose`는 구현에 도달하는 데 스키마가 요구하는 산출물 전체를 작성하지만, 기록 기능은 지정한 산출물만 작성합니다.

확장 명령 모음을 사용하는 경우 탐색에서 단계별 산출물 작성을 위한 `/opsx:new`로 이어갈 수도 있습니다. [워크플로](/ko-KR/workflows/)를 참조하세요.

## 효과적인 탐색을 위한 팁

- **해결책이 아니라 문제를 제시하세요.** "로그인이 느립니다"라고 하면 AI가 조사할 여지가 생깁니다. "Redis 캐시를 추가해"라고 하면 검증하지 않은 답을 미리 선택하게 됩니다.
- **장단점을 분명하게 물어보세요.** "각 선택지의 단점은 무엇인가요?"라고 물으면 더 솔직한 비교를 얻을 수 있습니다.
- **먼저 코드를 읽게 하세요.** 가장 효과적인 탐색은 AI가 추측하는 대신 실제 코드를 살펴보며 시작합니다. 도움이 된다면 관련 영역을 지정하세요.
- **중단해도 괜찮습니다.** 탐색을 통해 아이디어가 가치가 없다는 사실을 알게 됐다면 성공입니다. 적은 비용으로 배운 것입니다.
- **변경 도중 다시 탐색하세요.** `/opsx:apply` 중 막혔나요? 잠시 돌아가 하위 문제를 탐색한 뒤 다시 진행할 수 있습니다.

## 솔직한 장단점

**얻는 점:** 탐색은 어떤 결정도 확정하기 전, 가장 적은 비용으로 잘못된 방향을 찾아냅니다. 특히 익숙하지 않은 코드에서 AI가 시스템을 읽고 요약하는 능력은 몇 시간 동안 코드를 파악하는 수고를 덜어 줍니다.

**필요한 비용:** 약간의 인내심입니다. 탐색은 대화이므로 `/opsx:propose`를 바로 실행하고 잘 되길 기대하는 것보다 느립니다. 이미 충분히 파악한 작업에서는 불필요한 단계일 뿐이므로 건너뛰세요.

일반 원칙은 다음과 같습니다. 작업이 모호할수록 탐색의 효과가 커집니다. 작업이 명확할수록 바로 제안 단계로 넘어가도 됩니다.

## 다음 단계

- [명령: `/opsx:explore`](/ko-KR/commands/#opsxexplore): 상세 참조
- [워크플로](/ko-KR/workflows/): 일상적인 흐름에서 탐색 활용하기
- [예제 및 레시피](/ko-KR/examples/#recipe-3-exploring-before-you-commit): 전체 과정에서 탐색하기
- [시작하기](/ko-KR/getting-started/): 탐색을 포함한 첫 변경 사항 안내
