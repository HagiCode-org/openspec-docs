---
title: "Vitrine communautaire"
---

Une liste collaborative de projets et de ressources créés avec OpenSpec ou pour OpenSpec. Outils, intégrations, workflows et ressources d'apprentissage sont les bienvenus. Les membres de la communauté enrichissent cette vitrine en ouvrant une issue ; les mainteneurs ajoutent les entrées.

Les projets répertoriés sont gérés indépendamment. Leur inclusion ne signifie pas qu'OpenSpec les prend officiellement en charge ni les recommande. Consultez la documentation et le suivi des problèmes de chaque projet pour l'installation et l'assistance.

## Projets et ressources

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)** : exécution et supervision d'agents travaillant sur des changements OpenSpec.
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)** : CLI et action GitHub qui indique quels scénarios OpenSpec sont couverts par un test Vitest ou Jest, sans exécuter les tests.

## Services hébergés

Produits hébergés qui ajoutent une fonctionnalité d'OpenSpec que la CLI ne fournit pas. Chaque entrée indique ses conditions de compte, de paiement et de traitement des données.

- **[MySpec](https://myspec.dev)** : version bêta dans le cloud (compte requis ; offre gratuite, sans carte bancaire) qui mène des entretiens guidés pour établir les spécifications et exporte des ensembles de quatre fichiers ou des changements compatibles avec OpenSpec. Son serveur MCP (`@myspec/mcp-server`) et les [plugins Claude Code](https://github.com/myspecs/claude-plugins) permettent aux agents de code de lire ces spécifications, d'écrire des changements OpenSpec et de les implémenter tâche par tâche. Le service envoie le contenu soumis à des fournisseurs tiers d'IA et n'est pas conçu pour les données sensibles.
- **[Entalpa](https://entalpa.com/en/openspec)** : importe le dossier `openspec/specs/` d'un dépôt GitHub public (jusqu'à 300 exigences) dans un projet consultable, ajoute des parties prenantes, des user stories et des questions ouvertes étiquetées comme déduites, et exporte le résultat sous forme d'arborescence `openspec/specs/` ; il n'écrit jamais dans le dépôt. L'import et la lecture ne nécessitent aucun compte ; l'enregistrement ou la modification en nécessitent un, et les fonctionnalités d'IA utilisent des crédits payants. Le contenu importé est envoyé à des fournisseurs tiers d'IA.
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) et [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)** : skills hébergés par SkillGild pour Claude Code, Codex, Cursor, Gemini CLI ou tout client MCP. Review publie un changement sous forme de lien que toute personne le détenant peut approuver, pour lequel elle peut demander des modifications ou commenter chaque exigence sans compte ; elle affiche la spécification principale telle qu'`openspec archive` l'écrirait et signale les exigences que d'autres changements ouverts touchent aussi. Compact repère les exigences lexicalement proches et les scénarios répétés dans les spécifications principales, puis écrit le nettoyage sous forme de changement OpenSpec. Nécessite la CLI SkillGild et un compte gratuit (25 exécutions par mois et par skill). Les deux envoient le contenu des spécifications aux serveurs de SkillGild, qui exécutent du code propriétaire et n'appellent aucun modèle d'IA ; Review envoie aussi la proposition, la conception et les tâches, et conserve le changement pendant 30 jours.

## Ajouter votre projet

Ouvrez une issue contenant la ligne que vous souhaitez ajouter : le nom de votre projet, un lien direct et une brève description de son lien avec OpenSpec. Un mainteneur l'ajoute à ce fichier.

- Présentez un projet créé avec OpenSpec ou qui en facilite l'utilisation, plutôt qu'une publicité générale pour un produit.
- Décrivez ce que les personnes peuvent en faire. Évitez les affirmations promotionnelles, les liens de parrainage et les liens de suivi.
- Indiquez dans l'entrée les fonctionnalités payantes ou les comptes requis, le cas échéant.
- Les services hébergés ou payants ne figurent dans Services hébergés que s'ils apportent une fonctionnalité d'OpenSpec que la CLI ne fournit pas déjà et proposent un moyen gratuit de les essayer. Un service qui reconditionne les skills ou les commandes d'OpenSpec n'y figure pas.

Les corrections et mises à jour des entrées existantes sont également les bienvenues.
