---
title: "Kernkonzepte im Überblick"
---

**OpenSpec ist eine schlanke Vereinbarungsebene zwischen Ihnen und Ihrer KI.** Sie halten fest, was eine Änderung bewirken soll, die KI entwirft die Einzelheiten, und Sie beide sehen sich denselben Plan an, bevor Code geschrieben wird. Diese Seite fasst das gesamte Denkmodell auf einen Blick zusammen. Ausführlicher wird es unter [Konzepte](/de-DE/concepts/).

Die ganze Idee in fünf Worten: **erst abstimmen, dann zuversichtlich umsetzen.**

## Die fünf Grundgedanken

OpenSpec baut vollständig auf fünf Konzepten auf. Wenn Sie diese kennen, sind die übrigen Einzelheiten schnell verstanden.

**1. Spezifikationen bilden die Wahrheit ab.** Eine Spezifikation beschreibt, wie sich Ihr System *jetzt gerade* verhält. Sie liegt unter `openspec/specs/` und ist nach Domänen gegliedert (`auth/`, `payments/`, `ui/`). Spezifikationen bestehen aus Anforderungen („Das System SHALL Sitzungen nach 30 Minuten ablaufen lassen“) und Szenarien (konkreten GIVEN/WHEN/THEN-Beispielen). Betrachten Sie Spezifikationen als die gemeinsam vereinbarte Antwort auf die Frage: „Was tut diese Software?“

**2. Eine Änderung ist eine Arbeitseinheit.** Wenn Sie Verhalten hinzufügen, ändern oder entfernen möchten, erstellen Sie eine Änderung: einen Ordner unter `openspec/changes/`, in dem alle zugehörigen Informationen zusammenliegen. Ein Vorschlag, ein Entwurf, eine Aufgabenliste und die Spezifikationsänderungen. Eine Änderung, ein Ordner, eine Funktion.

**3. Delta-Spezifikationen beschreiben die Änderungen, nicht die ganze Welt.** Innerhalb einer Änderung schreiben Sie nicht die gesamte Spezifikation neu. Sie verfassen ein kleines Delta: Diese Anforderung wurde `ADDED`, jene `MODIFIED`, eine andere `REMOVED`. Dadurch eignet sich OpenSpec auch für die Weiterentwicklung bestehender Systeme und nicht nur für neue Projekte. Sie beschreiben den Diff, nicht den Endzustand.

**4. Artefakte bauen aufeinander auf.** Eine Änderung enthält einige Dokumente, die in einer natürlichen Reihenfolge erstellt werden und jeweils in das nächste einfließen:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Sie können jederzeit zu jedem dieser Dokumente zurückkehren. Sie ermöglichen den nächsten Schritt, statt ihn zu erzwingen. (Weiter unten erfahren Sie mehr dazu.)

**5. Beim Archivieren fließt die Änderung zurück in die maßgebliche Spezifikation.** Wenn die Arbeit abgeschlossen ist, archivieren Sie die Änderung. Ihre Delta-Spezifikationen werden mit den Hauptspezifikationen zusammengeführt, und der Änderungsordner wird mit Datumsstempel nach `changes/archive/` verschoben. Nun beschreiben Ihre Spezifikationen die neue Realität, und Sie können mit der nächsten Änderung beginnen. Der Kreislauf ist geschlossen.

## Das Ganze im Bild

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Zwei Ordner. `specs/` enthält den aktuellen Stand. `changes/` enthält Ihre Vorschläge. Beim Archivieren wird ein Vorschlag in den maßgeblichen Stand übernommen.

## Der tatsächliche Ablauf

In der Standardeinrichtung sieht Ihr Ablauf so aus. Denken Sie optional zuerst darüber nach; dann entwirft ein Befehl den Plan, Sie lesen ihn, der nächste setzt ihn um und der letzte legt ihn ab.

```text
/opsx:explore                   →  (optional) think it through with the AI first
/opsx:propose add-dark-mode     →  AI drafts proposal, specs, design, tasks
        (you read and adjust the plan)
/opsx:apply                     →  AI builds it, checking off tasks
/opsx:archive                   →  specs updated, change archived
```

**Beginnen Sie im Zweifel mit dem Erkunden.** `/opsx:explore` ist ein Denkpartner ohne Verpflichtungen: Der Befehl liest Ihren Code, zeigt Optionen auf und wandelt eine vage Idee in einen konkreten Plan um, bevor Code geschrieben wird. Das ist das beste Gegenmittel gegen eine KI, die sonst aufgrund einer ungenauen Eingabe einfach *irgendetwas* baut. Wissen Sie bereits genau, was Sie möchten? Dann fahren Sie direkt mit `/opsx:propose` fort. In jedem Fall ist „Explore“ im Standardprofil enthalten und immer verfügbar. Siehe den [Leitfaden zum Erkunden](/de-DE/explore/).

