# 05 - Declarando Props

## Resumen

Muy bien, ya tenemos un componente reactivo a cambios de estado... Pero... ¿Cómo podemos pasarle `props` desde el componente padre?

Partiremos del ejemplo anterior [04-reactive-declarations](../04-reactive-declarations/).

## Paso a paso

### Crear componente hijo

Primero vamos a crear un nuevo componente hijo, lo llamaremos `info.svelte`:

_info.svelte_

```html
<script lang="ts">
  let name = 'Lemoncoders!';
  let counter = 0;
</script>

<div>
  <p>Hello {name}</p>
  <p>Counter: {counter}</p>
</div>
```

_App.svelte_

```diff
<script lang="ts">
+ import Info from './info.svelte';

  let counter = 0;

  $: double = counter * 2;

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }
</script>
<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>

+  <Info />
</main>
...
```

### Declarar las Props

Ahora, ¿cómo podemos pasarle desde el componente padre _App.svelte_ los valores de `name` y `counter`?

Declarar una `prop` es tan sencillo como exportar la variable:

_info.svelte_

```diff
<script lang="ts">
-  let name = 'Lemoncoders!';
-  let counter = 0;
+  export let name: string;
+  export let counter: number;
</script>

<div>
  <p>Hello {name}</p>
  <p>Counter: {counter}</p>
</div>
```

_App.svelte_

```diff
...
<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>

-  <Info />
+  <Info name="Lemoncoders!" counter={counter} />
</main>
...
```

Ejecutamos y podemos ver cómo el componente hijo se actualiza con el valor de las `props` que le pasa el padre.

### Props opcionales (o valor por defecto)

Podemos declarar `props` opcionales definiendo un valor por defecto:

_info.svelte_

```diff
<script lang="ts">
-  export let name: string;
+  export let name: string = 'Lemoncoders!';
   export let counter: number;
</script>

<div>
  <p>Hello {name}</p>
  <p>Counter: {counter}</p>
</div>
```

_App.svelte_

```diff
...
<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>

-  <Info name="Lemoncoders!" counter={counter} />
+  <Info counter={counter} />
</main>
...
```

### Spread Props

Cuando tenemos definidas varias `props` en un componente hijo, desde el padre podemos hacer `spread` de un objeto que las contenga:

_info.svelte_

```diff
<script lang="ts">
   export let name: string = 'Lemoncoders!';
+  export let age: number;
   export let counter: number;
</script>

<div>
  <p>Hello {name}</p>
+ <p>Age: {age}</p>
  <p>Counter: {counter}</p>
</div>
```

_App.svelte_

```diff
<script lang="ts">
  import Info from './info.svelte';

  let counter = 0;

  $: double = counter * 2;

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }

+  const user = {
+    name: 'Lemoncoders!',
+    age: 20,
+  };
</script>

<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>

-  <Info counter={counter} />
+  <Info counter={counter} {...user} />
</main>
...
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
