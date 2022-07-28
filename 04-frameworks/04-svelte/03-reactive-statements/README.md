# 03 - Bloques de código reactivos

## Resumen

Hemos visto la reactividad de _Svelte_ por **asignación** de valores a variables. Pero, ¿cómo podemos tener un bloque de código reactivo a ciertos cambios de estado?

Partiremos del ejemplo [01-clean-boiler](../01-clean-boiler/).

## Paso a paso

Vamos a modificar nuestro componente _App.svelte_ para crear un contador típico:

```diff
<script lang="ts">
+ let counter = 0;
</script>

<main>
-  <h1>Hello Svelte!</h1>
+  <h1>Counter: {counter}</h1>
+  <button
+    on:click={() => {
+      counter = counter + 1;
+    }}>
+    Increment!
+  </button>
</main>
```

Ahora añadimos un `console.log(counter)` para mostrar por consola los cambios de estado:

```diff
<script lang="ts">
  let counter = 0;

+ console.log(counter);
</script>

<main>
  <h1>Counter: {counter}</h1>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

Si ejecutamos podemos ver que la línea de `console.log` sólo se ejecuta una vez. Tenemos que cambiar el chip, la forma de pensar, si venimos de otras librerías y frameworks, para entender que **no hay re-renders** del componente. **Los cambios en `counter` actualizan el DOM de forma quirúrgica, no se re-renderiza ni ejecuta todo el componente.** Entonces, ¿cómo podemos conseguir bloques de código reactivos a los cambios? Con _Svelte_ utilizaremos el símbolo `$` para establecer líneas o bloques de código reactivos a cambios:

```diff
<script lang="ts">
  let counter = 0;

- console.log(counter);
+  $: {
+    console.log(counter);
+  }
</script>

<main>
  <h1>Counter: {counter}</h1>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

Ahora podemos ver en consola un mensaje por cada cambio de `counter`.

En casos como éste, con una sóla linea dentro del bloque de código, podemos obviar las llaves:

```diff
<script lang="ts">
  let counter = 0;

-  $: {
-    console.log(counter);
-  }
+  $: console.log(counter);
</script>

<main>
  <h1>Counter: {counter}</h1>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

Incluso podríamos añadir sentencias condicionales:

```diff
<script lang="ts">
  let counter = 0;

  $: console.log(counter);

+  $: if (counter > 10) {
+    counter = 0;
+  }
</script>

<main>
  <h1>Counter: {counter}</h1>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
