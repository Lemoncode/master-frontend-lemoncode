# 07 CI

In this example we are going to continuous integration config.

We will start from `06-edit-hotel`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Add script commands to run in ci process:

### ./package.json

```diff
...
"scripts": {
    "start:e2e": "cypress open",
+   "test:e2e:ci": "npm run start -- -r start:e2e:ci",
+   "start:e2e:ci": "cypress run"
  },
...
```

> More info about [`-r` flag](https://github.com/mysticatea/npm-run-all/blob/master/docs/npm-run-all.md#npm-run-all-command) to stop process when it finishes e2e tests
> We can change browser to another one, with headless version, see [commands](https://docs.cypress.io/guides/guides/command-line.html#Commands)

- And run it:

```bash
npm run test:e2e:ci
```

- Notice that `cypress` has added `screenshots` and `videos` with failing specs, we should ignore these folder for git:

### ./.gitignore

```diff
...
+ cypress/screenshots
+ cypress/videos

```

- Maybe you notice that spec fail due to it's not properly clearing the input, we are not waintig to resolve cities before type on input:

### ./cypress/integration/hotel-edit.spec.ts

```diff
  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
    cy.loadAndVisit(
      '/hotel-collection',
      [
        { path: '/api/hotels', alias: 'loadHotels' },
        { path: '/api/hotels/2' },
+       {
+         path: '/api/cities',
+       },
      ],
      () => {
        cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
          buttons[1].click();
        });
      }
    );

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
    cy.wait('@loadHotels');
    cy.findByText('Updated hotel two');
  });
```

- We will configure [Github actions](https://github.com/features/actions) to run all tests in this app. Since Github has [free private/public repositories](https://github.com/pricing) we only need to create a github repository:

```bash
git init
git remote add origin https://github.com/...
git add .
git commit -m "add project with tests"
git push --set-upstream origin master
```

- Create new branch on repository `feature/add-ci-file` and add ci config:

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
      - name: Tests e2e
        run: npm run test:e2e:ci
```

- Commit, push:

```bash
git add .
git commit -m "add ci file"
git push
```

- Create a pull request.

- Check failing specs:

### ./cypress/integration/hotel-edit.spec.ts

```diff
  it('should update hotel name when it edits an hotel and click on save button', () => {
    ...

    // Assert
    cy.wait('@loadHotels');
-   cy.findByText('Updated hotel two');
+   cy.findByText('Fail spec');
  });
```

- Commit again:

```bash
git add .
git commit -m "add failing spec"
git push
```

- We can upload `screenshots` and `videos` as `artifacts` if specs `fail`:

### ./.github/workflows/ci.yml

```diff
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
      - name: Tests e2e
        run: npm run test:e2e:ci
+     - name: Upload screenshots when specs fail
+       if: ${{ failure()}}
+       uses: actions/upload-artifact@v2
+       with:
+         name: screenshots
+         path: ./cypress/screenshots
+     - name: Upload videos when specs fail
+       if: ${{ failure()}}
+       uses: actions/upload-artifact@v2
+       with:
+         name: videos
+         path: ./cypress/videos
```

- Commit again:

```bash
git add .
git commit -m "upload artifacts"
git push
```

- Restore specs:

### ./cypress/integration/hotel-edit.spec.ts

```diff
  it('should update hotel name when it edits an hotel and click on save button', () => {
    ...

    // Assert
    cy.wait('@loadHotels');
-   cy.findByText('Fail spec');
+   cy.findByText('Updated hotel two');
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
