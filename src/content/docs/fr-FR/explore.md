---
title: "Commencer par explorer"
---

**`/opsx:explore` est votre partenaire de réflexion. Utilisez-le dès que vous avez un problème, mais pas encore de plan.** Il étudie votre base de code, examine les options avec vous et précise ce que vous voulez vraiment, avant même qu'une ligne de code soit écrite. Quand tout est clair, il passe le relais à `/opsx:propose`.

Si vous ne retenez qu'une habitude de cette documentation, retenez celle-ci : **en cas de doute, explorez avant de proposer.**

Voici pourquoi c'est important. Les assistants de programmation IA sont enthousiastes : une demande vague et ils construiront quelque chose avec assurance, mais peut-être pas ce dont vous avez besoin. Explore résout ce problème. C'est une conversation sans engagement où vous et l'IA déterminez ensemble la bonne approche. Ainsi, lorsque vous rédigez une proposition, vous proposez la bonne chose.

## Quand explorer

Explorer est une meilleure première étape que beaucoup ne le pensent. Utilisez cette commande dans les cas suivants :

- Vous connaissez le *problème*, mais pas la *solution*. (« Les pages sont lentes. » « L'authentification est chaotique. » « Nous avons sans cesse des commandes en double. »)
- Vous hésitez entre plusieurs approches et voulez en examiner les compromis à partir de votre code réel.
- Vous découvrez une base de code et devez comprendre le fonctionnement d'une partie avant de la modifier.
- Les exigences sont floues et vous voulez les préciser avant de vous engager.
- Vous pensez que le travail sera plus ou moins important qu'il n'y paraît et voulez définir son périmètre honnêtement.

N'omettez l'exploration que si vous savez déjà exactement quoi faire et comment. Dans ce cas, lancez directement [`/opsx:propose`](/fr-FR/commands/#opsxpropose).

## Ce que la commande fait (et ne fait pas)

Explore est une **conversation**, pas un générateur.

**Elle peut :**
- Lire et parcourir votre base de code pour répondre à de vraies questions.
- Comparer les options et exposer les compromis associés.
- Dessiner des diagrammes pour rendre une conception compréhensible.
- Vous aider à transformer une idée vague en périmètre concret et réalisable.
- Consigner l'exploration si vous le demandez ou acceptez sa proposition : elle crée la structure du changement avec `openspec new change` et rédige les artefacts de planification que vous avez nommés, ou met à jour ceux d'un changement existant.
- Passer à `/opsx:propose` lorsque vous êtes prêt.

**Elle ne peut pas :**
- Écrire ou modifier du code. Explore n'écrit jamais de code, y compris lors de la consignation.
- Concevoir ou modifier vos schémas ou modèles. Leur élaboration est un changement, pas une réflexion.
- Commencer un changement ou rédiger un artefact de sa propre initiative. Elle n'écrit rien sans votre demande ou votre accord à sa proposition ; dans ce cas, elle ne rédige que ce que vous avez accepté ainsi que les fichiers de configuration nécessaires pour commencer un changement (voir ci-dessous).
- Vous pousser à consigner l'exploration. Elle le propose lorsque la réflexion aboutit ; la décision vous appartient.

C'est tout l'intérêt de la commande. Explorer ne coûte rien et ne vous engage à rien tant que vous ne donnez pas votre accord. Vous pouvez examiner trois fausses pistes, apprendre de chacune, puis ne proposer que l'approche qui a résisté à cet examen.

## Déjà installé

Bonne nouvelle : `/opsx:explore` fait partie du profil **core** par défaut, avec `propose`, `apply`, `update`, `sync` et `archive`. Rien à activer. Si OpenSpec est configuré dans votre projet, Explore est prête dans votre conversation avec l'IA. (Comme toutes les commandes `/opsx:*`, saisissez-la dans la conversation de l'assistant, pas dans le terminal. Voir [Fonctionnement des commandes](/fr-FR/how-commands-work/).)

## Exemple complet

Voici comment une inquiétude vague devient un changement précis et réalisable.

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

Observez le chemin parcouru. Tout a commencé par « quelque chose ne va pas et je crains d'y toucher ». Vingt secondes d'exploration ont permis de nommer la cause profonde, de classer trois options, de formuler une recommandation tenant compte du code existant et de définir un changement précis. La proposition qui suit est claire parce que la réflexion a eu lieu en premier.

## Passer le relais à propose

Explore n'archive rien. Lorsque vous êtes prêt, commencez simplement un changement ; l'IA transfère dans les artefacts le contexte de votre conversation.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Vous pouvez le dire en langage courant (« transformons cela en changement ») ou lancer directement `/opsx:propose <name>`. Dans les deux cas, l'exploration devient le fondement de la proposition et non une conversation perdue.

Vous pouvez aussi demander à Explore de consigner le changement sans quitter la conversation : « commence un changement pour cela » crée le dossier et « rédige aussi la proposition » ne produit que les artefacts nommés. La création du dossier ajoute aussi ses propres métadonnées et crée au niveau supérieur les éléments manquants du projet (`openspec/specs/`, `openspec/changes/archive/` ou `config.yaml`).

La destination est la même que lors d'un passage de relais. La différence : `propose` rédige l'ensemble requis par votre schéma pour commencer l'implémentation, alors que la consignation ne produit que les artefacts que vous avez nommés.

Si vous utilisez le jeu de commandes étendu, Explore peut plutôt passer le relais à `/opsx:new`, qui crée les artefacts un à un. Voir [Workflows](/fr-FR/workflows/).

## Conseils pour une bonne exploration

- **Partez du problème, pas de la solution.** « Les connexions sont lentes » laisse l'IA enquêter. « Ajoute un cache Redis » vous engage déjà dans une réponse que vous n'avez pas vérifiée.
- **Demandez explicitement les compromis.** « Quels sont les inconvénients de chaque option ? » donne une comparaison plus honnête.
- **Laissez l'IA commencer par lire le code.** Les explorations les plus utiles commencent par l'examen réel du code, pas par des suppositions. Indiquez-lui la zone concernée si nécessaire.
- **Vous pouvez abandonner.** Si l'exploration révèle que l'idée n'en vaut pas la peine, c'est un succès : vous l'avez découvert à peu de frais.
- **Explorez de nouveau en cours de changement.** Vous bloquez pendant `/opsx:apply` ? Reprenez du recul pour examiner un sous-problème, puis revenez à l'implémentation.

## Les compromis, en toute honnêteté

**Ce que vous y gagnez :** Explore repère les fausses pistes au moment où elles coûtent le moins, avant tout engagement. Elle est particulièrement puissante sur une base de code inconnue, où sa capacité à lire et résumer le système peut vous éviter un après-midi de recherches.

**Ce que cela coûte :** un peu de patience. Explore est une conversation, donc plus lente que de lancer `/opsx:propose` et d'espérer que tout ira bien. Si vous maîtrisez réellement le travail, cette étape supplémentaire ne serait qu'un coût inutile ; omettez-la.

Règle générale : plus la tâche est floue, plus Explore est utile. Plus elle est claire, plus vous pouvez passer directement à la proposition.

## Pour continuer

- [Commandes : `/opsx:explore`](/fr-FR/commands/#opsxexplore) : référence détaillée
- [Workflows](/fr-FR/workflows/) : Explore dans le cycle quotidien
- [Exemples et recettes : explorer avant de s'engager](/fr-FR/examples/#recipe-3-exploring-before-you-commit) : exploration guidée de bout en bout
- [Bien démarrer](/fr-FR/getting-started/) : guide du premier changement, avec l'exploration
