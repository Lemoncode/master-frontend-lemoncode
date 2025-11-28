# Creando el proyecto

Para crear el proyecto Astro, arrancamos desde cero.

Lo primero utlizamos el CLI de Astro para crear la estructura del proyecto:

```bash
npm create astro@latest
```

Le damos como nombre al proyecto _miblog_

Elegimos la opción _A basic, minimal starter_

Elegimos en `Install Dependencies` Yes

Y En Initalize Git Repository, como quieras, en este caso Yes

Ahora entramos en la carpeta del proyecto (lo idea es abrir carpeta nueva desde VSCode)

Arrancamos el proyecto y vemos que funciona

```bash
npm run dev
```

Abrimos en el navegador y navegamos a la ruta `locahost:4321` y todo funciona correctamente.

> Para mejor experiencia mira que tengamos el plugin de Astro en VSCode instalado.

Antes de seguir, para que sea más fácil formatear el código, vamos a instalar prettier y la extensión para astro

```bash
npm install --save-dev prettier
```

```bash
npm install --save-dev prettier-plugin-astro
```

Y añadimos configuración para prettier en el archivo `.prettierrc`:

_./.prettierrc_

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

# Limpiando

Y ya que estamos limpiamos fichero que no necesitamos:

`./src/assets/astro.svg`
`./src/assets/background.svg`

`./components/Welcome.astro`

y en `./src/pages/index.astro` actualizamos:

```diff
---
- import Welcome from '../components/Welcome.astro';
import Layout from '../layouts/Layout.astro';

// Welcome to Astro! Wondering what to do next? Check out the Astro documentation at https://docs.astro.build
// Don't want to use any of this? Delete everything in this file, the `assets`, `components`, and `layouts` directories, and start fresh.
---

<Layout>
-	<Welcome />
+ <h1>Hello Blog !</h1>
</Layout>

```


Ya estamos listos para empezar a crear nuestro blog.
