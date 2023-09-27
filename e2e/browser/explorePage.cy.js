describe('Explore Page', () => {
  it('should render the explore page', () => {
    cy.loginAsGuest();
    cy.visit('/plugins');
    cy.get('[data-testid=header-title]').contains('Tools').should('be.visible');
  });
});
