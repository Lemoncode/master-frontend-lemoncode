# 05 Custom commands

In this example we are going to use `custom commands`.

We will start from `04-wait-requests`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- If we look into our code, we will notice that there some steps that we're going to want to repeat over the tests:

### ./cypress/support/commands.ts

```javascript
Cypress.Commands.add('loadAndVisit', () => {
  cy.server();
  cy.route('GET', '/api/hotels').as('fetchHotels');
  cy.visit('/hotel-collection');

  return cy.wait('@fetchHotels');
});
```

### ./cypress/support/index.ts

```diff
import '@testing-library/cypress/add-commands';
+ import './commands';
```

- Use it:

### ./cypress/integration/hotel-collection.spec.ts

```diff
...
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange
-   cy.server();
-   cy.route('GET', '/api/hotels').as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit();

    // Assert
-   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 10);
  });
...
```

- We will need add `d.ts` file to support new method:

### ./cypress/support/index.d.ts

```typescript
declare namespace Cypress {
  interface Chainable {
    loadAndVisit(): Chainable<Element>;
  }
}
```

### ./cypress/tsconfig.json

```diff
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": "../node_modules",
    "target": "es5",
    "lib": ["es5", "dom"],
    "esModuleInterop": true,
    "noImplicitAny": false,
    "allowJs": true,
-   "types": ["cypress", "@testing-library/cypress"]
+   "types": ["cypress", "@testing-library/cypress", "./support"]
  },
  "include": ["**/*.ts"]
}


```

> More info [here](https://docs.cypress.io/guides/tooling/typescript-support.html#Types-for-custom-assertions)

- Update specs:

### ./cypress/integration/hotel-collection.spec.ts

```diff
...
it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange
-   cy.server();
-   cy.route('GET', '/api/hotels').as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit();

    // Assert
-   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });
```

- Even, we could pass parameters if we want to be more generic:

### ./cypress/support/commands.ts

```diff
- Cypress.Commands.add('loadAndVisit', () => {
+ Cypress.Commands.add(
+   'loadAndVisit',
+   (apiPath: string, routePath: string, fixture?: string) => {
  cy.server();
- cy.route('GET', '/api/hotels').as('fetchHotels');
+ Boolean(fixture)
+     ? cy.route('GET', apiPath, fixture).as('load')
+     : cy.route('GET', apiPath).as('load');
- cy.visit('/hotel-collection');
+ cy.visit(routePath);

- return cy.wait('@fetchHotels');
+ return cy.wait('@load');
});

```

- Update typings:

### ./cypress/support/index.d.ts

```diff
declare namespace Cypress {
  interface Chainable {
-   loadAndVisit(): Chainable<Element>;
+   loadAndVisit(
+     apiPath: string,
+     routePath: string,
+     fixture?: string
+   ): Chainable<Element>;
  }
}

```

- Update it:

### ./cypress/integration/hotel-collection.spec.ts

```diff
...
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange

    // Act
-   cy.loadAndVisit();
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 10);
  });

  it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange

    // Act
-   cy.loadAndVisit();
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   cy.server(); // Start the server to change request behaviour
-   cy.route('GET', '/api/hotels', 'fixture:hotels').as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit('/api/hotels', '/hotel-collection', 'fixture:hotels');

    // Assert
-   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
