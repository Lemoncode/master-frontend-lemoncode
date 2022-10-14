# 05 Router

En una aplicación real es muy normal que tengamos múltiples páginas y que utilicemos
la librería de enrutado para SPA _react-router_, vamos a ver como podemos
probar componentes que hagan uso de esta librería.

Tomamos como punto de partida `04-fetch`.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Tenemos una página en la que mostramos una lista de usuario, vamos a crear una segunda
  página en la que podemos ver un usuario en concreto, la llamaremos: `user-edit.tsx`

### ./src/user-edit.tsx

```javascript
import React from 'react';
import { useParams } from 'react-router-dom';

type ParamProps = {
  name: string;
};

export const UserEdit: React.FunctionComponent = (props) => {
  const params = useParams<ParamProps>();
  return <h1>User name: {params.name}</h1>;
};

```

- Vamos a configurar nuestro `router` con las dos páginas que hemos mencionado:

### ./src/router.tsx

```javascript
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { NameCollection } from './name-collection';
import { UserEdit } from './user-edit';

export const Router: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NameCollection />} />
        <Route path="users/:name" element={<UserEdit />} />
      </Routes>
    </HashRouter>
  );
};
```

- Y añadirlo a nuestra aplicación:

### ./src/app.tsx

```diff
import React from 'react';
- import { NameEdit } from './name-edit';
- import { NameCollection } from './name-collection';
+ import { Router } from './router';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
-     <NameEdit />
-     <NameCollection />
+     <Router />
    </>
  );
};

```

- Vamos a añadir un `Link` de `react-router` para que nos permita navegar de la
  vista de listado de usuarios a la de detalle.

### ./src/name-collection.tsx

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
import { getNameCollection } from './name-api';

...

  return (
    <ul>
      {nameCollection.map(name => (
        <li key={name}>
-         {name}
+         <Link to={`/users/${name}`}>{name}</Link>
        </li>
      ))}
    </ul>
  );
};

```

- ¿Que pasraría si ahora intentamos ejecutar la batería de tests que ya tenemos?:

```bash
npm run test:watch
```

- ¡ Están rotos ! ¿Porqué pasa esto? Pues que nos hace falta envolver el componente que queremos probar con el
  enrutado (un render with router provider), ya que `react-testing-library` monta todos los componentes, fijate
  que hacemos:

- Nos creamos una función que haga de proveedora en la que montamos toda la fontanería de routing, y donde
  nos interesa le pasamos por parámetro el componente que queremos probar, después lo invocamos en nuestro test.

### ./src/name-collection.spec.tsx

> Note: [testing with react-router](https://testing-library.com/docs/example-react-router)

```diff
import React from 'react';
+ import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import * as api from './name-api';
+ import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

+ const renderWithRouter = (component) =>
+   render(
+     <HashRouter>
+       <Routes>
+         <Route path="/" element={component} />
+         <Route path="users/:name" element={<UserEdit />} />
+       </Routes>
+     </HashRouter>
+   );

...
    // Act
-   render(<NameCollection />);
+   renderWithRouter(<NameCollection />);
    ...
  });

  it('should remove initial list when it mounts the component and it resolves the async call', async () => {
    ...

    // Act
-   render(<NameCollection initialNameCollection={initialNameCollection} />);
+   renderWithRouter(
+     <NameCollection initialNameCollection={initialNameCollection} />
+   );

    ...
  });
});

```

- Vamos a comprobar que en efecto se navega a la segunda página cuando se pincha en el
  enlace, para ello simulamos el click en el enlace que queremos, esperamos que se
  ejecute y comprobamos que el componente se la segunda página se ha cargado.

### ./src/name-collection.spec.tsx

```diff
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
import * as api from './name-api';
import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

...
+ it('should navigate to second user edit page when click in second user name', async () => {
+   // Arrange
+   const getStub = jest
+     .spyOn(api, 'getNameCollection')
+     .mockResolvedValue(['John Doe', 'Jane Doe']);

+   // Act
+   renderWithRouter(<NameCollection />);

+   const links = await screen.findAllByRole('link');

+   const secondUser = links[1];
+   await userEvent.click(secondUser);

+   const userEditElement = screen.getByRole('heading', {
+     name: 'User name: Jane Doe',
+   });

+   // Assert
+   expect(userEditElement).toBeInTheDocument();
+ });

...

```

> NOTA: una ayuda para ir viendo que cambios se van aplicando al DOM
> en cada paso es utilizar `screen.debug()`

```diff
...
    const links = await screen.findAllByRole('link');

+   screen.debug()

    const secondUser = links[1];
    await userEvent.click(secondUser);

+   screen.debug()

    const userEditElement = screen.getByRole('heading', {
      name: 'User name: Jane Doe',
    });
...
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
