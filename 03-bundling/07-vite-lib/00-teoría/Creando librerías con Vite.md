# Creando librerías con Vite

[Link al repo](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/03-bundling/07-vite-lib)

## Conceptos

Antes de meternos de lleno en lo que es Vite en modo librería vamos a ver qué es lo que nos ofrece el estándar para poder crear y consumir librerías. Al final son los gestores de paquetes los encargados de descargar, instalar y publicar las librerías en nuestros proyectos. Éstas librerías se pueden configurar de tal manera que puedan ser usadas en el navegador o en Node. Como gestor oficial de paquetes tenemos `npm` pero también tenemos otros gestores de paquetes alternativos como `yarn` y `pnpm`.

Cosas que ofrecía Yarn:

- Era más rápido al instalar paquetes que `npm`.
- Definió en su día el `yarn.lock`, el fichero "lock" para crear un entorno reproducible asegurándose de instalar siempre las mismas versiones.
- Tenía una resolución de conflictos más efectia que `npm`.
- Ejecuta ciertas operaciones en paralelo a diferencia de `npm`
- Implementó el sistema de workspaces antes que `npm`.
- Modo offline
- Comprobación de checksum (integridad)

Cosas que ofrecía `pnpm`:

- Eficiencia en disco a la hora de almacenar dependencias
- Más rápido que `npm`

## Versionado

Conforme va avanzando el ciclo de vida de la librería y se van introduciendo cambios, ¿cómo gestiono el control de versiones?

Para ello se utiliza el estandar de SEMVER, donde define principalmente tres bloques de números:

- El último es `patch`, y debería de ser aumentado cuando hay pequeños cambios que no afectan a la funcionalidad de la librería, como bugfixes, documentación,
- El intermedio `minor`, debería de ser aumentado cuando se añaden características
- El primero `major`, debería de ser aumentado con breaking changes, con cosas que rompen la compatibilidad con versiones anteriores como cambios de la API existentes, cambios en el soporte de los entornos de ejecución..

Si nosotros como consumidores de librerías lo que más debería de importarnos es el actualizar de "major", ya que es posible que parte de la funcionalidad que estemos usando haya cambiado y tengamos que aplicar cambios en nuestro código para adaptarnos a la nueva API.

Importante: Ninguna librería te asegura que siga firmemente la semántica de SEMVER. Intentan cumplirlos siempre, pero siempre puede haber fallos por parte de los creadores.

