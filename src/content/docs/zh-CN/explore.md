---
title: "先探索"
---

**`/opsx:explore` 是你的思考伙伴。当你有问题但尚无计划时，就使用它。** 它会调查代码库、与你一起权衡选项，并在编写任何代码之前，帮你明确真正想要什么。思路清晰后，它会将工作交给 `/opsx:propose`。

如果你只从这些文档中养成一个习惯，就记住这一点：**拿不准时，先探索，再提案。**

这很重要。AI 编程助手总是跃跃欲试。提示含糊时，它们会自信地构建出“某种东西”——但可能不是你需要的东西。Explore 正是解决办法。它是一场没有压力的对话，你和 AI 一起找出正确的做法，这样等你开始提案时，提出的就是正确方案。

## 何时进行探索

比许多人预想的更多时候，探索都是正确的第一步。遇到以下任一情形时都可以使用：

- 你知道*问题*，但不知道*解决方案*。（“页面感觉很慢。”“身份验证一团糟。”“我们总是收到重复订单。”）
- 你正在不同方案之间做选择，想根据实际代码了解各种取舍。
- 你刚接触某个代码库，需要在修改前先弄清楚某部分的工作方式。
- 需求还不明确，想在确定方案前把它们梳理清楚。
- 你怀疑工作量比表面上更大或更小，想如实确定范围。

只有当你已经完全清楚要做什么以及怎么做时，才跳过探索。此时可以直接使用 [`/opsx:propose`](/zh-CN/commands/)。

## 它会做什么（以及不会做什么）

Explore 是一场**对话**，不是生成器。

**它会：**

- 阅读并搜索代码库，以回答实际问题。
- 比较各种方案并说明各自的取舍。
- 绘制图示，让设计更容易理解。
- 帮你将模糊想法收敛为具体且可实现的范围。
- 在你要求或接受它的提议时记录探索结果：使用 `openspec new change` 搭建变更框架，并编写你指定的规划产物，或更新现有变更的产物。
- 在你准备好时转到 `/opsx:propose`。

**它不会：**

- 编写或修改代码。Explore 在任何路径中都不会编写代码，包括记录探索结果时。
- 设计或编辑你的模式或模板。这类工作属于变更，而非思考。
- 自行启动变更或编写产物。除非你主动要求，或在它提出时表示同意，否则它不会写入任何内容；即使你同意，也只会写你确认的内容，以及启动变更所需的设置文件（见下文）。
- 迫使你记录探索结果。思路逐渐明确时，它会提出建议，但由你决定是否采纳。

这正是设计目的。探索不需要你承担成本，也不会让你作出承诺，除非你明确同意。你可以探索三个行不通的方向，从每个方向中学到一些东西，最后再提案实施留下来的方案。

## 它已经安装好了

好消息：`/opsx:explore` 已包含在默认的 **core** 配置档案中，与 `propose`、`apply`、`update`、`sync` 和 `archive` 并列。你无需启用任何功能。只要项目已设置 OpenSpec，就可以在 AI 聊天中使用 Explore。（和所有 `/opsx:*` 命令一样，要在助手聊天中输入，而不是在终端中输入。参阅[命令的工作方式](/zh-CN/how-commands-work/)。）

## 完整示例

看看一个模糊的担忧如何变成明确且可实现的变更。

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

注意刚才发生的事。起初只是“有些地方不对劲，我不敢贸然修改”。短短二十秒的探索就得到了明确的根本原因、按优先级排列的三个方案、基于现有代码给出的建议，以及范围清楚的变更。接下来的提案之所以明确，是因为先进行了思考。

## 转交给 propose

Explore 不会将内容归档到任何地方。准备好后，只需开始一项变更，AI 就会把对话中的上下文带入产物。

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

你可以用日常语言表达（“把这个整理成一项变更吧”），也可以直接运行 `/opsx:propose <name>`。无论采用哪种方式，刚刚进行的探索都会成为提案的基础，而不是被丢弃的聊天记录。

你也可以不结束当前对话，直接让 Explore 记录变更：“为这个开始一项变更”会搭建文件夹，“再把提案也写出来”则会准确地创建你指定的产物。搭建框架时也会写入变更自身的元数据，并补齐项目顶层缺少的内容（`openspec/specs/`、`openspec/changes/archive/`、`config.yaml`）。

这与转交给 propose 的最终结果相同，区别在于：propose 会生成模式要求的、足以开始实现的整套产物，而记录探索结果时只会生成你指定的产物。

如果使用扩展命令集，Explore 也可以将工作交给 `/opsx:new`，以便逐步创建产物。参阅[工作流](/zh-CN/workflows/)。

## 有效探索的提示

- **带来问题，而不是预设的解决方案。** “登录感觉很慢”给 AI 留下了调查空间；“添加 Redis 缓存”则让你过早选定了未经验证的答案。
- **明确询问各种取舍。** “每种方案的缺点是什么？”能帮你获得更诚实的比较。
- **让 AI 先阅读。** 最好的探索始于 AI 实际检查代码，而不是凭空猜测。如果有帮助，可以指出相关区域。
- **放弃也没关系。** 如果探索发现这个想法不值得做，那也是一种收获，而且学费很低。
- **变更过程中也可以再次探索。** 在 `/opsx:apply` 期间遇到困难？可以退一步探索一个子问题，然后再继续。

## 坦诚看待取舍

**你会得到什么：** Explore 能在成本最低的时候发现方向错误，在你作出任何承诺之前及时纠正。它在不熟悉的代码中尤其有用，AI 阅读和总结系统的能力可以省去你花一下午摸索代码的时间。

**它需要什么：** 一点耐心。Explore 是对话，比直接运行 `/opsx:propose` 并寄希望于结果更慢。如果你已经真正理解这项工作，额外步骤就只是开销，完全可以跳过。

一个经验法则：任务越模糊，探索越有价值；任务越明确，就越可以直接开始提案。

## 接下来读什么

- [命令：`/opsx:explore`](/zh-CN/commands/)：精确的命令参考
- [工作流](/zh-CN/workflows/)：在日常循环中使用探索
- [示例与配方](/zh-CN/examples/)：完整流程中如何进行探索
- [快速入门](/zh-CN/getting-started/)：包含探索环节的首次变更指南
