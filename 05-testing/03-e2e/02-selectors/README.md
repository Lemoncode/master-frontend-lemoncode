# 02 Selectors

In this example we are going to add some specs to login page.

We will start from `01-config`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's add some specs to login page:

### ./cypress/e2e/login.spec.ts

```diff
...
+ it('should show an alert with a message when type invalid credentials', () => {
+   // Arrange
+   const user = 'admin';
+   const password = '1234';

+   // Act
+   cy.visit('/');
+   cy.get('input[name="name"]').type(user);
+   cy.get('input[name="password"]').type(password);

+   // Assert
+   cy.get('input[name="name"]').should('have.value', user);
+   cy.get('input[name="password"]').should('have.value', password);
+ });

```

- Notice that we are using selectors like css selectors, the first refactor that we could think is assign selectors to a variable like:

### ./cypress/e2e/login.spec.ts

```diff
...
  it('should show an alert with a message when type invalid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = '1234';

    // Act
    cy.visit('/');
-   cy.get('input[name="name"]').type(user);
-   cy.get('input[name="password"]').type(password);
+   const userInput = cy.get('input[name="name"]');
+   const passwordInput = cy.get('input[name="password"]');

+   userInput.type(user);
+   passwordInput.type(password);

    // Assert
-   cy.get('input[name="name"]').should('have.value', user);
-   cy.get('input[name="password"]').should('have.value', password);
+   userInput.should('have.value', user);
+   passwordInput.should('have.value', password);
  });
...

```

- This doesn't work, because `cypress commands` are enqueued and run it in async way. Let's refator it:

### ./cypress/e2e/login.spec.ts

```diff
...
  it('should show an alert with a message when type invalid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = '1234';

    // Act
    cy.visit('/');
-   const userInput = cy.get('input[name="name"]');
+   cy.get('input[name="name"]').as('userInput');
-   const passwordInput = cy.get('input[name="password"]');
+   cy.get('input[name="password"]').as('passwordInput');

-   userInput.type(user);
+   cy.get('@userInput').type(user);
-   passwordInput.type(password);
+   cy.get('@passwordInput').type(password);

    // Assert
-   userInput.should('have.value', user);
+   cy.get('@userInput').should('have.value', user);
-   passwordInput.should('have.value', password);
+   cy.get('@passwordInput').should('have.value', password);
  });

...

```

> More info [here](https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html#Return-Values)

- The [get](https://docs.cypress.io/api/commands/get.html) return DOM element by selector or alias. But we want to write maintainable tests with same syntax like unit tests. We can use [cypress-testing-library](https://github.com/testing-library/cypress-testing-library):

```bash
npm install @testing-library/cypress --save-dev
```

- Let's configure it for typescript:

### ./cypress/tsconfig.json

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
-   "types": ["cypress", "node"]
+   "types": ["cypress", "node", "@testing-library/cypress"]
  },
  "include": ["**/*.ts"]
}

```

### ./cypress/support/e2e.ts

```diff
+ import '@testing-library/cypress/add-commands'
```

- Update specs:

### ./cypress/e2e/login.spec.ts

```diff
describe('Login specs', () => {
  it('visit the login page', () => {
    cy.visit('/');
  });

  it('should name input has the focus when it clicks on it', () => {
    // Arrange

    // Act
    cy.visit('/');
-   cy.get('input[name="name"]').click();
+   cy.findByRole('textbox').click();

    // Assert
-   cy.get('input[name="name"]').should('have.focus');
+   cy.findByRole('textbox').should('have.focus');
  });

  it('should show an alert with a message when type invalid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = '1234';

    // Act
    cy.visit('/');
-   cy.get('input[name="name"]').as('userInput');
+   cy.findByRole('textbox').as('userInput');
-   cy.get('input[name="password"]').as('passwordInput');
+   cy.findByLabelText('Password').as('passwordInput');

    cy.get('@userInput').type(user);
    cy.get('@passwordInput').type(password);

    // Assert
    cy.get('@userInput').should('have.value', user);
    cy.get('@passwordInput').should('have.value', password);
  });
});

```

> NOTE: we have only the `find` methods available due to cypress async way.
> [Which query should I use?](https://testing-library.com/docs/guide-which-query)

- Checking modal error message when click on button with invalid credentials:

### ./cypress/e2e/login.spec.ts

```diff
...
 it('should show an alert with a message when type invalid credentials', () => {
    // Arrange
    const user = 'admin';
    const password = '1234';
+   cy.on('window:alert', cy.stub().as('alertStub'));

    // Act
    cy.visit('/');
    cy.findByLabelText('Name').as('userInput');
    cy.findByLabelText('Password').as('passwordInput');

    cy.get('@userInput').type(user);
    cy.get('@passwordInput').type(password);
+   cy.findByRole('button', { name: 'Login' }).click();

    // Assert
    cy.get('@userInput').should('have.value', user);
    cy.get('@passwordInput').should('have.value', password);
+   cy.get('@alertStub').should(
+     'have.been.calledWith',
+     'invalid credentials, use admin/test, excercise: display a mui snackbar instead of this alert.'
+   );
  });

...
```

> More info in [event-types](https://docs.cypress.io/api/events/catalog-of-events.html#Event-Types)
> This stub is not necessary if we use the Snackbar component or similar.

- Now, we could test when it's a succeded login:

### ./cypress/e2e/login.spec.ts

```diff
...
+ it('should navigate to hotels url when type valid credentials', () => {
+   // Arrange
+   const user = 'admin';
+   const password = 'test';

+   // Act
+   cy.visit('/');
+   cy.findByLabelText('Name').as('userInput');
+   cy.findByLabelText('Password').as('passwordInput');

+   cy.get('@userInput').type(user);
+   cy.get('@passwordInput').type(password);
+   cy.findByRole('button', { name: 'Login' }).click();

+   // Assert
+   cy.url().should('equal', 'http://localhost:8080/#/hotel-collection');
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
