Start from **03-svelte-typescript**

# Component Events

Los componentes también pueden enviar eventos. Para ello, deben crear un `dispatch` de eventos.

Para crear nuestro primer evento vamos a montar el siguiente caso:

- Componente padre _App_ que renderiza un saludo _Hello {name}_.
- Componente hijo _EditName_ con un _input_ para modificar el _name_ y avisar al padre del cambio.

_edit-name.component.svelte_

```js
<script lang="typescript">
    import { createEventDispatcher } from 'svelte';

    export let name: string;

    const dispatch = createEventDispatcher();

    const handleChange = (e) => {
        dispatch('nameChanged', {name: e.target.value})
    }
</script>

<input type="text" on:keyup={handleChange} value={name} />
```

_app.svelte_

```diff
<script lang="typescript">
+	import EditName from './edit-name.component.svelte';

	let name: string = "Svelte";

+	const onNameChanged = (e: CustomEvent<{name: string}>) => {
+		name = e.detail.name;
+	}
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {name}!</h1>
+ <EditName on:nameChanged={onNameChanged} name={name} />
```

> `createEventDispatcher` debe ser llamado cuando el componente es instanciado por primera vez - no se puede hacer más tarde, por ejemplo, en un callback setTimeout. Esto vincula el `dispatch` a la instancia del componente.

El componente App está escuchando los mensajes enviados por el componente hijo _EditName_ gracias a la directiva on:nameChanged. Esta directiva es un atributo prefijado con `on:` seguido del nombre del evento que estamos lanzando (en este caso, `nameChanged`).

Sin este atributo, los eventos se seguirían enviando, pero la aplicación no reaccionaría a ellos.

