---
title: "Modifier et faire évoluer un changement"
---

**Chaque artefact d'un changement est un simple fichier Markdown que vous pouvez modifier à tout moment.** Il n'y a ni « phase de planification » verrouillée, ni étape d'approbation, ni mode d'édition spécial à activer. Vous voulez modifier la proposition après avoir commencé à construire ? Ouvrez `proposal.md` et modifiez-la. Vous découvrez en cours d'implémentation que la conception est mauvaise ? Corrigez `design.md` et continuez. C'est aussi simple que cela, et c'est voulu.

Cette page répond à la question « Attendez, puis-je revenir en arrière et modifier cela ? » Oui. Voici comment procéder dans les situations courantes.

## Deux façons de tout modifier

Vous avez toujours le choix entre :

1. **Modifier le fichier directement.** Les artefacts sont du Markdown ordinaire dans `openspec/changes/<name>/`. Ouvrez `proposal.md`, `design.md`, `tasks.md` ou une spécification différentielle sous `specs/` dans votre éditeur et modifiez-les. Rien d'autre n'est nécessaire.

2. **Demander à votre IA de le réviser.** Dans la conversation, dites simplement ce que vous voulez : « Mets à jour la proposition pour abandonner l'idée de mise en cache et ajouter une section sur la limitation de débit », ou « la conception doit utiliser une file d'attente, pas l'interrogation périodique ». L'IA modifie l'artefact en s'appuyant sur le reste du changement.

Choisissez la méthode adaptée à la situation. Petite retouche de formulation ? Modifiez le fichier. Refonte importante ? Laissez l'IA le réviser avec tout le contexte.

## « Comment mettre à jour la proposition (ou les spécifications) après avoir commencé ? »

Modifiez-les, tout simplement. C'est le même changement, affiné.

Avec les commandes étendues, le workflow naturel consiste à modifier l'artefact, puis à lancer `/opsx:continue` pour reprendre à partir du nouvel état, ou `/opsx:apply` pour continuer l'implémentation en fonction du plan mis à jour. Avec les commandes `core` par défaut, modifiez l'artefact puis lancez `/opsx:apply` : cette commande lit les fichiers actuels et réalise le travail en fonction de leur contenu.

Le modèle mental à retenir : les artefacts constituent le plan vivant, pas un contrat signé. L'IA travaille toujours à partir de leur contenu actuel ; les modifier permet donc de guider le travail.

```text
You: I want to change the approach in this change.

You: [edit design.md, or tell the AI:]
     Update design.md to use a background job instead of a synchronous call.

AI:  Updated design.md. The task list still fits; want me to continue applying?

You: /opsx:apply
```

C'est la réponse à une question fréquente : il n'y a pas de commande « mettre à jour la proposition », car ce n'est pas nécessaire. Le fichier est la source de vérité ; le modifier, à la main ou avec l'IA, constitue la mise à jour.

<a id="how-do-i-go-back-to-review-after-implementing"></a>

## « Comment revenir à la revue après l'implémentation ? »

Il n'est pas nécessaire de « revenir en arrière », car vous n'avez jamais quitté la revue. Le workflow est fluide : revue, modification et implémentation ne sont pas des phases séquentielles dont vous ne pouvez pas sortir.

Après avoir réalisé une partie du travail avec `/opsx:apply` :

- Vous voulez réexaminer le plan ? Ouvrez et lisez les artefacts ou exécutez `openspec show <change>` dans le terminal pour obtenir une vue d'ensemble.
- Vous avez repéré quelque chose à changer ? Modifiez l'artefact (ou demandez à l'IA de le faire), puis continuez.
- Vous souhaitez vérifier méthodiquement que le code correspond au plan ? Exécutez `/opsx:verify` (commande étendue). Elle indique le niveau d'exhaustivité, de justesse et de cohérence sans rien bloquer. Voir [Workflows : vérifier votre travail](/fr-FR/workflows/#verify-check-your-work).

Il n'existe pas de « phase de revue » à reprendre, puisque vous pouvez examiner le travail à tout moment, y compris après son implémentation.

<a id="i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec"></a>

