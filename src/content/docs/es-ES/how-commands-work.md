---
title: "Cómo funcionan los comandos"
---

**Lo más importante: OpenSpec tiene dos tipos de comandos y se ejecutan en lugares distintos.**

- Los comandos `openspec ...` se ejecutan en el **terminal**. (Ejemplo: `openspec init`.)
- Los comandos `/opsx:...` se ejecutan en el **chat de tu asistente de IA**. (Ejemplo: `/opsx:propose`.)

Si alguna vez escribes `/opsx:propose` en el terminal y no ocurre nada, esta página te explica por qué: estás usando la mitad equivocada de OpenSpec. Los comandos de barra no son comandos de terminal; son instrucciones para tu asistente de programación con IA, en el mismo cuadro de chat donde normalmente escribirías «añade un formulario de inicio de sesión».

Esta distinción es el obstáculo más habitual para quienes empiezan, así que vamos a dejarla muy clara.

## Las dos mitades

OpenSpec es un proyecto que cumple dos funciones.

**La CLI (la mitad del terminal).** Un programa llamado `openspec` que instalas y ejecutas desde el shell. Configura el proyecto, enumera y valida cambios, muestra un panel y archiva el trabajo terminado. Estos comandos se escriben en iTerm, el terminal de VS Code, PowerShell o cualquier otro lugar donde ejecutarías `git` o `npm`.

```bash
openspec init        # set up OpenSpec in this project
openspec list        # see active changes
openspec view        # open the interactive dashboard
```

**Los comandos de barra (la mitad del chat).** Comandos breves, como `/opsx:propose` y `/opsx:apply`, que escribes en el asistente de IA. Le indican a la IA que siga el flujo de OpenSpec: redactar una propuesta, escribir especificaciones, implementar a partir de la lista de tareas y archivar al terminar. Los escribes en Claude Code, Cursor, Devin Desktop, Copilot o el asistente que uses.

```text
/opsx:propose add-dark-mode    (typed in your AI chat)
/opsx:apply                    (typed in your AI chat)
/opsx:archive                  (typed in your AI chat)
```

Este diagrama resume el modelo mental:

```text
        YOUR TERMINAL                         YOUR AI ASSISTANT'S CHAT
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   installs    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   commands    │  /opsx:archive                │
   └──────────────────────┘    & skills   └──────────────────────────────┘
        run openspec here                       run /opsx:* here
```

Fíjate en la flecha. Al ejecutar `openspec init` en el terminal, se *instalan* los comandos de barra en la herramienta de IA. La mitad del terminal configura la mitad del chat. A partir de ahí, el trabajo cotidiano se hace principalmente en el chat.

## «¿Cómo inicio el modo interactivo?»

**No hay ningún modo interactivo aparte que debas iniciar.** Esta pregunta surge a menudo y merece una respuesta directa.

No entras en un modo especial de OpenSpec. Abres tu asistente de programación con IA como siempre y escribes un comando de barra en el chat. El comando de barra *es* la forma de «entrar» en OpenSpec. Tu asistente lo reconoce, carga la habilidad de OpenSpec correspondiente y empieza a seguir el flujo de trabajo.

En realidad, solo tienes que:

1. Abrir el asistente de programación con IA (Claude Code, Cursor, Devin Desktop, etc.) en el proyecto.
2. Escribir `/opsx:propose` en el chat, donde escribes cualquier otra petición.
3. Observar el autocompletado: si OpenSpec está instalado, al escribir la barra aparecerán `/opsx:propose`, `/opsx:apply` y otros comandos.

Eso es todo. No hay que activar ningún modo, iniciar ningún daemon ni abrir otra ventana.

Hay una función que *sí* es realmente interactiva y se ejecuta en el terminal: `openspec view`. Abre un panel para explorar las especificaciones y los cambios, pero es un visor, no la herramienta con la que propones e implementas. La implementación se hace con comandos de barra en el chat.

## Por qué existe esta división

Vale la pena entenderlo, porque así se explica por qué OpenSpec funciona con más de 30 herramientas de IA.

