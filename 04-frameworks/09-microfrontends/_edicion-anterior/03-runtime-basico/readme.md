# Microfrontends - Integración _runtime_ básica

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `02-exportando-microapps`.

### Objetivo

Consumir los microfrontends generados en el paso anterior (`clock-microapp.js` y `quote-microapp.js`) desde nuestra aplicación `host` en tiempo de ejecución. Para ello tendremos que descargarlos previamente y renderizarlos a continuación en el nodo deseado. En este paso solo modificaremos el proyecto `host`.

## Descarga de los microfrontends

Por agilizar las cosas y puesto que estamos haciendo pruebas de concepto en un entorno de desarrollo, vamos a consumir los _bundles_ de nuestras microapps directamente desde sus servidores de `webpack-dev-server`.

> ⚡ En un entorno real de producción, es habitual tener un servidor dedicado a publicar nuestras microapps, o incluso, un servicio o API Rest que nos devuelva el _bundle_ del microfrontend que deseamos. En resumidas cuentas, dispondremos de una URL que usaremos para localizar a cada uno de nuestros _bundles_.

`[host] index.html`

- La forma más sencilla e inmediata para cargar en _runtime_ un paquete de código en nuestra aplicación _host_ es mediante un _script_ en el html. Por tanto podremos hacer:

  ```diff
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Host</title>

  + <!-- Microapp scripts -->
  + <script src="http://localhost:3001/clock-microapp.js" type="text/javascript"></script>
  + <script src="http://localhost:3002/quote-microapp.js" type="text/javascript"></script>

  </head>
  ```

`[host]`

- ✅ **CHECKPOINT**: Probemos a ejecutar la solución y comprobar como los _bundles_ de ambas microapps se están descargando correctamente:

  ```text
  microapp-clock> npm start
  microapp-quote> npm start

  host> npm start
  ```

  > 🔍 **Comprueba** como se descargan las microapps al iniciarse la aplicación _host_. Mira la pestaña _network_ de las _Dev tools_ de tu navegador. La colocación de los `<script>` a mano en el `<head>` del HTML es intencionado. Al estar en `<head>`, su carga es _síncrona_:
  >
  > - Primero se parsea el elemento head al completo, descargando uno a uno los scripts de forma síncrona.
  > - Una vez lo tenemos todo, entonces se da comienzo al parseo del elemento `<body>`. De esta forma al llegar a `<body>` nos aseguramos de que tenemos todos los _scripts_ de las microapps cargados.
  >
  > No es lo más eficiente, pero es una primera aproximación que funciona y evita condiciones de carrera. Veremos como mejorar esto más adelante.

  > ⚡ El punto anterior es válido siempre que no utilicemos `async`/`defer` como atributos de los _scripts_. Son 2 atributos relativamente nuevos para hacer cargas asíncronas y tienen diferentes implicaciones. Mas info aqui: https://flaviocopes.com/javascript-async-defer/.

## Renderizado de los microfrontends

- Puesto que en la aplicación _host_ estamos trabajando con React, lo ideal sería implementar un componente de React que nos permita renderizar cualquier microfrontend. Este componente será genérico y podremos reutilizarlo tantas veces como queramos en la aplicación _host_.

`[host] components/dashboard.component.tsx`

- Para ello, su consumo debería ser algo tan sencillo como esto:

  ```diff
    import React from "react";
    import { css } from "emotion";
    import WorldImage from "../assets/img/world.svg";
  + import { MicroappLoader } from "../core";

    ...

    export const Dashboard: React.FC = () => (
      <main className={styles.container}>
        <div className={styles.header}>
          <img src={WorldImage} className={styles.image} />
          <h1 className={styles.title}>{`Welcome to my Dashboard!`}</h1>
        </div>
  +     <MicroappLoader microapp="clock" />
  +     <MicroappLoader microapp="quote" />
      </main>
    );
  ```

`[host] core/index.ts`

- Creamos carpeta `core` y su respectivo fichero barrel:

  ```text
  [CREATE] core/
  [CREATE] core/index.ts
  ```

- Y preparamos el export del barrel:

  ```diff
  + export * from "./microapp-loader.component";
  ```

`[host] core/microapp.registry.ts`

- A modo de soporte para nuestro componente `MicroappLoader` vamos a tener un registro donde declarar las microapps que queremos consumir:

  ```text
  [CREATE] core/microapp.registry.ts
  ```

- Este registro será un sencillo diccionario donde se declare, por ahora, cada microapp junto con la forma de obtener su interfaz:

  > 🛑 **IMPORTANTE**: Recordemos que habiamos empaquetado cada microapp de modo que al cargarse o ejecutarse su bundle se definiría una variable global llamada `window.microappClock` / `window.microappQuote`, donde nos encontraríamos el interfaz para manejar dicha microapp.

  ```ts
  // Tipado común de la interfaz de Microapps.
  export interface MicroappInterface {
    render: (container: HTMLElement) => void;
    unmount: (container?: HTMLElement) => void;
  }

  // Registro de microapps disponibles con sus settings correspondientes.
  export interface MicroappSettings {
    getInterface: () => MicroappInterface;
  }

  export type RegisteredMicroapp = "clock" | "quote";

  export const microappRegistry: Record<RegisteredMicroapp, MicroappSettings> = {
    clock: {
      getInterface: () => window["microappClock"],
    },
    quote: {
      getInterface: () => window["microappQuote"],
    },
  };
  ```

`[app] core/microapp-loader.component.tsx`

- Ahora si, aasemos a la implementación de nuestro componente `MicroappLoader`. En primer lugar creamos el fichero:

  ```text
  [CREATE] core/microapp-loader.component.tsx
  ```

- En resumen, este componente genérico **debe encargarse de**:

  - Proporcionar un nodo en el DOM que actúe como contenedor del microfrontend.
  - Cuando el componente se monte, acceder al interfaz del microfrontend y llamar a `render`.
  - Cuando el componente se desmonte, acceder al interfaz del microfrontend y llamar a `unmount`.

- Nos ponemos manos a la obra:

  ```ts
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

      // Línea clave, ¿como puedo acceder a la interfaz de mi microapp cargada por <script>?
      const { getInterface } = microappRegistry[microapp];
      getInterface().render(containerRef.current);

      return () => getInterface().unmount(containerRef.current);
    }, [microapp]);

    return <div ref={containerRef} />;
  };
  ```

✅ **CHECKPOINT**

`[host]`

- Lancemos la aplicación _host_ y veamos nuestra primera integración run time real:

  ```text
  npm start
  ```

  > 🛂 Recuerda: `microapp-clock` y `microapp-quote` deben estar arrancados.
