---
title: "OPSX-Workflow"
---

> Rückmeldungen sind auf [Discord](https://discord.gg/YctCnvvshC) willkommen.

## Was ist OPSX?

OPSX ist jetzt der Standard-Workflow für OpenSpec.

Es ist ein **flexibler, iterativer Workflow** für OpenSpec-Änderungen. Keine starren Phasen mehr, sondern Aktionen, die Sie jederzeit ausführen können.

## Warum es OPSX gibt

Der frühere OpenSpec-Workflow funktioniert, ist aber **starr**:

- **Anweisungen sind fest codiert** – in TypeScript verborgen und nicht änderbar.
- **Alles oder nichts** – ein großer Befehl erstellt alles; einzelne Teile lassen sich nicht testen.
- **Feste Struktur** – derselbe Workflow für alle, ohne Anpassungsmöglichkeiten.
- **Blackbox** – bei schlechter KI-Ausgabe lassen sich die Prompts nicht anpassen.

**OPSX öffnet den Workflow.** Nun kann jeder:

1. **Mit Anweisungen experimentieren** – eine Vorlage bearbeiten und prüfen, ob die KI bessere Ergebnisse liefert.
2. **Gezielt testen** – die Anweisungen jedes Artefakts einzeln validieren.
3. **Workflows anpassen** – eigene Artefakte und Abhängigkeiten definieren.
4. **Schnell iterieren** – eine Vorlage ändern und sofort testen, ohne neu zu bauen.

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**OPSX ist für alle gedacht:**
- **Teams** – Workflows erstellen, die der tatsächlichen Arbeitsweise entsprechen.
- **Fortgeschrittene Benutzer** – Prompts anpassen, um bessere KI-Ergebnisse für die eigene Codebasis zu erhalten.
- **OpenSpec-Mitwirkende** – neue Ansätze ohne Veröffentlichung ausprobieren.

Wir lernen alle noch, was am besten funktioniert. Mit OPSX können wir gemeinsam dazulernen.

## Die Benutzererfahrung

**Das Problem mit linearen Workflows:**
Sie befinden sich erst „in der Planungsphase“, dann „in der Implementierungsphase“ und schließlich sind Sie „fertig“. In der Realität läuft Arbeit aber nicht so ab. Sie implementieren etwas, merken, dass der Entwurf falsch war, müssen die Spezifikationen aktualisieren und die Implementierung fortsetzen. Lineare Phasen stehen dem tatsächlichen Arbeitsablauf im Weg.

**Der OPSX-Ansatz:**
- **Aktionen statt Phasen** – erstellen, implementieren, aktualisieren und archivieren; Sie können alles jederzeit tun.
- **Abhängigkeiten ermöglichen Schritte** – sie zeigen, was möglich ist, nicht, was als Nächstes erforderlich ist.

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Einrichtung

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

Dadurch werden Skills unter `.claude/skills/` (oder einem entsprechenden Pfad) erstellt, die KI-Codierassistenten automatisch erkennen.

Standardmäßig verwendet OpenSpec das Workflow-Profil `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`). Wenn Sie die erweiterten Workflow-Befehle (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`) verwenden möchten, konfigurieren Sie sie mit `openspec config profile` und wenden Sie die Änderungen mit `openspec update` an.

Während der Einrichtung werden Sie aufgefordert, eine **Projektkonfiguration** (`openspec/config.yaml`) zu erstellen. Sie ist optional, wird aber empfohlen.

## Projektkonfiguration

Mit der Projektkonfiguration können Sie Standardwerte festlegen und projektspezifischen Kontext in alle Artefakte einfügen.

### Konfiguration erstellen

Die Konfiguration wird mit `openspec init` oder manuell erstellt:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Konfigurationsfelder

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `schema` | string | Standardschema für neue Änderungen (z. B. `spec-driven`) |
| `context` | string | Projektkontext, der in alle Artefaktanweisungen eingefügt wird |
| `rules` | object | Regeln pro Artefakt, nach Artefakt-ID geordnet |

### So funktioniert es

**Priorität der Schemas** (von höchster zu niedrigster):
1. CLI-Flag (`--schema <name>`)
2. Änderungsmetadaten (`.openspec.yaml` im Änderungsverzeichnis)
3. Projektkonfiguration (`openspec/config.yaml`)
4. Standardwert (`spec-driven`)

**Kontextinjektion:**
- Der Kontext wird jeder Artefaktanweisung vorangestellt.
- Er wird in Tags `<context>...</context>` eingeschlossen.
- So kann die KI die Konventionen Ihres Projekts verstehen.

**Regelinjektion:**
- Regeln werden nur bei passenden Artefakten eingefügt.
- Sie werden in Tags `<rules>...</rules>` eingeschlossen.
- Sie erscheinen nach dem Kontext und vor der Vorlage.

### Artefakt-IDs nach Schema

**spec-driven** (Standard):
- `proposal` – Änderungsvorschlag
- `specs` – Spezifikationen
- `design` – Technischer Entwurf
- `tasks` – Implementierungsaufgaben

### Konfigurationsvalidierung

- Unbekannte Artefakt-IDs unter `rules` lösen Warnungen aus.
- Schemanamen werden mit den verfügbaren Schemas abgeglichen.
- Der Kontext ist auf 50 KB begrenzt.
- Ungültiges YAML wird mit Zeilennummern gemeldet.

### Fehlerbehebung

**„Unknown artifact ID in rules: X“**
- Prüfen Sie, ob die Artefakt-IDs Ihrem Schema entsprechen (siehe Liste oben).
- Führen Sie `openspec schemas --json` aus, um die Artefakt-IDs der einzelnen Schemas anzuzeigen.

**Die Konfiguration wird nicht angewendet:**
- Stellen Sie sicher, dass die Datei `openspec/config.yaml` heißt (nicht `.yml`).
- Prüfen Sie die YAML-Syntax mit einem Validator.
- Änderungen an der Konfiguration werden sofort wirksam (ein Neustart ist nicht erforderlich).

**Der Kontext ist zu groß:**
- Der Kontext ist auf 50 KB begrenzt.
- Fassen Sie ihn zusammen oder verweisen Sie stattdessen auf externe Dokumentation.

## Befehle

| Befehl | Funktion |
|---------|--------------|
| `/opsx:propose` | Änderung erstellen und in einem Schritt Planungsartefakte generieren (schneller Standardablauf) |
| `/opsx:explore` | Ideen durchdenken, Probleme untersuchen und Anforderungen klären |
| `/opsx:new` | Grundgerüst einer neuen Änderung anlegen (erweiterter Workflow) |
| `/opsx:continue` | Nächstes Artefakt erstellen (erweiterter Workflow) |
| `/opsx:ff` | Planungsartefakte im Schnellvorlauf erstellen (erweiterter Workflow) |
| `/opsx:apply` | Aufgaben implementieren und bei Bedarf Artefakte aktualisieren |
| `/opsx:update` | Planungsartefakte einer Änderung überarbeiten und konsistent halten |
| `/opsx:verify` | Implementierung anhand der Artefakte validieren (erweiterter Workflow) |
| `/opsx:sync` | Delta-Spezifikationen mit Hauptspezifikationen zusammenführen (optional) |
| `/opsx:archive` | Änderung nach Abschluss archivieren |
| `/opsx:bulk-archive` | Mehrere abgeschlossene Änderungen archivieren (erweiterter Workflow) |
| `/opsx:onboard` | Geführte Anleitung durch eine Änderung von Anfang bis Ende (erweiterter Workflow) |

## Verwendung

### Eine Idee erkunden
```
/opsx:explore
```
Denken Sie Ideen durch, untersuchen Sie Probleme und vergleichen Sie Optionen. Eine feste Struktur ist nicht erforderlich – der Befehl ist lediglich ein Denkpartner. Sobald sich Erkenntnisse herauskristallisieren, wechseln Sie zu `/opsx:propose` (Standard) oder `/opsx:new`/`/opsx:ff` (erweitert).

### Eine neue Änderung beginnen
```
/opsx:propose
```
Erstellt die Änderung und generiert die vor der Implementierung benötigten Planungsartefakte.

Wenn Sie die erweiterten Workflows aktiviert haben, können Sie stattdessen Folgendes verwenden:

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### Artefakte erstellen
```
/opsx:continue
```
Zeigt anhand der Abhängigkeiten, was erstellt werden kann, und erstellt dann ein Artefakt. Wiederholen Sie den Befehl, um Ihre Änderung schrittweise auszuarbeiten.

```
/opsx:ff add-dark-mode
```
Erstellt alle Planungsartefakte auf einmal. Verwenden Sie den Befehl, wenn Sie bereits genau wissen, was Sie bauen möchten.

### Implementieren (der flexible Teil)
```
/opsx:apply
```
Arbeitet die Aufgaben ab und hakt sie dabei ab. Wenn Sie mehrere Änderungen gleichzeitig bearbeiten, können Sie `/opsx:apply <name>` ausführen. Andernfalls sollte der Befehl die Änderung aus dem Gespräch ableiten und Sie zur Auswahl auffordern, falls sie unklar ist.

### Eine Änderung aktualisieren
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Überarbeitet die vorhandenen Planungsartefakte der Änderung und hält sie in allen Richtungen konsistent (eine Änderung am Entwurf kann sich auch auf den Vorschlag auswirken). Der Befehl bearbeitet niemals Code. Jede Änderung wird vor dem Schreiben von Ihnen bestätigt. Wie fehlende Dateien behandelt werden, ohne ein neues Artefakt zu beginnen, erfahren Sie in der [Referenz zu „Update“](/de-DE/commands/#opsxupdate).

Wenn die Änderung bereits implementiert wurde, empfiehlt der Befehl `/opsx:apply`, damit der Code dem überarbeiteten Plan entspricht. Ändert Ihre Überarbeitung die *Absicht* der Änderung, sollten Sie stattdessen neu beginnen. Siehe [Wann aktualisieren und wann neu beginnen?](#wann-aktualisieren-und-wann-neu-beginnen).

### Delta-Spezifikationen synchronisieren
```text
/opsx:sync
```
Führt die Delta-Spezifikationen der aktuellen Änderung mit den Hauptspezifikationen unter `openspec/specs/` zusammen, ohne die Änderung zu archivieren – sie bleibt aktiv. Das gesamte Delta wird angewendet: Eine Anforderung unter `## REMOVED` wird aus der Hauptspezifikation gelöscht, eine umbenannte Anforderung wird direkt an Ort und Stelle umbenannt, und nicht im Delta erwähnte Inhalte bleiben unverändert. Die Synchronisierung ist optional. Wenn sie noch nicht erfolgt ist, bietet archive sie vorher an. Verwenden Sie den Befehl, wenn Sie die Hauptspezifikationen vor dem Archivieren aktualisieren möchten, wenn eine parallele Änderung auf gerade hinzugefügten Spezifikationen aufbauen soll oder wenn Sie die zusammengeführte Hauptspezifikation vor dem Archivieren überprüfen möchten.

### Abschließen
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## Wann aktualisieren und wann neu beginnen?

Sie können Ihren Vorschlag oder Ihre Spezifikationen jederzeit vor der Implementierung bearbeiten. Aber wann wird aus einer Verfeinerung „eine andere Arbeit“?

### Was ein Vorschlag festhält

Ein Vorschlag definiert drei Dinge:
1. **Absicht** – Welches Problem lösen Sie?
2. **Umfang** – Was gehört dazu und was nicht?
3. **Ansatz** – Wie werden Sie es lösen?

Die Frage lautet: Was hat sich geändert – und wie stark?

### Die bestehende Änderung aktualisieren, wenn:

**Die gleiche Absicht, aber eine verfeinerte Umsetzung**
- Sie entdecken zuvor nicht berücksichtigte Randfälle.
- Der Ansatz muss angepasst werden, das Ziel bleibt jedoch unverändert.
- Bei der Implementierung zeigt sich, dass der Entwurf nicht ganz stimmte.

**Der Umfang wird kleiner**
- Sie erkennen, dass der gesamte Umfang zu groß ist, und möchten zuerst ein MVP veröffentlichen.
- „Dunkelmodus hinzufügen“ → „Schalter für den Dunkelmodus hinzufügen (Systemeinstellung in Version 2)“

**Erkenntnisbedingte Korrekturen**
- Die Codebasis ist anders strukturiert, als Sie erwartet haben.
- Eine Abhängigkeit funktioniert nicht wie erwartet.
- „CSS-Variablen verwenden“ → „Stattdessen das Präfix `dark:` von Tailwind verwenden“

### Eine neue Änderung beginnen, wenn:

**Die Absicht hat sich grundlegend geändert**
- Das Problem selbst ist nun ein anderes.
- „Dunkelmodus hinzufügen“ → „Ein umfassendes Theme-System mit benutzerdefinierten Farben, Schriftarten und Abständen hinzufügen“

**Der Umfang ist stark angewachsen**
- Die Änderung ist so stark gewachsen, dass es sich im Grunde um eine andere Arbeit handelt.
- Der ursprüngliche Vorschlag wäre nach den Aktualisierungen nicht mehr wiederzuerkennen.
- „Anmeldefehler beheben“ → „Authentifizierungssystem neu schreiben“

**Die ursprüngliche Änderung ist abschließbar**
- Die ursprüngliche Änderung kann als „abgeschlossen“ markiert werden.
- Die neue Arbeit steht für sich und ist keine Verfeinerung.
- „MVP für Dunkelmodus hinzufügen“ abschließen → archivieren → neue Änderung „Dunkelmodus erweitern“ beginnen

### Faustregeln

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Kriterium | Aktualisieren | Neue Änderung |
|------|--------|------------|
| **Identität** | „Gleiche Arbeit, verfeinert“ | „Andere Arbeit“ |
| **Überschneidung des Umfangs** | Mehr als 50 % überschneiden sich | Weniger als 50 % überschneiden sich |
| **Abschluss** | Ohne Änderungen nicht „fertig“ | Ursprüngliche Arbeit abschließbar, neue Arbeit steht für sich |
| **Verlauf** | Kette von Aktualisierungen ergibt eine schlüssige Geschichte | Nachbesserungen würden eher verwirren als Klarheit schaffen |

### Das Prinzip

> **Aktualisieren bewahrt Kontext. Eine neue Änderung schafft Klarheit.**
>
> Aktualisieren Sie die Änderung, wenn die Entwicklung Ihrer Überlegungen wichtig ist.
> Beginnen Sie neu, wenn ein neuer Ansatz klarer wäre als mehrere Nachbesserungen.

Stellen Sie es sich wie Git-Branches vor:
- Committen Sie weiter, solange Sie an derselben Funktion arbeiten.
- Beginnen Sie einen neuen Branch, wenn es tatsächlich eine neue Arbeit ist.
- Manchmal können Sie eine teilweise fertige Funktion zusammenführen und für die zweite Phase neu beginnen.

## Was ist anders?

| | Bisher (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Struktur** | Ein großes Vorschlagsdokument | Einzelne Artefakte mit Abhängigkeiten |
| **Workflow** | Lineare Phasen: planen → implementieren → archivieren | Flexible Aktionen – jederzeit alles tun |
| **Iteration** | Umständliches Zurückgehen | Artefakte beim Dazulernen aktualisieren |
| **Anpassung** | Feste Struktur | Schema-gesteuert (eigene Artefakte definieren) |

**Die zentrale Erkenntnis:** Arbeit verläuft nicht linear. OPSX tut nicht länger so, als wäre es anders.

## Die Architektur im Detail

Dieser Abschnitt erklärt, wie OPSX unter der Haube funktioniert und wie es sich vom alten Workflow unterscheidet.
Die Beispiele verwenden hier den erweiterten Befehlssatz (`new`, `continue` usw.). Benutzer des Standardprofils `core` können denselben Ablauf auf `propose → apply → sync → archive` abbilden.

### Philosophie: Phasen im Vergleich zu Aktionen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Komponentenarchitektur

Der **alte Workflow** verwendet fest codierte Vorlagen in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** verwendet externe Schemas und eine Abhängigkeitsgraph-Engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Devin)                    │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modell des Abhängigkeitsgraphen

Artefakte bilden einen gerichteten azyklischen Graphen (DAG). Abhängigkeiten **ermöglichen** Schritte, statt sie zu blockieren:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Zustandsübergänge:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Informationsfluss

**Alter Workflow** – der Agent erhält statische Anweisungen:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create delta spec files              │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** – der Agent fragt umfangreichen Kontext ab:

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked",                          │  │
  │  │       "missingDeps": ["specs", "design"]}                          │  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Iterationsmodell

