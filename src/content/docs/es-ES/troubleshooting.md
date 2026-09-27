---
title: "Solución de problemas"
---

Soluciones concretas para problemas concretos. Cada entrada describe un síntoma, explica brevemente la causa probable y propone una solución. Si tu problema no aparece aquí, quizá te ayuden las [preguntas frecuentes](/es-ES/faq/); en [Discord](https://discord.gg/YctCnvvshC) seguro que sí.

## Instalación y configuración

### `openspec: command not found`

La CLI no está instalada o el shell no la encuentra. Instálala globalmente y compruébalo:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Si se instaló, pero no se encuentra, es probable que el directorio bin global de npm no esté en tu `PATH`. Ejecuta `npm prefix -g` para ver dónde se encuentran los paquetes globales: en macOS y Linux, los binarios están en el directorio `bin/` de esa ruta; en Windows, están directamente en la ruta. Asegúrate de añadirla a `PATH`. (`npm bin -g` se eliminó en npm 9).

Si usaste la [instalación asistida por IA](/es-ES/installation/#instalar-con-tu-asistente-de-ia), este es el punto en el que debe devolverte el control: el prompt indica al asistente que te muestre el cambio de `PATH` en vez de modificar por su cuenta los archivos de inicio del shell.

### «Se requiere Node.js 20.19.0 o posterior»

OpenSpec necesita Node 20.19.0 o posterior. Comprueba la versión y actualízala si es necesario:

```bash
node --version
```

Si usas bun para instalar OpenSpec, ten en cuenta que OpenSpec sigue *ejecutándose* en Node, por lo que necesitas tener Node 20.19.0 o posterior en tu `PATH`. Consulta [Instalación](/es-ES/installation/).

### `openspec init` no configuró mi herramienta de IA

Init pregunta qué herramientas configurar. Si omitiste la tuya o quieres añadir otra, vuelve a ejecutarlo o usa el modo no interactivo:

```bash
openspec init --tools claude,cursor
```

La lista completa de identificadores está en [Herramientas compatibles](/es-ES/supported-tools/). Usa `--tools all` para incluirlas todas y `--tools none` para omitir la configuración de herramientas.

## Los comandos no aparecen

Si `/opsx:propose` (o el comando equivalente de tu herramienta) no aparece o no hace nada, repasa esta lista, ordenada de la comprobación más rápida a la más lenta.

1. **Quizá estés en el lugar equivocado.** Los comandos de barra se escriben en el chat del asistente de IA, no en el terminal. Si escribiste `/opsx:propose` en el shell, ahí está el problema. Consulta [Cómo funcionan los comandos](/es-ES/how-commands-work/).

2. **Regenera los archivos.** Desde la raíz del proyecto:

   ```bash
   openspec update
   ```

   Esto vuelve a escribir los archivos de habilidades y comandos de todas las herramientas que configuraste.

   Los archivos de instrucciones proceden de la CLI *instalada*, así que una CLI desactualizada indica que todo está actualizado, aunque nunca escriba los flujos nuevos. `openspec update` ahora lo comprueba y ofrece actualizar; acepta si aparece la opción.

3. **Reinicia el asistente.** La mayoría de las herramientas busca habilidades y comandos al iniciarse. Abrir una ventana nueva suele bastar.

4. **Comprueba que existan los archivos.** En Claude Code, verifica que `.claude/skills/` contenga carpetas `openspec-*`. Las demás herramientas usan sus propios directorios, indicados en [Herramientas compatibles](/es-ES/supported-tools/).

5. **Comprueba que inicializaste este proyecto.** Las habilidades se escriben para cada proyecto. Si clonaste un repositorio o cambiaste de carpeta, ejecuta allí `openspec init` (o `openspec update`).

6. **Comprueba que tu herramienta admita archivos de comando.** Codex, CodeArts, ForgeCode, Hermes, Kimi Code, Mistral Vibe, Zed Agent y el destino compartido `.agents` no generan archivos de comando `opsx-*`; usan invocaciones basadas en habilidades, por lo que `/opsx` nunca se autocompletará. Escribe `$openspec-propose` en Codex, `/skill:openspec-propose` en Kimi Code y `/openspec-propose` en las demás. El destino compartido `.agents` es independiente del proveedor, así que `/openspec-propose` es la forma habitual, pero no está garantizada; si el asistente no responde, consulta su documentación para saber cómo invocar una habilidad. Amazon Q sí recibe archivos de comando, pero los carga en su biblioteca de prompts en lugar de mostrarlos en el menú de barra: escribe `@opsx-propose`, no `/opsx`. La forma de cada herramienta está en [Cómo invocar comandos](/es-ES/supported-tools/#cómo-invocarlos).

## Trabajar con cambios

### «No se encontró el cambio»

El comando no pudo determinar a qué cambio te referías. Indica su nombre explícitamente o comprueba qué cambios existen:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Comprueba también que estés en el directorio correcto del proyecto.

### «No hay artefactos listos»

Todos los artefactos ya están creados o están bloqueados a la espera de una dependencia. Averigua qué lo impide:

```bash
openspec status --change <name>
```

Primero crea la dependencia que falta. Recuerda el orden: la propuesta habilita las especificaciones y el diseño; las especificaciones y el diseño habilitan conjuntamente las tareas.

### `openspec validate` informa de advertencias o errores

La validación comprueba si tus especificaciones y cambios tienen problemas estructurales. Lee el mensaje: indica el archivo y el problema.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
openspec validate --archived       # fail if archived changes have unchecked tasks
```

Las causas habituales son la falta de una sección obligatoria (por ejemplo, una especificación sin escenarios) o un encabezado de delta con formato incorrecto. Corrige el archivo y vuelve a ejecutar el comando. La [referencia de la CLI](/es-ES/cli/#openspec-validate) documenta el formato de salida.

Un mensaje merece una explicación aparte:

```text
MODIFIED "<requirement>" omits scenario(s) the current spec still has: "<scenario>"
```

Un requisito `MODIFIED` sustituye todo el bloque del requisito, así que debe incluir todos los escenarios que sigan vigentes después del cambio, no solo los que editaste. Copia los escenarios indicados desde `openspec/specs/<capability-path>/spec.md` a la delta y conserva los directorios de dominio que formen parte de la ruta. Esto suele ocurrir con un cambio antiguo después de que otro cambio haya añadido un escenario al mismo requisito. En cualquier caso, el archivado rechazará ese cambio; ahora la validación lo detecta antes de implementarlo.

### La IA creó artefactos incompletos o incorrectos

La IA no tenía suficiente contexto. Hay varias formas de solucionarlo:

- Añade contexto del proyecto en `openspec/config.yaml` para que la pila tecnológica y las convenciones se inyecten en cada solicitud. Consulta [Personalización](/es-ES/customization/#configuración-del-proyecto).
- Añade `rules:` específicas para cada artefacto si hay instrucciones que solo se aplican, por ejemplo, a las especificaciones.
- Proporciona una descripción más detallada al proponer un cambio.
- Usa el comando ampliado `/opsx:continue` para crear y revisar un artefacto cada vez, en vez de generar todos a la vez con `/opsx:ff`.

### El archivado no termina o advierte de tareas incompletas

El archivado no se *bloquea* por las tareas incompletas, pero te avisa porque, por lo general, archivar significa que el trabajo está terminado. Si dejas tareas pendientes intencionadamente (porque vas a archivar un cambio parcial), continúa. De lo contrario, complétalas primero. Si aún no has sincronizado las especificaciones delta con las principales, el archivado también te ofrecerá hacerlo; acepta salvo que tengas un motivo para no hacerlo.

### «User force closed the prompt with 0 null»

Se ejecutó `openspec archive` en un entorno donde nadie puede responder a una pregunta: por ejemplo, un agente de IA que lo invoca desde una herramienta, un trabajo de CI o un shell con stdin cerrado. Archive hace hasta tres preguntas de confirmación y, antes, la falta de respuesta producía ese mensaje sin procesar.

Pasa `--yes` para responderlas de antemano:

```bash
openspec archive <change-name> --yes
```

Conserva los parámetros que ya estabas pasando: `--skip-specs` y `--no-validate` modifican el comportamiento del archivado, así que volver a ejecutarlo solo con `--yes` no es lo mismo. Las versiones actuales indican el parámetro necesario e imprimen una línea `Fix:` que puedes copiar. Si pretendías elegir un cambio de una lista, indica su nombre explícitamente: el selector también necesita una respuesta.

Si, en cambio, redirigiste la salida del archivado a un archivo o la capturaste con una herramienta y *pasaste* una respuesta por una tubería (`printf 'y\n' | openspec archive …`), las versiones antiguas escribían códigos de escape del terminal en la captura al mostrar el prompt, lo que en algunos entornos podía aumentar mucho el tamaño del archivo. Las versiones actuales muestran los prompts de confirmación como texto sin formato cuando stdout no es un terminal; además, si ejecutas `openspec archive` sin argumentos (lo que normalmente mostraría un selector interactivo), te pide que indiques el nombre del cambio en vez de dibujar un menú en la captura. En ambos casos, las ejecuciones redirigidas y las de agentes quedan limpias; pasar `--yes` junto con el nombre del cambio omite por completo los prompts.

## Configuración

### No se aplica mi archivo `config.yaml`

Tres causas habituales:

1. **Nombre de archivo incorrecto.** Debe llamarse `openspec/config.yaml`, no `.yml`.
2. **YAML no válido.** Compruébalo con cualquier validador de YAML; la CLI también informa de errores de sintaxis con sus números de línea.
3. **Esperabas que hubiera que reiniciar.** No hace falta. Los cambios de configuración se aplican inmediatamente.

### «Unknown artifact ID in rules: X»

Una clave de `rules:` no coincide con ningún artefacto del esquema. En el esquema predeterminado `spec-driven`, los identificadores válidos son `proposal`, `specs`, `design` y `tasks`. Para ver los identificadores de cualquier esquema:

```bash
openspec schemas --json
```

### «Context too large»

El campo `context:` está limitado deliberadamente a 50 KB porque se inyecta en cada solicitud. Resúmelo o enlaza a documentos más extensos en lugar de pegarlos. Un contexto más conciso también produce resultados mejores y más rápidos.

### «Schema not found»

El esquema indicado no existe. Enumera los disponibles y comprueba la ortografía:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Consulta [Personalización](/es-ES/customization/#esquemas-personalizados).

## Migración desde el flujo anterior

### «Legacy files detected in non-interactive mode»

Estás en CI o en un shell no interactivo. OpenSpec encontró archivos antiguos que debe limpiar, pero no puede pedirte confirmación. Aprueba la operación automáticamente:

```bash
openspec init --force
```

En Codex, OpenSpec puede detectar archivos de prompt antiguos administrados en `$CODEX_HOME/prompts` o `~/.codex/prompts`. La limpieza se limita a los nombres de archivo heredados de Codex permitidos por OpenSpec, y `openspec init` en modo no interactivo solo elimina los archivos para los que ya existen habilidades de sustitución `.agents/skills/openspec-*`. `openspec update` en modo no interactivo no limpia ningún archivo antiguo, a menos que pases `--force`.

### Los comandos no aparecieron después de la migración

Reinicia el IDE. Las habilidades se detectan al iniciarse. Si aún no aparecen, ejecuta `openspec update` y comprueba las ubicaciones de los archivos en [Herramientas compatibles](/es-ES/supported-tools/).

### Mi antiguo `project.md` no se migró

Es intencional. OpenSpec nunca elimina `project.md` automáticamente, porque puede contener contexto que escribiste tú. Traslada la información útil a la sección `context:` de `config.yaml` y luego elimínalo tú mismo. La [guía de migración](/es-ES/migration-guide/#migrar-de-projectmd-a-configyaml) explica el proceso e incluye un prompt que puedes dar a la IA para resumir el contenido.

## ¿Sigues con problemas?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **Incidencias de GitHub:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Desde el terminal:** `openspec feedback "what went wrong"` abre una incidencia por ti.

Al informar de un problema, incluye la versión de OpenSpec (`openspec --version`), la versión de Node (`node --version`), la herramienta de IA que usas y el comando y la salida exactos. Así será mucho más fácil ayudarte.