La CLI es el **motor**. Conoce las reglas: cómo es la carpeta de un cambio, qué artefactos dependen de otros y cómo integrar una especificación delta en la fuente de verdad. Es la misma para todas las herramientas.

Los comandos de barra son el **volante**, y cada herramienta de IA tiene uno ligeramente distinto. Claude Code los llama comandos; Cursor y Devin Desktop tienen sus propios formatos. Algunas herramientas los llaman habilidades. Al ejecutar `openspec init`, OpenSpec genera el tipo de archivo adecuado para cada herramienta que hayas seleccionado, de modo que la misma acción `/opsx:propose` funciona con el asistente que prefieras.

La ventaja de este diseño es que aprendes el flujo una sola vez y puedes trasladarlo de una herramienta a otra. La contrapartida es que la sintaxis exacta del comando puede variar ligeramente entre herramientas, como se explica en la sección siguiente.

## Sintaxis de los comandos de barra por herramienta

La intención es la misma en todas partes. La forma de escribir el comando depende del archivo que carga la herramienta.

| Archivo de comando de la herramienta | Cómo se escribe | Herramientas de ejemplo |
|--------------------------|-----------------|---------------|
| `.../commands/opsx/<id>.*` | `/opsx:propose` | Claude Code, Gemini CLI, Crush |
| `.../opsx-<id>.*` | `/opsx-propose` | Cursor, GitHub Copilot (IDE), Devin Desktop, Trae, Oh My Pi |
| `.amazonq/prompts/opsx-<id>.md` | `@opsx-propose` | Amazon Q Developer |
| none — skills only | `/openspec-propose` | CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent, shared `.agents` |
| none — Kimi Code | `/skill:openspec-propose` | Kimi Code |
| none — Codex CLI | `$openspec-propose` | Codex |

