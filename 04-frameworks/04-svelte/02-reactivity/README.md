# 02 - Reactividad

## Resumen

Vamos a ver cómo funciona la reactividad en un componente de Svelte cuando, por ejemplo, cambia un _estado_ del componente.

Partiremos del ejemplo anterior [01-clean-boiler](../01-clean-boiler/).

## Paso a paso

Vamos a modificar nuestro componente _App.svelte_ para añadir una nueva variable `name` para mostrarla en el markup:

```diff
<script lang="ts">
+ let name = "Lemoncoders!";
</script>

<main>
-  <h1>Hello Svelte!</h1>
+  <h1>Hello {name}</h1>
</main>
```

Ahora podemos ver que como resultado tendremos el mensaje **Hello Lemoncoders!**.

¿Cómo podemos hacer que nuestro componente sea reactivo a los cambios de valor de la variable `name`? Vamos a verlo:

- Añadimos un botón al markup, y en el evento `on:click` cambiamos el valor de `name`:

_App.svelte_

```diff
<script lang="ts">
  let name = "Lemoncoders!";
</script>

<main>
  <h1>Hello {name}</h1>
+  <button
+    on:click={() => {
+      name = 'Master Frontend de Lemoncode';
+    }}>
+    Click me!
+  </button>
</main>
```

Podemos comprobar cómo nuestra UI se actualiza con el cambio de la variable. _Voilà!_

_Svelte_ _instruye_ las asignación de valores a variables con código para actualizar el DOM. ¿Qué significa ésto? Que cuando asignemos un nuevo valor a la variable `name` _Svelte_ se encargará de que el DOM de nuestra aplicación se actualice.

### Reactividad con arrays (y objetos)

Vamos a crear una nueva variable con un array de valores, y un botón para añadir un nuevo elemento a la lista (con _list.push(item)_):

_App.svelte_

```diff
<script lang="ts">
  let name = "Lemoncoders!";
+  let list = ['melon', 'apple', 'banana'];
</script>

<main>
  <h1>Hello {name}</h1>
  <button
    on:click={() => {
      name = 'Master Frontend de Lemoncode';
    }}>
    Click me!
  </button>

+  <div>
+    {list.join(', ')}
+  </div>

+  <button
+    on:click={() => {
+      list.push('orange');
+    }}>
+    Add item!
+  </button>
</main>
```

¿Qué ocurre? ¿Por qué no funciona? ¡No estamos haciendo asignación a la variable list!, por tanto _Svelte_ no "vigilará" los cambios en _list_.

Para ello deberemos forzar una asignación (`list = list` funcionaría, si), pero mejor trabajar con `spread operator` e inmutabilidad:

```diff
<script lang="ts">
  let name = "Lemoncoders!";
  let list = ['melon', 'apple', 'banana'];
</script>

<main>
  <h1>Hello {name}</h1>
  <button
    on:click={() => {
      name = 'Master Frontend de Lemoncode';
    }}>
    Click me!
  </button>

  <div>
    {list.join(', ')}
  </div>

  <button
    on:click={() => {
-      list.push('orange');
+      list = [...list, 'orange'];
    }}>
    Add item!
  </button>
</main>
```

¿Y si... asignamos valor a un elemento del array?

```diff
<script lang="ts">
  let name = "Lemoncoders!";
  let list = ['melon', 'apple', 'banana'];
</script>

<main>
  <h1>Hello {name}</h1>
  <button
    on:click={() => {
      name = 'Master Frontend de Lemoncode';
    }}>
    Click me!
  </button>

  <div>
    {list.join(', ')}
  </div>

  <button
    on:click={() => {
-      list = [...list, 'orange'];
+      list[2] = 'kiwi';
    }}>
    Add item!
  </button>
</main>
```

Es una **asignación**, por tanto tendremos toda la potencia de la reactividad de _Svelte_.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
