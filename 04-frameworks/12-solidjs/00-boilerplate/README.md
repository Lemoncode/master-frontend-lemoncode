# 00 Boilerplate

In this example we are going to add a basic setup needed to work with SoliJS.

We will start from scratch.

# Steps to build it

Let's create the `package.json`:

```bash
npm init -y
```

# Libraries

We are going to install the libraries which we base all our [SolidJS projects](https://www.solidjs.com/guides/getting-started#try-solid).

- [solid-js](https://github.com/solidjs/solid): Solid is a declarative JavaScript library for creating user interfaces.

- [vite-plugin-solid](https://github.com/solidjs/vite-plugin-solid): A simple integration to run solid-js with vite.

```bash
npm install solid-js --save

npm install typescript vite vite-plugin-solid --save-dev
```

Add `tsconfig.json`:

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  },
  "include": ["src", "./vite-env.d.ts"]
}
```

> The most important properties are `jsx` and `jsxImportSource` which are used to configure TypeScript to use Solid JSX transformer. 
>
> [More info about solid-js and TypeScript config](https://www.solidjs.com/guides/typescript)

Add `vite.config.ts`:

_./vite.config.ts_

```typescript
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
});
```

Add `vite-env.d.ts`:

_./vite-env.d.ts_

```typescript
/// <reference types="vite/client" />
```

Add `index.html`:

_./index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Solid App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/src/index.tsx" type="module"></script>
  </body>
</html>

```

Add `index.tsx`:

_./src/index.tsx_

```jsx
import { render } from "solid-js/web";

const App = () => {
  return <h1>Hello from SolidJS</h1>;
};

render(() => <App />, document.getElementById("root"));

```

Update `package.json`:

_./package.json_

```diff
{
  ...
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
+   "start": "vite"
  },
}
```

> Open `http://localhost:5173/` to see the result.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
