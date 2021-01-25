# 04 CI

In this example we will configure continuos integration and run tests.

We will start from `03-hooks/06-use-context`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will configure [Github actions](https://github.com/features/actions) to run all tests in this app. Since Github has [free private/public repositories](https://github.com/pricing) we only need to create a github repository:

```bash
git init
git remote add origin https://github.com/...
git add .
git commit -m "add project with tests"
git push -u origin master
```

- Create new branch on repository `feature/add-ci-file` and add ci config [Github workflow](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow):

### ./.github/workflows/ci.yml

```yml
name: Ci workflow

on: pull_request

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install
        run: npm install
      - name: Build
        run: npm run build
      - name: Tests
        run: npm test

```

- Commit, push:

```bash
git add .
git commit -m "add ci file"
git push
```

- Create a pull request.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
