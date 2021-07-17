Start from **02-svelte-emit-css**

En el core de Svelte hay un potente sistema de reactividad para mantener el DOM sincronizado con el estado de tu aplicación, por ejemplo, en respuesta a un evento.

_app.svelte_

```js
<script>
	let count = 0;

	const handleClick = () => count++;
</script>

<div class="counter">Counter: {count}</div>
<button on:click={handleClick}>Increment!</button>
```
