Cypress.Commands.add(
  'loadAndVisit',
  (apiPath: string, routePath: string, fixture?: string) => {
    Boolean(fixture)
      ? cy.intercept('GET', apiPath, { fixture }).as('load')
      : cy.intercept('GET', apiPath).as('load');
    cy.visit(routePath);

    cy.wait('@load');
  }
);
