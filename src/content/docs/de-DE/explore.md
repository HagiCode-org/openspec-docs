---
title: "Zuerst erkunden"
---

**`/opsx:explore` ist Ihr Denkpartner. Nutzen Sie den Befehl, sobald Sie ein Problem, aber noch keinen Plan haben.** Er untersucht Ihre Codebasis, wägt mit Ihnen Optionen ab und klärt, was Sie tatsächlich möchten – bevor eine einzige Codezeile geschrieben wird. Sobald das Bild klar ist, übergibt er an `/opsx:propose`.

Wenn Sie sich nur eine Gewohnheit aus dieser Dokumentation aneignen, dann diese: **Erkunden Sie zuerst, wenn Sie sich nicht sicher sind.**

Und das ist wichtig, weil KI-Codierassistenten gern sofort loslegen. Fragen Sie vage, bauen sie selbstbewusst *irgendetwas* – vielleicht aber nicht das, was Sie brauchen. „Explore“ hilft dagegen. In diesem Gespräch ohne Verpflichtungen finden Sie und die KI gemeinsam den richtigen Weg. So schlagen Sie später auch wirklich das Richtige vor.

## Wann sollten Sie erkunden?

„Explore“ ist öfter der richtige erste Schritt, als viele denken. Nutzen Sie den Befehl, wenn einer dieser Punkte zutrifft:

- Sie kennen das *Problem*, aber nicht die *Lösung*. („Seiten wirken langsam.“ „Die Authentifizierung ist ein Durcheinander.“ „Wir erhalten ständig doppelte Bestellungen.“)
- Sie wählen zwischen mehreren Ansätzen und möchten die jeweiligen Vor- und Nachteile anhand Ihres tatsächlichen Codes abwägen.
- Sie sind neu in einer Codebasis und möchten vor einer Änderung verstehen, wie etwas funktioniert.
- Die Anforderungen sind vage und Sie möchten sie präzisieren, bevor Sie sich festlegen.
- Sie vermuten, dass der Arbeitsumfang größer oder kleiner ist als er scheint, und möchten ihn realistisch einschätzen.

