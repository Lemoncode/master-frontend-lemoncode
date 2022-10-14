# 01 Hello

Probar código en vanilla javascript y lógica de negocio está muy bien, pero en Front End tenemos
también componentes de interfaz de usuario, toca arremangarnos y ponernos a probar React :).

En este ejemplo haremos el setup de react testing library y crearemos un test simple sobre
un componente que mostrará un _h1_

Tomamos como punto de partida `00-boilerplate`.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a instalar [react-testing-library](https://github.com/testing-library/react-testing-library)

```bash
npm install @testing-library/react -D
```

- Creamos un componente sencillo que simplemente va a aceptar como prop un nombre, y va a mostrar
  un h1 saludando a esa persona.

### ./src/say-hello.tsx

```javascript
import React from 'react';

interface Props {
  person: string;
}

export const SayHello: React.FunctionComponent<Props> = (props) => {
  const { person } = props;
  return <h1>Hello {person}</h1>;
};
```

- Vamos a añadir nuestra primera prueba, para ello instanciamos el componente que acabamos de crear, y comprobamos
  que nos devuelve un _h1_ que tiene el nombre de la persona que le estamos pasando como prop.

¿Qué hacemos?

- Con _render_ pintamos el componente.
- Con _getByText_ obtenemos el elemento _h1_ asociado haciendo una busqueda por texto.
- Sobre ese elemento hacemos una serie de comprobaciones, si existe, y si es un _h1_ (no tenemos que comprobar el texto ya que esto lo hemos hecho
  al realizar la búsqueda de _getByText_)

### ./src/say-hello.spec.tsx

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
    const { getByText } = render(<SayHello person={person} />);

    // Assert
    const element = getByText('Hello John');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });
});
```

- Vamos a ejecutar el test:

```bash
npm run test:watch

```

- Y.... ¡El test falla! ¿Por qué? por que por defecto el `jest running environment` es NodeJS, y si queremos
  probar UI nos hace falta tirar de un DOM, nos hace falta tirar de `jsdom`, que a partir de
  [jest v28](https://jestjs.io/docs/upgrading-to-jest28#jsdom) lo tenemos que instalar aparte (lo han sacado
  del core de `Jest`)

```bash
npm install --save-dev jest-environment-jsdom
```

### ./config/test/jest.js

```diff
module.exports = {
  rootDir: '../../',
  verbose: true,
  restoreMocks: true,
+ testEnvironment: 'jsdom',
};

```

> [Jest Docs](https://jestjs.io/docs/configuration#testenvironment-string)
>
> [jsdom Docs](https://github.com/jsdom/jsdom)

- Vamos a darle caña a los test:

```bash
npm run test:watch
```

Ahora si, ... verde :)

- Probar así igual te puede parecer un poco "farragoso", así que puede que estés pensando en
  atajos, bueno... los chicos de Jest se sacaron de la manga los `snapshot testing`, ¿Cómo funcionan?

  - Tu haces una primera ejecución de tu componente.
  - Guardas el HTML resultante.
  - La próxima vez que ejecutes el test se comprueba que el HTML sigue siendo el mismo.
  - Si Hay cambios falla y tienes tu que comprobar si es que hay un fallo o si es que se ha actualizado
    el componente.

¿A qué te sientes como si estuvieras haciendo trampas? Pues un poco, puede llevar a problemas, lo que si
que es rápido de implementar y te sube la cobertura de tu código (lo que mal usado puede servir sólo
para engañarte a ti mismo).

- Veamos como funciona en código:
  - Hago un render.
  - Le digo que lo compare con el snapshot anterior en el expect (si no hubiera fragmento anterior este se crear por primera vez)

### ./src/say-hello.spec.tsx

```diff
...

+ it('should display the person name using snapshot testing', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { asFragment } = render(<SayHello person={person} />);

+   // Assert
+   expect(asFragment()).toMatchSnapshot();
+ });

```

- Fíjate que se genera un fichero asociado al test que tiene el _html_ esperado para ese test, esto
  lo tenemos que subir a nuestro repositorio de código fuente.

### ./src/\_\_snapshots\_\_/say-hello.spec.tsx.snap

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`SayHello component specs should display the person name using snapshot testing 1`] = `
<DocumentFragment>
  <h1>
    Hello John
  </h1>
</DocumentFragment>
`;

```

- Si no nos gusta la idea de tener el resultado del test en un fichero aparte, podemos indicarle
  a Jest que lo ponga en línea en el mismo test (`inline snapshots`), fijate que curioso este código:
  - De primeras en _toMatchInlineSnapshot_ no ponemos nada, y una vez que ejecutemos,
    añade el snapshot como parámetro.

### ./src/say-hello.spec.tsx

```diff
...

+ it('should display the person name using inline snapshot testing', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { asFragment } = render(<SayHello person={person} />);

+   // Assert
+   expect(asFragment()).toMatchInlineSnapshot();
+ });

```

- Este tipo de tests pueden estar bien si sabemos que el interfaz de usuario va a cambiar poco, podemos dejar un snapshot revisar manualmente que
  está bien y ya dejarlo ahí.

