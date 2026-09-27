---
title: "Migrer vers OPSX"
---

Ce guide vous accompagne dans la migration de l’ancien workflow OpenSpec vers OPSX. La transition est conçue pour être fluide : votre travail est préservé et le nouveau système offre davantage de souplesse.

## Qu’est-ce qui change ?

OPSX remplace l’ancien workflow à phases verrouillées par une approche fluide fondée sur des actions. Voici la différence essentielle :

| Aspect | Ancien workflow | OPSX |
|--------|--------|------|
| **Commandes** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Par défaut : `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive` (commandes du workflow étendu facultatives) |
| **Workflow** | Créer tous les artefacts d’un coup | Créer progressivement ou tout d’un coup, selon votre choix |
| **Revenir en arrière** | Étapes de phase contraignantes | Naturel : modifier n’importe quel artefact à tout moment |
| **Personnalisation** | Structure fixe | Piloté par des schémas, entièrement adaptable |
| **Configuration** | `CLAUDE.md` avec marqueurs + `project.md` | Configuration claire dans `openspec/config.yaml` |

**Le changement de philosophie :** le travail n’est pas linéaire. OPSX cesse de faire semblant.

---

## Avant de commencer

### Votre travail existant est préservé

La migration est conçue pour préserver vos travaux :

- **Changements actifs dans `openspec/changes/`** — entièrement préservés et toujours accessibles avec les commandes OPSX.
- **Changements archivés** — laissés intacts ; votre historique est conservé.
- **Spécifications principales dans `openspec/specs/`** — laissées intactes ; elles restent votre source de vérité.
- **Votre contenu dans CLAUDE.md, AGENTS.md, etc.** — préservé. Seuls les blocs de marqueur OpenSpec sont supprimés ; tout ce que vous avez écrit est conservé.

### Éléments supprimés

Seuls les fichiers gérés par OpenSpec et remplacés par la nouvelle version :

| Élément | Motif |
|------|-----|
| Anciens répertoires/fichiers de commandes slash | Remplacés par le nouveau système de skills |
| `openspec/AGENTS.md` | Déclencheur de workflow obsolète |
| Marqueurs OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc. | Devenus inutiles |

