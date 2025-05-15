# 05 Custom commands

In this example we are going to use `custom commands`.

We will start from `04-wait-requests`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

If we look into our code, we will notice that there some steps that we're going to want to repeat over the tests:

_./cypress/support/commands.ts_

```javascript
Cypress.Commands.add('loadAndVisit', () => {
  cy.intercept('GET', '/api/hotels').as('fetchHotels');
  cy.visit('/hotel-collection');

  cy.wait('@fetchHotels');
});
```

> Note: we will fix typings errors adding a d.ts file

_./cypress/support/e2e.ts_

```diff
import '@testing-library/cypress/add-commands';
+ import './commands';
```

We will need add `d.ts` file to support new method:

_./cypress/support/index.d.ts_

```typescript
declare namespace Cypress {
  interface Chainable {
    loadAndVisit(): Chainable<Element>;
  }
}
```

_./cypress/tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
-   "types": ["cypress", "@testing-library/cypress"]
+   "types": ["cypress", "@testing-library/cypress", "./support"]
  },
  "include": ["**/*.ts"]
}


```

> More info [here](https://docs.cypress.io/guides/tooling/typescript-support.html#Types-for-custom-assertions)

Use it:

_./cypress/e2e/hotel-collection.spec.ts_

```diff
...
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange
-   cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit();

    // Assert
-   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 10);
  });
...
```

Update specs:

_./cypress/e2e/hotel-collection.spec.ts_

```diff
...
it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange
-   cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit();

    // Assert
-   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });
```

Even, we could pass parameters if we want to be more generic:

_./cypress/support/commands.ts_

```diff
Cypress.Commands.add(
  'loadAndVisit',
- () => {
+ (apiPath: string, routePath: string, fixture?: string) => {
-   cy.intercept('GET', '/api/hotels').as('fetchHotels');
+   Boolean(fixture)
+     ? cy.intercept('GET', apiPath, { fixture }).as('load')
+     : cy.intercept('GET', apiPath).as('load');

-   cy.visit('/hotel-collection');
+   cy.visit(routePath);

-   cy.wait('@fetchHotels');
+   cy.wait('@load');
  }
);

```

Update typings:

_./cypress/support/index.d.ts_

```diff
declare namespace Cypress {
  interface Chainable {
    loadAndVisit(
+     apiPath: string,
+     routePath: string,
+     fixture?: string
    ): Chainable<Element>;
  }
}

```

Update it:

_./cypress/e2e/hotel-collection.spec.ts_

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
-   cy.intercept('GET', '/api/hotels', { fixture: 'hotels' }).as('fetchHotels');

    // Act
-   cy.visit('/hotel-collection');
+   cy.loadAndVisit('/api/hotels', '/hotel-collection', 'hotels');

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
