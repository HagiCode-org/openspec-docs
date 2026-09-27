---
title: "Comandos"
---

Esta es la referencia de los comandos de barra de OpenSpec. Se invocan en la
interfaz de chat de tu asistente de programación con IA (por ejemplo, Claude
Code, Cursor o Devin Desktop).

Para conocer los patrones de flujo de trabajo y cuándo conviene usar cada
comando, consulta [Flujos de trabajo](/es-ES/workflows/). Para los comandos de
la CLI, consulta [CLI](/es-ES/cli/).

Estas páginas usan `/opsx:<command>` como nombre canónico. Algunas herramientas lo escriben
de otra forma: Cursor y GitHub Copilot registran `/opsx-propose`; Codex usa
`$openspec-propose`. Por eso, consulta [Cómo invocarlos](/es-ES/supported-tools/#cómo-invocarlos)
para saber qué sintaxis usa tu herramienta. Los archivos que genera OpenSpec ya
utilizan el formato adecuado.

## Referencia rápida

### Ruta rápida predeterminada (perfil `core`)

| Comando | Función |
|---------|---------|
| `/opsx:propose` | Crear un cambio y generar sus artefactos de planificación en un paso |
| `/opsx:explore` | Analizar ideas antes de convertirlas en un cambio |
| `/opsx:apply` | Implementar las tareas del cambio |
| `/opsx:update` | Revisar los artefactos de planificación y mantenerlos coherentes |
| `/opsx:sync` | Combinar las especificaciones delta con las principales |
| `/opsx:archive` | Archivar un cambio completado |

### Comandos del flujo ampliado (selección personalizada)

| Comando | Función |
|---------|---------|
| `/opsx:new` | Crear la estructura de un cambio nuevo |
| `/opsx:continue` | Crear el siguiente artefacto según sus dependencias |
| `/opsx:ff` | Avanzar rápidamente: crear todos los artefactos de planificación a la vez |
| `/opsx:verify` | Validar que la implementación coincida con los artefactos |
| `/opsx:bulk-archive` | Archivar varios cambios a la vez |
| `/opsx:onboard` | Tutorial guiado por todo el flujo de trabajo |

El perfil global predeterminado es `core`. Para activar los comandos ampliados,
ejecuta `openspec config profile`, selecciona los flujos de trabajo y luego
ejecuta `openspec update` en el proyecto.

---

## Referencia de comandos

### `/opsx:propose`

Crea un cambio nuevo y genera los artefactos de planificación en un solo paso.
Es el comando de inicio predeterminado del perfil `core`.

**Sintaxis:**
```text
/opsx:propose [change-name-or-description]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name-or-description` | No | Nombre en kebab-case o descripción del cambio en lenguaje natural |

**Qué hace:**
- Crea `openspec/changes/<change-name>/`.
- Genera los artefactos necesarios antes de la implementación (para `spec-driven`: propuesta, especificaciones, diseño y tareas).
- Se detiene cuando el cambio está listo para `/opsx:apply`.

**Ejemplo:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Consejos:**
- Úsalo para seguir la ruta más rápida de principio a fin.
- Si quieres controlar los artefactos paso a paso, activa los flujos ampliados y usa `/opsx:new` y `/opsx:continue`.

---

### `/opsx:explore`

> **Empieza aquí si tienes dudas.** Explore es un compañero de reflexión sin
> compromiso: lee tu base de código, compara opciones y convierte una idea
> imprecisa en un plan concreto antes de escribir código. Se incluye en el
> perfil predeterminado. Para conocer el enfoque completo y ver más ejemplos,
> consulta la guía [Empieza por explorar](/es-ES/explore/).

Analiza ideas, investiga problemas y aclara los requisitos antes de decidirte
por un cambio.

**Sintaxis:**
```
/opsx:explore [topic]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `topic` | No | Tema que quieres explorar o investigar |

**Qué hace:**
- Inicia una conversación exploratoria sin exigir una estructura.
- Investiga la base de código para responder preguntas.
- Compara opciones y enfoques.
- Crea diagramas visuales para aclarar las ideas.
- Registra la exploración si se lo pides o aceptas su ofrecimiento: crea la estructura de un cambio con `openspec new change` y redacta los artefactos de planificación que indiques, o actualiza los artefactos de un cambio existente.
- Cuando las ideas estén claras, puede pasar a `/opsx:propose` (predeterminado) o `/opsx:new` (flujo ampliado).

**Example:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT.

AI:  That's a decision worth keeping. Want me to start a change called
     add-jwt-auth? Just the change folder, nothing else yet.

You: Yes.

AI:  Started openspec/changes/add-jwt-auth/. Say the word and I'll
     write the proposal, specs, and tasks from what we just worked out.
```

**Consejos:**
- Úsalo si los requisitos no están claros o necesitas investigar.
- Nunca escribe código ni crea otros archivos, a menos que se lo pidas o aceptes su ofrecimiento.
- Es útil para comparar varios enfoques antes de decidir.
- Puede leer archivos y buscar en la base de código.

---

### `/opsx:new`

Inicia la estructura de un cambio nuevo. Crea su carpeta y espera a que
generes artefactos con `/opsx:continue` o `/opsx:ff`.

Este comando forma parte del conjunto de flujos ampliados (no se incluye en el
perfil predeterminado `core`).

**Sintaxis:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Nombre de la carpeta del cambio (pregunta si se omite) |
| `--schema` | No | Esquema de flujo que se usará (predeterminado: el de la configuración o `spec-driven`) |

**Qué hace:**
- Crea el directorio `openspec/changes/<change-name>/`.
- Crea el archivo de metadatos `.openspec.yaml` en la carpeta del cambio.
- Muestra la primera plantilla de artefacto que se puede crear.
- Pregunta el nombre del cambio y el esquema si no se indican.

**Qué crea:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**Ejemplo:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Consejos:**
- Usa nombres descriptivos: `add-feature`, `fix-bug`, `refactor-module`.
- Evita nombres genéricos como `update`, `changes`, `wip`.
- También puedes establecer el esquema en la configuración del proyecto (`openspec/config.yaml`).

---

### `/opsx:continue`

Crea el siguiente artefacto de la cadena de dependencias. Crea los artefactos
de uno en uno para avanzar de forma incremental.

**Sintaxis:**
```
/opsx:continue [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se continuará (se deduce del contexto si se omite) |

**Qué hace:**
- Consulta el grafo de dependencias de los artefactos.
- Muestra qué artefactos están listos y cuáles bloqueados.
- Crea el primer artefacto que esté listo.
- Lee los archivos de los que depende para obtener contexto.
- Muestra qué otros artefactos quedan disponibles después de crearlo.

**Ejemplo:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs, design)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: design
     Run /opsx:continue to create the next artifact.
```

**Consejos:**
- Úsalo si quieres revisar cada artefacto antes de continuar.
- Es adecuado para cambios complejos en los que quieras mantener el control.
- Es posible que varios artefactos queden listos al mismo tiempo.
- Puedes editar los artefactos creados antes de continuar.

---

### `/opsx:ff`

Avanza rápidamente por la creación de artefactos. Crea todos los artefactos de
planificación a la vez.

**Sintaxis:**
```
/opsx:ff [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se procesará de forma rápida (se deduce del contexto si se omite) |

**Qué hace:**
- Crea todos los artefactos siguiendo el orden de dependencias.
- Registra el progreso en una lista de tareas.
- Se detiene cuando se completan todos los artefactos `apply-required`.
- Lee cada dependencia antes de crear el artefacto siguiente.

**Ejemplo:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Consejos:**
- Úsalo si tienes claro qué vas a construir.
- Es más rápido que `/opsx:continue` para cambios sencillos.
- Puedes seguir editando los artefactos después.
- Es adecuado para funciones pequeñas o medianas.

---

### `/opsx:apply`

Implementa las tareas del cambio. Recorre la lista, escribe código y marca los
elementos completados.

**Sintaxis:**
```
/opsx:apply [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se implementará (se deduce del contexto si se omite) |

**Qué hace:**
- Lee `tasks.md` e identifica las tareas incompletas.
- Completa las tareas una por una.
- Escribe código, crea archivos y ejecuta pruebas según sea necesario.
- Marca las tareas completadas con casillas `[x]`.

**Ejemplo:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Consejos:**
- Si se interrumpe, puede reanudar el trabajo donde lo dejaste.
- Para trabajar en cambios paralelos, indica el nombre del cambio.
- El estado de finalización se registra en las casillas de `tasks.md`.

---

### `/opsx:update`

Revisa los artefactos de planificación existentes y mantén su coherencia.
Solo afecta a los artefactos de planificación; nunca modifica código.

**Sintaxis:**

```text
/opsx:update [change-name]
```

**Argumentos:**

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se actualizará (se deduce del contexto si se omite) |

**Qué hace:**

- Lee los artefactos del cambio mediante `openspec status --change <name> --json`.
- Aplica la revisión que solicitaste o, si no indicaste ninguna, examina los artefactos para detectar contradicciones.
- Concilia los demás artefactos existentes en cualquier dirección (un cambio en el diseño puede repercutir en la propuesta).
- Te pide confirmar cada edición antes de escribir, un artefacto a la vez.
- Termina recomendando el siguiente paso: `/opsx:continue` (hay artefactos sin empezar), `/opsx:apply` (trasladar el plan revisado al código) o `/opsx:archive` (todo está terminado).

**Archivos faltantes:**

- Si ya existe al menos un archivo de un artefacto con patrón glob, como `specs/**/*.md`, update puede proponer un archivo complementario que falte. Usa las instrucciones del esquema y te pide confirmar la ruta concreta antes de crearlo.
- Para los artefactos que aún no tienen archivos, usa `/opsx:continue`. Los artefactos omitidos intencionalmente no se modifican.
- Los archivos nuevos deben permanecer dentro del directorio del cambio. Si aparece un archivo en la ruta confirmada antes de crearlo, update se detiene en vez de sobrescribirlo.

**Ejemplo:**

```text
You: /opsx:update add-dark-mode - we're storing the theme in a cookie now, not localStorage

AI:  Reading add-dark-mode artifacts...

     The design references localStorage in two places; tasks 1.3 covers
     localStorage persistence; the proposal doesn't mention storage.

     Proposed revisions:
     1. design.md - swap localStorage decision for cookie storage
     2. tasks.md - reword task 1.3 to cookie persistence

     Apply revision 1? (design.md)
```

**Consejos:**

- No inicia un artefacto que aún no tenga archivos. Activa `/opsx:continue` para hacerlo, o usa `openspec status` y `openspec instructions` si ese flujo opcional no está instalado.
- Si ya se implementó el cambio, continúa con `/opsx:apply` para que el código coincida con el plan revisado.
- Si la revisión cambia la *intención* del cambio, empieza uno nuevo (consulta [Cuándo actualizar y cuándo empezar de cero](/es-ES/opsx/#cuándo-actualizar-y-cuándo-empezar-de-cero)).

---

### `/opsx:verify`

Valida que la implementación coincida con los artefactos del cambio.
Comprueba la integridad, la corrección y la coherencia.

**Sintaxis:**
```
/opsx:verify [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se verificará (se deduce del contexto si se omite) |

**Qué hace:**
- Comprueba tres dimensiones de la calidad de la implementación.
- Busca en la base de código pruebas de la implementación.
- Informa de los problemas clasificados como CRITICAL, WARNING o SUGGESTION.
- No impide archivar, pero señala los problemas encontrados.

**Dimensiones de verificación:**

| Dimensión | Qué valida |
|-----------|-------------------|
| **Integridad** | Se completaron todas las tareas, se implementaron todos los requisitos y se cubrieron los escenarios |
| **Corrección** | La implementación coincide con la intención de las especificaciones y gestiona los casos límite |
| **Coherencia** | Las decisiones de diseño se reflejan en el código y los patrones son coherentes |

**Ejemplo:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Consejos:**
- Ejecútalo antes de archivar para detectar discrepancias cuanto antes.
- Las advertencias no impiden archivar, pero indican posibles problemas.
- Es útil para revisar el trabajo de la IA antes de confirmarlo.
- Puede revelar divergencias entre los artefactos y la implementación.

---

### `/opsx:sync`

**Comando opcional.** Combina las especificaciones delta de un cambio con las
principales. Si hace falta sincronizarlas, archive te lo preguntará; por lo
general, no tendrás que ejecutar este comando manualmente.

**Sintaxis:**
```
/opsx:sync [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se sincronizará (se deduce del contexto si se omite) |

**Qué hace:**
- Lee las especificaciones delta de la carpeta del cambio.
- Analiza las secciones ADDED/MODIFIED/REMOVED/RENAMED.
- Combina los cambios con el directorio principal `openspec/specs/`.
- Conserva el contenido existente que no se menciona en la delta.
- No archiva el cambio (permanece activo).

**Ejemplo:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Cuándo usarlo manualmente:**

| Situación | ¿Usar sync? |
|----------|-----------|
| Cambio de larga duración; quieres actualizar las especificaciones principales antes de archivar | Sí |
| Varios cambios en paralelo necesitan las especificaciones base actualizadas | Sí |
| Quieres obtener una vista previa o revisar la combinación por separado | Sí |
| Cambio rápido que se archivará de inmediato | No (archive se encarga) |

**Consejos:**
- Sync combina de forma inteligente; no se limita a copiar y pegar.
- Puede añadir escenarios a requisitos existentes sin duplicarlos.
- El cambio permanece activo después de la sincronización (no se archiva).
- La mayoría de las personas no necesitará invocarlo directamente: archive lo ofrece si hace falta.

---

### `/opsx:archive`

Archiva un cambio completado. Lo finaliza y lo mueve a la carpeta de archivo.

**Sintaxis:**
```
/opsx:archive [change-name]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-name` | No | Cambio que se archivará (se deduce del contexto si se omite) |

**Qué hace:**
- Comprueba el estado de finalización de los artefactos.
- Comprueba si se completaron las tareas (avisa si faltan tareas).
- Ofrece sincronizar las especificaciones delta si aún no se hizo.
- Mueve la carpeta del cambio a `openspec/changes/archive/YYYY-MM-DD-<name>/`.
- Conserva todos los artefactos como registro de auditoría.

**Ejemplo:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Consejos:**
- Archive no impide archivar si hay tareas incompletas, pero muestra una advertencia.
- Las especificaciones delta se pueden sincronizar durante el archivado o antes.
- Los cambios archivados se conservan como historial.
- Usa primero `/opsx:verify` para detectar problemas.

---

### `/opsx:bulk-archive`

Archiva varios cambios completados a la vez. Gestiona los conflictos entre sus
especificaciones.

**Sintaxis:**
```
/opsx:bulk-archive [change-names...]
```

**Argumentos:**
| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `change-names` | No | Cambios concretos que se archivarán (pregunta cuáles seleccionar si se omite) |

**Qué hace:**
- Enumera todos los cambios completados.
- Valida cada cambio antes de archivarlo.
- Detecta conflictos entre las especificaciones de los cambios.
- Resuelve conflictos comprobando qué se ha implementado realmente.
- Archiva en orden cronológico.

**Ejemplo:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Consejos:**
- Es útil para líneas de trabajo paralelas.
- La resolución de conflictos es agéntica (comprueba la base de código).
- Los cambios se archivan en el orden en que se crearon.
- Pregunta antes de sobrescribir contenido de las especificaciones.

---

### `/opsx:onboard`

Recorrido guiado por todo el flujo de trabajo de OpenSpec. Tutorial
interactivo que utiliza tu base de código real.

**Sintaxis:**
```
/opsx:onboard
```

**Qué hace:**
- Recorre y explica un ciclo completo del flujo de trabajo.
- Busca oportunidades reales de mejora en la base de código.
- Crea un cambio real con artefactos reales.
- Implementa trabajo real (cambios pequeños y seguros).
- Archiva el cambio completado.
- Explica cada paso a medida que se realiza.

**Fases:**
1. Bienvenida y análisis de la base de código.
2. Búsqueda de una oportunidad de mejora.
3. Creación de un cambio (`/opsx:new`).
4. Redacción de la propuesta.
5. Creación de las especificaciones.
6. Redacción del diseño.
7. Creación de las tareas.
8. Implementación de las tareas (`/opsx:apply`).
9. Verificación de la implementación.
10. Archivado del cambio.
11. Resumen y pasos siguientes.

**Ejemplo:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Consejos:**
- Es ideal para quienes empiezan y quieren aprender el flujo de trabajo.
- Usa código real, no ejemplos de juguete.
- Crea un cambio real que puedes conservar o descartar.
- Se completa en unos 15 a 30 minutos.

---

## Sintaxis de los comandos según la herramienta de IA

Las herramientas de IA usan sintaxis de comandos ligeramente distintas. Usa el
formato correspondiente a tu herramienta:

| Archivo de comandos de la herramienta | Ejemplo de sintaxis | Herramientas de ejemplo |
|--------------------------|----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose`, `/opsx:apply` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose`, `/opsx-apply` | Cursor, Devin Desktop, Copilot (IDE), Trae, Oh My Pi |
| none — skills only | `/openspec-propose`, `/openspec-apply-change` | CodeArts, ForgeCode, Hermes, MiniMax Code, Mistral Vibe, Zed Agent, shared `.agents` |
| none — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| none — Codex CLI | `$openspec-propose` | Codex |

> **Devin Desktop y Devin Local:** los archivos `.devin/workflows/opsx-*.md`
> permiten usar `/opsx-propose` en Devin Desktop. Devin Local no admite flujos
> de trabajo; usa las habilidades que OpenSpec escribe en `.devin/skills/`,
> como `/openspec-propose`, que funcionan en ambos agentes.

La intención es la misma en todas las herramientas, pero la forma de invocar
los comandos puede variar según la integración. [Cómo invocarlos](/es-ES/supported-tools/#cómo-invocarlos)
enumera todas las herramientas compatibles; esta tabla solo muestra ejemplos
de cada formato.

> **Nota:** los comandos de GitHub Copilot (`.github/prompts/*.prompt.md`) solo
> están disponibles en las extensiones de IDE (VS Code, JetBrains y Visual
> Studio). GitHub Copilot CLI todavía no admite archivos de instrucciones
> personalizados; consulta [Herramientas compatibles](/es-ES/supported-tools/)
> para obtener información y alternativas.

---

## Comandos heredados

Estos comandos usan el flujo de trabajo antiguo, que lo crea «todo a la vez».
Siguen funcionando, pero se recomiendan los comandos de OPSX.

| Comando | Función |
|---------|--------------|
| `/openspec:proposal` | Crear todos los artefactos a la vez (propuesta, especificaciones, diseño y tareas) |
| `/openspec:apply` | Implementar el cambio |
| `/openspec:archive` | Archivar el cambio |

**Cuándo usar los comandos heredados:**
- En proyectos existentes que usan el flujo de trabajo antiguo.
- En cambios sencillos que no requieren crear artefactos de forma incremental.
- Si prefieres el enfoque de todo o nada.

**Migrar a OPSX:**
Puedes continuar los cambios heredados con comandos de OPSX. La estructura de
los artefactos es compatible.

---

## Solución de problemas

### «No se encuentra el cambio»

El comando no pudo identificar en qué cambio debe trabajar.

**Soluciones:**
- Indica explícitamente el nombre del cambio: `/opsx:apply add-dark-mode`.
- Comprueba que exista la carpeta del cambio: `openspec list`.
- Verifica que estés en el directorio correcto del proyecto.

### «No hay artefactos listos»

Todos los artefactos están completados o bloqueados por dependencias faltantes.

**Soluciones:**
- Ejecuta `openspec status --change <name>` para ver qué lo bloquea.
- Comprueba si existen los artefactos necesarios.
- Primero, crea los artefactos de las dependencias faltantes.

### «No se encuentra el esquema»

El esquema especificado no existe.

**Soluciones:**
- Enumera los esquemas disponibles: `openspec schemas`.
- Comprueba que el nombre del esquema esté bien escrito.
- Si es personalizado, crea el esquema: `openspec schema init <name>`.

### No se reconocen los comandos

La herramienta de IA no reconoce los comandos de OpenSpec.

**Soluciones:**
- Comprueba que OpenSpec esté inicializado: `openspec init`.
- Vuelve a generar las habilidades: `openspec update`.
- Comprueba que exista el directorio `.claude/skills/` (para Claude Code).
- Reinicia la herramienta de IA para que detecte las nuevas habilidades.

### Los artefactos no se generan correctamente

La IA crea artefactos incompletos o incorrectos.

**Soluciones:**
- Añade contexto del proyecto en `openspec/config.yaml`.
- Añade reglas por artefacto para dar indicaciones concretas.
- Proporciona más detalles en la descripción del cambio.
- Usa `/opsx:continue` en lugar de `/opsx:ff` para tener más control.

---

## Próximos pasos

- [Flujos de trabajo](/es-ES/workflows/): patrones habituales y cuándo usar cada comando
- [CLI](/es-ES/cli/): comandos de terminal para administrar y validar
- [Personalización](/es-ES/customization/): crear esquemas y flujos de trabajo personalizados
