---
title: "Migrar a OPSX"
---

Esta guía te ayuda a pasar del flujo de trabajo heredado de OpenSpec a OPSX.
La migración está diseñada para ser sencilla: el trabajo existente se conserva
y el nuevo sistema ofrece más flexibilidad.

## ¿Qué cambia?

OPSX sustituye el antiguo flujo rígido basado en fases por un enfoque flexible
basado en acciones. Este es el cambio principal:

| Aspecto | Heredado | OPSX |
|--------|--------|------|
| **Comandos** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Predeterminados: `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive` (comandos ampliados opcionales) |
| **Flujo de trabajo** | Crear todos los artefactos a la vez | Crearlos de forma incremental o todos de una vez, como prefieras |
| **Volver atrás** | Fases que dificultan regresar | Natural: actualiza cualquier artefacto en cualquier momento |
| **Personalización** | Estructura fija | Basado en esquemas, totalmente adaptable |
| **Configuración** | `CLAUDE.md` con marcas y `project.md` | Configuración sencilla en `openspec/config.yaml` |

**El cambio de filosofía:** el trabajo no es lineal. OPSX deja de fingir que lo es.

---

## Antes de empezar

### Tu trabajo actual está a salvo

El proceso de migración está diseñado para conservarlo:

- **Cambios activos en `openspec/changes/`**: se conservan por completo. Puedes continuarlos con los comandos de OPSX.
- **Cambios archivados**: no se modifican. El historial permanece intacto.
- **Especificaciones principales en `openspec/specs/`**: no se modifican; son tu fuente de verdad.
- **Tu contenido en CLAUDE.md, AGENTS.md, etc.**: se conserva. Solo se eliminan los bloques marcadores de OpenSpec; todo lo que escribiste permanece.

### Qué se elimina

Solo se eliminan los archivos administrados por OpenSpec que van a sustituirse:

| Elemento | Motivo |
|------|-----|
| Directorios y archivos heredados de comandos de barra | Los sustituye el nuevo sistema de habilidades |
| `openspec/AGENTS.md` | Activador de flujo de trabajo obsoleto |
| Marcadores de OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc. | Ya no son necesarios |

**Ubicaciones de comandos heredados por herramienta** (son ejemplos; tu herramienta puede variar):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Devin Desktop, anteriormente Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (solo extensiones de IDE; Copilot CLI no lo admite)
- Codex: OpenSpec ahora usa la ruta canónica `.agents/skills/openspec-*`. Los
  archivos `SKILL.md` administrados por OpenSpec en la antigua ruta
  `.codex/skills` solo se reconcilian después de que existan sus reemplazos;
  los archivos personalizados y las copias divergentes permanecen intactos.
  Si un árbol `.agents` sin marca ya contiene habilidades de OpenSpec,
  OpenSpec conserva el formato existente de Codex (`$openspec-*`) o el formato
  genérico (`/openspec-*`), en vez de deducirlo a partir del directorio
  heredado. Para transferir explícitamente la administración, selecciona
  `codex` con `openspec init`. La limpieza de instrucciones heredadas solo
  afecta a los nombres de archivo permitidos por OpenSpec en
  `$CODEX_HOME/prompts` o `~/.codex/prompts`.
- Y otras herramientas (Augment, Continue, Amazon Q, etc.).

La migración detecta las herramientas que configuraste y elimina sus archivos heredados.

La lista de elementos eliminados puede parecer larga, pero todos son archivos
que creó OpenSpec. Tu contenido nunca se elimina.

### Qué debes revisar

Un archivo debe migrarse manualmente:

**`openspec/project.md`**: este archivo no se elimina automáticamente porque
puede contener contexto del proyecto que hayas escrito. Tendrás que:

1. Revisar su contenido.
2. Trasladar el contexto útil a `openspec/config.yaml` (consulta las indicaciones más adelante).
3. Eliminar el archivo cuando estés listo.

**Por qué hicimos este cambio:**

