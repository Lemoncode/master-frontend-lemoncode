# Manejo de CSS

Incluso en un proyecto pequeño como este estamos empezando a tener problemas en el lado del _CSS_:

- Estamos agrupando todos los estilos en un css global y empieza a ser difícil trabajar con eso.
- Hemos decidido utilizar algunos prefijos manuales, pero
  esto se convertirá en un problema si el proyecto crece, generando
  bugs difíciles de localizar.
- Hemos empezado a repetir algunos valores o a añadir algo de _CSS_ que podría ser escrito de una manera más mantenible usando _SASS_.

Hay varias soluciones para esto:

- Podríamos utilizar _CSS modules_ para obtener un _CSS_ por componente.
- Podríamos utilizar _SASS_ para organizar mejor nuestro proyecto.
- Podríamos hacer uso de variables _HTML_.
- Podríamos utilizar un enfoque de _CSS_ en _JS_ y obtener algunas ventajas extra (evitar tener que lidiar con la especificidad, fácil tematización en vivo, potencia de js aplicada a _CSS_... ).

En este caso veremos cómo introduciendo un simple cambio (aplicando primero _CSS Modules_, y luego _SASS_), podemos obtener una enorme mejora en nuestro código base.

# Pasos

- Con los _CSS modules_, cada uno de los selectores de archivos CSS tiene un prefijo y un sufijo, con la _ruta_ y el _nombre_ del archivo y un número hash, o simplemente con
  un identificador aleatorio (no se recomienda para el desarrollo local), pero es posible que desee hacer una migración gradual, o tal vez tú sólo quieras tener algunos _CSS_ globales
  disponibles, vamos a aprender cómo hacerlo en este ejemplo.

- En primer lugar vamos a mover nuestro global _styles.css_ a una subcarpeta llamada _src/global-css_:

```bash
cd src
```

```bash
mkdir global-css
```

```bash
mv styles.css ./global-css
```

Ahora actualizaremos nuestra configuración de _webpack_: actualizaremos nuestra regla _CSS_ para que se dirija únicamente a la carpeta
_global_:

_./webpack.config.js_

```diff
  entry: {
-    app: ["./index.tsx", "./styles.css"],
+    app: ["./index.tsx", "./global-css/styles.css"],
  },
```

- Vamos a restringir esta regla sólo para la carpeta _global-css_.

```diff
      {
        test: /\.css$/,
-        exclude: /node_modules/,
+        include: /global-css/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
```

- Vamos a comprobar que no hemos roto nada :) (recuerda parar y reiniciar cuando actualices la configuración de _webpack_).

```bash
npm start
```

Ahora es el momento de configurar los _css modules_ para el resto de los archivos css. Vamos a empezar con el mínimo, creando una regla extra,
excluyendo la ruta _global-css_ para esa regla, añadiendo el soporte de _css modules_ y la sintaxis _camel case_ al consumir el selector de los archivos _js_.

```diff
      {
        test: /\.css$/,
        include: /global-css/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
+     {
+       test: /\.css$/,
+       exclude: /global-css/,
+        use: [
+          {
+            loader: "style-loader",
+          },
+          {
+            loader: "css-loader",
+            options: {
+              modules: {
+                exportLocalsConvention: "camelCase",
+              }
+            },
+          },
+        ]
+     }
    ],
```

- Como vamos a importar los archivos _CSS_ locales directamente a nuestros archivos _TypeScript_, tenemos que decirle a _TypeScript_ que
  _CSS_ es un módulo válido :), vamos a pedirle que permita las extensiones _css_ y _scss_ (las declararemos como módulos válidos):

_./src/declaration.d.ts_

```ts
declare module "*.css";
declare module "*.scss";
```

- Y refactoricemos los estilos de _login_:

_./src/pods/login/login.styles.css_

```css
.login-container {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.login-container > input {
  width: 320px;
}

.login-container > button {
  width: 180px;
  align-self: center;
}
```

- Vamos a eliminarlas del _css_ global

_./global-css/styles.css_

```diff
.layout-app-header {
  color: white;
  background-color: #007661;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
}

- .login-container {
-  display: flex;
-  flex-direction: column;
-  row-gap: 20px;
-}

-.login-container > input {
-  width: 320px;
-}
-
-.login-container > button {
-  width: 180px;
-  align-self: center;
-}
```

- Ahora para usar este archivo CSS, tendremos que importarlo, y usar _camelCase_ para
  los selectores (los selectores con guión son un dolor de cabeza para utilizarlo tendremos que
  usar paréntesis para acceder a las propiedades, por defecto los _CSS modules_ lo convertirán a notación
  _case_)

_./src/pods/login/login.component.tsx_

```diff
+ import css from './login.styles.css';

-          <div className="login-container">
+          <div className={css.loginContainer}>
            <InputFormik name="username" placeholder="Username" />
            <InputFormik
              name="password"
              placeholder="Password"
              type="password"
            />
            <button type="submit">login</button>
          </div>
        </Form>
```

- Hagamos que la cosa funcione:

```bash
npm start
```

