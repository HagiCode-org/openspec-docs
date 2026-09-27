---
title: "Conceptos"
---

Esta guía explica las ideas fundamentales de OpenSpec y cómo se relacionan.
Para empezar a usarlo, consulta [Primeros pasos](/es-ES/getting-started/) y
[Flujos de trabajo](/es-ES/workflows/).

## Filosofía

OpenSpec se basa en cuatro principios:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Por qué importan estos principios

**Flexible, no rígido.** Los sistemas de especificaciones tradicionales te
obligan a seguir fases: primero planificas, luego implementas y, al final,
terminas. OpenSpec es más flexible: puedes crear los artefactos en el orden que
tenga sentido para tu trabajo.

**Iterativo, no en cascada.** Los requisitos cambian y la comprensión se
profundiza. Un enfoque que parecía acertado al principio quizá no lo sea
después de examinar la base de código. OpenSpec parte de esta realidad.

**Sencillo, no complejo.** Algunos marcos de especificaciones requieren mucha
configuración, formatos rígidos o procesos pesados. OpenSpec no se interpone en
tu camino: inicialízalo en segundos, empieza a trabajar enseguida y
personalízalo solo si lo necesitas.

**Primero, brownfield.** La mayoría del trabajo de software no consiste en
construir desde cero, sino en modificar sistemas existentes. El enfoque basado
en deltas de OpenSpec facilita especificar cambios en el comportamiento actual,
no solo describir sistemas nuevos.

## Visión general

OpenSpec organiza tu trabajo en dos áreas principales:

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

Las **especificaciones** son la fuente de verdad: describen el comportamiento
actual del sistema.

Los **cambios** son modificaciones propuestas: permanecen en carpetas
independientes hasta que estés listo para combinarlos.

Esta separación es fundamental. Puedes trabajar en varios cambios en paralelo
sin conflictos y revisar un cambio antes de que afecte a las especificaciones
principales. Al archivar un cambio, sus deltas se combinan limpiamente con la
fuente de verdad.

## Especificaciones

Las especificaciones describen el comportamiento del sistema mediante
requisitos y escenarios estructurados.

### Estructura

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

Organiza las especificaciones por dominio: grupos lógicos que tengan sentido
para tu sistema. Algunos patrones habituales:

- **Por área funcional**: `auth/`, `payments/`, `search/`
- **Por componente**: `api/`, `frontend/`, `workers/`
- **Por contexto delimitado**: `ordering/`, `fulfillment/`, `inventory/`

### Formato de las especificaciones

Una especificación contiene requisitos, y cada requisito tiene escenarios:

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

**Elementos principales:**

| Elemento | Función |
|---------|---------|
| `## Purpose` | Descripción general del dominio de esta especificación |
| `### Requirement:` | Comportamiento concreto que debe tener el sistema |
| `#### Scenario:` | Ejemplo concreto del requisito en acción |
| SHALL/MUST/SHOULD | Términos de RFC 2119 que indican la fuerza del requisito |

### Por qué estructurar así las especificaciones

**Los requisitos expresan el «qué»**: indican lo que debe hacer el sistema sin
especificar la implementación.

**Los escenarios expresan el «cuándo»**: aportan ejemplos concretos que se
pueden verificar. Los buenos escenarios:
- Se pueden probar (es posible escribir pruebas automatizadas para ellos).
- Incluyen tanto el flujo habitual como los casos límite.
- Usan el formato Dado/Cuando/Entonces u otra estructura similar.

Las **palabras clave de RFC 2119** (SHALL, MUST, SHOULD, MAY) expresan la
intención:
- **MUST/SHALL**: requisito absoluto.
- **SHOULD**: se recomienda, aunque puede haber excepciones.
- **MAY**: opcional.

### Qué es una especificación (y qué no es)

Una especificación es un **contrato de comportamiento**, no un plan de implementación.

Contenido adecuado para una especificación:
- Comportamiento observable del que dependan los usuarios o los sistemas posteriores.
- Entradas, salidas y condiciones de error.
- Restricciones externas (seguridad, privacidad, fiabilidad y compatibilidad).
- Escenarios que se puedan probar o validar explícitamente.

Evita incluir en las especificaciones:
- Nombres de clases o funciones internas.
- Elecciones de bibliotecas o marcos de trabajo.
- Detalles de implementación paso a paso.
- Planes de ejecución detallados (corresponden a `design.md` o `tasks.md`).

Comprobación rápida:
- Si la implementación puede cambiar sin alterar el comportamiento visible desde fuera, probablemente no corresponda a la especificación.

### Mantener la ligereza: rigor progresivo

OpenSpec procura evitar la burocracia. Usa el nivel más ligero que permita
verificar el cambio.

**Especificación ligera (predeterminada):**
- Requisitos breves y centrados en el comportamiento.
- Alcance y objetivos no incluidos claramente definidos.
- Unas pocas comprobaciones concretas de aceptación.

