---
title: "OpenSpec in bestehenden Projekten verwenden"
---

**Sie müssen zu Beginn nicht Ihre gesamte Codebasis dokumentieren. Sie verfassen Spezifikationen nur für das, was Sie ändern möchten.** Das ist das Wichtigste, was Sie über den Einsatz von OpenSpec in einem bestehenden Projekt wissen müssen – und der Grund, warum OpenSpec für Brownfield-Projekte entwickelt wurde.

Eine häufige Sorge lautet: „Meine Anwendung ist 80.000 Zeilen alt. Muss ich alles spezifizieren, bevor OpenSpec nützlich ist?“ Nein. Das wäre für Sie mühsam, und für uns auch. OpenSpec erweitert Ihre Spezifikationen Schritt für Schritt mit jeder Änderung. Ihre erste Änderung dokumentiert den betroffenen Teil, die nächste ihren Teil, und über Monate wachsen Ihre Spezifikationen ganz natürlich rund um die Arbeit, die Sie tatsächlich erledigen.

Dieser Leitfaden zeigt, wie Sie am ersten Tag beginnen, ohne gleich die ganze Welt umzukrempeln.

## Die Kurzfassung in 30 Sekunden

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Führen Sie dann im KI-Chat Folgendes aus:

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Ihre Spezifikationen beschreiben nun genau den Teil des Systems, den die Änderung betrifft, und nichts darüber hinaus. Das ist richtig so. Sie müssen sich keine Gedanken mehr über die anderen 80.000 Zeilen machen.

## Warum Deltas der entscheidende Kniff sind

OpenSpec-Änderungen werden als **Deltas** verfasst: `ADDED`, `MODIFIED`, `REMOVED`. Ein Delta beschreibt, was sich im Vergleich zum aktuellen Verhalten ändert, nicht das gesamte System.

Genau das braucht die Arbeit an einem bestehenden System. Sie entwickeln selten von Grund auf neu. Sie fügen ein Feld hinzu, korrigieren eine Weiterleitung oder verkürzen eine Zeitüberschreitung. Mit einem Delta können Sie diese einzelne Änderung präzise spezifizieren, ohne zuvor eine 40-seitige Spezifikation für alles drumherum zu schreiben.

Ihr Verzeichnis `openspec/specs/` ist daher nicht von Anfang an vollständig. Es beginnt fast leer und wächst nach und nach. Jede archivierte Änderung führt ihr Delta zusammen. Die Spezifikation für `auth/` wird erst nach mehreren Authentifizierungsänderungen ausführlich – genau dann, wenn Sie eine ausführliche Spezifikation benötigen.

