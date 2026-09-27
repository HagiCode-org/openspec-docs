---
title: "Escribir buenas especificaciones"
---

Rara vez se empieza una especificación desde una página en blanco. Describes un cambio en lenguaje sencillo, `/opsx:propose` redacta los requisitos y escenarios, y después tú los mejoras. Esta página trata de esa última parte: qué significa «bueno» y cómo orientar a la IA para conseguirlo.

Esta guía complementa [Revisar un cambio](/es-ES/reviewing-changes/): revisar consiste en detectar los puntos débiles de un borrador; escribir consiste en saber qué hace que uno sea sólido.

## Una especificación describe el comportamiento, no el código

Una especificación describe lo que *hace* tu sistema, en términos que cualquiera pueda comprobar, no cómo está construido. Consta de **requisitos** (enunciados sobre el comportamiento) y **escenarios** (ejemplos concretos que los demuestran).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Deja el *cómo* —la cola, la biblioteca, el esquema de la tabla— en `design.md` o en el código. Si mezclas el comportamiento y la implementación en un solo requisito, deja de ser comprobable y empieza a quedar desactualizado en cuanto cambia el código.

## Qué hace que un requisito sea bueno

Un buen requisito expresa un comportamiento de forma tan clara que podrías pedirle a otra persona que lo pruebe.

- **Un enunciado, un `SHALL`/`MUST`.** Si un requisito incluye tres cláusulas del tipo «y además», en realidad son tres requisitos. Sepáralos.
- **Observable.** Alguien que no conozca el código debería poder determinar si se cumple. «El sistema DEBE mostrar un aviso de error cuando la carga supera los 10 MB» es observable. «El sistema DEBE gestionar correctamente las cargas grandes» no lo es.
- **El grado adecuado de obligatoriedad.** OpenSpec usa las palabras clave de RFC 2119, que tienen significados diferentes:

  | Palabra clave | Significado |
  |---------|---------|
  | `MUST` / `SHALL` | Requisito estricto, no negociable. |
  | `SHOULD` | Recomendación firme que admite una excepción justificada. |
  | `MAY` | Realmente opcional. |

  Usa `MUST`/`SHALL` de forma predeterminada. Usa `SHOULD` solo cuando de verdad quieras decir «a menos que haya una buena razón para no hacerlo».

Prueba del requisito: *¿podría una persona que nunca ha visto el código determinar si se cumple?* Si no, debes precisarlo.

## Qué hace que un escenario sea bueno

Los escenarios son los que demuestran el valor de un requisito. Cada uno es un caso concreto de DADO / CUANDO / ENTONCES que podría convertirse en una prueba automatizada.

- **Pone a prueba el requisito.** Un escenario que solo repite el requisito con otras palabras no comprueba nada. Describe una situación concreta con un resultado concreto.
- **Cubre los casos importantes, no solo el caso habitual.** El inicio de sesión válido es fácil. La entrada vacía, el token caducado, el segundo clic y aquello que falla: ahí es donde viven los errores y donde un escenario resulta más útil.
- **Indica el caso en el título.** «Escenario: rechaza un token caducado» permite ver de un vistazo qué se cubre; «Escenario: prueba 2» no.

Un hábito útil: antes de aprobar, pregúntate *¿qué caso me molestaría que dejara de funcionar?* y asegúrate de que un escenario lo describa.

## Elige el tipo de delta adecuado

Un cambio describe las modificaciones de las especificaciones mediante tres tipos de sección. Si usas el tipo correcto, las especificaciones archivadas reflejarán la realidad:

- **`## ADDED Requirements`** — comportamiento nuevo que antes no existía.
- **`## MODIFIED Requirements`** — comportamiento existente que cambia. Incluye la versión nueva completa; una nota breve sobre el cambio ayuda a quien lo revisa.
- **`## REMOVED Requirements`** — comportamiento que se elimina, junto con una línea que explique por qué.

