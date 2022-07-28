# 08.5 - Binding de componentes

## Resumen

¿Podemos utilizar la directiva `bind` para props de nuestros componentes?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Crear componente hijo

Primero vamos a crear un componente hijo `EditName` con una _prop_ `name`, que además la bindearemos al value de un input:

_edit-name.svelte_

```html
<script lang="ts">
  export let name: string;
</script>

<input type="text" bind:value="{name}" />
```

### Binding de la prop `name`

Vamos a utilizar el componente anterior desde _App_, y además vamos a bindear la _prop_ `name` a un estado `myName`:

_App.svelte_

```diff
<script lang="ts">
+  import EditName from './edit-name.svelte';

+  let myName = 'Lemoncoders';
</script>

<main>
-  <h1>Hello Svelte!</h1>
+  <h1>Hello {myName}!</h1>
+  <EditName bind:name={myName} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

Vemos cómo con pocas líneas de código tenemos el ejemplo funcionando, y no hemos tenido que utilizar _callback props, eventos, handlers, etc_.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
