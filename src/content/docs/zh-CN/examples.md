---
title: "示例与操作配方"
---

从头到尾演示真实变更。每个配方都会展示需要输入的命令以及相应输出，方便你将自己的情况与对应模式匹配并照此操作。示例使用默认的 **core** 命令（`propose`、`explore`、`apply`、`update`、`sync`、`archive`）；需要扩展命令集的地方会特别注明。

开始之前提醒一句：`/opsx:propose` 之类的斜杠命令应在 **AI 助手聊天**中输入；`openspec` 命令则在**终端**中运行。如果你还不熟悉这种区分，请先阅读[命令的工作方式](/zh-CN/how-commands-work/)。下面的对话中，`You:` 和 `AI:` 表示聊天内容，以 `$` 开头的行表示终端命令。

> **还不确定要构建什么？** 多数配方都适合先运行 `/opsx:explore` 梳理思路。[配方 3](/zh-CN/examples/)展示了具体操作，[先探索](/zh-CN/explore/)指南则完整解释了这种做法的价值。

## 配方 1：小型功能，快速路径

**适用场景：** 你清楚自己要什么，而且工作范围明确。这是最常见的配方。

整个流程只需三个命令：提出、实现、归档。

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

现在阅读计划。打开提案和差异规格说明。此时正是 OpenSpec 发挥作用的时刻：趁错误假设还只占一段文字时发现它，而不是等到 400 行代码写完。发现问题时可直接编辑任何产物，然后继续。

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

就是这样。退出登录行为现在已经成为规格说明的一部分，变更连同完整上下文一起归档。

## 配方 2：修复 bug

**适用场景：** 有东西坏了，你希望将修复记录为有意的行为变更，而不是一条来历不明的提交。

修复 bug 的流程与新增功能完全相同。区别在于提案的表述方式：描述*正确*行为，而不只是“修复这个 bug”。

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

修复会以带有新场景的 `MODIFIED` 需求形式记录，因此下一个维护者（或下次 AI 会话）看到的不只是你修复了什么，还会知道“正确”意味着什么。之后像往常一样运行 `/opsx:apply` 和 `/opsx:archive`。

提示：好的修复场景就是用文字写出的回归测试。例如：“GIVEN 一个已退出登录的用户，WHEN 他提交有效凭据，THEN 他会进入仪表板，且不会再次被重定向。”把它写出来，实现就有了明确目标。

## 配方 3：在作出决定之前先探索

**适用场景：** 你遇到了问题，但还没有计划。不确定要构建什么，或哪个方案更合适。

从 `/opsx:explore` 开始。这是一位没有固定流程的思考伙伴。它不会编写代码；除非你要求记录最终决定，或在它提出时表示同意，否则也不会写入任何内容。它会读取代码库并协助你作出决定。

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

探索能在你决定为它创建变更之前，先厘清思路。获得明确结论后，再提出变更，AI 会将上下文带入后续工作。

## 配方 4：同时处理两项变更

**适用场景：** 你正在实现某项功能，突然出现一项更紧急的修复工作。

变更位于不同文件夹，因此并行处理不会相互冲突。开始修复、发布后，再回到功能开发继续之前的工作。

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

如果同时有多项活动中的变更，在 `/opsx:apply add-dark-mode` 中写明变更名称，就能指定要处理哪一项。由于任务完成状态记录在 `tasks.md` 中，AI 能准确知道你上次停在哪里。

同时完成多项变更时，扩展命令 `/opsx:bulk-archive` 可以将它们一起归档，并依据实际实现内容解决规格说明冲突。参阅[工作流](/zh-CN/workflows/)。

## 配方 5：不改变行为的重构

**适用场景：** 你正在重组代码，但外部可见行为应保持完全一致。

这是一个有意思的情况，因为纯重构*没有任何内容需要添加到规格说明中*。行为约定没有变化，只有实现方式改变。因此，这项工作记录在设计和任务中，规格差异则为空或不存在。

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

在变更的 `.openspec.yaml` 中设置 `skip_specs: true`，以明确声明没有差异：

```yaml
schema: spec-driven
skip_specs: true
```

如果没有此标记，`openspec validate` 会拒绝零差异变更（因此遗漏规格说明阶段仍会被发现）；添加标记后，验证会通过，`openspec status` 也会将规格阶段显示为明确跳过，而非待处理。如果重构最终确实改变了行为，请从 `.openspec.yaml` 中删除 `skip_specs` 并编写差异规格说明——验证会把标记与规格文件视为冲突，因此过期标记不会悄悄留存。

归档带有此标记的变更无需额外标志（没有差异需要合并）。此外，终端命令的 `--skip-specs` 标志会明确跳过规格说明步骤：

```bash
$ openspec archive refactor-payment-module --skip-specs
```

这个标志也适用于工具、CI 和仅修改文档的变更。原则是：规格说明描述行为；如果行为未变，规格说明也不应改变。参阅[概念](/zh-CN/concepts/)。

## 配方 6：逐步控制（扩展命令）

**适用场景：** 变更复杂或风险较高，你希望每个产物完成后都能先审阅再继续。

core 命令 `/opsx:propose` 会一次性起草所有内容。如果你希望逐步处理，请启用扩展命令：

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

然后逐步搭建并完善变更：

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

每个产物生成后都可以先审阅并随意编辑，满意后再继续。想一次性起草其余内容时，`/opsx:ff` 会快速生成剩余规划产物。归档之前，`/opsx:verify` 会检查实现是否确实符合规格说明。参阅[工作流](/zh-CN/workflows/)。

## 配方 7：亲自走一遍完整流程

**适用场景：** 你已经安装 OpenSpec，希望在自己的代码上*体验*整个工作流，而不是只看玩具示例。

启用扩展命令（见配方 6），然后：

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` 会在你的代码库中找到一个真实但较小的改进点，为其创建变更、完成实现并归档，同时逐步说明每个步骤。整个过程约需 15 到 30 分钟，最后会留下一个真实变更，你可以选择保留或放弃。这是最温和的学习方式。参阅[命令](/zh-CN/commands/)。

## 在终端中检查工作

任何时候都可以从终端检查当前状态：

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

这些工具用于读取和检查。提案和实现仍通过聊天中的斜杠命令完成。完整详情见 [CLI 参考](/zh-CN/cli/)。

## 接下来读什么

- [先探索](/zh-CN/explore/)：不确定时建议采用的起步方式
- [工作流](/zh-CN/workflows/)：以上模式，以及何时采用哪种模式的指引
- [命令](/zh-CN/commands/)：所有斜杠命令的详细说明
- [快速入门](/zh-CN/getting-started/)：标准的首次变更完整演示
- [概念](/zh-CN/concepts/)：了解各部分如何相互配合
