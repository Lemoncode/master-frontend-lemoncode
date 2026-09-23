# Laboratorio de bundling

⚠ **IMPORTANTE**:
Incorporad esta práctica a vuestro repositorio de Github, o si lo prefirís, Gitlab o Bitbucket público.

Recordad crear una configuración de exclusión (`.gitignore`), para evitar versionar:

- La carpeta de instalación de dependencias _`node_modules`_.
- La carpeta de salida de artefactos compilados _`dist`_.

## Vite

### Obligatorio

Montar una semilla de proyecto con _vite_ que:

- Esté configurado con TypeScript y que permita detectar errores de tipos en la terminal si los hubiera.
- Se pueda ver el tamaño del bundle.
- Tenga los scripts básicos de desarrollo local:
  - `start` para levantar el servidor de desarrollo.
  - `build` para compilar el proyecto y generar bundle de producción.
  - `preview` para previsualizar el bundle de producción.
- Tenga variables de entorno. Crea un setup de modo que las variables puedan tener un valor para desarrollo y otro distinto para producción. Utiliza un `console.log` para mostrar su valor por consola, de manera que en desarrollo local (`npm start`) muestre un valor, pero al levantar la build (`npm run preview`) su valor sea específico para producción.
- Crea un elemento `<h1>` con texto, utilizando la API del DOM, y dale estilos con CSSModules.

### Opcional

Añade la configuración necesaria para que al hacer la build también genere los ficheros de forma comprimida (GZIP y BROTLI), por lo que al hacer la build deberán existir los ficheros `dist/index-<hash>.js.gz` y un `dist/index-<hash>.js.br`.

## Webpack

### Opcional

Esta parte es totalmente opcional, recomendable por si queréis seguir practicando.

> Aquí podéis encontrar ejemplos y pasos para trabajar con webpack: [Repositorio webpack](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/03-bundling/01-webpack)

### Parte 1

Implementar una aplicación simple que:

- Tenga el bundling montado con _webpack_.
- Muestre un logo, por ejemplo el de lemoncode, u otro que queráis.
- Muestre el texto _hola mundo_ estilado con SASS.

### Parte 2

- Ahora, mostrad el _hola mundo_ mediante un componente desarrollado con React.
- Añadir soporte a Typescript y migrad la semilla si es necesario.
- Construid un build de producción y probadlo.
- Incorporad variables de entorno con diferentes valores según desarrollo y producción.
- Añadir una forma de medir cuanto ocupa cada librería y nuestro código en el _bundle_.
