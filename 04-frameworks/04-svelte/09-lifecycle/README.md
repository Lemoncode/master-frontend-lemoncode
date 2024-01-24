# 09 - Ciclos de vida

## Resumen

¿Cómo podemos ejecutar código en ciertos momentos del ciclo de vida de un componente?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

Para acceder a los ciclos de vida vamos a crear un componente `Demo`:

_demo.svelte:_

```svelte
<script lang="ts">
</script>

<div>
  <h2>Demo Component</h2>
</div>

<style>
  div {
    border: 1px dashed #ff3e00;
    padding: 1rem;
  }
</style>
```

Y vamos a renderizarlo, con un condicional render, en `App`:

_app.svelte:_

```diff
<script lang="ts">
+  import Demo from './demo.svelte';

+  let show = false;
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <button on:click={() => (show = !show)}>Toggle</button>
+  {#if show}
+    <Demo />
+  {/if}
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

### onMount

Vamos a utilizar la función `onMount` para ejecutar código cuando el componente `Demo` se monte en el DOM:

_demo.svelte:_

```diff
<script lang="ts">
+  import { onMount } from 'svelte';

+  onMount(() => {
+    console.log('mounted');
+  });
</script>

<div>
  <h2>Demo Component</h2>
</div>

<style>
  div {
    border: 1px dashed #ff3e00;
    padding: 1rem;
  }
</style>
```

### Cleanup function

Si queremos ejecutar código cuando el componente se desmonte, podemos devolver una función (`cleanup function`) en `onMount`:

_demo.svelte:_

```diff
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('mounted');
+    return () => {
+      console.log('unmounted');
+    };
  });
</script>

<div>
  <h2>Demo Component</h2>
</div>

<style>
  div {
    border: 1px dashed #ff3e00;
    padding: 1rem;
  }
</style>
```

### Antes y después de cada actualización del DOM

Si queremos ejecutar código antes y después de cada actualización del DOM, podemos utilizar `beforeUpdate` y `afterUpdate`:

_demo.svelte:_

```diff
<script lang="ts">
-  import { onMount } from 'svelte';
+  import { onMount, beforeUpdate, afterUpdate } from 'svelte';

+  let value = '';

  onMount(() => {
    console.log('mounted');
    return () => {
      console.log('unmounted');
    };
  });

+  beforeUpdate(() => {
+    console.log('before update');
+  });

+  afterUpdate(() => {
+    console.log('after update');
+  });
</script>

<div>
  <h2>Demo Component</h2>
+  <input bind:value={value} />
</div>

<style>
  div {
    border: 1px dashed #ff3e00;
    padding: 1rem;
  }
</style>
```