Y vamos a comprobar con _devtools_ lo que está pasando... hay algo feo, aunque podemos navegar a la _prop_, estamos recibiendo nombres de selectores _css_ al azar, tal vez esto puede estar bien si estamos en modo de producción, pero esto puede ser un dolor de cabeza si estamos inspeccionando nuestro código CSS :(

Vamos a decirle al _css loader_ que vamos a tomar el control sobre cómo se nombran los selectores para evitar colisiones:

_./webpack.config.js_

```diff
      {
        test: /\.css$/,
        exclude: /global-css/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                exportLocalsConvention: "camelCase",
+               localIdentName: '[path][name]__[local]--[hash:base64:5]',
+               localIdentContext: path.resolve(__dirname, 'src'),
              }
            },
          },
        ],
```

- Ahora si inspeccionamos podemos comprobar que estamos obteniendo nombres significativos en los nombres de las clases.

- Ahora que estamos utilizando este prefijo, podemos deshacernos de los prefijos manuales que hemos añadido.

_./src/pods/login/login.styles.css_

```diff
- .login-container {
+  .container {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

- .login-container > input {
+ .container > input {
  width: 320px;
}

- .login-container > button {
+ .container > button {

  width: 180px;
  align-self: center;
}
```

y en el componente:

_./src/pods/login/login.component.tsx_

```diff
        <Form>
-          <div className={css.loginContainer}>
+          <div className={css.container}>
```

- Sólo para comprobar que no tendremos colisiones de nombres css, vamos a refactorizar la lista
  componente + estilos:

- Vamos a crear un _css_ local que se asociará al componente de la lista:

_./src/pods/components/list.styles.css_

```css
.list-user-list-container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}

.list-header {
  background-color: #2f4858;
  color: white;
  font-weight: bold;
}

.list-user-list-container > img {
  width: 80px;
}
```

- Cambiemos el nombre del contenedor de la lista a _container_, y eliminemos todos los prefijos manuales

_./src/pods/components/list.styles.css_

```diff
- .list-user-list-container {
+ .container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}

- .list-header {
+ .header {
  background-color: #2f4858;
  color: white;
  font-weight: bold;
}

- .list-user-list-container > img {
+ .container > img {
  width: 80px;
}

```

- Actualicemos nuestro componente con los nuevos nombres de clase simplificados:

_./src/pods/components/list.component.tsx_

```diff
+ import css from './list.styles.css';

      <h2>Hello from List page</h2>
-      <div className="list-user-list-container">
+      <div className={css.container}>
-        <span className="list-header">Avatar</span>
-        <span className="list-header">Id</span>
-        <span className="list-header">Name</span>
+        <span className={css.header}>Avatar</span>
+        <span className={css.header}>Id</span>
+        <span className={css.header}>Name</span>

```

- Vamos a eliminar las entradas de estilos globales:

_./src/global-css/_

```diff
.layout-app-header {
  color: white;
  background-color: #007661;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;
}

- .list-user-list-container {
-  display: grid;
-  grid-template-columns: 80px 1fr 3fr;
-  grid-template-rows: 20px;
-  grid-auto-rows: 80px;
-  grid-gap: 10px 5px;
- }
-
- .list-header {
-  background-color: #2f4858;
-  color: white;
-  font-weight: bold;
- }

- .list-user-list-container > img {
-  width: 80px;
- }
```

- Como podemos ver podemos tener dos selectores con el mismo nombre y no colisionarán, esto
  es bastante útil a la hora de desarrollar componentes, podemos tener un _mindset local_ por componente.

- Sólo una última cosa a tener en cuenta: este _css.whatever_ es sólo una cadena de texto(podemos
  comprobarlo depurando con las herramientas de desarrollo).

¿Cómo puedo añadir más de una clase a un elemento dado? Utilizando la interpolación, un ejemplo ficticio, por ejemplo

_./src/list.styles.css_

```diff
.container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}

+ .some-additional-class {
+  border: 2px solid #bc5b40;
+  background-color: #fbfaf0;
+ }
```

_./src/list.components.tsx_

```diff
export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
  return (
    <>
      <h2>Hello from List page</h2>
-      <div className={css.container}>
+      <div className={`${css.container} ${css.someAdditionalClass}`}>
```

Una mejora adicional que podría implementar es una simple función que compruebe si una clase dada
existe o no (para evitar el infierno de lo indefinido), encontrarás muchos _helpers_ como ese llamado
_nombre de la clase compositor_, _cnc_...

- En lugar de reinventar la rueda podemos probar uno de los _helpers_ incorporados:

```bash
npm install classnames --save
```

- Y lo utilizamos

_./src/list.components.tsx_

```diff
+ import classNames from 'classnames';

  return (
    <>
      <h2>Hello from List page</h2>
-      <div className={`${css.container} ${css.someAdditionalClass}`}>
+      <div className={classNames(css.container, css.someAdditionalClass)}>
```

**EJERCICIO**

Ejercicio: es hora de que pruebes el poder de los _css modules_, ¿puedes migrar los
estilos del encabezado a _css modules_? este se encuentra en la ruta _./src/layout/app.layout_.
