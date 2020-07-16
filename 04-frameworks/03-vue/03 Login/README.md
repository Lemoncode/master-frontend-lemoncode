# 03 Login

In this sample we are going to create a `login` page.

We will take a startup point sample _02 Properties_.

Summary steps:

- Delete `Hello.vue`.
- Update `App.vue`.
- Update `index.html`.
- Create `login` page.
- Configure router navigation.
- Create `recipe list` page.
- Create `LoginEntity` model.
- Create fake `login` API.
- Check valid login.

# Steps to build it

## Prerequisites

You will need to have Node.js installed in your computer. In order to follow this step guides you will also need to take sample _02 Properties_ as a starting point.

## Steps

- `npm install` to install previous sample dependencies:

```
npm install
```

- Delete `Hello.vue`.

- Update `App.vue`:

### ./src/App.vue

```diff
<template>
  <div>
    <h1>{{message}}</h1>
-    <hello-component
-      :message="message"
-      :on-change="onChange"
-    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
- import HelloComponent from './Hello.vue';

export default Vue.extend({
  name: 'App',
- components: {
-   HelloComponent,
- },
  data() {
    return {
      message: 'Hello from Vue.js',
    };
  },
- methods: {
-   onChange(value: string) {
-     this.message = value;
-   }
- },
});
</script>

```

- To build a nice layout, we will install [vuetify](https://vuetifyjs.com/):

```bash
npm install vuetify --save
```

And we will install `sass` and `sass-loader` as devDependencies:

```bash
npm install sass sass-loader --save-dev
```

> Note: this lib has their own typings, so we don't need to install any more.

- Update webpack config:

### ./webpack.config.js

```diff
...
  entry: {
    app: './main.ts',
-   vendor: ['vue'],
+   vendor: ['vue', 'vuetify'],
+   vendorStyles: ['../node_modules/vuetify/dist/vuetify.min.css'],
  },
...

        {
          test: /\.css$/,
          use: [isDev ? "vue-style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
        },
+        {
+          test: /\.s(c|a)ss$/,
+          use: [
+            isDev ? "vue-style-loader" : MiniCssExtractPlugin.+loader,
+            "css-loader",
+            {
+              loader: "sass-loader",
+              options: {
+                implementation: require("sass"),
+                sassOptions: {
+                  indentedSyntax: true,
+                },
+              },
+            },
+          ],
+        },
···

```

- Update the `index.html`:

### ./src/index.html

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vue.js by sample</title>
+    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" />
+    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```

- Config `vuetify` plugin:

### ./src/main.ts

```diff
import Vue from "vue";
+ import Vuetify from "vuetify";
import App from "./App.vue";

+ Vue.use(Vuetify);
+ const vuetify = new Vuetify();

new Vue({
+  vuetify,
  render: h => h(App),
}).$mount("#root");

```

### ./src/App.vue

```diff
<template>
+ <v-app>
-  <div>
    <h1>{{message}}</h1>
-  </div>
+ </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      message: 'Hello from Vue.js',
    };
  },
});
</script>

```

- `Vue.component` vs `Vue.extends`:

With `Vue.component`, we create global components, that is, something like:

```typescript
Vue.component('my-component', {
  // options...
  render: h => h('h1', 'Hi from MyComponent!'),
})

<div id="example">
  <my-component></my-component>
</div>
```

With `Vue.extends`, we create components that it needs to be imported in other file, like we did before.

- Create `login` page:

### ./src/pages/login/components/Form.vue

```vue
<template>
  <v-form>
    <v-layout column justify-center>
      <v-text-field label="Name" />
      <v-text-field label="Password" type="password" />
      <v-btn type="submit" color="info">Login</v-btn>
    </v-layout>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormComponent",
});
</script>
```

### ./src/pages/login/components/index.ts

```typescript
export { default as FormComponent } from "./Form.vue";
```

### ./src/pages/login/Page.vue

```vue
<template>
  <v-layout justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline">Login</h3>
        </v-card-title>
        <v-card-text>
          <form-component />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { FormComponent } from "./components";

export default Vue.extend({
  name: "LoginPage",
  components: { FormComponent },
});
</script>
```

### ./src/pages/login/index.ts

```typescript
export { default as LoginPage } from "./Page.vue";
```

- The official router for `Vue.js` is [`vue-router`](https://github.com/vuejs/vue-router) and it has TypeScript typings:

```
npm install vue-router --save
```

- Add it as vendor:

### ./webpack.config.js

```diff
...
- vendor: ['vue', 'vuetify'],
+ vendor: ['vue', 'vue-router', 'vuetify'],
...

