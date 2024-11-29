# Islas

Hasta ahora hemos visto como generar contenido estático en nuestro sitio Astro, y también ejecutar JS en el navegador, pero hay veces que nos hace falta meter componentes ricos, y hacerlos a pelo en vanilla JS puede ser un infierno. ¿Qué podemos hacer? Astro nos permite meter componentes de React, Vue, Svelte, Angular, etc. en nuestro sitio, para ello utilizan el
concepto de "islas".

Vamos a:

- Añadir un framework de UI, en este caso Preact.
- Usar Preact para crear un componente interactivo de saludos.
- Aprender cuando NO usar islas.

> ¿Por qué usar Preact? porque es una librería muy ligera (pesa 3KB)

# Manos a la obra

Lo primero, añadimos preact al proyecto, para ello necesitamos utilizar el CLI de Astro.

```bash
npx astro add preact
```

Le decimos que si a todo :).

Vamos a añadir un componente tonto de preact:

_./src/components/greeting.tsx_

```tsx
import type { FunctionComponent, h } from "preact";
import { useState } from "preact/hooks";

interface GreetingProps {
  messages: string[];
}

const Greeting: FunctionComponent<GreetingProps> = ({ messages }) => {
  const randomMessage = (): string =>
    messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState<string>(messages[0]);

  return (
    <div>
      <h3>{greeting}! Thank you for visiting!</h3>
      <button onClick={() => setGreeting(randomMessage())}>New Greeting</button>
    </div>
  );
};

export default Greeting;
```

Y ahora vamos a usarlo en nuestra página principal:

_./src/pages/index.astro_

```diff
---
import BaseLayout from "../layouts/base.astro";
+ import Greeting from '../components/greeting';
---

<BaseLayout pageTitle="Página principal">
  <p>Contenido de la página</p>
+  <Greeting messages={["Hi", "Hello", "Howdy", "Hey there"]} />
</BaseLayout>
```

Si ejecutamos esto ahora, vemos que aparece el componente, pero si clicamos en el botón, no funciona, tenemos que indicarle que lo cargue en el navegador, eso lo hacemos con `client:load`:

_./src/pages/index.astro_

```diff
<BaseLayout pageTitle="Página principal">
  <p>Contenido de la página</p>
  <Greeting
+   client:load
    messages={["Hi", "Hello", "Howdy", "Hey there"]}
  />
</BaseLayout>
```

Con esto, ya tenemos el componente funcionando en cliente.
