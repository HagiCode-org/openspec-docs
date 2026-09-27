---
title: "OpenSpec en équipe"
---

Tout ce qui est présenté dans les autres guides fonctionne de la même manière, que vous travailliez seul ou au sein d'une équipe de vingt personnes. En équipe, les questions périphériques changent : où vivent les spécifications, comment les collègues examinent-ils un plan et comment tout cela s'intègre-t-il au workflow de pull request existant ?

La réponse courte : un changement n'est qu'un ensemble de fichiers, et OpenSpec ne touche jamais à git. Il s'intègre donc à votre workflow existant au lieu de le remplacer. Cette page présente les conventions qui fonctionnent bien.

## Une règle : OpenSpec ne touche pas à git

OpenSpec lit et écrit du Markdown ordinaire sous `openspec/`. Il ne valide, ne crée, ne pousse ni ne récupère jamais de branches dans votre projet — et il ne clone ni ne synchronise jamais un [store](/fr-FR/stores-beta/user-guide/) de lui-même. Cela signifie que :

- **Vous versionnez `openspec/` comme n'importe quel code source.** Les spécifications, changements actifs et archives font partie de l'historique du projet. (Oui, validez le dossier entier — voir la [FAQ](/fr-FR/faq/#should-i-commit-the-openspec-folder-to-git).)
- **Un changement est un dossier que vous versionnez comme du code.** `openspec/changes/add-dark-mode/` ne contient que des fichiers sur une branche.
- **Tout ce qui suit relève de conventions, pas de règles imposées.** OpenSpec ne vous oblige pas à procéder ainsi ; ce workflow s'y adapte simplement bien.

## Le cycle au quotidien

Un workflow efficace associe un changement à une branche et à une pull request :

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

Le plan et le code cohabitent sur la même branche : vos collègues les examinent ensemble et, six mois plus tard, la spécification archivée explique toujours pourquoi le code a cette forme.

## Examiner les spécifications dans une pull request

C'est là que l'équipe en voit les bénéfices. Lorsqu'une PR inclut le delta de spécification du changement, la personne qui l'examine dispose de ce qu'un diff brut ne fournit pas : **une description en langage clair de ce que le changement est censé faire**, avant même de lire une ligne de code.

Un bon ordre d'examen :

1. **Lire `proposal.md`** — le problème et le périmètre sont-ils les bons ?
2. **Lire le delta sous `specs/`** — « terminé » est-il correctement défini ? (C'est le passage de deux minutes de [Revoir un changement](/fr-FR/reviewing-changes/), directement dans la PR.)
3. **Lire ensuite le diff du code** — répond-il exactement à ces exigences ?

Une personne qui n'est pas d'accord avec l'*approche* peut le signaler sur la proposition, à peu de frais, plutôt que de rouvrir le débat au fil de 300 lignes de code. Placez le delta de spécification près du début de la description de la PR, ou indiquez le dossier du changement, afin que l'examen commence par là.

## Quand archiver

L'archivage intègre les deltas d'un changement aux spécifications principales de `openspec/specs/` et déplace son dossier vers `openspec/changes/archive/YYYY-MM-DD-<name>/`. Puisque `specs/` est la **source de vérité partagée**, le moment choisi compte en équipe. Deux conventions possibles :

- **Archiver après la fusion de la PR (recommandé).** La branche contient le changement actif ; une fois fusionnée dans la branche principale, archivez-le depuis cette branche (souvent dans une petite validation de suivi ou lors d'un nettoyage planifié). Ainsi, les `specs/` partagées n'évoluent qu'avec le travail effectivement livré.
- **Archiver dans la PR.** Plus simple pour les petites équipes : la même PR qui ajoute le code synchronise et archive également le changement. En contrepartie, les différences de `specs/` et de code sont regroupées, ce qui peut rendre la PR plus chargée.

Choisissez une convention et tenez-vous-y. Dans les deux cas, `/opsx:archive` vérifie que les tâches sont terminées et propose d'abord une synchronisation, afin d'éviter de fusionner accidentellement un travail inachevé.

## Deux personnes, des changements en parallèle

Comme les changements sont des dossiers distincts, ils n'entrent pas en conflit :

- **Des changements différents, des personnes différentes : aucun problème.** `add-dark-mode` et `rate-limit-login` sont des dossiers distincts sur des branches différentes ; ils ne se touchent pas avant leur archivage.
- **Un changement, une personne responsable.** Si deux personnes modifient le même dossier de changement, le conflit est le même que si elles modifiaient le même fichier. Confiez un changement à une seule personne ou séparez-le en deux (une autre raison de [dimensionner correctement](/fr-FR/writing-specs/#right-size-the-change) un changement).
- **Les conflits n'apparaissent qu'au même endroit : `specs/`.** Si deux changements modifient la *même* exigence, l'archivage du second provoquera un conflit dans `openspec/specs/…/spec.md` — résolvez-le comme tout conflit de fusion, en conservant l'exigence qui reflète la réalité. C'est rare, et c'est utile : git révèle que deux changements n'étaient pas d'accord sur le comportement attendu du système.

## Quand la planification dépasse un seul dépôt

Tout ce qui précède suppose que le plan se trouve dans le dossier `openspec/` du dépôt de code ; c'est le choix par défaut recommandé. Lorsque la planification concerne réellement plusieurs dépôts ou équipes — une fonctionnalité touchant trois services, ou des exigences détenues par une équipe et utilisées par d'autres — la fonctionnalité bêta **stores** permet de placer la planification dans son propre dépôt, auquel les dépôts de code peuvent se référer. Commencez par le [Guide de l'utilisateur des stores](/fr-FR/stores-beta/user-guide/).

## Pour continuer

- [Revoir un changement](/fr-FR/reviewing-changes/) — le passage de revue, maintenant dans votre PR.
- [Rédiger de bonnes spécifications](/fr-FR/writing-specs/) — y compris dimensionner correctement un changement pour qu'il tienne dans une branche.
- [Guide de l'utilisateur des stores](/fr-FR/stores-beta/user-guide/) — planification impliquant plusieurs dépôts et équipes.