El antiguo `project.md` era pasivo: los agentes podían leerlo o no, y quizá
olvidaran lo que habían leído. Descubrimos que su fiabilidad era irregular.

El contexto de `config.yaml` ahora se **incorpora activamente a todas las
solicitudes de planificación de OpenSpec**. Así, las convenciones del proyecto,
la pila tecnológica y las reglas siempre están presentes cuando la IA crea
artefactos. La fiabilidad mejora.

**La contrapartida:**

Como el contexto se incorpora a todas las solicitudes, conviene ser conciso.
Céntrate en lo realmente importante:
- Pila tecnológica y convenciones clave.
- Restricciones poco evidentes que la IA debe conocer.
- Reglas que antes solían ignorarse.

No te preocupes por dejarlo perfecto. Seguimos aprendiendo qué funciona mejor
y mejoraremos la incorporación de contexto a medida que experimentemos.

---

## Ejecutar la migración

Tanto `openspec init` como `openspec update` detectan archivos heredados y te
guían por el mismo proceso de limpieza. Usa el comando que mejor se adapte a tu
caso:

- Las instalaciones nuevas usan el perfil predeterminado `core` (`propose`, `explore`, `apply`, `update`, `sync`, `archive`).
- Las instalaciones migradas conservan los flujos instalados anteriormente; si es necesario, escriben un perfil `custom`.

### Usar `openspec init`

Ejecuta este comando si quieres añadir herramientas o volver a configurar las herramientas instaladas:

```bash
openspec init
```

El comando init detecta los archivos heredados y te guía durante la limpieza:

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

**Qué ocurre si respondes que sí:**

1. Se eliminan los directorios heredados de comandos de barra.
2. Se quitan los marcadores de OpenSpec de `CLAUDE.md`, `AGENTS.md`, etc. (tu contenido se conserva).
3. Se elimina `openspec/AGENTS.md`.
4. Se instalan las habilidades nuevas en `.claude/skills/`.
5. Se crea `openspec/config.yaml` con un esquema predeterminado.

### Usar `openspec update`

Ejecuta este comando si solo quieres migrar y actualizar tus herramientas existentes a la última versión:

```bash
openspec update
```

El comando update también detecta y limpia los artefactos heredados, y luego
actualiza las habilidades y los comandos generados para que coincidan con el
perfil y el modo de distribución actuales.

### Entornos no interactivos o de CI

Para migraciones mediante scripts:

```bash
openspec init --force --tools claude
```

La opción `--force` omite las preguntas y acepta automáticamente la limpieza.

Esto incluye la limpieza de los archivos de instrucciones de Codex administrados
por OpenSpec en el directorio global de instrucciones de Codex. La limpieza solo
afecta a los nombres de archivos heredados de Codex incluidos en la lista
permitida de OpenSpec, los elimina únicamente después de que existan sus
reemplazos en `.agents/skills/openspec-*` y conserva todos los demás archivos.

---

## Migrar de project.md a config.yaml

El antiguo `openspec/project.md` era un archivo Markdown de texto libre para el
contexto del proyecto. El nuevo `openspec/config.yaml` tiene una estructura
definida y, lo más importante, se **incorpora a todas las solicitudes de
planificación** para que la IA siempre tenga presentes tus convenciones.

### Antes (project.md)

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

### Después (config.yaml)

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

### Diferencias principales

| project.md | config.yaml |
|------------|-------------|
| Markdown de texto libre | YAML estructurado |
| Un bloque de texto | Contexto independiente y reglas por artefacto |
| No queda claro cuándo se usa | El contexto aparece en TODOS los artefactos; las reglas, solo en los correspondientes |
| No permite seleccionar esquemas | El campo explícito `schema:` establece el flujo predeterminado |

### Qué conservar y qué descartar

Al migrar, selecciona con cuidado. Pregúntate: «¿Necesita la IA esta
información en *todas* las solicitudes de planificación?».

