# 02 Calculadora

En este ejemplo vamos a crear un ejemplo básico con vanilla JavaScript
y poder así dar nuestros primeros pasos con Jest.

Tomamos como punto de partido el ejemplo `01-config`.

Resumen de los pasos que vamos a realizar:

- Vamos a crear una lógica de negocio tipo `calculadora`.
- Vamos añadirle pruebas unitarias.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a crear el fichero _calculator.ts_ en el que vamos a definir
  una función de suma:

### ./src/calculator.ts

```javascript
export const add = (a, b) => a + b;
```

- Vamos a renombrar el fichero `dummy.spec.ts` a `calculator.spec.ts`,
  y vamos a hacer lo siguiente:

  - Con describe creamos agrupaciones, vamos a crear una para el módulo
    (fichero) `calculator` y otra para la prueba unitaria `add` (esta cae
    dentro de _calculator_).

  - Después vamos a crear una prueba unitaria simple en la que comprobamos
    que si le pasamos dos numeros (valor a 2, valor b 2), devuelve 4.

A tener en cuenta:

Por un lado vamos a seguir una agrupación lógica para organizar nuestras
pruebas unitarias, definimos tres areas:

- Arrange: en este area hacemos el setup para ejecutar el test (valores de
  entrada, definición de mocks etc...)
- Act: aquí ejecutamos el código que queremos probar.
- Assert: aquí comprobamos que el código se ha ejecutado como esperabamos
  y vemos que los valores de salida son los esperados.

### ./src/calculator.spec.ts

```diff
+ import * as calculator from "./calculator";

- describe('dummy specs', () => {
+ describe("Calculator tests", () => {
+   describe("add", () => {
-     it('should pass spec', () => {
+     it("should return 4 when passing A equals 2 and B equals 2", () => {
        // Arrange
+       const a = 2;
+       const b = 2;

        // Act
+       const result = calculator.add(a, b);

        // Assert
-       expect(true).toBeTruthy();
+       expect(result).toEqual(4);
      });

-     it('should fail spec', () => {
-       // Arrange

-       // Act

-       // Assert
-       expect(true).toBeFalsy();
-     });
+  });
});

```

Fíjate que aquí usamos `toEqual` para comprobar que el resultado coincide
con el esperado, pero si nos vamos a la documentación de Jest, nos
encontramos con otros comparadores `toBe` y `toStrictEqual`, ¿Qué diferencias nos podemos encontrar?

- _ToEqual_: Aquí se realiza una comparación por valor por cada una de las propiedades y subpropiedades de los objetos
  a comparar (lo que se suele llamar un _deep equal_), es decir si los dos objetos tienen las mismas propiedades y valores
  aunque sean direcciones de memoria diferentes nos daría como valido, es decir `expect({ id: 1 }).toBe({ id: 1 });`
  nos daría true.

- _ToBe_: En este caso se compara por referencia, es decir el puntero del objeto contra el que comparamos tiene que
  ser el mismo que el original, en este caso `expect({ id: 1 }).toBe({ id: 1 });` daría falso, ya que son dos objetos
  distintos (a nivel de referencia de memoria), ¿Que si pasaría?

```ts
const obj1 = { id: 1 };
// Mismo puntero !!!
const obj2 = obj1;

expect(obj1).toBe(obj2);
```

- _ToStrictEqual_: Ojo este tiene en cuenta propiedades que tengan como valor \_undefined, por ejemplo:

Este caso pasaría:

`expect({ id: 1 }).toStrictEqual({ id: 1 });`

Este caso fallaría

`expect({ id: 1 }).toStrictEqual({ id: 1, name: undefined });`

- Vamos a empezar a meternos en faena, queremos pasarle a nuestra función de suma un parámetro adicional, en este
  caso de tipo función, y queremos comprobar que este parámetro se ha invocado dentro de la función.

En este caso el parámetro de tipo función que tenemos sólo lo invocaremos cuando el resultado de la suma sea menor
que cinco, veámoslo en código:

### ./src/calculator.ts

```diff
- export const add = (a, b) => a + b
+ export const add = (a, b, isLowerThanFive) => {
+   const result = a + b;

+   if (result < 5) {
+     isLowerThanFive(result);
+   }

+   return result;
+ }

```

- ¿Cómo podemos probar que _isLowerThanFive_ se invoca cuando por ejemple de decimos que suma 2 más 2? Utilizando
  un `spy`

