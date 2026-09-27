---
title: "Workflow OPSX"
---

> Feedback welcome on [Discord](https://discord.gg/YctCnvvshC).

## De quoi s’agit-il ?

OPSX est désormais le workflow standard d’OpenSpec.

C’est un **workflow fluide et itératif** pour les changements OpenSpec. Fini les phases rigides : vous pouvez effectuer des actions à tout moment.

## Pourquoi OPSX existe

L’ancien workflow OpenSpec fonctionne, mais il est **verrouillé** :

- **Instructions codées en dur** — enfouies dans le TypeScript, elles sont impossibles à modifier.
- **Tout ou rien** — une seule grosse commande crée tout, sans possibilité de tester les éléments individuellement.
- **Structure fixe** — même workflow pour tout le monde, sans personnalisation.
- **Boîte noire** — impossible d’ajuster les prompts lorsque l’IA produit un mauvais résultat.

**OPSX ouvre le système.** Tout le monde peut maintenant :

1. **Expérimenter avec les instructions** — modifier un modèle et vérifier si l’IA fait mieux.
2. **Tester de façon granulaire** — valider séparément les instructions de chaque artefact.
3. **Personnaliser les workflows** — définir ses propres artefacts et dépendances.
4. **Itérer rapidement** — modifier un modèle et le tester aussitôt, sans reconstruction.

```
Legacy workflow:                      OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Hardcoded in package  │           │  schema.yaml           │◄── You edit this
│  (can't change)        │           │  templates/*.md        │◄── Or this
│        ↓               │           │        ↓               │
│  Wait for new release  │           │  Instant effect        │
│        ↓               │           │        ↓               │
│  Hope it's better      │           │  Test it yourself      │
└────────────────────────┘           └────────────────────────┘
```

**OPSX s’adresse à tout le monde :**
- **Équipes** — créer des workflows qui correspondent aux pratiques réelles.
- **Utilisateurs avancés** — ajuster les prompts pour obtenir de meilleurs résultats sur leur base de code.
- **Contributeurs OpenSpec** — expérimenter de nouvelles approches sans publier de version.

Nous cherchons tous encore les meilleures pratiques. OPSX nous permet d’apprendre ensemble.

## Expérience utilisateur

**Le problème des workflows linéaires :**
Vous êtes « en phase de planification », puis « en phase d’implémentation », puis « terminé ». Or, le travail ne se déroule pas ainsi : vous implémentez quelque chose, découvrez que la conception est erronée, mettez à jour les spécifications et continuez. Les phases linéaires vont à l’encontre de la réalité.

**Approche OPSX :**
- **Des actions, pas des phases** — créer, implémenter, mettre à jour, archiver : à tout moment.
- **Les dépendances facilitent le travail** — elles indiquent ce qui est possible, pas ce qui est obligatoire ensuite.

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuration

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

Cette commande crée des skills dans `.claude/skills/` (ou l’emplacement équivalent), que les assistants de programmation IA détectent automatiquement.

Par défaut, OpenSpec utilise le profil de workflow `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`). Pour ajouter les commandes du workflow étendu (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), configurez-les avec `openspec config profile`, puis appliquez la configuration avec `openspec update`.

Lors de la configuration, il vous sera proposé de créer une **configuration de projet** (`openspec/config.yaml`). Cette étape est facultative, mais recommandée.

## Configuration du projet

La configuration du projet définit les valeurs par défaut et injecte le contexte propre au projet dans tous les artefacts.

### Créer la configuration

La configuration est créée pendant `openspec init` ou manuellement :

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Champs de configuration

| Champ | Type | Description |
|-------|------|-------------|
| `schema` | chaîne | Schéma par défaut des nouveaux changements (par ex. `spec-driven`) |
| `context` | chaîne | Contexte du projet injecté dans les instructions de tous les artefacts |
| `rules` | objet | Règles par artefact, indexées par identifiant d’artefact |

### Fonctionnement

**Priorité des schémas** (de la plus haute à la plus basse) :
1. Option CLI (`--schema <name>`)
2. Métadonnées du changement (`.openspec.yaml` dans son dossier)
3. Configuration du projet (`openspec/config.yaml`)
4. Valeur par défaut (`spec-driven`)