**Emplacements des anciennes commandes selon l’outil** (exemples, susceptibles de varier) :

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop, anciennement Windsurf : `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot : `.github/prompts/openspec-*.prompt.md` (extensions IDE uniquement ; non pris en charge par Copilot CLI)
- Codex : OpenSpec utilise désormais le chemin canonique `.agents/skills/openspec-*`. Les fichiers `SKILL.md` gérés par OpenSpec dans l’ancien chemin `.codex/skills` ne sont rapprochés qu’après la création de leurs remplacements ; les fichiers personnalisés et copies divergentes sont conservés. Si une arborescence `.agents` sans marqueur contient déjà des skills OpenSpec, OpenSpec conserve la forme Codex (`$openspec-*`) ou générique (`/openspec-*`) existante au lieu de la déduire de l’ancien répertoire. Pour lui en transférer explicitement la gestion, choisissez `codex` avec `openspec init`. Le nettoyage des anciennes invites cible toujours uniquement les noms de fichiers Codex autorisés par OpenSpec dans `$CODEX_HOME/prompts` ou `~/.codex/prompts`.
- Et d’autres outils (Augment, Continue, Amazon Q, etc.)

La migration détecte les outils que vous avez configurés et nettoie leurs anciens fichiers.

La liste de suppression peut sembler longue, mais elle ne contient que des fichiers initialement créés par OpenSpec. Votre propre contenu n’est jamais supprimé.

### Éléments à traiter

Un fichier doit être migré manuellement :

**`openspec/project.md`** — ce fichier n’est pas supprimé automatiquement, car il peut contenir du contexte que vous avez rédigé sur le projet. Vous devrez :

1. Examiner son contenu
2. Déplacer les informations utiles dans `openspec/config.yaml` (voir ci-dessous)
3. Supprimer le fichier lorsque vous êtes prêt

**Pourquoi ce changement :**

L’ancien `project.md` était passif : les agents pouvaient le lire ou non, puis oublier son contenu. Nous avons constaté que les résultats manquaient de fiabilité.

Le nouveau contexte de `config.yaml` est **activement injecté dans chaque requête de planification OpenSpec**. Vos conventions, votre pile technique et vos règles sont donc toujours présentes lorsque l’IA crée des artefacts, ce qui améliore la fiabilité.

**La contrepartie :**

Le contexte étant injecté dans chaque requête, soyez concis et concentrez-vous sur l’essentiel :
- la pile technique et les conventions principales
- les contraintes non évidentes que l’IA doit connaître
- les règles souvent ignorées auparavant

Ne cherchez pas la perfection dès le début. Nous découvrons encore ce qui fonctionne le mieux et améliorerons l’injection de contexte au fil de nos essais.

---

## Exécuter la migration

`openspec init` et `openspec update` détectent les anciens fichiers et vous guident dans le même processus de nettoyage. Choisissez la commande adaptée à votre situation :

- Les nouvelles installations utilisent par défaut le profil `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`).
- Les installations migrées préservent les workflows précédemment installés et créent un profil `custom` au besoin.

### Utiliser `openspec init`

Exécutez cette commande pour ajouter des outils ou reconfigurer ceux qui sont déjà installés :

```bash
openspec init
```

La commande init détecte les anciens fichiers et vous guide dans leur nettoyage :

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Si vous répondez oui :**

1. Les anciens répertoires de commandes slash sont supprimés.
2. Les marqueurs OpenSpec sont retirés de `CLAUDE.md`, `AGENTS.md`, etc. (votre contenu est préservé).
3. `openspec/AGENTS.md` est supprimé.
4. Les nouveaux skills sont installés dans `.claude/skills/`.
5. `openspec/config.yaml` est créé avec un schéma par défaut.

### Utiliser `openspec update`

Exécutez cette commande pour migrer et actualiser vos outils existants vers la version la plus récente :

```bash
openspec update
```

La commande update détecte et nettoie aussi les anciens artefacts, puis actualise les skills et commandes générés selon le profil et les paramètres de distribution actuels.

### Environnements non interactifs et CI

Pour effectuer la migration avec un script :

```bash
openspec init --force --tools claude
```

L’option `--force` ignore les invites et accepte automatiquement le nettoyage.

Cela comprend le nettoyage des fichiers d’invite Codex gérés par OpenSpec dans le répertoire global correspondant. Seuls les anciens noms autorisés par OpenSpec sont ciblés ; les fichiers ne sont supprimés qu’après la création de leurs remplacements `.agents/skills/openspec-*`, et tous les autres fichiers sont préservés.

---

<a id="migrating-projectmd-to-configyaml"></a>

## Migrer project.md vers config.yaml

L’ancien `openspec/project.md` était un fichier Markdown libre contenant le contexte du projet. Le nouveau `openspec/config.yaml` est structuré et, surtout, **injecté dans chaque requête de planification**, afin que vos conventions soient toujours présentes lorsque l’IA travaille.

### Avant (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Après (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Différences principales

| project.md | config.yaml |
|------------|-------------|
| Markdown libre | YAML structuré |
| Un seul bloc de texte | Contexte séparé des règles par artefact |
| Utilisation incertaine | Le contexte apparaît dans TOUS les artefacts ; les règles uniquement dans les artefacts correspondants |
| Aucun choix de schéma | Le champ explicite `schema:` définit le workflow par défaut |

### Éléments à conserver ou à supprimer

Lors de la migration, faites le tri. Demandez-vous : « L’IA a-t-elle besoin de cette information pour *chaque* requête de planification ? »

**À placer dans `context:` :**
- la pile technique (langages, frameworks, bases de données)
- les principaux modèles d’architecture (monorepo, microservices, etc.)
- les contraintes non évidentes (« nous ne pouvons pas utiliser la bibliothèque X parce que… »)
- les conventions importantes souvent ignorées

**À placer plutôt dans `rules:` :**
- le format propre à un artefact (« utiliser Étant donné/Quand/Alors dans les spécifications »)
- les critères de revue (« les propositions doivent comporter un plan de retour arrière »)
- ces règles ne s’appliquent qu’à l’artefact concerné et allègent les autres requêtes

**À omettre complètement :**
- les bonnes pratiques générales que l’IA connaît déjà
- les longues explications qui peuvent être résumées
- le contexte historique sans effet sur le travail actuel

### Étapes de migration

1. **Créer config.yaml** (si init ne l’a pas déjà créé) :
   ```yaml
   schema: spec-driven
   ```

2. **Ajouter le contexte** (restez concis : il est inclus dans chaque requête) :
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **Ajouter des règles par artefact** (facultatif) :
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **Supprimer project.md** après avoir transféré toutes les informations utiles.

**Ne vous compliquez pas la tâche.** Commencez par l’essentiel et améliorez le document au fil du temps. Ajoutez les informations importantes que l’IA oublie et supprimez celles qui l’alourdissent. C’est un document évolutif.

### Besoin d’aide ? Utilisez cette consigne

Si vous ne savez pas comment condenser votre project.md, demandez à votre assistant IA :

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

L’IA vous aidera à distinguer l’essentiel de ce qui peut être supprimé.

---

## Nouvelles commandes

La disponibilité des commandes dépend du profil :

**Par défaut (profil `core`) :**

| Commande | Rôle |
|---------|---------|
| `/opsx:propose` | Créer un changement et générer ses artefacts de planification en une étape |
| `/opsx:explore` | Réfléchir librement à des idées |
| `/opsx:apply` | Réaliser les tâches de tasks.md |
| `/opsx:update` | Réviser et harmoniser les artefacts de planification d’un changement |
| `/opsx:sync` | Fusionner les spécifications différentielles dans les spécifications principales |
| `/opsx:archive` | Terminer et archiver le changement |

**Workflow étendu (sélection personnalisée) :**

| Commande | Rôle |
|---------|---------|
| `/opsx:new` | Créer la structure d’un nouveau changement |
| `/opsx:continue` | Créer l’artefact suivant (un à la fois) |
| `/opsx:ff` | Avancer rapidement — créer tous les artefacts de planification d’un coup |
| `/opsx:verify` | Vérifier que l’implémentation correspond aux spécifications |
| `/opsx:bulk-archive` | Archiver plusieurs changements en une fois |
| `/opsx:onboard` | Parcours guidé d’intégration de bout en bout |

Activez les commandes étendues avec `openspec config profile`, puis exécutez `openspec update`.

### Correspondance des anciennes commandes

| Ancienne commande | Équivalent OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (par défaut) ou `/opsx:new` puis `/opsx:ff` (workflow étendu) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nouvelles fonctionnalités

Ces fonctionnalités font partie du jeu de commandes du workflow étendu.

**Création détaillée des artefacts :**
```
/opsx:continue
```
Crée les artefacts un à un en fonction de leurs dépendances. Utilisez cette commande pour examiner chaque étape.

**Mode exploration :**
```
/opsx:explore
```
Réfléchissez avec un partenaire avant de vous engager dans un changement.

---

## Comprendre la nouvelle architecture

### Des phases verrouillées à la fluidité

L’ancien workflow imposait une progression linéaire :

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX utilise des actions, pas des phases :

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Graphe de dépendances

Les artefacts forment un graphe orienté. Les dépendances facilitent le travail, elles ne le bloquent pas :

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
```

