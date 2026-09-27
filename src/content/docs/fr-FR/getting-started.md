---
title: "Bien démarrer"
---

Ce guide explique le fonctionnement d'OpenSpec après son installation et son initialisation. Pour installer le logiciel, consultez le [README principal](/fr-FR/) ou le [Guide d'installation](/fr-FR/installation/). Vous découvrez l'ensemble de la documentation ? La [page d'accueil de la documentation](/fr-FR/) en présente l'organisation.

> **Où saisir ces commandes ?** À deux endroits, et les confondre est l'erreur la plus fréquente au début.
>
> - Les commandes `openspec ...` (comme `openspec init`) s'exécutent dans votre **terminal**.
> - Les commandes `/opsx:...` (comme `/opsx:propose`) s'exécutent dans la **conversation avec votre assistant IA**, dans la même zone que celle où vous lui demanderiez d'écrire du code.
>
> Il n'y a pas de « mode interactif » distinct à lancer. Saisissez simplement la commande slash dans la conversation et votre assistant s'en charge. Explication complète : [Fonctionnement des commandes](/fr-FR/how-commands-work/).

## Vos cinq premières minutes

Le cycle complet, avec l'endroit où chaque étape a lieu :

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

Deux étapes dans le terminal pour la configuration, puis le travail se déroule dans la conversation. Le reste de ce guide explique le rôle de chaque étape et ce que vous verrez.

**Vous ne voulez pas effectuer vous-même les étapes dans le terminal ?** Collez la [consigne de configuration](/fr-FR/installation/#install-with-your-ai-assistant) dans votre assistant : il effectuera les deux commandes, puis indiquera ce qui a été créé.

> **Vous ne savez pas encore quoi construire ? Commencez par `/opsx:explore`.** C'est un partenaire de réflexion sans engagement : il lit votre base de code, examine les options et transforme une idée vague en plan concret avant toute écriture de code. Une fois le besoin clarifié, il passe le relais à `/opsx:propose`. C'est la meilleure habitude à prendre lorsqu'on travaille avec une IA qui risquerait sinon de construire avec assurance la mauvaise chose. Voir le [Guide Explore](/fr-FR/explore/).

## Fonctionnement

OpenSpec vous aide à vous mettre d'accord avec votre assistant de programmation IA sur ce qu'il faut construire, avant toute écriture de code.

**Parcours rapide par défaut (profil core) :**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Commencez par `/opsx:explore` si vous cherchez encore la bonne approche, ou passez directement à `/opsx:propose` si vous la connaissez déjà. Explore fait partie du profil par défaut et reste donc toujours disponible.

**Parcours étendu (sélection de workflow personnalisée) :**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Le profil global par défaut est `core`, qui comprend `propose`, `explore`, `apply`, `update`, `sync` et `archive`. Activez les commandes de workflow étendues avec `openspec config profile`, puis `openspec update`.

## Ce qu'OpenSpec crée

Après l'exécution de `openspec init`, votre projet a cette structure :

```
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

**Deux répertoires importants :**

- **`specs/`** — la source de vérité. Ces spécifications décrivent le comportement actuel du système. Elles sont organisées par domaine (par exemple `specs/auth/`, `specs/payments/`).
- **`changes/`** — les modifications proposées. Chaque changement possède son propre dossier avec tous les artefacts associés. Lorsqu'un changement est terminé, ses spécifications sont fusionnées dans le répertoire principal `specs/`.

## Comprendre les artefacts

Chaque dossier de changement contient des artefacts qui guident le travail :

| Artefact | Rôle |
|----------|------|
| `proposal.md` | Le « pourquoi » et le « quoi » : intention, périmètre et approche |
| `specs/` | Spécifications différentielles présentant les exigences ADDED/MODIFIED/REMOVED |
| `design.md` | Le « comment » : approche technique et décisions d'architecture |
| `tasks.md` | Liste de contrôle d'implémentation avec cases à cocher |

**Les artefacts s'appuient les uns sur les autres :**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Vous pouvez toujours revenir aux artefacts précédents et les affiner à mesure que vous en apprenez davantage pendant l'implémentation.

## Fonctionnement des spécifications différentielles

Les spécifications différentielles sont le concept clé d'OpenSpec. Elles indiquent ce qui change par rapport aux spécifications actuelles.

### Format

Les spécifications différentielles utilisent des sections pour indiquer le type de changement :

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### Effet de l'archivage

Lorsque vous archivez un changement :

1. Les exigences **ADDED** sont ajoutées à la spécification principale.
2. Les exigences **MODIFIED** remplacent leur version existante.
3. Les exigences **REMOVED** sont supprimées de la spécification principale.

Le dossier du changement est déplacé vers `openspec/changes/archive/` pour conserver l'historique des opérations.

## Exemple : votre premier changement

Voyons comment ajouter un mode sombre à une application.

### 1. Commencer le changement (par défaut)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Si vous avez activé le profil de workflow étendu, vous pouvez procéder en deux étapes : `/opsx:new`, puis `/opsx:ff` (ou `/opsx:continue` pour avancer progressivement).

### 2. Contenu créé

**proposal.md** — décrit l'intention :

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** — delta qui présente les nouvelles exigences :

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** — liste de contrôle d'implémentation :

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 3. Implémenter

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

Si vous découvrez pendant l'implémentation que la conception doit être modifiée, mettez simplement l'artefact à jour et continuez.

### 4. Archiver

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Vos spécifications différentielles font désormais partie des spécifications principales et documentent le fonctionnement du système.

## Vérification et revue

Utilisez la CLI pour consulter vos changements :

```bash
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

## Pour continuer

- [Commencer par explorer](/fr-FR/explore/) — utiliser `/opsx:explore` pour réfléchir avant de s'engager
- [Revoir un changement](/fr-FR/reviewing-changes/) — vérifier le plan rédigé par l'IA avant tout code
- [Rédiger de bonnes spécifications](/fr-FR/writing-specs/) — ce qui caractérise une exigence et un scénario solides
- [Utiliser OpenSpec dans un projet existant](/fr-FR/existing-projects/) — démarrer dans une grande base de code déjà établie
- [Modifier et faire évoluer un changement](/fr-FR/editing-changes/) — mettre à jour les artefacts, revenir en arrière et réconcilier les modifications manuelles
- [Les concepts fondamentaux en bref](/fr-FR/overview/) — le modèle mental complet en une page
- [Exemples et recettes](/fr-FR/examples/) — des changements réels, de bout en bout
- [Workflows](/fr-FR/workflows/) — méthodes courantes et choix de commandes
- [Commandes](/fr-FR/commands/) — référence complète des commandes slash
- [Concepts](/fr-FR/concepts/) — approfondir les spécifications, changements et schémas
- [Personnalisation](/fr-FR/customization/) — adapter OpenSpec à vos pratiques
- [Stores](/fr-FR/stores-beta/user-guide/) — planification entre dépôts ou équipes dans un dépôt dédié (bêta)
- [FAQ](/fr-FR/faq/) et [Dépannage](/fr-FR/troubleshooting/) — en cas de problème
