---
title: "Stores: 전용 저장소에서 계획하기"
---

> **베타.** Stores, 참조, 작업 컨텍스트, 작업 세트는 새로운 기능입니다.
> 릴리스에 따라 명령 이름, 플래그, 파일 형식, JSON 출력이 바뀔 수 있습니다.
> 아래 안내는 현재 빌드에서 모두 실행해 확인했지만 업그레이드한 뒤에는
> 이 안내서를 다시 읽어 보세요.

## 해결하려는 문제

일반적으로 OpenSpec은 하나의 코드 저장소 안에 있습니다. 코드 옆의 `openspec/` 폴더에 해당 저장소의 사양과 변경 사항을 담습니다.

계획이 저장소 하나보다 큰 순간 이 방식은 맞지 않게 됩니다.

- 작업이 여러 저장소에 걸칩니다. 하나의 기능이 API 서버, 웹 앱, 공유 라이브러리에 영향을 줍니다. 계획은 어느 저장소의 `openspec/` 폴더에 두어야 하나요?
- 팀이 코드가 존재하기 전부터 계획하거나 *현재* 저장소의 코드가 되지 않을 작업을 계획합니다.
- 한 팀이 요구 사항을 소유하고 다른 팀이 활용합니다. 위키 내용은 실제와 달라지고 코딩 에이전트도 읽을 수 없습니다.

**Store**가 해결책입니다. 계획을 전담하는 독립 저장소입니다. 이미 익숙한 사양 및 변경 사항 구조의 `openspec/` 폴더에 작은 식별 파일이 추가됩니다. 컴퓨터에 이름을 지정해 한 번 등록하면 어디서든 일반 OpenSpec 명령으로 작업할 수 있습니다.

## 구조

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

다음 두 가지 원칙으로 간단하게 유지할 수 있습니다.

1. **Store는 일반 git 저장소입니다.** 직접 커밋, 푸시, 풀, 검토를 합니다. OpenSpec은 저장소를 복제하거나 동기화하거나 직접 푸시하지 않습니다.
2. **기계적 동작이 아니라 선언을 사용합니다.** 저장소에서 store와의 관계를 *선언*할 수 있습니다(아래 참조). 선언은 OpenSpec이 제공하는 정보를 바꾸지만 명령이 작동하는 위치는 바꾸지 않습니다.

## 5분 만에 첫 store 만들기

명령 두 개로 아무것도 없는 상태에서 store를 대상으로 하는 변경 사항을 만들 수 있습니다.

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

이것이 전체 구조입니다. 이제 `status`, `instructions`, `validate`, `archive`와 같은 익숙한 명령을 각각 `--store team-plans`와 함께 사용하면 됩니다. 출력되는 안내에도 해당 플래그가 포함됩니다. `Using OpenSpec root:` 줄에서 명령이 작동하는 위치를 항상 확인할 수 있습니다.

## 사용 사례: 한 팀, 하나의 계획 저장소

팀은 코드 저장소 곳곳에 사양과 변경 사항을 흩어 두는 대신 `team-plans`에 보관합니다.

**첫날(설정을 진행하는 사람):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

`--remote`를 전달하면 저장소 자체의 식별 파일(`.openspec-store/store.yaml`)에 복제 URL을 기록하고 초기 커밋에 포함합니다. 이후 복제본은 원본을 자동으로 알게 되므로 아직 store가 없는 팀원에게 상태 확인 및 오류 메시지에서 복사해 사용할 수 있는 전체 해결 방법을 제공할 수 있습니다.

**각 팀원(컴퓨터별로 한 번):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

이후 모두 이름으로 같은 계획 저장소에서 작업합니다.

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**의도적으로 git을 통해 작업을 공유합니다.** 직접 만든 변경 사항은 코드와 마찬가지로 커밋하고 푸시할 때까지 현재 체크아웃에만 존재합니다. Store는 일반 저장소이므로 계획도 브랜치, 풀 리퀘스트, 검토를 그대로 활용할 수 있습니다.

**팀의 코드 저장소 연결하기.** 계획을 완전히 외부화한 코드 저장소에서는 `openspec/config.yaml`에 한 줄만 추가하면 됩니다.

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

이제 `web-app` 안에서 실행하는 모든 OpenSpec 명령이 플래그 없이 `team-plans`에서 작동합니다.

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