- [https://semver.npmjs.com/](https://semver.npmjs.com/)
- [https://medium.com/javascript-scene/software-versions-are-broken-3d2dc0da0783](https://medium.com/javascript-scene/software-versions-are-broken-3d2dc0da0783)

Probar en semver.npmjs.com

- lodash ^1.0.0
- lodash ~1.0.0

## ¿Dónde recupero cada versión?

Cuando utilizamos queremos instalar una librería, en este caso cuando quiero instalar como en ese ejemplo react `^18.1.0`, el gestor de paquetes se encarga de comunicarse con el repositorio de paquetes de npm y de traerte la mayor versión disponible en base al tag de SEMVER que tengamos definido en nuestro proyecto.

## ¿Instalar librerías en local?

¿Qué ocurre si nosotros estamos desarrollando estas librerías y no las hemos pulbicado? Cómo puedo instalar esa librería en local? ¿Cómo puedo probar que estoy añadiendo los ficheros finales y que se instalan correctamente?

Tenemos varias opciones:
`npm link`. Es la forma más artesanal porque lo que hace es, mediante un proceso de dos pasos, generar un enlace simbólico crear un enlace simbólico.

Para ello te tienes que ir al directorio del proyecto librería y ejecutar `npm link`. Y con eso lo que conseguimos es como añadir nuestro paquete al listado de paquetes instalados de forma global. Podemos verlo haciendo `npm list -g`.

Luego tendríamos que irnos al proyecto que consume esa librería y ejecutar `npm link nombre-librería` y eso te instala la librería a node_modules como enlace simbólico.

El problema de esta aproximación es que la librería no queda reflejada en la definición de dependencias del proyecto, por lo que si eliminamos node_modules y hacemos `npm install` perderemos dicho enlace, a menos que usamos el `npm link my-lib --save`. Además de instalar de forma global la librería.

File la haríamos de forma manual al segundo paso `npm link <lib> --save`

Los workspaces son muy parecidos a "file"

## package.json

Es importante conocer las propiedades del package.json. La mayoría la conoceis.

- author puede ser un objeto
-

Esta información es importante porque estos van a ser publicados y visibles en el registry de NPM. Incluir un README.md en formato markdown también se reflejará en la web de NPM.

Ejemplo: [@lemoncode/fonk](https://www.npmjs.com/package/@lemoncode/fonk)

## Entrypoints

Además de los campos que ya hemos visto existen otros campos que definen los puntos de entrada. Algunos son oficiales y otros fueron itroducidos por bundlers para poder trabajar mejor con las librerías.

- main: define el punto de entrada de la librería y defina la ruta al index que expone la funcionalidad principal
- browser: define el punto de entrada de la librería, en caso de que vaya a ser consumida por un navegador. De esta manera podemos tener un punto de entrada distinto si nuestra librería trabaja de forma diferente en node o en el browser.
- module: se ha convertido en estandar para los bundlers para indicar los ficheros expuestos en formato ESModules.
- types: define la ruta a los ficheros de definiciones de tipos. Ideal para librerías en TypeScript.
- exports: la forma oficial de definir en diferentes formatos de módulos nuestra librería, a diferencia de los anteriormente mencionados que inventaron los bundlers. Te permite definir múltiples puntos de entrada para diferentes módulos. [package entry points](https://nodejs.org/api/packages.html#package-entry-points)
- type: define de forma oficial si tu módulo está definido como ESM o CommonJS. Con `"type": "module"` los ficheros terminados en `.js` son interpretados como ESModules. NodeJS por defecto interpreta el codigo como CommonJS

En los "exports" pueden haber [condicionalmente](https://nodejs.org/api/packages.html#conditional-exports):

- "node-addons" - Como "node" pero para los addons.
- "node" - Punto de entrada para NodeJS. El formato puede ser tanto CJS como ESM.
- "import" - Punto de entrada para ESM
- "require" - Punto de entrada para CJS
- "default" - Fallback (CJS/ESM). Debe ser definido el último.

NodeJS añade otros no oficiales en la doc a tener en cuenta: [Community Conditions Definitions](https://nodejs.org/api/packages.html#community-conditions-definitions)

## Demos

- [import from "lib" en navegador](https://github.com/WICG/import-maps#packages-via-trailing-slashes)

## Vite library mode

Vamos a ver las librerías que utilizaremos y los bundlers para crear nosotros nuestras propias librerías. Hemos hablado de Rollup como bundler para librerías tanto de JS como de TS. Para aplicaciones web siempre ha predominado de Rollup. Hemos visto que Vite utiliza Rollup por debajo para las builds de producción y que podemos utilizar la configuración y plugins de Rollup para poder crear librerías y aprovechar su potencia.

## A tener en cuenta

Cuando creamos librerías tenemos que tener en cuenta el target. Si va a estar destinada para el navegador.. o para node o ambos, depende de vuestro proyecto. Ya habéis visto que podemos ir jugando con los puntos de entrada.. o usar los exports configurando los targets para los diferentes sistemas de módulos.

Además tenéis que tener en cuenta las dependencias y las peerDependencies. Las peerDependencies son dependencias que deben ser instaladas en el entorno de ejecución o aplicación para que tu librería puede funcionar. El propósito de las peerDependencies son especificar dependencias que se necesitan pero que no están incluídas en el bundle. A partir de la versión 7 de npm son instaladas automáticamente al hacer un npm install.

Ojo que NPM no auto instala las peerDependencies con paquetes locales (mira el [issue](https://github.com/npm/cli/issues/5108))

También si creais librerías de componentes teneis que tener en cuenta la API, la flexibilidad a la hora de modificar el comportamiento de cada pieza e incluso los estilos... si van a ser CSS global, CSS in JS, módulos CSS, etc.

Por último tener en cuenta la publicación de la librería. Si queremos que sea de acceso público a todo internet o privado. Para tenerlo privado sabed que tenemos varios proveedores y cada uno con su sistema de precios.. por ejemplo el propio registry de npm permite tener una cuenta y organización de pago.. otros como gitlab y github también ofrecen un registry privado donde publicar nuestros paquetes.. o incluso tenemos mediante software de terceros más artesanal el poder tener nuestro registry privado y gestionado por nosotros, algunos gratuítos como verdaccio o hasta de pago como artifactory. En caso de utilizar repositorios privados tendremos que configurar mediante un fichero `.npmrc` el tema de autentificación con este registry con su login, su token..

## Demos Vite

[build.lib](https://vitejs.dev/config/build-options.html#build-lib)

Recuerda usar `['es', 'umd']` ya que cubre todos los casos

[tabla-esnext](https://compat-table.github.io/compat-table/es2016plus/) Hay gran soporte para las ultimas cosas

### moduleResolution bundler

Tenemos diferentes sistemas de resolución de módulos

Con `node16` tienes que estar renombrando los ficheros depdiendo de si usas `"type": "module"` o CommonJS y usar extensiones `.cjs` o `.mjs`. Además de que tienes que usar las extensiones porque estamos usando el sistema de módulos nativo, y no permite barrels en ESM.
Vemos que `node` no soporta `exports`
El modo `bundler` vemos que tiene todas las características y es más flexibles y está pensado para que tu librería se consuma en una aplicación que utilice un bundler. Nosotros la librería que vamos a crear va a ser usada en una aplicación de react con su bundler.
