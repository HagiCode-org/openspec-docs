---
title: "存储库：将规划放入独立仓库"
---

> **Beta。** 存储库、引用、工作上下文和工作集均为新功能。命令名称、标志、文件格式和 JSON 输出在不同版本间仍可能变化。下方所有操作演示都已在当前构建版本中运行，但升级后请重新阅读本指南。

## 此功能解决的问题

通常，OpenSpec 位于单个代码仓库中：代码旁边有一个 `openspec/` 文件夹，用于存放该仓库的规格说明和变更。

当规划工作超出单个仓库时，这种组织方式就不再合适：

- 工作涉及多个仓库——一项功能同时修改 API 服务器、Web 应用和共享库。计划应该放在哪个仓库的 `openspec/` 文件夹中？
- 团队在代码存在之前就开始规划，或规划不会成为*当前*仓库代码的工作。
- 一个团队负责需求，其他团队使用这些需求。Wiki 上的版本逐渐过时，而编码智能体甚至无法读取它。

**存储库** (store) 就是解决办法：一个专门用于规划的独立仓库。它拥有你熟悉的 `openspec/` 结构——规格说明和变更——以及一个小型身份文件。你只需在本机按名称注册一次，之后就能在任何位置使用所有常规 OpenSpec 命令操作它。

## 结构

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

两条规则让一切保持简单：

1. **存储库只是普通的 git 仓库。** 由你自己提交、推送、拉取和审查。OpenSpec 不会自行克隆、同步或推送任何内容。
2. **声明，而非机制。** 仓库可以*声明*自己与存储库之间的关系（下文将介绍）。声明会改变 OpenSpec 能向你提供的信息，但绝不会改变命令的操作位置。

## 五分钟创建第一个存储库

只需两个命令，就能从零开始创建存储库并生成一项限定到该存储库的变更：

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

整体模型就是如此。从这里开始，生命周期与你熟悉的完全相同——`status`、`instructions`、`validate`、`archive`——只需在每条命令中添加 `--store team-plans`，所有输出提示也都会带上此标志。`Using OpenSpec root:` 行会始终指出命令当前操作的位置。

## 场景：一个团队，一个规划仓库

团队将规格说明和变更集中保存在 `team-plans` 中，而非分散到各个代码仓库。

**第一天（由负责设置的人执行）：**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

传入 `--remote` 会将克隆 URL 记录到存储库自身的身份文件 (`.openspec-store/store.yaml`) 中，并包含在初始提交里。以后克隆存储库时，它就会带有来源信息，因此健康检查和错误消息可以为还没有该仓库的队友提供一条完整且可直接粘贴执行的修复命令。

**每位队友（每台机器执行一次）：**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

此后，所有人都可以通过名称在同一个规划仓库中工作：

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**有意使用 git 来共享工作。** 你创建的变更在提交并推送之前只存在于自己的检出目录中——这与代码相同。由于存储库是普通仓库，规划工作也能自然使用分支、拉取请求和代码审查。

**连接团队的代码仓库。** 如果某个代码仓库完全将规划工作外置，只需在 `openspec/config.yaml` 中加入一行：

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

此后，在 `web-app` 中运行的每条 OpenSpec 命令都会直接操作 `team-plans`，无需任何标志：

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

此指针只是回退机制，不会强制覆盖其他选择：显式传入 `--store` 始终优先；如果仓库后来出现自己的真实规划目录，则本地目录会优先（并发出警告，建议移除过期指针）。

**在本机为所有仓库设置一个默认值。** 如果你有很多代码仓库都使用同一个存储库进行规划，可以在全局设置一次，而不必在每个仓库中都添加 `store:`：

```bash
openspec config set defaultStore team-plans
```

此后，在规划根目录之外运行的命令，只要没有 `--store` 标志和项目指针，就会解析到 `team-plans`。它位于优先级列表的最后，因此 `--store`、本地根目录和项目级 `store:` 指针仍然优先。根目录横幅和 JSON `root` 块会将 `source: "global_default"` 与存储库 ID 一起报告，因此你能分辨机器范围的默认值和仓库自身指针。运行 `openspec config unset defaultStore` 可清除此设置。如果该 ID 未注册，命令会报错并提示你注册该存储库或清除过期的默认值。

## 示例：一个功能，两个组件仓库

假设 `add-checkout-promo` 同时修改 `checkout-api` 和 `checkout-web`。团队希望共用一份产品行为约定，但每个代码仓库仍需拥有自己的实现任务、分支和审查。