Das sind Slash-Befehle, die Sie im Chat Ihres KI-Assistenten eingeben. Die Einrichtung (`openspec init`) erfolgt im Terminal. Wenn diese Trennung neu für Sie ist, lesen Sie zuerst [So funktionieren Befehle](/de-DE/how-commands-work/); sie ist die häufigste Ursache für Verwirrung.

## „Ermöglicher statt Schranken“

Diese Formulierung taucht überall in OpenSpec auf. Hier erfahren Sie, was sie konkret bedeutet.

Traditionelle Spezifikationsprozesse sind Wasserfallmodelle: Zuerst wird die Planung abgeschlossen, *danach* darf implementiert werden, und ein Zurück ist mühsam. OpenSpec lehnt das ab. Die Reihenfolge `proposal → specs → design → tasks` zeigt, was als Nächstes *möglich* wird, nicht, wozu Sie als Nächstes *gezwungen* sind.

Stellen Sie während der Implementierung fest, dass der Entwurf falsch war? Bearbeiten Sie `design.md` und machen Sie weiter. Merken Sie, dass der Umfang kleiner sein sollte? Aktualisieren Sie den Vorschlag. Nichts wird festgeschrieben. Die Abhängigkeiten stellen lediglich sicher, dass die KI den nötigen Kontext hat (ohne Spezifikationen als Grundlage lassen sich keine guten Aufgaben verfassen); sie schränken Sie nicht ein.

Die Stärke dieses Ansatzes ist seine Ehrlichkeit: Die Arbeit ist in der Realität unübersichtlich und iterativ, und OpenSpec lässt das zu. Der Preis dafür ist Disziplin: Weil Sie nichts zum nächsten Schritt zwingt, müssen Sie selbst darauf achten, eine Änderung gezielt zu halten, statt sie ausufern zu lassen. Gute Praktiken dafür finden Sie im Leitfaden zu [Workflows](/de-DE/workflows/).

## Warum sich der geringe Mehraufwand lohnt

Ganz offen: OpenSpec fügt einen Schritt hinzu. Vor der Umsetzung schreiben Sie einen kurzen Plan. Was gewinnen Sie dadurch?

- **Sie erkennen Fehlentwicklungen, bevor sie teuer werden.** Ein Missverständnis in einem ein Absatz langen Vorschlag zu korrigieren, kostet nichts. Nachdem die KI 400 Zeilen geschrieben hat, sieht das anders aus.
- **Plan und Code bleiben im selben Repository.** Sechs Monate später erklärt Ihnen (und der nächsten KI-Sitzung) die Spezifikation, warum das System so funktioniert.
- **Änderungen lassen sich überprüfen.** Ein Änderungsordner ist ein übersichtliches Paket: Vorschlag lesen, Deltas überfliegen, Aufgaben prüfen. Keine Archäologie in der Chat-Historie.
- **Es passt zu bestehenden Codebasen.** Dank Deltas können Sie eine Änderung an einer Anwendung mit 50.000 Zeilen spezifizieren, ohne vorher das ganze System dokumentieren zu müssen.

Und der ehrliche Nachteil: Für eine wirklich triviale Korrektur in einer Zeile lohnt sich der Aufwand möglicherweise nicht – das ist in Ordnung. OpenSpec ist leichtgewichtig, aber nicht kostenlos. Verwenden Sie es dort, wo eine gemeinsame Abstimmung wichtig ist. Mit einer KI, die jede vage Anfrage selbstbewusst umsetzt, ist das meistens der Fall.

## Wie geht es weiter?

- Neu hier? [Erste Schritte](/de-DE/getting-started/) führt Sie vollständig durch Ihre erste Änderung.
- Sie wissen noch nicht, was Sie bauen möchten? Beginnen Sie mit [Erst erkunden](/de-DE/explore/).
- Sie sind unsicher, wo Befehle ausgeführt werden? [So funktionieren Befehle](/de-DE/how-commands-work/).
- Möchten Sie alles oben Genannte ausführlich erklärt bekommen? [Konzepte](/de-DE/concepts/).
- Lernen Sie am liebsten anhand von Beispielen? [Beispiele und Rezepte](/de-DE/examples/).
- Möchten Sie einen Begriff nachschlagen? [Glossar](/de-DE/glossary/).
