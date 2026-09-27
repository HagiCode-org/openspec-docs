---
title: "Revisar un cambio"
---

La promesa de OpenSpec es que tú y la IA **acordéis qué construir antes de escribir código.** Ese acuerdo solo sirve si de verdad lees lo que ha redactado la IA. Esta página trata de esos dos minutos: qué abrir, en qué orden y qué buscar.

La apuesta es sencilla: detectar un desvío en un plan de un párrafo casi no cuesta nada. Detectar el mismo desvío en 300 líneas de código sí. La revisión es el momento de cobrar esa apuesta.

## Los dos momentos de revisión

Hay exactamente dos:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (before any code)                    (/opsx:verify)
```

1. **Después de `/opsx:propose`** (o `/opsx:ff`), antes de `/opsx:apply`: lee el plan mientras aún son solo palabras.
2. **Después de construir**, con `/opsx:verify`: comprueba que el código haya hecho realmente lo que indicaba el plan.

La primera revisión es la que más te ahorra y la que más gente omite. Esta página se centra principalmente en ella.

## Léelo en este orden

Un cambio es una carpeta de archivos Markdown sin formato en `openspec/changes/<name>/`. Lee los archivos en un orden que te permita detenerte cuanto antes si algo falla:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. the intent and scope   ← if this is wrong, stop here
├── specs/…/spec.md  2. the requirements       ← the heart of the review
├── design.md        (only for bigger changes) — the technical approach
└── tasks.md         3. the plan of work
```

No hace falta que leas cada línea. Debes responder a tres preguntas, una por archivo.

## La propuesta: ¿es este el problema adecuado?

Abre primero `proposal.md`. Recoge el «porqué» y el «qué»: la intención, el alcance y el enfoque en uno o dos párrafos.

**Qué aspecto tiene una buena propuesta:** una intención clara, un alcance que reconoces y una razón por la que vale la pena hacerlo ahora.

**Señales de alerta:**

- Resuelve un problema un poco *distinto* del que planteaste.
- El alcance ha crecido: pediste un selector de temas y la propuesta también modifica la autenticación «ya que estamos».
- Es imprecisa. «Mejorar la página de configuración» no define el alcance; «añadir un selector de modo oscuro que respete la preferencia del sistema» sí.

