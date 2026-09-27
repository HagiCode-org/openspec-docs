---
title: "Befehle"
---

Dies ist die Referenz für die Slash-Befehle von OpenSpec. Sie werden in der Chatoberfläche Ihres KI-Codierassistenten aufgerufen (z. B. Claude Code, Cursor oder Devin Desktop).

Informationen zu Workflow-Mustern und zum passenden Einsatz der einzelnen Befehle finden Sie unter [Workflows](/de-DE/workflows/). Terminalbefehle sind unter [CLI](/de-DE/cli/) dokumentiert.

In dieser Dokumentation wird `/opsx:<command>` als kanonischer Name verwendet. Einige Tools schreiben ihn
anders – Cursor und GitHub Copilot registrieren `/opsx-propose`, Codex verwendet
`$openspec-propose`. Prüfen Sie daher unter [Befehle aufrufen](/de-DE/supported-tools/#befehle-aufrufen)
die Form für Ihr Tool. Die von OpenSpec generierten Dateien verwenden bereits die richtige Schreibweise.

## Schnellreferenz

### Schneller Standardablauf (Profil `core`)

| Befehl | Zweck |
|---------|---------|
| `/opsx:propose` | Änderung erstellen und Planungsartefakte in einem Schritt generieren |
| `/opsx:explore` | Ideen durchdenken, bevor Sie sich auf eine Änderung festlegen |
| `/opsx:apply` | Aufgaben der Änderung implementieren |
| `/opsx:update` | Planungsartefakte einer Änderung überarbeiten und konsistent halten |
| `/opsx:sync` | Delta-Spezifikationen mit den Hauptspezifikationen zusammenführen |
| `/opsx:archive` | Abgeschlossene Änderung archivieren |

### Erweiterte Workflow-Befehle (benutzerdefinierte Workflow-Auswahl)

| Befehl | Zweck |
|---------|---------|
| `/opsx:new` | Grundgerüst für eine neue Änderung anlegen |
| `/opsx:continue` | Nächstes Artefakt anhand der Abhängigkeiten erstellen |
| `/opsx:ff` | Schnellvorlauf: alle Planungsartefakte auf einmal erstellen |
| `/opsx:verify` | Prüfen, ob die Implementierung den Artefakten entspricht |
| `/opsx:bulk-archive` | Mehrere Änderungen auf einmal archivieren |
| `/opsx:onboard` | Geführte Anleitung durch den gesamten Workflow |

Das globale Standardprofil ist `core`. Um erweiterte Workflow-Befehle zu aktivieren, führen Sie `openspec config profile` aus, wählen Sie die Workflows aus und führen Sie anschließend `openspec update` in Ihrem Projekt aus.

---

## Befehlsreferenz

### `/opsx:propose`

Erstellt eine neue Änderung und generiert in einem Schritt die Planungsartefakte. Dies ist der standardmäßige Startbefehl im Profil `core`.

**Syntax:**
```text
/opsx:propose [change-name-or-description]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name-or-description` | Nein | Name im Kebab-Case oder verständliche Beschreibung der Änderung |

**Funktion:**
- Erstellt `openspec/changes/<change-name>/`.
- Generiert die vor der Implementierung benötigten Artefakte (bei `spec-driven`: proposal, specs, design, tasks).
- Hält an, sobald die Änderung für `/opsx:apply` bereit ist.

**Beispiel:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Tipps:**
- Verwenden Sie diesen Befehl für den schnellsten durchgängigen Ablauf.
- Wenn Sie die Artefakte Schritt für Schritt steuern möchten, aktivieren Sie die erweiterten Workflows und verwenden Sie `/opsx:new` und `/opsx:continue`.

---

### `/opsx:explore`

> **Beginnen Sie hier, wenn Sie unsicher sind.** „Explore“ ist ein Denkpartner ohne Verpflichtungen: Der Befehl liest Ihre Codebasis, vergleicht Optionen und schärft eine vage Idee zu einem konkreten Plan, bevor Code geschrieben wird. Er ist im Standardprofil enthalten. Eine ausführliche Erläuterung und weitere Beispiele finden Sie im Leitfaden [Zuerst erkunden](/de-DE/explore/).

Denken Sie Ideen durch, untersuchen Sie Probleme und klären Sie Anforderungen, bevor Sie sich auf eine Änderung festlegen.

**Syntax:**
```
/opsx:explore [topic]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `topic` | Nein | Was Sie erkunden oder untersuchen möchten |

**Funktion:**
- Beginnt ein Erkundungsgespräch, für das keine feste Struktur erforderlich ist.
- Untersucht die Codebasis, um Fragen zu beantworten.
- Vergleicht Optionen und Ansätze.
- Erstellt visuelle Diagramme, um Überlegungen zu verdeutlichen.
- Hält die Erkundung auf Ihre Bitte hin oder nach Ihrer Zustimmung zu seinem Angebot fest: Der Befehl richtet die Änderung mit `openspec new change` ein und schreibt die von Ihnen genannten Planungsartefakte oder aktualisiert die Artefakte einer bestehenden Änderung.
- Kann zu `/opsx:propose` (Standard) oder `/opsx:new` (erweiterter Workflow) überleiten, sobald sich Erkenntnisse herauskristallisieren.

**Beispiel:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**Tipps:**
- Verwenden Sie den Befehl bei unklaren Anforderungen oder wenn Sie etwas untersuchen müssen.
- Er schreibt niemals Code und sonst nichts, sofern Sie nicht darum bitten oder sein Angebot annehmen.
- Er eignet sich gut, um mehrere Ansätze vor einer Entscheidung zu vergleichen.
- Er kann Dateien lesen und die Codebasis durchsuchen.

---

### `/opsx:new`

Legt das Grundgerüst einer neuen Änderung an. Der Befehl erstellt den Änderungsordner und wartet darauf, dass Sie mit `/opsx:continue` oder `/opsx:ff` Artefakte generieren.

Dieser Befehl gehört zum erweiterten Workflow-Satz und ist nicht im standardmäßigen Profil `core` enthalten.

**Syntax:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Name des Änderungsordners (wird abgefragt, wenn nicht angegeben) |
| `--schema` | Nein | Zu verwendendes Workflow-Schema (Standard: aus der Konfiguration oder `spec-driven`) |

**Funktion:**
- Erstellt das Verzeichnis `openspec/changes/<change-name>/`.
- Erstellt im Änderungsordner die Metadatendatei `.openspec.yaml`.
- Zeigt die Vorlage für das erste zur Erstellung bereite Artefakt an.
- Fragt nach Änderungsname und Schema, falls diese nicht angegeben wurden.

**Erstellt folgende Struktur:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**Beispiel:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Tipps:**
- Verwenden Sie aussagekräftige Namen wie `add-feature`, `fix-bug` oder `refactor-module`.
- Vermeiden Sie allgemeine Namen wie `update`, `changes` oder `wip`.
- Das Schema kann auch in der Projektkonfiguration (`openspec/config.yaml`) festgelegt werden.

---

### `/opsx:continue`

Erstellt das nächste Artefakt in der Abhängigkeitskette. Der Befehl erstellt jeweils ein Artefakt und ermöglicht so schrittweisen Fortschritt.

**Syntax:**
```
/opsx:continue [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung fortgesetzt werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Fragt den Abhängigkeitsgraphen der Artefakte ab.
- Zeigt an, welche Artefakte bereit bzw. blockiert sind.
- Erstellt das erste bereite Artefakt.
- Liest Abhängigkeitsdateien als Kontext.
- Zeigt an, was nach der Erstellung verfügbar wird.

**Beispiel:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**Tipps:**
- Verwenden Sie den Befehl, wenn Sie jedes Artefakt vor dem Fortfahren überprüfen möchten.
- Er eignet sich für komplexe Änderungen, bei denen Sie die Kontrolle behalten möchten.
- Mehrere Artefakte können gleichzeitig bereit werden.
- Sie können erstellte Artefakte vor dem Fortfahren bearbeiten.

---

### `/opsx:ff`

Führt schnell durch die Artefakterstellung und erstellt alle Planungsartefakte auf einmal.

**Syntax:**
```
/opsx:ff [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung im Schnellvorlauf bearbeitet werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Erstellt alle Artefakte in Abhängigkeitsreihenfolge.
- Verfolgt den Fortschritt über eine Aufgabenliste.
- Hält an, sobald alle für `apply` erforderlichen Artefakte vollständig sind.
- Liest jede Abhängigkeit, bevor das nächste Artefakt erstellt wird.

**Beispiel:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Tipps:**
- Verwenden Sie den Befehl, wenn Sie genau wissen, was Sie bauen möchten.
- Bei unkomplizierten Änderungen ist er schneller als `/opsx:continue`.
- Sie können Artefakte später weiterhin bearbeiten.
- Er eignet sich für kleine bis mittelgroße Funktionen.

---

### `/opsx:apply`

Implementiert die Aufgaben einer Änderung. Der Befehl arbeitet die Aufgabenliste ab, schreibt Code und hakt erledigte Punkte ab.

**Syntax:**
```
/opsx:apply [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung implementiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Liest `tasks.md` und findet offene Aufgaben.
- Arbeitet die Aufgaben nacheinander ab.
- Schreibt Code, erstellt Dateien und führt bei Bedarf Tests aus.
- Markiert abgeschlossene Aufgaben mit Kontrollkästchen `[x]`.

**Beispiel:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tipps:**
- Bei einer Unterbrechung kann der Befehl dort fortsetzen, wo Sie aufgehört haben.
- Geben Sie den Namen der Änderung an, wenn Sie mit parallelen Änderungen arbeiten.
- Der Abschlussstatus wird in den Kontrollkästchen von `tasks.md` festgehalten.

---

### `/opsx:update`

Überarbeitet vorhandene Planungsartefakte einer Änderung und sorgt für deren Konsistenz. Der Befehl bearbeitet nur Planungsartefakte und niemals Code.

**Syntax:**

```text
/opsx:update [change-name]
```

**Argumente:**

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung aktualisiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**

- Liest die Artefakte der Änderung mit `openspec status --change <name> --json`.
- Wendet die gewünschte Überarbeitung an oder prüft die Artefakte auf Widersprüche, wenn Sie keine konkrete Änderung genannt haben.
- Gleicht andere vorhandene Artefakte in jede Richtung ab (eine Änderung am Entwurf kann sich beispielsweise auf den Vorschlag auswirken).
- Bestätigt jede Änderung vor dem Schreiben einzeln mit Ihnen.
- Empfiehlt als Nächstes `/opsx:continue` (noch nicht begonnene Artefakte), `/opsx:apply` (überarbeiteten Plan in Code umsetzen) oder `/opsx:archive` (alles abgeschlossen).

**Fehlende Dateien:**

- Bei einem Glob-Artefakt wie `specs/**/*.md`, für das mindestens eine Datei vorhanden ist, kann `update` eine fehlende zugehörige Datei vorschlagen. Der Befehl verwendet die Schemaanweisungen und bittet Sie vor der Erstellung um Bestätigung des konkreten Pfads.
- Artefakte, für die es noch keine Dateien gibt, bleiben Sache von `/opsx:continue`. Absichtlich übersprungene Artefakte bleiben unangetastet.
- Neue Dateien müssen im Änderungsverzeichnis liegen. Wenn vor der Erstellung bereits eine Datei am bestätigten Pfad erscheint, hält `update` an, statt sie zu überschreiben.

**Beispiel:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Tipps:**

- Der Befehl beginnt nicht mit einem Artefakt, für das noch keine Dateien vorhanden sind. Verwenden Sie dafür `/opsx:continue` oder, falls dieser optionale Workflow nicht installiert ist, `openspec status` und `openspec instructions`.
- Wenn die Änderung bereits implementiert wurde, führen Sie anschließend `/opsx:apply` aus, damit der Code dem überarbeiteten Plan entspricht.
- Wenn Ihre Überarbeitung die *Absicht* der Änderung verändert, beginnen Sie stattdessen mit einer neuen Änderung (siehe [Wann aktualisieren und wann neu beginnen?](/de-DE/opsx/#wann-aktualisieren-und-wann-neu-beginnen)).

---

### `/opsx:verify`

Prüft, ob die Implementierung den Artefakten Ihrer Änderung entspricht. Bewertet Vollständigkeit, Korrektheit und Konsistenz.

**Syntax:**
```
/opsx:verify [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung überprüft werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Prüft drei Dimensionen der Implementierungsqualität.
- Durchsucht die Codebasis nach Belegen für die Implementierung.
- Meldet Probleme in den Kategorien CRITICAL, WARNING oder SUGGESTION.
- Verhindert das Archivieren nicht, macht aber Probleme sichtbar.

**Prüfdimensionen:**

| Dimension | Prüfumfang |
|-----------|-------------------|
| **Vollständigkeit** | Alle Aufgaben erledigt, alle Anforderungen implementiert und alle Szenarien abgedeckt |
| **Korrektheit** | Implementierung entspricht der Absicht der Spezifikation, Randfälle berücksichtigt |
| **Konsistenz** | Entwurfsentscheidungen spiegeln sich im Code wider, Muster sind einheitlich |

**Beispiel:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tipps:**
- Führen Sie den Befehl vor dem Archivieren aus, um Abweichungen früh zu erkennen.
- Warnungen verhindern das Archivieren nicht, weisen aber auf mögliche Probleme hin.
- Er eignet sich zur Überprüfung der KI-Arbeit vor dem Commit.
- Er kann Abweichungen zwischen Artefakten und Implementierung aufzeigen.

---

### `/opsx:sync`

**Optionaler Befehl.** Führt Delta-Spezifikationen einer Änderung mit den Hauptspezifikationen zusammen. Falls erforderlich, bietet archive die Synchronisierung an; normalerweise müssen Sie diesen Befehl daher nicht manuell ausführen.

**Syntax:**
```
/opsx:sync [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung synchronisiert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Liest Delta-Spezifikationen aus dem Änderungsordner.
- Verarbeitet die Abschnitte ADDED/MODIFIED/REMOVED/RENAMED.
- Führt die Änderungen mit dem Hauptverzeichnis `openspec/specs/` zusammen.
- Bewahrt vorhandene Inhalte, die im Delta nicht erwähnt werden.
- Archiviert die Änderung nicht (sie bleibt aktiv).

**Beispiel:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Wann Sie den Befehl manuell verwenden sollten:**

| Szenario | Sync verwenden? |
|----------|-----------|
| Bei einer lang laufenden Änderung sollen die Spezifikationen vor dem Archivieren in den Hauptzweig übernommen werden. | Ja |
| Mehrere parallele Änderungen benötigen die aktualisierten Hauptspezifikationen als Grundlage. | Ja |
| Sie möchten die Zusammenführung separat in der Vorschau ansehen oder überprüfen. | Ja |
| Schnelle Änderung, die direkt archiviert werden soll. | Nein (archive übernimmt das) |

**Tipps:**
- Sync führt die Spezifikationen intelligent zusammen, statt sie einfach zu kopieren.
- Der Befehl kann Szenarien zu bestehenden Anforderungen hinzufügen, ohne sie zu duplizieren.
- Nach dem Synchronisieren bleibt die Änderung aktiv (sie wird nicht archiviert).
- Die meisten Benutzer müssen den Befehl nie direkt aufrufen – archive fragt bei Bedarf nach.

---

### `/opsx:archive`

Archiviert eine abgeschlossene Änderung. Schließt die Änderung ab und verschiebt sie in den Archivordner.

**Syntax:**
```
/opsx:archive [change-name]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-name` | Nein | Welche Änderung archiviert werden soll (wird aus dem Kontext abgeleitet, falls nicht angegeben) |

**Funktion:**
- Prüft, ob alle Artefakte abgeschlossen sind.
- Prüft den Aufgabenstatus (bei offenen Aufgaben wird eine Warnung ausgegeben).
- Bietet die Synchronisierung der Delta-Spezifikationen an, sofern sie noch nicht synchronisiert wurden.
- Verschiebt den Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/`.
- Bewahrt alle Artefakte zur Nachvollziehbarkeit auf.

**Beispiel:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tipps:**
- Archive verhindert das Archivieren bei offenen Aufgaben nicht, gibt aber eine Warnung aus.
- Delta-Spezifikationen können während des Archivierungsvorgangs oder vorher synchronisiert werden.
- Archivierte Änderungen bleiben als Verlauf erhalten.
- Führen Sie zuerst `/opsx:verify` aus, um Probleme zu erkennen.

---

### `/opsx:bulk-archive`

Archiviert mehrere abgeschlossene Änderungen auf einmal und behandelt Konflikte zwischen ihren Spezifikationen.

**Syntax:**
```
/opsx:bulk-archive [change-names...]
```

**Argumente:**
| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `change-names` | Nein | Bestimmte Änderungen, die archiviert werden sollen (wenn nicht angegeben, werden Sie zur Auswahl aufgefordert) |

**Funktion:**
- Listet alle abgeschlossenen Änderungen auf.
- Validiert jede Änderung vor dem Archivieren.
- Erkennt Konflikte zwischen den Spezifikationen verschiedener Änderungen.
- Löst Konflikte, indem geprüft wird, was tatsächlich implementiert wurde.
- Archiviert Änderungen in chronologischer Reihenfolge.

**Beispiel:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tipps:**
- Eignet sich gut für parallele Arbeitsabläufe.
- Die Konfliktlösung erfolgt agentengesteuert (die Codebasis wird geprüft).
- Änderungen werden in der Reihenfolge ihrer Erstellung archiviert.
- Vor dem Überschreiben von Spezifikationsinhalten wird nachgefragt.

---

### `/opsx:onboard`

Führt Sie mit einem interaktiven Tutorial anhand Ihrer tatsächlichen Codebasis durch den vollständigen OpenSpec-Workflow.

**Syntax:**
```
/opsx:onboard
```

**Funktion:**
- Führt Sie mit Erklärungen durch einen vollständigen Workflow-Zyklus.
- Durchsucht Ihre Codebasis nach tatsächlichen Verbesserungsmöglichkeiten.
- Erstellt eine echte Änderung mit echten Artefakten.
- Implementiert die tatsächliche Arbeit (kleine, sichere Änderungen).
- Archiviert die abgeschlossene Änderung.
- Erläutert jeden Schritt während seiner Ausführung.

**Phasen:**
1. Begrüßung und Analyse der Codebasis
2. Eine Verbesserungsmöglichkeit finden
3. Eine Änderung erstellen (`/opsx:new`)
4. Den Vorschlag verfassen
5. Spezifikationen erstellen
6. Den Entwurf verfassen
7. Aufgaben erstellen
8. Aufgaben implementieren (`/opsx:apply`)
9. Implementierung überprüfen
10. Änderung archivieren
11. Zusammenfassung und nächste Schritte

**Beispiel:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tipps:**
- Am besten für neue Benutzer, die den Workflow kennenlernen möchten.
- Verwendet echten Code statt Spielzeugbeispiele.
- Erstellt eine echte Änderung, die Sie behalten oder verwerfen können.
- Die Durchführung dauert 15 bis 30 Minuten.

---

## Befehlssyntax nach KI-Tool

Verschiedene KI-Tools verwenden leicht unterschiedliche Befehlssyntaxen. Verwenden Sie das für Ihr Tool passende Format:

| Befehlsdatei Ihres Tools | Syntaxbeispiel | Beispieltools |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot (IDE), Trae, Oh My Pi |
| keine – nur Skills | `/openspec-propose`, `/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, gemeinsames `.agents` |
| keine – Kimi Code | `/skill:openspec-propose` | Kimi Code |
| keine – Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop im Vergleich zu Devin Local:** Die Dateien `.devin/workflows/opsx-*.md` stellen
> Devin Desktop `/opsx-propose` bereit. Devin Local unterstützt keine Workflows – verwenden Sie die Skills,
> die OpenSpec unter `.devin/skills/` schreibt, zum Beispiel `/openspec-propose`. Diese funktionieren mit
> beiden Agents.

Die Absicht ist bei allen Tools gleich, aber die Art der Bereitstellung kann sich je nach Integration unterscheiden. Unter [Befehle aufrufen](/de-DE/supported-tools/#befehle-aufrufen) sind alle unterstützten Tools aufgeführt; diese Tabelle zeigt nur Beispiele für die einzelnen Formen.

> **Hinweis:** GitHub-Copilot-Befehle (`.github/prompts/*.prompt.md`) sind nur in IDE-Erweiterungen (VS Code, JetBrains, Visual Studio) verfügbar. GitHub Copilot CLI unterstützt derzeit keine benutzerdefinierten Prompt-Dateien. Details und Alternativen finden Sie unter [Unterstützte Tools](/de-DE/supported-tools/).

---

## Alte Befehle

Diese Befehle verwenden den älteren „Alles-auf-einmal“-Workflow. Sie funktionieren weiterhin, empfohlen werden jedoch die OPSX-Befehle.

| Befehl | Funktion |
|---------|--------------|
| `/openspec:proposal` | Alle Artefakte auf einmal erstellen (proposal, specs, design, tasks) |
| `/openspec:apply` | Änderung implementieren |
| `/openspec:archive` | Änderung archivieren |

**Wann Sie alte Befehle verwenden sollten:**
- Bei bestehenden Projekten, die den alten Workflow verwenden.
- Bei einfachen Änderungen, für die keine schrittweise Artefakterstellung erforderlich ist.
- Wenn Sie den Alles-oder-nichts-Ansatz bevorzugen.

**Zu OPSX migrieren:**
Alte Änderungen können mit OPSX-Befehlen fortgesetzt werden. Die Artefaktstruktur ist kompatibel.

---

## Fehlerbehebung

### „Änderung nicht gefunden“

Der Befehl konnte nicht feststellen, an welcher Änderung gearbeitet werden soll.

**Lösungen:**
- Geben Sie den Namen der Änderung ausdrücklich an: `/opsx:apply add-dark-mode`.
- Prüfen Sie mit `openspec list`, ob der Änderungsordner vorhanden ist.
- Vergewissern Sie sich, dass Sie sich im richtigen Projektverzeichnis befinden.

### „Keine Artefakte bereit“

Alle Artefakte sind entweder abgeschlossen oder werden durch fehlende Abhängigkeiten blockiert.

**Lösungen:**
- Führen Sie `openspec status --change <name>` aus, um die Blockierungen anzuzeigen.
- Prüfen Sie, ob die erforderlichen Artefakte vorhanden sind.
- Erstellen Sie zuerst die fehlenden Abhängigkeitsartefakte.

### „Schema nicht gefunden“

Das angegebene Schema ist nicht vorhanden.

**Lösungen:**
- Listen Sie verfügbare Schemas mit `openspec schemas` auf.
- Prüfen Sie die Schreibweise des Schemanamens.
- Erstellen Sie das Schema, falls es benutzerdefiniert ist: `openspec schema init <name>`.

### Befehle werden nicht erkannt

Das KI-Tool erkennt OpenSpec-Befehle nicht.

**Lösungen:**
- Stellen Sie sicher, dass OpenSpec initialisiert wurde: `openspec init`.
- Generieren Sie Skills neu: `openspec update`.
- Prüfen Sie, ob das Verzeichnis `.claude/skills/` vorhanden ist (bei Claude Code).
- Starten Sie Ihr KI-Tool neu, damit es die neuen Skills lädt.

### Artefakte werden nicht korrekt generiert

Die KI erstellt unvollständige oder fehlerhafte Artefakte.

**Lösungen:**
- Ergänzen Sie den Projektkontext in `openspec/config.yaml`.
- Fügen Sie für spezifische Hinweise Regeln pro Artefakt hinzu.
- Beschreiben Sie die Änderung ausführlicher.
- Verwenden Sie `/opsx:continue` statt `/opsx:ff`, um mehr Kontrolle zu haben.

---

## Nächste Schritte

- [Workflows](/de-DE/workflows/) – Häufige Muster und Einsatz der einzelnen Befehle
- [CLI](/de-DE/cli/) – Terminalbefehle zur Verwaltung und Validierung
- [Anpassung](/de-DE/customization/) – Benutzerdefinierte Schemas und Workflows erstellen
