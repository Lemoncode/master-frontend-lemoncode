# Microfrontends - Enrutado y _lazy loading_

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `03-runtime-basico`.

### Objetivo

Consumir los microfrontends en diferentes páginas de nuestra aplicación _host_ (enrutado) haciendo, además, como medida de optimización, que solo sean descargados y renderizados cuando se necesiten (_lazy loading_). En este paso solo modificaremos el proyecto `host`.

## Enrutado

- El objetivo es modificar ligeramente nuestro dashboard de modo que cada microapp se muestre en una página independiente. Para ello tendremos que añadir:

  - Un router.
  - Un par de rutas para cada microapp (además de la ruta _home_).
  - Una pequeña barra de navegación para cambiar de página.

  Vayamos paso a paso.

`[host]`

- Necesitamos instalar nuestra dependencia para el router, y por comodidad, sus tipos también:

  ```text
  npm i react-router-dom@6.x
  npm i -D @types/react-router-dom@6.x
  ```

`[host] components/dashboard.component.tsx`

- Como primer paso eliminamos la carga de las microapps en la página principal. A partir de ahora queremos mostrar cada microapp en su página correspondiente.

  ```diff
    import React from "react";
    import { css } from "@emotion/css";
    import WorldImage from "../assets/img/world.svg";
  - import { MicroappLoader } from "../core";
    ...
    export const Dashboard: React.FC = () => {
      const [name] = React.useState("Dashboard");

      return (
        <main className={styles.container}>
          <div className={styles.header}>
            <img src={WorldImage} className={styles.image} />
            <h1 className={styles.title}>{`Welcome to my ${name}!`}</h1>
          </div>
  -       <MicroappLoader microapp="MicroappClock" />
  -       <MicroappLoader microapp="MicroappQuote" />
        </main>
      );
    };
  ```

`[host] core/routes.ts`

- Vamos a definir las rutas para sendos microfrontends:

  ```text
  [CREATE] core/routes.ts
  ```

  ```ts
  export const routes = {
    home: "/",
    clock: "/clock",
    quote: "/quote",
  };
  ```

`[host] core/index.ts`

- Actualizamos el barrel:

  ```diff
  export * from "./microapp-loader.component";
  + export * from "./routes";
  ```

`[host] app.router.tsx`

- Y ahora creemos el router:

  ```text
  [CREATE] app.router.tsx
  ```

  ```tsx
  import React from "react";
  import { HashRouter, Routes, Route } from "react-router-dom";
  import { MicroappLoader, routes } from "./core";
  import { Dashboard } from "./components";

  export const AppRouter: React.FC = () => {
    return (
      <HashRouter>
        <Routes>
          <Route path={routes.home} element={<Dashboard />} />
          <Route path={routes.clock} element={<MicroappLoader microapp="clock" />} />
          <Route path={routes.quote} element={<MicroappLoader microapp="quote" />} />
        </Routes>
      </HashRouter>
    );
  };
  ```

`[host] app.entrypoint.tsx`

- Y este será el componente que rendericemos en nuestro `app.entrypoint`:

  ```diff
    import "./app.styles";
    import React from "react";
    import ReactDOM from "react-dom";
  + import { AppRouter } from "./app.router";

  + const App: React.FC = () => <AppRouter />;

    ReactDOM.render(<App />, document.getElementById("root"));
  ```

`[host]`

- Lo único que nos quedaría es tener una barra de navegación con enlaces para poder navegar entre las diferentes páginas de nuestro _dashboard_. Implementémoslo:

  ```text
  [CREATE]
  components/app-frame.component.tsx
  ```

`[host] components/app-frame.component.tsx`

- Una posible implementación sencilla sería esta:

  ```ts
  import React from "react";
  import { css } from "@emotion/css";
  import { Link } from "react-router-dom";
  import { routes } from "../core";

  const styles = {
    container: css`
      margin: 2rem 1rem;
      display: grid;
      grid-auto-flow: column;
      grid-gap: 2rem;
      justify-content: center;
      align-items: center;
      font-family: Montserrat, sans-serif;
      font-size: 1.25rem;
    `,
  };

  export interface AppFrameProps {
    children?: React.ReactNode;
  }

  export const AppFrame: React.FC<AppFrameProps> = ({ children }) => {
    return (
      <>
        <div className={styles.container}>
          <Link to={routes.home}>Home</Link>
          <Link to={routes.clock}>Clock</Link>
          <Link to={routes.quote}>Quote</Link>
        </div>
        {children}
      </>
    );
  };
  ```

`[host] components/index.ts`

- No olvidemos actualizar el barrel por comodidad:

  ```diff
    export * from "./dashboard.component";
  + export * from "./app-frame.component";
  ```

