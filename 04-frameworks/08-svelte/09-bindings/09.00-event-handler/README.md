Start from **03-svelte-typescript**

# Binding inputs

Como regla general, el flujo de datos en Svelte es de arriba hacia abajo: un componente principal puede setear _props_ en un componente hijo, y un componente puede setear atributos en un elemento, pero no al revés.

A veces es útil romper esa regla.

Tomemos el caso de un elemento _input_ dentro de un componente. Podríamos agregar un _handler_ de eventos **on:input** que establece el valor de un estado interno _name_ con _event.target.value_, pero es un poco... repetitivo. Se pone aún peor con otros elementos de formulario, por ejemplo un _input_ numérico:

```ts
<script lang="ts">
	let a: number = 1;
	let b: number = 2;

	const handleChangeA = (e) => {
		a = e.target.value;
	}

	const handleChangeB = (e) => {
		b = e.target.value;
	}
</script>

<label>
	<input type="number" value={a} on:input={handleChangeA} min=0 max=10>
	<input type="range" value={a} on:input={handleChangeA} min=0 max=10>
</label>

<label>
	<input type="number" value={b} on:input={handleChangeB} min=0 max=10>
	<input type="range" value={b} on:input={handleChangeB} min=0 max=10>
</label>

<p>{a} + {b} = {a + b}</p>
```

Como vemos, el resultado de **{a + b}** es la concatenación de los dos valores (pasaron a ser _string_). Para solucionarlo tendríamos que convertir a numérico el valor devuelto en _e.target.value_:

```diff
<script lang="ts">
	let a: number = 1;
	let b: number = 2;

	const handleChangeA = (e) => {
-       a = e.target.value;
+		a = parseInt(e.target.value);
	}

	const handleChangeB = (e) => {
-		b = e.target.value;
+		b = parseInt(e.target.value);
	}
</script>

<label>
	<input type="number" value={a} on:input={handleChangeA} min=0 max=10>
	<input type="range" value={a} on:input={handleChangeA} min=0 max=10>
</label>

<label>
	<input type="number" value={b} on:input={handleChangeB} min=0 max=10>
	<input type="range" value={b} on:input={handleChangeB} min=0 max=10>
</label>

<p>{a} + {b} = {a + b}</p>
```

Vamos a ver en los siguientes ejemplos, cómo **Svelte** puede ayudarnos a bindear los _inputs_ de nuestros componentes con sus estados internos.
