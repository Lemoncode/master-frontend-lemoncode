# 01 Config

In this example we are going to add a basic setup needed to support end to end testing with Cypress.

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

- We are going to install the main library which we base all our unit tests, [Cypress](https://www.cypress.io/).

```bash
npm install cypress --save-dev
```

# Config

- We can just add cypress command to scripts and running it:

### ./package.json

```diff
"scripts": {
...
    "postinstall": "cd ./server && npm install",
+   "test:e2e": "cypress open"
  },
```

- Run it:

```bash
npm run test:e2e
```

- Cypress creates for us a folder `cypress` and `cypress.json`:

  - **fixtures**
  - **integration**
  - **plugins**
  - **screenshots**
  - **support**

- And a `cypress.json` for configuration.

- Let's remove all folders, and add our first test:

### ./cypress/integration/login.spec.js

```javascript
describe('Login specs', () => {
  it('visit the login page', () => {
    cy.visit('http://localhost:8080');
  });
});
```

- An important note is that we need to running the app to execute the e2e tests:

### ./package.json

```diff
"scripts": {
...
-   "test:e2e": "cypress open"
+   "test:e2e": "npm run start -- start:e2e",
+   "start:e2e": "cypress open"
  },
```

- So far so good, we can add the base app url in `cypress.json` to avoid repeat it in whole tests:

### ./cypress.json

```diff
- {}
+ {
+   "baseUrl": "http://localhost:8080/#"
+ }
```

> You can see more info [here](https://docs.cypress.io/guides/references/configuration.html#Options)

### ./cypress/integration/login.spec.js

```diff
describe('Login specs', () => {
  it('visit the login page', () => {
-   cy.visit('http://localhost:8080');
+   cy.visit('/');
  });
});

```

- Could we work with Typescript? If we rename spec to `.ts`:

_./cypress/integration/login.spec.js_ -> _./cypress/integration/login.spec.ts_

- Let's add a `tsconfig.json` file to support it:

### ./cypress/tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": "../node_modules",
    "target": "es5",
    "lib": ["es5", "dom"],
    "esModuleInterop": true,
    "noImplicitAny": false,
    "allowJs": true,
    "types": ["cypress"]
  },
  "include": [
    "**/*.ts"
  ]
}

```

> You can see more info [here](https://docs.cypress.io/guides/tooling/typescript-support.html#Install-TypeScript)

- Now it's fully supported. Let's try another spec:

### ./cypress/integration/login.spec.ts

```diff
describe('Login specs', () => {
  it('visit the login page', () => {
    cy.visit('/');
  });

+ it('should name input has the focus when it clicks on it', () => {
+   // Arrange

+   // Act
+   cy.visit('/');
+   cy.get('input[name="name"]').click();

+   // Assert
+   cy.get('input[name="name"]').should('have.focus');
+ });
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
