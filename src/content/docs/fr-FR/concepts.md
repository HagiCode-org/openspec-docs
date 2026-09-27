---
title: "Concepts"
---

Ce guide présente les idées fondamentales d’OpenSpec et leurs liens. Pour la mise en pratique, consultez [Bien démarrer](/fr-FR/getting-started/) et [Workflows](/fr-FR/workflows/).

## Philosophie

OpenSpec repose sur quatre principes :

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Pourquoi ces principes sont importants

**Fluide, pas rigide.** Les systèmes de spécification traditionnels vous enferment dans des phases : planifier, implémenter, puis terminer. OpenSpec est plus souple : vous créez les artefacts dans l’ordre adapté à votre travail.

**Itératif, pas en cascade.** Les exigences évoluent et la compréhension s’approfondit. Une approche qui semblait bonne au départ peut ne plus convenir après examen de la base de code. OpenSpec accepte cette réalité.

**Simple, pas complexe.** Certains cadres de spécification exigent une longue configuration, des formats rigides ou des processus lourds. OpenSpec ne vous encombre pas : initialisez-le en quelques secondes, commencez aussitôt et personnalisez-le uniquement si nécessaire.

**Adapté d’abord à l’existant.** La plupart des travaux logiciels modifient des systèmes existants plutôt que de partir de zéro. Les deltas OpenSpec permettent de spécifier facilement les changements de comportement, pas seulement de décrire de nouveaux systèmes.

## Vue d’ensemble

OpenSpec organise le travail en deux zones principales :

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Les **spécifications** constituent la source de vérité : elles décrivent le comportement actuel de votre système.

Les **changements** sont des modifications proposées ; ils restent dans des dossiers séparés jusqu’à leur fusion.

Cette séparation est essentielle. Vous pouvez travailler en parallèle sur plusieurs changements sans conflit, en examiner un avant qu’il ne touche aux spécifications principales et, à son archivage, fusionner proprement ses deltas dans la source de vérité.

<a id="specs"></a>

## Spécifications

Les spécifications décrivent le comportement du système à l’aide d’exigences structurées et de scénarios.

### Structure

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Organisez les spécifications par domaine, c’est-à-dire en groupes logiques adaptés à votre système. Exemples courants :

- **Par domaine fonctionnel** : `auth/`, `payments/`, `search/`
- **Par composant** : `api/`, `frontend/`, `workers/`
- **Par contexte délimité** : `ordering/`, `fulfillment/`, `inventory/`

### Format des spécifications

Une spécification contient des exigences, chacune accompagnée de scénarios :

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Éléments clés :**

| Élément | Rôle |
|---------|---------|
| `## Purpose` | Description générale du domaine couvert par la spécification |
| `### Requirement:` | Comportement précis attendu du système |
| `#### Scenario:` | Exemple concret de l’exigence en action |
| SHALL/MUST/SHOULD | Mots-clés RFC 2119 indiquant le degré d’obligation |

### Pourquoi structurer les spécifications ainsi

**Les exigences décrivent le « quoi »** : ce que le système doit faire, sans préciser son implémentation.

**Les scénarios décrivent le « quand »** : des exemples concrets et vérifiables. Un bon scénario :
- peut être testé (il pourrait servir à écrire un test automatisé)
- couvre le parcours nominal et les cas limites
- utilise le format Étant donné/Quand/Alors ou une structure comparable

Les **mots-clés RFC 2119** (SHALL, MUST, SHOULD, MAY) indiquent l’intention :
- **MUST/SHALL** — obligation absolue
- **SHOULD** — recommandé, mais des exceptions sont possibles
- **MAY** — facultatif

<a id="what-a-spec-is-and-is-not"></a>

### Ce qu’est (et n’est pas) une spécification

Une spécification est un **contrat de comportement**, pas un plan d’implémentation.

Une spécification peut décrire :
- les comportements observables dont dépendent les utilisateurs ou les systèmes en aval
- les entrées, sorties et conditions d’erreur
- les contraintes externes (sécurité, confidentialité, fiabilité, compatibilité)
- les scénarios pouvant être testés ou validés explicitement

Évitez d’inclure dans les spécifications :
- les noms de classes et de fonctions internes
- les choix de bibliothèques ou de frameworks
- les détails d’implémentation étape par étape
- les plans d’exécution détaillés (à mettre dans `design.md` ou `tasks.md`)

Test rapide :
- Si l’implémentation peut changer sans modifier le comportement visible de l’extérieur, elle ne relève probablement pas de la spécification.

### Rester léger : rigueur progressive

OpenSpec vise à éviter la bureaucratie. Choisissez le niveau le plus léger qui permette malgré tout de vérifier le changement.

**Spécification légère (par défaut) :**
- des exigences brèves, axées sur le comportement
- un périmètre et des exclusions explicites
- quelques critères d’acceptation concrets

**Spécification complète (risque élevé) :**
- changements entre équipes ou dépôts
- modifications d’API ou de contrat, migrations, enjeux de sécurité ou de confidentialité
- changements où une ambiguïté risque d’entraîner un travail correctif coûteux

