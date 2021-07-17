Start from **03-svelte-typescript**

# Events

Como ya hemos visto, podemos manejar cualquier evento de un elemento con la directiva `on:`

_app.svelte_

```js
<script lang="typescript">
  let m = { x: 0, y: 0 };

  const handleMousemove: svelte.JSX.MouseEventHandler<HTMLDivElement> = (event) => {
  	m.x = event.clientX;
  	m.y = event.clientY;
  }
</script>

<style>
  div {
    width: 100vw;
    height: 100vh;
  }
</style>

<div on:mousemove={handleMousemove}>The mouse position is {m.x} x {m.y}</div>
```

También podemos declarar los manejadores de eventos en línea:

```diff
<script lang="typescript">
  let m = { x: 0, y: 0 };

-  const handleMousemove: svelte.JSX.MouseEventHandler<HTMLDivElement> = (event) => {
-  	m.x = event.clientX;
-  	m.y = event.clientY;
-  }
</script>

<style>
  div {
    width: 100vw;
    height: 100vh;
  }
</style>

- <div on:mousemove={handleMousemove}>The mouse position is {m.x} x {m.y}</div>
+ <div on:mousemove="{e => m = { x: e.clientX, y: e.clientY }}">The mouse position is {m.x} x {m.y}</div>
```

## Modificadores de eventos

Los manejadores de eventos del DOM pueden tener modificadores que alteran su comportamiento. Por ejemplo, un manejador con un modificador `once` se ejecutará una sola vez:

_app.svelte_

```js
<script>
	function handleClick() {
		alert('no more alerts')
	}
</script>

<button on:click|once={handleClick}>
	Click me
</button>
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
