# 04 TDD

En este ejemplo vamos a ir implementando nuestra funcionalidad aplicando Test Driven Development.

Tomamos como punto de partida `03-debug`.

Un resumen de los pasos que vamos a realizar:

- Implementaremos una aplicación sencilla.
- Implementarmos un _mapper_ para convertir entidades, esto lo haremos siguiendo TDD:
  - Crearemos una prueba que falle.
  - Implementaremos código para que esa prueba pase.
  - Volvemos a crear nuevas pruebas que cubran más casos.
  - Volvemos a implementar código para que esas pruebas pasen (y así iremos iterando hasta que la funcionalidad esté completa)

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a eliminar todo el código previo que hemos realizado para implementar la prueba de calculadora.

  - `./src/business/calculator.business.ts`
  - `./src/business/index.ts`
  - `./src/calculator.spec.ts`
  - `./src/calculator.ts`
  - `./src/second.spec.ts`

- Vamos a implementar una aplicación simple que lea datos de la api rest que ofrece `github`, para ello:
  - Creamos un modelo de API (la que nos viene del endpoint de `github`).
  - Implementamos con axios un get para obtener datos (los miembros que pertenecen a Lemoncode).

### ./src/api-model.ts

```javascript
export interface Member {
  id: number;
  login: string;
  avatar_url: string;
}
```

### ./src/api.ts

```javascript
import Axios from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
  Axios.get(url).then((response) => response.data);
```

- Vamos a traernos hacer uso de este código en nuestra aplicación:

### ./src/app.tsx

```diff
import * as React from 'react';
+ import { getMembers } from './api';

export const App: React.FunctionComponent = () => {
+ React.useEffect(() => {
+   getMembers().then(members => {
+     console.log(members);
+   });
+ }, []);

  return <h1>05-Testing / 01 React</h1>;
};

```

- Run it:

```bash
npm start
```

- Si nos fijamos la rest api nos da un modelo dado, es muy común querer usar una entidad simplificada y orientada a la vista, vamos
  a crear un `view-model`

### ./src/view-model.ts

```javascript
export interface Member {
  id: string;
  login: string;
  avatarUrl: string;
}
```

- ¿Qué necesitamos ahora? Nos hace falta un `mapper` para transformar la entidad de tipo `api-model` a `view-model`. Como vamos a aplicar TDD, vamos
  a empezar a definir nuestras especificaciones.

### ./src/mapper.spec.ts

```javascript
describe('mapper specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- La primera, vamos a aplicar un poco de programación defensiva, si la api me pasa un _undefined_, yo te devuelvo un array vacío (esto nos simplifica
  como renderizar esta información con React), así que creamos la prueba.

### ./src/mapper.spec.ts

```diff
+ import * as apiModel from './api-model';
+ import * as viewModel from './view-model';

describe('mapper specs', () => {
- it('', () => {
+ it('should return empty array when it feeds undefined', () => {
    // Arrange
+   const members: apiModel.Member[] = undefined;

    // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

    // Assert
+   expect(result).toEqual([]);
  });
});
```

- Vamos a realizar una implementación mínima para que pase el test.

### ./src/mapper.ts

```javascript
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] => [];
```

- Para que el test pase añadimos el importa a nuestra funcionalidad, y ¡ya estamos en verde!, de momento...:

### ./src/mapper.spec.ts

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';
+ import { mapMemberListFromApiToVm } from './mapper';
...

```

- Siguiente caso, si me viene un nulo como valor te voy a devolver un array vacío (si vienes de Java verás que JavaScript es muy simpático
  tiene _undefined_ y _null_)

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds null', () => {
+   // Arrange
+   const members: apiModel.Member[] = null;

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

- Probamos y seguimos en verde, bien... siguiente caso

- Si te paso un array vacío me tienes que devolver un array vacío

### ./src/mapper.spec.ts

```diff
...

+ it('should return empty array when it feeds empty array', () => {
+   // Arrange
+   const members: apiModel.Member[] = [];

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+   // Assert
+   expect(result).toEqual([]);
+ });
});

```

- Bueno, más verde no esta mal, parece que ya casi estamos :), hemos cubierto los casos arista, vamos con el cogollo
  del asunto, si le paso un array con un elemento debería de devolverme un array con un elemento y los campos del viemodel,
  vamos a probar:

### ./src/mapper.spec.ts

```diff
...

+ it('should return array one mapped item when it feed array with one item', () => {
+   // Arrange
+   const members: apiModel.Member[] = [
+     { id: 1, login: 'test login', avatar_url: 'test avatar' },
+   ];

+   // Act
+   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+   // Assert
+   const expectedResult: viewModel.Member[] = [
+     {
+       id: '1',
+       login: 'test login',
+       avatarUrl: 'test avatar',
+     },
+   ];
+   expect(result).toEqual(expectedResult);
+ });
});

```

- Vamos a actualizar la implementación:

### ./src/mapper.ts

```diff
import * as apiModel from './api-model';
import * as viewModel from './view-model';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
- ): viewModel.Member[] => [];
+ ): viewModel.Member[] => members.map(member => mapMemberFromApiToVm(member));

+ const mapMemberFromApiToVm = (member: apiModel.Member): viewModel.Member => ({
+   id: member.id.toString(),
+   login: member.login,
+   avatarUrl: member.avatar_url,
+ });

```

- ¿Veis algo raro en este código? ¡Anda! tenemos los tests que parecen un arbol de navidad,
  hemos roto dos, ¿Qué ha pasado? Hemos sido muy agresivos con nuestra implementación y nos
  hemos cargado la guarda de valores `null` y `undefined`, vamos a arreglar esto, primero undefined:

### ./src/mapper.ts

```diff

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
- ): viewModel.Member[] => members.map(member => mapMemberFromApiToVm(member));
+ ): viewModel.Member[] =>
+   members !== undefined
+   ? members.map(member => mapMemberFromApiToVm(member))
+   : [];
...

```

- Y ahora el caso de `null`:

### ./src/mapper.ts

```diff
...

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] =>
-  members !== undefined
+  members !== undefined && members !== null
    ? members.map(member => mapMemberFromApiToVm(member))
    : [];
...

```

- Fíjate que interesante, podemos hacer refactors sin miedo ya que tenemos una batería de tests que nos respalda, es más podemos
  optimizar este código, y directamente utilizar el método [isArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)

### ./src/mapper.ts

```diff
...

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] =>
- members !== undefined && members !== null
+ Array.isArray(members)
    ? members.map(member => mapMemberFromApiToVm(member))
    : [];
...

```

- Esto de hacer tests está muy bien, pero a veces puede parecer que estamos repitiendo muchos código en
  nuestros casos de test ¿No habría forma de pasarle un array con entradas y otro con salidas esperadas?
  Esto lo podemos hacer si usamos [each](https://jestjs.io/docs/api#testeachtablename-fn-timeout) method.

> Nos podemos encontrar con algún problema si intentamos tipar arrays, en este caso podemos tirar de un casting a `any`

En este caso vamos a indicarle un array con las posibles entradas y en la función del test añadimos un parametro que
será el valor actual a tratar, de esta manera podemos eliminar tres de los casos que implementamos.

### ./src/mapper.spec.ts

```diff
...

describe('mapper specs', () => {
+ it.each<apiModel.Member[]>([undefined, null, []])(
+   'should return empty array when it feeds members equals %p',
+   (members: any) => {
+     // Arrange

+     // Act
+     const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

+     // Assert
+     expect(result).toEqual([]);
+   }
+ );

- it('should return empty array when it feeds undefined', () => {
-   // Arrange
-   const members: apiModel.Member[] = undefined;

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds null', () => {
-   // Arrange
-   const members: apiModel.Member[] = null;

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

- it('should return empty array when it feeds empty array', () => {
-   // Arrange
-   const members: apiModel.Member[] = [];

-   // Act
-   const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

-   // Assert
-   expect(result).toEqual([]);
- });

...

```

Con _jest_ _each_ también podemos tener un array con párametros de entrada y resultado esperado, más información
acerca de esto [documentación jest each](https://www.npmjs.com/package/jest-each#installation)

Sobre esta aproximación, no está exenta de polémica:

- Por un lado ahorramos código.
- Por otro lado algunas baterías de tests puede costar depurarlas y entenderlas,

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