- ¿Qué pasa con esto? Pues que en escenario más complejos nos podemos volver locos evaluando si ese _html_ es el esperado, y además que podemos
  caer en la tentación de decirle "tira para adelante y da como bueno el nuevo snapshot" si algo falla, y revisar, revisar... poco.

- Dejemos los snapshot testing y volvamos a probar como al inicio de este tutoríal, react testing library nos ofrece
  [jest-dom](https://github.com/testing-library/jest-dom), que nos hace un poco más fácil poder implementar nuestras pruebas, nos
  da un conjunto de `jest matchers` que nos permite escribir un código de forma más declarativa y se hace más fácil poder leer
  los `expects`, vamos a instalar esta librería

```bash
npm install @testing-library/jest-dom --save-dev
```

- La configuramos:
  - Nos creamos un fichero en el que indicamos que se import dicha librería para todos los tests.
  - En la configuración de testing de nuestro proyecto le indicamos que incluya ese fichero en la lista de ficheros
    de setup que se tienen que ejecutar justo después de que se haya montado el entorno de test.

### ./config/test/setup-after.ts

```javascript
import '@testing-library/jest-dom';
```

- Update `jest` config:

### ./config/test/jest.js

```diff
module.exports = {
  rootDir: '../../',
  verbose: true,
  restoreMocks: true,
  testEnvironment: 'jsdom',
+ setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
};

```

> [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array)
> Así nos aseguramos que se crea después de que el entorno esté levantado.

- Vamos a hacer uso de unos de los atajos de `testing library jest-dom`, en este
  caso vamos a comprobar si el elemento está el presente en el DOM para ello usaremos
  `toBeInDocument`

### ./src/say-hello.spec.tsx

```diff
...

+ it('should display the person name using jest-dom', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { getByText } = render(<SayHello person={person} />);

+   const element = getByText('Hello John');

+   // Assert
+   expect(element).toBeInTheDocument();
+ });

```

- Toca optimizar como usar `react-testing-library`, en este enlace te explican bienas prácticas: [best practices using react-testing-library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library), una de ellas es que usemos `screen`:

> ¿Qué ventaja obtenemos usando `screen`? Pues que no te hace falta ir haciendo destructuring del `render` y puedes ir añadiendo y eliminando
> querys conforme las necesites.

- Veamos cómo funciona esto

### ./src/say-hello.spec.tsx

```diff
import React from 'react';
- import { render } from '@testing-library/react';
+ import { render, screen } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
-   const { getByText } = render(<SayHello person={person} />);
+   render(<SayHello person={person} />);

    // Assert
-   const element = getByText('Hello John');
+   const element = screen.getByText('Hello John');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });

  ...

  it('should display the person name using jest-dom', () => {
    // Arrange
    const person = 'John';

    // Act
-   const { getByText } = render(<SayHello person={person} />);
+   render(<SayHello person={person} />);

-   const element = getByText('Hello John');
+   const element = screen.getByText('Hello John');

    // Assert
    expect(element).toBeInTheDocument();
  });
});

```

- Otra opción que tenemos es usar `getByRole` en vez de `getByText`, esto nos va a permitir por ejemplo localizar
  un `heading` o un `button` por su `aria-label`

- Using `getByRole`:

> Más info acerca de [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) > [Que tipo de query usar en React Testing Library](https://testing-library.com/docs/guide-which-query)

Para ver esto en acción vamos a modificar el código de nuestro componente, en el _h1_ añadimos un tag _strong_ para mostrar en negrita el nombre
de la persona.

### ./src/say-hello.tsx

```diff
import React from 'react';

interface Props {
  person: string;
}

export const SayHello: React.FunctionComponent<Props> = (props) => {
  const { person } = props;
- return <h1>Hello {person}</h1>;
+ return <h1>Hello <strong>{person}</strong></h1>;
};

```

- ¡Upa!, si ahora ejecutamos los tests nos fallan, vamos a ponernos a arreglarlos.

- Primero, cerremos los ojitos y actualizemos los test de snapshot, nada le damos a la `u`en el terminal y a tirar millas
  (en la vida real seríamos buenos boy scouts y chequearíamos al milímetro que el _html_ generado es el esperado ¿Verdad?)

- Pero ahora los specs implementados con `react testing library` fallan, porque al usar _strong_ dentro del _h1_ el texto se rompe
  en multiples elementos _html_, para paliar esto podemos utilizar `getByRole`, una función más flexible, además esto también nos
  probar lectores de pantalla.

### ./src/say-hello.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
    render(<SayHello person={person} />);

    // Assert
-   const element = screen.getByText('Hello John');
+   const element = screen.getByRole('heading', { name: 'Hello John' });
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });

  ...

  it('should display the person name using jest-dom', () => {
    // Arrange
    const person = 'John';

    // Act
    render(<SayHello person={person} />);

-   const element = screen.getByText('Hello John');
+   const element = screen.getByRole('heading', { name: 'Hello John' });

    // Assert
    expect(element).toBeInTheDocument();
  });
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
