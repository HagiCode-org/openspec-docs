---
title: "Utiliser OpenSpec dans un projet existant"
---

**Vous n'avez pas à documenter toute votre base de code pour commencer. Vous ne rédigez des spécifications que pour les éléments que vous êtes sur le point de modifier.** C'est le point le plus important à savoir pour adopter OpenSpec dans un projet existant, et c'est la raison pour laquelle OpenSpec privilégie les projets déjà établis.

Une inquiétude fréquente : « Mon application a 80 000 lignes et date de longtemps. Dois-je tout spécifier avant qu'OpenSpec me soit utile ? » Non. Vous détesteriez cela, et nous aussi. Vos spécifications OpenSpec s'enrichissent changement après changement. Le premier changement documente la partie qu'il touche, le suivant la sienne ; au fil des mois, les spécifications se construisent naturellement autour du travail réel.

Ce guide explique comment commencer dès le premier jour sans vouloir tout faire d'un coup.

## La version en trente secondes

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Puis, dans votre conversation avec l'IA :

```text
/opsx:explore            # optional: have the AI read the area you'll touch
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Vos spécifications décrivent maintenant exactement la partie du système touchée par le changement, et rien de plus. C'est tout à fait normal. Vous pouvez cesser de vous préoccuper des 80 000 autres lignes.

## Pourquoi les deltas sont la clé

Les changements OpenSpec sont décrits sous forme de **deltas** : `ADDED`, `MODIFIED`, `REMOVED`. Un delta décrit ce qui change par rapport au comportement actuel, et non l'ensemble du système.

C'est exactement ce qu'exige un projet existant. On construit rarement à partir de rien. On ajoute un champ, corrige une redirection ou raccourcit un délai d'attente. Un delta permet de spécifier précisément ce changement sans devoir d'abord rédiger 40 pages sur tout ce qui l'entoure.

Ainsi, votre répertoire `openspec/specs/` ne commence pas complet. Il est presque vide et se remplit peu à peu. Chaque changement archivé y fusionne son delta. La spécification `auth/` ne devient détaillée qu'après plusieurs changements liés à l'authentification — précisément au moment où cela devient utile.

Pour comprendre le fonctionnement en détail, consultez [Concepts : spécifications différentielles](/fr-FR/concepts/#spécifications-différentielles).

## Votre premier changement dans une vraie base de code

Choisissez un changement réel et de petite taille. Pas un exercice, pas une réécriture : un changement que vous comptiez déjà faire cette semaine. Un premier changement modeste permet d'apprendre le workflow avec peu d'enjeux.

**Étape 1 : demandez à l'IA d'examiner la partie concernée.** Dans une base de code inconnue ou volumineuse, `/opsx:explore` est particulièrement utile. Indiquez-lui la partie que vous allez modifier et laissez-la comprendre son fonctionnement avant de proposer quoi que ce soit.

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

L'IA comprend alors votre structure réelle : la proposition qu'elle rédigera s'adaptera à votre code au lieu de reprendre un modèle générique. Dans une base de code volumineuse, cette habitude évite bien des difficultés. Voir [Commencer par explorer](/fr-FR/explore/).

**Étape 2 : proposer le changement.** La proposition et son delta de spécification ne concernent que ce changement.

```text
You: /opsx:propose add-api-rate-limiting
```

**Étape 3 : réaliser et archiver** avec `/opsx:apply` et `/opsx:archive`, comme pour tout changement. Une fois l'archivage terminé, vous disposez d'une véritable spécification du comportement de limitation de débit, créée à partir d'un changement dont vous aviez réellement besoin.

## Vous préférez une visite guidée ? Utilisez onboard

Si vous préférez observer tout le cycle sur votre propre code avec des explications, la commande étendue `/opsx:onboard` est faite pour cela : elle cherche dans votre base de code une amélioration modeste et sûre, puis vous guide dans la proposition, la réalisation et l'archivage, en expliquant chaque étape.

Activez d'abord les commandes étendues :

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Puis, dans la conversation :

```text
/opsx:onboard
```

C'est l'introduction la plus douce possible dans un vrai projet ; elle vous laisse avec un changement réel (et modeste) que vous pouvez conserver ou abandonner. Voir [Commandes : `/opsx:onboard`](/fr-FR/commands/#opsxonboard).

## « Mais j'ai déjà des documents d'exigences »

Vous avez peut-être un PRD, un SRS, une spécification formelle ou même des modèles TLA+. Très bien. Il n'est pas nécessaire de tout importer ni de tout jeter.

Utilisez les documents existants comme **matériel de référence pour l'exploration**, et non comme spécifications à convertir. Au début d'un changement, collez la section pertinente ou indiquez-la à l'IA ; laissez-la en tirer un delta OpenSpec ciblé. Ce delta décrit le comportement que vous modifiez maintenant sous la forme vérifiable d'exigences et de scénarios OpenSpec. Vos documents d'origine restent à leur emplacement et servent de contexte.

La raison est simple : les spécifications OpenSpec se concentrent délibérément sur le comportement et sur les changements. Un PRD de 40 pages est un autre artefact qui remplit une autre fonction. Une conversion massive ponctuelle produit souvent une longue spécification vite périmée, à laquelle personne ne fait confiance. Laisser les spécifications se construire au rythme des changements réels les maintient exactes.

```text
You: /opsx:explore
You: Here's the section of our PRD about checkout. I'm implementing the
     "guest checkout" requirement next.
     [paste the relevant requirement]
