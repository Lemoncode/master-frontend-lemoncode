# 03 Stub requests

In this example we are going to stub hotel request.

We will start from `02-selectors`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will create `hotel-collection` specs:

### ./cypress/e2e/hotel-collection.spec.ts

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

### ./cypress/e2e/hotel-collection.spec.ts

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

### ./cypress/e2e/hotel-collection.spec.ts

```diff
+ import { HotelEntityApi } from '../../src/pods/hotel-collection/api';

describe('Hotel collection specs', () => {
  ...
+ it('should fetch two hotels when visit /hotel-collection url', () => {
+   // Arrange
+   const hotels = [
+     {
+       id: '1',
+       thumbNailUrl: '/thumbnails/50947_264_t.jpg',
+       name: 'Motif Seattle',
+       shortDescription: 'With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within',
+       address1: '1415 5th Ave',
+       hotelRating: 4,
+       city: 'Seattle',
+     },
+     {
+       id: '2',
+       thumbNailUrl: '/thumbnails/16673_260_t.jpg',
+       name: 'The Westin Seattle',
+       shortDescription: 'With a stay at The Westin Seattle, you\'ll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to',
+       address1: '1900 5th Ave',
+       hotelRating: 4,
+       city: 'Seattle',
+     },
+   ] as HotelEntityApi[];
+   cy.intercept('GET', '/api/hotels', hotels);

+   // Act
+   cy.visit('/hotel-collection');

+   // Assert
+   cy.findAllByRole('listitem').should('have.length', 2);
+ });
});

```

> [intercept method](https://docs.cypress.io/api/commands/intercept)
>
> Mock data, 404 responses, etc

- This is a common task that we will have to do, so cypress provide the `fixtures` approach:

### ./cypress/fixtures/hotels.json

```json
[
  {
    "id": "1",
    "thumbNailUrl": "/thumbnails/50947_264_t.jpg",
    "name": "Motif Seattle",
    "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
    "address1": "1415 5th Ave",
    "hotelRating": 4,
    "city": "Seattle"
  },
  {
    "id": "2",
    "thumbNailUrl": "/thumbnails/16673_260_t.jpg",
    "name": "The Westin Seattle",
    "shortDescription": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
    "address1": "1900 5th Ave",
    "hotelRating": 4,
    "city": "Seattle"
  }
]
```

- Update spec:

### ./cypress/e2e/hotel-collection.spec.ts

```diff
- import { HotelEntityApi } from '../../src/pods/hotel-collection/api';

...
  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   const hotels = [
-     {
-       id: '1',
-       thumbNailUrl: '/thumbnails/50947_264_t.jpg',
-       name: 'Motif Seattle',
-       shortDescription: 'With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within',
-       address1: '1415 5th Ave',
-       hotelRating: 4,
-       city: 'Seattle',
-     },
-     {
-       id: '2',
-       thumbNailUrl: '/thumbnails/16673_260_t.jpg',
-       name: 'The Westin Seattle',
-       shortDescription: 'With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to',
-       address1: '1900 5th Ave',
-       hotelRating: 4,
-       city: 'Seattle',
-     },
-   ] as HotelEntityApi[];
+   cy.fixture('hotels').then((hotels) => {
      cy.intercept('GET', '/api/hotels', hotels);
+   });

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });

```

- Or a shorted way:

### ./cypress/e2e/hotel-collection.spec.ts

```diff
  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
-   cy.fixture('hotels').then((hotels) => {
-     cy.intercept('GET', '/api/hotels', hotels);
-   });
+   cy.intercept('GET', '/api/hotels', { fixture: 'hotels' });

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
