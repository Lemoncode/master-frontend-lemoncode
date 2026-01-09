# Microfrontends - Convirtiendo apps en _microapps_

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `01-punto-partida`.

### Objetivo

Aplicar los ajustes mínimos necesarios para generar, a partir de una aplicación sencilla, un _bundle_ que pueda ser consumido como microfrontend, manteniendo la capacidad de arrancar dicha aplicación como _standalone_ también. De las posibles soluciones disponibles, utilizaremos la más simple: _vanilla_ JS. En este paso modificaremos los proyectos `microapp-clock` y `microapp-quote` para generar los microfrontends `clock-microapp.js` y `quote-microapp.js`.

## _Entrypoint_ dual

- 🔍 Revisemos por un momento el entrypoint habitual de una aplicación:

  ```ts
  // 1. Componente de react que engloba toda nuestra aplicación
  const App: React.FC = () => <Clock />;

  // 2. Hacemos el renderizado de dicho componente en el nodo de nuestro index.html
  // destinado a tal efecto
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
  ```

  En el caso de una aplicación _standalone_, la única responsabilidad es renderizar dicha aplicación en el nodo correspondiente (destinado a dicho fin) que tenemos disponible en nuestro `index.html`.

- ⚡ Convertir una aplicación en _microapp_ implica generar 2 _bundles_ diferentes para 2 escenarios distintos:

  - Un _bundle_ que nos permita arrancar nuestra aplicación en modo _standalone_. Es el _bundle_ clásico que ya conocemos: se carga desde un `index.html` y pone en marcha la aplicación en nuestro navegador.
  - Otro _bundle_ que permita consumir nuestra aplicación desde otra: lo que conocemos como _microapp_ o microfrontend. En este caso, una aplicación _host_ cargará dicho _bundle_ y le indicará **donde** y **cuando** debe **renderizarse**.

  Por lo tanto, necesitaremos un _entrypoint_ para cada _bundle_ con responsabilidades diferenciadas:

  - `microapp.entrypoint.tsx` se encargará de exponer un interfaz que permita renderizar la aplicación en un nodo dado, o desmontarla cuando sea necesario. Este será el punto de entrada para cualquier aplicación _host_ que quiera consumir el microfrontend.
  - `app.entrypoint.tsx`: destinado a poner en marcha el microfrontend como una aplicación _standalone_, muy necesario para nuestro desarrollo local por ejemplo. Este entrypoint puede entenderse como una mini aplicación _host_ que lo único que hará es consumir el interfaz expuesto por `microapp.entrypoint`.

`[microapp-clock] microapp.entrypoint.tsx`

- Comenzamos creando nuestro nuevo entrypoint, junto con un fichero de estilos:

  ```text
  [CREATE] microapp.entrypoint.tsx
  [CREATE] microapp.styles.ts
  ```

- Y nos detenemos en la implementación:

  En este fichero definiremos la 'carcasa' de nuestro microfrontend, lo que las aplicaciones _host_ verán desde fuera. Es decir, tenemos que ofrecer una interfaz genérica y sencilla que permita a cualquier _host_ renderizar los microfrontends.

  Aqui hay diversas soluciones, una de ellas podría haber sido el empleo de _web components_ como envoltura de los microfrontends. En nuestro caso, nos hemos inclinado por utilizar una simple API con 2 funciones, que serán llamadas por la aplicación _host_ cuando lo precise:

  - `render`: para 'pintar' el microfrontend.
  - `unmount`: para desmontarlo.

  En ambos casos, sera la aplicación _host_ quien provea el _container_ (nodo del DOM de su propiedad) donde debe renderizarse o desmontarse el microfrontend. Esta API estará escrita en _vanilla_ JS, y por tanto es una solución sencilla con importantes ventajas:

  - Compatibilidad total.
  - 100% flexible y customizable.

  > ⚡ Es nuestra responsabilidad mantener esta interfaz, con lo que ello supone: garantizar que se cumple en todos los microfrontends, compatibilidad hacia atrás, evitar _breaking changes_, etc.

  Vamos finalmente con el código:

  ```tsx
  import "./microapp.styles";
  import React from "react";
  import { createRoot, Root } from "react-dom/client";
  import { Clock } from "./components";

  /**
   * Microapp component
   */
  const Microapp: React.FC = () => <Clock />;

  /**
   * Microapp public interface
   */
  interface MicroappInterface {
    render: (container: HTMLElement) => void;
    unmount: (container?: HTMLElement) => void;
  }

  let root: Root;

  export const MicroappInterface: MicroappInterface = {
    render: container => {
      root = createRoot(container);
      root?.render(<Microapp />);
    },
    unmount: () => root?.unmount(),
  };

  export default MicroappInterface;
  ```