**Alter Workflow** – Iteration ist umständlich:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** – natürliche Iteration:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### Benutzerdefinierte Schemas

Erstellen Sie benutzerdefinierte Workflows mit den Schema-Verwaltungsbefehlen:

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

Schemas werden unter `openspec/schemas/` (projektspezifisch und versioniert) oder `~/.local/share/openspec/schemas/` (global für den Benutzer) gespeichert.

**Schemastruktur:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Beispiel für `schema.yaml`:**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Abhängigkeitsgraph:**
```
   research ──► proposal ──► tasks
```

### Zusammenfassung

| Aspekt | Bisher | OPSX |
|--------|----------|------|
| **Vorlagen** | Fest codiertes TypeScript | Externes YAML und Markdown |
| **Abhängigkeiten** | Keine (alles auf einmal) | DAG mit topologischer Sortierung |
| **Zustand** | Phasenbasiertes Denkmodell | Vorhandensein im Dateisystem |
| **Anpassung** | Quellcode bearbeiten und neu bauen | `schema.yaml` erstellen |
| **Iteration** | An Phasen gebunden | Flexibel, alles bearbeitbar |
| **Editor-Unterstützung** | Tool-spezifischer Konfigurator/Adapter | Einzelnes Skills-Verzeichnis |

## Schemas

Schemas legen fest, welche Artefakte vorhanden sind und welche Abhängigkeiten sie haben. Derzeit verfügbar:

- **spec-driven** (Standard): proposal → specs → design → tasks

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Tipps

- Verwenden Sie `/opsx:explore`, um eine Idee zu durchdenken, bevor Sie sich auf eine Änderung festlegen.
- Verwenden Sie `/opsx:ff`, wenn Sie wissen, was Sie möchten, und `/opsx:continue`, wenn Sie noch erkunden.
- Wenn während `/opsx:apply` etwas nicht stimmt, korrigieren Sie das Artefakt und fahren Sie fort.
- Aufgaben verfolgen den Fortschritt mithilfe von Kontrollkästchen in `tasks.md`.
- Prüfen Sie den Status jederzeit mit `openspec status --change "name"`.

## Feedback

Dieser Workflow ist noch nicht ausgereift. Das ist beabsichtigt – wir lernen noch, was am besten funktioniert.

Haben Sie einen Fehler gefunden oder Ideen? Besuchen Sie uns auf [Discord](https://discord.gg/YctCnvvshC) oder eröffnen Sie ein Issue auf [GitHub](https://github.com/Fission-AI/openspec/issues).