Lorsque vous exécutez `/opsx:continue`, la commande vérifie les artefacts prêts et propose le suivant. Vous pouvez également créer plusieurs artefacts prêts, dans n’importe quel ordre.

### Skills et commandes

L’ancien système utilisait des fichiers de commande propres à chaque outil :

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX utilise la nouvelle norme des **skills** :

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Les skills sont reconnus par plusieurs outils de programmation IA et contiennent des métadonnées plus riches.

Dans OPSX, Codex n’utilise que des skills. OpenSpec ne génère plus de fichiers de prompt Codex personnalisés ; utilisez plutôt les répertoires `.agents/skills/openspec-*` générés.

---

## Continuer les changements existants

Les changements en cours fonctionnent directement avec les commandes OPSX.

**Vous avez un changement actif de l’ancien workflow ?**

```
/opsx:apply add-my-feature
```

OPSX lit les artefacts existants et reprend là où vous vous étiez arrêté.

**Vous voulez ajouter des artefacts à un changement existant ?**

```
/opsx:continue add-my-feature
```

La commande affiche les artefacts que vous pouvez créer à partir de ceux qui existent déjà.

**Besoin de consulter l’état ?**

```bash
openspec status --change add-my-feature
```

---

## Nouveau système de configuration

### Structure de config.yaml

