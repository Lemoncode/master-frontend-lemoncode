# Microfrontends - Integración _Runtime_ - Ejemplo Básico

## Punto de partida

> Partiremos de la solución en la carpeta `01-punto-partida`.

## Integración _runtime_

### Descarga de los microfrontends

En un entorno real, es probable que tengamos un servidor estático dedicado (distinto al que aloja la aplicación _host_) a servir los bundles de vuestras microapps. También podría ser el mismo server o, incluso, un servicio o API Rest que nos devuelva el _bundle_ del microfrontend que buscamos. Al final, tendremos una URL que localiza a cada uno de nuestros _bundles_.

Por agilizar las cosas y puesto que estamos haciendo pruebas de concepto en un entorno de desarrollo, vamos a aprovechar que ya tenemos un servidor ligero de desarrollo (`webpack-dev-server`) y vamos a servir directamente desde ahí los _bundles_ generados.

`[app] webpack.dev.js`

- Para ello tocamos la configuración de `webpack` y le indicamos que ficheros queremos que nos sirva de forma estática y bajo que ruta:

  ```diff
  const { merge } = require("webpack-merge");
  + const helpers = require("./helpers");
  const configCommon = require("./webpack.common");

  ...

    devServer: {
  +   static: [
  +     {
  +       directory: helpers.resolveFromRootPath("../microapp-clock/build/microapp/"),
  +       publicPath: "/microapps",
  +     },
  +     {
  +       directory: helpers.resolveFromRootPath("../microapp-quote/build/microapp/"),
  +       publicPath: "/microapps",
  +     },
  +   ],
      host: "localhost",
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
  ```

`[app] index.html`

- Ahora que nuestro _dev server_ aloja los _bundles_ de nuestras microapps, la forma más sencilla para cargarlos en _runtime_ en nuestra aplicación _host_ es mediante un _script_ en el html:

  ```diff
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>App</title>

  + <!-- Microapp scripts -->
  + <script src="microapps/clock.js" type="text/javascript"></script>
  + <script src="microapps/quote.js" type="text/javascript"></script>

  </head>
  ```

`[app]`

- ✅ **CHECKPOINT**: Probemos a ejecutar la solución y comprobar como los _bundles_ de ambas microapps se están descargando correctamente:

  ```text
  npm start
  ```

- 🛑 **IMPORTANTE**: La colocación de los `<script>` a mano en el `<head>` del HTML es intencionado. Al estar en `<head>`, su carga es _síncrona_. Primero se parsea el elemento head al completo, descargando uno a uno los scripts de forma síncrona. Una vez lo tenemos todo, entonces se da comienzo al parseo del elemento `<body>`. De esta forma al llegar a `<body>` nos aseguramos de que tenemos todos los _scripts_ de las microapps cargados. No es lo más eficiente, pero es una primera aproximación que funciona. Veremos como mejorar esto.

- El punto anterior es válido siempre que no utilicemos `async`/`defer` como atributos de los _scripts_. Son 2 atributos relativamente nuevos para hacer cargas asíncronas y tienen diferentes implicaciones. Mas info aqui: https://flaviocopes.com/javascript-async-defer/.

<br/>
<br/>

### Renderizado de los microfrontends

- Puesto que en la aplicación _host_ estamos trabajando con React, lo ideal sería implementar un componente de React que nos permita renderizar cualquier microfrontend. Este componente será genérico y podremos reutilizarlo tantas veces como queramos en la aplicación _host_.

`[app] dashboard.component.tsx`

- Para ello, su consumo debería ser algo tan sencillo como esto:

  ```diff
  import React from "react";
  import { css } from "emotion";
  import WorldImage from "./assets/img/world.svg";
  + import { MicroappRender } from "./microapp-render.component";

  ...

  export const Dashboard: React.FC = () => (
    <main className={styles.container}>
      <div className={styles.header}>
        <img src={WorldImage} className={styles.image} />
        <h1 className={styles.title}>{`Welcome to my Dashboard!`}</h1>
      </div>
  +   <MicroappRender microapp="MicroappClock" />
  +   <MicroappRender microapp="MicroappQuote" />
    </main>
  );
  ```

`[app] microapp-render.component`

- Pasemos a su implementación. En primer lugar creamos el fichero:

  ```text
  [CREATE] microapp-render.component.tsx
  ```

- La clave está en recordar que habiamos empaquetado nuestro microapp de modo que al ejecutarse el bundle dejaría definida una variable global llamada `MicroappTemplate`, y por tanto en dicha variable, nos encontraríamos el interfaz de nuestra microapp. Luego, en resumen, este componente genérico se encargará de:

  - Proporcionar un nodo en el DOM que actúe como contenedor del microfrontend.
  - Cuando el componente se monte, acceder al interfaz del microfrontend y llamar a `render`.
  - Cuando el componente se desmonte, acceder al interfaz del microfrontend y llamar a `unmount`.

- Nos ponemos manos a la obra:

  ```ts
  import React from "react";

  // Tipado común de la interfaz de Microapps.
  type MicroappRenderFunction = (container: HTMLElement) => void;
  type MicroappUnmountFunction = (container?: HTMLElement) => void;

  interface MicroappInterface {
    render: MicroappRenderFunction;
    unmount: MicroappUnmountFunction;
  }

  type RegisteredMicroapps = "MicroappClock" | "MicroappQuote";

  // Componente Microapp Render
  export interface MicroappRenderProps {
    microapp: RegisteredMicroapps;
  }

  export const MicroappRender: React.FC<MicroappRenderProps> = ({ microapp }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
      // Línea clave, ¿dónde puedo encontrar el interfaz de mi microapp cargada por <script>?
      const microappInterface: MicroappInterface = window[microapp]?.MicroappInterface;
      microappInterface?.render(containerRef.current);

      return () => microappInterface?.unmount(containerRef.current);
    }, [microapp]);

    return <div ref={containerRef} />;
  };
  ```

`[app]`

- ✅ **CHECKPOINT**: Ejecutemos la solución y veamos nuestra primera integración run time real:

  ```text
  npm start
  ```