分为两层来管理：

1. 将共享行为放在 `team-plans` 中。
2. 将实现计划放在各组件仓库中，并以只读上游上下文的方式引用该存储库。

首先，在存储库中规划共享约定：

```bash
openspec new change add-checkout-promo --store team-plans
openspec status --change add-checkout-promo --store team-plans
```

提案和规格说明应描述组件交界处的行为——例如，服务返回哪些促销字段，以及前端如何处理不符合促销条件的结账请求。像审查其他分支和拉取请求一样，在存储库中审查此变更。

### 规划时能看到哪些上下文？

选择存储库会改变 OpenSpec 根目录，但不会自动发现或读取所有使用该存储库的代码仓库。存储库中的指令会读取存储库内的产物和已配置上下文。只有当智能体或编辑器能访问相应组件目录，且智能体实际读取了它们，才会看到组件代码。

使用工作集可以方便地同时打开规划存储库和两个代码仓库：

```bash
openspec workset create checkout-promo \
  --member ~/openspec/team-plans \
  --member ~/src/checkout-api \
  --member ~/src/checkout-web \
  --tool code
openspec workset open checkout-promo
```

这会将这些文件夹显示在同一个 IDE 工作区中。它不会将源代码上下文复制到存储库，不会选择受影响的仓库，也不会授予智能体编辑这些仓库的权限。持久的跨组件事实应写入共享规格说明；不要依赖规划者记住自己偶然检查过的源代码内容。

### 如何在每个仓库中开始实现？

当没有显式的 `--store` 或更近的 `openspec/` 根目录时，`store: team-plans` 指针会将命令路由到该存储库。它不会根据调用 `apply` 时所在的目录，把一个存储库的任务列表拆分到不同仓库中。OpenSpec 目前不会将任务路由到不同代码仓库。

如果每个组件都需要单独确定范围的实现/审查循环，则应为每个组件创建本地 OpenSpec 根目录，并将中央存储库作为引用，而不是直接指向它：

```yaml
# checkout-api/openspec/config.yaml (and likewise in checkout-web)
schema: spec-driven
references:
  - team-plans
```

共享约定在存储库的主规格说明中批准并可用后，为每个组件创建一项小型本地变更：

```bash
cd ~/src/checkout-api
openspec new change implement-checkout-promo-api

cd ~/src/checkout-web
openspec new change implement-checkout-promo-ui
```

各仓库指令中的引用索引会提供存储库规格说明的摘要，以及准确的 `openspec show ... --store team-plans` 获取命令。每个本地提案都引用该共享约定，其任务只描述对应组件的工作。随后分别在每个仓库中运行 `/opsx:apply`；根目录解析机制会确保产物和实现修改限定在各自仓库中。服务端和前端变更可以分别测试、审查、合并和归档。

如果必须在存储库中的共享变更仍处于活动状态时就开始实现，请使用 `openspec show add-checkout-promo --store team-plans` 显式获取该变更；引用索引列出的是规范存储库中的主规格说明，不包括活动变更。请在存储库分支和组件分支的拉取请求描述中互相引用，让审查者知道每个实现依据的是哪个版本的约定。

## 场景：跨越团队边界的需求

平台团队负责需求。产品团队在自己的仓库中根据这些需求实现功能，并采用各自的设计。引用会描述这种关系，但不会转移任何团队的工作。

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

**产品团队在自己的仓库中声明所依赖的内容**，在 `openspec/config.yaml` 中写入：

```yaml
references:
  - platform-reqs
```

引用是只读上下文。仓库仍然保留自己的 `openspec/` 根目录，工作也仍在其中进行。变化在于：该仓库中的 `openspec instructions` 会增加一个被引用存储库规格说明的索引——每条规格都有一行摘要和准确的获取命令（`openspec show <spec-id> --type spec --store platform-reqs`）。在 `api-server` 中工作的智能体可以找到上游支付需求并引用它们，然后在仓库自己的根目录中编写低层设计，不需要任何人手动粘贴上下文。

引用也可以包含克隆来源，这样尚未拥有该存储库的队友就能获得完整的修复建议，而非无处可去的报错：

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**如果你希望同时打开计划和代码，可以创建工作集。** 工作集由个人显式创建：每个人在自己的机器上选择实际要一起工作的文件夹。共享规划仓库不会提交任何本地检出路径。

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## 随时可以提出的两个问题

**“我的设置是否正常？”**——`openspec doctor` 会以只读方式检查当前根目录及其引用的存储库，并为每项发现提供可直接粘贴的修复命令：

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

