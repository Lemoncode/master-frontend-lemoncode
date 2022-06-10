# Create React app

Para crear una aplicación de este tipo

https://create-react-app.dev/

```bash
npx create-react-app my-app
```

Si te da algún problema de versión antigua, prueba a borrar la caché de _npx_

```bash
sudo npx clear-npx-cache
```

Si un día necesitas hacer un upgrade de un proyecto existente, lo puedes hacer ejecutando el siguiente comando:

```bash
npm install react-scripts@latest
```

Utilizamos _npx_ para traernos siempre la última versión de _create-react-app_. Si lo hicieramos con _npm install create-react-app -g_,
nos instalaría la versión actual en nuestra máquina de forma global, y si creamos una aplicación en un tiempo no utilizaría la última versión.

Para crear un proyecto con soporte para _typescript_:

```bash
npx create-react-app my-app --template typescript
```

O añadir soporte a _TypeScript_ después:

https://create-react-app.dev/docs/adding-typescript

Podemos hacer `eject` de nuestro proyecto y tener acceso directo a la configuración (por ejemplo, de _webpack_):

https://create-react-app.dev/docs/available-scripts/#npm-run-eject

Podemos comprobar abriendo la configuración de _webpack_ que es inmanejable.

Y más fumada customizando y haciendo tu plantilla

https://auth0.com/blog/how-to-configure-create-react-app/
