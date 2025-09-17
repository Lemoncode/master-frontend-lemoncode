# Validación de formularios

Hemos visto que React nos ofrece una serie de herramientas básicas para trabajar con formularios, pero hay una solución elaborada
para esto, en este tutorial veremos una solución para:

- Gestionar el estado de los formularios.
- Industrializar la gestión del estado de los formularios.

Haremos uso de:

- Formik.
- Fonk.

# Pasos

- La gestión de un formulario puede convertirse en un dolor de cabeza:

  - Necesitas recoger datos.
  - Necesita añadir algún comportamiento especial basado en el estado del formulario (por ejemplo, mostrar un mensaje de error en un campo
    sólo si se ha tocado el campo o se ha pulsado el botón de guardar).

- Hay varias bibliotecas que proporcionan una solución para esto: _React Final Form_, _Formik_, _React Hook Form_, nosotros
  utilizaremos _Formik_ en este ejemplo.

- Antes de empezar vamos a añadir una pequeña refactorización, en lugar de utilizar dos campos separados para gestionar el formulario
  vamos a crear un _viewmodel_ para ello.

_./src/pods/login/login.vm.ts_

```ts
export interface Login {
  username: string;
  password: string;
}

export const createEmptyLogin = (): Login => ({
  username: "",
  password: "",
});
```

Y adaptar el código en el contenedor del _login_:

_./src/pods/login/login.container.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "core/profile";
import { LoginComponent } from "./login.component";
import { doLogin } from "./login.api";
+ import { Login } from './login.vm';

const useLoginHook = () => {
  const navigate = useNavigate();
  const { setUserProfile } = React.useContext(ProfileContext);

  const loginSucceededAction = (userName) => {
    setUserProfile({ userName });
    navigate(routes.list);
  };

  const loginFailedAction = () => {
    alert("User / password not valid, psst... admin / test");
  };
  return { loginSucceededAction, loginFailedAction };
};

