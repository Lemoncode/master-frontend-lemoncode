describe('Hotel collection specs', () => {
  it('should fetch hotel list and show it in screen when visit /hotel-collection url', () => {
    // Arrange
    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 10);
  });

  it('should fetch hotel list greater than 0 when visit /hotel-collection url', () => {
    // Arrange

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
  });

  it('should fetch two hotels when visit /hotel-collection url', () => {
    // Arrange
    cy.intercept('GET', '/api/hotels', { fixture: 'hotels' });

    // Act
    cy.visit('/hotel-collection');

    // Assert
    cy.findAllByRole('listitem').should('have.length', 2);
  });
});