La plupart des changements devraient conserver le format léger.

### Collaboration entre personnes et agents

Dans de nombreuses équipes, les personnes explorent le problème et les agents rédigent les artefacts. Le cycle prévu est le suivant :

1. La personne fournit l’intention, le contexte et les contraintes.
2. L’agent traduit ces éléments en exigences et scénarios axés sur le comportement.
3. L’agent place les détails d’implémentation dans `design.md` et `tasks.md`, pas dans `spec.md`.
4. La validation vérifie la structure et la clarté avant l’implémentation.

Les spécifications restent ainsi lisibles pour les personnes et cohérentes pour les agents.

## Changements

Un changement est une modification proposée au système, regroupée dans un dossier contenant tout le nécessaire pour la comprendre et la réaliser.

### Structure d’un changement

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs, retire_capabilities
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Chaque changement est autonome et comprend :
- des **artefacts** — documents qui consignent l’intention, la conception et les tâches
- des **spécifications différentielles** — description de ce qui est ajouté, modifié ou supprimé
- des **métadonnées** — configuration facultative propre à ce changement

### Pourquoi les changements sont des dossiers

Regrouper un changement dans un dossier présente plusieurs avantages :

1. **Tout au même endroit.** Proposition, conception, tâches et spécifications sont rassemblées. Inutile de chercher dans plusieurs emplacements.

2. **Travail parallèle.** Plusieurs changements peuvent coexister sans conflit. Travaillez sur `add-dark-mode` pendant que `fix-auth-bug` est également en cours.

3. **Historique clair.** Lorsqu’ils sont archivés, les changements passent dans `changes/archive/` avec tout leur contexte. Vous pourrez comprendre ce qui a changé, mais aussi pourquoi.

4. **Faciles à examiner.** Ouvrez le dossier d’un changement pour lire sa proposition, consulter sa conception et vérifier ses deltas.

<a id="artifacts"></a>

## Artefacts

Les artefacts sont les documents d’un changement qui guident le travail.

### Enchaînement des artefacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Les artefacts s’appuient les uns sur les autres ; chacun fournit le contexte nécessaire au suivant.

### Types d’artefacts

#### Proposition (`proposal.md`)

La proposition résume l’**intention**, le **périmètre** et l’**approche** générale.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Quand mettre à jour la proposition :**
- le périmètre change (réduction ou extension)
- l’intention se précise (meilleure compréhension du problème)
- l’approche évolue fondamentalement

#### Spécifications (delta specs in `specs/`)

