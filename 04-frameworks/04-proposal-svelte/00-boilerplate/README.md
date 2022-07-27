# 00 - Boilerplate

## Enlaces de interés

- [Página oficial](https://svelte.dev/)
- [Blog oficial](https://svelte.dev/blog)
- [Get started (deprecated)](https://svelte.dev/blog/the-easiest-way-to-get-started)

## Resumen

**¡Bienvenido a Svelte!** En este primer ejemplo vamos a arrancar un proyecto desde cero...

A diferencia de otros frameworks o librerías que ya hemos visto, no vamos a utilizar ni un CLI ni a crear desde cero la configuración con _webpack_. De hecho, no vamos a utilizar _webpack_.

_Svelte_ te ofrece una forma de arrancar proyectos nuevos, y como _bundler_ utiliza _Vite_ 🚀.

> Entonces, ¿no podemos utilizar _webpack_ u otros _bundlers_? Por supuesto que sí. Por ejemplo con _webpack_ podríamos añadir los _loaders_ y _plugins_ necesarios y modificar nuestro `webpack.config.js` para dar soporte a _Svelte_.

## Paso a paso

> Hasta hace poco, se hacía de otra forma: [The easiest way to get started with Svelte](https://svelte.dev/blog/the-easiest-way-to-get-started). Explicaremos el proceso deprecado de ese blog en este mismo documento, en las últimas secciones.

Para los ejemplos de este repositorio utilizaremos la forma actual por defecto que te da _Svelte_ para crear proyectos:

```bash
npm create vite@latest <my-app-name> -- --template svelte
```

**Y mejor**, con soporte para _Typescript_:

```bash
npm create vite@latest <my-app-name> -- --template svelte-ts
```

Instalamos dependencias y ejecutamos el proyecto:

```bash
cd <my-app-name>
npm install
npm run dev
```

> ¡Ojo! el script `npm start` no está configurado por defecto en el fichero `package.json`. Para ejecutar el proyecto utilizamos `npm run dev`. Puedes cambiar el script a `start` si lo prefieres.

🚀 **¡Voilà! ya tenemos listo un proyecto de _Svelte_ con soporte para _Typescript_.** 🚀

### Usando el _REPL_ (deprecated)

_REPL_ son las siglas de _Read-Eval-Print Loop_ y se trata de un entorno web interactivo que permite modificar el código y ver al instante el resultado. ¿Te suena?

Podemos acceder al _REPL_ del `hello-world` de _Svelte_ aquí:

- https://svelte.dev/repl/hello-world

Como comentan, es la forma más sencilla de comenzar a picar código con _Svelte_. Además podemos descargar el _REPL_ en un `.zip` desde la opción _download zip file_ que encontrarás en la barra superior derecha.

Si descomprimos el fichero descargado y abrimos su contenido con _VS Code_ ya podemos arrancar nuestro proyecto de _Svelte_ en local. Primero instalamos las dependencias:

```bash
npm install
```

Y luego ejecutamos con:

```bash
npm run dev
```

Podremos ver la aplicación corriendo en `localhost:8080` y se actualizará con _rollup_ cada vez que hagamos un cambio en los archivos en de `/src`.

### Usando _degit_ (deprecated)

Con la forma anterior, obtenemos una versión (personalizada, si modificamos código en el _REPL_) del repo de `sveltejs/template`. Podemos evitar el lío de tener que descargar y descomprimir el fichero `.zip` usando _degit_, una herramienta de _scaffolding_ de proyectos.

Podemos crear un proyecto nuevo directamente desde la terminal:

```bash
npx degit sveltejs/template <nombre_de_proyecto>
```

Una vez creado, podemos instalar sus dependencias:

```bash
npm install
```

Y luego ejecutarlo con:

```bash
npm run dev
```

### Dar soporte a Typescript

Con cualquiera de las dos formas anteriores de crear proyectos nuevos, podemos dar soporte a _Typescript_ de una manera muy sencilla: ¡ejecutando un script que tenemos disponible en el proyecto!. Puedes abrirlo y echarle un vistazo, lo tienes en `/scripts/setupTypeScript.js`.

Vamos a ejecutarlo:

```bash
node scripts/setupTypeScript.js
```

Tras realizarnos los cambios necesarios, volvemos a instalar las dependencias:

```bash
npm install
```

Y luego ejecutarlo con:

```bash
npm run dev
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