포인터는 기본 경로일 뿐 우선하는 설정이 아닙니다. 명시적인 `--store`가 항상 우선하며 저장소에 실제 계획 폴더가 생기면 해당 폴더를 사용하고 오래된 포인터를 삭제하라는 경고를 표시합니다.

**컴퓨터의 모든 저장소에 기본값 하나 적용하기.** 많은 코드 저장소에서 같은 store를 사용한다면 모든 저장소에 `store:` 줄을 추가하는 대신 전역으로 한 번 설정하세요.

```bash
openspec config set defaultStore team-plans
```

이제 계획 루트 밖에서 `--store` 또는 프로젝트 포인터 없이 실행한 명령은 모두 `team-plans`를 사용합니다. 우선순위 목록의 가장 낮은 위치에 있으므로 `--store`, 로컬 루트, 프로젝트 `store:` 포인터가 모두 우선합니다. 루트 배너와 JSON `root` 블록에 store ID와 함께 `source: "global_default"`가 표시되므로 컴퓨터 전역 기본값과 저장소 자체 포인터를 구분할 수 있습니다. `openspec config unset defaultStore`로 설정을 해제하세요. ID가 등록되지 않았으면 명령에서 오류를 출력하고 등록하거나 오래된 기본값을 지우라고 안내합니다.

## 예제: 하나의 기능, 두 구성 요소 저장소

`add-checkout-promo`가 `checkout-api`와 `checkout-web` 모두를 변경한다고 가정해 보세요. 팀은 제품 계약을 하나로 공유하면서 각 코드 저장소에 별도 구현 작업, 브랜치, 검토 절차를 유지하고 싶어 합니다.

두 계층을 사용합니다.

1. 공유 동작은 `team-plans`에 둡니다.
2. 구현 계획은 각 구성 요소 저장소에 두고 store를 읽기 전용 상위 컨텍스트로 참조합니다.

먼저 store에서 공유 계약을 계획합니다.

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

제안과 사양에서는 구성 요소 간 경계의 동작을 설명해야 합니다. 예를 들어 서비스가 반환하는 프로모션 필드와 프런트엔드에서 프로모션 대상이 아닌 결제를 처리하는 방법입니다. 다른 브랜치 및 풀 리퀘스트와 마찬가지로 store 저장소에서 이 변경 사항을 검토하세요.

### 계획에서 볼 수 있는 컨텍스트는 무엇인가요?

Store를 선택하면 OpenSpec 루트가 바뀌지만 해당 store를 사용하는 모든 코드 저장소를 검색하거나 읽지는 않습니다. Store 지침에서는 store의 산출물과 구성된 컨텍스트를 볼 수 있습니다. 구성 요소 코드 폴더도 에이전트나 편집기에서 사용할 수 있고 에이전트가 실제로 읽는 경우에만 볼 수 있습니다.

작업 세트를 사용하면 계획 store와 코드 저장소 두 개를 편리하게 함께 열 수 있습니다.

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

이렇게 하면 폴더를 하나의 IDE 작업 영역에서 볼 수 있습니다. 소스 컨텍스트를 store에 복사하거나 영향을 받는 저장소를 선택하거나 에이전트에 해당 저장소를 편집할 권한을 부여하지는 않습니다. 구성 요소 간에 변하지 않는 정보는 공유 사양에 기록하고 계획 담당자가 우연히 확인한 소스 코드를 기억하리라 기대하지 마세요.

### 각 저장소에서 구현을 어떻게 시작하나요?

명시적인 `--store`나 더 가까운 `openspec/` 루트가 없으면 `store: team-plans` 포인터가 명령을 해당 store로 보냅니다. 그렇다고 `apply`를 실행한 디렉터리에 따라 store 작업 목록을 나누지는 않습니다. 현재 OpenSpec은 작업을 저장소별로 라우팅하지 않습니다.

각 구성 요소에 독립된 범위의 apply/검토 과정이 필요하면 중앙 store를 포인터로 지정하는 대신 로컬 OpenSpec 루트를 만들고 중앙 store를 참조하세요.

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

공유 계약을 승인해 store의 기본 사양에 반영한 후 각 구성 요소 부분을 위한 작은 로컬 변경 사항을 만드세요.

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

