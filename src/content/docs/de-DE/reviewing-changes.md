---
title: "Änderungen überprüfen"
---

Das Versprechen von OpenSpec ist, dass Sie und Ihre KI sich **vor dem Schreiben von Code darauf einigen, was gebaut werden soll.** Diese Vereinbarung ist nur dann etwas wert, wenn Sie tatsächlich lesen, was die KI entworfen hat. Auf dieser Seite geht es um die zwei Minuten, in denen Sie das tun: Was Sie öffnen, in welcher Reihenfolge und worauf Sie achten sollten.

Die Rechnung ist einfach: Eine Fehlentwicklung in einem ein Absatz langen Plan zu erkennen, kostet fast nichts. Dieselbe Fehlentwicklung in 300 Codezeilen zu erkennen, kostet deutlich mehr. Bei der Überprüfung zahlt sich diese Rechnung aus.

## Die zwei Zeitpunkte für eine Überprüfung

Es gibt genau zwei:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Nach `/opsx:propose`** (oder `/opsx:ff`), vor `/opsx:apply` – lesen Sie den Plan, solange er noch aus Worten besteht.
2. **Nach der Umsetzung**, mit `/opsx:verify` – prüfen Sie, ob der Code tatsächlich das tut, was im Plan steht.

Die erste Überprüfung spart am meisten, wird aber am häufigsten übersprungen. Deshalb widmet sich diese Seite hauptsächlich ihr.

## In dieser Reihenfolge lesen

Eine Änderung ist ein Ordner mit einfachen Markdown-Dateien unter `openspec/changes/<name>/`. Lesen Sie die Dateien so, dass Sie bei Problemen möglichst früh aufhören können:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

Sie müssen nicht jede Zeile lesen. Sie müssen drei Fragen beantworten, eine pro Datei.

## Der Vorschlag: Wird das richtige Problem behandelt?

Öffnen Sie zuerst `proposal.md`. Die Datei hält in ein oder zwei Absätzen das „Warum“ und „Was“ fest – die Absicht, den Umfang und den Ansatz.

**Woran Sie einen guten Vorschlag erkennen:** eine klare Absicht, ein nachvollziehbarer Umfang und ein Grund dafür, warum sich die Arbeit jetzt lohnt.

**Warnzeichen:**

- Er löst ein leicht *anderes* Problem als das, um das Sie gebeten haben.
- Der Umfang ist gewachsen: Sie baten um einen Theme-Schalter, und der Vorschlag ändert „wo wir schon dabei sind“ auch die Authentifizierung.
- Er ist vage. „Die Einstellungsseite verbessern“ ist kein klarer Umfang; „einen Dunkelmodus-Schalter hinzufügen, der die Betriebssystemeinstellung berücksichtigt“ schon.

