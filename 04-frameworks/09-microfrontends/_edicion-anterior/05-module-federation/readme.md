# Microfrontends - Federación de módulos

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `04-routing-lazy-loading`.

### Objetivo

Reproducir el mismo resultado, es decir, aplicación _host_ que consume dos microfrontends en tiempo de ejecución, pero haciendo uso de los módulos federados de `webapack`.

## Federación de módulos

La federación de módulos es una nueva _feature_ que incorpora `webpack` v5 explicitamente orientada hacia la arquitectura de microfrontends. Nos permitirá la descarga y ejecución de módulos en _runtime_ procedentes de otros _builds_ o aplicaciones. Además, las dependencias de un módulo federado también podrán ser federadas. Esto significa que, al consumirse un módulo federado, sus dependencias podrían ser proporcionadas por el _host_ que lo consume si dispone de una versión compatible. A su vez, el _host_ podría haber obtenido esas dependencias por si mismo (aportando las suyas propias), o incluso a través de otro módulo federado cargado previamente.

> ⚡ En resumen, la federación de módulos permite disponer de un _pool_ de módulos (ya sean paquetes nuestros o dependencias 3rd party) distribuidos en diferentes ubicaciones y accesibles por una aplicación que quiera hacer uso de ellos en tiempo de ejecución. `Webpack` se encarga de orquestar estos módulos y optimizar su descarga.

### Conceptos

Un módulo de webpack no es más que código empaquetado en un _bundle_. Un módulo federado, es un _bundle_ que puede ser consumido en _runtime_ desde otros _builds_ distintos, y por tanto desde otras aplicaciones diferentes. El código federado puede cargar sus dependencias propias, pero intentará utilizar primero las dependencias que proporciona aquel que lo consuma, y de este modo minimizamos la descarga de código redundante.

La clave está en entender que, a partir de ahora, cada _build_ que construyamos no será un único _bundle_ monolítico, sino una composición de módulos federados, cada uno en un _bundle_ independiente, junto con las dependencias que se quieran compartir. Webpack hace uso de su _feature_ de `code-splitting` para proporcionar tal partición, y entiende el resultado de cada _build_ como un **contenedor de módulos federados y dependencias 'compartibles'**.

Los contenedores tienen un punto de entrada, un _bundle_ especial (normalmente llamado _container_) encargado de describir todos los módulos federados disponibles en esa _build_. Además, incorporan un pequeño _runtime_ a modo de capa de orquestación que se encarga principalmente de poner en marcha la descarga de los módulos federados y sus dependencias, en aquella aplicación que los consuma. En definitiva, un _container_ es la puerta de entrada al consumo de módulos federados por otras aplicaciones.

Como resumen, en la terminología de webpack, diremos que:

- Una _build_ es la composición de módulos federados (más aquellos que no lo están) que resulta al compilar una aplicación. Por lo tanto, es el artefacto de salida de una aplicación compilada.
- Entre los módulos resultantes de una _build_ está el _container_ que actúa como mapa de nuestra _build_.
- Se dice que una aplicación es _**host**_ (y por tanto su _container_ también) cuando es la primera que se carga.
- Cuando este contenedor _**host**_ necesita y consume un módulo federado de otro contenedor, diremos que este segundo es un contenedor **remoto** para el primero.
- Pero además, el contenedor **remoto** podría necesitar también algún módulo federado que ofrece _**host**_, en cuyo caso se diría que ambos son contenedores **bidireccionales**. Las dependencias circulares son posibles y están contempladas en esta arquitectura de módulos federados.

## Adaptando las microapps

Se requieren algunos cambios sencillos para adaptar las microapps a la nueva _feature_ de federación de módulos. Vayamos paso a paso:

`[microapp-clock] config/webpack.common.js`

