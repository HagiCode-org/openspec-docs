---
title: "Flujo de trabajo OPSX"
---

> Agradecemos tus comentarios en [Discord](https://discord.gg/YctCnvvshC).

## ¿Qué es?

OPSX es ahora el flujo de trabajo estándar de OpenSpec.

Es un **flujo de trabajo flexible e iterativo** para los cambios de OpenSpec.
Se acabaron las fases rígidas: ahora puedes realizar acciones en cualquier momento.

## Por qué existe

El flujo de trabajo heredado de OpenSpec funciona, pero es **rígido**:

- **Instrucciones codificadas**: están ocultas en TypeScript y no se pueden cambiar.
- **Todo o nada**: un único comando grande lo crea todo; no puedes probar las piezas por separado.
- **Estructura fija**: el mismo flujo para todos, sin personalización.
- **Caja negra**: si la IA produce un resultado deficiente, no puedes ajustar las instrucciones.

**OPSX lo abre.** Ahora cualquiera puede:

1. **Experimentar con las instrucciones**: editar una plantilla y comprobar si la IA mejora.
2. **Probar de forma granular**: validar por separado las instrucciones de cada artefacto.
3. **Personalizar los flujos**: definir artefactos y dependencias propios.
4. **Iterar rápidamente**: cambiar una plantilla y probarla al instante, sin recompilar.

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

**Es para todos:**
- **Equipos**: crear flujos que se ajusten a su forma de trabajar.
- **Usuarios avanzados**: ajustar las instrucciones para obtener mejores resultados de IA en su base de código.
- **Colaboradores de OpenSpec**: experimentar con nuevos enfoques sin esperar a una versión.

Todavía estamos aprendiendo qué funciona mejor. OPSX nos permite aprender juntos.

## La experiencia de uso

**El problema de los flujos lineales:**
Primero estás «en la fase de planificación», después «en la fase de
implementación» y, por último, «has terminado». Pero el trabajo real no
funciona así. Implementas algo, te das cuenta de que el diseño era incorrecto,
actualizas las especificaciones y sigues implementando. Las fases lineales
obstaculizan la forma en que realmente se trabaja.

**El enfoque de OPSX:**
- **Acciones, no fases**: crear, implementar, actualizar y archivar; puedes hacer cualquiera de estas cosas cuando quieras.
- **Las dependencias habilitan el trabajo**: indican qué es posible, no qué debes hacer a continuación.

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Configuración

```bash
# Make sure you have openspec installed — skills are automatically generated
openspec init
```

Esto crea habilidades en `.claude/skills/` (o una ruta equivalente), que los
asistentes de programación con IA detectan automáticamente.

De forma predeterminada, OpenSpec usa el perfil de flujo de trabajo `core`
(`propose`, `explore`, `apply`, `update`, `sync`, `archive`). Si quieres los
comandos ampliados (`new`, `continue`, `ff`, `verify`, `bulk-archive`,
`onboard`), configúralos con `openspec config profile` y aplícalos con
`openspec update`.

Durante la configuración, se te ofrecerá crear una **configuración del
proyecto** (`openspec/config.yaml`). Es opcional, pero se recomienda.

## Configuración del proyecto

La configuración del proyecto permite establecer valores predeterminados e
incorporar contexto específico del proyecto en todos los artefactos.

### Crear la configuración

La configuración se crea durante `openspec init` o manualmente:

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

### Campos de configuración

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `schema` | string | Esquema predeterminado para nuevos cambios (por ejemplo, `spec-driven`) |
| `context` | string | Contexto del proyecto que se incorpora a las instrucciones de todos los artefactos |
| `rules` | object | Reglas por artefacto, identificadas por su ID |

### Cómo funciona

**Prioridad de los esquemas** (de mayor a menor):
1. CLI flag (`--schema <name>`)
2. Metadatos del cambio (`.openspec.yaml` en el directorio del cambio)
3. Configuración del proyecto (`openspec/config.yaml`)
4. Default (`spec-driven`)

**Incorporación del contexto:**
- El contexto se antepone a las instrucciones de cada artefacto.
- Se delimita con las etiquetas `<context>...</context>`.
- Ayuda a la IA a entender las convenciones del proyecto.

**Incorporación de reglas:**
- Las reglas solo se incorporan a los artefactos correspondientes.
- Se delimitan con las etiquetas `<rules>...</rules>`.
- Aparecen después del contexto y antes de la plantilla.

### IDs de artefacto por esquema

**spec-driven** (predeterminado):
- `proposal`: propuesta de cambio
- `specs`: especificaciones
- `design`: diseño técnico
- `tasks`: tareas de implementación

### Validación de la configuración

- Los ID de artefacto desconocidos en `rules` generan advertencias.
- Los nombres de esquema se validan frente a los esquemas disponibles.
- El contexto tiene un límite de 50 KB.
- Los errores de YAML se indican con números de línea.

### Solución de problemas

**«ID de artefacto desconocido en rules: X»**
- Comprueba que los ID de artefacto coincidan con el esquema (consulta la lista anterior).
- Ejecuta `openspec schemas --json` para ver los ID de artefacto de cada esquema.

**No se aplica la configuración:**
- Comprueba que el archivo esté en `openspec/config.yaml` (no en `.yml`).
- Valida la sintaxis YAML.
- Los cambios de configuración surten efecto inmediatamente (no hace falta reiniciar).

**El contexto es demasiado extenso:**
- El límite de contexto es de 50 KB.
- Resúmelo o enlaza a documentación externa.

## Comandos

| Comando | Función |
|---------|--------------|
| `/opsx:propose` | Crear un cambio y generar sus artefactos de planificación en un solo paso (ruta rápida predeterminada) |
| `/opsx:explore` | Analizar ideas, investigar problemas y aclarar requisitos |
| `/opsx:new` | Crear la estructura inicial de un cambio (flujo ampliado) |
| `/opsx:continue` | Crear el siguiente artefacto (flujo ampliado) |
| `/opsx:ff` | Generar rápidamente los artefactos de planificación (flujo ampliado) |
| `/opsx:apply` | Implementar las tareas y actualizar los artefactos según sea necesario |
| `/opsx:update` | Revisar los artefactos de planificación de un cambio y mantenerlos coherentes |
| `/opsx:verify` | Validar la implementación frente a los artefactos (flujo ampliado) |
| `/opsx:sync` | Combinar las especificaciones delta con las principales (opcional) |
| `/opsx:archive` | Archivar al terminar |
| `/opsx:bulk-archive` | Archivar varios cambios completados (flujo ampliado) |
| `/opsx:onboard` | Recorrido guiado por un cambio de principio a fin (flujo ampliado) |

## Uso

### Explorar una idea
```
/opsx:explore
```
Analiza ideas, investiga problemas y compara opciones. No hace falta seguir
ninguna estructura: es solo un compañero de reflexión. Cuando las ideas estén
claras, pasa a `/opsx:propose` (predeterminado) o a `/opsx:new`/`/opsx:ff`
(flujo ampliado).

### Iniciar un cambio
```
/opsx:propose
```
Crea el cambio y genera los artefactos de planificación necesarios antes de la
implementación.

Si activaste los flujos ampliados, puedes usar estos comandos:

```text
/opsx:new        # scaffold only
/opsx:continue   # create one artifact at a time
/opsx:ff         # create all planning artifacts at once
```

### Crear artefactos
```
/opsx:continue
```
Muestra qué artefactos se pueden crear según las dependencias y crea uno. Úsalo
repetidamente para desarrollar el cambio de forma incremental.

```
/opsx:ff add-dark-mode
```
Crea todos los artefactos de planificación a la vez. Úsalo cuando tengas claro
qué vas a construir.

### Implementar (la parte flexible)
```
/opsx:apply
```
Va completando las tareas y marcándolas a medida que avanzas. Si tienes varios
cambios en curso, puedes ejecutar `/opsx:apply <name>`; en caso contrario,
debería deducir cuál usar a partir de la conversación y pedirte que elijas si
no puede determinarlo.

### Actualizar un cambio
```
/opsx:update add-dark-mode - we're storing the theme in a cookie now
```
Revisa los artefactos de planificación existentes y mantiene su coherencia en
cualquier dirección (un cambio en el diseño puede repercutir en la propuesta).
Nunca modifica el código. Antes de aplicar cada edición, te pide confirmación.
Consulta la [referencia de update](/es-ES/commands/#opsxupdate) para saber cómo
gestiona los archivos que faltan sin iniciar un artefacto nuevo.

Si el cambio ya se implementó, recomienda `/opsx:apply` para que el código se
ajuste al plan revisado. Si la revisión modifica la *intención* del cambio,
empieza uno nuevo. Consulta [Cuándo actualizar y cuándo empezar de cero](#cuándo-actualizar-y-cuándo-empezar-de-cero).

### Sincronizar las especificaciones delta
```text
/opsx:sync
```
Combina las especificaciones delta del cambio actual con `openspec/specs/` sin
archivarlo; el cambio sigue activo. Aplica la delta completa: elimina de la
especificación principal los requisitos bajo `## REMOVED` y cambia en su lugar
el título de los requisitos renombrados. El contenido que la delta no menciona
queda intacto. La sincronización es opcional: si aún no la hiciste, al archivar
se te ofrecerá sincronizar primero. Úsala si quieres actualizar las
especificaciones principales antes de archivar, si otro cambio en paralelo
necesita basarse en las especificaciones que este acaba de añadir o si quieres
revisar las especificaciones principales combinadas antes de archivar.

### Terminar
```
/opsx:archive   # Move to archive when done (prompts to sync specs if needed)
```

## Cuándo actualizar y cuándo empezar de cero

Siempre puedes editar la propuesta o las especificaciones antes de implementar.
Pero ¿en qué momento deja de ser un refinamiento y pasa a ser «un trabajo distinto»?

### Qué recoge una propuesta

Una propuesta define tres aspectos:
1. **Intención**: ¿qué problema quieres resolver?
2. **Alcance**: ¿qué se incluye y qué queda fuera?
3. **Enfoque**: ¿cómo lo resolverás?

La pregunta es: ¿qué cambió y en qué medida?

### Actualiza el cambio existente cuando:

**La intención es la misma, pero se perfecciona la ejecución**
- Descubres casos límite que no habías considerado.
- Hay que ajustar el enfoque, pero el objetivo no cambia.
- La implementación revela que el diseño no era del todo correcto.

**Se reduce el alcance**
- Te das cuenta de que el alcance completo es demasiado grande y quieres publicar primero un producto mínimo viable.
- «Añadir modo oscuro» → «Añadir el interruptor del modo oscuro (preferencia del sistema en la versión 2)».

**Correcciones a partir de lo aprendido**
- La base de código no está estructurada como pensabas.
- Una dependencia no funciona como esperabas.
- «Usar variables CSS» → «Usar el prefijo dark: de Tailwind».

### Inicia un cambio nuevo cuando:

**La intención ha cambiado de manera fundamental**
- El problema en sí ahora es distinto.
- «Añadir modo oscuro» → «Añadir un sistema de temas completo con colores, fuentes y espaciado personalizados».

**El alcance se ha disparado**
- El cambio ha crecido tanto que, en esencia, es otro trabajo.
- La propuesta original sería irreconocible después de las actualizaciones.
- «Corregir un error de inicio de sesión» → «Reescribir el sistema de autenticación».

**El cambio original se puede completar**
- El cambio original se puede marcar como «hecho».
- El nuevo trabajo es independiente, no un refinamiento.
- Completa «Añadir el producto mínimo viable de modo oscuro» → archívalo → crea el cambio «Mejorar el modo oscuro».

### Criterios prácticos

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

| Criterio | Actualizar | Cambio nuevo |
|------|--------|------------|
| **Identidad** | «Lo mismo, con mejoras» | «Un trabajo distinto» |
| **Coincidencia de alcance** | Coincide en más del 50 % | Coincide en menos del 50 % |
| **Finalización** | No se puede dar por «hecho» sin los cambios | El trabajo original se puede completar y el nuevo es independiente |
| **Historial** | La secuencia de actualizaciones cuenta una historia coherente | Los parches confundirían más de lo que aclararían |

### El principio

> **Actualizar conserva el contexto. Un cambio nuevo aporta claridad.**
>
> Elige actualizar cuando sea valioso conservar la evolución de tus ideas.
> Empieza de nuevo cuando resulte más claro que aplicar parches.

Piensa en las ramas de Git:
- Sigue creando commits mientras trabajes en la misma función.
- Abre una rama nueva cuando se trate de un trabajo realmente distinto.
- A veces conviene combinar una función parcial y empezar de cero para la segunda fase.

## ¿Qué ha cambiado?

| | Heredado (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Estructura** | Un único documento de propuesta extenso | Artefactos independientes con dependencias |
| **Flujo de trabajo** | Fases lineales: planificar → implementar → archivar | Acciones flexibles: haz lo que necesites en cualquier momento |
| **Iteración** | Es difícil volver atrás | Actualiza los artefactos a medida que aprendes |
| **Personalización** | Estructura fija | Basada en esquemas (define tus propios artefactos) |

**La idea clave:** el trabajo no es lineal. OPSX deja de fingir que lo es.

## Arquitectura en detalle

Esta sección explica cómo funciona OPSX internamente y en qué se diferencia del
flujo de trabajo heredado. Los ejemplos usan el conjunto ampliado de comandos
(`new`, `continue`, etc.); quienes usan el perfil predeterminado `core` pueden
seguir el mismo flujo con `propose → apply → sync → archive`.

### Filosofía: fases frente a acciones

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

### Arquitectura de componentes

El **flujo heredado** usa plantillas codificadas en TypeScript:

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

**OPSX** usa esquemas externos y un motor de grafos de dependencias:

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

### Modelo de grafo de dependencias

Los artefactos forman un grafo acíclico dirigido (DAG). Las dependencias son
**habilitadores**, no barreras:

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

**Transiciones de estado:**

```
   BLOCKED ────────────────► READY ────────────────► DONE
      │                        │                       │
   Missing                  All deps               File exists
   dependencies             are DONE               on filesystem
```

### Flujo de información

**Flujo heredado**: el agente recibe instrucciones estáticas:

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

**OPSX**: el agente consulta información contextual detallada:

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

### Modelo de iteración

**Flujo heredado**: iteración complicada:

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

**OPSX**: iteración natural:

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

### Esquemas personalizados

Crea flujos de trabajo personalizados mediante los comandos de gestión de esquemas:

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

Los esquemas se guardan en `openspec/schemas/` (locales al proyecto y bajo
control de versiones) o en `~/.local/share/openspec/schemas/` (globales para el
usuario).

**Estructura del esquema:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Ejemplo de schema.yaml:**
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

**Grafo de dependencias:**
```
   research ──► proposal ──► tasks
```

### Resumen

| Aspecto | Heredado | OPSX |
|--------|----------|------|
| **Plantillas** | TypeScript codificado | YAML + Markdown externos |
| **Dependencias** | Ninguna (todo a la vez) | DAG con ordenación topológica |
| **Estado** | Modelo mental basado en fases | Existencia en el sistema de archivos |
| **Personalización** | Editar el código fuente y recompilar | Crear schema.yaml |
| **Iteración** | Fases rígidas | Flexible, permite editar cualquier cosa |
| **Compatibilidad con editores** | Configurador/adaptadores específicos | Un solo directorio de habilidades |

## Esquemas

Los esquemas definen qué artefactos existen y cuáles son sus dependencias. Actualmente está disponible:

- **spec-driven** (predeterminado): propuesta → especificaciones → diseño → tareas

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

## Consejos

- Usa `/opsx:explore` para analizar una idea antes de convertirla en un cambio.
- Usa `/opsx:ff` si sabes lo que quieres y `/opsx:continue` si aún estás explorando.
- Si algo no está bien durante `/opsx:apply`, corrige el artefacto y continúa.
- Las casillas de `tasks.md` registran el progreso de las tareas.
- Consulta el estado en cualquier momento con `openspec status --change "name"`.

## Comentarios

Esta función todavía está en desarrollo. Es intencional: estamos aprendiendo qué funciona.

¿Encontraste un error o tienes ideas? Únete a [Discord](https://discord.gg/YctCnvvshC)
o abre una incidencia en [GitHub](https://github.com/Fission-AI/openspec/issues).