**La pregunta que debes responder:** *¿Esto coincide con lo que pedí realmente? ¿Se ha colado algo que no pedí?* Si la respuesta es no, detente, no sigas leyendo y corrige la propuesta (consulta [Es fácil plantear objeciones](#es-fácil-plantear-objeciones)).

## Las especificaciones delta: ¿está bien definido qué significa «terminado»?

Este es el núcleo de la revisión. Las especificaciones delta de `specs/` describen lo que será *verdad* cuando se publique el cambio, mediante requisitos y los escenarios que los demuestran:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Qué aspecto tiene un buen requisito:** un enunciado claro con `SHALL`/`MUST` que podrías entregar a quien prueba el sistema, y al menos un escenario cuyo DADO/CUANDO/ENTONCES realmente ponga a prueba ese enunciado.

**Señales de alerta:**

- **Un requisito impreciso.** «El sistema SHALL ser rápido» no se puede implementar ni probar. ¿Qué significa «rápido»?
- **Un requisito sin escenario** o un escenario que no comprueba el requisito al que pertenece.
- **La omisión más importante: lo que falta.** La IA transcribe fielmente lo que *dijiste*. Tu trabajo es notar lo que *olvidaste* decir. Si el caso que más te importa es la preferencia del sistema operativo y ningún escenario lo menciona, la revisión ya se ha pagado sola.

Lee las deltas y pregúntate: *¿me parecería bien que el sistema hiciera exactamente esto, y nada más?* Aquí aún no se habla de código, así que los cambios siguen siendo baratos.

## Las tareas: ¿es razonable el plan de trabajo?

Abre `tasks.md` al final. Es la lista de comprobación de la implementación que seguirá la IA.

**Qué aspecto tiene un buen plan:** pasos ordenados, cada uno vinculado a un requisito, sin nada misterioso.

**Señales de alerta:**

- Una tarea sin requisito asociado (¿de dónde ha salido?).
- Una tarea enorme del tipo «implementar la función» que oculta todas las decisiones reales.
- Una tarea que afecta a algo fuera del alcance que acabas de aprobar.

No estás calculando estimaciones ni microgestionando: compruebas que el plan coincida con los requisitos que ya aceptaste.

## Es fácil plantear objeciones

Si la respuesta a alguna de las tres preguntas no es la adecuada, dilo. No hay fases ni nada bloqueado: lo corriges y sigues. Hay dos formas, tal como se explica en [Editar un cambio](/es-ES/editing-changes/):

- **Edita tú mismo el archivo.** Es Markdown sin formato: cambia la línea del alcance, precisa un requisito o elimina una tarea.
- **Dile a la IA qué está mal** y deja que lo revise: *«quita los cambios de autenticación: están fuera del alcance»*, *«añade un escenario para cuando el usuario ya haya elegido un tema»*, *«divide la tarea 3 en esquema e interfaz»*.

Después, vuelve a leer la parte que cambiaste. Revisa el borrador hasta que sea un plan que firmarías. Ese intercambio iterativo *es* el producto en funcionamiento.

## Después del código: verificar

Una vez implementado el trabajo, `/opsx:verify` te permite hacer una segunda revisión. Vuelve a leer los artefactos y el código e informa de discrepancias en tres dimensiones:

| Dimensión | Qué comprueba |
|-----------|----------------|
| **Completitud** | Todas las tareas completadas, todos los requisitos implementados y los escenarios cubiertos |
| **Corrección** | La implementación coincide con la intención de la especificación y gestiona los casos límite |
| **Coherencia** | Las decisiones de diseño realmente se reflejan en el código |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Clasifica los problemas como CRITICAL, WARNING o SUGGESTION, y **no** bloquea el archivado: muestra las carencias y deja la decisión en tus manos. Esa es la diferencia entre «¿la IA escribió código?» y «¿construyó lo que acordamos?».

`/opsx:verify` forma parte del perfil ampliado. Si no lo tienes, habilítalo con `openspec config profile` (y después `openspec update`) o vuelve a leer el cambio y el diff por tu cuenta.

## Ajusta la revisión al tamaño del cambio

No todos los cambios requieren una revisión completa. Corregir una errata en un archivo merece una lectura de veinte segundos. Un cambio que afecta a la autenticación, los pagos o datos irrecuperables merece todas las preguntas anteriores. El objetivo nunca fue añadir formalidades, sino dedicar atención a las áreas donde un error sería costoso y revisar por encima las demás.

## Lista de comprobación de dos minutos

- [ ] La intención de la propuesta coincide con lo que pedí.
- [ ] No se ha colado nada adicional en el alcance.
- [ ] Todos los requisitos son lo bastante específicos como para probarlos.
- [ ] Todos los requisitos tienen un escenario que los pone a prueba.
- [ ] Se cubre el caso que más me importa.
- [ ] Las tareas se corresponden con requisitos; no hay nada misterioso ni fuera del alcance.
- [ ] Me parecería bien que la IA construyera exactamente esto y nada más.

Si cumples los siete puntos, ejecuta `/opsx:apply` con confianza. Si alguno falla, no es un contratiempo: los dos minutos han cumplido su función.

## Dónde continuar

- [Escribir buenas especificaciones](/es-ES/writing-specs/) — la otra cara: cómo redactar requisitos y escenarios que merezca la pena aprobar.
- [Editar e iterar un cambio](/es-ES/editing-changes/) — cómo modificar un plan una vez iniciado el trabajo.
- [Flujos de trabajo](/es-ES/workflows/) — dónde encaja la revisión en el ciclo general.