`[host] app.router.tsx`

- Finalmente, usamos nuestro `app-frame` para envolver toda la aplicación y tener disponible siempre un 'marco' con navegación:

  ```diff
    import React from "react";
    import { HashRouter, Routes, Route } from "react-router-dom";
    import { MicroappLoader, routes } from "./core";
  + import { AppFrame, Dashboard } from "./components";

    export const AppRouter: React.FC = () => {
      return (
        <HashRouter>
  +       <AppFrame>
            <Routes>
              <Route path={routes.home} element={<Dashboard />} />
              <Route path={routes.clock} element={<MicroappLoader microapp="MicroappClock" />} />
              <Route path={routes.quote} element={<MicroappLoader microapp="MicroappQuote" />} />
            </Routes>
  +       </AppFrame>
        </HashRouter>
      );
    };
  ```

`[host]`

- ✅ **CHECKPOINT**: Ya estamos terminados, comprobemos el resultado:

  ```text
  npm start
  ```

  > 🛂 Recuerda: `microapp-clock` y `microapp-quote` deben estar arrancados.

  > 🔍 **Comprueba** como y cuando se realiza la descarga de las microapps ahora que tenemos diferentes páginas. Se pone claramente de manifiesto lo ineficiente que resulta hacer una carga de todos los _bundles_ de las microapps al principio, sin saber siquiera si vamos a necesitarlos o no.

### Conclusión

Este ejemplo es sencillo y las microapps son ligeras y poco numerosas. Pero si imaginamos un proyecto con decenas de microapps repartidas por diferentes páginas, se ve claramente que hacer una carga de todas ellas al principio penalizaría mucho el tiempo inicial de arranque de la aplicación _host_ y no aporta realmente nada ya que muchos de esos microfrontends puede que no lleguen a visualizarse nunca (dependerá de la navegación que siga el usuario).

Lo más óptimo sería cargar cada microapp cuando realmente se necesita, es decir, cuando vaya a renderizarse. En nuestro caso, esto sucederá a medida que navegamos entre páginas. Para ello vamos a plantear cargas _lazy_ en el siguiente apartado.

## _Lazy loading_

Hay distintas soluciones para implementar _lazy loading_ de los microfrontends en _runtime_. Podemos diferenciarlas en 2 variantes:

- Hacer responsable a cada microfrontend de su propia carga asíncrona. En esta aproximación podemos recurrir a una _feature_ de webpack llamada _code-splitting_ que nos permite 'trocear' un determinado _bundle_ en sub-paquetes e indicar cuales de estos sub-paquetes queremos que sean cargados de forma asíncrona, sólo cuando se necesiten. Inconvenientes: hay que implementarlo en cada microfrontend y además dependemos de webpack. Ventajas: es una solución probada y estable.
- Hacer responsable a la aplicación _host_ de gestionar la carga 'perezosa' para cualquier microfrontend. La ventaja es que proporcionamos libertad a los microfrontends y evitamos que tengan que depender forzosamente de una tecnología de terceros (webpack en este caso). Además, al ser una solución "a medida" podemos adaptarla a nuestras necesidades en cada momento. Como desventaja, nos toca mantenerla, eso si.

Tomaremos la segunda solución y modificaremos nuestro `MicroappLoader` para dotarle de capacidad de carga _lazy_.

`[host] index.html`

- Vamos a ampliar la responsabilidad de nuestro `MicroappLoader` para que, previo al renderizado, descargue cada microapp de su ubicación original. Pero antes, un cambio importante:

  > ⚡ Recordemos ¿por qué se están cargando nuestros bundles de forma síncrona en cuanto arranca la aplicación? Porque los pusimos como `<scripts>` en nuestro html.

- No queremos ese comportamiento ¿cierto? Queremos gestionar nosotros mismos cuando se van a cargar esos bundles, asi pues, lo primero que haremos es eliminar los scripts del index.html.

  ```diff
    ...
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <title>Host</title>

  -   <!-- Microapp scripts -->
  -   <script src="http://localhost:3001/clock-microapp.js" type="text/javascript"></script>
  -   <script src="http://localhost:3002/quote-microapp.js" type="text/javascript"></script>

    </head>
    ...
  ```

`[host] core/microapp.registry.ts`

- Si nuestro `MicroappLoader` se va a responsabilizar ahora de la descarga, debe saber la ubicación de cada microapp. Completemos nuestro _registry_ de la siguiente manera:

  ```diff
    // Tipado común de la interfaz de Microapps.
    export interface MicroappInterface {
      render: (container: HTMLElement) => void;
      unmount: (container?: HTMLElement) => void;
    }

    // Registro de microapps disponibles con sus settings correspondientes.
    export interface MicroappSettings {
  +   bundleUrl: string;
      getInterface: () => MicroappInterface;
    }

    export type RegisteredMicroapp = "clock" | "quote";

    export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
      clock: {
  +     bundleUrl: 'http://localhost:3001/clock-microapp.js',
        getInterface: () => window["microappClock"],
      },
      quote: {
  +     bundleUrl: 'http://localhost:3002/quote-microapp.js',
        getInterface: () => window["microappQuote"],
      },
    };
  ```

