---
title: "Preguntas frecuentes"
---

Respuestas rápidas a las preguntas más frecuentes. Si en realidad tienes un problema porque «algo no funciona», consulta [Solución de problemas](/es-ES/troubleshooting/). Si buscas la definición de un término, consulta el [glosario](/es-ES/glossary/).

## Conceptos básicos

### ¿Qué es OpenSpec, en una frase?

Una capa ligera que te permite acordar por escrito con tu asistente de programación con IA qué construir antes de escribir código.

### ¿Por qué me interesa?

Porque los asistentes de IA hablan con seguridad incluso cuando se equivocan. Si los requisitos solo están en un hilo de chat, la IA rellena los huecos con suposiciones y no te das cuenta hasta que el código ya existe. OpenSpec adelanta el acuerdo a un momento en que los errores son baratos de corregir. Consulta [Conceptos básicos de un vistazo](/es-ES/overview/) para conocer todos los motivos.

### ¿Tengo que usarlo para todo?

No. Úsalo cuando sea importante llegar a un acuerdo, es decir, para la mayoría de los trabajos que no sean triviales. Para corregir una errata de un carácter, probablemente no compense el proceso, y no pasa nada.

### ¿Puedo usarlo en una base de código grande y existente o solo en proyectos nuevos?

Los proyectos existentes son precisamente el caso principal. OpenSpec está pensado primero para sistemas que ya están en uso: no hace falta documentar toda la aplicación de antemano. Escribes especificaciones solo para lo que afecta cada cambio y, con el tiempo, se completan en torno al trabajo real. Consulta la guía [Usar OpenSpec en un proyecto existente](/es-ES/existing-projects/).

### ¿Está ligado a una herramienta de IA concreta?

No. OpenSpec funciona con más de 30 asistentes, incluidos Claude Code, Cursor, Devin Desktop, GitHub Copilot, Gemini CLI y Codex, entre otros. La lista completa y los detalles de cada herramienta están en [Herramientas compatibles](/es-ES/supported-tools/).

## Ejecutar comandos

### ¿Dónde escribo `/opsx:propose`?

En el chat de tu asistente de IA, no en el terminal. Es el punto que suele causar más confusión y por eso tiene su propia página: [Cómo funcionan los comandos](/es-ES/how-commands-work/). En resumen: `openspec ...` se ejecuta en el terminal; `/opsx:...`, en el chat.

### ¿Cómo «inicio el modo interactivo»?

No hay que iniciar ningún modo especial. Abre tu asistente de IA como de costumbre y escribe un comando de barra en el chat. Así es como «entras» en OpenSpec. (La única función realmente interactiva del terminal es `openspec view`, un panel para explorar especificaciones y cambios). La explicación completa está en [Cómo funcionan los comandos](/es-ES/how-commands-work/).

### Escribí un comando de barra y no pasó nada. ¿Por qué?