```yaml
# Required: Default schema for new changes
schema: spec-driven

# Optional: Project context (max 50KB)
# Injected into ALL artifact instructions
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Optional: Per-artifact rules
# Only injected into matching artifacts
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### Résolution du schéma

OPSX recherche le schéma à utiliser dans cet ordre :

1. **Option CLI** : `--schema <name>` (priorité la plus élevée)
2. **Métadonnées du changement** : `.openspec.yaml` dans le dossier du changement
3. **Configuration du projet** : `openspec/config.yaml`
4. **Valeur par défaut** : `spec-driven`

### Schémas disponibles

| Schéma | Artefacts | Idéal pour |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | La plupart des projets |

Lister tous les schémas disponibles :

```bash
openspec schemas
```

### Schémas personnalisés

Créer votre propre workflow :

```bash
openspec schema init my-workflow
```

Ou dupliquer un schéma existant :

```bash
openspec schema fork spec-driven my-workflow
```

Pour en savoir plus, consultez [Personnalisation](/fr-FR/customization/).

---

## Dépannage

### « Legacy files detected in non-interactive mode »

Vous travaillez dans un environnement CI ou non interactif. Utilisez :

```bash
openspec init --force
```

### Les commandes n’apparaissent pas après la migration

Redémarrez votre IDE : les skills sont détectés au démarrage.

### « Unknown artifact ID in rules »

Vérifiez que les clés de `rules:` correspondent aux identifiants d’artefact du schéma :

- **spec-driven** : `proposal`, `specs`, `design`, `tasks`

Exécutez cette commande pour afficher les identifiants d’artefact valides :

```bash
openspec schemas --json
```

### La configuration n’est pas appliquée

1. Vérifiez que le fichier se trouve dans `openspec/config.yaml` (et non `.yml`).
2. Validez la syntaxe YAML.
3. Les changements de configuration prennent effet immédiatement ; aucun redémarrage n’est nécessaire.

### project.md n’a pas été migré

Le système préserve délibérément `project.md`, car il peut contenir du contenu personnalisé. Examinez-le, transférez les éléments utiles dans `config.yaml`, puis supprimez-le.

### Voir ce qui serait nettoyé ?

Exécutez init et refusez le nettoyage : vous verrez le résumé complet de la détection sans qu’aucune modification soit effectuée.

---

## Référence rapide

### Fichiers après migration

```
project/
├── openspec/
│   ├── specs/                    # Unchanged
│   ├── changes/                  # Unchanged
│   │   └── archive/              # Unchanged
│   └── config.yaml               # NEW: Project configuration
├── .claude/
│   └── skills/                   # NEW: OPSX skills
│       ├── openspec-propose/     # default core profile
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-update-change/
│       ├── openspec-sync-specs/
│       ├── openspec-archive-change/
│       └── ...                   # expanded profile adds new/continue/ff/etc.
├── CLAUDE.md                     # OpenSpec markers removed, your content preserved
└── AGENTS.md                     # OpenSpec markers removed, your content preserved
```

### Éléments supprimés

- `.claude/commands/openspec/` — remplacé par `.claude/skills/`
- `openspec/AGENTS.md` — obsolète
- `openspec/project.md` — à migrer vers `config.yaml`, puis à supprimer
- blocs de marqueur OpenSpec dans `CLAUDE.md`, `AGENTS.md`, etc.

### Pense-bête des commandes

```text
/opsx:propose      Start quickly (default core profile)
/opsx:apply        Implement tasks
/opsx:archive      Finish and archive

# Expanded workflow (if enabled):
/opsx:new          Scaffold a change
/opsx:continue     Create next artifact
/opsx:ff           Create planning artifacts
```

---

## Obtenir de l’aide

- **Discord** : [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Issues GitHub** : [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentation :** [Guide OPSX](/fr-FR/opsx/) pour la référence complète d’OPSX
