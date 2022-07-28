# 07.1 - Eventos del DOM

## Resumen

¿Cómo podemos manejar eventos de los elementos del DOM?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Manejar eventos del DOM

Como ya hemos visto, podemos manejar cualquier evento de un elemento con la directiva `on:`

_App.svelte_

```html
<script lang="typescript">
  let m = { x: 0, y: 0 };

  const handleMouseMove = event => {
    m.x = event.clientX;
    m.y = event.clientY;
  };
</script>

<div on:mousemove="{handleMouseMove}">The mouse position is {m.x} x {m.y}</div>

<style>
  div {
    width: 98vw;
    height: 98vh;
    margin: auto;
    border: 1px solid red;
  }
</style>
```

También podemos declarar los manejadores de eventos _in-line_:

```diff
<script lang="typescript">
  let m = { x: 0, y: 0 };

-  const handleMousemove = (event) => {
-  	m.x = event.clientX;
-  	m.y = event.clientY;
-  }
</script>

<style>
  div {
    width: 98vw;
    height: 98vh;
    margin: auto;
    border: 1px solid red;
  }
</style>

- <div on:mousemove={handleMousemove}>The mouse position is {m.x} x {m.y}</div>
+ <div on:mousemove="{e => m = { x: e.clientX, y: e.clientY }}">
+   The mouse position is {m.x} x {m.y}
+ </div>
```

### Modificadores de eventos

Los manejadores de eventos del DOM pueden tener modificadores que alteran su comportamiento. Por ejemplo, un manejador con un modificador `once` se ejecutará una sola vez:

_App.svelte_

```html
<script>
  function handleClick() {
    alert('no more alerts');
  }
</script>

<button on:click|once="{handleClick}">Click me</button>
```

La lista completa de modificadores:

- `preventDefault`: llama a `event.preventDefault()` antes de ejecutar el manejador. Útil para el manejo de formularios del lado del cliente, por ejemplo.
- `stopPropagation`: llama a `event.stopPropagation()`, evitando que el evento llegue al siguiente elemento.
- `passive`: mejora el rendimiento del _scroll_ en eventos de _touch/wheels_ (Svelte lo añadirá automáticamente cuando sea seguro hacerlo).
- `nonpassive`: establece explícitamente passive: false.
- `capture`: dispara el manejador durante la fase de _captura_ en lugar de la [fase de burbujeo](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture).
- `once`: elimina el manejador después de la primera vez que se ejecuta.
- `self`: sólo dispara el manejador si event.target es el propio elemento.

Puedes encadenar modificadores, por ejemplo, `on:click|once|capture={...}`.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
