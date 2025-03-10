# Microfrontends - Integración Manual

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `01-punto-partida`.

### Objetivo

En primer lugar, aplicaremos los cambios mínimos necesarios en los proyectos `keypad` y `terminal` para generar un _bundle_ que pueda ser consumido como microfrontend. Ambas aplicaciones mantendrán la capacidad de arrancar como _standalone_, pero además, expondremos ambos _widgets_ para su uso en _runtime_ por la aplicación _host_.
Responderemos a dos importantes preguntas:

- ¿Qué formato debe tener el _bundle_ para nuestras microapps?
- ¿Qué elemento debe exponerse en dichos _bundles_?

## Parte 1 - Convirtiendo apps en _microapps_ manualmente

Si bien en este ejemplo vamos a hacer una implementación "casera" o "artesanal" de microfrontends, resulta ser muy efectiva y simple para explicar los conceptos clave que se esconden tras esta arquitectura modular.

`[keypad] o [terminal]`

- Probemos a generar una primera build con los settings por defecto:

  ```text
  npm run build
  ```

- 🔍 Y revisemos por un momento los artefactos generados:

  ```text
  assets/
    index-<hash>.js
    index-<hash>.css
  favicon.svg
  index.html
  ```

  > ⚡ El resultado se corresponde típicamente con los artefactos de una aplicación _standalone_, con un `index.html` que actúa como punto de entrada para el navegador, donde se referencian los assets necesarios que deben cargarse:
  >
  > - un `index.js` con toda la lógica de renderizado
  > - y un `index.css` para el estilado de la aplicación
  >
  > Y quien además, aporta el nodo `root` donde `react` renderizará nuestra aplicacion.

- Sin embargo, para que nuestros _widgets_ sean consumidos desde otra aplicación no necesitamos un `index.html`, esto lo proveerá la propia aplicación _host_, basta con empaquetarlos en algún formato que favorezcan su consumo en runtime.

`[keypad] src/microapp-keypad.entrypoint.tsx`

- Comencemos creando un nuevo _entrypoint_ que usaremos exclusivamente como punto de entrada para exportar nuestro widget:

  ```text
    [CREATE] src/microapp-keypad.entrypoint.tsx
  ```

- Y a continuación implementamos un sencillo `re-export`:

  ```tsx
  import React from "react";

  import { Keypad, KeypadProps } from "./pods/keypad.component";

  export const MicroappKeypad: React.FC<KeypadProps> = props => <Keypad {...props} />;

  export default MicroappKeypad;
  ```

- Por lo tanto, a la pregunta **¿qué elemento vamos a exponer en nuestros _bundles_ para microapps?** La respuestá será: un componente de `react`. Es decir, _host_ va a consumir diréctamente un componente de `react`.

  > ⚡ Es cierto que exponer componentes de `react` como microfrontends obliga a la aplicación _host_ a renderizarlos utilizando también `react`. Es decir, rompemos el principio de universalidad por el cual:
  >
  > - "_un microfrontend debe renderizarse a si mismo_".
  >
  > Sin embargo, la integración es tremendamente sencilla, y la comunicación entre _host_ y microapps también.

`[keypad] vite.config-microapp.ts`

- LLega el momento de empaquetar el anterior _entrypoint_ con `vite`. Primeramente necesitamos instalar un _plugin_ que nos será muy útil para empotrar estilos `css` en un _bundle_ `js`:

  ```text
  npm i -D vite-plugin-css-injected-by-js
  ```

