Start from **03-svelte-typescript**

# Binding - each block

Podemos vincular (_bind_) propiedades del estado de un componente dentro de un bloque _each_, de la siguiente forma:

```ts
<script>
	let todos = [
		{ done: false, text: 'finish Svelte tutorial' },
		{ done: false, text: 'build an app' },
		{ done: false, text: 'world domination' }
	];

	function add() {
		todos = todos.concat({ done: false, text: '' });
	}

	function clear() {
		todos = todos.filter(t => !t.done);
	}

	$: remaining = todos.filter(t => !t.done).length;
</script>

<style>
	.done {
		opacity: 0.4;
	}
</style>

<h1>Todos</h1>

{#each todos as todo}
	<div class:done={todo.done}>
		<input
			type=checkbox
			bind:checked={todo.done}
		>

		<input
			placeholder="What needs to be done?"
			bind:value={todo.text}
		>
	</div>
{/each}

<p>{remaining} remaining</p>

<button on:click={add}>
	Add new
</button>

<button on:click={clear}>
	Clear completed
</button>
```

> Cuando el usuario interactúa con los _inputs_ mutará el array _todos_ que tenemos en el estado del componente cambiando sólo el elemento vinculado al _input_ sobre el que se está actuando.

> Si preferimos trabajar con estados inmutables, debemos eliminar estos _bindings_ y trabajar con manejadores de eventos (_handlers_).
