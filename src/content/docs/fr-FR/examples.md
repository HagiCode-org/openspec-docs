---
title: "Exemples et recettes"
---

Des changements réels, de bout en bout. Chaque recette montre les commandes à saisir et la réponse obtenue, afin que vous puissiez trouver le modèle correspondant à votre situation et le reprendre. Ces exemples utilisent les commandes **core** par défaut (`propose`, `explore`, `apply`, `update`, `sync`, `archive`) ; l'utilité du jeu étendu est indiquée le cas échéant.

Rappel avant de commencer : les commandes slash telles que `/opsx:propose` se saisissent dans la conversation avec votre **assistant IA**, tandis que les commandes `openspec` s'exécutent dans le **terminal**. Si cette distinction est nouvelle pour vous, lisez d'abord [Fonctionnement des commandes](/fr-FR/how-commands-work/). Dans les transcriptions ci-dessous, `Vous :` et `IA :` correspondent à la conversation ; les lignes commençant par `$` correspondent au terminal.

> **Vous ne savez pas encore quoi construire ?** La plupart de ces recettes seront plus pertinentes si vous commencez par `/opsx:explore` pour réfléchir au problème. La [recette 3](#recette-3--explorer-avant-de-sengager) le montre en pratique ; le guide [Commencer par explorer](/fr-FR/explore/) explique toute la démarche.

## Recette 1 : une petite fonctionnalité, le parcours rapide

**À utiliser si :** vous savez ce que vous voulez et il s'agit d'un travail limité. C'est la recette la plus courante.

Tout tient en trois commandes : proposer, réaliser, archiver.

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Lisez maintenant le plan. Ouvrez la proposition et le delta de spécification. C'est le moment pour lequel OpenSpec est conçu : repérer une hypothèse erronée lorsqu'elle tient encore en un paragraphe, et non après 400 lignes de code. Modifiez directement les artefacts nécessaires, puis continuez.

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

C'est tout. Le comportement de déconnexion fait désormais partie de vos spécifications et le changement est archivé avec tout son contexte.

## Recette 2 : corriger un bogue

**À utiliser si :** quelque chose ne fonctionne pas et vous voulez consigner la correction comme une modification délibérée du comportement, plutôt que comme une mystérieuse validation.

Les corrections de bogues suivent exactement le même processus que les fonctionnalités. La différence tient à la formulation de la proposition : décrivez le comportement *correct*, pas seulement « corriger le bogue ».

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Comme la correction est consignée sous forme d'exigence `MODIFIED` avec un nouveau scénario, la personne suivante (ou la prochaine session d'IA) verra non seulement que le bogue a été corrigé, mais également ce que signifie « correct ». Continuez ensuite avec `/opsx:apply` et `/opsx:archive`, comme d'habitude.

Conseil : pour une correction, un bon scénario est un test de régression rédigé en prose. « GIVEN un utilisateur déconnecté, WHEN il soumet des identifiants valides, THEN il arrive sur le tableau de bord et n'est pas redirigé à nouveau. » En le formulant ainsi, vous donnez une cible claire à l'implémentation.

<a id="recipe-3-exploring-before-you-commit"></a>

## Recette 3 : explorer avant de s'engager

**À utiliser si :** vous avez un problème, mais pas encore de plan. Vous ne savez pas quoi construire ni quelle approche choisir.

Commencez par `/opsx:explore`. C'est un partenaire de réflexion sans structure imposée. Il n'écrit jamais de code, ni rien d'autre, sauf si vous lui demandez de consigner votre décision ou acceptez sa proposition. Il lit votre base de code et vous aide à décider.

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

L'exploration précise votre réflexion *avant* que vous ne vous engagiez dans un changement. Lorsque l'idée se clarifie, rédigez la proposition : l'IA y transfère le contexte recueilli.

## Recette 4 : gérer deux changements à la fois

**À utiliser si :** vous êtes en plein travail sur une fonctionnalité et qu'une correction urgente passe avant elle.

Les changements sont des dossiers indépendants ; le travail en parallèle ne crée donc pas de conflit. Commencez par la correction urgente, livrez-la, puis reprenez la fonctionnalité là où vous l'avez laissée.

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

Indiquer le nom du changement avec `/opsx:apply add-dark-mode` permet de cibler un changement particulier lorsque plusieurs sont actifs. Comme l'avancement est enregistré dans `tasks.md`, l'IA sait exactement où vous vous étiez arrêté.

