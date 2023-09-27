describe('Announcements Plugin', () => {
  describe('Given I am logged in as a Guest User', () => {
    beforeEach(() => {
      cy.viewport(1600, 1000);
      cy.loginAsGuest();
    });

    afterEach(() => {
      cy.clearAllSessionStorage();
    });

    describe('AND I am on the Announcements Page', () => {
      beforeEach(() => {
        cy.visit('/announcements');
        cy.url().should('contain', '/announcements');
      });

      it('Then all current announcements are listed', () => {
        cy.get('div').contains('Announcements').should('be.visible');
      });

      it('Then the new announcement button is NOT visible', () => {
        cy.get('span').contains('New announcement').should('not.exist');
      });

      it('Then the edit announcement icon button is NOT visible', () => {
        cy.get('a[title="edit announcement"]').should('not.exist');
      });

      it('Then the delete announcement icon button is NOT visible', () => {
        cy.get('a[title="delete announcement"]').should('not.exist');
      });

      it('Then the Categories Menu button is NOT visible', () => {
        cy.get('button[data-testid="menu-button"]').should('not.exist');
      });
    });
  });
});
