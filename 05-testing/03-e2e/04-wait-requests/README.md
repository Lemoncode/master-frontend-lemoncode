# 04 Wait requests

In this example we are going to use real hotel request.

We will start from `03-stub-requests`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Maybe some times we need to use real backend server for some reason, we have a spec check hotel collection from "real backend" (it's a mock backend). It looks like it's working, but what's happend if we add some delay?:

### ./server/package.json

```diff
{
  "name": "hotel-api",
  "version": "1.0.0",
  "description": "Hotel API",
  "main": "index.js",
  "scripts": {
-   "mock-server": "json-server --routes ./config/routes.json --watch mock-data/hotels-data.json"
+   "mock-server": "json-server --delay 4000 --routes ./config/routes.json --watch mock-data/hotels-data.json"
  },
  "author": "Lemoncode",
  "license": "MIT",
  "devDependencies": {
    "json-server": "^0.17.1"
  }
}

```

Run again:

```bash
npm run test:e2e

```

- Now, it's failing due to cypress timeout, so we need to refactor it:

> Press run all specs again.

- Add delay in the last spec using fixture:

### ./cypress/e2e/hotel-collection.spec.ts

```diff
...

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   cy.intercept('GET', '/api/hotels', { fixture: 'hotels.json' });
+   cy.intercept('GET', '/api/hotels', { fixture: 'hotels.json', delay: 4000 });

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

- [wait usage](https://docs.cypress.io/api/commands/wait#Usage)

### ./cypress/e2e/hotel-collection.spec.ts

```diff
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange
+   cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 10);
  });

```

- Apply same changes in other specs:

### ./cypress/e2e/hotel-collection.spec.ts

```diff
...
  it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange
+   cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
+   cy.intercept('GET', '/api/hotels', { fixture: 'hotels.json', delay: 4000 });
    cy.intercept('GET', '/api/hotels', {
      fixture: 'hotels.json',
      delay: 4000,
+   }).as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

- So, we need to take care with this stuff, let's restore the api request:

### ./server/package.json

```diff
{
  "name": "hotel-api",
  "version": "1.0.0",
  "description": "Hotel API",
  "main": "index.js",
  "scripts": {
-   "mock-server": "json-server --delay 4000 --routes ./config/routes.json --watch mock-data/hotels-data.json"
+   "mock-server": "json-server --routes ./config/routes.json --watch mock-data/hotels-data.json"
  },
  "author": "Lemoncode",
  "license": "MIT",
  "devDependencies": {
    "json-server": "^0.17.1"
  }
}

```

Run again:

```bash
npm run test:e2e

```

- Lets also remove the delay in specs:

### ./cypress/e2e/hotel-collection.spec.ts

```diff
...

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels', {
      fixture: 'hotels.json',
-     delay: 4000,
    }).as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 2);
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
