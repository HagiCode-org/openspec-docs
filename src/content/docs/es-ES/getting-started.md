---
title: "Primeros pasos"
---

Esta guía explica cómo funciona OpenSpec después de instalarlo e inicializarlo.
Para instalarlo, consulta el [README principal](https://github.com/Fission-AI/openspec/blob/79b6aa9c98f1e36795b2bc4ef2a8f770c6d3a777/README.md#quick-start)
o la [guía de instalación](/es-ES/installation/). ¿Acabas de llegar a esta
documentación? En la [página principal de la documentación](/es-ES/) encontrarás
un mapa de todos los temas.

> **¿Dónde se escriben estos comandos?** En dos lugares distintos; confundirlos
> es el tropiezo más habitual al empezar.
>
> - Los comandos `openspec ...` (como `openspec init`) se ejecutan en el **terminal**.
> - Los comandos `/opsx:...` (como `/opsx:propose`) se escriben en el **chat de tu asistente de IA**, en el mismo cuadro donde le pedirías que escriba código.
>
> No hay que iniciar un «modo interactivo» aparte. Escribe el comando de barra
> en el chat y tu asistente se encargará del resto. Explicación completa: [Cómo
> funcionan los comandos](/es-ES/how-commands-work/).

## Tus primeros cinco minutos

El ciclo completo, con el lugar donde se realiza cada paso:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (optional: think it through first)
AI CHAT      /opsx:propose add-dark-mode      (AI drafts the plan; you review it)
AI CHAT      /opsx:apply                      (AI builds it)
AI CHAT      /opsx:archive                    (specs updated, change filed away)
```

La configuración requiere dos pasos en el terminal; después, todo se hace en el
chat. El resto de esta guía explica cada paso y lo que verás.

**¿Prefieres no usar el terminal?** Pega la [instrucción de configuración](/es-ES/installation/#instalar-con-tu-asistente-de-ia)
en tu asistente. Este ejecutará ambos comandos y luego te dirá qué creó.

> **¿Aún no sabes qué crear? Empieza con `/opsx:explore`.** Es un compañero de
> reflexión sin riesgo que lee tu base de código, evalúa opciones y convierte
> una idea imprecisa en un plan concreto antes de escribir código. Cuando todo
> esté claro, pasa el contexto a `/opsx:propose`. Es el mejor hábito para
> trabajar con una IA que, de otro modo, podría crear con seguridad algo
> equivocado. Consulta la [guía de exploración](/es-ES/explore/).

## Cómo funciona

OpenSpec te ayuda a ti y a tu asistente de programación con IA a acordar qué se
va a construir antes de escribir código.

**Ruta rápida predeterminada (perfil `core`):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (optional)
```

Empieza con `/opsx:explore` si todavía estás decidiendo qué hacer, o ve
directamente a `/opsx:propose` si ya lo tienes claro. Explore forma parte del
perfil predeterminado, así que siempre está disponible.

**Ruta ampliada (selección de flujos de trabajo personalizados):**

```text
/opsx:new ──► /opsx:ff or /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

El perfil global predeterminado es `core` e incluye `propose`, `explore`,
`apply`, `update`, `sync` y `archive`. Puedes activar los comandos de flujos
ampliados con `openspec config profile` y, después, ejecutar `openspec update`.

## Qué crea OpenSpec

Después de ejecutar `openspec init`, tu proyecto tendrá esta estructura:

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

**Dos directorios clave:**

- **`specs/`**: la fuente de verdad. Estas especificaciones describen el comportamiento actual del sistema y se organizan por dominio (por ejemplo, `specs/auth/` y `specs/payments/`).

- **`changes/`**: modificaciones propuestas. Cada cambio tiene su propia carpeta con todos sus artefactos. Al completarlo, sus especificaciones se combinan con el directorio principal `specs/`.

## Entender los artefactos

Cada carpeta de cambio contiene artefactos que orientan el trabajo:

| Artefacto | Función |
|----------|---------|
| `proposal.md` | El «por qué» y el «qué»: registra la intención, el alcance y el enfoque |
| `specs/` | Especificaciones delta que muestran los requisitos ADDED/MODIFIED/REMOVED |
| `design.md` | El «cómo»: enfoque técnico y decisiones de arquitectura |
| `tasks.md` | Lista de comprobación para la implementación |

**Los artefactos se construyen unos sobre otros:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

Siempre puedes volver atrás y perfeccionar los artefactos anteriores a medida
que descubras más durante la implementación.

## Cómo funcionan las especificaciones delta

Las especificaciones delta son el concepto clave de OpenSpec. Muestran qué
cambia con respecto a las especificaciones actuales.

### Formato

Las especificaciones delta usan secciones para indicar el tipo de cambio:

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

### Qué ocurre al archivar

Al archivar un cambio:

1. Los requisitos **ADDED** se añaden a la especificación principal.
2. Los requisitos **MODIFIED** sustituyen la versión existente.
3. Los requisitos **REMOVED** se eliminan de la especificación principal.

La carpeta del cambio se traslada a `openspec/changes/archive/` para conservar
el historial de auditoría.

## Ejemplo: tu primer cambio

Veamos cómo añadir el modo oscuro a una aplicación.

### 1. Iniciar el cambio (predeterminado)

```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

Si activaste el perfil de flujos ampliados, también puedes hacerlo en dos pasos:
`/opsx:new` y luego `/opsx:ff` (o avanzar gradualmente con `/opsx:continue`).

### 2. Qué se crea

**proposal.md**: registra la intención:

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

**specs/ui/spec.md**: delta que muestra los requisitos nuevos:

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

**tasks.md**: lista de comprobación para la implementación:

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

### 3. Implementar

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

Si durante la implementación descubres que hay que ajustar el diseño, actualiza
el artefacto correspondiente y continúa.

### 4. Archivar

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

Las especificaciones delta ya forman parte de las principales y documentan el
funcionamiento del sistema.

## Validar y revisar

Usa la CLI para comprobar los cambios:

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

## Próximos pasos

- [Empieza por explorar](/es-ES/explore/): usa `/opsx:explore` para pensar una idea antes de comprometerte
- [Revisar un cambio](/es-ES/reviewing-changes/): qué revisar en el plan que redacta la IA antes de escribir código
- [Escribir buenas especificaciones](/es-ES/writing-specs/): cómo redactar buenos requisitos y escenarios
- [Usar OpenSpec en un proyecto existente](/es-ES/existing-projects/): empezar en una base de código grande ya existente
- [Editar e iterar un cambio](/es-ES/editing-changes/): actualizar artefactos, volver atrás y conciliar ediciones manuales
- [Conceptos básicos de un vistazo](/es-ES/overview/): el modelo mental completo en una página
- [Ejemplos y recetas](/es-ES/examples/): cambios reales, de principio a fin
- [Flujos de trabajo](/es-ES/workflows/): patrones habituales y cuándo usar cada comando
- [Comandos](/es-ES/commands/): referencia completa de los comandos de barra
- [Conceptos](/es-ES/concepts/): explicación detallada de especificaciones, cambios y esquemas
- [Personalización](/es-ES/customization/): adapta OpenSpec a tu forma de trabajar
- [Almacenes](/es-ES/stores-beta/user-guide/): ¿planificas tareas que abarcan varios repositorios o equipos? Guárdalas en un repositorio propio (beta)
- [Preguntas frecuentes](/es-ES/faq/) y [solución de problemas](/es-ES/troubleshooting/): ayuda cuando algo no funciona