`[microapp-clock] microapp.styles.ts`

- Para el fichero de estilos, recuperamos el estilado que teníamos en `app.styles.ts` pero eliminamos las reglas para el `body` puesto que un microfrontend no debe tener opinión sobre el `body` de una aplicación _host_:

  ```text
  [COPY/PASTE] app.styles.ts => microapp.styles.ts
  ```

  ```diff
    import { injectGlobal } from "@emotion/css";
    import PoppinsFont from "./assets/font/poppins-regular.ttf";

    injectGlobal`
      @font-face {
        font-family: "Poppins";
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src:
          local('Poppins'),
          local('Poppins-Regular'),
          url(${PoppinsFont}) format('truetype');
      }
  -
  -   body {
  -     margin: 0;
  -     padding: 0;
  -   }
    `;
  ```

`[microapp-clock] app.entrypoint.tsx`

- Puesto que ya tenemos una interfaz definida en `microapp.entrypoint.tsx` para manejar el renderizado de nuestra aplicación, hagamos uso de ella para levantarla como _standalone_ y "pintémosla" en nuestro nodo `root` del `index.html`:

  ```diff
    import "./app.styles";
  - import React from "react";
  - import { createRoot } from "react-dom/client";
  - import { Clock  } from "./components";
  + import { MicroappInterface } from "./microapp.entrypoint";

  - const App: React.FC = () => <Clock />;

  - const root = createRoot(document.getElementById("root"));
  - root.render(<App />);

  + MicroappInterface.render(document.getElementById("root"));
  ```

`[microapp-clock] app.styles.ts`

- Finalmente, modificamos los estilos en `app.styles.ts` para quedarnos solo con las reglas que quitamos de `microapp.styles.ts`

```diff
    import { injectGlobal } from "@emotion/css";
-   import PoppinsFont from "./assets/font/poppins-regular.ttf";

    injectGlobal`
-     @font-face {
-       font-family: "Poppins";
-       font-style: normal;
-       font-display: swap;
-       font-weight: 400;
-       src:
-         local('Poppins'),
-         local('Poppins-Regular'),
-         url(${PoppinsFont}) format('truetype');
-     }
-
      body {
        margin: 0;
        padding: 0;
      }
    `;
```

## Ajustando `webpack`

`[microapp-clock] config/webpack.common.js`

- Nuestro último paso será el de generar el nuevo _bundle_ de la microapp a partir de `microapp.entrypoint.tsx`. Dicho de otro modo, debemos indicar a `webpack` que queremos empaquetar nuestro proyecto desde `microapp.entrypoint.tsx` en adelante y generar un _bundle_ aparte. Para ello ajustamos la sección `entry` en la configuración de `webpack`:

  ```diff
    ...
  + const { embedAssets = true } = env;

    return {
      context: helpers.srcPath, // src
        resolve: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        entry: {
          app: ["./app.entrypoint.tsx"],
  +       // Nuevo bundle para ser consumido como microapp
  +       microapp: {
  +         import: "./microapp.entrypoint.tsx",
  +         // Webpack expondrá el contenido de MicroappInterface en window.microappClock
  +         library: {
  +           type: "window",
  +           name: "microappClock",
  +           export: "MicroappInterface",
  +         },
          },
        },
        output: {
          // Ruta para depositar los artefactos de salida.
          path: helpers.buildPath,
        ...
  ```

  > 🛑 **IMPORTANTE**: Hemos activado el valor por defecto de `embedAssets` a `true` para que los _bundles_ resultantes autocontengan todos los _assets_ o artefactos de los que dependen, y generar de esta forma, _bundles_ únicos. Esto nos va a facilitar la descarga de las microapps desde aplicaciones _host_, puesto que descargaremos un único paquete.

✅ **CHECKPOINT**

`[microapp-clock]`

- Probemos a generar una build y comprobaremos los 2 bundles disponibles:

  ```text
  npm run build:dev
  ```

  > 🔍 Inspeciona el bundle generado `clock-microapp.js`, si formateas el contenido y haces scroll hasta el final del fichero, verás como webpack ha dejado nuestro `MicroappInterface` en una variable `window.microappClock`, tal cual hemos configurado en `webpack.common.js`.

- También podemos arrancar nuestra aplicación en modo _standalone_ y ver que funciona como se espera:

  ```text
  npm start
  ```

## ⌨ Te toca

Repite el mismo proceso para el proyecto `microapp-quote` y asegurate que:

- Se genera un _bundle_ `quote-microapp.js`.
- La aplicación puede levantarse como _standalone_ sin problemas.
