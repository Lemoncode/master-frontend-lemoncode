# 13 Typescript

In this sample we are going to add Typescript support into our project.

The usual way to add Typescript support has been using a loader and letting
this loader to interact with Typescript, we had some issues with this approach in
the past:

- The process could be slow (some loaders have some parallel running features).
- The ideal scenario was to pass from TS to ES6 using tsc (Typescript) and then
  letting Babel do his transpile thing.

Right now there a very interesting solution:

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
- Update webpackconfig to process the _ts/tsx_ extension.
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
npm install
```

- Let's instal babel preset typescript

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

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "allowJs": true,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src/"
  }
}
```

- Update webpackconfig to process the _ts/tsx_ extension.

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

- Install React and React DOM typings

```bash
npm install @types/react @types/react-dom --save-dev
```

- Rename all files to ts/tsx.

  - averageComponent.jsx >> averageComponent.tsx
  - averageService.js >> averageService.ts
  - index.jsx >> index.tsx
  - totalScoreComponent.jsx >> totalScoreComponent.tsx

* Start using some typing (basic variables etc...).

* Use some React Built in typing.

* Now all this look great but what happens if we introduce an ts error in our code

- Ooops the compiler does not identify, for the sake of performance Babel doesn't
  perform the type checking it just removes all the TS stuff, What can we do?
  rely on our IDE or just run tsc by our own... then what about performance? We can
  run both tsc and babel transpilation in parallel, let' go for that.

- Let's install _npm-run-all_ a package that will let us execute to this tasks
  in parallel from the script command section in our package.json.

```bash
npm install npm-run-all --save-dev
```

- Now let's ellaborate a bit more our package section, we will create a new
  command just to transpile our babel,

_./package.json_

```diff
  "scripts": {
-    "start": "webpack-dev-server --mode development --open",
+    "start": "run-p -l type-check:watch start:dev",
+    "type-check:watch": "npm run type-check -- --watch",
+    "start:dev": "webpack-dev-server --mode development --open",
    "build": "rimraf dist && webpack --mode development"
  },
```

- Now if we run the _start_ command we will get the error in our terminal:

```bash
npm start
```
