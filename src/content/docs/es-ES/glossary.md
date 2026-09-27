---
title: "Glosario"
---

Todos los términos de OpenSpec en un mismo lugar, definidos en lenguaje sencillo. Léelo una vez y el resto de la documentación será más fácil de entender.

Los términos se agrupan por tema y se ordenan alfabéticamente dentro de cada grupo.

## Los conceptos básicos

**Especificación.** Documento que describe cómo se comporta una parte del sistema. Las especificaciones se encuentran en `openspec/specs/`, se organizan por dominio y constan de requisitos y escenarios. La especificación es la respuesta acordada a «¿qué hace este software?». Consulta [Conceptos](/es-ES/concepts/#especificaciones).

**Fuente de verdad.** El directorio `openspec/specs/` en su conjunto. Contiene el comportamiento actual acordado del sistema. Los cambios proponen modificaciones y el archivado las aplica.

**Cambio.** Una unidad de trabajo, empaquetada como carpeta en `openspec/changes/<name>/`. Un cambio contiene todo lo relacionado con ese trabajo: su propuesta, diseño, tareas y las modificaciones que introduce en las especificaciones. Un cambio, una función o corrección.

**Artefacto.** Documento que forma parte de un cambio. Los artefactos estándar son la propuesta, las especificaciones delta, el diseño y las tareas. Se crean en orden de dependencia y se nutren unos de otros.

**Especificación delta.** Especificación dentro de un cambio que describe solo lo que cambia, mediante las secciones `ADDED`, `MODIFIED` y `REMOVED`, en lugar de repetir toda la especificación. Esto permite a OpenSpec editar sistemas existentes de forma ordenada. Consulta [Conceptos](/es-ES/concepts/#especificaciones-delta).

**Dominio.** Agrupación lógica de especificaciones, como `auth/`, `payments/` o `ui/`. Tú eliges los dominios que mejor reflejen cómo concibes tu sistema.

## Dentro de una especificación

**Requisito.** Comportamiento que el sistema debe tener, normalmente expresado con una palabra clave de RFC 2119: «El sistema DEBE caducar las sesiones después de 30 minutos». Los requisitos describen el *qué*, no el *cómo*.

**Escenario.** Ejemplo concreto y comprobable de un requisito en acción, normalmente en formato Dado/Cuando/Entonces. Los escenarios permiten verificar un requisito: podrías escribir una prueba automatizada a partir de uno.

**Palabras clave de RFC 2119.** Las palabras MUST, SHALL, SHOULD y MAY, que tienen un significado normalizado para indicar el grado de obligatoriedad de un requisito. MUST y SHALL son absolutos. SHOULD expresa una recomendación que admite excepciones. MAY indica que algo es opcional. El nombre procede del documento sobre estándares de Internet que las definió.

## Los artefactos

**Propuesta (`proposal.md`).** El *porqué* y el *qué* de un cambio: su intención, alcance y enfoque general. Es el primer artefacto que se crea.

**Diseño (`design.md`).** El *cómo*: enfoque técnico, decisiones de arquitectura y archivos que se prevé modificar. Es opcional para cambios sencillos.

**Tareas (`tasks.md`).** Lista de comprobación de la implementación, con casillas. La IA la recorre y marca los elementos a medida que avanza en `/opsx:apply`.

## El ciclo de vida

**Archivar.** Acción de finalizar un cambio. Sus especificaciones delta se integran en las especificaciones principales y la carpeta del cambio se traslada a `openspec/changes/archive/YYYY-MM-DD-<name>/`. Tras archivarlo, las especificaciones describen la nueva realidad. Consulta [Conceptos](/es-ES/concepts/#archivar).

**Sincronizar.** Integrar las especificaciones delta de un cambio en las especificaciones principales *sin* archivar el cambio. Suele ser automático (el archivado ofrece hacerlo), pero también se puede ejecutar por separado con `/opsx:sync` en cambios de larga duración. Consulta [Comandos](/es-ES/commands/#opsxsync).

## Flujo de trabajo y comandos

**OPSX.** El flujo de trabajo estándar actual de OpenSpec, basado en acciones flexibles en lugar de fases rígidas. Todos sus comandos de barra empiezan por `/opsx:`. Consulta el [flujo de trabajo OPSX](/es-ES/opsx/).

**Comando de barra.** Comando que se escribe en el chat del asistente de IA, como `/opsx:propose`. Los comandos de barra dirigen el flujo de trabajo; no son comandos del terminal. Consulta [Cómo funcionan los comandos](/es-ES/how-commands-work/).

**Explore (`/opsx:explore`).** Comando que sirve de compañero de reflexión. Lee la base de código, compara opciones y convierte una idea imprecisa en un plan concreto. Nunca escribe código ni hace ninguna otra modificación, a menos que le pidas que registre la exploración como un cambio o aceptes cuando te lo ofrezca. Es el punto de partida recomendado cuando tienes un problema, pero aún no un plan. Consulta [Empieza por explorar](/es-ES/explore/).

**CLI.** El programa `openspec` que se ejecuta en el terminal. Configura proyectos, enumera y valida cambios, abre el panel y archiva cambios. Es la parte de OpenSpec que funciona en el terminal. Consulta [CLI](/es-ES/cli/).

**Habilidad (skill).** Carpeta de instrucciones (`.../skills/openspec-*/SKILL.md`) que el asistente de IA detecta y sigue automáticamente. Las habilidades son el estándar emergente entre herramientas para proporcionar el flujo de trabajo de OpenSpec al asistente.

**Archivo de comando.** Archivo de comando de barra específico de una herramienta (`.../commands/opsx-*`). Es el mecanismo anterior para distribuir comandos y sigue siendo compatible junto con las habilidades. Rara vez tendrás que modificar estos archivos directamente.

**Perfil.** Conjunto de comandos de barra instalados en el proyecto. **Core** (predeterminado) incluye `propose`, `explore`, `apply`, `update`, `sync` y `archive`. El conjunto **expanded** añade `new`, `continue`, `ff`, `verify`, `bulk-archive` y `onboard`. Cámbialo con `openspec config profile`.

**Distribución.** Determina si OpenSpec instala habilidades, archivos de comando o ambos para tus herramientas. Se configura globalmente y se aplica con `openspec update`.

## Personalización

**Esquema.** Definición de los artefactos de un flujo de trabajo y sus dependencias. El esquema predeterminado integrado es `spec-driven` (proposal → specs → design → tasks). Puedes crear una variante o escribir uno propio. Consulta [Personalización](/es-ES/customization/#esquemas-personalizados).

**Plantilla.** Archivo Markdown dentro de un esquema que determina lo que genera la IA para un artefacto. Si editas una plantilla, la salida de la IA cambia inmediatamente, sin necesidad de volver a compilar.

**Configuración del proyecto (`openspec/config.yaml`).** Ajustes específicos del proyecto: el esquema predeterminado, el `context:` que se inyecta en cada solicitud de planificación y las `rules:` específicas de cada artefacto. Es la forma más sencilla de enseñar a OpenSpec tu pila tecnológica y tus convenciones. Consulta [Personalización](/es-ES/customization/#configuración-del-proyecto).

**Inyección de contexto.** Añadir información del proyecto al campo `context:` de `config.yaml` para incorporarla automáticamente a cada artefacto que genere la IA. Es más fiable que esperar que la IA lea un archivo aparte.

**Grafo de dependencias.** Grafo dirigido que forman las relaciones `requires:` entre artefactos. Es un DAG (grafo acíclico dirigido: las flechas solo apuntan hacia delante, nunca forman un ciclo) y OpenSpec lo usa para saber qué puedes crear a continuación.

**Facilitadores, no barreras.** Principio según el cual las dependencias entre artefactos indican qué se vuelve *posible* hacer a continuación, no qué es *obligatorio*. Puedes volver a cualquier artefacto y editarlo en cualquier momento. Consulta [Conceptos básicos de un vistazo](/es-ES/overview/#facilitadores-no-barreras).

## Coordinación entre repositorios (beta)

Estos términos solo se aplican si tu planificación abarca más de un repositorio. La función está en fase beta; la mayoría de los usuarios puede ignorarlos. Consulta la [guía de usuario de Stores](/es-ES/stores-beta/user-guide/).

**Store.** Repositorio independiente dedicado exclusivamente a la planificación. Tiene la estructura de `openspec/` que ya conoces (especificaciones y cambios), además de un pequeño archivo de identidad. Lo registras una vez en tu equipo con un nombre y, desde cualquier ubicación, cualquier comando de OpenSpec puede trabajar en él.

**Referencia.** Declaración en `openspec/config.yaml` de un repositorio de código que indica de qué Store depende. Las referencias son de solo lectura: el repositorio conserva su propia raíz y `openspec instructions` añade un índice de las especificaciones de Stores referenciados, cada una con el comando exacto para obtenerla.

**Contexto de trabajo.** Lo que `openspec context` reúne para el repositorio actual: su raíz de OpenSpec y todos los Stores a los que hace referencia, cada uno con instrucciones para obtenerlo. Responde a «¿con qué estoy trabajando?».

**Conjunto de trabajo (workset).** Conjunto personal de carpetas locales al equipo que se abren juntas (un Store junto con los repositorios de código en los que trabajas). Se crea explícitamente con `openspec workset create`; las rutas locales no se guardan en el repositorio de planificación compartido.

## Consulta también

- [Conceptos básicos de un vistazo](/es-ES/overview/): las cinco ideas en una página
- [Conceptos](/es-ES/concepts/): explicación detallada
- [Cómo funcionan los comandos](/es-ES/how-commands-work/): comandos de barra y CLI
