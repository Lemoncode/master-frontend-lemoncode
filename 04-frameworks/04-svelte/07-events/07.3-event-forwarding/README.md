# 07.3 - Forwarding de Eventos

## Resumen

Los eventos de los componentes no burbujean. Si quieres escuchar un evento en algún componente profundamente anidado, **los componentes intermedios deben reenviar el evento**. Esto se conoce como **event forwarding**.

Vamos a partir del ejemplo justo anterior [07.02-component-events](../07.2-component-events/).

## Paso a paso

### Crear componente intermedio para hacer event-forwarding

Para ver un ejemplo, vamos a añadir un componente entre _App_ y _EditMessage_, lo llamaremos _FormData_:

_form-data.svelte_

```html
<script lang="ts">
  import EditMessage from './edit-message.component.svelte';

  import { createEventDispatcher } from 'svelte';

  export let message: string;

  const dispatch = createEventDispatcher();

  const forwarding = e => {
    dispatch('message', e.detail);
  };
</script>

<p>Edit your data:</p>
<EditMessage message="{message}" on:message="{forwarding}" />
```

Y lo renderizamos desde _App_:

_App.svelte_

```diff
<script lang="ts">
-  import EditMessage from './edit-message.component.svelte';
+  import FormData from './form-data.component.svelte';

  let message: string = 'Initial message';

  const handleMessage = (e: CustomEvent<{ message: string }>) => {
    message = e.detail.message;
  };
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>{message}</h2>
-  <EditMessage on:message={handleMessage} message={message} />
+  <FormData on:message={handleMessage} message={message} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

Ahora estamos burbujeando el evento por el componente intermedio _FormData_. Pero... ¿No es mucho código para hacer eso?

### Shorthand

Sí, esto es mucho código que escribir, así que _Svelte_ nos da una abreviatura o shorthand equivalente: una directiva de eventos `on:<event name>` sin un valor hará forwarding de los eventos que se lancen:

_form-data.component.svelte_

```diff
<script lang="ts">
  import EditMessage from './edit-message.component.svelte';

-  import { createEventDispatcher } from 'svelte';

  export let message: string;

-  const dispatch = createEventDispatcher();

-  const forwarding = e => {
-    dispatch('message', e.detail);
-  };
</script>

<p>Edit your data:</p>
- <EditMessage message={message} on:message={forwarding} />
+ <EditMessage message={message} on:message />
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