```

- Add `vue-router` config:

### ./src/main.ts

```diff
import Vue from "vue";
+ import VueRouter from "vue-router";
import Vuetify from "vuetify";
import App from "./App.vue";

+ Vue.use(VueRouter);
Vue.use(Vuetify);
const vuetify = new Vuetify();

new Vue({
  vuetify,
  render: h => h(App),
}).$mount("#root");

```

- Create `router.ts`:

### ./src/router.ts

```typescript
import Router, { RouteConfig } from "vue-router";
import { LoginPage } from "./pages/login";

const routes: RouteConfig[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
];

export const router = new Router({
  routes,
});
```

- Update `main.ts` to work with router:

### ./src/main.ts

```diff
import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import App from "./App.vue";
+ import { router } from "./router";

Vue.use(VueRouter);
Vue.use(Vuetify);
const vuetify = new Vuetify();

new Vue({
  vuetify,
+  router,
  render: h => h(App),
}).$mount("#root");


```

- We can extract view render method to `App.vue` file:

### ./src/App.vue

```diff
<template>
  <v-app>
-   <div>
-     <h1>{{message}}</h1>
-   </div>
+    <v-main>
+      <v-container>
+        <router-view/>
+      </v-container>
+    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
-  data() {
-    return {
-      message: "Hello from App"
-    };
-  },
});
</script>

```

- Run app:

```bash
npm start
```

- Create a second page to navigate:

### ./src/pages/recipe/list/Page.vue

```vue
<template>
  <h1>Recipe List Page</h1>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RecipeListPage",
});
</script>
```

### ./src/pages/recipe/list/index.ts

```typescript
export { default as RecipeListPage } from "./Page.vue";
```

- Create route for `RecipeListPage`:

### ./src/router.ts

```diff
import Router, { RouteConfig } from 'vue-router';
import { LoginPage } from './pages/login';
+ import { RecipeListPage } from './pages/recipe/list';

const routes: RouteConfig[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
+ { path: '/recipe', component: RecipeListPage },
];

export const router = new Router({
  routes
});

```

- Navigate using `router-link`:

> NOTE: Vuetify button API: https://vuetifyjs.com/en/components/buttons#api

### ./src/pages/login/components/Form.vue

```diff
<template>
  <v-form>
    <v-layout column justify-center>
      <v-text-field label="Name"></v-text-field>
      <v-text-field label="Password" type="password"></v-text-field>
-     <v-btn type="submit" color="info">Login</v-btn>
+     <v-btn type="submit" color="info" to="/recipe">Login</v-btn>
    </v-layout>
  </v-form>
</template>

```

- Now, we could start creating a mock `api`. Create model `Login`:

### ./src/rest-api/model/login.ts

```typescript
export interface Login {
  name: string;
  password: string;
}
```

### ./src/rest-api/model/index.ts

```typescript
export * from "./login";
```

- Create fake `login` API.

### ./src/rest-api/api/login/login.ts

```typescript
import { Login } from "../../model";

export const loginRequest = (login: Login): Promise<boolean> =>
  isValidLogin(login)
    ? Promise.resolve(true)
    : Promise.reject("Not valid login");

const isValidLogin = (login: Login) =>
  login.name === "admin" && login.password === "test";
```

### ./src/rest-api/api/login/index.ts

```typescript
export * from "./login";
```

- Create login page `viewModel`:

### ./src/pages/login/viewModel.ts

```typescript
interface Login {
  name: string;
  password: string;
}

const createEmptyLogin = (): Login => ({
  name: "",
  password: "",
});

export { Login, createEmptyLogin };
```

- We'll need a `mapper` to map from `viewModel` to `model`:

### ./src/pages/login/mappers.ts

```typescript
import * as model from "../../rest-api/model";
import * as vm from "./viewModel";

export const mapLoginVmToModel = (login: vm.Login): model.Login => ({
  ...login,
});
```

- Update `Form.vue`:

### ./src/pages/login/components/Form.vue

```diff
<template>
  <form>
    <v-layout column justify-center>
-     <v-text-field label="Name"/>
+     <v-text-field
+       label="Name"
+       :value="login.name"
+       @input="(name) => updateLogin(name, login.password)"
+     />
-     <v-text-field label="Password" type="password"/>
+     <v-text-field
+       label="Password"
+       type="password"
+       :value="login.password"
+       @input="(password) => updateLogin(login.name, password)"
+     />
-     <v-btn type="submit" color="info" to="/recipe">Login</v-btn>
+     <v-btn type="submit" color="info" @click.prevent="loginRequest">Login</v-btn>
    </v-layout>
  </form>
