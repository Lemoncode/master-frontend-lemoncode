Start from **03-svelte-typescript**

HTML no tiene una forma de expresar la lógica, como los condicionales y los bucles. Svelte sí la tiene.

## Flujos Condicionales

Para representar condicionalmente alguna marca, la envolvemos en un bloque if:

_app.svelte_

```js
<script lang="typescript">
	let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
<button on:click={toggle}>
	Log out
</button>
{/if}

{#if !user.loggedIn}
<button on:click={toggle}>
	Log in
</button>
{/if}
```

Dado que las dos condiciones - si user.loggedIn y si !user.loggedIn - son mutuamente excluyentes, podemos simplificar este componente utilizando un bloque else:

```diff
<script lang="typescript">
	let user = { loggedIn: false };

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
<button on:click={toggle}>
	Log out
</button>
-{/if}
+{:else}
-{#if !user.loggedIn}
<button on:click={toggle}>
	Log in
</button>
{/if}
```

Además, podemos encadenar varias condiciones con _else if_:

_app.svelte_

```js
<script>
	let x = 7;
</script>

{#if x > 10}
	<p>{x} is greater than 10</p>
{:else if 5 > x}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}
```

## Bucles

Es muy común necesitar iterar sobre una lista de datos (resultado de una llamada a una API, por ejemplo) para mostrar cada elemento de la lista en el documento.

Si necesitas hacer un bucle sobre listas de datos, utiliza un bloque each:

_app.svelte_

```js
<script>
  let films = [
    { id: "J9fc6bW_oH0", name: "Cube" },
    { id: "OTPtu78Dnpg", name: "Hypercube" },
    { id: "Jb1I2qVau60", name: "Cube Zero" },
  ];
</script>

<h1>The Complete Cube Trilogy</h1>

<ul>
  {#each films as film (film.id)}
  <li>
    <a target="_blank" href="https://www.youtube.com/watch?v={film.id}">
      {film.name}
    </a>
  </li>
  {/each}
</ul>
```

> No necesitamos _backticks_ para interpolar valores en las cadenas de texto de los elementos html
