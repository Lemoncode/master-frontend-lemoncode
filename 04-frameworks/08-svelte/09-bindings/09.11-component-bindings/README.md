Start from **08-events/08.2-component-events**

# Binding - Component Bindings

_edit-name.component.svelte_

```diff
<script lang="typescript">
-    import { createEventDispatcher } from 'svelte';

    export let name: string;

-    const dispatch = createEventDispatcher();

-    const handleChange = (e) => {
-        dispatch('nameChanged', {name: e.target.value})
-    }
</script>

- <input type="text" on:keyup={handleChange} value={name} />
+ <input type="text" bind:value={name} />
```

_app.svelte_

```diff
<script lang="typescript">
	import EditName from './edit-name.component.svelte';

-	let name: string = "Svelte";
+ let myName: string = "Svelte";

-	const onNameChanged = (e: CustomEvent<{name: string}>) => {
-		name = e.detail.name;
-	}
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

- <h1>Hello {name}!</h1>
+ <h1>Hello {myName}!</h1>
- <EditName on:nameChanged={onNameChanged} name={name} />
+ <EditName bind:name={myName} />
```