</template>

<script lang="ts">
- import Vue from 'vue';
+ import Vue, { PropOptions } from 'vue';
+ import { Login } from '../viewModel';

- export default Vue.extend();
+ export default Vue.extend({
+  name: "FormComponent",
+  props: {
+    login: { required: true } as PropOptions<Login>,
+    updateLogin: { required: true } as PropOptions<(name: Login["name"], password: Login["password"]) => void>,
+    loginRequest: { required: true } as PropOptions<() => void>,
+  },
+ });
</script>

```

- Update `LoginPage`:

### ./src/pages/login/Page.vue

```diff
<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline">Login</h3>
        </v-card-title>
        <v-card-text>
-         <form-component/>
+         <form-component
+           :login="login"
+           :update-login="updateLogin"
+           :login-request="loginRequest"
+         />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
- import Vue from 'vue';
+ import Vue, { PropOptions } from 'vue';
+ import { Login } from './viewModel';
import { FormComponent } from "./components";

export default Vue.extend({
  name: "LoginPage",
  components: { FormComponent }
+ props: {
+   login: { required: true } as PropOptions<Login>,
+   updateLogin: { required: true } as PropOptions<(name: Login["name"], password: Login["password"]) => void>,
+   loginRequest: { required: true } as PropOptions<() => void>,
+ },
});
</script>

```

- Create `LoginPageContainer`:

### ./src/pages/login/PageContainer.vue

```vue
<template>
  <login-page :login="login" />
</template>

<script lang="ts">
import Vue from "vue";
import LoginPage from "./Page.vue";
import { createEmptyLogin } from "./viewModel";

export default Vue.extend({
  name: "LoginPageContainer",
  components: { LoginPage },
  data() {
    return {
      login: createEmptyLogin(),
    };
  },
});
</script>
```

### ./src/pages/login/PageContainer.vue

```diff
<template>
- <login-page :login="login"/>
+ <login-page :login="login" :update-login="updateLogin" :login-request="loginRequest"/>
</template>

<script lang="ts">
import Vue from 'vue';
import LoginPage from './Page.vue';
- import { createEmptyLogin } from './viewModel';
+ import { createEmptyLogin, Login } from "./viewModel";
+ import { loginRequest } from '../../rest-api/api/login';
+ import { mapLoginVmToModel } from './mapper';

export default Vue.extend({
  name: 'LoginPageContainer',
  components: { LoginPage },
  data() {
    return {
      login: createEmptyLogin(),
    };
  },
+ methods: {
+   updateLogin(name: Login["name"], password: Login["password"]) {
+     this.login = {
+       name,
+       password
+     };
+   },
+   loginRequest() {
+     const loginModel = mapLoginVmToModel(this.login);
+     loginRequest(loginModel)
+       .then(() => {
+         this.$router.push("/recipe");
+       })
+       .catch(error => console.log(error));
+   }
+ }
});
</script>

```

> Reference: [Why we have to use Function in data](https://vuejs.org/v2/api/#Options-Data)

- Update `index.ts`

### ./src/pages/login/index.ts

```diff
- export { default as LoginPage } from "./Page.vue";
+ export { default as LoginPageContainer } from "./PageContainer.vue";

```

- Update `router.ts`

### ./src/router.ts

```diff
import Router, { RouteConfig } from 'vue-router';
- import { LoginPage } from './pages/login';
+ import { LoginPageContainer } from './pages/login';
import { RecipeListPage } from './pages/recipe/list';

const routes: RouteConfig[] = [
  { path: '/', redirect: '/login' },
- { path: '/login', component: LoginPage },
+ { path: '/login', component: LoginPageContainer },
  { path: '/recipe', component: RecipeListPage },
];

export const router = new Router({
  routes
});

```

- We could define props like interface:

### ./src/pages/login/formProps.ts

```typescript
import { PropOptions } from "vue";
import { Login } from "./viewModel";

export interface FormProps {
  login: PropOptions<Login>;
  updateLogin: PropOptions<
    (name: Login["name"], password: Login["password"]) => void
  >;
  loginRequest: PropOptions<() => void>;
}
```

- And use it in `Form.vue` and `Page.vue`:

### ./src/pages/login/components/Form.vue

```diff
  ...

