# 08.1 - Handler de Eventos

## Resumen

En el ejemplo anterior hemos visto ciertos problemas para actualizar el estado del componente con el contenido de los inputs de texto y numéricos. Veamos como _Svelte_ puede ayudarnos en esta tarea.

Vamos a partir del ejemplo anterior [08.0-event-handler](../08.0-event-handler/).

## Paso a paso

### Usando `bind:value`

Partiendo del ejemplo anterior, vamos a simplificar código y solucionar (sin tener que preocuparnos de parsear a number) el cálculo de la suma de los valores de los inputs. Para ello utilizaremos `bind:value` y no tendremos que añadir ningún manejador de eventos:

_App.svelte_

```diff
<script lang="ts">
  let name: string = 'Lemoncoders';
  let a: number = 0,
    b: number = 0;

-  const handleInput = e => {
-    name = e.target.value;
-  };

-  const handleChangeA = e => {
-    a = e.target.value;
-  };

-  const handleChangeB = e => {
-    b = e.target.value;
-  };
</script>

<main>
  <h1>Hello {name}!</h1>
-  <input value={name} on:input={handleInput} />
+  <input bind:value={name} />
  <div>
-    <input type="number" value={a} on:input={handleChangeA} min="0" max="10" />
+    <input type="number" bind:value={a} min="0" max="10" />
-    <input type="range" value={a} on:input={handleChangeA} min="0" max="10" />
+    <input type="range" bind:value={a} min="0" max="10" />
  </div>

  <div>
-    <input type="number" value={b} on:input={handleChangeB} min="0" max="10" />
+    <input type="number" bind:value={b} min="0" max="10" />
-    <input type="range" value={b} on:input={handleChangeB} min="0" max="10" />
+    <input type="range" bind:value={b} min="0" max="10" />
  </div>

  <p>Resultado: {a} + {b} = {a + b}</p>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
