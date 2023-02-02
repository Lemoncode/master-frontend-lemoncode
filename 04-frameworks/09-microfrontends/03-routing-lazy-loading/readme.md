# Microfrontends - Enrutado y _lazy loading_

## Punto de partida

> Partiremos de la solución en la carpeta `02-runtime-basico`.

## Enrutado

- El objetivo es modificar ligeramente nuestro dashboard de modo que cada microapp se muestre en una página independiente. Tendremos que añadir:

  - Un router.
  - Un par de rutas para cada microapp (además de la ruta _home_).
  - Una pequeña barra de navegación para cambiar de página.

  Vayamos paso a paso.

`[app]`

- Necesitamos instalar nuestra dependencia para el router, y por comodidad, sus tipos también:

  ```text
  npm i react-router-dom@6.x
  npm i -D @types/react-router-dom@6.x
  ```

- Ahora que añadimos complejidad, vamos a estructurar mejor nuestro proyecto maestro, creando carpeta para los `pods` y para código `core`

  ```text
  [CREATE]
  pods/
  pods/dashboard
  core/
  ```

- Movemos nuestro `dashboard` a su carpeta, y también el componente `microapp-render.component` a core. Creamos barrels para ellos:

  ```text
  [MOVE] dashboard.component.tsx -> pods/dashboard/dashboard.component.tsx
  [CREATE] pods/dashboard/index.ts

  [MOVE] microapp-render.component.tsx -> core/microapp-render.component.tsx
  [CREATE] core/index.ts
  ```

`[app] pods/dashboard/dashboard.component.tsx`

- Arreglamos el import del svg y eliminamos las microapps de aqui. Ahora no se van a mostrar en el dashboard sino en páginas separadas.

  ```diff
  import React from "react";
  import { css } from "emotion";
  + import WorldImage from "../../assets/img/world.svg";
  - import { MicroappRender } from "./microapp-render.component";

  ...

  export const Dashboard: React.FC = () => {
    const [name] = React.useState("Dashboard");

    return (
      <main className={styles.container}>
        <div className={styles.header}>
          <img src={WorldImage} className={styles.image} />
          <h1 className={styles.title}>{`Welcome to my ${name}!`}</h1>
        </div>
  -      <MicroappRender microapp="MicroappClock" />
  -      <MicroappRender microapp="MicroappQuote" />
      </main>
    );
  };
  ```

`[app] core/routes.ts`

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

`[app] core/index.ts`

```diff
export * from "./microapp-render.component";
+ export * from "./routes";
```

`[app] app.router.tsx`

- Y ahora creemos el router:

  ```text
  [CREATE] app.router.tsx
  ```

  ```tsx
  import React from "react";
  import { HashRouter, Routes, Route } from "react-router-dom";
  import { MicroappRender, routes } from "./core";
  import { Dashboard } from "./pods/dashboard";

  export const AppRouter: React.FC = () => {
    return (
      <HashRouter>
        <Routes>
          <Route path={routes.home} element={<Dashboard />} />
          <Route path={routes.clock} element={<MicroappRender microapp="MicroappClock" />} />
          <Route path={routes.quote} element={<MicroappRender microapp="MicroappQuote" />} />
        </Routes>
      </HashRouter>
    );
  };
  ```

`[app] app.entrypoint.tsx`

- Y este será el componente que rendericemos en nuestro `app.entrypoint`:

  ```diff
  import "./app.styles";
  import React from "react";
  import ReactDOM from "react-dom";
  + import { AppRouter } from "./app.router";

  + const App: React.FC = () => <AppRouter />;

  ReactDOM.render(<App />, document.getElementById("root"));
  ```

`[app] pods/app-frame`

- Lo único que nos quedaría es tener una barra de navegación con enlaces para poder navegar entre las diferentes páginas de nuestro _dashboard_. Implementémoslo:

  ```text
  [CREATE]
  pods/app-frame
  pods/app-frame/index.ts
  pods/app-frame/app-frame.component.tsx
  ```

`[app] pods/app-frame/app-frame.component.tsx`

