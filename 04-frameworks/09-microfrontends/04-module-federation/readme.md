# Microfrontends - Federación de módulos

## Punto de partida

> Partiremos de la solución en la carpeta `03-routing-lazy-loading`.

## Federación de módulos

La federación de módulos es una nueva feature que incorpora Webpack v5 explicitamente orientada hacia la arquitectura de microfrontends. Nos permitirá la descarga y ejecución de módulos en _runtime_ procedentes de otros _builds_ o _bundles_. Además, al consumirse un módulo federado, sus dependencias podrían ser compartidas, es decir, proporcionadas por el _build_ que lo consume si dispone de una versión compatible. En caso contrario, el módulo federado aportará las suyas propias.

Un módulo de webpack no es más que código empaquetado en un _bundle_. Un módulo federado, es un _bundle_ que puede ser consumido en _runtime_ desde otros _builds_ distintos, y por tanto desde otras aplicaciones diferentes. El código federado puede cargar sus dependencias propias, pero intentará utilizar primero las dependencias que proporciona aquel que lo consuma, y de este modo minimizamos la descarga de código redundante.

La clave está en entender que, a partir de ahora, cada _build_ que construyamos no será un único _bundle_ monolítico, sino una composición de módulos federados, cada uno en un _bundle_ independiente, junto con las dependencias que se quieran compartir. Webpack hace suo de su _feature_ de `code-splitting` para proporcionar tal partición, y entiende el resultado de cada _build_ como un **contenedor de módulos federados y dependencias 'compartibles'**.

Cada uno de estos contenedores ofrece módulos al mundo, pero también puede consumir módulos de otros contenedores. La forma en que webpack orquesta estas transferencias es mediante la generación de un _bundle_ específico (el contenedor propiamente dicho es también un _bundle_) que describirá cada módulo que se ha federado en un _build_, las dependencias que necesita consumir, y si requiere de otros módulos federados procedentes de otros contenedores. Este build además incorporará un pequeño _runtime_ (aplicación) a modo de capa de orquestación que se encargará de gestionar la búsqueda y carga de los módulos federados y sus dependencias.

Como resumen, en la terminología de webpack, diremos que:

- Un contenedor es la composición de módulos federados (más aquellos que no lo están) que resulta al compilar una aplicación. Por lo tanto, es el artefacto de salida de una aplicación compilada.
- Diremos que un contenedor (_build_) es el _**host**_ o anfitrión cuando es el primero que se carga.
- Cuando este contenedor _**host**_ necesita y consume un módulo federado de otro contenedor, diremos que este segundo es un contenedor **remoto** para el primero.
- Pero además, el contenedor **remoto** podría necesitar también algún módulo federado que ofrece _**host**_, en cuyo caso se diría que ambos son contenedores **bidireccionales**. Las dependencias circulares son posibles y están contempladas en esta arquitectura de módulos federados.

## Adaptando paso a paso los microfrontends

Se requieren de algunos cambios para adaptar las microapps a la nueva _feature_ de federación de módulos. Vayamos paso a paso:

- 🛑 **IMPORTANTE**: Vamos a hacer un renombrado del fichero `entrypoint`. Este cambio no debería no debería ser necesario, pero he encontrado algunos problemas de colisión de nombres debido a esto. La explicación es la siguiente:

  > Vamos a federar toda nuestra microapp, y por tanto le indicaremos a webpack que genere un módulo federado a partir de `microapp.entrypoint.tsx`. A este módulo federado le pondremos un nombre para identificarlo de cara al exterior. Sin embargo, su módulo interno será `microapp.entrypoint.tsx`, y resulta que este nombre de fichero también lo tendremos en el microfrontend `microapp-quote` y también sacaremos un módulo federado. De alguna forma parece `webpack` acaba resolviendo por el módulo interno y no por el nombre exterior, lo que hace que haya colisión.

  ```text
  [VSCode RENAME]
  microapp.entrypoint.ts -> microapp-clock.entrypoint.ts
  microapp.entrypoint.ts -> microapp-quote.entrypoint.ts
  ```

`[microapp-<clock|quote>] microapp-<clock|quote>.entrypoint.tsx`

