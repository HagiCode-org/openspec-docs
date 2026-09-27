---
title: "Personnalisation"
---

OpenSpec propose trois niveaux de personnalisation :

| Niveau | Fonction | Idéal pour |
|--------|----------|------------|
| **Configuration du projet** | Définir les valeurs par défaut et injecter contexte/règles | La plupart des équipes |
| **Schémas personnalisés** | Définir vos propres artefacts de workflow | Équipes aux processus particuliers |
| **Remplacements globaux** | Partager les schémas entre tous les projets | Utilisateurs avancés |

---

<a id="project-configuration"></a>

## Configuration du projet

Le fichier `openspec/config.yaml` est le moyen le plus simple d'adapter OpenSpec à votre équipe. Il vous permet de :

- **Définir un schéma par défaut** — éviter `--schema` à chaque commande.
- **Injecter le contexte du projet** — l'IA connaît votre pile technique, vos conventions, etc.
- **Ajouter des règles par artefact** — définir des règles personnalisées pour certains artefacts.
- **Ajouter des consignes par opération** — fournir des préférences consultatives pour les opérations apply et archive.
- **Mémoriser les choix d'intégration** — par exemple l'activation de l'[agent de codage cloud GitHub Copilot](/fr-FR/supported-tools/#github-copilot-cloud-coding-agent).

### Configuration rapide

```bash
openspec init
```

Cette commande vous guide interactivement dans la création d'un fichier de configuration. Vous pouvez aussi le créer manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones

operations:
  apply:
    guidance:
      - Run focused tests before the full suite
  archive:
    guidance:
      - Keep the completion summary concise

# Set by `openspec init` when you choose (or decline) the GitHub Copilot
# cloud coding agent; controls whether `init`/`update` generate its files.
githubCopilot:
  cloudAgent: false
```

### Fonctionnement

**Schéma par défaut :**

```bash
# Without config
openspec new change my-feature --schema spec-driven

# With config - schema is automatic
openspec new change my-feature
```

**Injection du contexte et des règles :**

Lors de la génération de chaque artefact, le contexte et les règles sont ajoutés au prompt de l'IA :

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- Le **contexte** apparaît dans TOUS les artefacts.
- Les **règles** apparaissent UNIQUEMENT pour l'artefact correspondant.

**Consignes d'opération :**

`operations.apply.guidance` et `operations.archive.guidance` sont des listes facultatives
de consignes consultatives indiquant comment un agent devrait effectuer ces opérations.
Elles sont distinctes de `rules` : les consignes d'opération ne contraignent pas le contenu
des artefacts et les règles d'artefact ne sont jamais requalifiées en consignes d'opération.

Apply et archive récupèrent ces entrées au moment de l'exécution :

```bash
openspec instructions apply --change my-feature --json
openspec instructions archive --change my-feature --json
```

Les deux surfaces renvoient le `context` actuel du projet et `operationGuidance` le cas
échéant, dans des champs distincts. Chaque invocation lit un nouvel instantané à partir
de la racine résolue. Avec `--store <id>`, le changement, le contexte et les consignes
proviennent tous de ce store plutôt que du dépôt courant. La commande d'instructions
d'archive est en lecture seule : elle n'examine ni ne fusionne les spécifications
différentielles, n'écrit pas dans les spécifications principales, ne déplace pas le
changement et ne lance pas le workflow d'archivage statique.

Le contexte du projet est une entrée obligatoire au niveau du prompt. Les workflows
générés le lisent et appliquent les informations, conventions et contraintes pertinentes
du projet. Les consignes d'opération sont des conseils facultatifs et complémentaires :
les workflows tiennent compte de toutes les entrées et suivent celles qui sont applicables
et compatibles avec le workflow intégré.

Les deux champs restent distincts de l'état contrôlé par la CLI, des chemins résolus,
des étapes intégrées, des choix explicites de l'utilisateur et des règles d'artefact.
En cas de conflit avec le contexte, un workflow le signale tout en conservant la valeur
qui fait autorité. Il ne suit pas les consignes inapplicables ou contradictoires et
explique pourquoi. Aucun de ces champs n'est vérifié automatiquement ; les workflows
ne recopient pas leur texte dans les fichiers d'implémentation, spécifications, artefacts
de changement ou résumés, sauf demande distincte de l'utilisateur.

**Sécurité des entrées d'archivage et de synchronisation des spécifications :**

L'archivage, l'archivage groupé et la synchronisation autonome utilisent
`artifactPaths.specs.existingOutputPaths` provenant de `openspec status --json` comme
seule source de spécifications différentielles. Un schéma sans artefact `specs`, ou un
changement dont la liste de sorties concrètes est vide, n'a rien à synchroniser ; les
autres artefacts ne sont pas utilisés pour déduire des spécifications différentielles.

Avant qu'une fusion sémantique n'écrive dans une spécification principale, le workflow
utilise le résultat actuel de
`openspec instructions specs --change <name> --json`. Les règles `specs` obtenues
contraignent uniquement les spécifications principales produites par cette fusion.
L'archivage individuel transmet cet instantané à la synchronisation intégrée ;
la synchronisation autonome le récupère directement ; l'archivage groupé récupère
tous les instantanés nécessaires avant la première écriture de spécification. Une
réponse non nulle ou un JSON d'instructions d'archive/spécifications invalide est un
échec de consultation, pas une entrée vide : le workflow s'arrête avant toute écriture
de spécification concernée ou tout déplacement de changement (pour un archivage groupé,
avant toute écriture ou déplacement du lot).

Cette configuration ne modifie ni les phases d'exécution de l'archivage, ni les invites
utilisateur, les opérations sur le système de fichiers, la responsabilité de la fusion
sémantique, la commande directe `openspec archive`, ni la structure et la sortie des
`rules` d'artefact.

### Ordre de résolution du schéma

Lorsqu'OpenSpec doit sélectionner un schéma, il vérifie les sources dans cet ordre :

1. Option CLI : `--schema <name>`
2. Métadonnées du changement (`.openspec.yaml` dans le dossier du changement)
3. Configuration du projet (`openspec/config.yaml`)
4. Valeur par défaut (`spec-driven`)

---

<a id="custom-schemas"></a>

## Schémas personnalisés

Si la configuration du projet ne suffit pas, créez votre propre schéma avec un workflow entièrement personnalisé. Les schémas du projet se trouvent dans `openspec/schemas/` et sont versionnés avec le code.

```text
your-project/
├── openspec/
│   ├── config.yaml        # Project config
│   ├── schemas/           # Custom schemas live here
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # Your changes
└── src/
```

### Dupliquer un schéma existant

Pour personnaliser rapidement un workflow intégré, dupliquez-le :

```bash
openspec schema fork spec-driven my-workflow
```

La commande copie tout le schéma `spec-driven` dans `openspec/schemas/my-workflow/`, où vous pouvez le modifier librement.

**Fichiers créés :**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # Workflow definition
└── templates/
    ├── proposal.md       # Template for proposal artifact
    ├── spec.md           # Template for specs
    ├── design.md         # Template for design
    └── tasks.md          # Template for tasks
```

