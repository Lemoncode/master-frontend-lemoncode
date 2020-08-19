# 04 Wait requests

In this example we are going to use real hotel request.

We will start from `03-stub-requests`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Maybe some times we need to use real backend server for some reason, we have a spec check hotel collection from "real backend" (it's a mock backend). It looks like it's working, but what's happend if we add some delay?:

### ./src/pods/hotel-collection/api/hotel-collection.api.ts

```diff
import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- const { data } = await Axios.get<HotelEntityApi[]>(url);
- return data;
+ const promise = new Promise<HotelEntityApi[]>((resolve) => {
+   Axios.get(url).then(({ data }) => setTimeout(() => resolve(data), 4000));
+ });

+ return promise;
};

```

- Now, it's failing due to cypress timeout, so we need to refactor it:

### ./cypress/integration/hotel-collection.spec.ts

```diff
  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
    cy.server(); // Start the server to change request behaviour
-   cy.route('GET', '/api/hotels', 'fixture:hotels');
+   cy.route('GET', '/api/hotels', 'fixture:hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 2);
  });

```

- Apply same changes in other specs:

### ./cypress/integration/hotel-collection.spec.ts

```diff
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange
+   cy.server();
+   cy.route('GET', '/api/hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length', 10);
  });

  it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange
+   cy.server();
+   cy.route('GET', '/api/hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');

    // Assert
+   cy.wait('@fetchHotels');
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });
```

- So, we need to take care with this stuff, let's restore the api request:

### ./src/pods/hotel-collection/hotel-collection.api.ts

```diff
import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- const promise = new Promise<HotelEntityApi[]>((resolve) => {
-   Axios.get(url).then(({ data }) => setTimeout(() => resolve(data), 4000));
- });
- return promise;
+ const { data } = await Axios.get<HotelEntityApi[]>(url);

+ return data;
};

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
