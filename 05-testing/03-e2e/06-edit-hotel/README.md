# 06 Edit hotel

In this example we are going to test a `hotel edit`.

We will start from `05-custom-commands`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- To edit an hotel we need to visit `hotels` and click on edit button:

### ./cypress/integration/hotel-edit.spec.ts

```javascript
describe('Hotel edit specs', () => {
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- To get available `edit button selector`, we need to add accessibility label:

### ./src/pods/hotel-collection/components/hotel-card.component.tsx

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

- Add spec:

### ./cypress/integration/hotel-edit.spec.ts

```diff
...
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange

    // Act
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
+     buttons[1].click();
+   });

    // Assert
+   cy.url().should('eq', 'http://localhost:8080/#/hotel-edit/2');
  });

```

- Add update hotel spec:

### ./cypress/integration/hotel-edit.spec.ts

```diff
...
+ it('should update hotel name when it edits an hotel and click on save button', () => {
+   // Arrange

+   // Act
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');

+   cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
+     buttons[1].click();
+   });

+   cy.findByLabelText('Name').clear().type('Updated hotel two');

+   cy.findByRole('button', { name: 'Save' }).click();

+   // Assert
+   cy.findByText('Updated hotel two');
+ });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
