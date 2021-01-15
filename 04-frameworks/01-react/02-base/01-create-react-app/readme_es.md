# 01 Previo - Hola React

## Resumen

En este ejemplo vamos a crear un proyecto desde cero utilizando en cli que ofrece el equipo de FaceBook **create-react-app**

## Paso a paso

- Create React App es una herramienta cli para poder crear proyectos react de forma rápida.

- Hasta hace un tiempo nos la teníamos que instalar de forma global, y eso era un problema, ya que teníamos que estar
  atentos a que no hubiera nuevas versiones disponibles y actualizarnos, ahora podemos ejecutar la última versión
  disponible utilizado _npx_. npx es un _npm package runner_ que se descarga a un carpeta temporal _create-react-app_ y lo ejecuta.

- Paso previo: si has instalado en create-react-app como dependencia global

```bash
npm uninstall create-react-app -g
```

> Si estás en MacOs o Linux acuerdate de añadirle el prefijo _sudo_

Queremos que sea con TS

```bash
npx create-react-app myexample --template typescript
```

- Si le echamos un vistazo a esta solución nos encontramos que:

  - No hay ningún _webpack.config.js_ ... bueno si lo hay, pero _create-react-app_ nos lo oculta, si quieres
    verlo puedes ejecutar _npm run eject_ pero ¡ojo! si ejecutas esto no tienes vuelta atras.

  - Debajo de la carpeta _public_ podemos encontrar el fichero _index.html_ con el _div_ con id _root_
    que usaremos como punto de entrada para instanciar nuestra aplicación React.

  - Debajo de de la carpeta _src_ podemos encontrar:
    - El _index.tsx_ contiene el _ReactDOM.Render_
    - El _App.tsx_ instancia el componente principal de la aplicación.

- También nos encontraremos con configuración avanzada ya lista para usar como la configuración de testing, o como
  registrar un service worker para poder trabajar en modo offline..

- Si queremos ejecutar nuestra aplicación:

```bash
npm start
```