**Especificación completa (para riesgos mayores):**
- Cambios que abarcan varios equipos o repositorios.
- Cambios de API o contratos, migraciones y asuntos de seguridad o privacidad.
- Cambios en los que la ambigüedad probablemente provoque costosas repeticiones del trabajo.

La mayoría de los cambios deberían mantenerse en el modo ligero.

### Colaboración entre personas y agentes

En muchos equipos, las personas exploran y los agentes redactan los artefactos.
El ciclo previsto es:

1. La persona proporciona la intención, el contexto y las restricciones.
2. El agente los convierte en requisitos y escenarios centrados en el comportamiento.
3. El agente registra los detalles de implementación en `design.md` y `tasks.md`, no en `spec.md`.
4. La validación comprueba la estructura y claridad antes de implementar.

Así, las especificaciones son legibles para las personas y coherentes para los agentes.

## Cambios

Un cambio es una modificación propuesta para el sistema, empaquetada en una
carpeta con todo lo necesario para entenderla e implementarla.

### Estructura de un cambio

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

Cada cambio es independiente. Contiene:
- **Artefactos**: documentos que registran la intención, el diseño y las tareas.
- **Especificaciones delta**: describen lo que se añade, modifica o elimina.
- **Metadatos**: configuración opcional para este cambio concreto.

### Por qué los cambios son carpetas

Empaquetar un cambio en una carpeta tiene varias ventajas:

1. **Todo junto.** La propuesta, el diseño, las tareas y las especificaciones están en un mismo lugar. No tienes que buscarlos por separado.

2. **Trabajo en paralelo.** Pueden coexistir varios cambios sin conflictos. Trabaja en `add-dark-mode` mientras sigue en curso `fix-auth-bug`.

3. **Historial claro.** Al archivarse, los cambios se trasladan a `changes/archive/` junto con todo su contexto. Después puedes entender no solo qué cambió, sino por qué.

4. **Fácil de revisar.** Revisar una carpeta de cambio es sencillo: ábrela, lee la propuesta, comprueba el diseño y consulta las especificaciones delta.

## Artefactos

Los artefactos son los documentos de un cambio que orientan el trabajo.

### Flujo de artefactos

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Los artefactos se construyen unos sobre otros. Cada uno proporciona contexto
para el siguiente.

### Tipos de artefactos

#### Propuesta (`proposal.md`)

La propuesta recoge, a grandes rasgos, la **intención**, el **alcance** y el
**enfoque**.

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

**Cuándo actualizar la propuesta:**
- Cambia el alcance (se reduce o se amplía).
- Se aclara la intención (se entiende mejor el problema).
- El enfoque cambia de manera fundamental.

#### Especificaciones (especificaciones delta en `specs/`)