- Puesto que vamos a federar toda nuestra `microapp`, haremos una exportación por defecto del `MicroappInterface` que va a ser el objeto que exponga nuestro módulo federado:

  ```diff
  ...

    export const MicroappInterface: MicroappInterface = {
      render: (container) => {
        root = createRoot(container);
        root?.render(<Microapp />);
      },
      unmount: () => root?.unmount(),
    };

  + export default MicroappInterface;
  ```

`[microapp-<clock|quote>] microapp.entrypoint.d.ts`

- [OPCIONAL] Aunque este paso no es estrictamente necesario puesto que no estamos consumiendo el tipado de las microapps desde el exterior, para mantener la consistencia, deberiamos actualizar también el fichero de tipos `d.ts`:

  ```diff
    ...

    export declare const MicroappInterface: MicroappInterface;
  + export default MicroappInterface;
  ```

`[microapp-<clock|quote>] config/microapp.js`

- Actualizamos el _entrypoint_ en la configuración de webpack:

  ```diff
  entry: {
  + [helpers.bundleName]: ["./microapp-clock.entrypoint.tsx"],
  },
  ```

  ```diff
  entry: {
  + [helpers.bundleName]: ["./microapp-quote.entrypoint.tsx"],
  },
  ```

- Hacemos también unos ajustes previos a la federación de módulos:

1. En primer lugar, no vamos a nombrar los chunks de los _entrypoint_ en `entry`, dejaremos que tome el nombre por defecto.
2. Además, desactivamos la cache para los _chunks_ generados `cache: false`.
3. Eliminamos los settings de libreria (`library`), dejamos que lo configure por defecto.
4. Ajustamos explícitamente `filename` (para el módulo inicial) y `chunkFilename` (para todos los módulos _splitted_). Le añadimos como prefijo el nombre de nuestro proyecto para distinguir fácilmente los ficheros de otros ficheros federados.

   ```tsx
     entry: "./microapp-<clock|quote>.entrypoint.tsx",
     cache: false,
     output: {
       path: helpers.buildMicroappPath,
       filename: `${helpers.bundleName}.js`,
       chunkFilename: `${helpers.bundleName}.[id].js`,
     },
   ```

- Pues bien, ahora sí, por fin, vamos a configurar nuestra federación de módulos. Añadimos el plugin:

  ```diff
  + const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  const CopyWebpackPlugin = require("copy-webpack-plugin");
  const helpers = require("./helpers");
  ```

- Y configuramos, añadiéndolo como nuevo plugin:

  ```tsx
    new ModuleFederationPlugin({
      name: "ClockContainer",
      filename: "clock-container.js",
      exposes: {
        "./ClockWidget": "./microapp-clock.entrypoint",
      },
      shared: ["react", "react-dom", "@emotion/css"],
    }),
  ```

  ```tsx
    new ModuleFederationPlugin({
      name: "QuoteContainer",
      filename: "quote-container.js",
      exposes: {
        "./QuoteWidget": "./microapp-quote.entrypoint",
      },
      shared: ["react", "react-dom", "@emotion/css"],
    }),
  ```

¿Qué estamos haciendo aqui?

- `name`: Asignamos un nombre a nuestro contenedor. Recordemos que un contenedor no es más que una _build_ conformada por sus módulos federados y dependencias compartidas. Con este nombre, nos podremos referir a este contenedor desde fuera, desde otro contenedor, para poder así consumir alguno de sus módulos federados (si es que los tiene).
- `filename`: Este será el nombre del fichero o _bundle_ específico que actúa como contenedor, y que describirá un registro de todos los módulos federados y sus dependencias, así como un _runtime_ de orquestación, transferencia y consumo de módulos.
- `exposes`: Esta es la forma de indicar a webpack que módulos queremos federar o exponer. No es más que un mapa clave/valor:
  - clave: este sería el "friendly name" que asignamos a nuestro módulo federado, y así se conocerá desde fuera. 🛑 **IMPORTANTE**: debería bastar un string simple, por ejemplo `ClockWidget: xxx` pero esto es problemático, y debe escribirse entrecomillado y con un "./" inicial, asi: `'./ClockWidget': xxx`.
  - valor: aquí escribimos el módulo real de nuestro proyecto que vamos a federar.
- `shared`: Esta sería la lista de dependencias que queremos poder compartir. Es decir, si un contenedor _host_ consume un módulo federado que estoy exponiendo, podrá proveer (de su cosecha) las dependencias de esta lista en lugar de que tengan que ser descargadas, siempre que sean compatibles.

