Start from **08.2-component-events**

# Event Forwarding

A diferencia de los eventos del DOM, los eventos de los componentes no burbujean. Si quieres escuchar un evento en algún componente profundamente anidado, los componentes intermedios deben reenviar el evento.

Para ver un ejemplo, vamos a añadir un componente entre _App_ y _EditName_, lo llamaremos _FormData_:

_app.svelte_

```diff
<script lang="typescript">
-	import EditName from './edit-name.component.svelte';
+	import FormData from './form-data.component.svelte';

	let name: string = "Svelte";

	const onNameChanged = (e: CustomEvent<{name: string}>) => {
		name = e.detail.name;
	}
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {name}!</h1>
- <EditName on:nameChanged={onNameChanged} name={name} />
+ <FormData on:nameChanged={onNameChanged} name={name} />
```

_form-data.component.svelte_

```js
<script lang="typescript">
    import EditName from './edit-name.component.svelte';

    import { createEventDispatcher } from 'svelte';

    export let name: string;

    const dispatch = createEventDispatcher();

    const forwarding = (e) => {
        dispatch('nameChanged', e.detail);
    }
</script>

<p>Edit your data:</p>
<EditName name={name} on:nameChanged={forwarding} />
```

Pero eso es mucho código para escribir, así que Svelte nos da una abreviatura equivalente - una directiva de eventos `on:nameChanged` sin un valor hará forwarding de los eventos que se lancen:

_form-data.component.svelte_

```diff
<script lang="typescript">
    import EditName from './edit-name.component.svelte';

-   import { createEventDispatcher } from 'svelte';

    export let name: string;

-   const dispatch = createEventDispatcher();

-   const forwarding = (e) => {
-       dispatch('nameChanged', e.detail);
-   }
</script>

<p>Edit your data:</p>
- <EditName name={name} on:nameChanged={forwarding} />
+ <EditName name={name} on:nameChanged />
```
