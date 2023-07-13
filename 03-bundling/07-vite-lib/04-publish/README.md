# 04 Publish

In this example we are going to publish the library.

We will start from `03-component-lib`.

Summary steps:

- Create an account in npm.
- Login in npm.
- Publish the library.

# Steps to build it

- `npm install` to install previous sample packages:

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
cd common-library
npm publish --access public
```

Why is it failing? We need to change the scope of the package from `@lemoncode` to `@your-npm-user-name` or `@your-npm-org-name`.

_./common-library/package.json_

```diff
{
- "name": "@lemoncode/common-library",
+ "name": "@<user-name>/common-library",
  "version": "1.0.0",
  "description": "Lemoncode common library",
  "author": "Lemoncode",
  ...
}
```

Publish again:

```bash
cd common-library
npm publish --access public
```

Visit your published packages in `https://www.npmjs.com/settings/<user-name>/packages`.

Let's try to install it in another project:

```bash
cd new-project
npm install @<user-name>/common-library
```

Nice, we have our library working. But we want to publish only some files to reduce the files to publish, for example we don't want to publish the `src` folder or the `tsconfig.json` file.

Let's add the `files` property:

_./common-library/package.json_

```diff
{
  ...
  "keywords": [
    "lemoncode",
    "common",
    "library"
  ],
+ "files": [
+   "dist"
+ ],
  "type": "module",
  "main": "dist/common-library.umd.cjs",
  ...
}
```

> Some files are always included like `package.json`, `README.md` and `LICENSE`.
>
> More info about [files](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files)

Update the `package.json` version:

```diff
{
  "name": "@<user-name>/common-library",
- "version": "1.0.0",
+ "version": "1.0.1",
  "description": "Lemoncode common library",
  "author": "Lemoncode",
}
```

Publish again:

```bash
cd common-library
npm publish --access public
```

Install the new version:

```bash
cd new-project
npm install @<user-name>/common-library@latest
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
