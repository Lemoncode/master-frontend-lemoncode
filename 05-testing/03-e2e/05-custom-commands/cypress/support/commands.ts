Cypress.Commands.add(
  'loadAndVisit',
  (apiPath: string, routePath: string, fixture?: string) => {
    cy.server();
    Boolean(fixture)
      ? cy.route('GET', apiPath, fixture).as('load')
      : cy.route('GET', apiPath).as('load');
    cy.visit(routePath);

    return cy.wait('@load');
  }
);
