Start from **03-svelte-typescript**

# Binding numeric inputs

En el DOM, todo son cadenas de texto. Esto es inútil cuando trabajamos con _inputs_ numéricos (`type="number" y type="range"`), ya que debemos convertir el valor de los inputs al usarlo.

Con `bind:value`, Svelte se encarga de ello:

```ts
<script lang="ts">
	let a: number = 1;
	let b: number = 2;
</script>

<label>
	<input type="number" bind:value={a} min=0 max=10>
	<input type="range" bind:value={a} min=0 max=10>
</label>

<label>
	<input type="number" bind:value={b} min=0 max=10>
	<input type="range" bind:value={b} min=0 max=10>
</label>

<p>{a} + {b} = {a + b}</p>
```