**Buen contenido para `context:`**
- Pila tecnológica (lenguajes, marcos de trabajo y bases de datos).
- Patrones arquitectónicos clave (monorepositorio, microservicios, etc.).
- Restricciones poco evidentes («no podemos usar la biblioteca X porque...»).
- Convenciones importantes que suelen ignorarse.

**Traslada este contenido a `rules:`**
- Formatos específicos de artefactos («usa Dado/Cuando/Entonces en las especificaciones»).
- Criterios de revisión («las propuestas deben incluir planes de reversión»).
- Solo aparecen en los artefactos correspondientes y mantienen más breves las demás solicitudes.

**Omite por completo**
- Buenas prácticas generales que la IA ya conoce.
- Explicaciones extensas que se pueden resumir.
- Contexto histórico que no afecte al trabajo actual.

### Pasos de migración

1. **Crea config.yaml** (si init aún no lo ha creado):
   ```yaml
   schema: spec-driven
   ```

2. **Añade el contexto** (sé conciso: se incluirá en todas las solicitudes):
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **Añade reglas por artefacto** (opcional):
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **Elimina project.md** cuando hayas trasladado todo lo útil.

**No le des demasiadas vueltas.** Empieza por lo esencial e itera. Si notas
que a la IA le falta información importante, añádela. Si el contexto parece
demasiado extenso, recórtalo. Es un documento vivo.

### ¿Necesitas ayuda? Usa esta instrucción

Si no sabes cómo resumir tu project.md, pide ayuda a tu asistente de IA:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

La IA te ayudará a distinguir lo esencial de lo que puedes recortar.

---

## Los nuevos comandos

La disponibilidad de los comandos depende del perfil:

**Predeterminados (perfil `core`):**

| Comando | Función |
|---------|---------|
| `/opsx:propose` | Crear un cambio y generar sus artefactos de planificación en un paso |
| `/opsx:explore` | Analizar ideas sin una estructura predefinida |
| `/opsx:apply` | Implementar las tareas de tasks.md |
| `/opsx:update` | Revisar los artefactos de planificación y mantenerlos coherentes |
| `/opsx:sync` | Combinar las especificaciones delta con las principales |
| `/opsx:archive` | Finalizar y archivar el cambio |

**Flujo ampliado (selección personalizada):**

| Comando | Función |
|---------|---------|
| `/opsx:new` | Crear la estructura de un cambio nuevo |
| `/opsx:continue` | Crear el siguiente artefacto (uno por vez) |
| `/opsx:ff` | Avanzar rápidamente y crear todos los artefactos de planificación |
| `/opsx:verify` | Validar que la implementación coincida con las especificaciones |
| `/opsx:bulk-archive` | Archivar varios cambios a la vez |
| `/opsx:onboard` | Recorrido guiado de incorporación de principio a fin |

Activa los comandos ampliados con `openspec config profile` y luego ejecuta `openspec update`.

### Equivalencias de los comandos heredados

| Heredado | Equivalente en OPSX |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (default) or `/opsx:new` then `/opsx:ff` (expanded) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Nuevas capacidades

Estas capacidades forman parte del conjunto de comandos del flujo ampliado.

**Creación granular de artefactos:**
```
/opsx:continue
```
Crea un artefacto por vez según sus dependencias. Úsalo si quieres revisar cada paso.

**Modo de exploración:**
```
/opsx:explore
```
Analiza las ideas con un compañero antes de convertirlas en un cambio.

---

## Entender la nueva arquitectura

### De las fases rígidas a la flexibilidad

El flujo de trabajo heredado obligaba a avanzar de forma lineal:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

