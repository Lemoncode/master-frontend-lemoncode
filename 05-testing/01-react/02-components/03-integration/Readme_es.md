# 03 Tests de integración

Hasta ahora hemos probado a testear componentes aislados, pero en el mundo real
nos podemos encontrar que un componente está compuesto por varios, y en ciertos
escenarios nos puede interesar probar la interacción completa, en esta demo vamos a
integrar varios componentes y probarlo todo junto.

Tomamos como punto de partida `02-name-edit`.

# Steps

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Para poder probar el test de integración con un ejemplo sencillo, vamos a
  dividir nuestro _name-edit_ component y vamos a crear los _display_ y _edit_
  components.

### ./src/display.tsx

```javascript
import React from 'react';

interface Props {
  userName: string;
}

export const Display: React.FunctionComponent<Props> = (props) => {
  const { userName } = props;

  return <h3>{userName}</h3>;
};
```

### ./src/edit.tsx

```javascript
import React from 'react';

interface Props {
  userName: string;
  onSetUserName: (userName: string) => void;
}

export const Edit: React.FunctionComponent<Props> = (props) => {
  const { userName, onSetUserName } = props;

  return (
    <input value={userName} onChange={(e) => onSetUserName(e.target.value)} />
  );
};
```

- Y `name-edit` va a pasar a hacer uso de esos dos subcomponentes:

### ./src/name-edit.tsx

```diff
import React from 'react';
+ import { Display } from './display';
+ import { Edit } from './edit';

export const NameEdit: React.FunctionComponent = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
-     <h3>{userName}</h3>
+     <Display userName={userName} />
-     <input value={userName} onChange={(e) => setUserName(e.target.value)} />
+     <Edit userName={userName} onSetUserName={setUserName} />
    </>
  );
};

```

- Después de este pedazo de refactor, ¿Tendremos que actualizar nuestras pruebas unitarias?
  Vamos a probar a lanzar lo tests:

```bash
npm run test:watch
```

¡ Anda ! ¡ Los tests siguen funcionando ! ¿Cómo puede ser posible? Aquí React testing library monta el arbol de componentes
completo y a nivel de testing esto es como una caja negra, nosotros seguimos buscando un `heading` y un `input` en el DOM,
y comprobamos que la salida es la que esperamos.

Esta aproximación es muy potente, en el pasado se utilizaba otra (_enzyme_), que era totalmente opuesta, nosotros teníamos
conocimiento de lo que había en cada componente, esto hacía que en el momento que reorganizáramos nuestro código, las pruebas
se hacían difíciles de mantener.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
