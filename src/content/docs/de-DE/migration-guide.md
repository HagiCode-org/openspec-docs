---
title: "Zu OPSX migrieren"
---

Dieser Leitfaden unterstützt Sie beim Wechsel vom alten OpenSpec-Workflow zu OPSX. Die Migration soll reibungslos verlaufen: Ihre vorhandene Arbeit bleibt erhalten, und das neue System bietet mehr Flexibilität.

## Was ändert sich?

OPSX ersetzt den alten, an Phasen gebundenen Workflow durch einen flexiblen, aktionsbasierten Ansatz. Das ist die wichtigste Änderung:

| Aspekt | Bisher | OPSX |
|--------|--------|------|
| **Befehle** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Standard: `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive` (erweiterte Workflow-Befehle optional) |
| **Workflow** | Alle Artefakte auf einmal erstellen | Schrittweise oder alle auf einmal erstellen – Sie entscheiden |
| **Zurückgehen** | Umständliche Phasensperren | Jedes Artefakt jederzeit aktualisieren |
| **Anpassung** | Feste Struktur | Schema-gesteuert und vollständig anpassbar |
| **Konfiguration** | `CLAUDE.md` mit Markierungen und `project.md` | Aufgeräumte Konfiguration in `openspec/config.yaml` |

**Der philosophische Wandel:** Arbeit verläuft nicht linear. OPSX tut nicht länger so, als wäre es anders.

---

## Bevor Sie beginnen

### Ihre vorhandene Arbeit ist sicher

Bei der Migration bleibt Ihre vorhandene Arbeit erhalten:

- **Aktive Änderungen unter `openspec/changes/`** – Bleiben vollständig erhalten. Sie können sie mit OPSX-Befehlen fortsetzen.
- **Archivierte Änderungen** – Bleiben unverändert. Ihre Historie bleibt erhalten.
- **Hauptspezifikationen unter `openspec/specs/`** – Bleiben unverändert. Sie sind Ihre maßgebliche Quelle.
- **Ihre Inhalte in `CLAUDE.md`, `AGENTS.md` usw.** – Bleiben erhalten. Nur OpenSpec-Markierungsblöcke werden entfernt; alles von Ihnen Verfasste bleibt bestehen.

### Was entfernt wird

Nur von OpenSpec verwaltete Dateien, die ersetzt werden:

| Element | Grund |
|------|-----|
| Alte Slash-Befehlsverzeichnisse/-dateien | Werden durch das neue Skills-System ersetzt |
| `openspec/AGENTS.md` | Veralteter Workflow-Auslöser |
| OpenSpec-Markierungen in `CLAUDE.md`, `AGENTS.md` usw. | Nicht mehr erforderlich |

**Pfade alter Befehlsdateien nach Tool** (Beispiele; bei Ihrem Tool können sie abweichen):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop, früher Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (nur IDE-Erweiterungen; nicht von Copilot CLI unterstützt)
- Codex: OpenSpec verwendet jetzt den kanonischen Pfad `.agents/skills/openspec-*`. Von OpenSpec verwaltete `SKILL.md`-Dateien unter dem früheren Pfad `.codex/skills` werden erst abgeglichen, nachdem Ersatzdateien vorhanden sind; benutzerdefinierte Dateien und abweichende Kopien bleiben bestehen. Wenn ein unmarkierter `.agents`-Baum bereits OpenSpec-Skills enthält, behält OpenSpec dessen vorhandene Codex- (`$openspec-*`) oder allgemeine (`/openspec-*`) Ausgabe bei, statt sie anhand des alten Verzeichnisses zu erraten. Um die Zuständigkeit zu wechseln, wählen Sie `codex` ausdrücklich mit `openspec init` aus. Bei der Bereinigung alter Prompts werden weiterhin nur die von OpenSpec zugelassenen Dateinamen unter `$CODEX_HOME/prompts` oder `~/.codex/prompts` berücksichtigt.
- Und weitere (Augment, Continue, Amazon Q usw.)

Die Migration erkennt, welche Tools Sie konfiguriert haben, und bereinigt deren alte Dateien.

Die Liste der zu entfernenden Dateien wirkt möglicherweise lang, aber es handelt sich ausschließlich um Dateien, die OpenSpec ursprünglich selbst erstellt hat. Ihre eigenen Inhalte werden niemals gelöscht.

### Was Ihre Aufmerksamkeit erfordert

Eine Datei muss manuell migriert werden:

**`openspec/project.md`** – Diese Datei wird nicht automatisch gelöscht, da sie von Ihnen verfassten Projektkontext enthalten kann. Sie müssen:

1. ihren Inhalt prüfen,
2. nützlichen Kontext nach `openspec/config.yaml` verschieben (siehe Hinweise unten),
3. die Datei löschen, sobald Sie bereit sind.

**Warum wir diese Änderung vorgenommen haben:**

Die alte `project.md` war passiv: Agents konnten sie lesen oder auch nicht und möglicherweise vergessen, was darin stand. Die Zuverlässigkeit war uneinheitlich.

Der Kontext in der neuen `config.yaml` wird **aktiv in jede OpenSpec-Planungsanfrage eingefügt**. So stehen Ihre Projektkonventionen, Ihr Technologie-Stack und Ihre Regeln der KI immer zur Verfügung, wenn sie Artefakte erstellt. Das verbessert die Zuverlässigkeit.

**Der Nachteil:**

Da der Kontext in jede Anfrage eingefügt wird, sollten Sie sich kurz fassen. Konzentrieren Sie sich auf das Wesentliche:
- Technologie-Stack und wichtige Konventionen
- Nicht offensichtliche Einschränkungen, die die KI kennen muss
- Regeln, die zuvor häufig missachtet wurden

Machen Sie sich keine Sorgen, gleich alles perfekt zu formulieren. Auch wir lernen noch, was am besten funktioniert, und werden die Kontextinjektion im Zuge weiterer Erprobungen verbessern.

---

## Migration ausführen

Sowohl `openspec init` als auch `openspec update` erkennen alte Dateien und führen Sie durch denselben Bereinigungsprozess. Verwenden Sie den Befehl, der zu Ihrer Situation passt:

- Neue Installationen verwenden standardmäßig das Profil `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`).
- Migrierte Installationen behalten zuvor installierte Workflows bei und schreiben bei Bedarf ein Profil `custom`.

### `openspec init` verwenden

Führen Sie diesen Befehl aus, wenn Sie neue Tools hinzufügen oder die Einrichtung Ihrer Tools neu konfigurieren möchten:

```bash
openspec init
```

Der Befehl `init` erkennt alte Dateien und führt Sie durch die Bereinigung:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Was geschieht, wenn Sie zustimmen:**

1. Alte Slash-Befehlsverzeichnisse werden entfernt.
2. OpenSpec-Markierungen werden aus `CLAUDE.md`, `AGENTS.md` usw. entfernt (Ihre Inhalte bleiben erhalten).
3. `openspec/AGENTS.md` wird gelöscht.
4. Neue Skills werden unter `.claude/skills/` installiert.
5. `openspec/config.yaml` wird mit einem Standardschema erstellt.

### `openspec update` verwenden

Führen Sie den Befehl aus, wenn Sie lediglich migrieren und Ihre vorhandenen Tools auf die neueste Version aktualisieren möchten:

```bash
openspec update
```

Auch der Befehl `update` erkennt alte Artefakte und bereinigt sie. Anschließend aktualisiert er generierte Skills und Befehle entsprechend Ihrem aktuellen Profil und Ihren Bereitstellungseinstellungen.

### Nicht-interaktive Umgebungen und CI

Für skriptgesteuerte Migrationen:

```bash
openspec init --force --tools claude
```

Das Flag `--force` überspringt Rückfragen und bestätigt die Bereinigung automatisch.

Dies umfasst auch die Bereinigung von OpenSpec-verwalteten Codex-Prompt-Dateien im globalen Codex-Prompt-Verzeichnis. Dabei werden nur die zugelassenen alten Codex-Prompt-Dateinamen von OpenSpec berücksichtigt. Sie werden erst entfernt, wenn entsprechende Ersatz-Skills unter `.agents/skills/openspec-*` vorhanden sind. Alle anderen Dateien bleiben erhalten.

---

## `project.md` zu `config.yaml` migrieren

Die alte `openspec/project.md` war eine frei formatierte Markdown-Datei für den Projektkontext. Die neue `openspec/config.yaml` hat eine strukturierte Form und wird – was besonders wichtig ist – **in jede Planungsanfrage eingefügt**, sodass die KI bei ihrer Arbeit immer Ihre Konventionen kennt.

### Vorher (`project.md`)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Nachher (`config.yaml`)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Wichtige Unterschiede

| `project.md` | `config.yaml` |
|------------|-------------|
| Frei formatiertes Markdown | Strukturiertes YAML |
| Ein Textblock | Getrennter Kontext und Regeln pro Artefakt |
| Unklar, wann der Inhalt verwendet wird | Kontext erscheint in ALLEN Artefakten; Regeln nur in den passenden Artefakten |
| Keine Schemaauswahl | Das Feld `schema:` legt ausdrücklich den Standard-Workflow fest |

