---
title: "在团队中使用 OpenSpec"
---

其他指南中的所有内容，无论你是独自工作还是身处二十人团队，流程都一样。团队协作带来的变化在于周边问题：规格说明放在哪里、团队成员如何审查计划，以及这一切如何融入现有的拉取请求流程？

简短回答：变更只是文件，而 OpenSpec 从不触碰 git。因此它能融入现有工作流，而不是取代它。本页说明哪些约定行之有效。

## 一条规则：OpenSpec 不碰 git

OpenSpec 会在 `openspec/` 下读取和写入纯 Markdown 文件。它绝不会在你的项目中提交、创建分支、推送或拉取，也不会自行克隆或同步[存储库](/zh-CN/stores-beta/user-guide/)。这意味着：

- **像提交其他源文件一样提交 `openspec/`。** 规格说明、活动中的变更和归档都属于项目历史。（没错，要提交整个文件夹——参见[常见问题](/zh-CN/faq/)。）
- **像管理代码一样对变更文件夹进行版本管理。** `openspec/changes/add-dark-mode/` 只是一个分支上的一组文件。
- **以下所有内容都是约定，而非强制。** OpenSpec 不会要求你必须这样做，只是这种方式配合起来很顺畅。

## 日常循环

一种行之有效的工作流，是将变更对应到一个分支和一个拉取请求：

```
git switch -c add-dark-mode        start a branch, as usual
   │
/opsx:propose add-dark-mode        draft the plan (proposal + specs + tasks)
   │
REVIEW THE PLAN                    you read it before any code — see Reviewing a Change
   │
/opsx:apply                        build it; artifacts + code change together
   │
git commit && open a PR            the PR contains the spec delta AND the code
   │
teammate reviews, merges
   │
/opsx:archive                      fold the delta into specs/, move the change to archive/
```

计划和代码并排保存在同一分支中，队友可以一并审查；六个月后，归档的规格说明仍能解释代码为何如此编写。

## 在拉取请求中审查规格说明

团队协作最能体现这种做法的价值。如果 PR 包含该变更的差异规格说明，审查者就能获得单看代码差异无法提供的信息：**在阅读任何代码之前，先用通俗语言说明这项变更应该实现什么。**

建议审查者按以下顺序阅读：

1. **阅读 `proposal.md`** —— 问题和范围是否合适？
2. **阅读 `specs/` 下的差异** —— “完成”的定义是否正确？（也就是[审查变更](/zh-CN/reviewing-changes/)中的两分钟检查，现在直接在 PR 中进行。）
3. **然后阅读代码差异** —— 它是否准确满足了这些要求？

如果审查者不同意*方案*，可以直接针对提案提出意见，成本很低，而不必在 300 行代码中反复争论。可以把差异规格说明放在 PR 描述靠前的位置，或指向变更文件夹，让审查者从那里开始。

## 何时归档

归档会将某个变更的差异合并到主 `openspec/specs/` 中，并将变更文件夹移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。由于 `specs/` 是**共享的唯一真实依据**，团队需要关注归档时机。以下两种约定都可行：

- **PR 合并后再归档（推荐）。** 分支携带活动中的变更；合并到主分支后，在主分支上归档（通常是一个很小的后续提交，或安排一次定期清理）。这样，共享的 `specs/` 只会随实际发布的工作更新。
- **在 PR 中归档。** 小团队采用这种方式更简单：同一个 PR 既加入代码，也同步并归档规格说明。代价是 `specs/` 和代码差异会一起出现，可能让 PR 显得更繁杂。

选定一种并保持一致。无论采用哪种方式，`/opsx:archive` 都会检查任务是否完成，并提示先同步，以免未完成的内容意外合并。

## 两个人并行处理变更

由于变更位于独立文件夹中，彼此不会冲突：

- **不同的人处理不同变更——没有问题。** `add-dark-mode` 和 `rate-limit-login` 位于不同分支的不同文件夹，直到两者都归档时才会相遇。
- **一个变更，一个负责人。** 两个人同时编辑同一个变更文件夹，就像同时编辑同一个文件一样会冲突。让一个变更由一位作者负责，或者将其拆分为两个变更（这也是[合理控制变更规模](/zh-CN/writing-specs/)的另一个理由）。
- **冲突只会出现在 `specs/`。** 如果两个变更都修改了*同一项*需求，第二个变更归档时会在 `openspec/specs/…/spec.md` 中冲突——像处理其他合并冲突一样解决即可，保留符合实际情况的需求。这种情况很少见，而且是件好事：git 正在提醒你，两个变更对系统行为的看法不一致。

## 规划超出单个仓库时

以上内容都假设计划位于代码仓库自己的 `openspec/` 文件夹中，这也是正确的默认选择。如果规划确实跨越多个仓库或团队（例如一项功能涉及三个服务，或某个团队拥有而其他团队依赖的需求），可以使用 beta 版 **stores** 功能：规划放在独立仓库中，任何代码仓库都可以引用它。请从[存储库用户指南](/zh-CN/stores-beta/user-guide/)开始了解。

## 接下来读什么

- [审查变更](/zh-CN/reviewing-changes/)——在 PR 中进行的审查流程。
- [编写良好的规格说明](/zh-CN/writing-specs/)——包括如何合理控制变更规模，使其适合一个分支。
- [存储库用户指南](/zh-CN/stores-beta/user-guide/)——了解跨仓库和团队的规划方式。