<script lang="ts">
- import Vue, { PropOptions } from "vue";
- import { Login } from "../viewModel";
+ import Vue from "vue";
+ import { FormProps } from '../formProps';

export default Vue.extend({
  name: 'FormComponent',
  props: {
-   login: { required: true } as PropOptions<Login>,
+   login: { required: true },
-   updateLogin: { required: true } as PropOptions<(name: Login["name"], password: Login["password"]) => void>,
+   updateLogin: { required: true },
-   loginRequest: { required: true } as PropOptions<() => void>,
+   loginRequest: { required: true },
- },
+ } as FormProps,
});
</script>

```

### ./src/pages/login/Page.vue

```diff
  ...

<script lang="ts">
- import Vue, { PropOptions } from 'vue';
- import { Login } from "./viewModel";
+ import Vue from 'vue';
+ import { FormProps } from './formProps';
import { FormComponent } from "./components";

export default Vue.extend({
  name: 'LoginPage',
  components: { FormComponent },
  props: {
-   login: { required: true } as PropOptions<Login>,
+   login: { required: true },
-   updateLogin: { required: true } as PropOptions<(name: Login["name"], password: Login["password"]) => void>,
+   updateLogin: { required: true },
-   loginRequest: { required: true } as PropOptions<() => void>,
+   loginRequest: { required: true },
- },
+ } as FormProps,
});
</script>

```

- As example about `data` property in a `Vue` component, we could define an object with all app state:

### ./src/state.ts

```typescript
import { createEmptyLogin } from "./pages/login/viewModel";

export const state = {
  login: createEmptyLogin(),
};
```

### ./src/App.vue

```diff
<template>
  <v-app>
+   <h1>{{ loginEntity.login }}</h1>
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
+ import { state } from './state';

export default Vue.extend({
  name: 'app',
+ data: () => state
});
</script>

```

### ./src/pages/login/PageContainer.vue

```diff
  ...

<script lang="ts">
import Vue from "vue";
import LoginPage from "./Page.vue";
import { createEmptyLogin } from "./viewModel";
import { loginRequest } from "../../rest-api/api/login";
import { mapLoginVmToModel } from "./mapper";
+ import { state } from '../../state';

