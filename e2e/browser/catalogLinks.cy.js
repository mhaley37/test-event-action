describe('Given I am on the default Catalog - APIs page', () => {
  // Set current user as guest and visit the Catalog API page
  beforeEach(() => {
    cy.loginAsGuest();
    cy.visit('/');
    cy.contains('Catalog').click();
  });
  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I Select the Add to Catalog button', () => {
    beforeEach(() => {
      cy.contains('Add to catalog').click();
    });

    it('Then the Catalog Import page should load', () => {
      cy.url().should('include', '/catalog');
      cy.contains('Add to Catalog');
    });
  });

  describe('When I Select the Support Icon', () => {
    beforeEach(() => {
      cy.get('button[aria-label="Support"]').click();
    });

    it('Then the Contact Support Team popup displays', () => {
      cy.contains('Contact Support Team').should('be.visible');
    });

    describe('When I select Close on the Contact Support Team popup', () => {
      beforeEach(() => {
        cy.contains('Close').should('be.visible').click();
      });

      it('Then the Support popup closes', () => {
        cy.contains('Contact Support Team').should('not.exist');
      });
    });

    describe('When I select Github Issues link', () => {
      beforeEach(() => {
        cy.contains('GitHub Issues').should('be.visible');
      });

      it('Then the Github issues page loads', () => {
        cy.get('a')
          .contains('GitHub Issues')
          .should(
            'have.prop',
            'href',
            'https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues',
          );
      });
    });
  });
});
