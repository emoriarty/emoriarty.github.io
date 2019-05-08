---
title: Más allá de merge
date: "2019-05-05T00:12:03.284Z"
language: es
translations: [ "en", "beyond-merge" ]
---

Cualquiera que haya trabajado algún tiempo con git, irremediablemente sabrá
que es hacer un *merge*. Supongamos que tenemos una rama *A* que sale de master.
El comando `merge` traerá los cambios producidos en *A* a *master*.

```bash
71a621b (HEAD -> master) (A) A file updated
2dc6065 (A) new A file
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```

Si todo ha ido bien, los cambios se emplazan por delante en la rama *master*.

```bash
1———2———3———A1———A2
```

El registro —*log*— refleja un orden incremental de los *commits*, en otras
palabras, los *commits* son mostrados en el orden en que son añadidos. Una linea
temporal de cambios.

Cuando estas modificaciones han ocurrido al mismo tiempo en una rama *B*, lo
cual no estan raro como parece, la estrategia de fusión —*merge*— no puede hacer
una actualización *fast-forward* (añadir los cambios por delante).

```bash
057a856 (HEAD -> master) Merge branch 'B'
71a621b (A) A file updated
1ac6aff (B) B file updated
2dc6065 (A) new A file
d657116 (B) new B file
76a1097 Demo file updated
a31e004 README updated
44d4c5b New README file
ee42779 New demo file
```

Puesto que los cambios ocurrieron en un mismo marco temporal, el comando `merge`
ejecuta una estrategia recursiva, entrelazando los *commits* de *A* y *B*.

```bash
1———2———3———B1———A1———B2———A2
```

Estos *commits* entrecruzados no muestran adecuadamente los diferentes bloques
por rama. Como se puede ver arriba, los *commits* de *B* preceden los de *A*
cuando en realidad se introdujeron después. Además, los *commits* no estan
alineados por significado, todos los *commits* pertenicientes a *A* deberían mostrarse
antes que los de *B*.

Para poder prevenir esta situación una vez la *feature* ha sido completada.
En vez de hacer un *merge* con todos los *commits* presentes en la rama, la
solición es pasar los cambios a *master* como un único commit junto a un mensaje
descriptivo. Este enfoque mejora la trazabilidad del registro de git.

Quizás para proyectos de menor calado o apuestas personales no sea tan importante
(aunque siempre es mejor manetener las buenas prácticas) el manetener en
estricto orden un registro de eventos. Pero cuando se trata de grandes equipos
donde cada *feature* o *bug* debe estar perfectamente aislado y etiquetado,
un registro desordenado marcará la diferencia entre el caos y la armonía del
proyecto.

Para los recien llegados a git (y también para aquellos que no han tenido mucho
tiempo para profundizar) hay más opciones aparte del comando `merge`.

Vamos más allá de `merge`.

## Rebase
