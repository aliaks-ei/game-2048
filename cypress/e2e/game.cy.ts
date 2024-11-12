/* eslint-disable cypress/no-unnecessary-waiting */
const moveTilesAndWait = (key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight") => {
  cy.get("html").trigger("keyup", { key });
  cy.wait(500);
};

describe("Game", () => {
  it("should move tiles around the board and add new ones", () => {
    cy.visit("/");

    // Trigger several arrow clicks
    moveTilesAndWait("ArrowUp");
    moveTilesAndWait("ArrowDown");
    moveTilesAndWait("ArrowLeft");
    moveTilesAndWait("ArrowRight");

    // At least one tile should appear after movements
    cy.get(".tile").should("have.length.at.least", 2);
  });

  it("start a new game", () => {
    cy.visit("/");

    // Trigger several arrow clicks
    moveTilesAndWait("ArrowUp");
    moveTilesAndWait("ArrowLeft");

    // Restart game
    cy.get("[data-testid='new-game']").click();

    cy.get(".tile").should("have.length", 1);
  });
});
