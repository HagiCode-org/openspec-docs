---
title: "So funktionieren Befehle"
---

**Das Wichtigste: OpenSpec hat zwei Arten von Befehlen, die an zwei unterschiedlichen Orten ausgeführt werden.**

- `openspec ...`-Befehle werden in Ihrem **Terminal** ausgeführt. (Beispiel: `openspec init`.)
- `/opsx:...`-Befehle werden im **Chat Ihres KI-Assistenten** ausgeführt. (Beispiel: `/opsx:propose`.)

Falls Sie jemals `/opsx:propose` in Ihr Terminal eingeben und nichts passiert, erfahren Sie hier, woran das liegt. Sie verwenden die falsche Hälfte von OpenSpec. Slash-Befehle sind keine Terminalbefehle. Es sind Anweisungen an Ihren KI-Codierassistenten, die Sie in dasselbe Chatfeld eingeben, in dem Sie normalerweise „Füge ein Anmeldeformular hinzu“ schreiben würden.

Diese Unterscheidung ist das häufigste Hindernis für neue Benutzer. Machen wir sie also ganz klar.

## Die zwei Hälften

OpenSpec ist ein Projekt mit zwei Aufgabenbereichen.

**Die CLI (Terminalseite).** Ein Programm namens `openspec`, das Sie installieren und in Ihrer Shell ausführen. Es richtet Ihr Projekt ein, listet und validiert Änderungen, zeigt ein Dashboard an und archiviert abgeschlossene Arbeiten. Sie geben diese Befehle in iTerm, dem VS-Code-Terminal, PowerShell oder an jedem anderen Ort ein, an dem Sie `git` oder `npm` ausführen würden.

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**Die Slash-Befehle (Chatseite).** Kurze Befehle wie `/opsx:propose` und `/opsx:apply`, die Sie in Ihren KI-Assistenten eingeben. Sie weisen die KI an, dem OpenSpec-Workflow zu folgen: einen Vorschlag entwerfen, Spezifikationen verfassen, anhand der Aufgabenliste entwickeln und nach Abschluss archivieren. Sie geben diese Befehle in Claude Code, Cursor, Devin Desktop, Copilot oder den von Ihnen verwendeten Assistenten ein.

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

Das Denkmodell auf einen Blick:

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

Beachten Sie den Pfeil. Wenn Sie `openspec init` in Ihrem Terminal ausführen, werden dadurch die Slash-Befehle in Ihrem KI-Tool *installiert*. Die Terminalseite richtet die Chatseite ein. Danach findet die tägliche Arbeit überwiegend im Chat statt.

## „Wie starte ich den interaktiven Modus?“

**Es gibt keinen separaten interaktiven Modus, den Sie starten müssten.** Diese Frage kommt häufig auf und verdient eine klare Antwort.

Sie wechseln nicht in einen speziellen OpenSpec-Modus. Öffnen Sie Ihren KI-Codierassistenten wie gewohnt und geben Sie einen Slash-Befehl in den Chat ein. So „steigen Sie in OpenSpec ein“. Ihr Assistent erkennt den Befehl, lädt den passenden OpenSpec-Skill und folgt dem Workflow.

Die tatsächlichen Schritte lauten also:

1. Öffnen Sie Ihren KI-Codierassistenten (Claude Code, Cursor, Devin Desktop usw.) in Ihrem Projekt.
2. Geben Sie `/opsx:propose` in den Chat ein, an derselben Stelle wie jede andere Anfrage.
3. Achten Sie auf die automatische Vervollständigung: Wenn OpenSpec installiert ist, werden beim Eingeben des Schrägstrichs `/opsx:propose`, `/opsx:apply` und weitere Befehle angezeigt.

Das war's. Kein Modus zum Umschalten, kein Daemon zum Starten und kein separates Fenster.

Eine tatsächlich interaktive Funktion gibt es im Terminal: `openspec view`. Damit wird ein Dashboard geöffnet, in dem Sie Ihre Spezifikationen und Änderungen durchsuchen können. Es ist jedoch nur eine Ansicht und nicht das Werkzeug, mit dem Sie Vorschläge erstellen und Änderungen umsetzen. Die Umsetzung erfolgt über Slash-Befehle im Chat.

## Warum diese Trennung besteht

Diese Trennung ist wichtig, denn sie erklärt, warum OpenSpec mit mehr als 30 verschiedenen KI-Tools funktioniert.