Lo que hacemos ahora:

- Por un lado refactorizamos la prueba unitaria para que tenga en cuenta el tercer parámetro que hemos añadido.
- Por otro añadimos una nueva prueba en la que usamos el espía _jest.fn()_ y después comprobamos que se ha invocado.

### ./src/calculator.spec.ts

```diff
import * as calculator from "./calculator";

describe("Calculator tests", () => {
  describe("add", () => {
    it("should return 4 when passing A equals 2 and B equals 2", () => {
      // Arrange
      const a = 2;
      const b = 2;
+     const isLowerThanFive = () => {};

      // Act
-     const result = calculator.add(a, b);
+     const result = calculator.add(a, b, isLowerThanFive);

      // Assert
      expect(result).toEqual(4);
    });

+   it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
+     // Arrange
+     const a = 2;
+     const b = 2;
+     const isLowerThanFive = jest.fn();

+     // Act
+     const result = calculator.add(a, b, isLowerThanFive);

+     // Assert
+     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+   })
  });
});

```

> Todo verde, si quieres ver esto como falla, pon el valor `a = 3` y al ser el resultado mayor que cinco no
> se llamará a la función y nos fallará el test.

- Genial lo de meter un espía en una función que hemos creado, pero hay veces que esa función ya existe en otro
  módulo (fichero) y la importamos (para ello usamos el `import`), ¿Hay alguna forma de espiar una función que hayamos
  importado? Y... ¿Sería planteable incluso reemplazarla por una implementación que de un resultado fijo? Esto es último
  es útil cuando por ejemplo accedemos a una API Rest o una Base de datos, no queremos depender de un tercero y directamente
  probamos con valores fijos.

- Vamos a crear la función _isLowerThanFive_ como una dependencia externa (en un fichero separado), para ello creamos
  la carpeta _business_ y dentro de ella creamos un fichero que llamaremos _calculator.business.ts_

### ./src/business/calculator.business.ts

```javascript
export const isLowerThanFive = (value) => {
  console.log(`The value: ${value} is lower than 5`);
};
```

- Para ser ordenados nos creamos un barrel (el _index.ts_) donde exportaremos el contenido que veamos oportuno
  de la carpeta business (en este caso _calculartor.business.ts_).

### ./src/business/index.ts

```javascript
export * from './calculator.business';
```

- En este caso eliminamos el tercer parámetro de la función, y directamente importamos la función _isLowerThanFive_
  de la carpeta _business_ y la utilizamos tal cual:

### ./src/calculator.ts

```diff
+ import { isLowerThanFive } from './business';

- export const add = (a, b, isLowerThanFive) => {
+ export const add = (a, b) => {
  const result = a + b;

  if(result < 5) {
    isLowerThanFive(result);
  }

  return result;
}

```

- Vamos al lado de las pruebas:
  - En el primer caso refactorizamos para eliminar el tercer parámetro.
  - En el segundo caso viene la parte interesante, ahora queremos espiar a la función _isLowerThanFive_ que viene importada de otro
    módulo para ello utilizamos un `stub`

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
+ import * as business from './business';

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.fn();

      // Act
-     const result = calculator.add(a, b, isLowerThanFive);
+     const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4)
    })

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.fn();
+     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive');

      // Act
-     const result = calculator.add(a, b, isLowerThanFive);
+     const result = calculator.add(a, b);

      // Assert
      expect(isLowerThanFive).toHaveBeenCalled();
      expect(isLowerThanFive).toHaveBeenCalledWith(4);
    })
  })
})

```

- Si ejecutamos ahora nos encontramos que... aagggh !! ¡ El Test falla !, vamos a ver que mensaje de error recibimos:
  `TypeError: Cannot redefine property: isLowerThanFive`, esto se debe a un fallo que tiene Jest manejando _exports_ y barrels,
  podemos encontrarnos bastantes issues abiertos al respecto, y todos cerrados sólo por falta de interacción, por ejemplo:
  [Issue index.ts y barrel](https://github.com/facebook/jest/issues/880)

¿Qué podemos hacer para solucionarlo? En vez de tirar del barrel, en este caso tiramos de importar el fichero en concreto
_./business/calculator.business_

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
- import * as business from './business';
+ import * as business from './business/calculator.business';

...

```