- ✅ **CHECKPOINT**: Pues estamos listos, prueba de fuego! Lanzamos una build de la microapp y comprobamos el resultado:

  ```text
  npm run build:microapp:dev
  ```

- Ahora toca inspeccionar el `report.html` generado y comprobar todos los _bundles_ que se han generado como parte de esta _build_. Toca destacar que:

  - `clock-container.js`: Este es _bundle_ especial que representa nuestro contenedor. Lista todos los módulos federados y sus dependencias y contiene el _runtime_ necesario para orquestar todo el sistema federado durante la ejecución.
  - `clock.js`: Este sería el _bundle_ normal generado a partir de nuestro _entrypoint_, sin federar, y sin incrustar dependencias. No será utilizado en principio.
  - `clock.microapp-clock_entrypoint_tsx.js`: Este sería el _bundle_ del módulo que hemos generado con el nombre `ClockWidget`.
  - `clock.<vendors|node_modules>_xxx.js`: Vemos como ha generado también _bundles_ independientes para las dependencias que vamos a compartir. Estos _bundles_ actuarán como fallback, si un módulo federado no puede obtener sus dependencias de quien le está consumiendo, descargará estos _bundles_.

## Adaptando paso a paso la aplicación _host_

`[app] config/webpack.prod.js`

- Vamos a eliminar la `optimization` y el `output` así como el `BundleAnalyzerPlugin`, que nos lo llevaremos a la configuración común, de modo que este fichero quedará muy simplificado:

  ```diff
  const { merge } = require("webpack-merge");
  - const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  - const helpers = require("./helpers");
  const configCommon = require("./webpack.common");

  module.exports = (env = {}) =>
    merge(configCommon(env), {
      mode: "production",
  -   output: {
  -     // Nombre para los bundles de salida.
  -     filename: `[name]-${helpers.versionName}.js`,
  -     // Nombre para los assets de salida.
  -     assetModuleFilename: `assets/[name].[contenthash][ext]`,
  -   },
  -   optimization: {
  -     splitChunks: {
  -       chunks: "all",
  -       cacheGroups: {
  -         vendorGroup: {
  -           test: /[\\/]node_modules[\\/]/,
  -           name: "vendor",
  -           enforce: true,
  -         },
  -       },
  -     },
  -   },
  -   plugins: [
  -     new BundleAnalyzerPlugin({
  -       analyzerMode: "static",
  -       openAnalyzer: false,
  -       reportFilename: "report/report.html",
  -     }),
  -   ],
    });
  ```

`[app] config/webpack.dev.js`

- En la configuración de desarrollo, eliminamos también el `output`, ahora será común, y vamos a servir todos los _bundles_ de nuestras microapps directamente del raiz, para evitar posibles problemas, por lo que eliminamos el `contentBasePublicPath`:

  ```diff
  const { merge } = require("webpack-merge");
  const helpers = require("./helpers");
  const configCommon = require("./webpack.common");

  module.exports = (env = {}) =>
    merge(configCommon(env), {
      mode: "development",
      devtool: "eval-source-map",
  -   output: {
  -     // Nombre para los bundles de salida.
  -     filename: "[name].[contenthash].js",
  -     // Nombre para los assets de salida.
  -     assetModuleFilename: `assets/[name].[contenthash][ext]`,
      },
      devServer: {
        static: [
          {
            directory: helpers.resolveFromRootPath("../microapp-clock/build/microapp/"),
  -         publicPath: "/microapps",
          },
          {
            directory: helpers.resolveFromRootPath("../microapp-quote/build/microapp/"),
  -         publicPath: "/microapps",
          },
        ],
        host: "localhost",
        port: 3000,
        historyApiFallback: true,
        hot: true,
      },
    });
  ```

`[app] config/webpack.common.js`

- Aplicamos los mismos cambios que en las microapps:

1. En primer lugar, no vamos a nombrar los _chunks_ de los entrypoint en `entry`, dejaremos que tome el nombre por defecto.
2. Además, desactivamos la cache para los _chunks_ generados `cache: false`.
3. Ajustamos explícitamente `filename` (para el módulo inicial) y `chunkFilename` (para todos los módulos _splitted_). Le añadimos como prefijo el nombre de nuestro proyecto.

   ```tsx
     entry: ["regenerator-runtime/runtime", "./app.entrypoint.tsx"],
     cache: false,
     output: {
       path: helpers.buildPath,
       filename: `${helpers.bundleName}.js`,
       chunkFilename: `${helpers.bundleName}.[id].js`,
     },
   ```