각 저장소의 지침에 포함된 참조 색인에서 store 사양 요약과 정확한 가져오기 명령(`openspec show ... --store team-plans`)을 확인할 수 있습니다. 각 로컬 제안은 공유 계약을 참조하며 작업 목록에는 해당 구성 요소의 작업만 기록합니다. 각 저장소에서 `/opsx:apply`를 개별적으로 실행하세요. 루트 선택에 따라 산출물과 구현 수정이 해당 저장소 범위로 제한됩니다. 이제 서비스와 프런트엔드 변경 사항을 서로 독립적으로 테스트, 검토, 병합, 보관할 수 있습니다.

공유 store 변경 사항이 아직 진행 중인 동안 구현을 시작해야 한다면
fetch it explicitly with
`openspec show add-checkout-promo --store team-plans`; 참조 색인에는 진행 중인 store 변경 사항이 아니라 표준 store 사양이 나열됩니다. 검토자가 각 구현에서 어떤 계약 버전을 따르는지 확인할 수 있도록 PR 설명에서 store 브랜치와 구성 요소 브랜치를 연결하세요.

## 사용 사례: 팀 간 요구 사항

플랫폼 팀이 요구 사항을 소유하고 제품 팀은 자체 저장소에서 고유한 설계를 바탕으로 이를 구현합니다. 참조를 사용하면 누구의 작업도 이동하지 않고 이러한 관계를 설명할 수 있습니다.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**제품 팀은 활용하는 항목을 저장소의**
`openspec/config.yaml`:

```yaml
references:
  - platform-reqs
```

참조는 읽기 전용 컨텍스트입니다. 저장소는 자체 `openspec/` 루트를 유지하고 작업도 그 안에서 진행합니다. 달라지는 점은 해당 저장소의 `openspec instructions`에 참조된 store 사양 색인이 포함된다는 것입니다. 각 사양의 한 줄 요약과 정확한 가져오기 명령(`openspec show <spec-id> --type spec --store platform-reqs`)이 표시됩니다. `api-server`에서 작업하는 에이전트는 업스트림 결제 요구 사항을 찾아 참조하고 저장소 자체 루트에 세부 설계를 작성할 수 있습니다. 누구도 컨텍스트를 복사해 붙일 필요가 없습니다.

참조에 복제 원본을 포함하면 아직 store가 없는 팀원도 막다른 안내 대신 완전한 해결 방법을 얻을 수 있습니다.

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**계획과 코드를 함께 열려면 작업 세트를 만드세요.** 개인별로 명시적으로 설정합니다. 각자가 자신의 컴퓨터에서 실제로 작업할 폴더를 선택합니다. 로컬 체크아웃 경로는 공유 계획 저장소에 커밋되지 않습니다.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 언제든 확인할 수 있는 두 가지 질문

**"설정이 정상인가요?"** — `openspec doctor`는 현재 루트와 참조된 store를 읽기 전용으로 확인하며 각 문제에 대해 복사해 사용할 수 있는 해결 방법을 제공합니다.

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"무엇을 대상으로 작업하고 있나요?"** — `openspec context`는 OpenSpec 선언을 바탕으로 루트와 참조된 store를 작업 집합으로 구성합니다.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

두 명령 모두 에이전트용 `--json`을 지원합니다. `openspec context --code-workspace <path>`는 전체 집합이 포함된 VS Code workspace 파일도 작성합니다. 이 명령이 수행하는 유일한 쓰기 작업입니다.

## 작업 세트: 함께 작업하는 폴더 다시 열기

앞에서 설명한 기능과는 별개로, 대부분의 사용자는 매 세션마다 같은 몇 개의 폴더, 즉 계획 저장소와 코드 저장소 두세 개를 함께 엽니다. **작업 세트**는 이러한 폴더를 개인 이름으로 저장하는 보기이며 원하는 도구에서 명령 하나로 다시 열 수 있습니다.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

그런 다음 `openspec workset open platform`을 실행하면 저장된 도구가 시작됩니다. VS Code, Cursor와 같은 편집기는 모든 구성원이 포함된 창을 열고 반환합니다. 첫 번째 구성원이 기본 항목입니다. 언제든 `--tool <id>`로 도구를 재정의할 수 있습니다.

작업 세트는 의도적으로 공유 상태로 취급하지 않습니다. 자신의 컴퓨터에만 있으며 커밋되지 않고 작업 내용도 표현하지 않습니다. 함께 열어 두고 싶은 폴더만 기록합니다. 작업 세트를 삭제해도 구성원 폴더에 영향을 주지 않습니다. 새 도구 지원은 코드가 아니라 구성입니다. workspace 파일 또는 폴더별 연결 플래그를 통해 실행하는 도구는 전역 구성의 `openers` 키에 추가할 수 있습니다(`openspec config edit`).

