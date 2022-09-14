# 04 Fetch

Es hora de ponernos a probar componentes que tengan llamadas a APIs asíncronas.

Tomamos como punto de partida el ejemplo anterior `03-integration`.

# Steps

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a crear un fichero en el que añadiremos una función que realiza una llamada a una API Rest
  y devuelve una promesa (en este caso una API rest de prueba que devuelve una lista con nombres de usuarios).

### ./src/name-api.ts

```javascript
import Axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users';

export const getNameCollection = (): Promise<string[]> =>
  Axios.get(url).then(({ data }) => data.map((user) => user.name));
```

- Vamos a crear un componente que haga uso de esta api y muestre la lista
  por pantalla:

### ./src/name-collection.tsx

```javascript
import React from 'react';
import { getNameCollection } from './name-api';

export const NameCollection: React.FunctionComponent = () => {
  const [nameCollection, setNameCollection] = React.useState([]);

  React.useEffect(() => {
    getNameCollection().then((names) => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};
```

- Vamos a instanciar nuestro componente a nivel de aplicación.

### ./src/app.tsx

```diff
import React from 'react';
import { NameEdit } from './name-edit';
+ import { NameCollection } from './name-collection';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
      <NameEdit />
+     <NameCollection />
    </>
  );
};

```

- Y vamos a ponernos manos a la obra a probar el componente, vamos a ver como nos
  la apañamos con ese _useEffect_ y esa llamada asíncrona a la API.

Vamos a crear el fichero de spec:

### ./src/name-collection.spec.tsx

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- En este caso vamos comprobar que que el componente muestra al menos un elemento de la lista (`li`)
  cuando el componente se monta y se resuelve la llamada asincróna de la API..., aquí te puedes
  preguntar: _esto suena muy bien, pero si para un componente es una caja negra ¿Cómo puedo probar esto?_

- Por un lado montamos un mock sobre la llamada a la API para que devuelva del tirón una lista de usuarios.

- Por otro lado, como sabemos que la primera vez que pintemos el componente no tenemos datos (ni elemento `li`),
  vamos a esperara a que aparezcan los elementos _li_ para ello utilizamos el método _findAllByRole_ con un
  _await_ así se espera a que aparezca algún _li_ para seguir con el test y poder comprobar los resultados,
  [más información acerca de como funcionan estos selectores asíncronos en este link](https://testing-library.com/docs/dom-testing-library/api-async), veamos cómo queda esto en código:

### ./src/name-collection.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
+ import * as api from './name-api';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
- it('', () => {
+ it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe']);

    // Act
+   render(<NameCollection />);

+   const items = await screen.findAllByRole('listitem');

    // Assert
+   expect(items).toHaveLength(1);
+   expect(getStub).toHaveBeenCalled();
  });
});

```

> [Más sobre Find queries](https://testing-library.com/docs/dom-testing-library/api-async#findby-queries)

- Y... ¿Cómo podemos probar el caso inicial? Pues justo cuando montamos el componente, comprobamos
  que no hay ningún elemento (en este ocasión no hacemos _await_) y realizamos la comprobación.

### ./src/name-collection.spec.tsx

```diff
...
  it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection />);

+   const itemsBeforeWait = screen.getAllByRole('listitem');
+   expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });
});

```

- Esto nos puede dar problemas ya que _getAllByRole_ espera que haya al menos un elemento,
  si este no es el caso, mejor usar _queryAllByRole_.

### ./src/name-collection.spec.tsx

```diff
...
-   const itemsBeforeWait = screen.getAllByRole('listitem');
+   const itemsBeforeWait = screen.queryAllByRole('listitem');
    expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });

```

> [Query](https://testing-library.com/docs/guide-disappearance/#asserting-elements-are-not-present)

- Vamos a darle una vuelta de tuerca más a este ejemplo, ¿Y si tuviéramos una lista inicial mientras
  se está realizando la carga asíncrona y queremos probar que este se elimina cuando nos llega la
  lista de servidor? Por ejemplo imaginate que tenemos en caché la última carta y queremos mostrarla
  mientras se carga la nueva, una posible implementación de esta funcionalidad podría ser:

### ./src/name-collection.tsx

```diff
import React from 'react';
import { getNameCollection } from './name-api';

+ interface Props {
+   initialNameCollection?: string[];
+ }

- export const NameCollection: React.FunctionComponent = () => {
+ export const NameCollection: React.FunctionComponent<Props> = (props) => {
- const [nameCollection, setNameCollection] = React.useState([]);
+ const [nameCollection, setNameCollection] = React.useState(
+   props.initialNameCollection || []
+ );

  React.useEffect(() => {
    getNameCollection().then(names => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.map(name => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

```

- Vamos ahora a por la prueba, en este caso comprobamos que en la primera carta tenemos un elemento,
  y acto seguido esperamos a que ese elemento desaparezca del DOM.

### ./src/name-collection.spec.tsx

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, waitFor } from '@testing-library/react';
import * as api from './name-api';
import { NameCollection } from './name-collection';
...

+ it('should remove initial list when it mounts the component and it resolves the async call', async () => {
+   // Arrange
+   const initialNameCollection = ['initial-user'];
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe']);

+   // Act
+   render(<NameCollection initialNameCollection={initialNameCollection} />);

+   const initialItems = screen.getAllByRole('listitem');
+   expect(initialItems).toHaveLength(1);
+   expect(initialItems[0].textContent).toEqual('initial-user');

+   await waitFor(() => {
+     // Assert
+     expect(screen.queryByText('initial-user')).not.toBeInTheDocument();
+   });
+ });

```

> Nota: `waitFor` puede tener muchos usos, por ejemplo: una aplicación interesante es la de
> esperar a que una api mock se haya ejecutado, por ejemplo:

```ts
await waitFor(() => expect(mockAPI).toHaveBeenCalledTimes(1));
```

Otra alternative es usar `waitForElementToBeRemoved` (en este caso esperas a que el elemento en
concreto desaparezca del DOM):

### ./src/name-collection.spec.tsx

```diff
import React from 'react';
import {
  render,
  screen,
- waitFor,
+ waitForElementToBeRemoved,
} from '@testing-library/react';
import * as api from './name-api';
import { NameCollection } from './name-collection';

...

  it('should remove initial list when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const initialNameCollection = ['initial-user'];
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection initialNameCollection={initialNameCollection} />);

    const initialItems = screen.getAllByRole('listitem');
    expect(initialItems).toHaveLength(1);
    expect(initialItems[0].textContent).toEqual('initial-user');

-   await waitFor(() => {
+   await waitForElementToBeRemoved(screen.queryByText('initial-user'));

    // Assert
    expect(screen.queryByText('initial-user')).not.toBeInTheDocument();
-   });
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