> Si nos fijamos en la consola, podemos ver que el `stub` que hemos creado no reemplaza a la función original, ¿Qué pasa
> directamente queremos que devuelva un valor y no ejecute la función real? Para ello podemos hacer _mock_ de la función, veamos como:

- Utilizando `mockImplementation` podemos sustituir a la función original por otra que devuelva el valor que queramos para poder
  probar nuestro caso, en este caso para ver que estamos ejecutando la función mock, sacamos un mensaje para la consola del navegador.

### ./src/calculator.spec.ts

```diff
...

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive');
+     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive')
+       .mockImplementation((result) => console.log(`[Mock] This is the result ${result}`));

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(isLowerThanFive).toHaveBeenCalled();
      expect(isLowerThanFive).toHaveBeenCalledWith(4);
    })

```

- ¡ Ojo ! Una vez que asociamos un mock a una función, no se nos puede olvidar resetearlos, si no se quedan
  "pillados" y se ejecutan en otros tests, por ejemplo:

### ./src/calculator.spec.ts

```diff
...

+   it('should call to original implementation isLowerThanFive', () => {
+     // Arrange
+     const a = 1;
+     const b = 2;

+     // Act
+     const result = calculator.add(a, b);

+     // Assert
+     expect(result).toEqual(3);
+   });

```

> console.log
> [Mock]This is the result 3

- Una opción que podemos implementar es indicarle que después de cada test ejecute _jest.restoreAllMocks()_:

### ./src/calculator.spec.ts

```diff
...

describe('Calculator tests', () => {
+ afterEach(() => {
+   jest.restoreAllMocks();
+ });

  describe('add', () => {
...

```

Cómo esto es algo muy común y sería muy pesado escribirlo en cada fichero de spec que creemos, `Jest`nos
ofrece un parámetro de configuración _restoreAllMocks_ que hace eso por nosotros.

### ./config/test/jest.js

```diff
module.exports = {
  rootDir: '../../',
  verbose: true,
+ restoreMocks: true,
};

```

> [Jest configuration options](https://facebook.github.io/jest/docs/en/configuration.html#options)

### ./src/calculator.spec.ts

```diff
...

describe('Calculator tests', () => {
- afterEach(() => {
-   jest.restoreAllMocks();
- });

  describe('add', () => {
...

```

> Cómo hemos modificado el config, paramos y volvemos a ejecutar de nuevo `npm run test:watch` y podemos ver que ahora funciona como esperábamos.

- Para finalizar, imagínate que tenemos un módulo con varios export, podríamos hacer un mock para cada uno de ellos, o también Jest nos ofrece
  la opción de aplicar mocking al módulo entero, vamos añadir un par de exports a nuestro `calculator.business`:

### ./src/business/calculator.business.ts

```diff
- export const isLowerThanFive = (value) => {
+ export const isLowerThan = (value, max) => {
- console.log(`The value: ${value} is lower than 5`)
+ console.log(`The value: ${value} is lower than ${max}`)
}

+ export const max = 6

```

- Vamos a usar el nuevo export en nuestro `calculator.ts`:

### ./src/calculator.ts

```diff
- import { isLowerThanFive } from './business'
+ import { isLowerThan, max } from './business'

export const add = (a, b) => {
  const result = a + b;

- if(result < 5) {
+ if(result < max) {
-   isLowerThanFive(result);
+   isLowerThan(result, max);
  }

  return result;
}

```

- Y ya que estamos en los spec vamos a aplicar _mocking_ al módulo entero (tanto `isLowerThan` cómo `max`)

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
import * as business from './business/calculator.business';

+ jest.mock('./business/calculator.business', () => ({
+   isLowerThan: jest.fn().mockImplementation(() => {
+     console.log('Another implementation');
+   }),
+   max: 7,
+ }));

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4)
    })

-   it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
+   it('should call to isLowerThan when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive')
-       .mockImplementation((result) => console.log(`This is the result ${result}`));

      // Act
      const result = calculator.add(a, b);

      // Assert
-     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(business.isLowerThan).toHaveBeenCalled();
-     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+     expect(business.isLowerThan).toHaveBeenCalledWith(4, 7);
    })

-   it('should call to original implementation isLowerThanFive', () => {
+   it('should call to original implementation isLowerThan', () => {
      // Arrange
      const a = 1;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(3);
    });
  })
})

```

> Si cambiamos el valor de mock de `max` podemos ver como el test falla.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