Überspringen Sie „Explore“ nur, wenn Sie bereits genau wissen, was und wie Sie es möchten. In diesem Fall können Sie direkt zu [`/opsx:propose`](/de-DE/commands/#opsxpropose) wechseln.

## Was der Befehl tut – und was nicht

„Explore“ ist ein **Gespräch**, kein Generator.

**Der Befehl kann:**
- Ihre Codebasis lesen und durchsuchen, um konkrete Fragen zu beantworten.
- Optionen vergleichen und ihre jeweiligen Vor- und Nachteile benennen.
- Diagramme zeichnen, um einen Entwurf verständlicher zu machen.
- Eine vage Idee auf einen konkreten, umsetzbaren Umfang eingrenzen.
- Die Erkundung festhalten, wenn Sie darum bitten oder sein Angebot annehmen: Er richtet die Änderung mit `openspec new change` ein und schreibt die von Ihnen genannten Planungsartefakte oder aktualisiert die Artefakte einer bestehenden Änderung.
- Zu `/opsx:propose` überleiten, wenn Sie bereit sind.

**Der Befehl kann nicht:**
- Code schreiben oder ändern. „Explore“ schreibt niemals Code, auch nicht beim Festhalten der Erkundung.
- Ihre Schemas oder Vorlagen entwerfen oder bearbeiten. Diese auszugestalten ist eine Änderung, kein Nachdenken.
- Selbstständig eine Änderung beginnen oder ein Artefakt verfassen. Ohne Ihre Aufforderung oder Zustimmung zu seinem Angebot schreibt der Befehl nichts. Danach schreibt er nur, was Sie vereinbart haben, sowie die erforderlichen Einrichtungsdateien für eine Änderung (siehe unten).
- Sie zum Festhalten der Erkundung drängen. Der Befehl bietet es an, wenn sich Ihre Überlegungen konkretisieren; Sie entscheiden.

Genau darum geht es: Erkunden kostet Sie nichts und verpflichtet Sie zu nichts, bis Sie zustimmen. Sie können drei Sackgassen erkunden, aus jeder etwas lernen und erst dann den Weg vorschlagen, der sich bewährt hat.

## Der Befehl ist bereits verfügbar

Gute Nachrichten: `/opsx:explore` ist bereits im standardmäßigen **core**-Profil enthalten – zusammen mit `propose`, `apply`, `update`, `sync` und `archive`. Sie müssen nichts aktivieren. Wenn OpenSpec in Ihrem Projekt eingerichtet ist, können Sie den Befehl im KI-Chat verwenden. (Wie alle `/opsx:*`-Befehle wird er im Chat Ihres Assistenten eingegeben, nicht im Terminal. Siehe [So funktionieren Befehle](/de-DE/how-commands-work/).)

## Ein vollständiges Beispiel

Sehen Sie, wie aus einer vagen Sorge eine klar umrissene, umsetzbare Änderung wird.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Beachten Sie, was passiert ist: Der Ausgangspunkt war „Etwas stimmt nicht, und ich traue mich nicht, es anzufassen.“ Zwanzig Sekunden Erkundung führten zu einer benannten Ursache, drei nach Priorität geordneten Optionen, einer auf den vorhandenen Code abgestimmten Empfehlung und einer präzisen Änderung. Der anschließende Vorschlag ist klar, weil zuerst nachgedacht wurde.

## An „Propose“ übergeben

„Explore“ archiviert nichts. Wenn Sie bereit sind, beginnen Sie einfach eine Änderung. Die KI übernimmt den Kontext aus Ihrem Gespräch in die Artefakte.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Sie können es in natürlicher Sprache sagen („Lass uns daraus eine Änderung machen“) oder direkt `/opsx:propose <name>` ausführen. In beiden Fällen bildet die gerade abgeschlossene Erkundung die Grundlage des Vorschlags und bleibt nicht bloß im Chat zurück.

Sie können „Explore“ auch bitten, die Änderung direkt im Gespräch festzuhalten: „Beginne dafür eine Änderung“ richtet den Ordner ein, und „Schreibe auch den Vorschlag“ erstellt genau die von Ihnen genannten Artefakte. Beim Einrichten werden außerdem die Metadaten der Änderung angelegt und fehlende Dateien oder Ordner auf oberster Ebene ergänzt (`openspec/specs/`, `openspec/changes/archive/`, eine `config.yaml`).

Das führt zum selben Ergebnis wie die Übergabe, mit einem Unterschied: „Propose“ erstellt alle Artefakte, die Ihr Schema für den Weg bis zur Implementierung benötigt. Beim Festhalten werden nur die von Ihnen genannten Artefakte geschrieben.

Wenn Sie den erweiterten Befehlssatz verwenden, kann „Explore“ stattdessen an `/opsx:new` übergeben, um die Artefakte Schritt für Schritt zu erstellen. Siehe [Workflows](/de-DE/workflows/).

## Tipps für eine gute Erkundung

- **Nennen Sie das Problem, nicht die Lösung.** „Anmeldungen wirken langsam“ lässt der KI Raum für Untersuchungen. „Füge einen Redis-Cache hinzu“ legt Sie auf eine noch ungeprüfte Lösung fest.
- **Fragen Sie ausdrücklich nach den Vor- und Nachteilen.** „Welche Nachteile hat jede Option?“ führt zu einem ehrlicheren Vergleich.
- **Lassen Sie die KI zuerst nachsehen.** Die besten Erkundungen beginnen damit, dass die KI sich den Code tatsächlich ansieht, statt zu raten. Weisen Sie sie bei Bedarf auf den relevanten Bereich hin.
- **Sie können jederzeit abbrechen.** Ergibt die Erkundung, dass sich die Idee nicht lohnt, ist das ein Erfolg. Sie haben es auf günstige Weise herausgefunden.
- **Erkunden Sie während einer Änderung erneut.** Sie kommen bei `/opsx:apply` nicht weiter? Treten Sie einen Schritt zurück, erkunden Sie ein Teilproblem und fahren Sie anschließend fort.

## Eine ehrliche Abwägung

**Ihr Gewinn:** „Explore“ erkennt Fehlentwicklungen zum frühestmöglichen und günstigsten Zeitpunkt, bevor Sie sich auf etwas festgelegt haben. Besonders hilfreich ist der Befehl bei unbekanntem Code, denn die KI kann das System lesen und zusammenfassen – und Ihnen so einen Nachmittag voller mühsamer Erkundungen ersparen.

**Der Aufwand:** ein wenig Geduld. „Explore“ ist ein Gespräch und daher langsamer, als `/opsx:propose` aufzurufen und auf das Beste zu hoffen. Wenn Sie die Arbeit wirklich bereits verstehen, ist dieser zusätzliche Schritt unnötiger Aufwand, und Sie sollten ihn überspringen.

Als Faustregel gilt: Je unklarer die Aufgabe, desto mehr lohnt sich „Explore“. Je klarer die Aufgabe, desto eher können Sie direkt mit dem Vorschlag beginnen.

## Wie geht es weiter?

- [Befehle: `/opsx:explore`](/de-DE/commands/#opsxexplore): die genaue Referenz
- [Workflows](/de-DE/workflows/): Erkunden als Teil des alltäglichen Ablaufs
- [Beispiele und Rezepte](/de-DE/examples/#rezept-3-erkunden-bevor-sie-sich-festlegen): eine vollständige Anleitung zum Erkunden
- [Erste Schritte](/de-DE/getting-started/): Leitfaden zur ersten Änderung mit Erkundung