Lo más probable es que lo hayas escrito en el terminal en lugar de en el chat de la IA, que hayas usado una sintaxis que la herramienta no reconoce o que los comandos aún no estén instalados. Si faltan los archivos (o nunca configuraste la herramienta), ejecuta `openspec init`; `openspec update` solo actualiza archivos existentes. Después, reinicia el asistente y usa la forma que aparece bajo «Primeros pasos»; consulta [Cómo invocar comandos](/es-ES/supported-tools/#cómo-invocarlos). [Solución de problemas](/es-ES/troubleshooting/#los-comandos-no-aparecen) incluye la lista completa de comprobaciones.

### ¿Por qué la sintaxis es `/opsx:propose` en una herramienta y `/opsx-propose` en otra?

Cada herramienta de IA muestra los comandos personalizados de forma algo distinta, y OpenSpec los escribe según cómo la herramienta carga el archivo generado. Si el archivo de comando se llama `opsx-propose.md`, se escribe `/opsx-propose`; si está dentro de `commands/opsx/`, se escribe `/opsx:propose`. Las herramientas que usan habilidades en lugar de comandos usan el nombre de la habilidad: Codex requiere `$openspec-propose` y Kimi Code, `/skill:openspec-propose`. La línea «Primeros pasos» de `openspec init` ya muestra la forma correcta para las herramientas elegidas; la tabla completa está en [Cómo invocar comandos](/es-ES/supported-tools/#cómo-invocarlos).

### ¿Qué diferencia hay entre una habilidad y un comando?

Ambos son archivos que OpenSpec escribe para que el asistente pueda ejecutar el flujo de trabajo. Las habilidades (`.../skills/openspec-*/SKILL.md`) son el estándar más reciente, compatible con varias herramientas; los comandos (`.../commands/opsx-*`) son los antiguos archivos de barra específicos de cada herramienta. No tienes que elegir: escribe el comando de barra y OpenSpec instalará el formato que use tu herramienta.

## El flujo de trabajo

### ¿Por dónde empiezo si no sé qué construir?

Con `/opsx:explore`. Es un compañero de reflexión sin compromiso que lee tu base de código, plantea opciones y convierte un problema impreciso en un plan concreto antes de escribir código. Está incluido en el perfil predeterminado y siempre está disponible. Cuando el plan esté claro, pasa a `/opsx:propose`. Es el mejor hábito que puedes adquirir para evitar que una IA entusiasta construya con seguridad algo equivocado. Consulta [Empieza por explorar](/es-ES/explore/).

### ¿Cuál es el flujo más sencillo?

```text
/opsx:explore (optional)   then   /opsx:propose <what you want>   then   /opsx:apply   then   /opsx:archive
```

Usa Explore para pensar la idea, Propose para redactar el plan, Apply para implementarlo y Archive para guardarlo. Omite Explore si ya sabes exactamente lo que quieres.

### ¿Qué diferencia hay entre `/opsx:propose` y `/opsx:new`?

`/opsx:propose` es el comando predeterminado de un paso: crea el cambio y redacta todos los artefactos de planificación de una vez. `/opsx:new` forma parte del conjunto ampliado y solo crea la estructura vacía del cambio; después tendrás que crear los artefactos uno por uno con `/opsx:continue` (o todos a la vez con `/opsx:ff`). Usa propose, a menos que quieras controlar cada paso. Consulta [Comandos](/es-ES/commands/).

### ¿Qué son los perfiles `core` y `expanded`?

Un perfil determina qué comandos de barra se instalan. **Core** (el predeterminado) incluye `propose`, `explore`, `apply`, `update`, `sync` y `archive`. El conjunto **expanded** añade `new`, `continue`, `ff`, `verify`, `bulk-archive` y `onboard` para ofrecer un control más detallado. Cámbialo con `openspec config profile` y aplícalo con `openspec update`.

### ¿Tengo que ejecutar `/opsx:sync`?

Normalmente, no. Sync integra las especificaciones delta de un cambio en las principales, y `/opsx:archive` te ofrecerá hacerlo. Ejecuta sync manualmente solo si quieres integrar las especificaciones antes de archivar, por ejemplo, en un cambio de larga duración. Consulta [Comandos](/es-ES/commands/#opsxsync).

### ¿Cómo edito una propuesta, especificación o tarea después de empezar?

Edita el archivo. Todos los artefactos son Markdown sin formato en `openspec/changes/<name>/`, y no hay fases bloqueadas ni modos de edición especiales. Modifícalo a mano o pídele a la IA que lo revise («actualiza el diseño para usar una cola») y continúa. La IA siempre trabaja con el contenido actual del archivo. Guía completa: [Editar e iterar un cambio](/es-ES/editing-changes/).

### ¿Puedo volver atrás y cambiar el plan después de haber implementado una parte?

Sí, en cualquier momento. El flujo es flexible, así que la revisión y la edición no son fases de las que puedas quedar excluido. Edita el artefacto y continúa. Si quieres comprobar de forma estructurada que el código sigue coincidiendo con el plan, ejecuta `/opsx:verify`. Consulta [Editar e iterar un cambio](/es-ES/editing-changes/#cómo-vuelvo-a-revisar-después-de-implementar).

### Edité el código a mano. ¿Cómo lo concilio con la especificación?

Sincronízalos antes de archivar, porque el archivado convierte las especificaciones en la verdad registrada. Si el código es correcto ahora, actualiza la especificación delta para que refleje lo que publicaste; si la especificación es correcta, sigue desarrollando hasta que el código coincida. `/opsx:verify` detecta las discrepancias. Consulta [Editar e iterar un cambio](/es-ES/editing-changes/#he-editado-el-código-a-mano-cómo-lo-concilio-con-openspec).

### ¿Cuándo debo actualizar un cambio existente y cuándo empezar otro?

Actualiza cuando sea el mismo trabajo, pero refinado. Empieza de nuevo si la intención cambió radicalmente o si el alcance se convirtió en otro trabajo. En [Flujos de trabajo](/es-ES/workflows/#cuándo-actualizar-y-cuándo-empezar-de-cero) encontrarás un diagrama de decisiones y ejemplos.

### ¿Qué pasa si se agota el contexto de mi sesión o cambian los requisitos a mitad de la implementación?

Aquí es donde las especificaciones demuestran su utilidad. Como el plan está en archivos (no solo en el historial del chat), puedes borrar el contexto, iniciar una sesión nueva de IA y continuar con `/opsx:apply`; leerá los artefactos y retomará el trabajo desde la primera tarea sin marcar. Si cambian los requisitos, edita los artefactos para que reflejen la nueva realidad y continúa. Mantener limpia la ventana de contexto también mejora los resultados; bórrala antes de implementar.

### ¿Debo confirmar la carpeta `openspec/` en Git?

Sí. Las especificaciones, los cambios activos y el archivo histórico forman parte de la historia del proyecto. Confírmalos como cualquier otro código fuente. En particular, el archivo histórico se convierte en un registro duradero de por qué funciona así el sistema.

## Especificaciones y cambios

### ¿Qué va en una especificación y qué va en un diseño?

Una especificación describe el comportamiento observable: qué hace el sistema, sus entradas, salidas y condiciones de error. Un diseño describe cómo lo construirás: el enfoque técnico, las decisiones de arquitectura y los cambios en los archivos. Si la implementación puede cambiar sin alterar el comportamiento visible desde el exterior, corresponde al diseño, no a la especificación. [Conceptos](/es-ES/concepts/#qué-es-una-especificación-y-qué-no-es) lo explica en detalle.

### ¿Qué es una especificación delta?

Es una especificación que describe solo lo que cambia mediante las secciones `ADDED`, `MODIFIED` y `REMOVED`, en lugar de repetir la especificación completa. Así es como OpenSpec gestiona las modificaciones en sistemas existentes. Consulta [Conceptos](/es-ES/concepts/#especificaciones-delta).

### ¿Adónde van los cambios archivados?

A `openspec/changes/archive/YYYY-MM-DD-<name>/`, conservando todos los artefactos del cambio. El cambio deja de aparecer en la lista de activos. Si un cambio declara explícitamente `retire_capabilities: true`, también puede eliminar la especificación principal de una capacidad al quitar su último requisito.

## Configuración y personalización

### ¿Cómo le explico a la IA cuál es mi pila tecnológica?

Inclúyela en `openspec/config.yaml`, bajo `context:`. Ese texto se inyecta en cada solicitud de planificación, así que la IA siempre conoce tu pila y tus convenciones. Consulta [Personalización](/es-ES/customization/#configuración-del-proyecto).

### ¿Puedo generar especificaciones en otro idioma que no sea inglés?

Sí. Añade una instrucción de idioma al campo `context:` de la configuración. [Varios idiomas](/es-ES/multi-language/) incluye fragmentos para copiar y pegar en varios idiomas.

### ¿Puedo modificar el flujo de trabajo?

Sí, mediante esquemas personalizados. Un esquema define qué artefactos existen y cómo dependen unos de otros. Crea una variante del predeterminado con `openspec schema fork spec-driven my-workflow` y edítala. Consulta [Personalización](/es-ES/customization/#esquemas-personalizados).

## Modelos, privacidad y actualizaciones

### ¿Qué modelo de IA debería usar?

OpenSpec funciona mejor con modelos con una gran capacidad de razonamiento. El README recomienda modelos como Codex 5.5 y Opus 4.7 tanto para la planificación como para la implementación. Mantén limpia la ventana de contexto: bórrala antes de implementar para obtener mejores resultados.

### ¿OpenSpec recopila datos?

Recopila estadísticas de uso anónimas: solo los nombres de los comandos y la versión. No recopila argumentos, rutas, contenido ni datos personales, y la telemetría se desactiva automáticamente en CI. Puedes excluirte con `export OPENSPEC_TELEMETRY=0` o `export DO_NOT_TRACK=1`.

### ¿Cómo actualizo?

Hay dos pasos. Actualiza el paquete (`npm install -g @fission-ai/openspec@latest`) y luego ejecuta `openspec update` en cada proyecto para actualizar las habilidades y los comandos generados.

### ¿Cómo desinstalo OpenSpec?

No hay un comando de desinstalación, porque solo consta de un paquete global y archivos del proyecto. Elimina el paquete (`npm uninstall -g @fission-ai/openspec`) y, si quieres, borra el directorio `openspec/` y los archivos de herramienta generados. Las instrucciones paso a paso y lo que puedes conservar están en [Instalación: desinstalar](/es-ES/installation/#desinstalar).

## Obtener ayuda

### ¿Dónde puedo hacer preguntas o informar de errores?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Incidencias de GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Desde el terminal:** `openspec feedback "your message"` abre una incidencia de GitHub.

### La documentación es incorrecta o confusa. ¿Qué hago?

Dínoslo o corrígela. Las pull requests de documentación son bienvenidas y apreciadas. Abre una incidencia o envía un pull request.