### Was behalten und was weglassen?

Gehen Sie bei der Migration gezielt vor. Fragen Sie sich: „Benötigt die KI diese Information bei *jeder* Planungsanfrage?“

**Geeignete Inhalte für `context:`**
- Technologie-Stack (Sprachen, Frameworks, Datenbanken)
- Wichtige Architekturmuster (Monorepo, Microservices usw.)
- Nicht offensichtliche Einschränkungen („Wir können die Bibliothek X nicht verwenden, weil …“)
- Zentrale Konventionen, die häufig missachtet werden

**Stattdessen nach `rules:` verschieben**
- Artefaktspezifische Formatierung („Verwende in Spezifikationen Given/When/Then“)
- Prüfkriterien („Vorschläge müssen einen Rollback-Plan enthalten“)
- Sie erscheinen nur beim passenden Artefakt und halten andere Anfragen schlanker.

**Vollständig weglassen**
- Allgemeine bewährte Vorgehensweisen, die der KI bereits bekannt sind
- Ausführliche Erläuterungen, die sich zusammenfassen lassen
- Historischen Kontext ohne Einfluss auf die aktuelle Arbeit

### Migrationsschritte

1. **`config.yaml` erstellen** (falls `init` sie noch nicht erstellt hat):
   ```yaml
   schema: spec-driven
   ```

2. **Ihren Kontext hinzufügen** (fassen Sie sich kurz – er wird in jede Anfrage eingefügt):
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **Regeln für einzelne Artefakte hinzufügen** (optional):
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **`project.md` löschen**, sobald Sie alle nützlichen Inhalte übertragen haben.

**Machen Sie es nicht komplizierter als nötig.** Beginnen Sie mit dem Wesentlichen und verfeinern Sie es schrittweise. Wenn die KI etwas Wichtiges übersieht, ergänzen Sie es. Wenn der Kontext zu umfangreich wirkt, kürzen Sie ihn. Dies ist ein lebendiges Dokument.

### Brauchen Sie Hilfe? Verwenden Sie diese Eingabe

Wenn Sie unsicher sind, wie Sie den Inhalt von `project.md` zusammenfassen sollen, bitten Sie Ihren KI-Assistenten:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

Die KI hilft Ihnen dabei, Wesentliches von Kürzbarem zu unterscheiden.

---

## Die neuen Befehle

Die verfügbaren Befehle hängen vom Profil ab:

**Standardprofil (`core`):**

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen ohne feste Struktur durchdenken |
| `/opsx:apply` | Aufgaben aus `tasks.md` implementieren |
| `/opsx:update` | Planungsartefakte einer Änderung überarbeiten und konsistent halten |
| `/opsx:sync` | Delta-Spezifikationen mit den Hauptspezifikationen zusammenführen |
| `/opsx:archive` | Änderung abschließen und archivieren |

**Erweiterter Workflow (benutzerdefinierte Auswahl):**

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Grundgerüst für eine neue Änderung anlegen |
| `/opsx:continue` | Nächstes Artefakt erstellen (jeweils eines) |
| `/opsx:ff` | Schnellvorlauf – Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Prüfen, ob die Implementierung den Spezifikationen entspricht |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführter Onboarding-Workflow von Anfang bis Ende |

Aktivieren Sie erweiterte Befehle mit `openspec config profile` und führen Sie anschließend `openspec update` aus.

### Zuordnung alter Befehle

| Bisher | Entsprechung in OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (default) or `/opsx:new` then `/opsx:ff` (expanded) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Neue Funktionen

Diese Funktionen gehören zum erweiterten Workflow-Befehlssatz.

**Artefakte einzeln erstellen:**
```
/opsx:continue
```
Erstellt jeweils ein Artefakt auf Grundlage der Abhängigkeiten. Verwenden Sie den Befehl, wenn Sie jeden Schritt einzeln überprüfen möchten.

**Erkundungsmodus:**
```
/opsx:explore
```
Denken Sie gemeinsam mit einem Partner über Ideen nach, bevor Sie sich auf eine Änderung festlegen.

---

## Die neue Architektur verstehen

### Von festen Phasen zu flexiblen Abläufen

Der alte Workflow zwang zu einem linearen Ablauf:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX arbeitet mit Aktionen statt Phasen:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Abhängigkeitsgraph

Artefakte bilden einen gerichteten Graphen. Abhängigkeiten ermöglichen Schritte, statt sie zu blockieren:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