Modifiez `schema.yaml` pour changer le workflow ou les modèles pour changer les résultats générés par l'IA.

### Créer un schéma de zéro

Pour un workflow entièrement nouveau :

```bash
# Interactive
openspec schema init research-first

# Non-interactive
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### Structure d'un schéma

Un schéma définit les artefacts de votre workflow et leurs dépendances :

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # Can't create design until proposal exists

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**Champs clés :**

| Champ | Rôle |
|-------|------|
| `id` | Identifiant unique utilisé dans les commandes et les règles |
| `generates` | Nom du fichier généré (accepte les motifs glob comme `specs/**/*.md`) |
| `template` | Fichier modèle dans le répertoire `templates/` |
| `instruction` | Instructions données à l'IA pour créer l'artefact |
| `requires` | Dépendances : artefacts qui doivent exister au préalable |

Énumérez les artefacts dans l'ordre où vous souhaitez les rédiger. `requires` définit
ce qui est possible ; l'ordre de la liste `artifacts:` détermine ce qui vient en premier
lorsque plusieurs artefacts sont prêts en même temps.

### Modèles

Les modèles sont des fichiers Markdown qui guident l'IA. Ils sont ajoutés au prompt lors de la création de l'artefact correspondant.

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

Les modèles peuvent contenir :
- des titres de section à remplir par l'IA ;
- des commentaires HTML donnant des indications à l'IA ;
- des exemples présentant la structure attendue.

### Valider votre schéma

Avant d'utiliser un schéma personnalisé, validez-le :

```bash
openspec schema validate my-workflow
```

Cette commande vérifie :
- la syntaxe de `schema.yaml` ;
- l'existence de tous les modèles référencés ;
- l'absence de dépendances circulaires ;
- la validité des identifiants d'artefact.

### Utiliser votre schéma personnalisé

Une fois créé, utilisez le schéma ainsi :

```bash
# Specify on command
openspec new change feature --schema my-workflow

# Or set as default in config.yaml
schema: my-workflow
```

### Diagnostiquer la résolution d'un schéma

Vous ne savez pas quel schéma est utilisé ? Vérifiez-le ainsi :

```bash
# See where a specific schema resolves from
openspec schema which my-workflow

