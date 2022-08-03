# 02 Name Edit

Ya hemos implementado pruebas unitarias en nuestro primero componente de React, toca dar un pasito
más ¿Qué pasa cuando interactuamos con evento? Por ejemplo si queremos comprobar que al introducir
datos en un input estos se reflejan en sus entidades correspondientes, vamos a implementar
un ejemplo en el que crearemos un componente que nos permitirá editar un campo nombre.

Tomamos como punto de partida `01-hello`.

Un resumen de los pasos que vamos a implementar:

- Vamos a mostrar un nombre.
- Vamos a mostrar un input para editar el nombre.
- Vamos a interactuar con los eventos del DOM (`onChange`)

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a crear un componente que llamaremos _name-edit_, en este
  componente mostraremos un nombre y añadiremos un _input_ para que el usuario
  pueda cambiarlo.

### ./src/name-edit.tsx

```javascript
import React from 'react';

export const NameEdit: React.FunctionComponent = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
      <h3>{userName}</h3>
      <input value={userName} onChange={(e) => setUserName(e.target.value)} />
    </>
  );
};
```

- Instanciamos el componente en nuestra aplicación.

### ./src/app.tsx

```diff
import React from 'react';
+ import { NameEdit } from './name-edit';

export const App: React.FunctionComponent = () => {
- return <h1>05-Testing / 01 React</h1>;
+ return (
+   <>
+     <h1>05-Testing / 01 React</h1>
+     <NameEdit />
+   </>
+ );
};

```

- Vamos a implementar un test, en este caso queremos probar la interacción con del DOM, es decir:

  - Pintamos el componente _NameEdit_
  - Obtenemos una referencia al elemento _input_ del componente.
  - Lanzamos un evento de actualización en el input (es decir simulamos que el usuario está tecleando un nombre).
  - Chequeamos que la etiqueta _h1_ que muestra el nombre del componente actualiza con el nuevo _nombre_ propuesto
    en el _input_.

- Para empezar, vamos a intentar obtener el _h1_ y el _input_ utilizando `getByText`, vamos a crear el spec.

### ./src/name-edit.spec.tsx

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a label and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const h3Element = screen.getByText('');

    // Assert
  });
});
```

> Esto va a a fallar, ¿Por qué? Porque buscando por string vacío encuentra multiples elementos
> Podríamos intentar usar `getAllByText` que nos devolvería un array de elementos, pero aún así
> nos complicamos la vida, mejor seguir las recomendaciones de React Testing library, y empezar
> por identificarlo por Role.

- Vamos a usar `byRole`:
  - Para el _h1_ lo identificamos con el role _heading_.
  - Para el input lo identificamos con el role _textbox_.

### ./src/name-edit.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a label and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

-   const h3Element = screen.getByText('');
+   const h3Element = screen.getByRole('heading', { level: 3 });
+   const inputElement = screen.getByRole('textbox');

    // Assert
+   expect(h3Element).toBeInTheDocument();
+   expect(inputElement).toBeInTheDocument();
  });
});

```

- Bueno ya estamos probando que ambos elementos se renderizan correctamente, vamos a por el siguiente paso.

- El h3 se debería de actualizar cuando el _input_ cambia, `React Testing Library` nos ofrece una función
  para hacer esto: `fireEvent`, esta función lanza un evento sobre un elemento, [está funcionalidad nos
  puede dar algún problema](https://github.com/testing-library/react-testing-library/issues/322), así
  que vamos a instalarnos [@testing-library/user-event](https://github.com/testing-library/user-event)
  que es una librería que está construida sobre la base de `fireEvent`, pero nos da varios métodos
  que nos permiten trabajar mejor.

```bash
npm install @testing-library/user-event @testing-library/dom --save-dev
```

¿Qué hacemos aquí? Lanzamos el evento de actualización en el input (`type`), este evento es
asíncrono, así que metemos un `await` para que espere a que se complete y ya realizamos
la comprobación de que el h3 se actualiza con el nuevo nombre.

### ./src/name-edit.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
import { NameEdit } from './name-edit';

...
+ it('should update h3 text when input changes', async () => {
+   // Arrange

+   // Act
+   render(<NameEdit />);

+   const inputElement = screen.getByRole('textbox') as HTMLInputElement;

+   await userEvent.type(inputElement, 'John');
+   const h3Element = screen.getByRole('heading', { level: 3 });

+   // Assert
+   expect(inputElement.value).toEqual('John');
+   expect(h3Element.textContent).toEqual('John');
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