Die ausführlichen Hintergründe finden Sie unter [Konzepte: Delta-Spezifikationen](/de-DE/concepts/#delta-spezifikationen).

## Ihre erste Änderung in einer echten Codebasis

Wählen Sie etwas Kleines und Reales. Kein Spielzeugprojekt und keine Neuentwicklung, sondern eine Änderung, die Sie ohnehin diese Woche vornehmen wollten. Kleine erste Änderungen vermitteln den Workflow bei geringem Risiko.

**Schritt 1: Lassen Sie die KI den relevanten Bereich lesen.** Hier zahlt sich `/opsx:explore` bei einer unbekannten oder großen Codebasis aus. Weisen Sie den Befehl auf den Bereich hin, den Sie ändern möchten, und lassen Sie die KI zunächst erfassen, wie er funktioniert, bevor sie etwas vorschlägt.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I need to add rate limiting to our public API, but I'm not sure
     how requests currently flow through the middleware.

AI:  Let me trace it... [reads the router, middleware stack, and config]
     Requests hit Express, pass through auth middleware, then your
     controllers. There's no rate-limiting layer today. The cleanest
     insertion point is a middleware right after auth. Want me to scope it?
```

Die KI versteht nun Ihre tatsächliche Struktur. Der Vorschlag passt daher zu Ihrem Code und basiert nicht auf einer allgemeinen Vorlage. Bei einer großen Codebasis erspart Ihnen diese eine Gewohnheit besonders viel Mühe. Siehe [Zuerst erkunden](/de-DE/explore/).

**Schritt 2: Schlagen Sie die Änderung vor.** Der Vorschlag und seine Delta-Spezifikation halten nur diese Änderung fest.

```text
You: /opsx:propose add-api-rate-limiting
```

**Schritt 3: Setzen Sie die Änderung um und archivieren Sie sie** mit `/opsx:apply` und `/opsx:archive`, wie jede andere Änderung auch. Nach dem Archivieren haben Sie eine echte Spezifikation für das Verhalten der Ratenbegrenzung, entstanden aus einer Änderung, die Sie ohnehin vornehmen wollten.

## Möchten Sie eine geführte Einführung? Verwenden Sie „Onboard“

Wenn Sie den gesamten Ablauf mit Erklärungen an Ihrem eigenen Code sehen möchten, ist der erweiterte Befehl `/opsx:onboard` genau richtig: Er durchsucht Ihre Codebasis nach einer kleinen, sicheren Verbesserung und führt Sie anschließend durch deren Vorschlag, Umsetzung und Archivierung, wobei jeder Schritt erklärt wird.

Aktivieren Sie zunächst die erweiterten Befehle:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Führen Sie dann im Chat Folgendes aus:

```text
/opsx:onboard
```

Das ist die sanfteste Möglichkeit, OpenSpec in einem echten Projekt kennenzulernen. Am Ende haben Sie eine tatsächlich umgesetzte (kleine) Änderung, die Sie behalten oder verwerfen können. Siehe [Befehle: `/opsx:onboard`](/de-DE/commands/#opsxonboard).

## „Aber ich habe bereits Anforderungsdokumente“

Vielleicht haben Sie bereits ein PRD, ein SRS, eine formale Spezifikation oder sogar TLA+-Modelle. Gut. Sie importieren sie nicht vollständig, werfen sie aber auch nicht weg.

Betrachten Sie bestehende Dokumente als **Ausgangsmaterial für die Erkundung**, nicht als Spezifikationen, die umgewandelt werden müssen. Kopieren Sie beim Beginn einer Änderung den relevanten Abschnitt in den KI-Chat oder verweisen Sie die KI darauf und lassen Sie sie daraus ein fokussiertes OpenSpec-Delta erstellen. Das Delta hält das Verhalten, das Sie gerade ändern, in der testbaren Form von Anforderungen und Szenarien in OpenSpec fest. Ihre Originaldokumente bleiben als Hintergrundmaterial erhalten, wo sie sind.

Der ehrliche Grund: OpenSpec-Spezifikationen stellen bewusst das Verhalten in den Mittelpunkt und sind auf Änderungen begrenzt. Ein 40-seitiges PRD ist ein anderes Artefakt mit einer anderen Aufgabe. Eine einmalige Massenkonvertierung führt meist zu einer großen, veralteten Spezifikation, der niemand vertraut. Wenn Sie Spezifikationen aus tatsächlichen Änderungen wachsen lassen, bleiben sie korrekt.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Spezifikationen in einer großen Codebasis organisieren

Spezifikationen liegen unter `openspec/specs/` und sind nach **Domänen** gruppiert: logischen Bereichen, die der Denkweise Ihres Teams über das System entsprechen. Sie müssen die gesamte Taxonomie nicht im Voraus entwerfen. Erstellen Sie einen Domänenordner, sobald Ihre erste Änderung in diesem Bereich ihn benötigt.

Übliche Möglichkeiten, Domänen aufzuteilen:

- **Nach Funktionsbereichen:** `auth/`, `payments/`, `search/`
- **Nach Komponenten:** `api/`, `frontend/`, `workers/`
- **Nach abgegrenzten Kontexten:** `ordering/`, `fulfillment/`, `inventory/`

Wählen Sie die Variante, bei der neue Teammitglieder sofort zustimmen. Verfeinern können Sie später. Siehe [Konzepte: Spezifikationen](/de-DE/concepts/#spezifikationen).

## Monorepos und repositoryübergreifende Arbeit

Für ein Monorepo ist das einfachste Modell ein einzelnes Verzeichnis `openspec/` im Repository-Stammverzeichnis, mit Domänen, die Ihren Paketen oder Services entsprechen. Das deckt die Anforderungen der meisten Teams ab.

Wenn Ihre Arbeit tatsächlich **mehrere Repositories** umfasst (oder mehrere Pakete, die Sie als getrennt behandeln), bietet OpenSpec die Beta-Funktion **Stores**: Die Planung liegt in einem eigenen, eigenständigen Repository, auf das alle Ihre Code-Repositories verweisen können. So muss der Plan nicht im Ordner `openspec/` eines einzelnen Repositorys liegen. Die Funktion ist noch in der Beta; betrachten Sie ihre Befehle und ihren Zustand daher als im Wandel begriffen. Beginnen Sie mit dem [Store-Benutzerhandbuch](/de-DE/stores-beta/user-guide/), um das Denkmodell und den kleinstmöglichen sinnvollen Ablauf kennenzulernen.

## Einige ehrliche Hinweise

- **Widerstehen Sie dem Drang, alles nachträglich zu dokumentieren.** Spezifikationen für Code zu schreiben, den Sie gar nicht ändern, fühlt sich produktiv an, ist es aber meist nicht. Solche Spezifikationen veralten, denn nichts zwingt sie dazu, mit der Realität Schritt zu halten. Lassen Sie Ihre tatsächlichen Änderungen die Spezifikationen bestimmen.
- **Halten Sie die ersten Änderungen klein.** Bei den ersten Änderungen lernen Sie den Ablauf ebenso, wie Sie etwas ausliefern. Ein enger Umfang hält die Abläufe kurz und die Lektionen kostengünstig.
- **Committen Sie `openspec/` in Git.** Ihre Spezifikationen und Ihr Archiv gehören gemeinsam mit dem beschriebenen Code unter Versionskontrolle.
- **Geben Sie der KI Kontext.** Bei einer großen Codebasis mit festen Konventionen sollten Sie `context:` in `openspec/config.yaml` ausfüllen, damit jeder Vorschlag Ihren Technologie-Stack und Ihre Muster berücksichtigt. Siehe [Anpassung](/de-DE/customization/#projektkonfiguration).

## Wie geht es weiter?

- [Zuerst erkunden](/de-DE/explore/) – die wichtigste Gewohnheit, um Code vor einer Änderung zu verstehen
- [Erste Schritte](/de-DE/getting-started/) – die vollständige Anleitung für Ihre erste Änderung
- [Änderungen bearbeiten und iterieren](/de-DE/editing-changes/) – eine Änderung anpassen, während Sie dazulernen
- [Konzepte: Delta-Spezifikationen](/de-DE/concepts/#delta-spezifikationen) – warum Deltas die Arbeit an bestehenden Systemen erleichtern
- [Anpassung](/de-DE/customization/) – OpenSpec die Konventionen Ihres Projekts vermitteln