AI:  [reads it, asks clarifying questions, then helps scope a change]
You: /opsx:propose add-guest-checkout
```

## Organiser les spécifications dans une grande base de code

Les spécifications se trouvent sous `openspec/specs/`, regroupées par **domaine** : une zone logique qui correspond à la façon dont votre équipe pense le système. Il n'est pas nécessaire de concevoir toute la taxonomie à l'avance. Créez un dossier de domaine quand un premier changement dans cette zone le nécessite.

Exemples courants de domaines :

- **Par fonctionnalité :** `auth/`, `payments/`, `search/`
- **Par composant :** `api/`, `frontend/`, `workers/`
- **Par contexte délimité :** `ordering/`, `fulfillment/`, `inventory/`

Choisissez une organisation qui semble évidente aux nouvelles personnes. Vous pourrez l'affiner ensuite. Voir [Concepts : spécifications](/fr-FR/concepts/#spécifications).

## Monorepos et travail entre dépôts

Dans un monorepo, le plus simple est d'avoir un seul répertoire `openspec/` à la racine, avec des domaines correspondant aux paquets ou aux services. Cela suffit à la plupart des équipes.

Si le travail touche véritablement **plusieurs dépôts** (ou plusieurs paquets que vous gérez séparément), la fonctionnalité bêta **stores** d'OpenSpec permet de placer la planification dans son propre dépôt autonome, auquel les dépôts de code peuvent se référer. Le plan n'a ainsi pas à résider dans le dossier `openspec/` d'un dépôt particulier. Cette fonctionnalité est en bêta ; ses commandes et son état peuvent évoluer. Commencez par le [Guide de l'utilisateur des stores](/fr-FR/stores-beta/user-guide/) pour comprendre le modèle et le parcours minimal utile.

## Quelques mises en garde honnêtes

- **Résistez à la tentation de tout documenter rétrospectivement.** Rédiger des spécifications pour du code que vous ne modifiez pas semble productif, mais ne l'est généralement pas. Elles deviennent obsolètes, car rien ne les oblige à rester conformes à la réalité. Laissez les changements réels guider vos spécifications.
- **Gardez les premiers changements modestes.** Les premiers changements vous apprennent le rythme autant qu'ils permettent de livrer du travail. Un périmètre restreint rend le cycle rapide et les leçons peu coûteuses.
- **Validez `openspec/` dans git.** Vos spécifications et vos archives doivent être versionnées avec le code qu'elles décrivent.
- **Donnez du contexte à l'IA.** Dans une grande base de code aux conventions bien établies, renseignez `context:` dans `openspec/config.yaml` afin que chaque proposition respecte votre pile technique et vos pratiques. Voir [Personnalisation](/fr-FR/customization/#configuration-du-projet).

## Pour continuer

- [Commencer par explorer](/fr-FR/explore/) — comprendre le code avant de le modifier
- [Bien démarrer](/fr-FR/getting-started/) — guide complet du premier changement
- [Modifier et faire évoluer un changement](/fr-FR/editing-changes/) — l'ajuster à mesure que vous apprenez
- [Concepts : spécifications différentielles](/fr-FR/concepts/#spécifications-différentielles) — pourquoi les deltas facilitent le travail sur un projet existant
- [Personnalisation](/fr-FR/customization/) — expliquer à OpenSpec les conventions de votre projet
