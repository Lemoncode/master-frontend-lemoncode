# 02. Crear nuestro primer componente

Como punto de partida tomaremos del ejemplo anterior [01-get-started](../01-get-started/README.md).

## Componentes en Svelte

En Svelte, los componentes son bloques de código reutilizables que pueden contener HTML (Markup), CSS y JavaScript. Los componentes en Svelte se crean con la extensión de archivo `.svelte`.

### Sección de Markup

Crearemos un nuevo fichero llamado `playground.svelte` en la carpeta `src/lib` y añadiremos el siguiente contenido:

_/src/lib/playground.svelte_:

```svelte
<h1>Hello from Playground component</h1>
```

Ahora importaremos este componente desde la única página (aún) de nuestra aplicación:

_/src/routes/+page.svelte_:

```diff
- <h1>Welcome to SvelteKit</h1>
- <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

+ <script lang="ts">
+   import Playground from '$lib/playground.svelte';
+ </script>

+ <Playground />
```

Ya podemos ver el nuevo componente en nuestra aplicación al ejecutarla.

### Sección script

Vamos a modificar el componente para renderizar una variable:

_/src/lib/playground.svelte_:

```diff
+ <script>
+     let name = 'Lemoncoders!';
+ </script>

- <h1>Hello from Playground component</h1>
+ <h1>Hello {name}</h1>
```

### Sección styles

Por último, añadimos estilos al componente:

_/src/lib/playground.svelte_:

```diff
<script lang="ts">
    let name = 'Lemoncoders!';
</script>

<h1>Hello {name}</h1>

+ <style>
+   h1 {
+       color: indianred;
+   }
+ </style>
```

Podemos ver el resultado ejecutando la aplicación:

```bash
npm run dev
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)