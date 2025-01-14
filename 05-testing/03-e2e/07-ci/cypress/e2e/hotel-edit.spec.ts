describe('Hotel edit specs', () => {
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels').as('fetchHotels');

    // Act
    cy.visit('/hotel-collection');
    cy.wait('@fetchHotels');
    cy.findAllByRole('button', { name: /edit hotel/i })
      .eq(1)
      .click();

    // Assert
    cy.url().should('equal', 'http://localhost:8080/#/hotel-edit/2');
  });

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

    cy.findByLabelText('Name').should('not.have.value', '');
    cy.findByLabelText('Name').clear().type('Updated hotel two');
    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
    cy.wait('@fetchHotels');
    cy.findByText('Updated hotel two');
  });
});