If you're in implementation and realize the design is wrong?
Too bad. Phase gates don't let you go back easily.
```

OPSX usa acciones, no fases:

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

### Grafo de dependencias

Los artefactos forman un grafo dirigido. Las dependencias habilitan el trabajo,
no lo bloquean:

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

Al ejecutar `/opsx:continue`, el sistema comprueba qué está listo y ofrece el
siguiente artefacto. También puedes crear varios artefactos disponibles en el
orden que prefieras.

### Habilidades frente a comandos

El sistema heredado usaba archivos de comandos específicos de cada herramienta:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX usa el nuevo estándar de **habilidades**:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Varias herramientas de programación con IA reconocen las habilidades, que
además proporcionan metadatos más completos.

En OPSX, Codex solo admite habilidades. OpenSpec ya no genera archivos de
instrucciones personalizados para Codex; usa los directorios
`.agents/skills/openspec-*` que se generan.

---

## Continuar los cambios existentes

Los cambios en curso funcionan sin problemas con los comandos de OPSX.

**¿Tienes un cambio activo del flujo heredado?**

```
/opsx:apply add-my-feature
```

OPSX lee los artefactos existentes y continúa desde donde lo dejaste.

**¿Quieres añadir más artefactos a un cambio existente?**

```
/opsx:continue add-my-feature
```

Muestra qué se puede crear según los artefactos que ya existen.

**¿Necesitas consultar el estado?**

```bash
openspec status --change add-my-feature
```

---

## El nuevo sistema de configuración

### Estructura de config.yaml

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

### Resolución del esquema

Para determinar qué esquema usar, OPSX los comprueba en este orden:

1. **Opción de la CLI**: `--schema <name>` (prioridad más alta).
2. **Metadatos del cambio**: `.openspec.yaml` en el directorio del cambio.
3. **Configuración del proyecto**: `openspec/config.yaml`.
4. **Predeterminado**: `spec-driven`.

### Esquemas disponibles

| Esquema | Artefactos | Ideal para |
|--------|-----------|----------|
| `spec-driven` | propuesta → especificaciones → diseño → tareas | La mayoría de los proyectos |

Enumera todos los esquemas disponibles:

```bash
openspec schemas
```

### Esquemas personalizados

Crea tu propio flujo de trabajo:

```bash
openspec schema init my-workflow
```

O crea una variante de uno existente:

```bash
openspec schema fork spec-driven my-workflow
```

Consulta [Personalización](/es-ES/customization/) para obtener más información.

---

## Solución de problemas

### «Se detectaron archivos heredados en modo no interactivo»

Estás ejecutando el comando en un entorno de CI o no interactivo. Usa:

```bash
openspec init --force
```

### Los comandos no aparecen después de la migración

Reinicia el IDE. Las habilidades se detectan al iniciarse.

### «ID de artefacto desconocido en rules»

Comprueba que las claves de `rules:` coincidan con los ID de artefacto del esquema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Ejecuta esto para consultar los ID de artefacto válidos:

```bash
openspec schemas --json
```

### No se aplica la configuración

1. Comprueba que el archivo esté en `openspec/config.yaml` (no en `.yml`).
2. Valida la sintaxis YAML.
3. Los cambios de configuración surten efecto de inmediato; no hace falta reiniciar.

### project.md no se ha migrado

El sistema conserva deliberadamente `project.md`, ya que puede contener
contenido personalizado. Revísalo manualmente, traslada las partes útiles a
`config.yaml` y elimínalo.

### ¿Quieres ver qué se eliminaría?

Ejecuta init y rechaza la solicitud de limpieza: verás un resumen completo de
los elementos detectados sin que se modifique nada.

---

## Referencia rápida

### Archivos después de la migración

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

### Qué ha desaparecido

- `.claude/commands/openspec/`: sustituido por `.claude/skills/`.
- `openspec/AGENTS.md`: obsoleto.
- `openspec/project.md`: migra su contenido a `config.yaml` y luego elimínalo.
- Bloques marcadores de OpenSpec en `CLAUDE.md`, `AGENTS.md`, etc.

### Resumen de comandos

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

## Obtener ayuda

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Incidencias de GitHub**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Documentación**: consulta la [referencia completa de OPSX](/es-ES/opsx/)