**Injection du contexte :**
- Le contexte est placé au début des instructions de chaque artefact.
- Il est encadré par les balises `<context>...</context>`.
- Il aide l’IA à comprendre les conventions du projet.

**Injection des règles :**
- Les règles ne sont injectées que pour les artefacts correspondants.
- Elles sont encadrées par les balises `<rules>...</rules>`.
- Elles apparaissent après le contexte et avant le modèle.

### Identifiants d’artefact par schéma

**spec-driven** (par défaut) :
- `proposal` — proposition de changement
- `specs` — spécifications
- `design` — conception technique
- `tasks` — tâches d’implémentation

### Validation de la configuration

- Les identifiants d’artefact inconnus dans `rules` génèrent des avertissements.
- Les noms de schémas sont vérifiés par rapport aux schémas disponibles.
- Le contexte est limité à 50 Ko.
- Les erreurs YAML sont signalées avec leur numéro de ligne.

### Dépannage

**« Unknown artifact ID in rules: X »**
- Vérifiez que les identifiants d’artefact correspondent à votre schéma (voir ci-dessus).
- Exécutez `openspec schemas --json` pour afficher les identifiants de chaque schéma.

**La configuration n’est pas appliquée :**
- Vérifiez que le fichier se trouve dans `openspec/config.yaml` (et non `.yml`).
- Vérifiez la syntaxe YAML avec un validateur.
- Les changements prennent effet immédiatement (aucun redémarrage requis).

**Contexte trop volumineux :**
- Le contexte est limité à 50 Ko.
- Résumez son contenu ou créez un lien vers une documentation plus complète.

## Commandes

| Commande | Fonction |
|---------|--------------|
| `/opsx:propose` | Créer un changement et ses artefacts de planification en une étape (parcours rapide par défaut) |
| `/opsx:explore` | Réfléchir à une idée, étudier un problème et clarifier les exigences |
| `/opsx:new` | Créer la structure d’un changement (workflow étendu) |
| `/opsx:continue` | Créer l’artefact suivant (workflow étendu) |
| `/opsx:ff` | Créer rapidement les artefacts de planification (workflow étendu) |
| `/opsx:apply` | Réaliser les tâches et mettre à jour les artefacts au besoin |
| `/opsx:update` | Réviser les artefacts de planification et les garder cohérents |
| `/opsx:verify` | Vérifier l’implémentation par rapport aux artefacts (workflow étendu) |
| `/opsx:sync` | Fusionner les spécifications différentielles dans les spécifications principales (facultatif) |
| `/opsx:archive` | Archiver une fois le travail terminé |
| `/opsx:bulk-archive` | Archiver plusieurs changements terminés (workflow étendu) |
| `/opsx:onboard` | Parcours guidé d’un changement de bout en bout (workflow étendu) |

## Utilisation

### Explorer une idée
```
/opsx:explore
```
Réfléchissez à une idée, étudiez un problème et comparez les options, sans structure imposée : Explore est votre partenaire de réflexion. Lorsque les idées se précisent, passez à `/opsx:propose` (par défaut) ou à `/opsx:new`/`/opsx:ff` (workflow étendu).

### Commencer un nouveau changement
```
/opsx:propose
```
Crée le changement et génère les artefacts de planification nécessaires avant l’implémentation.

Si vous avez activé les workflows étendus, vous pouvez plutôt utiliser :

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### Créer des artefacts
```
/opsx:continue
```
Affiche les artefacts disponibles d’après leurs dépendances et en crée un. Répétez la commande pour faire évoluer progressivement le changement.

```
/opsx:ff add-dark-mode
```
Crée tous les artefacts de planification en une fois. À utiliser lorsque votre objectif est clair.

### Implémenter (la partie fluide)
```
/opsx:apply
```
Parcourt les tâches et les coche au fur et à mesure. Si plusieurs changements sont actifs, utilisez `/opsx:apply <name>` ; sinon, la commande déduit lequel est visé de la conversation et vous demande de choisir en cas de doute.