- Y a continuación, vamos a crear un nuevo fichero de configuración para `vite`, ya que el empaquetado lo ejecutaremos como una tarea complementaria a la _build_ principal:

  ```text
  [CREATE] vite.config-microapp.ts
  ```

  ```ts
  import { defineConfig } from "vite";
  import cssEmbed from "vite-plugin-css-injected-by-js";

  /**
   * The following build configuration for Vite is intended to run a custom
   * build task specifically made for microapps.
   * The idea is to target the microapp entry and bundle it as a single file
   * with all its dependencies embedded, ready to be consumed from a host app.
   *
   * This manual build task is for educational purposes only. Usually we rely on
   * module federation to load microapps dynamically.
   */
  export default defineConfig({
    plugins: [
      // Embedd css in js bundles to have a single file for the microapp.
      cssEmbed({ relativeCSSInjection: true }),
    ],
    build: {
      // Do not clean the output directory from the previous build.
      emptyOutDir: false,
      // Needed to inject css in js bundles via plugin.
      cssCodeSplit: true,
      lib: {
        // Entry point for the microapp.
        entry: ["src/microapp-keypad.entrypoint.tsx"],
        // Build bundle as ESModules to allow dynamic imports.
        formats: ["es"],
        // Output bundle file (proper extensions will be added).
        fileName: "microapp/keypad",
      },
    },
    // Statically resolve process.env.NODE_ENV.
    define: { "process.env.NODE_ENV": '"production"' },
  });
  ```

- Los aspectos clave de esta configuración son los siguientes:
  - Usamos un plugin para embeber reglas `css` y evitar que se generen artefactos `*.css` por separado. El objetivo, por simplicidad, es tener un único fichero `js` que cargar desde _host_.
  - Empaquetamos en modo librería:
    - Le indicamos como `entry` el punto de entrada de nuestra microapp.
    - A la pregunta **¿qué formato debe tener el _bundle_ para nuestras microapps?** deberíamos contestar con `ESModule`. El motivo es sencillo, es un formato de módulos estándar y que además nos permite poder utilizar la sintaxis de import dinámico desde _host_. Por tanto lo configuramos con dicho formato.
    - Elegimos el nombre del fichero `js` a nuestro gusto, segregado en una carpeta `microapp/`.
  - Definimos el valor estático de `process.env.NODE_ENV` de lo contrario no será reemplazado en el código transpilado y dará problemas al ser consumido desde otra aplicación en navegador.

`[keypad] package.json`

- Como último paso, añadamos al script `build` esta tarea complementaria:

  ```diff
  "scripts": {
    "dev": "vite",
  + "build": "tsc -b && vite build && vite build --config vite.config-microapp.ts",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  ```

✅ **CHECKPOINT**

`[keypad]`

- Estamos listos para probar nuestra nueva `build`:

  ```text
  npm run build
  ```

- 🔍 Inspeccionemos de nuevo los artefactos generados:

  ```text
  assets/
    index-<hash>.js
    index-<hash>.css
  microapp/
    keypad.js
  favicon.svg
  index.html
  ```

  > ⚡ Disponemos de un nuevo bundle bien localizado en `microapp/keypad.js` que empaqueta el componente de `react` para el _widget_ junto con sus estilo y dependencias, en formato `ESModule` listo para ser consumido desde otra aplicación.

### ⌨ Te toca

🛑 **IMPORTANTE**: Repite el mismo proceso anterior para el proyecto `terminal` y asegurate que:

- Se genera un nuevo _bundle_ `microapp/terminal.js`.
- La aplicación puede levantarse como _standalone_ sin problemas.

## Parte 2 - Consumiendo _microapps_ manualmente desde _host_

- Antes de comenzar la integración, recordemos arrancar sendos servidores `preview` para las dos microapps, de modo que tengamos disponibles las microapps para su descarga. Para ello:

  `[keypad]`

  ```text
  npm run build
  npm run preview
  ```

  `[terminal]`

  ```text
  npm run build
  npm run preview
  ```

- Toca el turno ahora al proyecto _host_. Recordemos las 2 preguntas clave que hemos respondido en el paso anterior:

  - ¿Qué formato tendrá el _bundle_ para nuestras microapps? Formato `ESModule`.
  - ¿Qué elemento se expondrá en dichos _bundles_? Un componente de `react`.

`[host] src/pods/dashboard.component.tsx`

