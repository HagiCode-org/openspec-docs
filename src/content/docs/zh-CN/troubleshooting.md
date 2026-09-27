---
title: "故障排除"
---

针对具体问题的解决方法。每一项都会描述问题表现、简要说明可能原因，并给出解决方式。如果这里没有列出你的问题，[常见问题](/zh-CN/faq/)或许能帮上忙，[Discord](https://discord.gg/YctCnvvshC)也一定可以。

## 安装与设置

### `openspec: command not found`

CLI 尚未安装，或者 shell 找不到它。请全局安装并检查：

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

如果安装成功但仍然找不到命令，很可能是全局 npm bin 目录未加入 `PATH`。运行 `npm prefix -g` 查看全局软件包所在位置：在 macOS 和 Linux 上，可执行文件位于该目录的 `bin/` 中；在 Windows 上则直接位于该目录中。请确保对应路径已加入 `PATH`。（npm 9 已移除 `npm bin -g`。）

如果你使用[由 AI 助手协助安装](/zh-CN/installation/)，此时正是预期的交接点：提示词会要求助手告知你如何修改 `PATH`，而不是自行编辑 shell 启动文件。

### “Requires Node.js 20.19.0 or higher”

OpenSpec 需要 Node 20.19.0 或更高版本。检查版本，必要时升级：

```bash
node --version
```

如果你用 bun 安装 OpenSpec，请注意 OpenSpec 仍然*运行*在 Node 上，因此无论如何都需要在 `PATH` 中提供 Node 20.19.0 或更高版本。参阅[安装指南](/zh-CN/installation/)。

### `openspec init` 没有配置我的 AI 工具

Init 会询问要设置哪些工具。如果你跳过了某个工具，或想添加其他工具，可以重新运行该命令，也可以使用非交互形式：

```bash
openspec init --tools claude,cursor
```

完整工具 ID 列表见[支持的工具](/zh-CN/supported-tools/)。使用 `--tools all` 设置全部工具；使用 `--tools none` 跳过工具设置。

## 命令没有显示

如果 `/opsx:propose`（或你的工具使用的对应命令）没有出现或没有反应，请按以下列表逐项检查。项目按最快可检查的顺序排列。

1. **你可能在错误的位置输入了命令。** 斜杠命令应在 AI 助手聊天中输入，而不是终端。如果你在 shell 中输入了 `/opsx:propose`，这就是问题所在。参阅[命令的工作方式](/zh-CN/how-commands-work/)。

2. **重新生成文件。** 在项目根目录运行：

   ```bash
   openspec update
   ```

   这会为你配置的所有工具重新写入技能和命令文件。

   指令文件来自*已安装的* CLI，因此旧版 CLI 可能会报告一切都是最新的，却从未写入较新的工作流。现在 `openspec update` 会检查这种情况并提供升级选项；如果出现提示，请接受升级。

3. **重新启动助手。** 大多数工具会在启动时扫描技能和命令。重新打开一个窗口通常就能解决问题。

4. **确认文件存在。** 对于 Claude Code，检查 `.claude/skills/` 中是否有 `openspec-*` 文件夹。其他工具使用各自的目录，完整列表见[支持的工具](/zh-CN/supported-tools/)。

5. **确认已初始化当前项目。** 技能是按项目写入的。如果你克隆了仓库或切换了文件夹，请在对应目录中运行 `openspec init`（或 `openspec update`）。

6. **确认你的工具支持命令文件。** Codex、CodeArts、ForgeCode、Hermes、Kimi Code、Mistral Vibe、Zed Agent 和共享的 `.agents` 目标不会生成 `opsx-*` 命令文件，而是通过技能调用，因此 `/opsx` 永远不会在这些工具中自动补全。在 Codex 中输入 `$openspec-propose`，在 Kimi Code 中输入 `/skill:openspec-propose`，其他工具则输入 `/openspec-propose`。共享的 `.agents` 目标不绑定厂商，因此 `/openspec-propose` 是通用形式，但不能保证所有助手都支持——如果助手没有响应，请查看它自己的技能调用说明。Amazon Q 会生成命令文件，但会将其加载到提示词库，而不是斜杠菜单；应输入 `@opsx-propose`，而非 `/opsx`。每种工具的调用形式都列在[如何调用](/zh-CN/supported-tools/)中。

## 使用变更

### “Change not found”

命令无法判断你指的是哪项变更。请明确指定名称，或检查当前有哪些变更：

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

同时确认你位于正确的项目目录。

### “No artifacts ready”

每项产物要么已经创建，要么因依赖项尚未完成而受阻。查看阻塞原因：

```bash
openspec status --change <name>
```

然后先创建缺少的依赖项。请记住顺序：提案使规格说明和设计可以开始；规格说明和设计共同使任务可以开始。

### `openspec validate` 报告警告或错误

验证会检查规格说明和变更是否存在结构问题。请阅读提示，其中会指出文件和问题所在。

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

常见原因包括缺少必需章节（例如规格说明没有场景）或差异标题格式错误。修正文件后重新运行。输出格式见 [CLI 参考](/zh-CN/cli/)。

有一条提示值得单独说明：

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

`MODIFIED` 需求会替换整个需求块，因此必须保留变更后仍然有效的所有场景，而不只是你修改的场景。请从 `openspec/specs/<capability-path>/spec.md` 复制指定场景回差异文件，并保留路径中的领域目录。如果其他人的变更新增了同一需求的场景，这种提示常会出现在较早的变更中——无论如何，归档都会拒绝该变更；现在验证阶段会在你开始实现前就说明这一点。

### AI 创建的产物不完整或有误

AI 获得的上下文不足。以下方法可能有所帮助：

- 在 `openspec/config.yaml` 中添加项目上下文，使技术栈和约定注入每项请求。参阅[自定义](/zh-CN/customization/)。
- 为特定产物添加 `rules:`，例如只针对规格说明的指引。
- 提案时提供更详细的描述。
- 使用扩展命令 `/opsx:continue` 一次创建一个产物并逐一审查，而不是使用 `/opsx:ff` 一次性全部创建。

### 归档无法完成，或提示任务未完成

归档不会因为任务未完成而*阻止*操作，但会发出警告，因为归档通常意味着工作已经完成。如果任务确实可以暂缓（例如你要归档部分变更），可以继续；否则应先完成任务。如果差异规格说明尚未同步到主规格说明，归档也会主动询问是否同步；除非你有特殊理由，否则请同意。

### “User force closed the prompt with 0 null”

当某处在无法回答交互问题的环境中运行 `openspec archive` 时，就会出现此问题——例如由工具调用命令的 AI 智能体、CI 作业，或 stdin 已关闭的 shell。归档最多会询问三次确认；以前无法回答的问题会以这条原始消息失败。

传入 `--yes` 即可预先确认：

```bash
openspec archive <change-name> --yes
```

保留之前使用的其他标志——`--skip-specs` 和 `--no-validate` 会改变归档行为，因此只使用 `--yes` 重试并不是相同命令。当前版本会指出需要添加的标志，并打印一行可直接粘贴的 `Fix:`。如果需要从列表中选择，请明确传入变更名称：选择器同样需要回答。

如果你将归档输出重定向到文件，或由工具捕获，并且*确实*通过管道传入了应答（`printf 'y\n' | openspec archive …`），旧版本会在显示提示时把终端转义码写入捕获内容；某些环境中，这些字符会让文件异常膨胀。当前版本在 stdout 不是终端时会以纯文本读取确认提示；如果不提供参数运行 `openspec archive`（本来会显示交互式变更选择器），它会要求你先提供变更名称，而不是把菜单渲染到捕获内容中。无论哪种情况，重定向和智能体调用都能保持清晰；提供变更名称并加上 `--yes` 则可完全跳过提示。

## 配置

### `config.yaml` 没有生效

通常有三个原因：

1. **文件名错误。** 文件必须是 `openspec/config.yaml`，而不是 `.yml`。
2. **YAML 无效。** 使用任意 YAML 验证器检查；CLI 也会报告语法错误及其行号。
3. **以为需要重启。** 无需重启。配置更改立即生效。

### “Unknown artifact ID in rules: X”

`rules:` 下的键与模式中的任何产物都不匹配。对于默认的 `spec-driven` 模式，有效 ID 是 `proposal`、`specs`、`design` 和 `tasks`。查看任何模式的 ID：

```bash
openspec schemas --json
```

### “Context too large”

`context:` 字段限制为 50KB，因为它会注入每个请求。请对内容进行概括，或链接到较长的文档，而不是直接粘贴全部内容。精简的上下文通常也能带来更快、更好的结果。

### “Schema not found”

引用的模式名称不存在。列出可用模式并检查拼写：

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

参阅[自定义](/zh-CN/customization/)。

## 从旧版工作流迁移

### “Legacy files detected in non-interactive mode”

你位于 CI 或非交互式 shell 中，OpenSpec 发现了需要清理的旧文件，但无法询问你是否批准。使用以下命令自动确认：

```bash
openspec init --force
```

对于 Codex，OpenSpec 可能会在 `$CODEX_HOME/prompts` 或 `~/.codex/prompts` 中检测到旧的托管提示词文件。清理范围仅限 OpenSpec 允许列表中的旧版 Codex 提示词文件名；非交互式 `openspec init` 只会移除已有替代文件 `.agents/skills/openspec-*` 的提示词。除非传入 `--force`，否则非交互式 `openspec update` 不会进行任何旧文件清理。

### 迁移后没有出现命令

重新启动 IDE。技能会在启动时检测。如果仍未出现，请运行 `openspec update`，并根据[支持的工具](/zh-CN/supported-tools/)检查文件位置。

### 旧的 `project.md` 没有迁移

这是有意设计的。OpenSpec 不会自动删除 `project.md`，因为其中可能有你编写的重要上下文。将有用部分移到 `config.yaml` 的 `context:` 字段中，然后自行删除 `project.md`。有关迁移步骤（包括可以交给 AI 助手的提炼提示词），请参阅[迁移指南](/zh-CN/migration-guide/)。

## 仍然无法解决？

- **Discord：** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues：** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **在终端中：** 运行 `openspec feedback "what went wrong"` 为你打开一个 issue。

报告问题时，请附上 OpenSpec 版本 (`openspec --version`)、Node 版本 (`node --version`)、所用 AI 工具，以及准确的命令和输出。提供这些信息可以大大加快排查速度。