### Mettre à jour un changement
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Révise les artefacts de planification existants du changement et les garde cohérents entre eux (une modification de conception peut se répercuter sur la proposition). La commande ne modifie jamais le code et vous demande confirmation avant chaque modification. Voir la [référence de update](/fr-FR/commands/#opsxupdate) pour savoir comment elle traite les fichiers manquants sans commencer un nouvel artefact.

Si le changement a déjà été implémenté, la commande recommande `/opsx:apply` afin d’aligner le code sur le plan révisé. Si la révision modifie l’*intention* du changement, repartez plutôt de zéro. Voir [Mettre à jour ou repartir de zéro](/fr-FR/opsx/#mettre-à-jour-ou-repartir-de-zéro).

### Synchroniser les spécifications différentielles
```text
/opsx:sync
```
Fusionne les spécifications différentielles du changement dans `openspec/specs/` sans archiver : le changement reste actif. Le delta est appliqué entièrement : les exigences de `## REMOVED` sont supprimées de la spécification principale et les exigences renommées sont retitrées sur place ; tout ce que le delta ne mentionne pas reste intact. Cette synchronisation est facultative : si elle n’a pas encore été effectuée, archive vous la propose. Utilisez-la pour actualiser les spécifications avant l’archivage, permettre à un changement parallèle de s’appuyer sur des spécifications qui viennent d’être ajoutées ou relire les spécifications principales fusionnées avant l’archivage.

### Terminer
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

<a id="when-to-update-vs-start-fresh"></a>

## Mettre à jour ou repartir de zéro

Vous pouvez toujours modifier la proposition ou les spécifications avant l’implémentation. Mais à quel moment le raffinement devient-il un travail différent ?

### Ce que consigne une proposition

Une proposition définit trois éléments :
1. **Intention** — Quel problème cherchez-vous à résoudre ?
2. **Périmètre** — Qu’est-ce qui est inclus ou exclu ?
3. **Approche** — Comment le résoudre ?

La question est : lequel de ces éléments a changé, et dans quelle mesure ?

### Mettre à jour le changement existant si :

**Même intention, exécution affinée**
- vous découvrez des cas limites qui vous avaient échappé
- l’approche doit être ajustée, mais l’objectif reste le même
- l’implémentation révèle une légère erreur de conception

**Le périmètre se réduit**
- le périmètre complet est trop vaste et vous voulez d’abord livrer un MVP
- « Ajouter le mode sombre » → « Ajouter un sélecteur de mode sombre (préférence système en version 2) »

**Corrections fondées sur de nouvelles découvertes**
- la base de code n’est pas structurée comme vous le pensiez
- une dépendance ne fonctionne pas comme prévu
- « Utiliser les variables CSS » → « Utiliser plutôt le préfixe dark: de Tailwind »

### Créer un nouveau changement si :

**L’intention a fondamentalement changé**
- le problème lui-même est différent
- « Ajouter le mode sombre » → « Créer un système de thèmes complet avec couleurs, polices et espacements personnalisés »

**Le périmètre a explosé**
- le changement a tellement grandi qu’il s’agit désormais d’un autre travail
- la proposition d’origine serait méconnaissable après les mises à jour
- « Corriger un bogue de connexion » → « Réécrire le système d’authentification »

**Le changement initial peut être terminé**
- le changement initial peut être déclaré « terminé »
- le nouveau travail est autonome, ce n’est pas un raffinement
- Terminer « Ajouter le MVP du mode sombre » → archiver → créer « Améliorer le mode sombre »

### Règles empiriques

```
                        ┌─────────────────────────────────────┐
                        │     Is this the same work?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Same intent?      >50% overlap?      Can original
             Same problem?     Same scope?        be "done" without
                    │                  │          these changes?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         YES               NO YES           NO  NO              YES
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

| Critère | Mise à jour | Nouveau changement |
|------|--------|------------|
| **Identité** | « Même travail, affiné » | « Travail différent » |
| **Chevauchement du périmètre** | Plus de 50 % de recouvrement | Moins de 50 % de recouvrement |
| **Achèvement** | Impossible de terminer sans ces modifications | Le travail initial peut être terminé ; le nouveau est autonome |
| **Historique** | La suite des mises à jour forme un récit cohérent | Les retouches embrouilleraient plus qu’elles n’éclaireraient |

### Principe

> **La mise à jour préserve le contexte. Le nouveau changement apporte de la clarté.**
>
> Mettez à jour lorsque l’historique de votre réflexion est précieux.
> Créez un nouveau changement lorsqu’il est plus clair de repartir de zéro que de retoucher l’existant.

Voyez cela comme des branches git :
- continuez à valider les changements tant que vous travaillez sur la même fonctionnalité
- créez une nouvelle branche lorsqu’il s’agit réellement d’un nouveau travail
- parfois, fusionnez une fonctionnalité partielle et repartez de zéro pour la deuxième phase

## Qu’est-ce qui change ?

| | Ancien workflow (`/openspec:proposition`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Structure** | Un grand document de proposition | Artefacts distincts et dépendances |
| **Workflow** | Phases linéaires : planifier → implémenter → archiver | Actions fluides — agir à tout moment |
| **Itération** | Retour en arrière difficile | Actualiser les artefacts au fil des découvertes |
| **Personnalisation** | Structure fixe | Piloté par des schémas (définir ses propres artefacts) |

**À retenir :** le travail n’est pas linéaire. OPSX cesse de faire semblant.

## Architecture détaillée

Cette section explique le fonctionnement interne d’OPSX et le compare à l’ancien workflow.
Les exemples utilisent les commandes étendues (`new`, `continue`, etc.) ; les personnes qui utilisent le profil `core` peuvent suivre le même parcours avec `propose → apply → sync → archive`.

### Philosophie : phases ou actions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEGACY WORKFLOW                                      │
│                    (Phase-Locked, All-or-Nothing)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │             │
│   │    PHASE     │      │    PHASE     │      │    PHASE     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Creates ALL artifacts at once                                          │
│   • Can't go back to update specs during implementation                    │
│   • Phase gates enforce linear progression                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPSX WORKFLOW                                     │
│                      (Fluid Actions, Iterative)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           ACTIONS (not phases)             │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              any order                     │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Create artifacts one at a time OR fast-forward                         │
│   • Update specs/design/tasks during implementation                        │
│   • Dependencies enable progress, phases don't exist                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture des composants

L’**ancien workflow** utilise des modèles codés en dur en TypeScript :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LEGACY WORKFLOW COMPONENTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Hardcoded Templates (TypeScript strings)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Tool-specific configurators/adapters                                      │
│                    │                                                        │
│                    ▼                                                        │
│   Generated Command Files (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Fixed structure, no artifact awareness                                  │
│   • Change requires code modification + rebuild                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** utilise des schémas externes et un moteur de graphe de dépendances :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Schema Definitions (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Dependencies                     │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Glob patterns                    │   │
│   │      requires: [proposal]      ◄── Enables after proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Artifact Graph Engine                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Topological sort (dependency ordering)                           │   │
│   │  • State detection (filesystem existence)                           │   │
│   │  • Rich instruction generation (templates + context)                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Skill Files (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Cross-editor compatible (Claude Code, Cursor, Devin)                    │
│   • Skills query CLI for structured data                                    │
│   • Fully customizable via schema files                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modèle de graphe de dépendances

Les artefacts forment un graphe orienté acyclique (DAG). Les dépendances sont des **facilitateurs**, pas des barrières :

```
                              proposal
                             (root node)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (requires:                  (requires:
               proposal)                   proposal)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                               tasks
                           (requires:
                           specs, design)
                                  │
                                  ▼
                          ┌──────────────┐
                          │ APPLY PHASE  │
                          │ (requires:   │
                          │  tasks)      │
                          └──────────────┘
```

**Transitions d’état :**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Flux d’information

**Ancien workflow** — l’agent reçoit des instructions statiques :

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Static instructions:                   │
  │  • Create proposal.md                   │
  │  • Create tasks.md                      │
  │  • Create design.md                     │
  │  • Create delta spec files              │
  │                                         │
  │  No awareness of what exists or         │
  │  dependencies between artifacts         │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent creates ALL artifacts in one go
```

**OPSX** — l’agent interroge la CLI pour obtenir le contexte nécessaire :

```
  User: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Step 1: Query current state                                             │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec status --change "add-auth" --json                      │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "artifacts": [                                                  │  │
  │  │      {"id": "proposal", "status": "done"},                         │  │
  │  │      {"id": "specs", "status": "ready"},      ◄── First ready      │  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked",                          │  │
  │  │       "missingDeps": ["specs", "design"]}                          │  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 2: Get rich instructions for ready artifact                        │
  │  ┌────────────────────────────────────────────────────────────────────┐  │
  │  │  $ openspec instructions specs --change "add-auth" --json          │  │
  │  │                                                                    │  │
  │  │  {                                                                 │  │
  │  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
  │  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
  │  │    "unlocks": ["tasks"]                                            │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Step 3: Read dependencies → Create ONE artifact → Show what's unlocked  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Modèle d’itération

**Ancien workflow** — itérations difficiles :

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Wait, the design is wrong"
       │               │
       │               ├── Options:
       │               │   • Edit files manually (breaks context)
       │               │   • Abandon and start over
       │               │   • Push through and fix later
       │               │
       │               └── No official "go back" mechanism
       │
       └── Creates ALL artifacts at once
```

**OPSX** — itérations naturelles :

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "The design is wrong"
      │                │                  │
      │                │                  ▼
      │                │            Just edit design.md
      │                │            and continue!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply picks up
      │                │         where you left off
      │                │
      │                └── Creates ONE artifact, shows what's unlocked
      │
      └── Scaffolds change, waits for direction
```

### Schémas personnalisés

Créez des workflows personnalisés à l’aide des commandes de gestion des schémas :

```bash
# Create a new schema from scratch (interactive)
openspec schema init my-workflow

# Or fork an existing schema as a starting point
openspec schema fork spec-driven my-workflow

# Validate your schema structure
openspec schema validate my-workflow

# See where a schema resolves from (useful for debugging)
openspec schema which my-workflow
```

Les schémas sont enregistrés dans `openspec/schemas/` (locaux au projet et versionnés) ou `~/.local/share/openspec/schemas/` (globaux pour l’utilisateur).

**Structure du schéma :**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Exemple de schema.yaml :**
```yaml
name: research-first
artifacts:
  - id: research        # Added before proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Now depends on research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Graphe de dépendances :**
```
   research ──► proposal ──► tasks
```

### Résumé

| Aspect | Ancien workflow | OPSX |
|--------|----------|------|
| **Modèles** | TypeScript codé en dur | YAML et Markdown externes |
| **Dépendances** | Aucune (tout est créé en une fois) | DAG avec tri topologique |
| **État** | Modèle mental fondé sur les phases | Présence des fichiers |
| **Personnalisation** | Modifier le code source, reconstruire | Créer schema.yaml |
| **Itération** | Phases verrouillées | Fluide, tout peut être modifié |
| **Éditeurs pris en charge** | Configurateurs/adaptateurs propres à chaque outil | Répertoire unique de skills |

## Schémas

Les schémas définissent les artefacts disponibles et leurs dépendances. Schéma actuellement disponible :

- **spec-driven** (par défaut) : `proposal` → `specs` → `design` → `tasks`

```bash
# List available schemas
openspec schemas

# See all schemas with their resolution sources
openspec schema which --all

# Create a new schema interactively
openspec schema init my-workflow

# Fork an existing schema for customization
openspec schema fork spec-driven my-workflow

# Validate schema structure before use
openspec schema validate my-workflow
```

## Conseils

- Utilisez `/opsx:explore` pour réfléchir à une idée avant de vous engager dans un changement
- Utilisez `/opsx:ff` si votre objectif est clair et `/opsx:continue` si vous explorez encore
- Pendant `/opsx:apply`, si un élément est incorrect, corrigez l’artefact puis continuez
- Les cases de `tasks.md` permettent de suivre l’avancement
- Consultez l’état à tout moment avec `openspec status --change "name"`

## Commentaires

Cette approche est encore en évolution, volontairement : nous cherchons ce qui fonctionne le mieux.

Vous avez trouvé un bogue ou une idée ? Rejoignez-nous sur [Discord](https://discord.gg/YctCnvvshC) ou ouvrez une issue sur [GitHub](https://github.com/Fission-AI/openspec/issues).