Die CLI ist der **Motor**. Sie kennt die Regeln: wie ein Änderungsordner aufgebaut ist, welche Artefakte voneinander abhängen und wie ein Delta mit der maßgeblichen Quelle zusammengeführt wird. Sie funktioniert überall gleich.

Die Slash-Befehle sind das **Lenkrad**, und jedes KI-Tool hat ein etwas anderes. Claude Code nennt sie Befehle. Cursor und Devin Desktop verwenden eigene Formate. Einige Tools nennen sie Skills. Wenn Sie `openspec init` ausführen, erzeugt OpenSpec für jedes ausgewählte Tool den passenden Dateityp. Dadurch funktioniert dieselbe Absicht hinter `/opsx:propose`, unabhängig davon, welchen Assistenten Sie bevorzugen.

Die Stärke dieses Entwurfs: Sie lernen den Workflow einmal und können ihn toolübergreifend verwenden. Der Nachteil: Die genaue Syntax eines Befehls kann sich von Tool zu Tool leicht unterscheiden. Darum geht es im nächsten Abschnitt.

## Slash-Befehlssyntax nach Tool

Die Bedeutung ist überall identisch. Die Schreibweise richtet sich nach der Datei, die Ihr Tool lädt.

| Befehlsdatei Ihres Tools | Eingabeform | Beispieltools |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| keine – nur Skills | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, gemeinsames `.agents` |
| keine – Kimi Code | `/skill:openspec-propose` | Kimi Code |
| keine – Codex CLI | `$openspec-propose` | Codex |

