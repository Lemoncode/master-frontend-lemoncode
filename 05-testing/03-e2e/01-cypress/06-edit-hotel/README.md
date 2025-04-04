# 06 Edit hotel

In this example we are going to test a `hotel edit`.

We will start from `05-custom-commands`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

To edit an hotel we need to visit `hotels` and click on edit button:

_./cypress/e2e/hotel-edit.spec.ts_

```javascript
describe('Hotel edit specs', () => {
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

To get available `edit button selector`, we need to add accessibility label:

_./src/pods/hotel-collection/components/hotel-card.component.tsx_

```diff
...
    <CardActions>
      <IconButton
+       aria-label="Edit hotel"
        onClick={() => history.push(linkRoutes.hotelEdit(hotel.id))}
      >
        <EditIcon />
      </IconButton>
    </CardActions>
```

Add spec:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
...
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange
+   cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
+   cy.visit('/hotel-collection');
+   cy.wait('@fetchHotels');
+   cy.findAllByRole('button', { name: /edit hotel/i })
+     .eq(1)
+     .click();

    // Assert
+   cy.url().should('contain', '/hotel-edit/2');
  });

```
> [eq command](https://docs.cypress.io/api/commands/eq)
>
> See also:
>
> `cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {   buttons[1].click(); });`
>
> [Official docs](https://docs.cypress.io/api/commands/then)

Add update hotel spec:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
...
+ it('should update hotel name when it edits an hotel and click on save button', () => {
+   // Arrange
+   cy.intercept('GET', '/api/hotels').as('fetchHotels');

+   // Act
+   cy.visit('/hotel-collection');
+   cy.wait('@fetchHotels');
+   cy.findAllByRole('button', { name: /edit hotel/i })
+     .eq(1)
+     .click();

+   cy.findByLabelText('Name').clear().type('Updated hotel two');
+   cy.findByRole('button', { name: 'Save' }).click();

+   // Assert
+   cy.findByText('Updated hotel two');
+ });
```

The previous spec could works or not, due to we are not waiting to be resolved the get hotel request:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
...
  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels').as('fetchHotels');
+   cy.intercept('GET', '/api/hotels/2').as('fetchHotel');
+   cy.intercept('GET', '/api/cities').as('fetchCities');

    // Act
    cy.visit('/hotel-collection');
    cy.wait('@fetchHotels');
    cy.findAllByRole('button', { name: /edit hotel/i })
      .eq(1)
      .click();

+   cy.wait('@fetchHotel');
+   cy.wait('@fetchCities');

    cy.findByLabelText('Name').clear().type('Updated hotel two');
    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
+   cy.wait('@fetchHotels');
    cy.findByText('Updated hotel two');
  });
```

But if we change network to `Fast 4G` on `Chrome options` to simulate a device with a slow connection, it will fail. Because it takes more time to render the hotel page with the new values from the server and the spec is not waiting for it.

In this case, we can use a selector to wait for the component to have some value before writing the new one:

_./cypress/e2e/hotel-edit.spec.ts_

```diff
...
  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels').as('fetchHotels');
    cy.intercept('GET', '/api/hotels/2').as('fetchHotel');
    cy.intercept('GET', '/api/cities').as('fetchCities');

    // Act
    cy.visit('/hotel-collection');
    cy.wait('@fetchHotels');
    cy.findAllByRole('button', { name: /edit hotel/i })
      .eq(1)
      .click();

    cy.wait('@fetchHotel');
    cy.wait('@fetchCities');

+   cy.findByLabelText('Name').should('not.have.value', '');
    cy.findByLabelText('Name').clear().type('Updated hotel two');
    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
    cy.wait('@fetchHotels');
    cy.findByText('Updated hotel two');
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
