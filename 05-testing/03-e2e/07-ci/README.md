# 07 CI

In this example we are going to continuous integration config.

We will start from `06-edit-hotel`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

Add script commands to run in ci process:

_./package.json_

```diff
...
"scripts": {
    "start:e2e": "cypress open",
+   "test:e2e:ci": "npm start -- -r start:e2e:ci",
+   "start:e2e:ci": "cypress run"
  },
...
```

> More info about [`-r` flag](https://github.com/mysticatea/npm-run-all/blob/master/docs/npm-run-all.md#npm-run-all-command) to stop process when it finishes e2e tests
>
> We can change browser to another one, with headless version, see [commands](https://docs.cypress.io/guides/guides/command-line.html#Commands)

And run it:

```bash
npm run test:e2e:ci
```

Update config:

_./cypress.config.ts_

```diff
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080/#',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
+   video: true,
+   screenshotOnRunFailure: true,
  },
});

```

Notice that `cypress` has added `screenshots` and `videos` with failing specs, we should ignore these folder for git:

_./.gitignore_

```diff
...
+ cypress/screenshots
+ cypress/videos

```

Let's make a test fail:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
...
  it('should update hotel name when it edits an hotel and click on save button', () => {
    ...
-   cy.findByText('Updated hotel two');
+   cy.findByText('Updated hotel three');
  });
```

And run it:

```bash
npm run test:e2e:ci
```

We will configure [Github actions](https://github.com/features/actions) to run all tests in this app. Since Github has [free private/public repositories](https://github.com/pricing) we only need to create a github repository:

```bash
git init
git remote add origin git@github.com...
git add .
git commit -m "add project with tests"
git push -u origin main
```

Create new branch on repository `feature/add-ci-file` and add ci config:

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
      - name: Tests e2e
        run: npm run test:e2e:ci
```

Commit, push:

```bash
git add .
git commit -m "add ci file"
git push -u origin feature/add-ci-file
```

Create a `pull request`.

We can upload `screenshots` and `videos` as `artifacts` if specs `fail`:

_./.github/workflows/ci.yml_

```diff
name: Ci workflow

on: pull_request

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Tests e2e
        run: npm run test:e2e:ci
+     - name: Upload screenshots when specs fail
+       if: ${{ failure()}}
+       uses: actions/upload-artifact@v4
+       with:
+         name: screenshots
+         path: ./cypress/screenshots
+     - name: Upload videos when specs fail
+       if: ${{ failure()}}
+       uses: actions/upload-artifact@v4
+       with:
+         name: videos
+         path: ./cypress/videos
```

Commit again:

```bash
git add .
git commit -m "upload artifacts"
git push
```

Restore specs:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
  it('should update hotel name when it edits an hotel and click on save button', () => {
    ...

    // Assert
    cy.wait('@loadHotels');
-   cy.findByText('Updated hotel three');
+   cy.findByText('Updated hotel two');
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
