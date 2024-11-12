const newGridSize = 4;
const newNumOnbstacles = 2;

describe("Settings", () => {
  it("should update board settings", () => {
    cy.visit("/");

    // Open settings dialog
    cy.get("[data-testid='open-settings']").click();
    cy.get("[data-testid='app-dialog']").should("be.visible");

    // Update grid size
    cy.get("[data-testid='grid-size-setting']").select(newGridSize.toString());

    // Update obstacles
    cy.get("[data-testid='obstacles-setting']").select(newNumOnbstacles.toString());

    // Save settings
    cy.get("[data-testid='save-settings']").click();

    // Vefiry game changed
    cy.get(".tile.tile--obstacle").should('have.length', newNumOnbstacles);
    cy.get("[data-testid='grid-item']").should('have.length', Math.pow(newGridSize, 2));
  });
});
