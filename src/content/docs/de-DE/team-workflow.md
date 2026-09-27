---
title: "OpenSpec im Team"
---

Alles in den anderen Anleitungen funktioniert gleich, ob Sie allein oder in einem Team mit zwanzig Personen arbeiten. Im Team ändern sich eher die Fragen am Rand: Wo liegen die Spezifikationen? Wie überprüfen Teammitglieder einen Plan? Und wie passt das alles in unseren bestehenden Pull-Request-Ablauf?

Die kurze Antwort: Eine Änderung besteht nur aus Dateien, und OpenSpec greift Git nicht an. Es fügt sich also in Ihren bestehenden Workflow ein, statt ihn zu ersetzen. Auf dieser Seite werden bewährte Konventionen erläutert.

## Eine Regel: OpenSpec greift Git nicht an

OpenSpec liest und schreibt einfache Markdown-Dateien unter `openspec/`. Es erstellt in Ihrem Projekt niemals Commits oder Branches und führt weder Push noch Pull aus. Außerdem klont oder synchronisiert es niemals selbstständig einen [Store](/de-DE/stores-beta/user-guide/). Das bedeutet:

- **Sie versionieren `openspec/` wie jeden anderen Quellcode.** Spezifikationen, aktive Änderungen und das Archiv gehören zur Projektgeschichte. (Ja, committen Sie den gesamten Ordner – siehe die [FAQ](/de-DE/faq/#sollte-ich-den-ordner-openspec-in-git-committen).)
- **Eine Änderung ist ein Ordner, den Sie wie Code versionieren.** `openspec/changes/add-dark-mode/` besteht schlicht aus Dateien in einem Branch.
- **Alles Folgende sind Konventionen, keine Vorgaben.** OpenSpec zwingt Sie nicht dazu; der Ablauf passt lediglich gut dazu.

## Der alltägliche Ablauf

Ein bewährter Workflow ordnet jeder Änderung einen Branch und einen Pull Request zu:

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

Plan und Code liegen im selben Branch nebeneinander. Ihre Teammitglieder können beides gemeinsam überprüfen, und auch sechs Monate später erklärt die archivierte Spezifikation noch, warum der Code so aussieht, wie er aussieht.

## Spezifikationen in einem Pull Request überprüfen

Hier zeigt sich der Nutzen für ein Team. Wenn ein PR die Delta-Spezifikation der Änderung enthält, erhält die prüfende Person etwas, das ein reiner Diff nicht bieten kann: **eine verständliche Beschreibung dessen, was die Änderung bewirken soll**, noch bevor sie eine einzige Codezeile liest.

Eine sinnvolle Reihenfolge für die Prüfung:

1. **Lesen Sie `proposal.md`** – werden das richtige Problem und der richtige Umfang behandelt?
2. **Lesen Sie die Delta-Spezifikation unter `specs/`** – ist „fertig“ richtig definiert? (Das ist die zweiminütige [Überprüfung einer Änderung](/de-DE/reviewing-changes/), nun direkt im PR.)
3. **Lesen Sie anschließend den Code-Diff** – erfüllt er genau diese Anforderungen?

Wer mit dem *Ansatz* nicht einverstanden ist, kann das direkt beim Vorschlag anmerken – mit geringem Aufwand, statt die Diskussion über 300 Codezeilen hinweg erneut zu führen. Platzieren Sie die Delta-Spezifikation weit oben in der PR-Beschreibung oder verweisen Sie auf den Änderungsordner, damit die Prüfung dort beginnt.

## Wann archivieren?

Beim Archivieren werden die Deltas einer Änderung in Ihre zentralen `openspec/specs/` übernommen und der Änderungsordner nach `openspec/changes/archive/YYYY-MM-DD-<name>/` verschoben. Da `specs/` die **gemeinsam genutzte maßgebliche Quelle** ist, kommt es im Team auf den Zeitpunkt an. Zwei praktikable Konventionen:

- **Nach dem Merge des PRs archivieren (empfohlen).** Der Branch enthält die aktive Änderung. Sobald er in den Hauptbranch übernommen wurde, archivieren Sie sie dort (häufig mit einem kleinen Folge-Commit oder einer geplanten Bereinigung). So werden die gemeinsam genutzten `specs/` nur durch tatsächlich ausgelieferte Arbeit fortgeschrieben.
- **Im PR archivieren.** Für kleine Teams einfacher: Derselbe PR, der den Code hinzufügt, synchronisiert und archiviert auch die Änderung. Der Nachteil: Der Diff in `specs/` und der Code-Diff werden gemeinsam übernommen, wodurch der PR unübersichtlicher werden kann.

Wählen Sie eine Methode und bleiben Sie dabei. In beiden Fällen prüft `/opsx:archive`, ob alle Aufgaben erledigt sind, und bietet vorher eine Synchronisierung an – damit nichts versehentlich halbfertig übernommen wird.

## Zwei Personen, parallele Änderungen

Da Änderungen in getrennten Ordnern liegen, kommen sie einander nicht in die Quere:

- **Verschiedene Änderungen, verschiedene Personen – kein Problem.** `add-dark-mode` und `rate-limit-login` liegen in unterschiedlichen Ordnern und Branches. Sie beeinflussen einander erst, wenn beide archiviert werden.
- **Eine Änderung, eine verantwortliche Person.** Wenn zwei Personen denselben Änderungsordner bearbeiten, entsteht ein Konflikt wie bei der Bearbeitung derselben Datei. Beschränken Sie eine Änderung auf eine Autorin oder einen Autor oder teilen Sie sie in zwei Änderungen auf (ein weiterer Grund, den Umfang einer Änderung [passend zu bemessen](/de-DE/writing-specs/#den-umfang-der-änderung-passend-bemessen)).
- **Konflikte treten nur in `specs/` auf.** Ändern zwei Änderungen dieselbe Anforderung, entsteht beim Archivieren der zweiten ein Konflikt in `openspec/specs/…/spec.md`. Lösen Sie ihn wie jeden Merge-Konflikt und behalten Sie die Anforderung, die der Realität entspricht. Das kommt selten vor und ist sogar hilfreich: Git zeigt Ihnen damit, dass zwei Änderungen unterschiedlicher Meinung über das Systemverhalten waren.

## Wenn die Planung über ein einzelnes Repository hinausgeht

Alles oben Genannte geht davon aus, dass der Plan im Ordner `openspec/` des Code-Repositorys liegt – und das ist die richtige Standardeinstellung. Wenn Ihre Planung tatsächlich mehrere Repositories oder Teams umfasst – etwa eine Funktion, die drei Services betrifft, oder Anforderungen, die ein Team verwaltet und andere nutzen –, ist dafür die Beta-Funktion **Stores** gedacht. Die Planung erhält ein eigenes Repository, auf das jedes Code-Repository verweisen kann. Beginnen Sie mit dem [Store-Benutzerhandbuch](/de-DE/stores-beta/user-guide/).

## Wie geht es weiter?

- [Änderung überprüfen](/de-DE/reviewing-changes/) – der Prüfdurchlauf, nun direkt in Ihrem PR.
- [Gute Spezifikationen schreiben](/de-DE/writing-specs/) – einschließlich der Frage, wie eine Änderung so bemessen wird, dass sie in einen Branch passt.
- [Store-Benutzerhandbuch](/de-DE/stores-beta/user-guide/) – Planung über mehrere Repositories und Teams hinweg.
