# 03 Stub requests

In this example we are going to stub hotel request.

We will start from `02-selectors`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will create `hotel-collection` specs:

### ./cypress/integration/hotel-collection.spec.ts

```javascript
describe('Hotel collection specs', () => {
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange

    // Act

    // Assert
  });
});


```

- Update spec:

### ./cypress/integration/hotel-collection.spec.ts

```diff
describe('Hotel collection specs', () => {
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange

    // Act
+   cy.visit('/hotel-collection');

    // Assert
+   cy.findAllByRole('listitem').should('have.length', 10);
  });
});

```

- Maybe we could expect `have length greater than`:

```diff
+ it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
+   // Arrange

+   // Act
+   cy.visit('/hotel-collection');

+   // Assert
+   cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
+ });
```

- But in some scenarios, maybe we need to simulate this fetch. How can we simulate, fetching 2 hotels?:

### ./cypress/integration/hotel-collection.spec.ts

```diff
+ import { HotelEntityApi } from '../../src/pods/hotel-collection/api';

describe('Hotel collection specs', () => {
  ...
+ it('should fetch two hotels when visit /hotel-collection url', () => {
+   // Arrange
+   const hotels = [
+     {
+       id: 'id-1',
+       thumbNailUrl: 'test-picture-1',
+       name: 'test-name-1',
+       shortDescription: 'test-description-1',
+       address1: 'test-address-1',
+       hotelRating: 1,
+       city: 'test-city-1',
+     },
+     {
+       id: 'id-2',
+       thumbNailUrl: 'test-picture-2',
+       name: 'test-name-2',
+       shortDescription: 'test-description-2',
+       address1: 'test-address-2',
+       hotelRating: 2,
+       city: 'test-city-2',
+     },
+   ] as HotelEntityApi[];
+   cy.server(); // Start the server to change request behaviour
+   cy.route('GET', '/api/hotels', hotels);

+   // Act
+   cy.visit('/hotel-collection');

+   // Assert
+   cy.findAllByRole('listitem').should('have.length', 2);
+ });
});

```

> [server method](https://docs.cypress.io/api/commands/server.html#Syntax)
> Mock data, 404 responses, etc

- This is a common task that we will have to do, so cypress provide the `fixtures` approach:

### ./cypress/fixtures/hotels.json

```json
[
  {
    "id": "id-1",
    "thumbNailUrl": "test-picture-1",
    "name": "test-name-1",
    "shortDescription": "test-description-1",
    "address1": "test-address-1",
    "hotelRating": 1,
    "city": "test-city-1"
  },
  {
    "id": "id-2",
    "thumbNailUrl": "test-picture-2",
    "name": "test-name-2",
    "shortDescription": "test-description-2",
    "address1": "test-address-2",
    "hotelRating": 2,
    "city": "test-city-2"
  }
]
```

- Update spec:

### ./cypress/integration/hotel-collection.spec.ts

```diff
- import { HotelEntityApi } from '../../src/pods/hotel-collection/api';

...
  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   const hotels = [
-     {
-       id: 'id-1',
-       thumbNailUrl: 'test-picture-1',
-       name: 'test-name-1',
-       shortDescription: 'test-description-1',
-       address1: 'test-address-1',
-       hotelRating: 1,
-       city: 'test-city-1',
-     },
-     {
-       id: 'id-2',
-       thumbNailUrl: 'test-picture-2',
-       name: 'test-name-2',
-       shortDescription: 'test-description-2',
-       address1: 'test-address-2',
-       hotelRating: 2,
-       city: 'test-city-2',
-     },
-   ] as HotelEntityApi[];
    cy.server(); // Start the server to change request behaviour
+   cy.fixture('hotels').then((hotels) => {
      cy.route('GET', '/api/hotels', hotels);
+   });

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });

```

- Or a shorted way:

### ./cypress/integration/hotel-collection.spec.ts

```diff
  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
    cy.server(); // Start the server to change request behaviour
-   cy.fixture('hotels').then((hotels) => {
-     cy.route('GET', '/api/hotels', hotels);
-   });
+   cy.route('GET', '/api/hotels', 'fixture:hotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