`[host] core/microapp-loader.component.ts`

- Finalmente, hagamos que `MicroappLoader` tome la responsabilidad de poner en marcha la carga asíncrona de los _bundles_, ubicados en sus respectivas URLs. En definitiva, vamos a hacer lo mismo que hacíamos en nuestro `index.html` anteriormente, pero de manera programática, es decir, añadiremos por código un tag `<script>` en el DOM:

  ```diff
    import React from "react";
    import { RegisteredMicroapp, microappRegistry } from "./microapp.registry";

    // Componente Microapp Render
    export interface MicroappLoaderProps {
      microapp: RegisteredMicroapp;
    }

    export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
      const containerRef = React.useRef<HTMLDivElement>();

      React.useEffect(() => {
        if (!microappRegistry[microapp]) return;

  +     // Accedemos al registry
  +     const { bundleUrl, getInterface } = microappRegistry[microapp];

  +     // Creamos <script> para descarga del bundle
  +     const script = document.createElement("script");
  +     script.src = bundleUrl;
  +     script.type = "text/javascript";
  +     script.onload = () => getInterface().render(containerRef.current);
  +     document.body.appendChild(script);

        return () => getInterface().unmount(containerRef.current);
      }, [microapp]);

      return <div ref={containerRef} />;
    };
  ```

✅ **CHECKPOINT**

`[host]`

- Con esta implementación básica, ya podemos poner en marcha nuestra aplicación. Veamos que sucede:

  ```text
  npm start
  ```

  > 🛂 Recuerda: `microapp-clock` y `microapp-quote` deben estar arrancados.

  > 🔍 **Comprueba** como esta implementación básica trae algunos problemas. ¿Qué pasa cuando navegas varias veces entre páginas? La descarga se vuelve a hacer una y otra vez, porque estamos añadiendo nuevos elementos `<script>` en `<body>` continuamente. No estamos comprobando si ya lo teníamos descargado de antes o no.

## Refinamiento

`[host] core/microapp-loader.component.ts`

- Para un comportamiento más refinado y óptimo, deberiamos detectar qué microapps hemos cargado previamente y cuales no. De este modo, evitaremos añadir `<script>` redundantes y por tanto evitaremos descargar los _bundles_ que ya habíamos descargado previamente.

- Para saber si un _bundle_ ha sido cargado, podemos utilizar los interfaces almacenados en el objeto `window` como si de una caché se tratara, es decir, comprobaremos si la interfaz del microfrontend está disponible en `window` (_bundle_ cargado) o no (_bundle_ pendiente de cargar).

- **NOTA**: En esta versión refinada hemos tenido en cuenta un posible caso _edge_ problemático: la descarga fallida del _bundle_. En tal caso vamos a hacer limpieza del tag `<script>` que se añadiría con cada intento fallido, pues de lo contrario dejaríamos 'sucio' nuestro HTML.

  ```diff
      import React from "react";
      import { RegisteredMicroapp, microappRegistry } from "./microapp.registry";

      // Componente Microapp Render
      export interface MicroappLoaderProps {
        microapp: RegisteredMicroapp;
      }

      export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
        const containerRef = React.useRef<HTMLDivElement>();

        React.useEffect(() => {
          if (!microappRegistry[microapp]) return;

          // Accedemos al registry
          const { bundleUrl, getInterface } = microappRegistry[microapp];

  +       if (!getInterface()) {
  +         // Todavía no hemos descargado el bundle, creamos <script>
  +         const script = document.createElement("script");
  +         script.src = bundleUrl;
  +         script.type = "text/javascript";
  +         script.onload = () => getInterface().render(containerRef.current);
  +         script.onerror = () => script.remove();
  +         document.body.appendChild(script);
  +       } else {
  +         // Bundle descargado previamente, pero no montado todavía
  +         getInterface().render(containerRef.current);
  +       }

          return () => getInterface().unmount(containerRef.current);
        }, [microapp]);

        return <div ref={containerRef} />;
      };
  ```

✅ **CHECKPOINT**

`[host]`

- Comprobemos como la versión mejorada elimina los problemas mencionados anteriormente:

  ```text
  npm start
  ```

  > 🛂 Recuerda: `microapp-clock` y `microapp-quote` deben estar arrancados.
