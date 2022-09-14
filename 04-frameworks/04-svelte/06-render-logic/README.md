# 06 - Lógica en el Render

## Resumen

¿Cómo podemos hacer un **render condicional**? ¿Cómo **crear un bucle para renderizar elementos** de una lista?

Vamos a partir del ejemplo [01-clean-boiler](../01-clean-boiler/).

## Paso a paso

### Render condicional (_If_)

Vamos a ver como renderizar elementos en una sentencia condicional. En _Svelte_ utilizamos la siguiente estructura _if_ en el `markup` de nuestros componentes:

```html
<div>
{#if <condicion>}
  <elemento />
{:else if <condicion>}
  <elemento />
{:else}
  <elemento />
{/if}
</div>
```

En el siguiente ejemplo, renderizaremos un botón dependiendo de si tenemos un estado `user.loggedIn` activo:

_App.svelte_

```html
<script lang="typescript">
  let user = { loggedIn: false };

  const toggle = () => {
    user.loggedIn = !user.loggedIn;
  }
</script>

{#if user.loggedIn}
<p>You are logged in</p>
<button on:click="{toggle}">Logout</button>
{:else}
<button on:click="{toggle}">Login</button>
{/if}
```

### Bucles

Para renderizar elementos de una lista, utilizaremos la siguiente sentencia:

```html
{#each list as item (item.id)}
<elemento />
{/each}
```

Es buena práctica, muy importante en ciertos casos, especificar una `key` única de cada item para asociar el elemento que se está renderizando (en el ejemplo anterior `item.id`).

Partiendo del ejemplo anterior, vamos a renderizar una lista de películas si el usuario está logado:

```diff
<script lang="typescript">
  let user = { loggedIn: false };

  const toggle = () => {
    user.loggedIn = !user.loggedIn;
  }

+  let films = [
+    { id: 'J9fc6bW_oH0', name: 'Cube' },
+    { id: 'OTPtu78Dnpg', name: 'Hypercube' },
+    { id: 'Jb1I2qVau60', name: 'Cube Zero' },
+  ];
</script>

{#if user.loggedIn}
  <p>You are logged in</p>
  <button on:click={toggle}>Logout</button>

+  <h1>The Complete Cube Trilogy</h1>

+  <ul>
+    {#each films as film (film.id)}
+      <li>
+        <a target="_blank" href="https://www.youtube.com/watch?v={film.id}">
+          {film.name}
+        </a>
+      </li>
+    {/each}
+  </ul>
{:else}
  <button on:click={toggle}>Login</button>
{/if}

```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
