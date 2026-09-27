---
title: "审查变更"
---

OpenSpec 的核心承诺是：**在编写任何代码之前，你和 AI 就要对构建内容达成一致。** 只有你确实阅读 AI 起草的内容，这份共识才有意义。本页介绍这两分钟的审查过程——该打开什么、按什么顺序阅读，以及要检查什么。

道理很简单：在一段提案中发现方向错误，几乎不费成本；在 300 行代码中发现同样的错误，就没那么容易了。审查就是让这份投入得到回报的环节。

## 需要审查的两个时机

一共只有两个：

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **`/opsx:propose`（或 `/opsx:ff`）之后，`/opsx:apply` 之前**——计划还只是文字时先阅读。
2. **构建之后，使用 `/opsx:verify`**——检查代码是否确实实现了计划中的内容。

第一次审查最能帮你避免损失，也是人们最容易跳过的一步。本页大部分内容都会介绍它。

## 按这个顺序阅读

一个变更就是 `openspec/changes/<name>/` 下的一组纯 Markdown 文件。按以下顺序阅读，可以在发现问题时尽早停止：

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

你无需逐字阅读所有内容。需要做的是每个文件回答一个问题，一共三个问题。

## 提案：问题选对了吗？

先打开 `proposal.md`。它用一两段话记录“为什么”与“做什么”——即意图、范围和方案。

**理想情况：** 意图清楚、范围符合预期，并且能说明为什么现在值得做。

**警示信号：**

- 它解决的其实是与你提出的*略有不同*的问题。
- 范围扩大了——你只要求主题切换开关，提案却“顺便”修改身份验证。
- 内容含糊。“改进设置页面”不是明确的范围；“添加一个遵循操作系统偏好的深色模式切换开关”才是。

**需要回答的问题：** *这是否符合我实际提出的要求？有没有混进其他内容？* 如果答案是否，就停在这里——先修正提案（参见[提出异议成本很低](/zh-CN/editing-changes/)）。

## 规格差异：“完成”的定义正确吗？

这是审查的核心。`specs/` 下的差异规格说明以需求及证明需求的场景，描述变更交付后哪些内容会成为*事实*：

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**优质需求应当是：** 一条清楚的 `SHALL`/`MUST` 陈述，可以交给测试人员验证；并且至少包含一个通过 GIVEN/WHEN/THEN 确实检验该陈述的场景。

**警示信号：**

- **需求含糊。** “系统 SHALL 运行得很快”无法实现，也无法测试。怎样才算快？
- **需求没有场景**，或者场景没有测试所属需求。
- **最有价值的检查：缺了什么。** AI 会如实写下你*说过的内容*，而你的任务是留意你*忘记说的内容*。如果你最关心操作系统偏好的情形，却没有任何场景提到它，那么审查就发挥了应有作用。

阅读差异时，问问自己：*如果系统只做这些事，而且没有其他行为，我会满意吗？* 此时还没有涉及代码，因此修改成本仍然很低。

## 任务：工作计划合理吗？

最后打开 `tasks.md`。它是 AI 将要执行的实现清单。

**理想情况：** 步骤有序，每项都能对应到某条需求，没有难以理解的内容。

**警示信号：**

- 某项任务没有对应需求（它从何而来？）。
- 只有一项笼统的“实现功能”任务，把所有实际决策都藏了起来。
- 某项任务会影响你刚刚批准的范围之外的内容。

你不是在这里估算工作量或事无巨细地管理，而是在检查计划是否符合你已经接受的需求。

## 提出异议成本很低

如果以上三个问题中任何一个的答案不理想，就说出来。这里没有阶段，也没有被锁定的内容——修正后继续即可。与[编辑变更](/zh-CN/editing-changes/)中所述相同，你有两种方式：

- **自己编辑文件。** 文件是纯 Markdown；修改范围描述、明确需求或删除任务即可。
- **告诉 AI 哪里不对，让它修改：** *“删掉身份验证修改——不在范围内”*、*“添加一个用户已经选过主题时的场景”*、*“把任务 3 拆成模式和界面两项。”*

然后重新阅读改过的部分。反复修改，直到计划值得你署名为止。这样的来回修改*就是产品正常工作的方式*。

## 代码完成后：验证

工作完成后，`/opsx:verify` 是第二次审查。它会重新阅读产物和代码，并从三个方面报告不匹配：

| 维度 | 检查内容 |
|-----------|----------------|
| **完整性** | 所有任务是否完成、所有需求是否实现、场景是否覆盖 |
| **正确性** | 实现是否符合规格说明的意图、是否处理边界情况 |
| **一致性** | 设计决策是否真正体现在代码中 |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

它会将问题标记为 CRITICAL、WARNING 或 SUGGESTION，但**不会**阻止归档——它只会指出差距，是否处理由你决定。这就是“AI 是否写了代码”与“AI 是否实现了双方约定的内容”之间的区别。

`/opsx:verify` 属于扩展配置档案。如果你没有此命令，可以用 `openspec config profile` 启用（然后运行 `openspec update`），也可以自行重新阅读变更和代码差异。

## 让审查与变更规模相称

并非每项变更都值得完整审查。单文件中的拼写错误，快速浏览二十秒即可；涉及身份验证、支付或不可恢复数据的变更，则值得逐项检查以上所有问题。重点从来不是走形式，而是把注意力花在犯错代价高的地方，对无关紧要的内容快速略过。

## 两分钟检查清单

- [ ] 提案中的意图符合我的要求。
- [ ] 范围没有悄悄扩大。
- [ ] 每条需求都足够具体，可以测试。
- [ ] 每条需求都有真正检验它的场景。
- [ ] 我最关心的情形已被覆盖。
- [ ] 任务都能对应到需求，没有莫名其妙或超出范围的内容。
- [ ] 如果 AI 完全按此计划实现、没有更多内容，我会放心。

七项全部通过，就可以放心运行 `/opsx:apply`。如果有任何一项未通过，那不是挫折——这正是这两分钟审查发挥作用的证明。

## 接下来读什么

- [编写良好的规格说明](/zh-CN/writing-specs/)——从另一面了解如何起草值得批准的需求和场景。
- [编辑和迭代变更](/zh-CN/editing-changes/)——开始实现后如何修改计划。
- [工作流](/zh-CN/workflows/)——审查在整个流程中的位置。
