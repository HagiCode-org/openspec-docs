---
title: "Unterstützte Tools"
---

OpenSpec funktioniert mit vielen KI-Codierassistenten. Wenn Sie `openspec init` ausführen, konfiguriert OpenSpec die ausgewählten Tools entsprechend Ihrem aktiven Profil, Ihrer Workflow-Auswahl und Ihrem Bereitstellungsmodus.

## So funktioniert es

Für jedes ausgewählte Tool kann OpenSpec Folgendes installieren:

1. **Skills** (wenn Skills im Bereitstellungsmodus enthalten sind): `.../skills/openspec-*/SKILL.md`
2. **Befehle** (wenn Befehle im Bereitstellungsmodus enthalten sind): tool-spezifische `opsx-*`-Befehlsdateien

Codex verwendet ausschließlich Skills: OpenSpec installiert für Codex `.agents/skills/openspec-*/SKILL.md`, selbst wenn der Bereitstellungsmodus auf `commands` gesetzt ist, und generiert keine benutzerdefinierten Codex-Prompt-Dateien. Vorhandene, von OpenSpec verwaltete Skills unter dem älteren Pfad `.codex/skills` werden nach dem Schreiben ihrer Ersatzdateien abgeglichen. Benutzerdefinierte und abweichende Dateien bleiben erhalten.

Standardmäßig verwendet OpenSpec das Profil `core`, das Folgendes umfasst:
- `propose`
- `explore`
- `apply`
- `update`
- `sync`
- `archive`

Sie können erweiterte Workflows (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) mit `openspec config profile` aktivieren und anschließend `openspec update` ausführen.

## Befehle aufrufen