Les spécifications différentielles décrivent **les changements** par rapport aux spécifications actuelles. Voir [Spécifications différentielles](/fr-FR/concepts/#delta-specs) ci-dessous.

#### Conception (`design.md`)

La conception décrit l’**approche technique** et les **décisions d’architecture**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Quand mettre à jour la conception :**
- l’implémentation révèle que l’approche ne fonctionnera pas
- une meilleure solution est découverte
- les dépendances ou les contraintes changent

#### Tâches (`tasks.md`)

Les tâches forment la **liste de contrôle de l’implémentation** : des étapes concrètes à cocher.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Bonnes pratiques pour les tâches :**
- regrouper les tâches liées sous des titres
- utiliser une numérotation hiérarchique (1.1, 1.2, etc.)
- garder les tâches assez petites pour être terminées en une séance
- préciser comment vérifier chaque tâche (test, commande ou résultat observable)
- intégrer dans chaque groupe les tests et la documentation requis par son travail, plutôt que dans un groupe final de rattrapage
- cocher les tâches au fur et à mesure

<a id="delta-specs"></a>

## Spécifications différentielles

Les spécifications différentielles sont la notion qui permet à OpenSpec de s’adapter aux projets existants. Elles décrivent **ce qui change** au lieu de répéter toute la spécification.

### Format

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Sections du delta

| Section | Signification | Effet de l’archivage |
|---------|---------|------------------------|
| `## ADDED Requirements` | Nouveau comportement | Ajouté à la spécification principale |
| `## MODIFIED Requirements` | Comportement modifié | Remplace l’exigence existante |
| `## REMOVED Requirements` | Comportement abandonné | Supprimé de la spécification principale ; retirer la dernière exigence supprime la fonctionnalité et son fichier de spécification si le changement déclare `retire_capabilities: true` |
| `## Purpose` | Rôle d’une nouvelle fonctionnalité | Initialise le Purpose de la spécification principale créée ; ignoré si elle existe déjà |

### Pourquoi utiliser des deltas plutôt que des spécifications complètes

**Clarté.** Un delta montre précisément ce qui change. Avec une spécification complète, il faudrait la comparer mentalement à la version actuelle.

**Prévention des conflits.** Deux changements peuvent modifier le même fichier sans conflit s’ils touchent des exigences différentes.

**Revue efficace.** Les personnes chargées de la revue voient le changement, pas le contexte inchangé ; elles se concentrent sur l’essentiel.

**Adaptation aux projets existants.** La plupart des travaux modifient un comportement existant. Les deltas traitent ces modifications comme des opérations de premier ordre.

## Schémas

Les schémas définissent les types d’artefacts et leurs dépendances dans un workflow.

### Fonctionnement des schémas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
```

**Les artefacts forment un graphe de dépendances :**

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

**Les dépendances facilitent le travail, elles ne le bloquent pas.** Elles indiquent ce qu’il est possible de créer, pas ce que vous devez créer ensuite. Vous pouvez omettre la conception si elle est inutile, et rédiger les spécifications avant ou après celle-ci : les deux ne dépendent que de la proposition.

### Schémas intégrés

**spec-driven** (default)

Workflow standard de développement piloté par les spécifications :

```
proposal → specs → design → tasks → implement
```

Idéal pour : la plupart des fonctionnalités pour lesquelles vous souhaitez vous mettre d’accord sur les spécifications avant l’implémentation.

### Schémas personnalisés

Créez des schémas personnalisés adaptés au workflow de votre équipe :

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Exemple de schéma personnalisé :**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Do research first

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal informed by research

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Skip specs/design, go straight to tasks
```

Consultez [Personnalisation](/fr-FR/customization/) pour apprendre à créer et utiliser des schémas personnalisés.

<a id="archive"></a>

## Archivage

L’archivage termine un changement en fusionnant ses spécifications différentielles dans les spécifications principales et en conservant le changement dans l’historique.

### Effet de l’archivage

```
Before archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


After archive:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Now includes 2FA requirements
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Preserved for history
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Processus d’archivage

1. **Fusionner les deltas.** Chaque section différentielle (ADDED/MODIFIED/REMOVED) est appliquée à la spécification principale correspondante.

2. **Déplacer vers les archives.** Le dossier du changement est déplacé vers `changes/archive/` avec un préfixe de date pour le classement chronologique.

3. **Préserver le contexte.** Tous les artefacts restent intacts dans les archives. Vous pouvez toujours comprendre pourquoi un changement a été effectué.

### Pourquoi l’archivage est important

**État clair.** `changes/` ne montre que le travail en cours. Le travail terminé est déplacé.

**Piste d’audit.** Les archives conservent tout le contexte de chaque changement : ce qui a changé, la proposition expliquant pourquoi, la conception expliquant comment et les tâches indiquant le travail accompli.

**Évolution des spécifications.** Elles s’enrichissent naturellement au fil des archivages. Chaque opération fusionne ses deltas et construit progressivement une spécification complète.

## Articulation de l’ensemble

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC FLOW                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. START      │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     CHANGE     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. CREATE     │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACTS  │  Creates proposal → specs → design → tasks              │
│   │                │  (based on schema dependencies)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. IMPLEMENT  │  /opsx:apply                                            │
│   │     TASKS      │  Work through tasks, checking them off                  │
│   │                │◄──── Update artifacts as you learn                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. VERIFY     │  /opsx:verify (optional)                                │
│   │     WORK       │  Check implementation matches specs                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. ARCHIVE    │────►│  Delta specs merge into main specs           │    │
│   │     CHANGE     │     │  Change folder moves to archive/             │    │
│   └────────────────┘     │  Specs are now the updated source of truth   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Le cercle vertueux :**

1. Les spécifications décrivent le comportement actuel
2. Les changements proposent des modifications (sous forme de deltas)
3. L’implémentation concrétise les changements
4. L’archivage fusionne les deltas dans les spécifications
5. Les spécifications décrivent alors le nouveau comportement
6. Le changement suivant s’appuie sur les spécifications actualisées

## Glossaire

| Terme | Définition |
|------|------------|
| **Artefact** | Document d’un changement (proposition, conception, tâches ou spécifications différentielles) |
| **Archivage** | Opération qui termine un changement et fusionne ses deltas dans les spécifications principales |
| **Changement** | Modification proposée au système, regroupée dans un dossier d’artefacts |
| **Spécification différentielle** | Spécification décrivant les modifications (ADDED/MODIFIED/REMOVED) par rapport aux spécifications actuelles |
| **Domaine** | Regroupement logique de spécifications (par ex. `auth/`, `payments/`) |
| **Exigence** | Comportement précis attendu du système |
| **Scénario** | Exemple concret d’une exigence, souvent au format Étant donné/Quand/Alors |
| **Schéma** | Définition des types d’artefacts et de leurs dépendances |
| **Spécification** | Description du comportement du système, avec exigences et scénarios |
| **Source de vérité** | Répertoire `openspec/specs/` contenant le comportement actuel convenu |

## Étapes suivantes

- [Bien démarrer](/fr-FR/getting-started/) — premières étapes pratiques
- [Workflows](/fr-FR/workflows/) — pratiques courantes et choix du workflow
- [Commandes](/fr-FR/commands/) — référence complète des commandes
- [Personnalisation](/fr-FR/customization/) — créer des schémas personnalisés et configurer votre projet