Al archivar, los requisitos ADDED se añaden a la especificación principal, los MODIFIED sustituyen la versión anterior y los REMOVED se eliminan. Si eliminas el último requisito de una capacidad, la retiras: en vez de dejar una especificación vacía, el archivado borra `openspec/specs/<capability>/spec.md`. Como es el único paso del archivado que elimina un archivo, debes solicitarlo: añade `retire_capabilities: true` al `.openspec.yaml` del cambio, junto con `schema:`, que ese archivo ya necesita. Sin esa opción, el archivado se cancela y te lo indica. Como la retirada elimina el archivo completo, también se rechaza si la especificación contiene algo aparte del título, `## Purpose` y los bloques de requisitos, como una sección `## Notes` o un comentario debajo de un requisito. El mensaje de cancelación indica esas líneas; muévelas a `## Purpose` o a un requisito, o elimina la especificación manualmente. Si la especificación está en el checkout de quien ejecuta la operación, el resultado del archivado también indica el comando `git checkout` que restaura un archivo confirmado; para Stores seleccionados, proporciona instrucciones de recuperación limitadas a ese checkout. Si marcas un cambio real como ADDED, acabarás con dos requisitos que compiten; si describes un comportamiento nuevo como MODIFIED, no habrá nada que sustituir. Si tienes dudas, abre la especificación actual y comprueba si el requisito ya existe.

Conviene conocer otra sección. Cuando la delta crea una capacidad que aún no existe, empieza con `## Purpose` —una o dos frases sobre el propósito de la capacidad—. El archivado la usa como Purpose de la especificación principal que crea; si la omites, obtendrás el marcador `TBD`, que tendrás que completar a mano. Una especificación existente ya tiene un Purpose, así que en ese caso se ignora el de la delta: edita directamente `openspec/specs/<capability-path>/spec.md` para cambiarlo. `<capability-path>` es el directorio relativo a `specs/`, como `user-auth` en un proyecto sin jerarquía o `identity/user-auth` en un proyecto organizado por dominios.

## Ajusta el tamaño del cambio

El error de redacción más habitual no es formular mal un requisito, sino intentar incluir tres cambios en uno.

**Un buen cambio tiene una sola intención que puedes expresar en una frase.** «Añadir un selector de modo oscuro». «Limitar la frecuencia del endpoint de inicio de sesión». «Dejar de usar cookies para las sesiones». Si necesitas muchos «y además» para describir el cambio, es señal de que debes dividirlo.

Señales de que un cambio es demasiado grande:

- El alcance de la propuesta parece una lista de funciones sin relación.
- Revisarlo llevaría toda una tarde, así que nadie lo hará.
- Dos personas no podrían trabajar en él sin pisarse.
- La mitad de las tareas podrían publicarse por separado.

Los cambios pequeños son más fáciles de revisar, de implementar en una sesión enfocada y de entender seis meses después, cuando solo quede el archivo histórico. Siempre puedes trabajar en varios cambios en paralelo; consulta [Edición e iteración](/es-ES/editing-changes/) y [Flujos de trabajo](/es-ES/workflows/).

También ocurre lo contrario: corregir una errata de una línea no requiere tres requisitos y un documento de diseño. Ajusta el proceso a lo que está en juego.

## Cómo orientar a la IA para obtener un buen borrador

Como `/opsx:propose` redacta el primer borrador, la calidad del resultado depende de la calidad de lo que le proporcionas. No tienes que escribir los requisitos a mano: tienes que orientar bien a la IA:

- **Expón la intención y los límites.** *«Añade un selector de modo oscuro que siga la configuración del sistema en la primera carga; no modifiques la API de temas existente»*. Lo que queda fuera del alcance importa tanto como lo que está dentro.
- **Indica los casos que te importan.** *«Asegúrate de incluir un escenario para una persona que ya eligió un tema manualmente»*. La IA cubre aquello que le señales.
- **Después, edítalo.** Es Markdown sin formato. Precisa un `SHALL` impreciso, elimina un escenario que no pruebe nada, añade el caso que falta o pídele a la IA: *«el requisito sobre el tiempo de espera es impreciso; fija el límite en 30 minutos»*.

Redacta, precisa y repite. Unas cuantas rondas bastan para obtener una especificación en la que puedas confiar; ese es precisamente el objetivo.

## Lista de comprobación rápida

- [ ] Cada requisito expresa un comportamiento observable con `SHALL`/`MUST`.
- [ ] Los requisitos no incluyen detalles de implementación.
- [ ] Cada requisito tiene al menos un escenario que realmente lo pone a prueba.
- [ ] Los escenarios cubren los casos límite y de error importantes, no solo el caso habitual.
- [ ] Las deltas usan ADDED / MODIFIED / REMOVED correctamente con respecto a la especificación actual.
- [ ] Todo el cambio tiene una intención que puedes expresar en una frase.

## Dónde continuar

- [Revisar un cambio](/es-ES/reviewing-changes/) — revisión de dos minutos para detectar lo que se pasó por alto.
- [Conceptos](/es-ES/concepts/) — el modelo detallado de especificaciones, cambios y deltas.
- [Ejemplos y recetas](/es-ES/examples/) — cambios reales de principio a fin.
