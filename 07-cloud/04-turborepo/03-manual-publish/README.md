# 03 Manual publish

In this example, we are going to publish a single package to a public npm registry.

We will start from `02-turborepo`.

## Steps to build it

Run `npm install` to install project dependencies.

```bash
npm install
```

Let's create an account in [npm](https://www.npmjs.com/signup).

> If you already have an account, you can skip this step.

Login in npm:

```bash
npm login
```

Publish the library:

```bash
cd helpers/house-helpers
npm publish --access public
```

Why is it failing? We need to change the scope of the package from `@my-org` to `@your-npm-user-name` or `@your-npm-org-name`.

_./helpers/house-helpers/package.json_

```diff
{
- "name": "@my-org/house-helpers",
+ "name": "@<user-name>/house-helpers",
  "version": "1.0.0",
  ...

```

Publish again:

```bash
cd helpers/house-helpers
npm publish --access public
```

Visit your published packages in `https://www.npmjs.com/settings/<user-name>/packages`.

This is great, but we want to publish all packages at once, manage versions, create tags, create releases on Github, CHANGELOGS, etc.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
