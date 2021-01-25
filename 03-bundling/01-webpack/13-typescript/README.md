# 13 Typescript

In this sample we are going to add Typescript support into our project.

The usual way to add Typescript support has been using a loader and letting
this loader to interact with Typescript, we had some issues with this approach in
the past:

- The process could be slow (some loaders have some parallel running features).
- The ideal scenario was to pass from TS to ES6 using tsc (Typescript) and then
  letting Babel do his transpile thing.

Right now there is a very interesting solution:

- You can use Babel to transpile from TS all the way to ES5: it won't do error
  checking but it will run fast as hell.
- You can run in parallel type checking using _tsc_.

We will start from sample _12-css-modules_,

Summary steps:

- Install Typescript.
- Install Babel preset-typescript.
- Install npm-run-all (run commands in parallel).
- Create a tsconfig (in order to configure our Typescript).
- Update .babelrc in order to add Typescript presets.
- Update webpack.config to process the _ts/tsx_ extension.
- Update the start command to provide typescript support.
- Rename all files to ts/tsx.
- Install React and React DOM typings
- Start using some typing (basic variables etc...).
- Use seom React Built in typing.

## Prerequisites

You will need to have nodejs installed in your computer (at least 8.9.2). If you want to follow this step-by-step guide you will need to take as starting point sample _00 Intro/03 Server_.

## steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's install _typescript_

```bash
npm install typescript --save-dev
```

- Let's install babel preset typescript

```bash
npm install @babel/preset-typescript --save-dev
```

- Let's update _.babelrc_ adding the _Typescript_ presets.

_./.babelrc_

```diff
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
+   "@babel/preset-typescript"
  ]
}
```

- Let's create a _tsconfig_ file (Typescript configuration for this project)

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

- Let's update the entry point extension to _tsx_, plus resolve extensions

_./webpack.config.js_

```diff
module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
-    extensions: [".js", ".jsx"]
+    extensions: [".js",".ts", ".tsx"]
  },
  entry: {
-    app: "./index.jsx",
+    app: "./index.tsx",
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"]
  },
```

- Update webpack.config to process the _ts/tsx_ extension.

_./webpack.config.js_

```diff
  module: {
    rules: [
      {
-        test: /\.jsx?$/,
+        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
```

- Now that we are updating our webpack config, and taking into account that in this
  example we will introduce compile errors on purpose, let's reduce the verbosity of
  webpack output just to quick find that errors:

```diff
...
   devServer: {
    port: 8080,
+   stats: "errors-only",
   },
```

> [Reference](https://webpack.js.org/configuration/dev-server/#devserverstats-)

- Install React and React DOM typings

```bash
npm install @types/react @types/react-dom --save-dev
```

- Rename all files to ts/tsx.

  - averageComponent.jsx >> averageComponent.tsx
  - averageService.js >> averageService.ts
  - index.jsx >> index.tsx
  - totalScoreComponent.jsx >> totalScoreComponent.tsx

- Now we can make use of Typescript goodies, e.g.

_./src/averageService.ts_

```diff
- export function getAvg(scores) {
+ export function getAvg(scores : number[]) {

  return getTotalScore(scores) / scores.length;
}

- export function getTotalScore(scores) {
+ export function getTotalScore(scores : number[]) {
  return scores.reduce((score, count) => score + count);
}
```

- Even use some React Built in typing.

_./src/totalScoreComponent.tsx_

```diff
- export const TotalScoreComponent = () => {
+ export const TotalScoreComponent : React.FC = () => {
  const [totalScore, setTotalScore] = React.useState(0);
```

- Let's give a try:

```bash
npm start
```

- Altough it doesn't complain transpiling, if we take a look to the imports we
  can see there are marked as error in VSCode, typescript does not know how to
  import a css file, we can just declare it as a module.

_./src/declaration.d.ts_

```typescript
declare module "*.scss";
```

- Now all this look great but what happens if we introduce a ts error in our code

_./src/averageService.ts_

```diff
export function getAvg(scores: number[]) {
  return getTotalScore(scores) / scores.length;
}

export function getTotalScore(scores: number[]) {
  return scores.reduce((score, count) => score + count);
}

+ const a : number = "this is a string";
```

- Ooops the compiler does not identify, for the sake of performance Babel doesn't
  perform the type checking it just removes all the TS stuff, What can we do?
  rely on our IDE or just run tsc by our own... then what about performance? We can
  run both tsc and babel transpilation in parallel, let' go for that.

- Let's install _npm-run-all_ a package that will let us execute to this tasks
  in parallel from the script command section in our package.json.

```bash
npm install npm-run-all --save-dev
```

- Now let's elaborate a bit more our package section, we will create a new
  command just to transpile our babel,

_./package.json_

```diff
  "scripts": {
-    "start": "webpack serve",
+    "start": "run-p -l type-check:watch start:dev",
+    "type-check": "tsc --noEmit",
+    "type-check:watch": "npm run type-check -- --watch",
+    "start:dev": "webpack serve",
    "build": "rimraf dist && webpack --mode development"
  },
```

- Now if we run the _start_ command we will get the error in our terminal:

```bash
npm start
```

- We can add sourcemaps to debug our application in browser console:

_./webpack.config.js_

```diff
...
+ devtool: 'eval-source-map',
  devServer: {
    port: 8080,
    stats: "errors-only",
  },
```

> [Reference](https://webpack.js.org/configuration/devtool/)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
