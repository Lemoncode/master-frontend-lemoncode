interface Resource {
  path: string;
  fixture?: string;
  alias?: string;
}

Cypress.Commands.add(
  'loadAndVisit',
  (visitUrl: string, resources: Resource[], callbackAfterVisit?: () => void) => {
    cy.server();
    const aliasList = resources.map((resource, index) => {
      const alias = resource.alias || `load-${index}`;
      Boolean(resource.fixture)
        ? cy.route('GET', resource.path, resource.fixture).as(alias)
        : cy.route('GET', resource.path).as(alias);

      return alias;
    });

    cy.visit(visitUrl);
    if (callbackAfterVisit) {
      callbackAfterVisit();
    }

    aliasList.forEach((alias) => {
      cy.wait(`@${alias}`);
    });
  }
);
