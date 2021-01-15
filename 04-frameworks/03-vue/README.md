# Vue.js by sample

The goal of this project is to provide a set of step by step samples, covering core concepts of Vue.js
Each of the samples contains a `README.md` file that indicates the purpose of the sample plus an step by step guide to reproduce it.

# Demos

## 00 Boilerplate

In this sample we are going to setup a web project that can be easily managed
by webpack.

We won't install anything related to Vue.js, just some basic plumbing.

We will setup an initial <abbr title="Node.js package manager, a package manager for the JavaScript runtime environment Node.js">npm</abbr> project and give support to TypeScript. Then we will create a Hello World TypeScript sample.

Summary steps:

- Prerequisites: Install Node.js
- Initialize **package.json** (with `npm init`)
- Install:
  - Webpack and webpack-dev-server.
  - TypeScript.
- Setup **webpack.config.js**
- Create a test js file.
- Create a simple HTML file.

## 01 Hello VueJS

In this sample we are going to create our first Vue.js SFC and connect it with the DOM.

We will take a startup point sample _00 Boilerplate_.

Summary steps:

- Install Vue.js devtools.
- Install `vue.js` library and others dependencies.
- Configure webpack to work with `vue.js`.
- Update `index.html`.
- Update `main.ts`.

## 02 Properties

In this sample we are going to learn a basic concept, handling properties.

We will take a startup point sample _01 Hello VueJS_.

Summary steps:

- Update `App.vue` with and input element.
- Use `v-model` directive.
- Create our first component.
- Passing properties from `main.ts` to `hello.ts`.
- Other approach to work with properties.

## 03 Login

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

## 04 Recipe List

In this sample we are going to create a `recipe list` page.

We will take a startup point sample _03 Login_.

Summary steps:

- Create `recipe` model.
- Create fake `recipe` API.
- Create `recipe list` page container.
- Update `recipe list` page.
- Navigate to `edit recipe` page.

## 05 Edit Recipe

In this sample we are going to create a `edit recipe` page.

We will take a startup point sample _04 Recipe List_.

Summary steps:

- Create `API` methods.
- Create `pageContainer`.
- Update `page`.
- Create `common` components.
- Create `edit recipe` form.
- Add `form validations` with `lc-form-validation`.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