**“我正在使用哪些内容？”**——`openspec context` 会依据 OpenSpec 声明汇总工作集：当前根目录和它引用的存储库。

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

这两个命令都支持 `--json`，方便智能体调用。`openspec context --code-workspace <path>` 还会写入一个包含整个工作集的 VS Code 工作区文件——这是此命令唯一执行的写操作。

## 工作集：重新打开一起工作的文件夹

与以上功能不同，大多数人每次会话都会同时打开相同的几个文件夹——规划仓库以及两三个代码仓库。**工作集**是一个可重复打开的个人视图，准确记录这些文件夹；通过一条命令即可在所选工具中重新打开。

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

之后运行 `openspec workset open platform` 会启动已保存的工具：编辑器（VS Code、Cursor）会打开一个包含所有成员的窗口，命令随后返回。第一个成员是主成员。任何时候都可以用 `--tool <id>` 覆盖工具设置。

工作集特意不作为共享状态。它们保存在你的机器上，不会提交，也不会对工作内容作出任何声明——只记录你喜欢同时打开哪些文件夹。删除工作集不会影响成员文件夹。新增工具属于配置而非代码：可以在全局配置的 `openers` 键下添加通过工作区文件或逐目录附加标志启动的工具（运行 `openspec config edit` 打开配置）。

## 命令如何决定操作位置

所有常规命令都会按相同顺序解析根目录：

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

`Using OpenSpec root:` 行（以及 `--json` 输出中的 `root` 块）会告诉你当前使用的是哪种情形。

## 已知限制

- **Beta 功能仍在变化。** 本页介绍的所有内容都可能随版本变化，包括名称、标志、文件格式和 JSON 键。
- **每台机器上的每个存储库 ID 只能对应一个检出目录。** 若在同一 ID 下注册第二个检出目录会失败，并提示先运行 `store unregister`。
- **绝不自动同步，这是有意设计。** OpenSpec 从不克隆、拉取或推送。检出目录过期时，其规格说明会保持过期，直到*你自己*拉取；引用始终从磁盘上的当前内容实时建立索引。
- **规划目录可能暂时不存在。** 新存储库在 Git 中可能还没有 `openspec/changes/`、`openspec/specs/` 或 `openspec/changes/archive/`。Beta 阶段允许这种情况；常规命令创建相应文件后，目录就会出现。
- **指针仓库仍然只是指针。** 只有配置文件，且 `openspec/config.yaml` 声明了 `store: <id>` 的仓库，会被视为外置规划，而不是需要注册的存储库检出目录。如果你明确希望把它转换为本地存储库根目录，请先删除 `store:` 行。
- **部分命令仍固定在当前目录中运行。** `templates` 和已弃用的名词形式（`openspec change show` 等）只作用于当前目录，不支持 `--store`。`schemas` 遵循标准根目录选择优先顺序并接受 `--store <id>`，同时保持成功时 JSON 数组的原有结构。
- **每台机器的状态彼此独立。** 存储库注册表和工作集都是本地设置。机器的目录布局不会提交到共享规划仓库。
- **工作集支持两种启动方式。** 无法通过工作区文件或逐目录附加标志启动的工具，不能作为 opener 添加。
- **智能体 JSON 中存在已知的键名大小写差异**（store 系列使用 snake_case，workflow 系列使用 camelCase）。详见[智能体契约](/zh-CN/agent-contract/)；统一键名的工作会推迟到后续带版本的发布中。

## 文件分别存放在哪里

| 内容 | 位置 | 是否共享？ |
|---|---|---|
| 存储库规划内容 | `<store>/openspec/`（规格说明、变更） | 是——提交并推送 |
| 存储库身份信息 | `<store>/.openspec-store/store.yaml` | 是——随存储库一起提交 |
| 存储库注册表 | `<data dir>/openspec/stores/registry.yaml` | 否——仅保存在本机 |
| 工作集 | `<data dir>/openspec/worksets/` | 否——仅保存在本机 |

在 macOS 和 Linux 上，`<data dir>` 是 `~/.local/share/openspec`（若设置了 `$XDG_DATA_HOME`，则使用 `$XDG_DATA_HOME/openspec`）；在 Windows 上则是 `%LOCALAPPDATA%\openspec`。

## 参考资料

本页介绍的各命令的准确标志和 JSON 结构见：[CLI 参考](/zh-CN/cli/)（Stores、Doctor、Working context、Personal worksets）以及[智能体契约](/zh-CN/agent-contract/)。
