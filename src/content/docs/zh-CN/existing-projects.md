---
title: "在现有项目中使用 OpenSpec"
---

**开始时无需记录整个代码库，只需为即将修改的部分编写规格说明。** 这是在现有项目中采用 OpenSpec 最重要的一点，也正是 OpenSpec 以棕地项目为优先进行设计的原因。

常见的担忧是：“我的应用已经有 80,000 行代码了。要让 OpenSpec 发挥作用，我是不是得先为所有代码编写规格说明？”不用。你不会想这么做，我们也不希望你这么做。OpenSpec 会随每次变更逐步积累规格说明。第一次变更记录它涉及的部分，下一次变更记录另一部分，几个月后，规格说明便会围绕你实际开展的工作自然充实起来。

本指南介绍如何从第一天开始使用 OpenSpec，而无需试图一次性处理所有事情。

## 三十秒了解

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

然后在 AI 聊天中输入：

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

现在，你的规格说明准确描述了这项变更所涉及的系统部分，仅此而已。这完全正确。无需再担心其余 80,000 行代码。

## 先写差异是关键

OpenSpec 变更以**差异**形式编写：`ADDED`、`MODIFIED`、`REMOVED`。差异描述相对于当前行为发生了什么变化，而不是整个系统的全部情况。

这恰好满足棕地项目的需要。你很少从零开始构建：可能是新增一个字段、修复重定向，或缩短超时时间。使用差异，你就能准确描述这项变更，而无需事先为周边所有内容编写一份 40 页的规格说明。

因此，你的 `openspec/specs/` 目录一开始并不完整。它从近乎空白开始，然后逐渐积累内容。每次归档都会将相应差异合并进去。只有在你已经多次修改 `auth/` 后，其中的规格说明才会逐渐完善——而这也正是你需要它完善的时候。

想进一步了解其运作方式，请参阅[概念：差异规格说明](/zh-CN/concepts/)。

## 在真实代码库中的第一个变更

选择一项小而真实的工作。不要选玩具项目，也不要选重写。选一项你本来就打算在本周完成的变更。以小变更起步，能让你在风险较低的情况下熟悉工作流。

**第 1 步：让 AI 阅读相关部分。** 在不熟悉或规模庞大的代码库中，`/opsx:explore` 尤其有用。让它检查你即将修改的区域，先了解代码的工作方式，再开始提案。

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

注意，此时 AI 已经了解你的实际结构，因此它编写的提案会适合你的代码，而不是套用通用模板。对大型代码库而言，这个习惯最能减少后续麻烦。参阅[先探索](/zh-CN/explore/)。

**第 2 步：提出变更。** 提案和差异规格说明只记录这项变更。

```text
You: /opsx:propose add-api-rate-limiting
```

**第 3 步：实现并归档。** 像处理其他变更一样，使用 `/opsx:apply` 和 `/opsx:archive`。归档后，你就拥有了一份真实的限流行为规格说明，而且它来自你本来就需要完成的变更。

## 想要引导式体验？使用 onboard

如果你希望在自己的代码上看到整个流程并听取说明，扩展命令 `/opsx:onboard` 正好可以做到：它会扫描代码库，寻找一项小而安全的改进，然后逐步带你完成提案、实现和归档，并解释每一步。

先启用扩展命令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

然后在聊天中输入：

```text
/opsx:onboard
```

这是在真实项目中最温和的入门方式，并会留下一个真正（但很小）的变更，你可以选择保留或放弃。参阅[命令：`/opsx:onboard`](/zh-CN/commands/)。

## “可是我已经有需求文档了”

也许你有 PRD、SRS、正式规格说明，甚至 TLA+ 模型。很好。无需把它们整体导入，也无需丢弃它们。

把现有文档当作**探索的素材**，而不是需要转换的规格说明。开始一项变更时，将相关部分粘贴给 AI 或告诉它去哪里查看，让它据此整理出范围明确的 OpenSpec 差异。差异会以 OpenSpec 可测试的需求与场景形式，记录你现在要修改的行为。原始文档仍留在原处，作为背景资料。

原因很实际：OpenSpec 规格说明特意以行为为先，并围绕变更划定范围。一份 40 页的 PRD 是用途不同的另一种产物。强行一次性批量转换，往往会产生一份庞大且过时、没人信任的规格说明。让规格说明随实际变更逐步成长，才能保持准确。

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## 在大型代码库中组织规格说明

规格说明放在 `openspec/specs/` 下，按**领域**分组。领域是符合团队系统思维方式的逻辑区域。你无需事先设计完整的分类体系；某个区域的第一个变更需要时，再创建相应的领域文件夹即可。

常见的领域划分方式：

- **按功能区域：** `auth/`、`payments/`、`search/`
- **按组件：** `api/`、`frontend/`、`workers/`
- **按有界上下文：** `ordering/`、`fulfillment/`、`inventory/`

选择一种让新成员一看就明白的方式即可，以后还可以调整。参阅[概念：规格说明](/zh-CN/concepts/)。

## 单体仓库与跨仓库工作

对于单体仓库，最简单的模式是在仓库根目录放一个 `openspec/` 目录，其中各领域对应不同的软件包或服务。这足以满足大多数团队的需求。

如果工作确实跨越**多个仓库**（或跨越你视为独立单元的多个软件包），OpenSpec 提供 beta 版 **stores** 功能：规划内容放在一个独立仓库中，其他代码仓库都可以引用，这样计划就不必放在某个仓库自己的 `openspec/` 文件夹中。此功能仍处于 beta 阶段，因此命令和状态都可能变化。请从[存储库用户指南](/zh-CN/stores-beta/user-guide/)了解其思维模型和最简实用流程。

## 几点务实提醒

- **不要忍不住去补齐所有内容。** 为当前不会修改的代码编写规格说明，看起来很有效率，通常却不是。由于没有任何机制确保它们与实际情况同步，这些规格说明会过时。让实际变更推动规格说明的完善。
- **初期变更要小。** 前几个变更不仅是为了交付，也是为了熟悉节奏。范围越明确，流程越快，试错成本越低。
- **将 `openspec/` 提交到 git。** 规格说明和归档属于版本控制，应与其描述的代码保存在一起。
- **为 AI 提供上下文。** 对于约定严格的大型代码库，应填写 `openspec/config.yaml` 的 `context:`，让每个提案都遵循你的技术栈和模式。参阅[自定义](/zh-CN/customization/)。

## 接下来读什么

- [先探索](/zh-CN/explore/)——修改代码前了解代码的关键习惯
- [快速入门](/zh-CN/getting-started/)——完整演示第一个变更
- [编辑和迭代变更](/zh-CN/editing-changes/)——随着了解加深调整变更
- [概念：差异规格说明](/zh-CN/concepts/)——了解差异为何适合棕地项目
- [自定义](/zh-CN/customization/)——让 OpenSpec 遵循项目约定
