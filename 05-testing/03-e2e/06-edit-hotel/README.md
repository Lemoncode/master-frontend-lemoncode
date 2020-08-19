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

- The previous spec could works or not, due to we are not waiting to be resolved the get hotel request. If we change network to `Slow 3G` on `Chrome options` to simulate it, we will need do something like:

### ./cypress/integration/hotel-edit.spec.ts

```diff
...
  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
    cy.loadAndVisit('/api/hotels', '/hotel-collection');

+   cy.route('GET', '/api/hotels/2').as('loadHotel');

    cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
      buttons[1].click();
    });

+   cy.wait('@loadHotel');

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
+   cy.wait('@load'); // TODO: Refactor custom command loadAndVisit
    cy.findByText('Updated hotel two');
  });
```

- Refactor command:

### ./cypress/support/commands.ts

```diff
+ interface Resource {
+   path: string;
+   fixture?: string;
+   alias?: string;
+ }

Cypress.Commands.add(
  'loadAndVisit',
- (apiPath: string, routePath: string, fixture?: string) => {
+ (visitUrl: string, resources: Resource[], callbackAfterVisit?: () => void) => {
    cy.server();
-   Boolean(fixture)
-     ? cy.route('GET', apiPath, fixture).as('load')
-     : cy.route('GET', apiPath).as('load');
+   const aliasList = resources.map((resource, index) => {
+     const alias = resource.alias || `load-${index}`;
+     Boolean(resource.fixture)
+       ? cy.route('GET', resource.path, resource.fixture).as(alias)
+       : cy.route('GET', resource.path).as(alias);

+     return alias;
+   });

-   cy.visit(routePath);
+   cy.visit(visitUrl);
+   if (callbackAfterVisit) {
+     callbackAfterVisit();
+   }

-   return cy.wait('@load');
+   aliasList.forEach((alias) => {
+     cy.wait(`@${alias}`);
+   });

+   return cy;
  }
);

```

- Update `d.ts`:

### ./cypress/support/index.d.ts

```diff
declare namespace Cypress {
+ interface Resource {
+   path: string;
+   fixture?: string;
+   alias?: string;
+ }

  interface Chainable {
    loadAndVisit(
-     apiPath: string,
+     visitUrl: string,
-     routePath: string,
+     resources: Resource[],
-     fixture?: string
+     callbackAfterVisit?: () => void
    ): Chainable<Element>;
  }
}

```

- Update specs:

### ./cypress/integration/hotel-edit.spec.ts

```diff
...
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange

    // Act
-   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.loadAndVisit('/hotel-collection', [{ path: '/api/hotels' }]);

    cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
      buttons[1].click();
    });

    // Assert
    cy.url().should('eq', 'http://localhost:8080/#/hotel-edit/2');
  });

  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
-   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.loadAndVisit(
+     '/hotel-collection',
+     [{ path: '/api/hotels', alias: 'loadHotels' }, { path: '/api/hotels/2' }],
+     () => {
+       cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
+         buttons[1].click();
+       });
+     }
+   );

-   cy.route('GET', '/api/hotels/2').as('loadHotel');

-   cy.findAllByRole('button', { name: 'Edit hotel' }).then((buttons) => {
-     buttons[1].click();
-   });

-   cy.wait('@loadHotel');

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
-   cy.wait('@load'); // TODO: Refactor custom command loadAndVisit
+   cy.wait('@loadHotels');
    cy.findByText('Updated hotel two');
  });
```

### ./cypress/integration/hotel-collection.spec.ts

```diff
...
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange

    // Act
-   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.loadAndVisit('/hotel-collection', [{ path: '/api/hotels' }]);

    // Assert
    cy.findAllByRole('listitem').should('have.length', 10);
  });

  it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange

    // Act
-   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.loadAndVisit('/hotel-collection', [{ path: '/api/hotels' }]);

    // Assert
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange

    // Act
-   cy.loadAndVisit('/api/hotels', '/hotel-collection', 'fixture:hotels');
+   cy.loadAndVisit('/hotel-collection', [
+     { path: '/api/hotels', fixture: 'fixture:hotels' },
+   ]);

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