## 명령 실행 위치 결정 방식

모든 일반 명령은 같은 순서로 루트를 확인합니다.

```
1. --store <id>          you said so explicitly        → that store
2. nearest openspec/     a real planning root here     → this repo
   (walking up from cwd)
3. store: pointer        config.yaml declares a store  → that store
4. defaultStore          global config sets a machine  → that store
                         default
5. none of the above     stores registered on this     → error with a
                         machine?                        selection hint
                         no stores registered?         → the current
                                                          directory
                                                          (classic behavior)
```

`Using OpenSpec root:` 줄과 `--json` 출력의 `root` 블록에서 현재 어떤 경우에 해당하는지 확인할 수 있습니다.

## 알려진 제한 사항

- **베타 기능.** 명령 이름, 플래그, 파일 형식, JSON 키 등 이 페이지의 내용은 릴리스마다 바뀔 수 있습니다.
- **컴퓨터별 store ID당 체크아웃 하나.** 같은 ID로 두 번째 체크아웃을 등록하면 먼저 `store unregister`를 실행하라는 안내와 함께 실패합니다.
- **의도적으로 동기화하지 않습니다.** OpenSpec은 복제, pull, push를 하지 않습니다. 직접 pull할 때까지 오래된 체크아웃에는 오래된 사양이 표시됩니다. 참조는 디스크에 있는 내용을 실시간으로 색인합니다.
- **빈 계획 폴더는 없어도 됩니다.** 새 store의 Git에는 아직 `openspec/changes/`, `openspec/specs/`, `openspec/changes/archive/`가 없을 수 있습니다. 베타 기간에는 이를 허용하며 일반 명령에서 파일을 만들면 폴더도 생성됩니다.
- **포인터 저장소는 포인터로 남습니다.** `openspec/config.yaml`에 `store: <id>`가 선언된 구성 전용 저장소는 등록할 store 체크아웃이 아니라 외부화된 계획으로 처리됩니다. 해당 저장소를 로컬 store 루트로 바꾸려면 먼저 `store:` 줄을 제거하세요.
- **일부 명령은 현재 위치에서 계속 작동합니다.** `templates`와 더 이상 사용하지 않는 명사형 명령(`openspec change show` 등)은 `--store` 없이 현재 디렉터리에서만 작동합니다. `schemas`는 표준 루트 선택 우선순위를 따르고 `--store <id>`를 허용하며 기존 성공 JSON 배열 형식을 유지합니다.
- **컴퓨터별 상태는 로컬에만 있습니다.** Store 레지스트리와 작업 세트는 로컬 설정입니다. 컴퓨터의 폴더 구성은 공유 계획 저장소에 커밋되지 않습니다.
- **작업 세트는 두 가지 실행 방식을 사용합니다.** workspace 파일이나 폴더별 연결 플래그를 사용할 수 없는 도구는 실행기로 추가할 수 없습니다.
- **에이전트 JSON에는 키 대소문자 구분이 있습니다**(store 계열은 snake_case, 워크플로 계열은 camelCase). [에이전트 계약](/ko-KR/agent-contract/)에 설명되어 있으며 통합은 버전이 지정된 릴리스 이후로 연기되었습니다.

## 항목별 위치

| 항목 | 위치 | 공유 여부 |
|---|---|---|
| Store의 계획 | `<store>/openspec/`(사양, 변경 사항) | 예 — 커밋 및 푸시 |
| Store의 식별 정보 | `<store>/.openspec-store/store.yaml` | 예 — store와 함께 커밋 |
| Store 레지스트리 | `<data dir>/openspec/stores/registry.yaml` | 아니요 — 이 컴퓨터에만 저장 |
| 작업 세트 | `<data dir>/openspec/worksets/` | 아니요 — 이 컴퓨터에만 저장 |

macOS 및 Linux에서 `<data dir>`은 `~/.local/share/openspec`이고(
설정되어 있으면 `$XDG_DATA_HOME/openspec`), Windows에서는 `%LOCALAPPDATA%\openspec`입니다.

## 참조

이 페이지의 모든 명령에 대한 정확한 플래그 및 JSON 형식은 [CLI 참조](/ko-KR/cli/)(Stores, Doctor, 작업 컨텍스트, 개인 작업 세트)와 [에이전트 계약](/ko-KR/agent-contract/)을 확인하세요.