Las especificaciones delta describen **qué cambia** con respecto a las
especificaciones actuales. Consulta [Especificaciones delta](#especificaciones-delta) más
adelante.

#### Diseño (`design.md`)

El diseño recoge el **enfoque técnico** y las **decisiones de arquitectura**.

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

**Cuándo actualizar el diseño:**
- La implementación revela que el enfoque no funcionará.
- Se descubre una solución mejor.
- Cambian las dependencias o las restricciones.

#### Tareas (`tasks.md`)

Las tareas son la **lista de comprobación de la implementación**: pasos
concretos con casillas.

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

**Prácticas recomendadas para las tareas:**
- Agrupa las tareas relacionadas bajo encabezados.
- Usa numeración jerárquica (1.1, 1.2, etc.).
- Haz que cada tarea sea lo bastante pequeña para completarse en una sesión.
- Indica cómo se verificará cada tarea (con una prueba, un comando o un resultado observable).
- Incluye las pruebas y la documentación que requiera cada grupo de trabajo dentro de ese grupo, no en un grupo final de recuperación.
- Marca las tareas a medida que las completes.

## Especificaciones delta

Las especificaciones delta son el concepto clave que permite usar OpenSpec en
el desarrollo brownfield. Describen **qué cambia** en vez de repetir toda la
especificación.

### Formato

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

### Secciones delta

| Sección | Significado | Qué ocurre al archivar |
|---------|---------|------------------------|
| `## ADDED Requirements` | Comportamiento nuevo | Se añade a la especificación principal |
| `## MODIFIED Requirements` | Comportamiento modificado | Sustituye el requisito existente |
| `## REMOVED Requirements` | Comportamiento obsoleto | Se elimina de la especificación principal; si se quita el último requisito, se retira la capacidad y se elimina su archivo de especificación cuando el cambio declara `retire_capabilities: true` |
| `## Purpose` | Finalidad de una capacidad nueva | Establece la finalidad de la especificación principal que se crea; se ignora si la especificación ya existe |

### Por qué usar deltas en lugar de especificaciones completas

**Claridad.** Una delta muestra exactamente qué cambia. Si leyeras la
especificación completa, tendrías que compararla mentalmente con la versión
actual.

**Prevención de conflictos.** Dos cambios pueden modificar el mismo archivo
de especificación sin entrar en conflicto, siempre que afecten a requisitos
distintos.

**Eficiencia de revisión.** Quienes revisan ven el cambio, no el contexto que
permanece igual. Así pueden centrarse en lo importante.

**Adecuación al desarrollo brownfield.** La mayor parte del trabajo modifica
el comportamiento existente. Las deltas tratan esas modificaciones como
elementos principales, no como algo secundario.

## Esquemas

Los esquemas definen los tipos de artefactos y sus dependencias en un flujo de trabajo.

### Cómo funcionan los esquemas

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

**Los artefactos forman un grafo de dependencias:**

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

**Las dependencias habilitan el trabajo, no lo bloquean.** Indican qué se
puede crear, no qué debes crear a continuación. Puedes omitir el diseño si no
lo necesitas. Puedes crear las especificaciones antes o después del diseño:
ambos dependen únicamente de la propuesta.

### Esquemas integrados

**spec-driven** (predeterminado)

El flujo estándar para el desarrollo guiado por especificaciones:

```
proposal → specs → design → tasks → implement
```

Ideal para: la mayoría de los trabajos de desarrollo de funciones en los que
se quiere acordar las especificaciones antes de implementar.

### Esquemas personalizados

Crea esquemas personalizados para el flujo de trabajo de tu equipo:

```bash
# Create from scratch
openspec schema init research-first

# Or fork an existing one
openspec schema fork spec-driven research-first
```

**Ejemplo de esquema personalizado:**

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

Consulta [Personalización](/es-ES/customization/) para conocer todos los
detalles sobre la creación y el uso de esquemas personalizados.

## Archivar

El archivado completa un cambio al combinar sus especificaciones delta con las
especificaciones principales y conservar el cambio como parte del historial.

### Qué ocurre al archivar

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

### Proceso de archivado

1. **Combinar las deltas.** Cada sección de la especificación delta (ADDED/MODIFIED/REMOVED) se aplica a la especificación principal correspondiente.

2. **Mover al archivo.** La carpeta del cambio se traslada a `changes/archive/` con un prefijo de fecha para ordenarla cronológicamente.

3. **Conservar el contexto.** Todos los artefactos permanecen intactos en el archivo. Siempre puedes consultarlos para entender por qué se hizo un cambio.

### Por qué importa archivar

**Estado limpio.** Los cambios activos (`changes/`) solo muestran el trabajo en curso. El trabajo terminado se aparta.

**Registro de auditoría.** El archivo conserva todo el contexto de cada cambio: no solo qué cambió, sino también la propuesta que explica por qué, el diseño que explica cómo y las tareas que muestran el trabajo realizado.

**Evolución de las especificaciones.** Las especificaciones crecen de forma orgánica a medida que se archivan los cambios. Cada archivado combina sus deltas, formando con el tiempo una especificación completa.

## Cómo encaja todo

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

**El ciclo virtuoso:**

1. Las especificaciones describen el comportamiento actual.
2. Los cambios proponen modificaciones (en forma de deltas).
3. La implementación hace realidad los cambios.
4. El archivado combina las deltas con las especificaciones.
5. Las especificaciones pasan a describir el nuevo comportamiento.
6. El siguiente cambio se basa en las especificaciones actualizadas.

## Glosario

| Término | Definición |
|------|------------|
| **Artefacto** | Documento incluido en un cambio (propuesta, diseño, tareas o especificaciones delta) |
| **Archivo** | Proceso de completar un cambio y combinar sus deltas con las especificaciones principales |
| **Cambio** | Modificación propuesta del sistema, empaquetada en una carpeta con sus artefactos |
| **Especificación delta** | Especificación que describe cambios (ADDED/MODIFIED/REMOVED) con respecto a las especificaciones actuales |
| **Dominio** | Agrupación lógica de especificaciones (por ejemplo, `auth/`, `payments/`) |
| **Requisito** | Comportamiento concreto que debe tener el sistema |
| **Escenario** | Ejemplo concreto de un requisito, normalmente en formato Dado/Cuando/Entonces |
| **Esquema** | Definición de los tipos de artefacto y sus dependencias |
| **Especificación** | Documento que describe el comportamiento del sistema mediante requisitos y escenarios |
| **Fuente de verdad** | Directorio `openspec/specs/`, que contiene el comportamiento acordado actualmente |

## Próximos pasos

- [Primeros pasos](/es-ES/getting-started/): primeros pasos prácticos
- [Flujos de trabajo](/es-ES/workflows/): patrones habituales y cuándo usar cada uno
- [Comandos](/es-ES/commands/): referencia completa de comandos
- [Personalización](/es-ES/customization/): crear esquemas personalizados y configurar el proyecto
