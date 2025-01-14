# 04 Wait requests

In this example we are going to use real hotel request.

We will start from `03-intercept-requests`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

Maybe some times we need to use real backend server for some reason, we have a spec check hotel collection from "real backend" (it's a mock backend). It looks like it's working, but what's happend if we add some delay?:

_./server/src/index.ts_

```diff
app.get('/api/hotels', async (context) => {
+ await delay(4000);
  return context.json(db.hotels);
});

```

Run again:

```bash
npm run test:e2e

```

Now, it's failing due to cypress timeout, so we need to refactor it:

> Press run all specs again.

Notice that the latest spec if passing because we are using `cy.intercept` with a fixture but we can also use `cy.intercept` with a delay:

_./cypress/e2e/hotel-collection.spec.ts_

```diff
...

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   cy.intercept('GET', '/api/hotels', { fixture: 'hotels' });
+   cy.intercept('GET', '/api/hotels', { fixture: 'hotels', delay: 4000 });

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

[wait usage](https://docs.cypress.io/api/commands/wait#Usage)

_./cypress/e2e/hotel-collection.spec.ts_

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

Apply same changes in other specs:

_./cypress/e2e/hotel-collection.spec.ts_

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
    cy.intercept('GET', '/api/hotels', {
      fixture: 'hotels',
      delay: 4000,
+   }).as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

So, we need to take care with this stuff, let's restore the api request:

_./server/src/index.ts_

```diff
app.get('/api/hotels', async (context) => {
- await delay(4000);
  return context.json(db.hotels);
});

```

Run again:

```bash
npm run test:e2e

```

Lets also remove the delay in specs:

_./cypress/e2e/hotel-collection.spec.ts_

```diff
...

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels', {
      fixture: 'hotels',
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