Wenn Sie `/opsx:continue` ausführen, wird geprüft, welche Artefakte bereitstehen, und das nächste wird angeboten. Sie können auch mehrere bereite Artefakte in beliebiger Reihenfolge erstellen.

### Skills im Vergleich zu Befehlen

Das alte System verwendete tool-spezifische Befehlsdateien:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX verwendet den aufkommenden **Skills**-Standard:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Skills werden von mehreren KI-Codierwerkzeugen erkannt und bieten umfangreichere Metadaten.

Codex verwendet OPSX ausschließlich über Skills. OpenSpec generiert keine benutzerdefinierten Codex-Prompt-Dateien mehr. Verwenden Sie stattdessen die generierten Verzeichnisse `.agents/skills/openspec-*`.

---

## Bestehende Änderungen fortsetzen

Ihre laufenden Änderungen funktionieren nahtlos mit OPSX-Befehlen.

**Sie haben eine aktive Änderung aus dem alten Workflow?**

```
/opsx:apply add-my-feature
```

OPSX liest die vorhandenen Artefakte und setzt an der Stelle fort, an der Sie aufgehört haben.

**Möchten Sie einer bestehenden Änderung weitere Artefakte hinzufügen?**

```
/opsx:continue add-my-feature
```

Zeigt anhand der bereits vorhandenen Artefakte, was erstellt werden kann.

**Möchten Sie den Status prüfen?**

```bash
openspec status --change add-my-feature
```

---

## Das neue Konfigurationssystem

### Struktur von `config.yaml`

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Schemaauflösung

Bei der Auswahl eines Schemas prüft OPSX in folgender Reihenfolge:

1. **CLI-Flag**: `--schema <name>` (höchste Priorität)
2. **Änderungsmetadaten**: `.openspec.yaml` im Änderungsverzeichnis
3. **Projektkonfiguration**: `openspec/config.yaml`
4. **Standardwert**: `spec-driven`

### Verfügbare Schemas

| Schema | Artefakte | Geeignet für |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | Die meisten Projekte |

Alle verfügbaren Schemas auflisten:

```bash
openspec schemas
```

### Benutzerdefinierte Schemas

Erstellen Sie Ihren eigenen Workflow:

```bash
openspec schema init my-workflow
```

Oder forken Sie ein vorhandenes Schema:

```bash
openspec schema fork spec-driven my-workflow
```

Weitere Informationen finden Sie unter [Anpassung](/de-DE/customization/).

---

## Fehlerbehebung

### „Legacy files detected in non-interactive mode“

Sie führen den Befehl in einer CI- oder nicht-interaktiven Umgebung aus. Verwenden Sie:

```bash
openspec init --force
```

### Nach der Migration werden keine Befehle angezeigt

Starten Sie Ihre IDE neu. Skills werden beim Start erkannt.

### „Unknown artifact ID in rules“

Prüfen Sie, ob die Schlüssel unter `rules:` mit den Artefakt-IDs Ihres Schemas übereinstimmen:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Führen Sie Folgendes aus, um gültige Artefakt-IDs anzuzeigen:

```bash
openspec schemas --json
```

### Die Konfiguration wird nicht angewendet

1. Stellen Sie sicher, dass die Datei `openspec/config.yaml` heißt (nicht `.yml`).
2. Prüfen Sie die YAML-Syntax.
3. Änderungen an der Konfiguration werden sofort wirksam – ein Neustart ist nicht erforderlich.

### `project.md` wurde nicht migriert

Das System bewahrt `project.md` absichtlich auf, da sie benutzerdefinierte Inhalte enthalten kann. Prüfen Sie die Datei manuell, verschieben Sie nützliche Inhalte nach `config.yaml` und löschen Sie sie anschließend.

### Möchten Sie sehen, was bereinigt würde?

Führen Sie `init` aus und lehnen Sie die Bereinigungsaufforderung ab. Sie sehen dann die vollständige Erkennungsübersicht, ohne dass Änderungen vorgenommen werden.

---

## Schnellreferenz

### Dateien nach der Migration

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### Was entfernt wurde

- `.claude/commands/openspec/` – durch `.claude/skills/` ersetzt
- `openspec/AGENTS.md` – veraltet
- `openspec/project.md` – nach `config.yaml` migrieren und anschließend löschen
- OpenSpec-Markierungsblöcke in `CLAUDE.md`, `AGENTS.md` usw.

### Befehlsübersicht

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## Hilfe erhalten

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub-Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Dokumentation**: [OPSX-Referenz](/de-DE/opsx/)