Devin ist das einzige Tool, das in zwei Zeilen auftaucht. Devin Desktop liest
`.devin/workflows/`, daher funktioniert `/opsx-propose` dort. [Devin Local
unterstützt dies nicht](https://docs.devin.ai/desktop/devin-local); verwenden Sie bei diesem Agent stattdessen den
Skill `/openspec-propose`. Die Skills, die OpenSpec nach
`.devin/skills/` schreibt, funktionieren mit beiden Agents. Deshalb verweisen sie jeweils aufeinander anhand des Skill-Namens.

Jedes Tool ist unter [Aufruf](/de-DE/supported-tools/#befehle-aufrufen) aufgeführt – diese
Tabelle ist maßgeblich. Zwei der Zeilen beziehen sich gar nicht auf Slash-Befehle: Amazon Q
lädt seine Dateien in eine Prompt-Bibliothek, die mit `@` aufgerufen wird, und die letzten drei Zeilen
verwenden den *Skill*-Namen, der nicht mit der Befehls-ID übereinstimmt (`/opsx:apply` ist der
Skill `openspec-apply-change`).

Lesen Sie im Zweifel die Zeile „Erste Schritte“, die `openspec init` ausgegeben hat: Sie
verwendet bereits die von Ihren Tools registrierte Form. Sie können auch einen Schrägstrich eingeben und die automatische Vervollständigung beobachten,
sofern Ihr Tool Slash-Befehle überhaupt unterstützt.

## Wie Befehle bereitgestellt werden: Skills und Befehle

Wenn Sie `openspec init` (oder `openspec update`) ausführen, schreibt OpenSpec kleine Dateien in Ihr Projekt, damit Ihr KI-Tool den Workflow findet. Je nach Tool und Einstellungen sind dies **Skills**, **Befehle** oder beides.

- **Skills** liegen an Orten wie `.claude/skills/openspec-*/SKILL.md`. Sie sind der aufkommende toolübergreifende Standard: ein Ordner mit Anweisungen, den Ihr Assistent automatisch erkennt.
- **Befehle** liegen an Orten wie `.cursor/commands/opsx-<id>.md` oder `.claude/commands/opsx/<id>.md`. Das Layout richtet sich nach dem jeweiligen Tool und bestimmt die Eingabeform des Befehls. Dies sind die älteren, tool-spezifischen Slash-Befehlsdateien. Für Codex werden keine Befehlsdateien generiert; verwenden Sie `.agents/skills/openspec-*`.

Sie müssen nicht wissen, welches Format Ihr Tool verwendet. Geben Sie einfach den Slash-Befehl ein, und er funktioniert. Wenn etwas schiefgeht, hilft es aber, diese Dateien zu kennen: Verschwinden Ihre Befehle, fehlen die Dateien meist oder sind veraltet. Mit `openspec update` werden sie neu generiert.

Die genauen Pfade für jedes Tool finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/). Wie Skills den älteren, ausschließlich befehlsbasierten Ansatz abgelöst haben, erfahren Sie im [Migrationsleitfaden](/de-DE/migration-guide/).

## Installation überprüfen

Schnelle Prüfungen, beginnend mit der schnellsten:

1. **Geben Sie im KI-Chat einen Schrägstrich ein.** Beginnen Sie mit `/opsx` und achten Sie auf Vorschläge zur automatischen Vervollständigung. Werden sie angezeigt, ist alles eingerichtet. Bei einem Tool, das ausschließlich Skills verwendet (Codex, Kimi Code, CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent oder das gemeinsame Ziel `.agents`), wird `/opsx` auch bei einer korrekten Installation nie vervollständigt. Verwenden Sie stattdessen den Skill-Namen aus der Tabelle oben.
2. **Suchen Sie nach den Dateien.** Prüfen Sie bei Claude Code, ob `.claude/skills/` Ordner `openspec-*` enthält. Andere Tools verwenden eigene Verzeichnisse (aufgeführt unter [Unterstützte Tools](/de-DE/supported-tools/)).
3. **Führen Sie die Einrichtung erneut aus.** Führen Sie im Stammverzeichnis Ihres Projekts `openspec update` aus. Dadurch werden die Skill- und Befehlsdateien für alle konfigurierten Tools neu generiert.
4. **Starten Sie Ihren Assistenten neu.** Viele Tools suchen beim Start nach Skills und Befehlen. Ein neues Fenster kann die fehlende Voraussetzung sein.

## Welche Befehle stehen mir überhaupt zur Verfügung?

Standardmäßig installiert OpenSpec den **core**-Satz der Slash-Befehle:

- `/opsx:explore`: Denken Sie gemeinsam mit der KI über eine Idee nach, bevor Sie sich auf eine Änderung festlegen (ein idealer erster Schritt, wenn Sie unsicher sind).
- `/opsx:propose`: Erstellen Sie eine Änderung und entwerfen Sie alle zugehörigen Planungsartefakte in einem Schritt.
- `/opsx:apply`: Setzen Sie die Änderung um, indem Sie die Aufgabenliste abarbeiten.
- `/opsx:update`: Überarbeiten Sie die Planungsartefakte einer Änderung und halten Sie sie konsistent.
- `/opsx:sync`: Führen Sie die Spezifikationsänderungen einer Änderung mit Ihren Hauptspezifikationen zusammen (meist automatisch).
- `/opsx:archive`: Schließen Sie eine Änderung ab und legen Sie sie im Archiv ab.

Ein guter Standardablauf: `explore`, wenn Sie herausfinden, was zu tun ist, gefolgt von `propose`, `apply` und `archive`. Der Leitfaden [Zuerst erkunden](/de-DE/explore/) erklärt, warum sich dieser erste Schritt lohnt.

Für alle, die eine feinere Steuerung möchten, gibt es außerdem den **erweiterten** Satz (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Aktivieren Sie ihn mit `openspec config profile` und wenden Sie ihn anschließend mit `openspec update` an.

Ist das alles neu für Sie? `/opsx:onboard` (im erweiterten Satz) führt Sie mit Erklärungen durch eine vollständige Änderung in Ihrer eigenen Codebasis. So gelingt der Einstieg besonders einfach.

Was die einzelnen Befehle genau tun, erfahren Sie unter [Befehle](/de-DE/commands/). Wann Sie welchen Befehl verwenden, lesen Sie unter [Workflows](/de-DE/workflows/).

## Ein sauberer erster Durchlauf

Hier ist der gesamte Ablauf, wobei angegeben ist, wo jeder Schritt ausgeführt wird.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

Zwei Einrichtungsschritte im Terminal, danach findet die Arbeit im Chat statt. So läuft es üblicherweise.

## Weiterführende Seiten

- [Erste Schritte](/de-DE/getting-started/): vollständige Anleitung für die erste Änderung
- [Befehle](/de-DE/commands/): ausführliche Beschreibung aller Slash-Befehle
- [CLI](/de-DE/cli/): ausführliche Beschreibung aller Terminalbefehle
- [Unterstützte Tools](/de-DE/supported-tools/): tool-spezifische Syntax und Dateipfade
- [FAQ](/de-DE/faq/): weitere kurze Antworten
- [Fehlerbehebung](/de-DE/troubleshooting/): Lösungen, wenn Befehle nicht angezeigt werden
