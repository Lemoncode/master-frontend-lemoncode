describe('Hotel edit specs', () => {
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange
    // Act
    cy.loadAndVisit('/hotel-collection', [{ path: '/api/hotels' }]);
    cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
      $buttons[1].click();
    });

    // Assert
    cy.url().should('eq', 'http://localhost:8080/#/hotel-edit/2');
  });

  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
    cy.loadAndVisit(
      '/hotel-collection',
      [
        { path: '/api/hotels', alias: 'loadHotels' },
        { path: '/api/hotels/2' },
        { path: '/api/cities' },
      ],
      () => {
        cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
          $buttons[1].click();
        });
      }
    );

    cy.findByLabelText('Name').should('not.have.value', '');

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
    cy.wait('@loadHotels');
    cy.findByText('Updated hotel two');
  });
});