In dieser Dokumentation wird `/opsx:propose` als kanonischer Name verwendet. Jedes Tool schreibt ihn jedoch so, wie es die von OpenSpec erstellte Datei lädt. Suchen Sie den Befehlspfad Ihres Tools unten in der [Referenz der Tool-Verzeichnisse](#referenz-der-tool-verzeichnisse) und wählen Sie hier die passende Schreibweise.

| Von OpenSpec geschriebene Befehlsdatei | Eingabe | Tools |
|------------------------------|----------|-------|
| `.../commands/opsx/<id>.*` — der Ordner `opsx/` bildet den Namensraum | `/opsx:<id>` | Claude Code, CodeBuddy, Crush, Gemini CLI, Lingma, Qoder, ZCode |
| `.../opsx-<id>.*` — der Dateiname ist der Befehl | `/opsx-<id>` | Alle anderen Tools mit generierten Befehlsdateien außer Amazon Q und Devin |
| `.devin/workflows/opsx-<id>.md` — wird nur von einem der beiden Devin-Agents gelesen | `/opsx-<id>` in Devin Desktop, `/openspec-<skill>` in Devin Local | Devin Desktop\*\*\*\* |
| `.amazonq/prompts/opsx-<id>.md` — ein Prompt, kein Befehl | `@opsx-<id>` | Amazon Q Developer |
| keine – nur Skills | `/openspec-<skill>` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, gemeinsames `.agents` |
| keine – Kimi Code | `/skill:openspec-<skill>` | Kimi Code |
| keine – Codex CLI | `$openspec-<skill>` | Codex ([`/openspec-<skill>` wird nicht erkannt](https://github.com/openai/codex/issues/11817)) |

Somit lautet `/opsx:propose` in Cursor `/opsx-propose`, in Amazon Q `@opsx-propose` und
`$openspec-propose` in Codex.

Zwei Aspekte variieren unabhängig voneinander, weshalb sich die Zeilen nicht zusammenfassen lassen:

- **Der Name.** Die Zeilen 1–2 unterscheiden sich nur darin, wie der Befehl in der Datei benannt ist. Der Stamm
  `opsx-<id>` / `opsx:<id>` ist bei allen Tools mit generierten
  Befehlsdateien gleich.
- **Die Aufrufart.** Amazon Q lädt seine Dateien in eine Prompt-Bibliothek, die mit
  `@` aufgerufen wird. Tools, die nur Skills verwenden, generieren keine Befehlsdateien. Deshalb verwenden die letzten drei
  Zeilen *Skill*-Namen – aufgeführt unter
  [Generierte Skill-Namen](#generierte-skill-namen) –, die nicht eins zu eins
  den Befehls-IDs entsprechen (`/opsx:apply` ist der Skill `openspec-apply-change`).

Die obigen Muster für Befehlspfade sind absichtlich erweiterungsneutral (`.*`): Die
Dateierweiterung richtet sich nach dem jeweiligen Tool (`.toml` für Gemini CLI, `.prompt` für Continue,
`.prompt.md` für Kiro und GitHub Copilot). Einige Tools zeigen den Namen einschließlich
Erweiterung im Auswahlmenü. Achten Sie auf die Verzeichnisstruktur, nicht auf die Erweiterung.

Die von OpenSpec generierten Dateien und der nach der Einrichtung ausgegebene Hinweis „Erste Schritte“
verwenden bereits die richtige Form für die ausgewählten Tools. Am schnellsten finden Sie die Antwort daher,
indem Sie den Hinweis lesen.

## Referenz der Tool-Verzeichnisse

| Tool (ID) | Muster für Skill-Pfade | Muster für Befehlspfade |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/openspec-*/SKILL.md` | `.amazonq/prompts/opsx-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/openspec-*/SKILL.md` | `.agent/workflows/opsx-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/openspec-*/SKILL.md` | `.augment/commands/opsx-<id>.md` |
| IBM Bob Shell (`bob`) | `.bob/skills/openspec-*/SKILL.md` | `.bob/commands/opsx-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/openspec-*/SKILL.md` | `.claude/commands/opsx/<id>.md` |
| Cline (`cline`) | `.cline/skills/openspec-*/SKILL.md` | `.clinerules/workflows/opsx-<id>.md` |
| Command Code (`command-code`) | `.commandcode/skills/openspec-*/SKILL.md` | `.commandcode/commands/opsx-<id>.md` |
| CodeArts (`codeartsagent`) | `.codeartsdoer/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/openspec-*`) |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/openspec-*/SKILL.md` | `.codebuddy/commands/opsx/<id>.md` |
| Codex (`codex`) | `.agents/skills/openspec-*/SKILL.md` | Nicht generiert (nur Skills; verwenden Sie `$openspec-*`) |
| Devin Desktop, zuvor Windsurf (`devin`) | `.devin/skills/openspec-*/SKILL.md` | `.devin/workflows/opsx-<id>.md`\*\*\*\* |
| ForgeCode (`forgecode`) | `.forge/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/openspec-*`) |
| Continue (`continue`) | `.continue/skills/openspec-*/SKILL.md` | `.continue/prompts/opsx-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/openspec-*/SKILL.md` | `.cospec/openspec/commands/opsx-<id>.md` |
| Crush (`crush`) | `.crush/skills/openspec-*/SKILL.md` | `.crush/commands/opsx/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/openspec-*/SKILL.md` | `.cursor/commands/opsx-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/openspec-*/SKILL.md` | `.factory/commands/opsx-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/openspec-*/SKILL.md` | `.gemini/commands/opsx/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/openspec-*/SKILL.md` | `.github/prompts/opsx-<id>.prompt.md`\*\* |
| Hermes Agent (`hermes`) | `.hermes/skills/openspec-*/SKILL.md`\*\*\* | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/openspec-*`) |
| iFlow (`iflow`) | `.iflow/skills/openspec-*/SKILL.md` | `.iflow/commands/opsx-<id>.md` |
| Junie (`junie`) | `.junie/skills/openspec-*/SKILL.md` | `.junie/commands/opsx-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/openspec-*/SKILL.md` | `.kilo/command/opsx-<id>.md` |
| Kimi Code (`kimi`) | `.kimi-code/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/skill:openspec-*`) |
| Kiro (`kiro`) | `.kiro/skills/openspec-*/SKILL.md` | `.kiro/prompts/opsx-<id>.prompt.md` |
| Lingma (`lingma`) | `.lingma/skills/openspec-*/SKILL.md` | `.lingma/commands/opsx/<id>.md` |
| MiniMax Code (`minimax-code`) | `~/.minimax/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie MiniMax-Code-Skills) |
| Mistral Vibe (`vibe`) | `.vibe/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/openspec-*`) |
| Oh My Pi (`oh-my-pi`) | `.omp/skills/openspec-*/SKILL.md` | `.omp/commands/opsx-<id>.md` |
| OpenCode (`opencode`) | `.opencode/skills/openspec-*/SKILL.md` | `.opencode/commands/opsx-<id>.md` |
| Pi (`pi`) | `.pi/skills/openspec-*/SKILL.md` | `.pi/prompts/opsx-<id>.md` |
| SourceCraft Code Assistant for VS Code (`codeassistant`) | `.codeassistant/skills/openspec-*/SKILL.md` | `.codeassistant/commands/opsx-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/openspec-*/SKILL.md` | `.qoder/commands/opsx/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/openspec-*/SKILL.md` | `.qwen/commands/opsx-<id>.md` |
| [Rovo Dev CLI](https://support.atlassian.com/rovo/docs/use-rovo-dev-cli/) (`rovodev`) | `.rovodev/skills/openspec-*/SKILL.md` | Nicht generiert. Rovo bietet keine Slash-Befehlsschnittstelle – Skills werden automatisch oder über eine Eingabe erkannt (z. B. „Verwende den Skill openspec-propose“); mit `/skills` werden sie nur verwaltet. Generierte Inhalte verweisen auf Skills anhand ihres Namens, niemals als `/openspec-*`-Befehle. |
| [Zoo Code](https://github.com/Zoo-Code-Org/Zoo-Code) (`roocode`) | `.roo/skills/openspec-*/SKILL.md` | `.roo/commands/opsx-<id>.md` |
| Trae (`trae`) | `.trae/skills/openspec-*/SKILL.md` | `.trae/commands/opsx-<id>.md` |
| [Zed Agent](https://zed.dev/docs/ai/skills) (`zed`) | `.agents/skills/openspec-*/SKILL.md` | Nicht generiert (nur Skills; verwenden Sie `/openspec-*` oder `@openspec-*`) |
| ZCode (`zcode`) | `.zcode/skills/openspec-*/SKILL.md` | `.zcode/commands/opsx/<id>.md` |
| Gemeinsame `.agents`-Skills (`agents`) | `.agents/skills/openspec-*/SKILL.md` | Nicht generiert (kein Befehlsadapter; verwenden Sie Skill-Aufrufe wie `/openspec-*`) |

\*\* GitHub-Copilot-Prompt-Dateien werden von IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) als benutzerdefinierte Slash-Befehle erkannt. Copilot CLI verarbeitet `.github/prompts/*.prompt.md` derzeit nicht direkt. Wenn Sie `github-copilot` auswählen, kann außerdem der von GitHub gehostete **Cloud-Codieragent** eingerichtet werden. Siehe weiter unten [GitHub Copilot Cloud-Codieragent](#github-copilot-cloud-codieragent).

\*\*\* Hermes lädt Skills standardmäßig aus `~/.hermes/skills/`. Um lokale OpenSpec-Skills eines Projekts zu verwenden, fügen Sie das Projektverzeichnis `.hermes/skills/` in `~/.hermes/config.yaml` zu `skills.external_dirs` hinzu. Hermes stellt die Skills dann mit benutzerseitigen Slash-Aufrufen wie `/openspec-propose` bereit.

\*\*\*\* Windsurf wurde am 2. Juni 2026 in [Devin Desktop umbenannt](https://docs.devin.ai/desktop/devin-desktop-faq), und das Konfigurationsverzeichnis wurde geändert: `.devin/` ist nun der bevorzugte Lese- und Schreibpfad, `.windsurf/` ein schreibgeschützter Fallback für ältere Installationen. OpenSpec übernimmt die Umbenennung: Die Tool-ID lautet `devin`, und `--tools windsurf` wird weiterhin darauf abgebildet, sodass vorhandene Einrichtungsskripte funktionieren. Wenn ein Projekt noch OpenSpec-Dateien in `.windsurf/` enthält, wird beim nächsten `openspec update` angeboten, sie zu verschieben. Wenn Sie ablehnen, bleiben sie dort; selbst verfasste Dateien werden niemals angefasst. Workflows werden anhand des Dateinamens aufgerufen. `.devin/workflows/opsx-apply.md` entspricht daher `/opsx-apply`. Der [Devin-Local-Agent unterstützt keine Workflows](https://docs.devin.ai/desktop/devin-local), sondern nur Skills und liest `.windsurf/` überhaupt nicht. Wenn OpenSpec Devin-Skills schreibt, verwendet es daher in deren Text und im Hinweis „Erste Schritte“ die Skill-Aufrufe `/openspec-*`, die mit beiden Agents funktionieren. Bei einer reinen Befehlsbereitstellung werden keine Skills geschrieben; in beiden Fällen gilt dann `/opsx-*`.

Die Unterstützung für SourceCraft Code Assistant richtet sich an dessen VS-Code-Erweiterung. Die [benutzerdefinierten Befehle](https://sourcecraft.dev/portal/docs/en/code-assistant/operations/agent/slash-commands) und [Skills](https://sourcecraft.dev/portal/docs/ru/code-assistant/operations/agent/skills) stehen nur in VS Code zur Verfügung. Diese Integration konfiguriert weder SourceCraft Web noch JetBrains.

Bei einer reinen Skill-Bereitstellung bitten Sie Code Assistant, mit Ihrer Idee den Skill `openspec-propose` zu verwenden. Skills werden anhand der Anfrage aktiviert; OpenSpec generiert für dieses Tool keine `/openspec-*`-Befehle.

MiniMax Code ist eine globale Integration, die ausschließlich Skills verwendet. OpenSpec schreibt nur die
`openspec-*` directories under `~/.minimax/skills/`; it does not create
Verzeichnisse unter `~/.minimax/skills/`. Lokale `.minimax`- oder `.mavis`-Verzeichnisse im Repository werden nicht erstellt. Bei einer reinen Befehlsbereitstellung bleiben vorhandene globale MiniMax-Code-Skills unangetastet, damit die Bereitstellungseinstellung eines Projekts keine Skills entfernt, die ein anderes Projekt verwendet.

### GitHub Copilot Cloud-Codieragent

Der [Copilot-Codieragent](https://docs.github.com/en/copilot/using-github-copilot/coding-agent) von GitHub wird auf GitHub in einer GitHub-Actions-Umgebung ausgeführt – getrennt von Copilot in Ihrem Editor. OpenSpec kann ihn so einrichten, dass er die OpenSpec-CLI verwendet. Dazu werden zwei Dateien generiert:

- `.github/workflows/copilot-setup-steps.yml` – installiert `@fission-ai/openspec` in der Umgebung des Agents
- `.github/agents/openspec.agent.md` – weist den Agent an, wie OpenSpec zu verwenden ist

Da damit ein GitHub-Actions-Workflow in Ihr Repository geschrieben wird, ist die Einrichtung **optional**:

| Vorgehen | Verhalten |
|-----|----------|
| `openspec init` (interaktiv) | Fragt, ob Cloud-Dateien eingerichtet werden sollen. Standard ist **Nein**. |
| `openspec init --copilot-cloud` | Richtet sie ohne Rückfrage ein (für Skripte/CI). |
| `openspec init --no-copilot-cloud` | Überspringt sie ohne Rückfrage und entfernt zuvor generierte Dateien. |
| `openspec update` | Fragt nie nach. Aktualisiert Dateien nur, wenn Sie zugestimmt haben (oder das Projekt sie bereits enthält). Wenn Sie abgelehnt haben, werden von OpenSpec verwaltete Cloud-Dateien entfernt. |

Ihre Auswahl wird als `githubCopilot.cloudAgent: true|false` in `openspec/config.yaml` gespeichert, sodass nicht-interaktive Aktualisierungen sie berücksichtigen. OpenSpec schreibt und entfernt ausschließlich Dateien, deren Inhalt es selbst generiert hat. Wenn Sie `copilot-setup-steps.yml` oder `openspec.agent.md` angepasst oder bereits eigene Dateien angelegt haben, bleiben diese unangetastet (und `init`/`update` weisen Sie darauf hin).

### Wann das gemeinsame Ziel `.agents` sinnvoll ist

`agents` ist die herstellerneutrale Option: Skills werden in `.agents/skills/` geschrieben, einem gemeinsamen Stammverzeichnis, das viele Agent-Tools auslesen, statt in ein Tool-spezifisches Verzeichnis.

| Situation | Auswahl |
|-----------|------|
| Ihr Tool hat oben eine eigene Zeile | Seine eigene ID – Sie erhalten die Integration des Tools einschließlich Slash-Befehlen, sofern sie unterstützt werden. |
| Mehrere Agents in einem Repository lesen alle `.agents/skills` | `agents` – ein gemeinsamer Skill-Baum statt eines pro Tool. |
| Ihr Tool ist noch nicht aufgeführt, liest aber `.agents/skills` | `agents` |

Sie können diese Option zusammen mit einer Tool-spezifischen ID auswählen; normalerweise schreibt jedes Tool in sein eigenes Stammverzeichnis. Ausnahmen sind Codex und Zed Agent, die dasselbe kanonische `.agents`-Verzeichnis verwenden. Wenn Codex zusammen mit Zed oder `agents` ausgewählt wird, behält OpenSpec einen von Codex verwalteten Baum bei. In den Übergaben werden sowohl `$openspec-*` für Codex als auch `/openspec-*` für andere Agents genannt. So funktionieren `--tools all` und vorhandene Setups mit mehreren Agents weiter, ohne dass zwei Schreiber dieselben Dateien überschreiben.
OpenSpec bietet dieses Ziel außerdem automatisch an, sobald ein Projekt über ein Verzeichnis `.agents/skills/` verfügt. Ein bloßes `.agents/` reicht nicht, da Tools dieses Verzeichnis auch für Regeln und Subagent-Definitionen verwenden. Beachten Sie, dass `.agents` nicht dasselbe wie `.agent` ist: Das Verzeichnis im Singular gehört zu Antigravity.

Zwei Hinweise:

- **Nur Skills.** Es gibt keinen Befehlsadapter, daher werden keine `opsx-*`-Befehlsdateien
  geschrieben. Bei einer Bereitstellung, die Befehle einschließt, führt `openspec init` `agents`
  unter den Tools auf, für die gemeldet wird: `Commands skipped for: … (no adapter)`.
  Rufen Sie Workflows über den Skill-Namen auf:
  Die meisten Assistenten, die `.agents/skills` lesen, verwenden `/openspec-propose` – die Form, die der Einrichtungshinweis von OpenSpec ausgibt. Das Ziel ist herstellerneutral. Falls Ihr Assistent eine andere Form verwendet, sehen Sie in dessen Dokumentation nach.
- **Es wird keine `AGENTS.md` erstellt oder bearbeitet.** Ziel ist das Verzeichnis `.agents/`.
  Falls Ihre `AGENTS.md` im Stammverzeichnis noch OpenSpec-Markierungsblöcke einer älteren Version enthält, entfernt `openspec update` sie. Siehe den [Migrationsleitfaden](/de-DE/migration-guide/).

Die Zed-Unterstützung hier gilt für den integrierten Zed Agent. Zed External Agents und Terminal
Threads verwenden eigene Integrationen. Agent Skills erfordern
[Zed v1.4.2](https://github.com/zed-industries/zed/releases/tag/v1.4.2) or newer.
oder höher. In einem nicht vertrauenswürdigen Worktree stehen projektlokale Skills erst zur Verfügung, nachdem Sie
[Vertrauen gewährt haben](https://zed.dev/docs/worktree-trust).

Da `.agents/skills/` von Codex, Zed Agent und dem herstellerneutralen Ziel gemeinsam verwendet wird,
sollten Sie wissen, welche Inhalte OpenSpec dort verwaltet:
Es schreibt, aktualisiert und entfernt nur die `openspec-*`-Skill-Verzeichnisse der ausgewählten
Workflows sowie eine Markierung `.openspec-target`, die festhält, ob Codex,
Zed Agent oder das herstellerneutrale Ziel den gemeinsamen Baum erstellt hat. Alles andere in diesem
Verzeichnis bleibt unangetastet. Betrachten Sie die Namen `openspec-*` und die Markierung als Eigentum von OpenSpec:
Änderungen darin werden beim nächsten `openspec update` überschrieben, wie bei
allen anderen Tools auch.

Bei Projekten ohne Markierung leitet OpenSpec die Zuständigkeit aus verwalteten Skill-Verweisen ab:
`$openspec-*` steht für Codex, `/openspec-*` für das herstellerneutrale Ziel. Ein
allgemeiner kanonischer Baum neben älteren `.codex/skills`-Dateien gilt als frühere
Installation mit zwei Zielen und wird im kompatiblen gemeinsamen Baum zusammengeführt.

`openspec update` berücksichtigt diese Zuständigkeit ebenfalls. Wenn ein Projekt `.agents` dem
herstellerneutralen Ziel zuordnet und eine veraltete Codex-Installation nur anhand einzelner
Prompt-Dateien erkannt wird, lässt die Aktualisierung den vorhandenen `agents`-Baum unverändert, statt
ihn mit Codex-Syntax neu zu schreiben. Auch die alten Prompt-Dateien werden beibehalten,
statt gelöscht zu werden. Um den gemeinsamen Baum ausdrücklich Codex zuzuweisen, führen Sie
`openspec init --tools codex` aus.

## Nicht-interaktive Einrichtung

Verwenden Sie für CI/CD oder skriptgesteuerte Einrichtungen `--tools` (und optional `--profile`):

```bash
# Configure specific tools
openspec init --tools claude,cursor

# Configure all supported tools
openspec init --tools all

# Skip tool configuration
openspec init --tools none

# Override profile for this init run
openspec init --profile core
```

**Verfügbare Tool-IDs (`--tools`)** – `windsurf` wird ebenfalls als Alias für `devin` akzeptiert: `amazon-q`, `antigravity`, `auggie`, `bob`, `claude`, `cline`, `command-code`, `codeartsagent`, `codex`, `devin`, `forgecode`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `hermes`, `iflow`, `junie`, `kilocode`, `kimi`, `kiro`, `lingma`, `minimax-code`, `vibe`, `oh-my-pi`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `codeassistant`, `trae`, `zed`, `zcode`, `agents`

## Workflowabhängige Installation

OpenSpec installiert Workflow-Artefakte entsprechend den ausgewählten Workflows:

- **Core-Profil (Standard):** `propose`, `explore`, `apply`, `update`, `sync`, `archive`
- **Benutzerdefinierte Auswahl:** eine beliebige Teilmenge aller Workflow-IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `update`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

Mit anderen Worten: Die Anzahl der Skills und Befehle hängt vom Profil und vom Bereitstellungsmodus ab und ist nicht fest vorgegeben.

## Generierte Skill-Namen

Wenn sie im Profil oder in der Workflow-Konfiguration ausgewählt sind, generiert OpenSpec die folgenden Skills:

- `openspec-propose`
- `openspec-explore`
- `openspec-new-change`
- `openspec-continue-change`
- `openspec-apply-change`
- `openspec-update-change`
- `openspec-ff-change`
- `openspec-sync-specs`
- `openspec-archive-change`
- `openspec-bulk-archive-change`
- `openspec-verify-change`
- `openspec-onboard`

Informationen zum Verhalten der Befehle finden Sie unter [Befehle](/de-DE/commands/) und zu den Optionen von `init`/`update` unter [CLI](/de-DE/cli/).

## Weiterführende Dokumentation

- [CLI-Referenz](/de-DE/cli/) – Terminalbefehle
- [Befehle](/de-DE/commands/) – Slash-Befehle und Skills
- [Erste Schritte](/de-DE/getting-started/) – Ersteinrichtung
