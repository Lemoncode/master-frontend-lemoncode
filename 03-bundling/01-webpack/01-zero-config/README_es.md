# Zero config

¿Es posible utilizar webpack en modo _Zero Config_? Bueno, en teoría sí, sólo siguiendo algunas convenciones.

_Zero config bundlers webpack_ es la posibilidad de usar este paquete con cero configuración, simplemente si sigues algunas convenciones no necesitarás crear un archivo de configuración.

Aunque esto suena muy bien, solo funcionará para casos muy simples (solo demos o pruebas rápidas), por ejemplo, no se puede transpilar usando _babel_ con _zero config_.

Comprobemos en esta demo cómo podemos ejecutar una muestra sencilla.

# Pasos para construirlo

## Requisitos previos

Instala [Node.js y npm](https://nodejs.org/en/) (mínimo v8.9) si no están ya instalados en tu ordenador.

> Verific que estás ejecutando al menos node v8.x.x y npm 5.x.x ejecutando `node -v` y `npm -v` en una ventana de terminal/consola. Las versiones más antiguas pueden producir errores.

## Pasos

- Navega a la carpeta donde vas a crear el proyecto vacío.

- Ejecuta `npm init`, se te pedirá que respondas a algunas peticiones de información
  sobre el proyecto (una vez que las hayas completado con éxito se generará un archivo **`package.json`**).

```bash
npm init -y
```

> Al usar "y" estamos de acuerdo con los valores por defecto que pide el init (ten cuidado si has
> creado un nombre de carpeta que contenga caracteres en mayúsculas o espacios en blanco, fallará).

- Instala **webpack** y **webpack-cli** localmente, como una dependencia de desarrollo (la razón de instalarlo localmente y no globalmente es para que sea fácil de configurar, por ejemplo, puede ser lanzado en una máquina limpia sin tener que instalar nada globalmente excepto nodejs).

```bash
npm install webpack webpack-cli --save-dev
```

- Para lanzar _webpack_, modifica el archivo **`package.json`** y añade la siguiente propiedad `"build": "webpack --mode development"` bajo el objeto scripts. Esto nos permite lanzar webpack desde la línea de comandos a través de _npm_ escribiendo `npm run build`.

> En webpack 5 ahora es obligatorio informar el modo en que estamos trabajando en desarrollo o producción (minificado, etc...) en la línea de comandos donde lo llamamos.

Ahora, nuestro archivo **`package.json`** debería tener un aspecto similar:

### ./package.json

```diff
{
  ...
  "scripts": {
+   "build": "webpack --mode development"
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

- Con esta configuración, webpack buscará por defecto un punto de entrada situado en
  _./src/index.js_, vamos a crear un archivo ficticio:

  _./src/index.js_

```javascript
console.log("Look ma! Zero config");
```

- Ahora si ejecutamos

```bash
npm run build
```

Obtendremos el _bundle_ bajo la ruta _./dist_.

Hasta aquí todo bien, en esta versión, esta característica es agradable para demostraciones rápidas, pero no para ser utilizado en el mundo real
se espera que en futuras versiones esta configuración cero sea mejorada.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio).

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate a nuestro [Bootcamp devops Online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).