Lorsque plusieurs changements sont terminés en même temps, la commande étendue `/opsx:bulk-archive` les archive ensemble et résout les conflits de spécification en vérifiant ce qui a effectivement été implémenté. Voir [Workflows](/fr-FR/workflows/#changements-en-parallèle).

<a id="recipe-5-a-refactor-with-no-behavior-change"></a>

## Recette 5 : refactorisation sans changement de comportement

**À utiliser si :** vous réorganisez le code, mais que son comportement visible doit rester identique.

C'est un cas intéressant, car une refactorisation pure n'ajoute *rien à vos spécifications*. Le contrat de comportement ne change pas ; seule l'implémentation évolue. Le travail porte donc sur la conception et les tâches, et le delta de spécification est vide ou absent.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Déclarez explicitement le delta vide en définissant `skip_specs: true` dans le fichier `.openspec.yaml` du changement :

```yaml
schema: spec-driven
skip_specs: true
```

Sans ce marqueur, `openspec validate` rejette un changement qui ne contient aucun delta (une étape de spécification oubliée est ainsi détectée). Avec le marqueur, la validation réussit et `openspec status` indique que l'étape des spécifications a été explicitement ignorée plutôt que laissée en attente. Si la refactorisation finit par modifier le comportement, supprimez `skip_specs` du `.openspec.yaml` et rédigez les spécifications différentielles : la validation considère la présence du marqueur et des fichiers de spécification comme un conflit, de sorte qu'un marqueur périmé ne puisse pas subsister silencieusement.

L'archivage d'un changement marqué ne nécessite aucune option supplémentaire (aucun delta n'est à fusionner). Indépendamment, l'option `--skip-specs` indique explicitement à la commande de terminal d'ignorer l'étape des spécifications :

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Cette option est également pratique pour l'outillage, la CI et les changements limités à la documentation. Principe : les spécifications décrivent le comportement ; s'il n'a pas changé, elles ne devraient pas changer non plus. Voir [Concepts](/fr-FR/concepts/#ce-quest-et-nest-pas-une-spécification).

## Recette 6 : contrôler chaque étape (commandes étendues)

**À utiliser si :** le changement est complexe ou risqué et vous voulez examiner chaque artefact avant de continuer.

La commande core `/opsx:propose` rédige tout en une fois. Pour avancer étape par étape, activez les commandes étendues :

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Vous pouvez maintenant créer la structure et avancer progressivement :

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Examinez chaque artefact au fur et à mesure, modifiez-le librement et continuez lorsque le résultat vous convient. Pour rédiger le reste d'un coup, `/opsx:ff` complète rapidement les artefacts de planification restants. Avant l'archivage, `/opsx:verify` vérifie que l'implémentation correspond bien aux spécifications. Voir [Workflows](/fr-FR/workflows/#opsxff-ou-opsxcontinue).

## Recette 7 : apprendre tout le cycle par la pratique

**À utiliser si :** OpenSpec est installé et vous voulez *expérimenter* son workflow sur votre propre code, pas sur un exemple artificiel.

Activez les commandes étendues (voir la recette 6), puis :

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

`/opsx:onboard` repère une amélioration réelle (et modeste), crée un changement, le réalise et l'archive en commentant chaque étape. Comptez 15 à 30 minutes ; vous obtiendrez un changement réel à conserver ou à abandonner. C'est la façon la plus accessible d'apprendre. Voir [Commandes](/fr-FR/commands/#opsxonboard).

## Vérifier le travail depuis le terminal

Vous pouvez consulter l'état du travail à tout moment depuis le terminal :

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Ces outils servent à lire et examiner le travail. La proposition et l'implémentation se font toujours dans la conversation à l'aide des commandes slash. Plus de détails dans la [Référence CLI](/fr-FR/cli/).

## Pour continuer

- [Commencer par explorer](/fr-FR/explore/) : méthode recommandée en cas d'incertitude
- [Workflows](/fr-FR/workflows/) : modèles présentés ci-dessus et aide au choix
- [Commandes](/fr-FR/commands/) : détail de chaque commande slash
- [Bien démarrer](/fr-FR/getting-started/) : guide de référence du premier changement
- [Concepts](/fr-FR/concepts/) : pourquoi tous les éléments s'articulent ainsi
