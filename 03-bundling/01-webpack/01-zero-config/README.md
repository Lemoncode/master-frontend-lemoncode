# Zero config

Is it possible to use webpack in _Zero Config_ mode? Well in theory yes, just
following some conventions we

Zero config bundlers webpack is the possibility of using this package with zero configuration,
just if you follow some conventions you won't need to create a config file.

Altough this sounds cool, it only won't work for very simple cases (just quick demos or tests), e.g. you can't
transpile using babel with zero config.

Let's check in this demo how we can run a simple sample.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some information request
  about the project (once you have successfully fullfilled them a **`package.json`**
  file we will generated).

```bash
npm init -y
```

> By using "y" we agree with the default values the init ask for (beware if you have
> created a folder name that contains uppercase characters or blank spaces it will fail).

- Install **webpack** and **webpack-cli** locally, as a development dependency (the reason to install it locally and not globally is to be easy to setup, e.g. can be launched on a clean machine without having to install anything globally but nodejs).

```bash
npm install webpack webpack-cli --save-dev
```

- In order to launch webpack, modify the **`package.json`** file and add the following property `"build": "webpack --mode development"` under the scripts object. It allows us to launch webpack from the command line through npm typing `npm run build`.

> In webpack 4 now is mandatory to inform the mode we are working on development or production (minified, etc...) in the command line where we call it.

Now, our **`package.json`** file should looks something like:

### ./package.json

```diff
{
  ...
  "scripts": {
+   "build": "webpack --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

- With this configuration webpack will, by default, search for an entry point located under
  _./src/index.js_, let's create a dummy file:

_./src/index.js_

```javascript
console.log("Look ma! Zero config");
```

- Now if we execute

```bash
npm run build
```

We will get the bundle under the _./dist_ path.

So far so good, in this version, this feature is nice for quick demos, but not to be used in real world
scenarios, is expected that in further versions this zero config will be enhanced.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
