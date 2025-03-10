# Microfrontends - Vanilla interface (OPCIONAL)

### Punto de partida

> 📌 Partiremos de la solución en la carpeta `02-integración-manual`.

### Objetivo

Este paso es totalmente **OPCIONAL** y solo pretende demostrar la utilidad de exponer un microfrontend de forma más universal, en lugar de usar un componente de React para ello. De esta forma, podremos cumplir con la regla en donde se recomienda que una microapp se renderice a si misma, es decir, que esté 100% autocontenida. Esto nos permitirá utilizar la tecnología que queramos para implementar dicho microfrontend y no tener dependencias con la aplicación _host_.

> ⚡ La implementación que haremos aqui es una propuesta sencilla, pero no es la única forma posible de conseguir la citada universalidad. Utilizar como wrapper de nuestra microapp un web component es otra forma universal y estandarizada de acometer este objetivo.

## Parte 1 - Exponer _microapps_ con un interface

En este primer paso vamos a remozar completamente el _entrypoint_ de las microapps. Dejarán de exponer un componente de `react` para exportar una simple pero efectiva interface que sirva para montar, desmontar y actualizar el microfrontend.

`[keypad] src/microapp-keypad.entrypoint.tsx`

- Dado que es un cambio importante, podemos empezar prácticamente en limpio y explicaremos las partes clave de este interface:

  ```tsx
  import { createRoot, Root } from "react-dom/client";

  import { Keypad, KeypadProps } from "./pods/keypad.component";

  /**
   * Microapp public interface to be consumed by the host app.
   * Made with vanilla JS to avoid dependencies.
   * Basic interface to render, update and unmount the microapp, while keeping
   * technology agnostic.
   */
  export interface MicroappInterface {
    render: (container: HTMLElement, props?: KeypadProps) => void;
    update: (props?: KeypadProps) => void;
    unmount: (container?: HTMLElement) => void;
    root?: Root;
  }

  export const MicroappKeypad: MicroappInterface = {
    render(container, props) {
      if (!container) return;
      // Microapp root node will be a child of the host container.
      // This is needed to establish a clear separation between the host and the
      // microapp component trees. Now different technologies could be used
      // without interference.
      const rootNode = document.createElement("div");
      container.appendChild(rootNode);
      this.root = createRoot(rootNode);
      this.update(props);
    },
    update(props) {
      this.root?.render(<Keypad {...props} />);
    },
    unmount() {
      this.root?.unmount(); // See NOTE below.
    },
  };

  export default MicroappKeypad;

  /**
   * Be aware that unmounting within a React.Strict block, a false positive
   * will popup. Explained here: https://github.com/facebook/react/issues/25675
   * This is a hack to avoid the false positive only for development:
   * if (import.meta.env.DEV) {
   *    const rootForLaterUnmount = this.root;
   *    delete this.root;
   *    setTimeout(() => rootForLaterUnmount.unmount(), 0);
   *  }
   */
  ```

- Los aspectos clave de esta implementación son los siguientes:
  - Al ser una implementación _vanilla_ nos abstrae de usar cualquier tecnología por debajo para nuestros componentes.
  - Utilizamos una interface que proporciona los 3 métodos (síncronos) más necesarios para el ciclo de vida típico de un componente: montar, desmontar y actualizar propiedades.
    - **render**: Es el método que **monta** nuestra microapp, la renderiza por primera vez. Y lo hará con la tecnología de nuestra elección. En el caso de `react` se encargará de crear un nodo root como hijo del `container` (nodo en el DOM) proporcionado por la aplicación _host_.
    - **update**: función para volver a renderizar nuestra microapp cada vez que alguna propiedad cambie.
    - **unmount**: cuando _host_ necesite desmontar el microfrontend, tendrá que llamar a este método que se encargará de esa tarea.

✅ **CHECKPOINT**

`[keypad]`

- Estamos listos para ejecutar una nueva `build` y comprobar que se compila correctamente:

  ```text
  npm run build
  ```

### ⌨ Te toca

🛑 **IMPORTANTE**: Repite el mismo proceso anterior para el proyecto `terminal` y asegurate que:

- Se genera un nuevo _bundle_ `microapp/terminal.js`.

## Parte 2 - Consumiendo _microapps_ mediante un interface

- La integración en _host_ cambia sustancialmente con esta nueva aproximación. El _host_ ya no se descargará un componente de `react` con cada microapp, sino una interface para controlar el ciclo de vida del microfrontend de forma imperativa.

`[host] src/app.d.ts`

- Como primer paso vamos a actualizar el tipado en el _host_ que describe nuestras microapps. Recordemos, _module augmentation_ en nuestro `app.d.ts`. Vamos a incorporar el tipado de un `MicroappInterface` que será genérico a cualquier microfrontend:

  ```diff
    // Typings for vite/client
    /// <reference types="vite/client" />

    // Module augmentation for complementary types
    declare module "\*.module.css";

    // Typings for microapps
  + interface MicroappInterface<P extends object> {
  +   render: (container: HTMLElement, props?: P) => void;
  +   update: (props?: P) => void;
  +   unmount: (container?: HTMLElement) => void;
  +   root?: Root;
  + }

    type KeypadEventType = "numeric-touch" | "clear-touch" | "ok-touch";
    interface KeypadProps {
      dispatchEvent?: (type: KeypadEventType, detail?: number) => void;
    }

    interface TerminalProps {
      value: string;
    }

    // Module augmentation for microapps
    declare module "http://localhost:3001/microapp/keypad.js" {
  +   export const MicroappKeypad: MicroappInterface<KeypadProps>;
      export default MicroappKeypad;
    }

    // Module augmentation for microapps
    declare module "http://localhost:3002/microapp/terminal.js" {
  +   export const MicroappTerminal: MicroappInterface<TerminalProps>;
      export default MicroappTerminal;
    }
  ```