- Añadimos aqui el `BundleAnalyzerPlugin`. Y además, vamos a simplificar los settings del `HtmlWebpackPlugin`, puesto que ahora los _chunks_ del `entry` no los nombramos nosotros, dejamos que webpack los inyecte a su manera:

  ```diff
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  + const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  const helpers = require("./helpers");

  ...

    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
  -     hash: true,
  -     chunksSortMode: "manual",
  -     chunks: ["manifest", "vendor", helpers.bundleName],
      }),
  +   new BundleAnalyzerPlugin({
  +     analyzerMode: "static",
  +     openAnalyzer: false,
  +     reportFilename: "report/report.html",
      }),
    ],
  ```

- Finalmente, configuramos la federación de módulos aquí también. Añadimos el plugin primero:

  ```diff
  + const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  const helpers = require("./helpers");
  ```

- Y lo configuramos. Esta vez con una salvedad: no vamos a exponer ningún módulo federado desde este contenedor, sino que vamos a consumir otros módulos federados:

  ```tsx
    new ModuleFederationPlugin({
      // name: "AppContainer",
      remotes: {
        ClockContainer: "ClockContainer@http://localhost:3000/clock-container.js",
        QuoteContainer: "QuoteContainer@http://localhost:3000/quote-container.js",
      },
      shared: ["react", "react-dom", "react-router-dom", "@emotion/css"],
    }),
  ```

**¿Qué estamos haciendo aqui?**

- `remotes`: Estamos indicando a que contedores **remotos** queremos tener acceso para consumir alguno de sus módulos federados. Esto hará que webpack ponga en marcha la descarga de estos contenedores en cuanto arranque nuestra `app`, y de este modo, se creará un contexto en tiempo de ejecución con acceso a todos los módulos federados que vamos a consumir.
- `shared`: Igual que antes, son las dependencias que queremos ofrecer como reemplazo de aquellas que necesitan los módulos federados que consumiremos.

### Consumir microfrontends federados desde código

`[app] core/microapp.registry.ts`

- Ahora llega la pregunta clave, ¿cómo consumo un módulo federado desde código? **Necesitamos importarlo de forma dinámica, con la sintaxis de import dinámico de webpack**. Además, es muy importante que **esta sintáxis aparezca de forma explícita** para que webpack sepa que vamos a hacer uso de un determinado módulo federado. A tal efecto vamos a modificar nuestro registro de microapps del siguiente modo:

  ```tsx
  import { MicroappInterface } from "./microapp.model";

  export type RegisteredMicroapps = "clock" | "quote";
  export type GetFederatedMicroappFunction = () => Promise<{
    MicroappInterface: MicroappInterface;
  }>;

  export const microappRegistry: Record<RegisteredMicroapps, GetFederatedMicroappFunction> = {
    clock: () => import("ClockContainer/ClockWidget"),
    quote: () => import("QuoteContainer/QuoteWidget"),
  };
  ```

`[app] tsconfig.json`

- 🛑 **IMPORTANTE**: Para soportar esta sintáxis de import dinámico hay que cambiar el formato de los módulos en `tsconfig.json` a `esnext`:

  ```diff
    "target": "es6",
  + "module": "esnext",
    "moduleResolution": "node",
  ```

`[app] core/microapp.d.ts`

- Si nos fijamos, nos referimos a un módulo federado, concatenando el contenedor en el que está y su nombre `container/móduloFederado`. Pero para que TS no se queje, debemos declarar la existencia de estos módulos en un _ambient file_ dedicado:

  ```text
  [CREATE]
  core/microapp.d.ts
  ```

  ```tsx
  // Declaración de modulos federados
  declare module "ClockContainer/ClockWidget" {
    export const MicroappInterface: any;

    export default MicroappInterface;
  }

  declare module "QuoteContainer/QuoteWidget" {
    export const MicroappInterface: any;

    export default MicroappInterface;
  }
  ```

`[app] core/microapp-loader.component.tsx`

- Nos queda adaptar nuestro `MicroappLoader`, ahora no necesitamos la funcionalidad de descarga basada en `<script>`, de esto se encargará `webpack`. Lo único que hay que indicarle es que para cargar un módulo federado debemos llamar a la función `GetFederatedMicroappFunction` que tenemos en el registro de microapps.

