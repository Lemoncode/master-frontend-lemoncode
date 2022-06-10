# CSS handling

Even in a small project like that we are starting to have issues on the CSS side:

- We are now grouping all the styling in a global css and starts to become difficult to work with that.
- We have decided to use some manual prefixes, we now that this will become a problem if the project grows, generating
  bugs hard to pinpoint.
- We have started to repeat some values or adding some CSS that could be written in a more maintanble way using a SASS
  approach like.

There are several solutions to this:

- We could use CSS modules in order to get a CSS per component.
- We could use SASS to better organize our project.
- We could make use of HTML variables.
- We could use a CSS in JS approach and get some extra goodies (avoid having to deal with specifity, easy live theming, js power applied to CSS... ).

In this case we will see how introducing a simple change (first applying CSS modules, then SASS), we can obtain a huge improvement in our base code.

# Step by Step guide

- With CSS modules, each CSS file selectors get prefixed and suffixed, with the _path_ and _name_ of the file and a hash number, or just with
  a random id (not recommended for local development), but you may want to do a gradual migration, or maybe you just want to have some global
  CSS available, we will learn how to do this in this example.

- First of all let's move our global _styles.css_ to a subfolder called _src/global-css_:

```bash
cd src
```

```bash
mkdir global-css
```

```bash
mv styles.css ./global-css
```

Now we will update our webpack configuration: we will update our CSS rule to target only the
_global_ folder:

_./webpack.config.js_

```diff
  entry: {
-    app: ["./index.tsx", "./styles.css"],
+    app: ["./index.tsx", "./global-css/styles.css"],
  },
```

- Let's constraint this rule only for the _global-css_ folder.

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

- Let's check that we ain't broke anything :) (remember to stop and restart when you update the webpack config).

```bash
npm start
```

Now is time to configure css modules for the rest of css files let's start with the minimum ,creating an extra
rule, excluding _global-css_ path for that rule, adding css modules support and camel case sintax when consuming selector from js files.

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

- Since we are going to import the local CSS files directly into our TypeScript files, we have to tell TypeScript that
  CSS is a valid module :), let's ask him to allow _css_ and _scss_ extensions (we will declare them as valid modules):

_./src/declaration.d.ts_

```ts
declare module "*.css";
declare module "*.scss";
```

- And let's refactor the login styles:

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

- Let's remove them from the global css

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

- Now in order to use this CSS file, we will have to import it, and use _camelCase_ to
  name the selectors (selectors with dash is a pain in the neck to use it we will have to
  use brackets to access the properties, by default CSS modules will convert it to camel
  case notation)

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

- Let's get the thing working:

```bash
npm start
```

And let's check with devtools what going on... there's something ugly, algtough we can navigate to the prop, we are getting random css selector names, maybe this can be ok ir we are in production mode, but this can be a pain in the neck if you have inspect our CSS code :(

We are going to tell css loader that we are going to take control over how the selectors are named to avod collisions:

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

- Now if we inspect we can check that we are getting meaningfull names on the class names.

- Now that we are uinsg this prefixing, we can get rid of the manual prefixes that we added.

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

and in the component:

_./src/pods/login/login.component.tsx_

```diff
        <Form>
-          <div className={css.loginContainer}>
+          <div className={css.container}>
```

- Just to check that we won't have css name collisions, let's refactor the list
  component + styling:

- Let's create a local css that will be associated to the list component:

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

- Let's rename the list container to _container_, and remove all the manual prefixes

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

- Let's update our component with the new simplified class names:

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

- Let's remove the global styles entries:

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

- As we can see we can have two selectors using the same name and they won't collide, this
  is quite useful when developing components, we can have a local mindset per component.

- Just a last thing to take into account: this _css.whatever_ is just an string (we can
  check this by debugging using the dev tools).

How can I add more than one class to a given element? By using interpolation, a dummy example e.g.

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

One additionall enhancement that you could implement is a simple function that check if a given
class exists or not (avoid undefined hell), you will find plenty of helpers like that named
_class name composer_, _cnc_...

- Instead of reinventing the wheel we can give a try to one of the built in helpers:

```bash
npm install classnames --save
```

- And let's make use of it

_./src/list.components.tsx_

```diff
+ import classNames from 'classnames';

  return (
    <>
      <h2>Hello from List page</h2>
-      <div className={`${css.container} ${css.someAdditionalClass}`}>
+      <div className={classNames(css.container, css.someAdditionalClass)}>
```

Excercise: time for you to give a try to the power of css modules, can you migrate the
heading styles to a css modules approach? this is located under _./src/layout/app.layout_ path.
