// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("a", "Play Dig!");
    cy.contains("a", "Tool Editor");
    cy.contains("a", "About");
  });
});