- Si bien la parte de la descarga _lazy_ de los microfrontends puede hacerse como hasta ahora con sintaxis de import dinámico, lo que obtenemos como resultado ya no es un componente sino un interface para controla nuestro microfrontend.

- Por lo tanto, vamos a implementar un nuevo componente que abstraiga la lógica de manejo de dicha interface. Lo llamaremos `MicroappLoader` y su responsabilidad será la de **descargar una microapp determinada, extraer su interface, y consumirla** de forma vinculada a los ciclos de vida del propio componente `MicroappLoader`.

`[host] src/pods/microapp-loader.component.tsx`

- La implementación sería la siguiente:

  ```ts
  import React from "react";

  export type MicroappLoaderProps<P extends object> = {
    url: string;
  } & P;

  export const MicroappLoader = <P extends object>({ url, ...props }: MicroappLoaderProps<P>) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const microappInterfaceRef = React.useRef<MicroappInterface<P>>();
    const [interfaceReady, setInterfaceReady] = React.useState(false);

    // Effect to load microapp interface
    React.useEffect(
      () => {
        import(url).then(mod => {
          microappInterfaceRef.current = mod.default;
          setInterfaceReady(true);
        });
      },
      [] // Intentional no-deps, load only once, don't monitor url changes
    );

    // Effect to render/unmount via microapp interface
    React.useEffect(() => {
      if (!interfaceReady) return;
      // Mount microapp and return cleanup function for unmounting.
      microappInterfaceRef.current?.render?.(containerRef.current, props as P);
      // Be aware that unmounting within a React.Strict block, a false positive
      // will popup. Explained here: https://github.com/facebook/react/issues/25675
      return () => microappInterfaceRef.current?.unmount?.();
    }, [interfaceReady, microappInterfaceRef.current]);

    // Effect to trigger an update every time props change.
    React.useEffect(() => {
      if (!interfaceReady) return;
      microappInterfaceRef.current?.update?.(props as P);
    }, [interfaceReady, props]);

    return interfaceReady ? <div ref={containerRef} /> : <div>Loading...</div>;
  };
  ```

- A grandes rasgos, podemos decir que las claves de este componente son:

  - Abstraer la lógica de descarga de una microapp y manejo de su interface. Para lo cual, contamos con:
    - Un _effect_ que descarga de forma _lazy_ el microfrontend importándolo dinámicamente, y guardando el interface descargado en una referencia. Esto lo hará únicamente cuando se monte `MicroappLoader`.
    - Otro _effect_ que, una vez en posesión del interface de la microapp, la renderice y la desmonte según el ciclo de vida de `MicroappLoader`.
    - Un tercer _effect_ que se encarga de monitorizar las propiedades y cada vez que cambian, actualiza la microapp.
  - Renderizar un nodo en blanco, contenedor, que será pasado a la microapplicación como punto de entrada en el DOM para acoplar su árbol de componentes.

`[host] src/pods/dashboard.component.tsx`

- Por último, tan solo nos quedará ajustar nuestro _dashboard_ para hacer uso de nuestro nuevo cargador de microapps:

  ```diff
    import React from "react";

    import "./dashboard.css";
  + import { MicroappLoader } from "./microapp-loader.component";

  - // Lazy load desired microapps.
  - const Keypad = React.lazy(() => import("http://localhost:3001/microapp/keypad.js"));
  - const Terminal = React.lazy(() => import("http://localhost:3002/microapp/terminal.js"));

    // Dashboard component composed by lazy loaded microapps.
    export const Dashboard: React.FC = () => {
      const [value, setValue] = React.useState<string>("");

      return (
        <div className="dashboard">
          <h1>Dashboard</h1>
  -       <React.Suspense fallback={<div>Loading...</div>}>
  -       <Keypad
  +       <MicroappLoader<KeypadProps>
  +         url="http://localhost:3001/microapp/keypad.js"
            dispatchEvent={(type, detail) => {
              if (type === "numeric-touch") {
                setValue(`${value}${detail}`);
              } else if (type === "clear-touch") {
                setValue("");
              } else if (type === "ok-touch") {
                alert(`Value: ${value}`);
              }
            }}
          />
  -       <Terminal value={value} />
  +       <MicroappLoader<TerminalProps>
  +         url="http://localhost:3002/microapp/terminal.js"
  +         value={value}
  +       />
  -       </React.Suspense>
        </div>
      );
    };
  ```

✅ **CHECKPOINT**

- Y llegó el momento de probar la nueva solución, para ello:

`[keypad] y [terminal]`

- Asegurándonos de que tenemos compilados ambos proyectos, arranquemos nuestro servidor `preview`:

  ```text
  npm run preview
  ```

`[host]`

- Ahora toca lanzar el _host_ con la integración final:

  ```text
  npm run dev
  ```

  > 🔍 Comprueba como se renderiza en nuestro _dashboard_ ambos _widgets_, el teclado y la terminal, y todo funciona como antes.

  > 🎉 Hemos completado otro _milestone_ con una implementación de microfrontends ciertamente más universal y _future-proof_ que la anterior.
