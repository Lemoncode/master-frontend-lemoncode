# 04 CI

In this example we will configure continuos integration and run tests.

We will start from `03-hooks/04-use-context`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

We will configure [Github actions](https://github.com/features/actions) to run all tests in this app. Since Github has [free private/public repositories](https://github.com/pricing) we only need to create a github repository:

```bash
git init
git remote add origin git@github.com...
git add .
git commit -m "add project with tests"
git push -u origin main
```

Create new branch on repository `feature/add-ci-file` and add ci config [Github workflow](https://docs.github.com/en/actions/writing-workflows):

_./.github/workflows/ci.yml_

```yml
name: CI workflow

on: pull_request

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Tests
        run: npm test

```

> [Available Github OS runners](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#standard-github-hosted-runners-for-public-repositories)
>
> [VSCode Yaml extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) is a good option to work with yaml files.

Commit, push:

```bash
git add .
git commit -m "add ci file"
git push -u origin feature/add-ci-file
```

Create a pull request.

If you get an error like `Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).`, you can try to add optional dependency:

_./.github/workflows/ci.yml_

```diff
name: CI workflow

on: pull_request

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Install
-       run: npm ci
+       run: |
+         npm ci
+         npm install @rollup/rollup-linux-x64-gnu --save-optional
      - name: Tests
        run: npm test

```

> Notice that tests are running only once since github actions has enable the process.env.CI variable.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
