# 01 Configuración

En este ejemplo vamos a añadir una configuración básica para poder
empezar a trabajar Jest y testing.

Tomamos como punto de partido `00-boilerplate`.

Resumen de los pasos que vamos a realizar:

- Instalaremos `jest`.
- Añadiremos la configuración mínima necesaria (empezaremos por añadirlo
  al package.json ).
- Creamos un test de prueba.
- Para finalizar realizaremos las tareas de configuración en un fichero
  externo, así se nos queda una solución más mantenible.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto de boiler plate:

```bash
npm install
```

# Librerías

Vamos a instalar los siguiente paquetes:

- [Jest](https://github.com/facebook/jest): es la librería principal
  que usaremos para hacer testing (tiene runners para lanzar tests, asertos,
  mocking...).
- [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/df38f202a0185eadfb6012e47dd91f8975eb6151/types/jest): Los typings para
  Jest, esto es de gran ayuda si estás trabajando con TypeScript (con ES6
  no te hace falta).

- [ts-jest](https://github.com/kulshekhar/ts-jest): Un preprocesador de
  TypeScript con soporte a source maps (nos mejora la experiencia de integración
  de Jest con TypeScript).

```bash
npm install jest @types/jest --save-dev
```

> Si estás usando `@babel/preset-typescript` opcionalmente te
> puedes instalar `ts-jest` > [Documentación oficial](https://jestjs.io/docs/getting-started)

> Nota: Ojo si tienes instalada una versión muy antigua de nodejs, [a partir de la versión jest v26.x ya no soporta Node 8](https://github.com/facebook/jest/releases/tag/v26.0.0)

# Configuración

Vamos a definir una seria de comandos básicos en nuestro package.json
(podrías llamarlos de otra manera pero es aconsejable ser consistente
con los nombre):

- `npm test`: este comando lo utilizaremos cuando queramos ejecutar las
  pruebas unitarias de un proyecto una sola vez (esto puede ser útil si
  por ejemplo estás en un entorno de integración continua y quieres ejecutar
  las pruebas una sola vez y quieres continuar con el proceso si han tenido
  éxito)
- `npm run test:watch`: este comando ejecutar las pruebas unitarias y
  se quedará esperando a que se introduzca algún cambio en el código fuente
  de la aplicación, en cuanto detecte uno vuelve a lanzar las pruebas de
  forma automática, esta aproximación es muy útil usarla cuando estás
  desarrollando en tu máquina local, ya que te puede ir avisando si tocando
  una cosa has podido romper otra.

Cuando ejecutamos _jest_ tenemos un montón de comandos disponibles, en el
sitio oficial puedes encontrar todos los comandos disponibles,[Jest CLI options](https://facebook.github.io/jest/docs/en/cli.html#options).

Los que vamos a usar nosotros:

--watchAll para que cuando haya un cambio se vuelvan a ejecutar TODOS
la batería de tests..

--watch para que cuando haya un cambio sólo se ejecuten los tests relacionados
con el cambio realizado.

--verbose te muestra la ejecución de cada test dentro la jerarquía
de la test suite.

-i or --runInBand te ejecuta los tests de forma secuencia, en vez de
crear un worker pool de procesos hijos que ejecuta tests. Esto hace
que tu batería de test tarde más en ejecutarse, pero tu puede ser útil
para depurar, o detectar si puedes haber introducido condiciones de carrera
de forma accidental.

Vamos a definir estos comandos en nuestro package.json

### ./package.json

```diff
{
  ...
  "scripts": {
    ...
-   "clean": "rimraf dist"
+   "clean": "rimraf dist",
+   "test": "jest --verbose",
+   "test:watch": "npm run test -- --watchAll -i"
  },
  ...
}
```

# Añadiendo un test de prueba

- Vamos a arrancar jest en modo _escucha_ es decir se queda
  pillado esperando a que realicemos algún cambio en algún
  fichero y vuelve a lanzar los tests:

```bash
npm run test:watch
```

- Vamos a añadir una prueba unitaria tonta que se ejecute
  con éxito:

### ./src/dummy.spec.ts

```javascript
describe('dummy specs', () => {
  it('should pass spec', () => {
    // Arrange

    // Act

    // Assert
    expect(true).toBeTruthy();
  });
});
```

- Y ahora vamos a simular una que de un fallo:

### ./src/dummy.spec.ts

```diff
describe('dummy specs', () => {
  it('should pass spec', () => {
    // Arrange

    // Act

    // Assert
    expect(true).toBeTruthy();
  });

+ it('should fail spec', () => {
+   // Arrange

+   // Act

+   // Assert
+   expect(true).toBeFalsy();
+ });
});
```

# Configuración en fichero externo

En cuanto nos metemos a trabajar con Jest nos va hacer falta
añadir ciertos parámetros de configuración, esto lo podemos
hacer directamente en nuestro fichero _package.json_ pero
en un proyecto real podemos acabar con un fichero poco mantenible,
lo ideal es que saquemos esta configuración a un fichero externo
y es más, lo incluyamos dentro de una subcarpeta para no
polucionar en exceso el directorio raíz del proyecto.

> Vamos a trabajar con un subconjunto pequeño de opciones de configuración
> si quiere ver la lista completa, la puedes encontrar en la documentación
> oficial: [opciones de configuración de Jest](https://facebook.github.io/jest/docs/en/configuration.html#options)

- Vamos a crear un fichero dentro de la ruta _config/test_ y lo llamaremos
  `config/test/jest.js`, ¿Qué contenido vamos a añadir?

- Como lo hemos colocado en dos niveles de carpetas, tenemos que indicarle
  donde está el directorio raíz, esto lo hacemos configurando el parametro
  _rootDir_ para indicarle que apunte dos niveles más arriba.

- Para ver algún parámetro adicional de configuración, vamos a utilizar
  el _verbose_ y lo pondremos a true (así nos sale mucha información por la
  consola cuando ejecutemos la batería de pruebas).

### ./config/test/jest.js

```js
module.exports = {
  rootDir: '../../',
  verbose: true,
};
```

> Más adelante prueba poner `verbose: false` y verás la diferencia
> Iremos añadiendo más parámetros de configuración en este fichero
> conforme nos vayan haciendo falta

- Ya tenemos el fichero de configuración, ahora en el comando de _test_
  del nuestro _package.json_ tenemos que indicarle que use ese fichero
  como fichero de configuración, para ello utilizamos el flag _-c_ de
  configuración y le indicamos la ruta del fichero:

### ./package.json

```diff
{
  ...
  "scripts": {
    ...
-   "test": "jest --verbose",
+   "test": "jest -c ./config/test/jest.js",
    "test:watch": "npm run test -- --watchAll -i"
  },
  ...
}
```

- Ahora podemos volver a ejecutar los tests de nuevos, si quieres
  puede probar a para los tests cambiar la configuración de _verbose_
  y ver como cambie el resultado:

```bash
npm run test:watch
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