- Una posible implementación sencilla sería esta:

  ```ts
  import React from "react";
  import { css } from "@emotion/css";
  import { Link } from "react-router-dom";
  import { routes } from "../../core";

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

`[app] pods/app-frame/index.ts`

- No olvidemos el barrel por comodidad:

  ```ts
  export * from "./app-frame.component";
  ```

`[app] app.router.tsx`

- Finalmente, usamos nuestro `app-frame` para envolver toda la aplicación y tener disponible siempre un 'marco' con navegación:

  ```diff
  import React from "react";
  import { HashRouter, Routes, Route } from "react-router-dom";
  import { MicroappRender, routes } from "./core";
  + import { AppFrame } from "./pods/app-frame";
  import { Dashboard } from "./pods/dashboard";

  export const AppRouter: React.FC = () => {
    return (
      <HashRouter>
  +     <AppFrame>
          <Routes>
            <Route path={routes.home} element={<Dashboard />} />
            <Route path={routes.clock} element={<MicroappRender microapp="MicroappClock" />} />
            <Route path={routes.quote} element={<MicroappRender microapp="MicroappQuote" />} />
          </Routes>
  +     </AppFrame>
      </HashRouter>
    );
  };

  ```

`[app]`

- ✅ **CHECKPOINT**: Ya estamos terminados, comprobemos el resultado:

  ```text
  npm start
  ```

### Conclusión

Ahora que tenemos distintas páginas, se pone claramente de manifiesto lo ineficiente que resulta hacer una carga de todas los microapps al principio.

Este ejemplo es sencillo y las microapps son ligeras y poco numerosas. Pero si imaginamos un proyecto con decenas de microapps repartidas por diferentes páginas, se ve claramente que hacer una carga de todas ellas al principio penalizaría mucho el tiempo inicial de carga y no aporta realmente nada ya que muchos de esos microfrontends puede que ni lleguen a visualizarse nunca (dependerá de la navegación que siga el usuario).

Lo más eficiente sería cargar cada microapp cuando realmente se necesita, es decir, cuando vaya a renderizarse. En nuestro caso, esto sucederá a medida que navegamos entre páginas. Para ello vamos a plantear cargas 'lazy' en el siguiente apartado.

## Lazy loading

Hay distintas soluciones para implementar _lazy loading_ de los microfrontends en _runtime_. Podemos diferenciarlas en 2 variantes:

- Hacer responsable a cada microfrontend de su propia carga asíncrona. En esta aproximación podemos recurrir a una _feature_ de webpack llamada _code-splitting_ que nos permite 'trocear' un determinado _bundle_ en sub-paquetes e indicar cuales de estos sub-paquetes queremos que sean cargados de forma asíncrona, sólo cuando se necesiten. Inconvenientes: hay que implementarlo en cada microfrontend y además dependemos de webpack. Ventajas: es una solución probada y estable.
- Hacer responsable a la aplicación _host_ de gestionar la carga 'perezosa' para cualquier microfrontend. La ventaja es que proporcionamos libertad a los microfrontends y evitamos que tengan que depender forzosamente de una tecnología de terceros (webpack en este caso). Además, al ser una solución "a medida" podemos adaptarla a nuestras necesidades en cada momento. Como desventaja, nos toca mantenerla, eso si.

Para este apartado tomaremos la segunda solución e implementaremos un cargador de microapps con _lazy-loading_ en nuestra aplicación _host_.

`[app] index.html`

- Recordemos ¿por qué se están cargando nuestros bundles de forma síncrona en cuanto arranca la app? Porque los pusimos como `<scripts>` en nuestro html.

- No queremos ese comportamiento ¿cierto? Queremos gestionar nosotros mismos cuando se van a cargar esos bundles, asi pues, lo primero que haremos es eliminar los scripts del index.html.

  ```diff
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>App</title>

  - <!-- Microapp scripts -->
  - <script src="microapps/clock.js" type="text/javascript"></script>
  - <script src="microapps/quote.js" type="text/javascript"></script>

  </head>
  ```

`[app] core/microapp-render.component.tsx`

- Renombramos el componente `MicroappRender` a `MicroappLoader` para enfatizar que ahora se encarga no solo del render sino de la carga vaga de cada microapp.

- También renombramos y simplificamos los microapps registrados, a algo más sencillo:

  ```text
  [File RENAME]
  microapp-render.component.tsx -> microapp-loader.component.tsx
  ```

  ```text
  [VSCode RENAME]
  MicroappRenderProps -> MicroappLoaderProps
  MicroappRender -> MicroappLoader
  ```

  ```diff
  [VSCode RENAME]
  + type RegisteredMicroapps = "clock" | "quote";
  ```

`[app] app.router.tsx`

- Nos aseguramos que el renombrado está aplicado en el router:

  ```diff
    import React from "react";
    import { HashRouter, Routes, Route } from "react-router-dom";
  + import { MicroappLoader, routes } from "./core";
    import { AppFrame } from "./pods/app-frame";
    import { Dashboard } from "./pods/dashboard";

    export const AppRouter: React.FC = () => {
      return (
        <HashRouter>
          <AppFrame>
            <Routes>
              <Route path={routes.home} element={<Dashboard />} />
  +           <Route path={routes.clock} element={<MicroappLoader microapp="clock" />} />
  +           <Route path={routes.quote} element={<MicroappLoader microapp="quote" />} />
            </Routes>
          </AppFrame>
        </HashRouter>
      );
    };
  ```

`[app] core/microapp.registry.ts`

- Vamos a aprovechar para hacer un pequeño refactor de nuestro `MicroappLoader`.

- Hasta ahora se encargaba exclusivamente de **buscar el interfaz en una variable global** y de **ejecutar su función `render()`**.

- Ahora, previo a este paso, tendrá un cometido nuevo. **Iniciar la carga asíncrona del propio bundle**.

- A tal efecto, vamos a definir en una estructura que llamaremos `microappRegistry` en la que registraremos las microapps disponibles para su consumo. Necesitamos conocer, principalmente, 2 datos:

  - La URL donde se aloja cada _bundle_.
  - El nombre de la variable que expone hacia afuera (`exportName`). Recordemos que webpack nos creaba una variable global a la que asignaba la entidad `MicroappInterface`.

  ```text
  [CREATE] core/microapp/microapp.registry.ts
  ```

  ```ts
  // Registro de microapps disponibles con sus settings de carga.
  export interface MicroappLoadSettings {
    bundleUrl: string;
    exportName: string;
  }
  export type RegisteredMicroapps = "clock" | "quote";

  export const microappRegistry: Record<RegisteredMicroapps, MicroappLoadSettings> = {
    clock: {
      bundleUrl: "microapps/clock.js",
      exportName: "MicroappClock",
    },
    quote: {
      bundleUrl: "microapps/quote.js",
      exportName: "MicroappQuote",
    },
  };
  ```

`[app] core/microapp.model.ts`

- Vamos a extraer el tipado de la interfaz a un fichero `model` por tenerlo más organizado.

  ```text
  [CREATE] core/microapp/microapp.model.ts
  ```

  ```ts
  // Tipado común de la interfaz de Microapps.
  export type MicroappRenderFunction = (container: Element) => void;
  export type MicroappUnmountFunction = (container: Element) => boolean;

  export interface MicroappInterface {
    render: MicroappRenderFunction;
    unmount: MicroappUnmountFunction;
  }
  ```

`[app] core/microapp-loader.component.ts`

- Eliminamos el código redundante y lo importamos de su nueva ubicación y remozamos la implementación de nuestro `MicroappLoader` para que tome la responsabilidad de poner en marcha la carga asíncrona de los _bundles_, ubicados en sus respectivas URLs:

  ```diff
  import React from "react";
  + import { MicroappInterface } from "./microapp.model";
  + import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

  - // Tipado común de la interfaz de Microapps.
  - type MicroappRenderFunction = (container: Element) => void;
  - type MicroappUnmountFunction = (container: Element) => boolean;

  - interface MicroappInterface {
  -  render: MicroappRenderFunction;
  -  unmount: MicroappUnmountFunction;
  - }

  - type RegisteredMicroapps = "clock" | "quote";

  // Componente Microapp Render
  export interface MicroappLoaderProps {
    microapp: RegisteredMicroapps;
  }

  export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
    const containerRef = React.useRef<HTMLDivElement>();

  + React.useEffect(() => {
  +   let microappInterface: MicroappInterface;
  +   const { bundleUrl, exportName } = microappRegistry[microapp] ?? {};
  +
  +   // Creamos <script> para descarga del bundle
  +   const script = document.createElement("script");
  +   script.src = bundleUrl;
  +   script.type = "text/javascript";
  +   script.onload = () => {
  +     microappInterface = window[exportName]?.MicroappInterface;
  +     microappInterface?.render(containerRef.current);
  +   };
  +   document.body.appendChild(script);

      return () => microappInterface?.unmount(containerRef.current);
    }, [microapp]);

    return <div ref={containerRef} />;
  };
  ```

`[app]`

- ✅ **CHECKPOINT**: Con esta implementación básica, ya podemos poner en marcha nuestra aplicación. Veamos que sucede:

  ```text
  npm start
  ```

### Conclusión

Esta implementación básica y primitiva de un posible loader trae algunos problemillas.

¿Qué pasa cuando navegas varias veces entre páginas? La descarga se vuelve a hacer una y otra vez, porque estamos añadiendo nuestro elemento `<script>` en `<body>` continuamente. No vigilamos si ya lo teníamos cargado de antes o no.

## Refinamiento

`[app] core/microapp-loader.component.ts`

- Para un comportamiento más refinado y óptimo, deberiamos detectar qué microapps hemos cargado previamente y cuales no. De este modo, evitaremos añadir `<script>` redundantes y por tanto descargar los _bundles_ que ya habíamos descargado previamente.

- Para saber si un _bundle_ ha sido cargado, usaremos el objeto `window` como si de una caché se tratara, es decir, comprobaremos si la variable nombrada con el `exportName` existe (y por tanto el `MicroappInterface` está disponible) o no.

- Aprovecharemos para hacer un pequeño refactor y extraer un poco de funcionalidad fuera:

  ```ts
  import React from "react";
  import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

  // Lógica de Negocio
  const isMicroappLoaded = (microapp: RegisteredMicroapps) =>
    Boolean(window[microappRegistry[microapp]?.exportName]);

  const downloadMicroapp = (microapp: RegisteredMicroapps): Promise<void> => {
    return new Promise((resolve, reject) => {
      const { bundleUrl } = microappRegistry[microapp] ?? {};
      if (bundleUrl) {
        const script = document.createElement("script");
        script.src = bundleUrl;
        script.type = "text/javascript";
        script.onload = () => resolve();
        script.onerror = () => {
          script.remove();
          reject();
        };
        document.body.appendChild(script);
      }
    });
  };

  const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) => {
    const { exportName } = microappRegistry[microapp] ?? {};
    if (exportName) window[exportName]?.MicroappInterface?.render(container);
  };

  const unmountMicroapp = (microapp: RegisteredMicroapps) => {
    const { exportName } = microappRegistry[microapp] ?? {};
    if (exportName) window[exportName]?.MicroappInterface?.unmount();
  };

  // Componente Microapp Loader
  export interface MicroappLoaderProps {
    microapp: RegisteredMicroapps;
  }

  export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
      if (!isMicroappLoaded(microapp)) {
        downloadMicroapp(microapp)
          .then(() => renderMicroapp(microapp, containerRef.current))
          .catch(() => console.error(`Error downloading microfrontend bundle for ${microapp}`));
      } else renderMicroapp(microapp, containerRef.current);

      return () => unmountMicroapp(microapp);
    }, [microapp]);

    return <div ref={containerRef} />;
  };
  ```

- **NOTA**: En esta versión refinada hemos tenido en cuenta un posible caso _edge_ problemático: la descarga fallida del _bundle_. En tal caso vamos a hacer limpieza del tag `<script>` que se añadiría con cada intento fallido, pues de lo contrario dejaríamos 'sucio' nuestro HTML.

`[app]`

- ✅ **CHECKPOINT**: Comprobemos como la versión mejorada elimina los problemas mencionados anteriormente:

  ```text
  npm start
  ```