**Die entscheidende Frage:** *Entspricht das meiner tatsächlichen Anfrage, und hat sich etwas Zusätzliches eingeschlichen?* Wenn die Antwort „Nein“ lautet, halten Sie hier an. Lesen Sie nicht weiter, sondern korrigieren Sie den Vorschlag (siehe [Widerspruch kostet wenig](#widerspruch-kostet-wenig)).

## Die Delta-Spezifikationen: Ist „fertig“ richtig definiert?

Das ist der Kern der Überprüfung. Die Delta-Spezifikationen unter `specs/` beschreiben anhand von Anforderungen und zugehörigen Szenarien, was nach der Auslieferung der Änderung *zutreffen* soll:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Woran Sie eine gute Anforderung erkennen:** eine klare `SHALL`/`MUST`-Aussage, die Sie einer Testperson geben könnten, und mindestens ein Szenario, dessen GIVEN/WHEN/THEN diese Aussage tatsächlich überprüft.

**Warnzeichen:**

- **Eine vage Anforderung.** „Das System SHALL schnell sein“ lässt sich weder umsetzen noch testen. Was bedeutet „schnell“?
- **Eine Anforderung ohne Szenario** oder ein Szenario, das die zugehörige Anforderung nicht testet.
- **Der wichtigste Fund von allen: Was fehlt?** Die KI hält zuverlässig fest, was Sie *gesagt* haben. Ihre Aufgabe ist es, zu erkennen, was Sie *nicht erwähnt* haben. Wenn Ihnen der Fall mit der Betriebssystemeinstellung am wichtigsten ist und ihn kein Szenario erwähnt, hat sich die Überprüfung bereits bezahlt gemacht.

Lesen Sie die Deltas mit der Frage: *Wäre ich zufrieden, wenn das System genau das – und nur das – tun würde?* Hier geht es noch nicht um Code, daher lassen sich Änderungen weiterhin günstig vornehmen.

## Die Aufgaben: Ist der Arbeitsplan sinnvoll?

Öffnen Sie zuletzt `tasks.md`. Die Datei enthält die Checkliste, nach der die KI bei der Implementierung vorgeht.

**Woran Sie einen guten Plan erkennen:** geordnete Schritte, die sich jeweils einer Anforderung zuordnen lassen, ohne rätselhafte Punkte.

**Warnzeichen:**

- Eine Aufgabe ohne passende Anforderung (wo kommt sie her?).
- Eine einzige riesige Aufgabe „Funktion implementieren“, hinter der sich alle eigentlichen Entscheidungen verbergen.
- Eine Aufgabe, die etwas außerhalb des gerade genehmigten Umfangs betrifft.

Hier geht es weder um Aufwandsschätzung noch um Mikromanagement. Sie prüfen, ob der Plan den bereits akzeptierten Anforderungen entspricht.

## Widerspruch kostet wenig

Wenn eine der drei Fragen falsch beantwortet wurde, sprechen Sie es an. Es gibt keine Phasen und nichts ist festgeschrieben – korrigieren Sie es und machen Sie weiter. Dafür gibt es genau wie beim [Bearbeiten einer Änderung](/de-DE/editing-changes/) zwei Möglichkeiten:

- **Bearbeiten Sie die Datei selbst.** Sie enthält einfaches Markdown. Ändern Sie die Zeile zum Umfang, präzisieren Sie eine Anforderung oder löschen Sie eine Aufgabe.
- **Erklären Sie der KI, was nicht stimmt,** und lassen Sie sie den Text überarbeiten: *„Lass die Authentifizierungsänderungen weg – sie gehören nicht zum Umfang“,* *„Füge ein Szenario für den Fall hinzu, dass die Person bereits ein Theme gewählt hat“,* *„Teile Aufgabe 3 in Schema und Benutzeroberfläche auf.“*

Lesen Sie anschließend den geänderten Teil erneut. Überarbeiten Sie den Entwurf, bis es ein Plan ist, unter den Sie Ihren Namen setzen würden. Dieses Hin und Her *ist* das Produkt in Aktion.

## Nach dem Code: überprüfen

Nach der Umsetzung ist `/opsx:verify` Ihre zweite Überprüfung. Der Befehl liest die Artefakte und den Code erneut und meldet Abweichungen in drei Dimensionen:

| Dimension | Prüfung |
|-----------|----------------|
| **Vollständigkeit** | Alle Aufgaben sind erledigt, alle Anforderungen umgesetzt und Szenarien abgedeckt |
| **Korrektheit** | Die Implementierung entspricht der Absicht der Spezifikation, Randfälle sind berücksichtigt |
| **Konsistenz** | Die Entwurfsentscheidungen spiegeln sich tatsächlich im Code wider |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Der Befehl kennzeichnet Probleme als CRITICAL, WARNING oder SUGGESTION und verhindert **nicht** das Archivieren. Er macht Lücken sichtbar und überlässt die Entscheidung Ihnen. Das ist der Unterschied zwischen „Hat die KI Code geschrieben?“ und „Hat sie umgesetzt, worauf wir uns geeinigt haben?“

`/opsx:verify` ist im erweiterten Profil enthalten. Falls der Befehl bei Ihnen fehlt, aktivieren Sie ihn mit `openspec config profile` (und anschließend `openspec update`) oder lesen Sie die Änderung und den Diff selbst noch einmal durch.

## Den Umfang der Überprüfung passend bemessen

Nicht jede Änderung erfordert die vollständige Überprüfung. Eine Tippfehlerkorrektur in einer Datei verdient einen kurzen Blick von zwanzig Sekunden. Eine Änderung an Authentifizierung, Zahlungen oder nicht wiederherstellbaren Daten verdient jede Frage oben. Es ging nie um Formalitäten, sondern darum, Ihre Aufmerksamkeit dort einzusetzen, wo Fehler teuer wären, und dort nur zu überfliegen, wo sie es nicht wären.

## Checkliste für die zwei Minuten

- [ ] Die Absicht des Vorschlags entspricht meiner Anfrage.
- [ ] Der Umfang enthält nichts Unerwartetes.
- [ ] Jede Anforderung ist konkret genug, um sie testen zu können.
- [ ] Jede Anforderung hat ein Szenario, das sie tatsächlich prüft.
- [ ] Der mir wichtigste Fall ist abgedeckt.
- [ ] Die Aufgaben sind den Anforderungen zugeordnet; nichts ist rätselhaft oder außerhalb des Umfangs.
- [ ] Es wäre für mich in Ordnung, wenn die KI genau das und nichts Weiteres umsetzt.

Wenn alle sieben Punkte erfüllt sind, können Sie `/opsx:apply` zuversichtlich ausführen. Falls einer nicht erfüllt ist, ist das kein Rückschlag – die zwei Minuten haben ihren Zweck erfüllt.

## Wie geht es weiter?

- [Gute Spezifikationen schreiben](/de-DE/writing-specs/) – die andere Seite: Anforderungen und Szenarien entwerfen, die eine Freigabe verdienen.
- [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/) – wie Sie einen Plan nach Beginn der Umsetzung ändern.
- [Workflows](/de-DE/workflows/) – wie die Überprüfung in den gesamten Ablauf passt.
