---
title: "Beispiele und Rezepte"
---

Echte Änderungen von Anfang bis Ende. Jedes Rezept zeigt die eingegebenen Befehle und die dazugehörige Ausgabe, damit Sie Ihre Situation einem Muster zuordnen und es übernehmen können. Die Beispiele verwenden die standardmäßigen **core**-Befehle (`propose`, `explore`, `apply`, `update`, `sync`, `archive`). Wo der erweiterte Satz hilfreich ist, wird dies vermerkt.

Zur Erinnerung: Slash-Befehle wie `/opsx:propose` gehören in den **Chat Ihres KI-Assistenten**, `openspec`-Befehle in Ihr **Terminal**. Falls Ihnen das neu ist, lesen Sie zuerst [So funktionieren Befehle](/de-DE/how-commands-work/). In den folgenden Beispielen stehen `You:` und `AI:` für den Chat; Zeilen, die mit `$` beginnen, stammen aus dem Terminal.

> **Sie sind noch nicht sicher, was Sie bauen möchten?** Die meisten Rezepte werden klarer, wenn Sie zunächst mit `/opsx:explore` darüber nachdenken. [Rezept 3](#rezept-3-erkunden-bevor-sie-sich-festlegen) zeigt den Befehl in Aktion; der Leitfaden [Zuerst erkunden](/de-DE/explore/) erklärt den Ansatz ausführlich.

## Rezept 1: Eine kleine Funktion im Schnellverfahren

**Wann Sie es verwenden sollten:** Sie wissen, was Sie möchten, und die Arbeit ist klar begrenzt. Dies ist das am häufigsten verwendete Rezept.

Der gesamte Ablauf umfasst drei Befehle: vorschlagen, umsetzen und archivieren.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lesen Sie nun den Plan. Öffnen Sie den Vorschlag und die Delta-Spezifikation. Genau dafür ist OpenSpec gedacht: eine falsche Annahme zu entdecken, solange sie noch in einem Absatz steht und nicht in 400 Codezeilen. Bearbeiten Sie ein Artefakt direkt, wenn etwas nicht stimmt, und fahren Sie dann fort.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Das war's. Das Abmeldeverhalten ist nun Teil Ihrer Spezifikationen, und die Änderung ist mit ihrem vollständigen Kontext abgelegt.

## Rezept 2: Eine Fehlerbehebung

**Wann Sie es verwenden sollten:** Etwas funktioniert nicht, und Sie möchten die Korrektur als bewusste Verhaltensänderung dokumentieren – nicht als rätselhaften Commit.

Fehlerbehebungen funktionieren genau wie Funktionen. Der Unterschied liegt in der Formulierung des Vorschlags: Beschreiben Sie das *korrekte* Verhalten, nicht einfach nur „Behebe den Fehler“.

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Da die Korrektur als `MODIFIED`-Anforderung mit einem neuen Szenario festgehalten wird, sieht die nächste Person (oder die nächste KI-Sitzung) nicht nur, dass Sie etwas behoben haben, sondern auch, was „korrekt“ bedeutet. Führen Sie anschließend wie gewohnt `/opsx:apply` und `/opsx:archive` aus.

Tipp: Bei einer Korrektur entspricht ein gutes Szenario dem Regressionstest in Prosa: „GIVEN eine abgemeldete Person, WHEN sie gültige Anmeldedaten eingibt, THEN gelangt sie zum Dashboard und wird nicht erneut weitergeleitet.“ So hat die Implementierung ein klares Ziel.

## Rezept 3: Erkunden, bevor Sie sich festlegen

**Wann Sie es verwenden sollten:** Sie haben ein Problem, aber noch keinen Plan. Sie wissen nicht genau, was Sie bauen oder welcher Ansatz der richtige ist.

Beginnen Sie mit `/opsx:explore`. Der Befehl ist ein Denkpartner ohne starre Struktur. Er schreibt niemals Code und sonst nichts, sofern Sie ihn nicht bitten, Ihre Entscheidung festzuhalten, oder sein Angebot annehmen. Er liest Ihre Codebasis und hilft Ihnen bei der Entscheidung.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Die Erkundung klärt Ihre Gedanken, *bevor* Sie eine Änderung dafür anlegen. Sobald sich eine Erkenntnis herauskristallisiert, erstellen Sie den Vorschlag; die KI übernimmt den Kontext.

## Rezept 4: Zwei Änderungen gleichzeitig verwalten

**Wann Sie es verwenden sollten:** Sie arbeiten gerade an einer Funktion, müssen aber eine dringende Korrektur vorziehen.

Änderungen liegen in getrennten Ordnern, sodass parallele Arbeit keine Konflikte verursacht. Beginnen Sie mit der Korrektur, liefern Sie sie aus und kehren Sie dann genau an der Stelle zur Funktion zurück, an der Sie aufgehört haben.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Wenn mehr als eine Änderung aktiv ist, geben Sie mit `/opsx:apply add-dark-mode` den Namen der Änderung an, die die KI bearbeiten soll. Da der Fortschritt der Aufgaben in `tasks.md` festgehalten wird, weiß die KI genau, wo Sie aufgehört haben.

Wenn mehrere Änderungen gleichzeitig abgeschlossen sind, archiviert der erweiterte Befehl `/opsx:bulk-archive` sie gemeinsam und löst Spezifikationskonflikte anhand der tatsächlichen Implementierung. Siehe [Workflows](/de-DE/workflows/#parallele-änderungen).

## Rezept 5: Ein Refactoring ohne Verhaltensänderung

**Wann Sie es verwenden sollten:** Sie strukturieren Code um, das äußerlich sichtbare Verhalten soll aber unverändert bleiben.

Das ist ein interessanter Fall, denn bei einem reinen Refactoring gibt es *nichts, was Sie zu Ihren Spezifikationen hinzufügen könnten*. Der Verhaltensvertrag bleibt unverändert; nur die Implementierung ändert sich. Daher werden die Arbeitsschritte im Entwurf und in den Aufgaben festgehalten, während das Spezifikationsdelta leer bleibt oder ganz fehlt.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Kennzeichnen Sie das leere Delta ausdrücklich, indem Sie in der `.openspec.yaml` der Änderung `skip_specs: true` festlegen:

```yaml
schema: spec-driven
skip_specs: true
```

Ohne diese Kennzeichnung weist `openspec validate` eine Änderung ohne Deltas zurück (so fällt auch eine versehentlich ausgelassene Spezifikationsphase auf). Mit ihr ist die Validierung erfolgreich und `openspec status` zeigt die Spezifikationsphase ausdrücklich als übersprungen statt als ausstehend an. Falls das Refactoring doch das Verhalten ändert, entfernen Sie `skip_specs` aus `.openspec.yaml` und verfassen Sie die Delta-Spezifikationen. Die Validierung wertet eine Kennzeichnung zusammen mit Spezifikationsdateien als Konflikt, sodass eine veraltete Markierung nicht unbemerkt bestehen bleibt.

Eine markierte Änderung kann ohne zusätzliche Flags archiviert werden (es gibt keine Deltas zum Zusammenführen). Unabhängig davon weist das Flag `--skip-specs` den Terminalbefehl ausdrücklich an, den Spezifikationsschritt zu überspringen:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Dasselbe Flag ist für Tools, CI und reine Dokumentationsänderungen praktisch. Das Prinzip: Spezifikationen beschreiben Verhalten. Wenn sich das Verhalten nicht geändert hat, sollte sich auch die Spezifikation nicht ändern. Siehe [Konzepte](/de-DE/concepts/#was-eine-spezifikation-ist--und-was-nicht).

## Rezept 6: Schrittweise Steuerung (erweiterte Befehle)

**Wann Sie es verwenden sollten:** Bei einer komplexen oder riskanten Änderung möchten Sie jedes Artefakt überprüfen, bevor Sie fortfahren.

Der Core-Befehl `/opsx:propose` entwirft alles auf einmal. Wenn Sie lieber Schritt für Schritt vorgehen möchten, aktivieren Sie die erweiterten Befehle:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Nun können Sie die Änderung schrittweise einrichten und ausarbeiten:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Überprüfen Sie jedes Artefakt, sobald es erstellt wurde, bearbeiten Sie es nach Belieben und machen Sie weiter, wenn Sie zufrieden sind. Wenn Sie den Rest auf einmal entwerfen möchten, arbeitet `/opsx:ff` die noch fehlenden Planungsartefakte automatisch ab. Vor dem Archivieren prüft `/opsx:verify`, ob die Implementierung tatsächlich den Spezifikationen entspricht. Siehe [Workflows](/de-DE/workflows/#opsxff-im-vergleich-zu-opsxcontinue).

## Rezept 7: Den gesamten Ablauf praktisch kennenlernen

**Wann Sie es verwenden sollten:** Sie haben OpenSpec installiert und möchten den Workflow mit Ihrem eigenen Code *erleben* – nicht anhand eines Spielzeugbeispiels.

Aktivieren Sie die erweiterten Befehle (siehe Rezept 6) und führen Sie dann Folgendes aus:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` findet eine echte (kleine) Verbesserung, erstellt eine Änderung dafür, implementiert sie und archiviert sie. Dabei werden alle Schritte erklärt. Der Vorgang dauert 15 bis 30 Minuten und hinterlässt eine echte Änderung, die Sie behalten oder verwerfen können. So gelingt der Einstieg besonders einfach. Siehe [Befehle](/de-DE/commands/#opsxonboard).

## Ihre Arbeit im Terminal überprüfen

Sie können den aktuellen Stand jederzeit im Terminal prüfen:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Diese Befehle dienen zum Lesen und Überprüfen. Vorschläge und Implementierungen erfolgen weiterhin über Slash-Befehle im Chat. Ausführliche Informationen finden Sie in der [CLI-Referenz](/de-DE/cli/).

## Wie geht es weiter?

- [Zuerst erkunden](/de-DE/explore/): der empfohlene Einstieg, wenn Sie unsicher sind
- [Workflows](/de-DE/workflows/): die obigen Muster mit Hinweisen zur Auswahl des passenden Ablaufs
- [Befehle](/de-DE/commands/): alle Slash-Befehle ausführlich erklärt
- [Erste Schritte](/de-DE/getting-started/): die grundlegende Anleitung für die erste Änderung
- [Konzepte](/de-DE/concepts/): warum die einzelnen Bestandteile so zusammenpassen
