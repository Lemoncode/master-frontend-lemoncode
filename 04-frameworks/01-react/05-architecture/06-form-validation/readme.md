# Form Validation

We have seen that React offers us some basic plumbing to work with forms, but there is not an ellaborated built in solution
for this, in this tutorial we will check a solutions for:

- Manage form state managament.
- Industrialize form state managament.

We will make use of:

- Formik.
- Fonk.

# Step by Step Guide

- Managing a form can become a pain in the neck:

  - You need to collected data.
  - You need to add some special behavior based on the form state (for instance display error message on a field
    only if the field has been touched or save button has been pressed).

- There are several libraries that provide a solution for this: React Final Form, Formik, React Hook Form, we will
  make use of Formik in this example.

- Prior to get started we are going to add an small refactor, instead of using two separate fields to manage the form
  let's create an viewmodel for this.

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

And adapt the code in the login container:

_./src/pods/login/login.container.ts_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";
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

And let's refactor the component:

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

- Let's thest the refactored code

```bash
npm start
```

Let's start by install formik:

```bash
npm install formik --save
```

We are going to add form management to the login form (this case can be handled without the use of this library,
but is just a simple sample to show how this work).

Let's define all the form managament in the _login.component_

_./src/pods/login.component.tsx_

```diff
import React from "react";
+ import { Formik, Form } from 'formik';
```

- We will wrap the form with the _Formik_ component (this component takes care of setting up the initial values,
  and controls the submit button), this component provides a render prop where we define the form and the fields.
  We will replace the standard _form_ element with Formik's Form element, this component automatically hooks in
  Formik's _handleSubmit_ and _handleReset_.

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

Now we can update the inputs entries in order to support
Formik, since later on we will get benefit of some formik
state management metadata information we will build a
wrapper around the input field, since this wrapper could
be reused in other projects we will add it to the root
folder _./src/common_

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

And let's expose it in a couple of barrels:

_./src/common/components/forms/index.ts_

```ts
export * from "./input-formik.component";
```

_./src/common/components/index.ts_

```ts
export * from "./forms";
```

Let's replace the form input (and simplify them):

_./src/pods/login/login.component.tsx_

```diff
+ import { InputFormik } from '@/common/components';

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

- Let's check that things are still working :)

```bash
npm start
```

- Well now have gotten a pro form state management and
  plenty of metadata... time to add some validation to
  the form, in this case we want both fields to be required,
  let's add a validation library:

```bash
npm install @lemoncode/fonk @lemoncode/fonk-formik --save
```

- One powerful feature of _Fonk_ is that we define the
  validations outside of the form component and markup,
  by doing this, is quite easy to check which validations
  are being applied to the form and unit test them without
  the need of mounting the component, for this form it
  would be something like:

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

- And let's apply it to our login form:

_./src/pods/login/login.component.tsx_

```diff
+ import { formValidation } from './login.validation';

<Formik
  onSubmit={onLogin}
  initialValues={createEmptyLogin()}
+ validate={formValidation.validateForm}
  >
```

- How poweful is this form validation library?
  We can explore this post: https://www.basefactor.com/formik-form-validation-fonk