export const LoginContainer: React.FC = () => {
  const { loginSucceededAction, loginFailedAction } = useLoginHook();

-  const handleLogin = (username: string, password: string) => {
+  const handleLogin = (login : Login) => {
+   const {username, password} = login;
    doLogin(username, password).then((result) => {
      if (result) {
         loginSucceededAction(username);
      } else {
        loginFailedAction();
      }
    });
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

Y vamos a refactorizar el componente:

_./src/pods/login.component.tsx_

```diff
import React from "react";
+ import { Login, createEmptyLogin } from './login.vm';

interface Props {
-  onLogin: (username: string, password: string) => void;
+  onLogin: (login: Login) => void;

}

export const LoginComponent: React.FC<Props> = (props) => {
  const { onLogin } = props;
-  const [username, setUsername] = React.useState("");
-  const [password, setPassword] = React.useState("");
+  const [login, setLogin] = React.useState<Login>(createEmptyLogin())

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
-    onLogin(username, password);
+    onLogin(login);
  };

+  const updateFieldValue = (name: keyof Login) => e => {
+    setLogin({
+      ...login,
+      [name]: e.target.value,
+    })
+  }

  return (
    <form onSubmit={handleNavigation}>
      <div className="login-container">
        <input
          placeholder="Username"
-          value={username}
-          onChange={(e) => setUsername(e.target.value)}
+          value={login.username}
+          onChange={updateFieldValue('username')}
        />
        <input
          placeholder="Password"
          type="password"
-          value={password}
-          onChange={(e) => setPassword(e.target.value)}
+          value={login.password}
+          onChange={updateFieldValue('password')}
        />
        <button type="submit">login</button>
      </div>
    </form>
  );
};
```

- Veamos el código refactorizado

```bash
npm start
```

Empecemos por instalar _formik_:

```bash
npm install formik --save
```

Vamos a añadir la gestión de formularios al formulario del _login_ (este caso puede ser manejado sin el uso de esta biblioteca,
pero es un simple ejemplo para mostrar cómo funciona).

Vamos a definir toda la gestión del formulario en el _login.component_

_./src/pods/login.component.tsx_

```diff
import React from "react";
+ import { Formik, Form } from 'formik';
```

- Envolveremos el formulario con el componente _Formik_ (este componente se encarga de configurar los valores iniciales y controla el botón de envío), este componente proporciona un render prop donde definimos el formulario y los campos.

Reemplazaremos el elemento _form_ estándar por el elemento _Form_ de _Formik_, este componente engancha automáticamente Formik's _handleSubmit_ y _handleReset_.

_./src/pods/login.component.tsx_

```diff
   const { onLogin } = props;
-  const [login, setLogin] = React.useState<Login>(createEmptyLogin());

-  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
-    e.preventDefault();
-    onLogin(login);
-  };
-
-  const updateFieldValue = (name: keyof Login) => (e) => {
-    setLogin({
-      ...login,
-      [name]: e.target.value,
-    });
-  };

  return (
+        <Formik
+          onSubmit={onLogin}
+          initialValues={createEmptyLogin()}
+        >
+          {() => (
-    <form onSubmit={handleNavigation}>
+    <Form>
      <div className="login-container">
        <input
          placeholder="Username"
          value={login.username}
          onChange={updateFieldValue("username")}
        />
        <input
          placeholder="Password"
          type="password"
          value={login.password}
          onChange={updateFieldValue("password")}
        />
        <button type="submit">login</button>
      </div>
-    </form>
+    </Form>
+    )}
+   </Formik>
  );
```

Ahora podemos actualizar las entradas para soportar _Formik_, ya que más adelante nos beneficiaremos de algunas características de _Formik_ construiremos una envoltura alrededor del campo de entrada (un wrapper),
ya que esta envoltura podría ser reutilizado en otros proyectos lo añadiremos a la carpeta _root_

¿Qué hacemos aquí?

- Nuestro objetivo es poder utilizar este campo como si fuera un elemento*input*, pero que
  además nos incorporé la gestión de _Formik_ para ese componente y campo.

- Para ello nos creamos un componete que llamaremos _InputFormik_ y lo que hacemos es que herede
  las propiedades de un _Input_ (esto lo puedes ver en la definición de componente donde tenemos
  `React.DetailedHTMProps`).

- Este wrapper queremos que funcione tanto si tenemos el formulario envuelto por Formik como si no
  (así no nos tenemos que preocupar de que de un error si no está Formik instalado)

- Formik incorpora un hook que se llama _useField_ que nos permite en base al nombre del campo que
  estemos enlazando (que debe de venir en la propiedad _name_ del input) obtener la información del mismo
  así como metadatos asociados (si ese campo ha sido modificado alguna vez, o si por el contrario está
  limpio , etc...) ¿Qué pasa si ese nombre de campo no existe o si el componente Formik no wrapea al formulario
  que estamos editando? Pues que lo que devuelve (field y meta) serán campos undefined o nulos.

- Ahora queremos sacar las popiedades el input field, y tenemos dos posibilidades:

  - Si el formulario no está wrapeado con Formik, el campo _field_ será nulo, y podemos directamente
    devolver las propis del input original.

  - Si el formulario está wrapeado con Formik, devolvemos las props de field (ahí
    formik se encarga de manejar el estado del formulario por nosotros).

  - El siguiente paso es saber si el campo tiene errores, ¿Qué vamos a hacer aquí? Por usabilidad, sólo vamos a mostrar el error si el campo está _tocado_ es decir si el usuario ha puesto foco en el campo y al perderlo
    el valor no es válido, o si ya le ha dado a submit y el valor no es válido (Queremos evitar el escenario
    en que se cargue el formulario en blanco y ni le demos opcíon al usuario a rellenarlo y ya salgan errores,
    esto genera frustración), fijate que usamos el valor _meta_ comprobarmos si el campo está _tocado_ y si
    tiene errores.

  - Ahora pasamos al aparte de JSX, como usamos un input, lo vamos a enriquecer para añadir una etiqueta
    que muestra el mensaje de erro en caso de que lo haya (de ahí que lo envolvamos en un DIV y le añadimos
    un elemento span adicional).

  - En el input:
    - Por un lado copiamos todas las propiedades que no venían informadas (para ello usamos el spread
      operator), así por ejemplo si tenemos un atributo de tipo _type_ _password_ no los copiaría.
    - Y después machacamos los atributos que necesitamos para que Formik tenga control sobre el formulario.
    - Este componente es mejorable, ya que por ejemplo, sería buena idea que en vez de usar un style
      para el input, usáramos una clase.

Incluimos el nuevo alias en _tsconfig.json_:

```diff
{
  "compilerOptions": {
    ...
   "paths": {
      "scenes": ["src/scenes"],
      "scenes/*": ["src/scenes/*"],
      "core": ["src/core"],
      "core/*": ["src/core/*"],
      "layouts": ["src/layouts"],
      "layouts/*": ["src/layouts/*"]
      "pods": ["src/pods"],
      "pods/*": ["src/pods/*"]
+     "common": ["src/common"],
+     "common/*": ["src/common/*"]
    }
  },
  "include": ["src"]
}
```

_./src/common/components/forms/input-formik.component.tsx_

```tsx
import React from "react";
import { useField } from "formik";

// Input props, we got this value by double clicking on a input element
// and going to definition (d.ts)
export const InputFormik: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  // useField allows us to extract all formik metadata about that field
  const [field, meta] = useField(props.name);
  // If the field doesn't exist then treat this as a normal input
  const inputFieldProps = Boolean(field) ? field : props;
  // We only want to display the field validation error messsage
  // if formik is enabled, and is the field has been touched
  // not a very good UX experience to show a blank form full
  // of error a the initial state
  const hasError = Boolean(meta && meta.touched && meta.error);

  // Harcoded styles here... pending to add
  // CSS modules (next example) or CSS in JS solution :)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <input
        {...props}
        name={inputFieldProps.name}
        onChange={inputFieldProps.onChange}
        onBlur={inputFieldProps.onBlur}
        value={inputFieldProps.value}
        style={{ width: "100%" }}
      />
      <span style={{ fontSize: "60%", color: "red" }}>
        {hasError ? meta.error : ""}
      </span>
    </div>
  );
};
```

Y vamos a exponerlo en un par de _barrels_:

_./src/common/components/forms/index.ts_

```ts
export * from "./input-formik.component";
```

_./src/common/components/index.ts_

```ts
export * from "./forms";
```

Reemplacemos las entradas del formulario (y simplifiquémoslas):

_./src/pods/login/login.component.tsx_

```diff
+ import { InputFormik } from 'common/components';

-  <input
+  <InputFormik
+   name="username"
    placeholder="Username"
-    value={login.username}
-    onChange={updateFieldValue("username")}
  />
-  <input
+  <InputFormik
+   name="password"
    placeholder="Password"
    type="password"
-    value={login.password}
-    onChange={updateFieldValue("password")}
  />
```

- Vamos a comprobar que las cosas siguen funcionando :)

```bash
npm start
```

- Bueno, ahora han conseguido una gestión del estado del formulario y
  un montón de metadatos... es hora de añadir algo de validación al
  el formulario, en este caso queremos que ambos campos sean obligatorios,
  vamos a añadir una librería de validación:

```bash
npm install @lemoncode/fonk @lemoncode/fonk-formik --save
```

- Una potente característica de _Fonk_ es que definimos las
  validaciones fuera del componente del formulario y del marcado,
  al hacer esto, es bastante fácil comprobar qué validaciones
  se están aplicando al formulario y probarlas unitariamente sin
  la necesidad de montar el componente, para este formulario sería
  sería algo así como:

_./src/pods/login/login.validation.ts_

```ts
import { ValidationSchema, Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";

const validationSchema: ValidationSchema = {
  field: {
    username: [Validators.required],
    password: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
```

- Y vamos a aplicarlo a nuestro formulario de _login_:

_./src/pods/login/login.component.tsx_

```diff
+ import { formValidation } from './login.validation';

<Formik
  onSubmit={onLogin}
  initialValues={createEmptyLogin()}
+ validate={formValidation.validateForm}
  >
```

- ¿Cómo de potente es esta librería de validación de formularios?
  Podemos explorar este post: https://www.basefactor.com/formik-form-validation-fonk
