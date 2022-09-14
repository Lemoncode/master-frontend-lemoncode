# 07.2 - Eventos de componentes

## Resumen

Hemos visto en el ejemplo anterior como manejar eventos del DOM, pero... ¿Cómo podemos lanzar eventos desde nuestros componentes?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Lanzar eventos desde un Componente

Los componentes también pueden lanzar eventos. Para ello, deben crear un `dispatch` de eventos.

Para crear nuestro primer evento vamos a montar el siguiente caso:

- Componente padre _App_ que renderiza un mensaje en una etiqueta _h2_.
- Componente hijo _edit-name.svelte_ con un _input_ para modificar el _message_ y avisar al padre del cambio.

_edit-name.component.svelte_

```html
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let message: string;

  const dispatch = createEventDispatcher();

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    dispatch('message', { message: target.value });
  };
</script>

<input type="text" on:input="{handleInput}" value="{message}" />
```

_app.svelte_

```diff
<script lang="typescript">
+	import EditMessage from './edit-message.component.svelte';

+  let message: string = 'Initial message';

+  const handleMessage = (e: CustomEvent<{ message: string }>) => {
+    message = e.detail.message;
+  };
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <h2>{message}</h2>
+  <EditMessage on:message={handleMessage} message={message} />

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

> `createEventDispatcher` debe ser llamado cuando el componente es instanciado por primera vez - no se puede hacer más tarde, por ejemplo, en un callback de un setTimeout. Esto vincula el `dispatch` a la instancia del componente.

El componente App está escuchando los mensajes enviados por el componente hijo _EditMessage_ gracias a la directiva `on:message`. Esta directiva es un atributo prefijado con `on:` seguido del nombre del evento que estamos lanzando en el `dispatch` (en este caso, `message`).

Sin este atributo, los eventos se seguirían lanzando, pero la aplicación no reaccionaría a ellos.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
