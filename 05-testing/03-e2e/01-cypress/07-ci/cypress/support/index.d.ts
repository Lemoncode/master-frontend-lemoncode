declare namespace Cypress {
  interface Chainable {
    loadAndVisit(
      apiPath: string,
      routePath: string,
      fixture?: string
    ): Chainable<Element>;
  }
}