# List all available schemas
openspec schema which --all
```

Le résultat indique si le schéma provient du projet, du répertoire utilisateur ou du paquet :

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **Remarque :** OpenSpec prend également en charge les schémas au niveau utilisateur dans `~/.local/share/openspec/schemas/` pour le partage entre projets. Nous recommandons toutefois les schémas au niveau du projet, dans `openspec/schemas/`, car ils sont versionnés avec le code.

---

## Exemples

### Workflow d'itération rapide

Workflow minimal pour des itérations rapides :

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Ajouter un artefact de revue

Dupliquez le schéma par défaut et ajoutez une étape de revue :

```bash
openspec schema fork spec-driven with-review
```

Modifiez ensuite `schema.yaml` pour ajouter :

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # Now tasks require review too
```

---

## Schémas communautaires

OpenSpec prend aussi en charge des schémas entretenus par la communauté et distribués dans des dépôts autonomes. Ils proposent des workflows avec des choix affirmés, intégrant OpenSpec à d'autres outils ou systèmes, à l'image du [catalogue d'extensions communautaires de github/spec-kit](https://github.com/github/spec-kit/tree/main/extensions).

Les schémas communautaires ne sont pas inclus dans OpenSpec Core : ils résident dans leurs propres dépôts et suivent leurs propres calendriers de publication. Pour les utiliser, copiez le schéma dans `openspec/schemas/<schema-name>/` de votre projet (le README de chaque dépôt fournit les instructions d'installation).

| Schéma | Responsable | Dépôt | Description |
|--------|-------------|-------|-------------|
| `intent-driven` | @harikrishnan83 | [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven) | Consigne l'intention du changement, son comportement observable, sa conception technique et les décisions d'architecture durables avant l'implémentation. Ajoute un manifeste de revue des ADR propre au changement et enregistre les décisions pérennes qui le méritent sous forme d'ADR immuables pouvant être remplacés par de nouveaux. |
| `superpowers-bridge` | @JiangWay | [JiangWay/openspec-schemas](https://github.com/JiangWay/openspec-schemas/tree/main/superpowers-bridge) | Intègre la gouvernance des artefacts OpenSpec aux skills d'exécution de [obra/superpowers](https://github.com/obra/superpowers) (réflexion, rédaction de plans, TDD avec sous-agents, revue du code et finalisation). Ajoute un artefact `retrospective` fondé sur des preuves, comblant une lacune de Superpowers. |
| `nanopm` | @nmrtn | [nmrtn/nanopm](https://github.com/nmrtn/nanopm/tree/main/openspec-schema) | Workflow axé sur le produit. Exécute en amont de l'implémentation le processus de planification de [nanopm](https://github.com/nmrtn/nanopm) (audit → stratégie → feuille de route → PRD), puis relie cette planification produit au workflow d'ingénierie piloté par les spécifications d'OpenSpec. Le cas échéant, les artefacts sont lus dans `.nanopm/` : la proposition s'appuie sur l'audit, la conception sur la stratégie et les tâches sur le découpage du PRD. |
| `e2e-runbooks` | @Lukk17 | [Lukk17/openspec-schemas](https://github.com/Lukk17/openspec-schemas/tree/master/openspec/schemas/e2e-runbooks) | Procédures de tests de bout en bout au niveau des fonctionnalités. Chaque fonctionnalité reçoit une spécification immuable, un modèle de tâches immuable et un compte rendu horodaté par exécution. Les assertions portent uniquement sur des comportements observables (statut HTTP, corps de réponse, état persistant — jamais des sous-chaînes de journaux). Chaque exécution consigne ses heures de début et de fin UTC, sa durée et une estimation du nombre de jetons consommés par le modèle de langage. |
| `anvil` | @jikkujoyce | [jikkujoyce/openspec-schemas](https://github.com/jikkujoyce/openspec-schemas/tree/main/schemas/anvil) | Workflow piloté par les spécifications avec discipline TDD et revue contradictoire. Parcours : `proposal` → `specs` → `design` → `review` → `test-plan` → `tasks` → `apply` → `verify`. `review` est rédigé par un relecteur en lecture seule, avec un contexte vierge (un second modèle si disponible), et émet une ligne `VERDICT:` qui demande à l'agent de bloquer `test-plan`, `tasks` et `apply` jusqu'à approbation. OpenSpec vérifie uniquement la présence des artefacts : utilisez votre propre CI ou hook pour imposer cette étape. `test-plan` associe chaque scénario de spécification à un test nommé et sert aussi de registre rouge/vert audité par `verify`. |

> Vous souhaitez contribuer un schéma communautaire ? Ouvrez une issue contenant un lien vers votre dépôt, ou envoyez une PR ajoutant une ligne à ce tableau.

---

## Voir aussi

- [Référence CLI : commandes de schéma](/fr-FR/cli/#schema-commands) — documentation complète des commandes
