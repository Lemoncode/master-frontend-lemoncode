Start from **03-reactivity**

Svelte actualiza automáticamente el DOM cuando el estado de su componente cambia. A menudo, algunas partes del estado de un componente deben calcularse a partir de otras partes (como un nombre completo derivado de un nombre y un apellido), y volver a calcularse cada vez que cambian.

Para esto, tenemos declaraciones reactivas:

_app.svelte_

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

+	$: double = count * 2;
</script>

<div class="counter">Counter: {count}</div>
+ <div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

Por supuesto, puedes escribir {count * 2} en lugar de esto - no tienes que usar valores reactivos. Los valores reactivos se vuelven particularmente valiosos cuando necesitas referenciarlos múltiples veces, o tienes valores que dependen de otros valores reactivos.

No estamos limitados a declarar valores reactivos - también podemos ejecutar declaraciones arbitrarias de forma reactiva. Por ejemplo, podemos registrar el valor de count siempre que cambie:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+	$: console.log(`the count is ${count}`);
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

You can easily group statements together with a block:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+   $: {
+   	console.log(`the count is ${count}`);
+   	alert(`I SAID THE COUNT IS ${count}`);
+   }
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

You can even put the $: in front of things like if blocks:

```diff
<script>
	let count = 0;

	const handleClick = () => count++;

	$: double = count * 2;

+   $: if (count >= 10) {
+   	alert(`count is dangerously high!`);
+   	count = 9;
+   }
</script>

<div class="counter">Counter: {count}</div>
<div class="counter">Double: {double}</div>
<button on:click={handleClick}>Increment!</button>
```

## Updating arrays and objects