- Por tanto, eso significa que podremos usar un `import` dinámico para descargar de forma `lazy` las microapps desde sus ubicaciones conocidas. Es decir, solo cuando sean requeridas serán descargadas. Además, podemos utilizar la feature de `React.Suspense` para mostrar un fallback mientras la descarga asíncrona concluye.

  ```diff
    import React from "react";

    import "./dashboard.css";

  + // Lazy load desired microapps.
  + const Keypad = React.lazy(() => import("http://localhost:3001/microapp/keypad.js"));
  + const Terminal = React.lazy(() => import("http://localhost:3002/microapp/terminal.js"));

    export const Dashboard: React.FC = () => {
      return (
        <div className="dashboard">
          <h1>Dashboard</h1>
  -       <p>...Widgets here, to be implemented...</p>
  +       <React.Suspense fallback={<div>Loading...</div>}>
  +         <Keypad />
  +         <Terminal />
  +       </React.Suspense>
        </div>
      );
    };
  ```

✅ **CHECKPOINT**

`[host]`

- Aún teniendo errores de `typescript` podemos hacer una breve comprobación para ver que la integración ¡funciona!:

  ```text
  npm run dev
  ```

  > 🔍 Comprueba como se renderiza en nuestro _dashboard_ ambos _widgets_, el teclado y la terminal.

  > 🔍 Inspecciona la pestaña _Network_ de las _DevTools_ y comprueba como las microapps se están descargando adecuadamente de sus respectivas ubicaciones remotas.

  > 🎉 Hemos comprobado como una aplicación frontend puede componerse en base a "trozos" de otras aplicaciones, y todo ello en _runtime_.

`[host] src/app.d.ts`

- Vamos a completar la integración haciendo que amobs _widgets_ se comuniquen. En primer lugar, vamos a proporcionarle contexto extra a `typescript` para beneficiarnos de toda la potencia de su tipado. Hay que indicarle que las URLs de las microapps esconden módulos válidos que exportan componentes de `react` con props y callbacks específicos.

- Para ello recurriremos a _module augmentation_ en nuestro `app.d.ts`:

  ```diff
    // Typings for vite/client
    /// <reference types="vite/client" />

    // Module augmentation for complementary types
    declare module "\*.module.css";

  + // Typings for microapps
  + type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";
  + interface KeypadProps {
  +   dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
  + }
  +
  + interface TerminalProps {
  +   value: string;
  + }
  +
  + // Module augmentation for microapps
  + declare module "http://localhost:3001/microapp/keypad.js" {
  +   export const MicroappKeypad: React.FC<KeypadProps>;
  +   export default MicroappKeypad;
  + }
  +
  + // Module augmentation for microapps
  + declare module "http://localhost:3002/microapp/terminal.js" {
  +   export const MicroappTerminal: React.FC<TerminalProps>;
  +   export default MicroappTerminal;
  + }
  ```

`[host] src/pods/dashboard.component.tsx`

- Por último, conectemos los interfaces de ambos _widgets_ para proporcionar la funcionalidad deseada:

  ```diff
    ...

    export const Dashboard: React.FC = () => {
  +   const [value, setValue] = React.useState<string>("");

      return (
        <div className="dashboard">
          <h1>Dashboard</h1>
          <React.Suspense fallback={<div>Loading...</div>}>
  -         <Keypad />
  -         <Terminal />
  +         <Keypad
  +           dispatchEvent={(type, detail) => {
  +             if (type === "numeric-touch") {
  +               setValue(`${value}${detail}`);
  +             } else if (type === "clear-touch") {
  +               setValue("");
  +             } else if (type === "ok-touch") {
  +               alert(`Value: ${value}`);
  +             }
  +           }}
  +         />
  +         <Terminal value={value} />
          </React.Suspense>
        </div>
      );
    };
  ```

✅ **CHECKPOINT**

`[host]`

- Arranca una última vez _host_:

  ```text
  npm run dev
  ```

  > 🔍 Comprueba como la comunicación ambos _widgets_ funciona correctamente, el teclado y la terminal están integrados en _host_ funcionando como se esperaba.

  > 🎉 ¡Acabamos de completar nuestra primera arquitectura de microfrontends con éxito!