- Además, ahora los `MicroappInterfaces` no estarán disponibles a través del objeto global `window` sino como resultado de llamar a la función `GetFederatedMicroappFunction`. Debemos crear una pequeña caché para mantener toda la funcionalidad implementada hasta ahora:

  ```diff
  import React from "react";
  + import { MicroappInterface } from "./microapp.model";
  import { microappRegistry, RegisteredMicroapps } from "./microapp.registry";

  + // Lógica de Negocio
  + const microappInterfacesCache: Partial<Record<RegisteredMicroapps, MicroappInterface>> = {};

  + const isMicroappLoaded = (microapp: RegisteredMicroapps) =>
  +   Boolean(microappInterfacesCache[microapp]);

  + const downloadMicroapp = async (microapp: RegisteredMicroapps): Promise<void> => {
  +   try {
  +     const getMicroapp = microappRegistry[microapp];
  +     const { MicroappInterface } = await getMicroapp?.();
  +     microappInterfacesCache[microapp] = MicroappInterface;
  +   } catch {
  +     Promise.reject();
  +   }
  + };

  + const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) =>
  +   microappInterfacesCache[microapp]?.render(container);

  + const unmountMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) =>
  +   microappInterfacesCache[microapp]?.unmount(container);

  // Componente Microapp Loader
  export interface MicroappLoaderProps {
    microapp: RegisteredMicroapps;
  }

  ...
  ```

`[app]`

- ✅ **CHECKPOINT**: Pues estamos casi listos, ejecutemos la solución:

  ```text
  npm start
  ```

- Y boom 💥. No arranca. Fijémonos en el error de la consola:

  > Shared module is not available for eager consumption webpack/sharing/consume/default/xxxx/xxxx

### _Eager consumption_

- Entendamos que es el `eager consumption`. Este es un error habitual que nos indica que se está intentando cargar alguna de las dependencias compartidas de forma "ansiosa". ¿Qué queire decir? ¿Por qué pasa esto? Veamos, nuestra `app` va a consumir módulos federados que permiten reemplazo de dependencias. Nos interesa que las dependencias de `app` sean intercambiables con la de los módulos federados, para optimizar la carga de código. Y así se lo hemos expresado en la configuración del plugin de módulos federados:

  ```tsx
    shared: ["react", "react-dom", "react-router-dom", "@emotion/css"],
  ```

- Debemos entender que **webpack va a extraer todas estas dependencias en _bundles_ separados**, por si un módulo federado quisiera hacer uso de ellas. Pero la forma por defecto de cargarlas es mediante **carga asíncrona**.

- Asi pues, cuando nuestra `app` se pone en marcha (se carga el _bundle_ `app.js`) se pone en marcha la descarga asíncrona de todas las dependencias 'shareables', pero no significa que las tengamos inmediatamente disponibles. Sin embargo `app` las "necesita" ya, las quiere consumir de forma "ansiosa".

`[app] app.bootstrap.ts`

- ¿Cómo se resuelve este problema? Haciendo que nuestra `app` también se cargue de forma asíncrona (_lazy_), con el uso de un sencillo `bootstrap`. Sustituimos nuestro punto de entrada de la `app` por otro que use un import dinámico:

  ```text
  [CREATE]
  app.bootstrap.tsx
  ```

  ```tsx
  import("./app.entrypoint");
  ```

`[app] app.entrypoint.tsx`

- Exportamos por defecto nuestra `App`:

  ```diff
  ...
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);

  + export default App;
  ```

`[app] config/webpack.common.js`

- Y actualizamos nuestra configuración de webpack:

  ```diff
  + entry: ["regenerator-runtime/runtime", "./app.bootstrap.ts"],
  ```

`[app]`

- ✅ **CHECKPOINT**: Volvemos a probar:

  ```text
  npm start
  ```

- Y ahora, por fin, FUNCIONA!

### Inspeccionar carga de _bundles_

Es importante ver como sucede la carga de bundles en el tab _Network_ de las `devTools`:

1. Se pone en marcha la carga `app.js` que es el bundle de nuestra aplicación _host_. Este será el único _bundle_ que referencie nuestro `index.html`.
2. Nuestra aplicación _host_ tiene como dependencia 2 contenedores remotos para su consumo en _runtime_. Por lo tanto, pone en marcha la descarga de sendos _containers_ remotos: `clock-container-js` y `quote-container.js`. Estos _bundles_ apenas suponen _overhead_ en el tiempo de carga incial ya que su peso es mínimo, pero son cruciales ya que su ejecución permiten establecer un contexto en _runtime_ con todos los módulos federados de los que se puede hacer uso, asi como sus dependencias.
3. De forma asíncrona, comienza la descarga y ejecución de nuestro `app.entrypoint`, que ahora estará segregado en un _bundle_ aparte debido al _bootstraping_ para evitar _eager consumption_.
4. En paralelo al punto anterior, comienza la descarga de todas las dependencias que la aplicación _host_ necesita para trabajar.
5. ¿Qué sucede cuando navegamos? Cuando entramos en las páginas de Clock o Quote, se descargará y ejecutará el _bundle_ correspondiente del módulos federado ... pero ¡reutilizando las dependencias de app!

## Problemas Conocidos

### Warning acerca de la versión requerida de `react-dom` (`react-dom` 18.2)

- Con la versión 18.2 de `react-dom` puede aparecer el siguiente warning:

  > ⚠ WARNING in shared module react-dom. No required version specified and unable to automatically determine one. Unable to find required version for "react-dom" in description file.

- Por algún motivo el plugin para federación de módulos no es capaz de extraer adecuadamente la versión de `react-dom` de su `package.json`. Podemos arreglar este problema si lo seteamos nosotros mismos a mano.

`[app] config/webpack.common.js`

- Para ello tendremos que utilizar la notación de objeto para las dependencias compartidas `shared` en el plugin de la siguiente manera:

  ```diff
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
  + const deps = require("../package.json").dependencies;
    const helpers = require("./helpers");

    ...

    new ModuleFederationPlugin({
      // name: "AppContainer",
      remotes: {
        ClockContainer: "ClockContainer@http://localhost:3000/clock-container.js",
        QuoteContainer: "QuoteContainer@http://localhost:3000/quote-container.js",
      },
  +   shared: {
  +     react: {},
  +     "react-dom": {
  +       requiredVersion: deps["react-dom"],
  +     },
  +     "react-router-dom": {},
  +     "@emotion/css": {},
  +   },
    }),

  ```

### Error al desmontar microapp (`react` 18.2)

- Al navegar entre las rutas `/clock` y `/quote` procedemos a la carga y renderizado de una nueva microapp al tiempo que se desmonta la antigua. Con la versión 18.2 de `react` aparece el siguiente error:

  > ❌ Warning: Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition.

- Aparentemente es un falso positivo y este error [está reportado](https://github.com/facebook/react/issues/25675) a `react`.

  > A fecha de Enero-2023 no hay fix y/o solución.

### Error al navegar entre microapp (`react` < 18)

- Si realizamos numerosos cambios de página para provocar el montado y desmontado de las microapps, veremos que React muestra por consola errores referentes al renderizado.

- Esto sucede porque ahora tenemos una misma dependencia de `ReactDOM` siendo reusada por la aplicación _host_ y por los módulos federados, y esa misma instancia de `ReactDOM` está intentando renderizar tanto el `<div id="root">` de `app` como otros nodos que son descendientes de ese _root_: en este caso, los `<divs>` contenedores donde va cada `microapp`. **Esto no se debe hacer**. El nodo del DOM que pasamos a `ReactDOM.render()` debe ser siempre un nodo _top level_ (como los llama `react`) lo que significa que no debe pertenecer a un árbol de componentes previamente renderizado por dicha instancia de `ReactDOM`.

- La solución más sencilla consiste en reemplazar el actual _container_ que pasamos a las `microapps` por un nodo creado manualmente (con la API nativa del DOM). Al haber sido creado manualmente a bajo nivel, no formará parte del arbol de componentes de la instancia de `ReactDOM` y por tanto será un nodo _top level_.

`[app] core/microapp-loader.component.tsx`

- Aplicar el siguiente cambio:

  ```diff
  ...

  const renderMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) =>
  + microappInterfacesCache[microapp]?.render(container.appendChild(document.createElement("div")));

  ...

  const unmountMicroapp = (microapp: RegisteredMicroapps, container: HTMLElement) => {
  + microappInterfacesCache[microapp]?.unmount(container.children?.[0]);
  + container.children?.[0].remove();
  };

  ```
