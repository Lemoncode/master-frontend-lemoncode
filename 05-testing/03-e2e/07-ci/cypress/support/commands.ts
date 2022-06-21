interface Resource {
  path: string;
  fixture?: string;
  alias?: string;
}

Cypress.Commands.add(
  'loadAndVisit',
  (
    visitUrl: string,
    resources: Resource[],
    callbackAfterVisit?: () => void
  ) => {
    const aliasList = resources.map((resource, index) => {
      const alias = resource.alias || `load-${index}`;
      Boolean(resource.fixture)
        ? cy
            .intercept('GET', resource.path, { fixture: resource.fixture })
            .as(alias)
        : cy.intercept('GET', resource.path).as(alias);

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