Devin es la única herramienta que aparece en dos filas. Devin Desktop lee
`.devin/workflows/`, así que `/opsx-propose` funciona allí; [Devin Local no lo
hace](https://docs.devin.ai/desktop/devin-local), así que en ese agente usa la
habilidad `/openspec-propose`. Las habilidades que OpenSpec escribe en
`.devin/skills/` funcionan en ambas, por eso se refieren entre sí por el nombre de la habilidad.

Todas las herramientas aparecen en [Cómo invocar comandos](/es-ES/supported-tools/#cómo-invocarlos); esa tabla es la referencia oficial. Dos filas no corresponden a comandos de barra: Amazon Q carga sus archivos en una biblioteca de prompts que se invoca con `@`, y las tres últimas filas usan el nombre de la *habilidad*, que no es el identificador del comando (`/opsx:apply` corresponde a la habilidad `openspec-apply-change`).

Si tienes dudas, lee la línea «Primeros pasos» que imprimió `openspec init`: ya usa la forma registrada por tus herramientas. También puedes escribir una barra y observar el autocompletado, si la herramienta muestra comandos de barra.

## Cómo llegaron ahí los comandos: habilidades y comandos

Al ejecutar `openspec init` (o `openspec update`), OpenSpec escribe archivos pequeños en el proyecto para que la herramienta de IA encuentre el flujo de trabajo. Según la herramienta y la configuración, pueden ser **habilidades**, **comandos** o ambos.

- **Las habilidades** se guardan en rutas como `.claude/skills/openspec-*/SKILL.md`. Son el estándar emergente compatible con varias herramientas: una carpeta de instrucciones que el asistente detecta automáticamente.
- **Los comandos** se guardan en rutas como `.cursor/commands/opsx-<id>.md` o `.claude/commands/opsx/<id>.md`. La estructura depende de la herramienta, que determina cómo se escribe el comando. Son los antiguos archivos de comandos de barra específicos de cada herramienta. Codex no genera archivos de comando; usa `.agents/skills/openspec-*`.

No hace falta que te preocupes por cuál usa la herramienta: escribes el comando de barra y funciona. Pero saber que existen estos archivos ayuda cuando algo falla. Si desaparecen los comandos, suele significar que los archivos faltan o están desactualizados; `openspec update` los vuelve a generar.

Consulta [Herramientas compatibles](/es-ES/supported-tools/) para ver las rutas exactas de cada herramienta y la [guía de migración](/es-ES/migration-guide/) para saber cómo las habilidades sustituyeron al antiguo enfoque basado únicamente en comandos.

## Comprobar que está instalado

Comprobaciones rápidas, ordenadas de menor a mayor esfuerzo:

1. **Escribe una barra en el chat de la IA.** Empieza a escribir `/opsx` y observa las sugerencias de autocompletado. Si aparecen, ya está. En las herramientas que solo usan habilidades (Codex, Kimi Code, CodeArts, ForgeCode, Hermes, Mistral Vibe, Zed Agent o el destino compartido `.agents`), `/opsx` nunca se completa, aunque la instalación funcione; prueba en su lugar el nombre de la habilidad de la tabla anterior.
2. **Busca los archivos.** En Claude Code, comprueba que `.claude/skills/` contenga carpetas `openspec-*`. Otras herramientas usan sus propios directorios (la lista está en [Herramientas compatibles](/es-ES/supported-tools/)).
3. **Vuelve a ejecutar la configuración.** Desde la raíz del proyecto, ejecuta `openspec update`. Se regenerarán los archivos de habilidades y comandos para las herramientas configuradas.
4. **Reinicia el asistente.** Muchas herramientas detectan habilidades y comandos al iniciarse, así que abrir una ventana nueva puede resolver el problema.

## ¿Qué comandos tengo?

De forma predeterminada, OpenSpec instala el conjunto **core** de comandos de barra:

- `/opsx:explore`: piensa la idea con la IA antes de comprometerte con un cambio (un buen primer paso si tienes dudas).
- `/opsx:propose`: crea un cambio y redacta todos los artefactos de planificación de una vez.
- `/opsx:apply`: implementa el cambio siguiendo la lista de tareas.
- `/opsx:update`: revisa los artefactos de planificación del cambio y mantenlos coherentes.
- `/opsx:sync`: integra las actualizaciones de las especificaciones del cambio en las especificaciones principales (normalmente es automático).
- `/opsx:archive`: finaliza el cambio y archívalo.

Un buen ritmo predeterminado es usar `explore` para decidir qué hacer y después `propose`, `apply` y `archive`. La guía [Empieza por explorar](/es-ES/explore/) explica por qué vale la pena dar ese primer paso.

También existe el conjunto **expanded** para quienes quieren un control más detallado (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Actívalo con `openspec config profile` y aplícalo con `openspec update`.

¿Acabas de llegar? `/opsx:onboard` (del conjunto ampliado) te guía por un cambio completo en tu propia base de código y explica cada paso. Es la introducción más sencilla posible.

Para ver en detalle qué hace cada comando, consulta [Comandos](/es-ES/commands/). Para saber cuándo usar cada uno, consulta [Flujos de trabajo](/es-ES/workflows/).

## Una primera ejecución limpia

Aquí tienes la secuencia completa, con una indicación del lugar donde se realiza cada paso.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (installs slash commands into your AI tool)

AI CHAT      /opsx:explore
              (optional: think the idea through with the AI first)

AI CHAT      /opsx:propose add-dark-mode
              (AI drafts proposal, specs, design, tasks)

AI CHAT      /opsx:apply
              (AI builds it, checking off tasks)

AI CHAT      /opsx:archive
              (change is merged into your specs and filed away)
```

Dos pasos de configuración en el terminal. Después, todo ocurre en el chat. Ese es el ritmo.

## Relacionado

- [Primeros pasos](/es-ES/getting-started/): guía completa del primer cambio
- [Comandos](/es-ES/commands/): detalles de todos los comandos de barra
- [CLI](/es-ES/cli/): detalles de todos los comandos del terminal
- [Herramientas compatibles](/es-ES/supported-tools/): sintaxis y rutas de archivos de cada herramienta
- [Preguntas frecuentes](/es-ES/faq/): más respuestas rápidas
- [Solución de problemas](/es-ES/troubleshooting/): soluciones cuando no aparecen los comandos