## « J'ai modifié le code à la main. Comment le réconcilier avec OpenSpec ? »

Cela arrive constamment, et ce n'est pas un problème. Vous avez modifié quelque chose dans votre éditeur ; le code et les artefacts ne concordent plus. Rétablissez leur cohérence dans le sens qui correspond à la réalité :

- **Le code est correct, la spécification est périmée.** Mettez à jour le delta de spécification (et les tâches, le cas échéant) pour décrire le comportement réellement livré. Avant l'archivage, la spécification doit correspondre à la réalité, puisque l'archivage l'intègre à la source de vérité.
- **La spécification est correcte, le code a divergé.** Continuez à implémenter ou à corriger jusqu'à ce que le code corresponde à la spécification.

`/opsx:verify` permet de repérer rapidement les écarts : la commande lit vos artefacts et votre code et vous indique leurs divergences. Utilisez le résultat comme liste des éléments à réconcilier, puis archivez une fois qu'ils concordent.

Principe à retenir : au moment de l'archivage, vos spécifications deviennent la référence officielle. Avant d'archiver, assurez-vous donc qu'elles décrivent honnêtement le comportement du code. Les modifications manuelles sont bienvenues ; veillez simplement à ne pas laisser la spécification diverger en silence.

## Améliorer une proposition insatisfaisante

Si une proposition générée ne vous convient pas, trois bonnes options s'offrent à vous :

- **Itérer sur place.** Indiquez à l'IA ce qui ne va pas (« le périmètre est trop large, supprime les fonctionnalités d'administration ») et laissez-la réviser le document. C'est le plus simple, et généralement le meilleur choix.
- **Explorer d'abord, puis proposer à nouveau.** Si l'idée elle-même manque de clarté, reprenez avec `/opsx:explore`, réfléchissez au problème, puis laissez-en découler une proposition mieux ciblée. Voir [Commencer par explorer](/fr-FR/explore/).
- **Repartir de zéro.** Si l'intention a fondamentalement changé, il peut être plus clair de créer un nouveau changement que de retoucher l'ancien.

La dernière option a son propre guide de décision, ci-dessous.

## Mettre à jour ou créer un nouveau changement ?

En bref : **mettez à jour le changement si c'est le même travail affiné ; créez-en un nouveau si l'intention a fondamentalement changé ou si le périmètre s'est étendu à des travaux distincts.**

- Même objectif, meilleure approche ? Mettez-le à jour.
- Périmètre réduit (livrer le produit minimum viable maintenant, le reste plus tard) ? Mettez-le à jour, archivez-le, puis créez un nouveau changement pour la deuxième phase.
- Le problème lui-même a changé (« ajouter le mode sombre » est devenu « créer un système complet de thèmes ») ? Créez un nouveau changement.

Vous trouverez un organigramme complet et des exemples dans [Workflows : quand mettre à jour ou repartir de zéro](/fr-FR/workflows/#when-to-update-vs-start-fresh) et une analyse plus approfondie dans [OPSX : quand mettre à jour ou repartir de zéro](/fr-FR/opsx/#when-to-update-vs-start-fresh).

## À propos des tâches

`tasks.md` est une liste de contrôle vivante, pas un plan figé. Pendant l'implémentation, ajoutez les tâches découvertes, supprimez celles qui ne sont plus nécessaires ou réorganisez-les. L'IA coche les éléments terminés pendant `/opsx:apply` et reprend à la première tâche non cochée si vous revenez plus tard. Modifier la liste en cours de route est tout à fait normal.

## Pour continuer

- [Workflows](/fr-FR/workflows/) — modèles de travail et guide pour choisir entre mise à jour et nouveau changement
- [Revoir un changement](/fr-FR/reviewing-changes/) — examiner un plan pendant deux minutes avant de le réaliser
- [Commencer par explorer](/fr-FR/explore/) — prendre du recul lorsqu'une idée mérite d'être repensée
- [Commandes](/fr-FR/commands/) — `/opsx:continue`, `/opsx:apply` et `/opsx:verify` en détail
- [Concepts : artefacts](/fr-FR/concepts/#artifacts) — rôle de chaque artefact