- En primer lugar, ya no vamos a generar manualmente nuestro _chunk_/_bundle_ `microapp` de forma manual. Vamos a dejar que `webpack` se encargue de federar los módulos necesarios. Por tanto lo eliminamos:

  ```diff
    entry: {
      app: ["./app.entrypoint.tsx"],
  -   // Nuevo bundle para ser consumido como microapp
  -   microapp: {
  -     import: "./microapp.entrypoint.tsx",
  -     // Webpack expondrá el contenido de MicroappInterface en window.microappClock
  -     library: {
  -       type: "window",
  -       name: "microappClock",
  -       export: "MicroappInterface",
  -     },
  -  },
    },
  ```

- Y dejamos que la inyección de _chunks_ en el html la gestione automáticamente webpack:

  ```diff
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      hash: true,
  -   chunks: ["app"],
    }),
  ```

- Además, vamos a habilitar un _setting_ crítico para evitar [la colisión entre módulos de diferentes contenedores remotos](https://webpack.js.org/concepts/module-federation/#collision-between-modules-from-different-remotes) que compartan el mismo nombre. Esto sucede, en nuestro caso, al llamar con el mismo nombre a los ficheros _entrypoint_ de diferentes _microapps_.

  ```diff
    output: {
      // Ruta para depositar los artefactos de salida.
      path: helpers.buildPath,
      // Nombre para los bundles de salida.
      filename: `${helpers.projectName}-[name].js`,
      // Nombre para los assets de salida.
      assetModuleFilename: "assets/[name].[ext]",
  +   // ⚠ Crítico para evitar colisión entre módulos de diferentes contenedores
  +   // remotos. Establece una especie de namespace para los modulos federados.
  +   uniqueName: helpers.projectName,
    },
  ```

- Finalmente, habilitamos y configuramos el plugin que permite la federación de módulos:

  ```diff
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  + const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
    const helpers = require("./helpers");

    ...

    plugins: [
  +   new ModuleFederationPlugin({
  +     name: "container",
  +     // filename: "clock-container.js",
  +     exposes: {
  +       "./widget": "./microapp.entrypoint",
  +     },
  +     shared: ["react", "react-dom/client", "@emotion/css"],
  +   }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
        hash: true,
      }),
      ...
    ],
  ```

- **¿Qué estamos haciendo aqui?**

  - `name`: Asignamos un nombre a nuestro contenedor. Recordemos que un contenedor no es más que una _build_ conformada por sus módulos federados y dependencias compartidas. Este `name` actúa como alias para poder referirnos al contenedor desde otra aplicación.
  - `filename`: Este será el nombre del fichero o _bundle_ específico que actúa como contenedor.
  - `exposes`: Esta es la forma de indicar a `webpack` que módulos queremos federar o exponer. No es más que un mapa clave/valor:
    - clave: alias o _friendly name_ que asignamos al módulo que se federa. Así será llamado desde fuera.
      > 🛑 **IMPORTANTE**: debería bastar un string simple, por ejemplo `widget` [pero esto es problemático](https://webpack.js.org/concepts/module-federation/#uncaught-error-module-button-does-not-exist-in-container) y debe escribirse asi: `'./widget'`.
    - valor: aquí apuntamos al fichero del módulo que vamos a federar.
  - `shared`: Lista de dependencias a compartir. Esto implica que las dependencias listadas podrán ser "aportadas" a otros módulos o "recibidas" de otros contenedores, siempre que sean compatibles.

✅ **CHECKPOINT**

`[microapp-clock]`

- En primer lugar, lanzamos una compilación de la microapp para comprobar el resultado:

  ```text
  npm run build:dev
  ```

  > 🔍 Inspecciona la carpeta `build` y comprueba todos los _bundles_ que se han generado como parte de este contenedor:
  >
  > - `clock-container.js`: _bundle_ especial que representa nuestro contenedor. Lista todos los módulos federados y sus dependencias y contiene el _runtime_ necesario para orquestar todo el sistema federado durante la ejecución.
  > - `clock-app.js`: Este sería el _bundle_ normal de nuestra aplicación en modo _standalone_, sin federar, aunque con las dependencias federadas extraidas.
  > - `clock-microapp_entrypoint_tsx.js`: Módulo federado que hemos generado con el alias `widget`.
  > - `clock-vendors-node_modules_<xxx>.js`: Vemos como ha generado también _bundles_ independientes para las dependencias que vamos a compartir. Estos _bundles_ actuarán como fallback, si un módulo federado no puede obtener sus dependencias de quien le está consumiendo, descargará estos _bundles_.

- Pues estamos listos, ¡prueba de fuego!:

  ```text
  npm start
  ```

  ... y boom 💥. No arranca. Fijémonos en el error de la consola:

  > Shared module is not available for eager consumption webpack/sharing/consume/default/xxxx/xxxx

### _Eager consumption_

- El error `eager consumption` es habitual al trabjar con la federación de módulos y nos indica que se está intentando cargar alguna de las dependencias compartidas de forma "ansiosa". ¿Qué significa esto?

- Al compartir dependencias, podríamos recibirlas de otros contenedores, u ofrecérselas a otros módulos que las necesiten. Para que esto sea posible, `webpack` las extrae en _bundles_ separados que, además, **se van a cargar de forma asíncrona**.

- Asi pues, cuando nuestra aplicación se pone en marcha, dispara la descarga de las dependencias que necesita, pero al ser este proces asíncrono, podría resultar que cuando la aplicación las requiera todavía no estén disponibles. Se da por tanto una condición de carrera puesto que la aplicación si se carga de forma síncrona, mientras que sus dependencias son asíncronas.

`[microapp-clock] bootstrap.entrypoint.tsx`

- ¿Cómo se resuelve este problema? Haciendo que nuestra aplicación también se cargue de forma asíncrona, con el uso de un sencillo `bootstrap`, que no es más que un nuevo _entrypoint_ que utiliza un import dinámico (_lazy loading_):

  ```text
  [CREATE]
  bootstrap.entrypoint.tsx
  ```

  ```tsx
  import("./app.entrypoint");
  ```

`[microapp-clock] config/webpack.common.js`

- Y sustituimos el entrypoint de la aplicación por el nuevo bootstrap:

  ```diff
    ...
    entry: {
  +   app: ["./bootstrap.entrypoint.tsx"],
      // Nuevo bundle para ser consumido como microapp
      microapp: {
        import: "./microapp.entrypoint.tsx",
    ...
  ```

✅ **CHECKPOINT**

`[microapp-clock]`

- Ahora si:

  ```text
  npm start
  ```

## ⌨ Te toca

Repite el mismo proceso para el proyecto `microapp-quote`

## Adaptando la aplicación _host_

`[host] bootstrap.entrypoint.tsx`

- Como primer paso, añadamos también la solución de _bootstrapping_ para evitar el _eager consumption_:

  ```text
  [CREATE]
  bootstrap.entrypoint.tsx
  ```

  ```tsx
  import("./app.entrypoint");
  ```

`[host] config/webpack.common.js`

- Y actualizamos el entrypoint en `webpack`:

  ```diff
    ...
    entry: {
  +   app: ["./bootstrap.entrypoint.tsx"],
    },
    ...
  ```

- Ahora, al igual que en las _microapps_, dejamos que `webpack` gestione la inyección de _chunks_ en el `index.html`:

- Y por último, configuramos el plugin para la federación de módulos:

  ```diff
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  + const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
    const helpers = require("./helpers");

    ...

    plugins: [
  +   new ModuleFederationPlugin({
  +     // name: "container",
  +     remotes: {
  +       clock: "container@http://localhost:3001/clock-container.js",
  +       quote: "container@http://localhost:3002/quote-container.js",
  +     },
  +     shared: ["react", "react-dom/client", "react-router-dom", "@emotion/css"],
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
        hash: true,
  -     chunks: ["app"],
      }),
      ...
    ],
  ```

  **¿Qué estamos haciendo aqui?**

  - `remotes`: Estamos indicando a que contedores **remotos** queremos tener acceso para consumir alguno de sus módulos federados. Esto hará que webpack ponga en marcha la descarga de estos contenedores en cuanto arranque la aplicación _host_, y de este modo, se creará un contexto en tiempo de ejecución con acceso a todos los módulos federados que vamos a consumir.
  - `shared`: Igual que antes, son las dependencias compartidas, que en este caso ofreceremos como reemplazo de aquellas que necesitan los módulos federados que consumiremos.

### Consumiendo módulos federados

`[host] core/microapp.registry.ts`

- Ahora llega la pregunta clave, ¿cómo consumo un módulo federado desde código? **Necesitamos importarlo de forma dinámica, con la sintaxis de import dinámico de webpack**.

  > 🛑 IMPORTANTE: **Esta sintáxis debe aparecer de forma explícita** ya que `webpack` hace un análisis estático del código. No vale interpolar el nombre del módulo que queremos importar.

- A tal efecto vamos a modificar nuestro registro de microapps del siguiente modo:

  ```diff
    // Registro de microapps disponibles con sus settings correspondientes.
    export interface MicroappSettings {
  -   bundleUrl: string;
  +   getInterface: () => Promise<MicroappInterface>;
    }

    export type RegisteredMicroapp = "clock" | "quote";

    export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
      clock: {
  -     bundleUrl: "http://localhost:3001/clock-microapp.js",
  +     getInterface: () => import("clock/widget").then(unwrapMicroappInterface),
      },
      quote: {
  -     bundleUrl: "http://localhost:3002/quote-microapp.js",
  +     getInterface: () => import("quote/widget").then(unwrapMicroappInterface),
      },
    };

  + const unwrapMicroappInterface = ({ MicroappInterface }) => MicroappInterface;
  ```

- 💥 Un módulo federado remoto se identifica con ambos alias `contenedor/módulo`. Sin embargo, TS no puede localizar este módulo en el código fuente ni en `node_modules` puesto que no existe, se resolverá en _runtime_. Para evitar este error de TS tenemos algunas soluciones:

  - **Solución IDEAL**: usar el plugin `@module-federation/typescript`. No lo estamos usando por mantener simple la configuración.

  - **Alternativa**: hacer a mano lo que hace este plugin. Podríamos declarar nosotros mismos los tipos de los módulos federados remotos que queremos consumir:

    `[host] core/microapp.registry.d.ts`

    ```text
    [CREATE]
    core/microapp.registry.d.ts
    ```

    ```tsx
    import type { MicroappInterface } from "./microapp.registry";

    // Declaración de modulos federados
    declare module "clock/widget" {
      export const MicroappInterface: MicroappInterface;
      export default MicroappInterface;
    }

    declare module "quote/widget" {
      export const MicroappInterface: MicroappInterface;
      export default MicroappInterface;
    }
    ```

  - 3. **Solución práctica**: aseveración para salir del paso:

    `[host] core/microapp.registry.ts`

    ```ts
    import("clock/widget" as string);
    import("quote/widget" as string);
    ```

`[host] core/microapp-loader.component.tsx`

- Por último, nos queda adaptar nuestro `MicroappLoader`. Ya no necesitamos la funcionalidad de descarga basada en `<script>`, de esto se encargará `webpack`. Tan solo tenemos que llamar a la función `render` y `unmount` cuando sea necesario, dando por hecho que `webpack` se encarga de orquestar la carga de cada módulo:

  ```diff
    export const MicroappLoader: React.FC<MicroappLoaderProps> = ({ microapp }) => {
      const containerRef = React.useRef<HTMLDivElement>();

      React.useEffect(() => {
        if (!microappRegistry[microapp]) return;

        // Accedemos al registry
  +     const { getInterface } = microappRegistry[microapp];
  +
  +     // Renderizamos
  +     getInterface().then(({ render }) => render(containerRef.current));
  +
  +     // Desmontamos
  +     return () => {
  +       getInterface().then(({ unmount }) => unmount(containerRef.current));
  +     };
      }, [microapp]);

      return <div ref={containerRef} />;
    };
  ```

✅ **CHECKPOINT**:

`[host]`

- Pues ya estaría, ¡ejecutemos la solución!

  ```text
  npm start
  ```

  > 🛂 Recuerda: `microapp-clock` y `microapp-quote` deben estar arrancados.

  > 🔍 Inspecciona la carga de los _bundles_, Es importante ver como se orquesta todo en el tab _Network_ de las `devTools`:
  >
  > 1. Se descarga `host-app.js` que es el _bundle_ de nuestra aplicación _host_ y el único referenciado en nuestro `index.html`.
  > 2. La aplicación _host_ hace referencia a 2 contenedores remotos para su consumo en _runtime_. Por lo tanto, pone en marcha la descarga de dichos _containers_ remotos: `clock-container-js` y `quote-container.js`. Estos _bundles_ apenas suponen _overhead_ en el tiempo de carga incial ya que su peso es mínimo, pero son cruciales ya que su ejecución permite establecer un contexto en _runtime_ con todos los módulos federados de los que se puede hacer uso, asi como sus dependencias.
  > 3. De forma asíncrona, comienza la descarga y ejecución de nuestro `host-app_entrypoint`, que ahora estará segregado en un _bundle_ aparte debido al _bootstrapping_ para evitar _eager consumption_.
  > 4. En paralelo al punto anterior, comienza la descarga de todas las dependencias que la aplicación _host_ necesita para trabajar.
  > 5. ¿Qué sucede cuando navegamos? Cuando entramos en las páginas de Clock o Quote, se descargará y ejecutará el _bundle_ correspondiente del módulo federado ... pero ¡reutilizando las dependencias de la aplicación _host_! 🧙🏼‍♂️

## Histórico de problemas conocidos (TODOS ARREGLADOS)

### Error al desmontar microapp (`react` 18.2)

- Al navegar entre las rutas `/clock` y `/quote` procedemos a la carga y renderizado de una nueva microapp al tiempo que se desmonta la antigua. Con la versión 18.2 de `react` aparece el siguiente error:

  > ❌ Warning: Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition.

- Aparentemente es un falso positivo y este error [está reportado](https://github.com/facebook/react/issues/25675) a `react`.

  > A fecha de Enero-2023 no hay fix y/o solución.

### Error al navegar entre microapp (`react` < 18)

- Si realizamos numerosos cambios de página para provocar el montado y desmontado de las microapps, veremos que React muestra por consola errores referentes al renderizado.

- Esto sucede porque ahora tenemos una misma dependencia de `ReactDOM` siendo reusada por la aplicación _host_ y por los módulos federados, y esa misma instancia de `ReactDOM` está intentando renderizar tanto el `<div id="root">` de `app` como otros nodos que son descendientes de ese _root_: en este caso, los `<divs>` contenedores donde va cada `microapp`. **Esto no se debe hacer**. El nodo del DOM que pasamos a `ReactDOM.render()` debe ser siempre un nodo _top level_ (como los llama `react`) lo que significa que no debe pertenecer a un árbol de componentes previamente renderizado por dicha instancia de `ReactDOM`.

- La solución más sencilla consiste en reemplazar el actual _container_ que pasamos a las `microapps` por un nodo creado manualmente (con la API nativa del DOM). Al haber sido creado manualmente a bajo nivel, no formará parte del arbol de componentes de la instancia de `ReactDOM` y por tanto será un nodo _top level_.

`[host] core/microapp-loader.component.tsx`

- Aplicar el siguiente cambio:

  ```ts
  render(container.appendChild(document.createElement("div")));

  unmount(container.children?.[0]);
  container.children?.[0].remove();
  ```