export default Vue.extend({
  name: "LoginPageContainer",
  components: { LoginPage },
- data: () => ({
-   login: createEmptyLogin()
- }),
+ data: () => state,
  ...

```

- Remove `state.ts` and undo updates.

- Finally, we are going to add `form validations`.

- First we're going to install [`@lemoncode/fonk`](https://github.com/Lemoncode/fonk):

```
npm install @lemoncode/fonk --save
```

- Add it as `vendor`:

### ./webpack.config.js

```diff
...
- vendor: ['vue', 'vue-router', 'vuetify'],
+ vendor: ['@lemoncode/fonk', 'vue', 'vue-router', 'vuetify'],
...

```

- Create validation `constraints`:

### ./src/pages/login/validations.ts

```typescript
import {
  Validators,
  createFormValidation,
  ValidationSchema,
} from "@lemoncode/fonk";

const validationSchema: ValidationSchema = {
  field: {
    name: [Validators.required],
    password: [Validators.required],
  },
};

export const validations = createFormValidation(validationSchema);
```

- Create `LoginError` model:

### ./src/pages/login/viewModel.ts

```diff
+ import { createDefaultValidationResult, ValidationResult } from "@lemoncode/fonk";

interface Login {
  name: string;
  password: string;
};

const createEmptyLogin = (): Login => ({
  name: '',
  password: '',
});

+ interface LoginError {
+   name: ValidationResult;
+   password: ValidationResult;
+ };

+ type ResultLoginError = Record<keyof LoginError, boolean | string>;

+ const createEmptyLoginError = () => ({
+   name: createDefaultValidationResult(),
+   password: createDefaultValidationResult(),
+ });

- export { Login, createEmptyLogin };
+ export { Login, createEmptyLogin, LoginError, ResultLoginError, createEmptyLoginError };

```

- Update `formProps`:

### ./src/pages/login/formProps.ts

```diff
import { PropOptions } from 'vue';
- import { Login } from './viewModel';
+ import { Login, LoginError } from './viewModel';

export interface FormProps {
  login: PropOptions<Login>,
+ loginError: PropOptions<LoginError>,
  updateLogin: PropOptions<(name: Login["name"], password: Login["password"]) => void>,
  loginRequest: PropOptions<() => void>,
}

```

- Update `Form`:

### ./src/pages/login/components/Form.vue

> Note: Vuetify Textfield rules: https://vuetifyjs.com/en/components/text-fields#api

```diff
<template>
-  <form>
+  <v-form ref="form" v-model="valid">
    <v-layout column justify-center>
      <v-text-field
        label="Name"
        :value="login.name"
+       :rules="[resultLoginError.name]"
-       @input="(name) => updateLogin(name, login.password)"
+       @input="(name) => updateLogin('name', name)"
      />
      <v-text-field
        label="Password"
        type="password"
        :value="login.password"
+       :rules="[resultLoginError.password]"
-       @input="(password) => updateLogin(login.name, password)"
+       @input="(password) => updateLogin('password', password)"
      />
-      <v-btn type="submit" color="info" @click.prevent="loginRequest">Login</v-btn>
+      <v-btn type="submit" color="info" @click.prevent="handleClick">Login</v-btn>
    </v-layout>
-  </form>
+  </v-form>
</template>

<script lang="ts">
- import Vue, { PropOptions } from "vue";
+ import Vue, { PropOptions, VueConstructor } from 'vue';
import { FormProps } from "../formProps";

+ interface Refs {
+   $refs: {
+     form: HTMLFormElement;
+   };
+ }

- export default Vue.extend({
+ export default (Vue as VueConstructor<Vue & Refs>).extend({
  props: {
    login: { required: true },
+   loginError: { required: true },
    updateLogin: { required: true },
    loginRequest: { required: true }
  } as FormProps,
+  data() {
+    return {
+      valid: true,
+    };
+  },
+  computed: {
+      resultLoginError(): ResultLoginError {
+        return Object.keys(this.loginError).reduce(
+          (acc, item) => ({
+            ...acc,
+            [item]:
+              this.loginError[item as keyof ResultLoginError].succeeded ||
+              this.loginError[item as keyof ResultLoginError].message,
+          }),
+          {} as ResultLoginError
+        );
+      },
+    },
+  methods: {
+    handleClick() {
+      this.$refs.form.validate();
+      this.loginRequest();
+    },
+  },
});
</script>

```

- Update `Page`:

### ./src/pages/login/Page.vue

```diff
<template>
...
          <form-component
            :login="login"
+           :login-error="loginError"
            :update-login="updateLogin"
            :login-request="loginRequest"
          />
...
</template>

<script lang="ts">
...
  props: {
    login: { required: true },
+   loginError: { required: true },
    updateLogin: { required: true },
    loginRequest: { required: true },
  } as FormProps,
});
</script>

```

- Update `PageContainer`:

### ./src/pages/login/PageContainer.vue

```diff
<template>
  <login-page
    :login="login"
+   :login-error="loginError"
    :update-login="updateLogin"
    :login-request="loginRequest"
  />
</template>

<script lang="ts">
import Vue from "vue";
import LoginPage from "./Page.vue";
- import { createEmptyLogin } from "./viewModel";
+ import { createEmptyLogin, createEmptyLoginError } from "./viewModel";
import { loginRequest } from "../../rest-api/api/login";
import { mapLoginVmToModel } from "./mapper";
+ import { validations } from './validations';

export default Vue.extend({
  name: "LoginPageContainer",
  components: { LoginPage },
  data() {
    return {
      login: createEmptyLogin(),
+     loginError: createEmptyLoginError(),
    };
  },
  methods: {
-   updateLogin(name: string, password: string) {
+   updateLogin(field: string, value: string) {
-     this.login = {
-       login,
-       password,
-     };
+     this.login = {
+       ...this.login,
+       [field]: value,
+     };

+    validations.validateField(field, value)
+     .then(fieldValidationResult => {
+       this.loginError = {
+         ...this.loginError,
+         [field]: fieldValidationResult,
+       };
+     })
+     .catch(error => console.log(error));
    },
    loginRequest() {
+     validations.validateForm(this.login)
+       .then(formValidationResult => {
+         if (formValidationResult.succeeded) {
            const loginModel = mapLoginVmToModel(this.login);
            loginRequest(loginModel)
              .then(() => {
                this.$router.push('/recipe');
              })
              .catch(error => console.log(error));
+         } else {
+           this.loginError = {
+             ...this.loginError,
+             ...formValidationResult.fieldErrors,
+           };
+         }
+       })
+       .catch(error => console.log(error));
    }
  },
});
</script>

```

- Execute the sample:

```
npm start
```

# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us.
