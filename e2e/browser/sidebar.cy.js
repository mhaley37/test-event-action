describe('Sidebar', () => {
  beforeEach(() => {
    cy.loginAsGuest();
  });
  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('Sidebar Links', () => {
    beforeEach(() => {
      // Given I am on the Homepage
      cy.visit('/');
    });

    it('Should load homepage (icon)', () => {
      // When I select the VA | Lighthouse Icon from the sidebar
      cy.get('#lighthouse-logo-nav').click();

      // Then the user is redirected to the homepage
      cy.url().should('include', '/');
    });

    it('Should load search page', () => {
      // When I select teh Search Link from the sidebar
      cy.get('h6').contains('Search').click();

      // Then The search popup displays
      cy.get('input')
        .should('have.attr', 'placeholder', 'SEARCH')
        .should('be.visible');
    });

    it('Should load home page (home)', () => {
      // When I select Home from teh sidebar
      cy.get('h6').contains('Home').should('be.visible').click();

      // Then the user is redirected to the homepage
      cy.url().should('include', '/');
    });

    it('Should load Browse Catalog page', () => {
      // When I select Catalog from the sidebar
      cy.get('h6').contains('Catalog').should('be.visible').click();

      // Then The Browse Catalog page displays
      cy.url().should('include', '/catalog');
    });

    it('Should load Documentation page', () => {
      // When I select Docs from the sidebar
      cy.get('h6').contains('Docs').should('be.visible').click();

      // Then The Documentation page displays
      cy.url().should('include', '/docs');
    });

    it('Should load Plugins page', () => {
      // When I select Plugins from the sidebar
      cy.get('h6').contains('Plugins').should('be.visible').click();

      // Then The Plugins page displays
      cy.url().should('include', '/plugins');
    });

    it('Should load Starter Guide page', () => {
      // When I select Starter Guide from the sidebar
      cy.get('h6').contains('Starter Guide').should('be.visible').click();

      // Then The Starter Guide page displays
      cy.url().should(
        'include',
        '/docs/default/component/lighthouse-hub-monorepo/Development/starter-guide',
      );
    });

    it('Should load Add to Catalog page', () => {
      // When I select Add to Catalog from the sidebar
      cy.get('h6').contains('Add to Catalog').should('be.visible').click();

      // Then The catalog import page displays
      cy.url().should('include', '/catalog-import');
    });

    it('Should load Announcements Page', () => {
      // When I select Add to Catalog from the sidebar
      cy.get('h6').contains('Announcements').should('be.visible').click();

      // Then The catalog import page displays
      cy.url().should('include', '/announcements');
    });

    // TODO Update this once we have an authenticated test user!
    it('Should load Feedback popup', () => {
      // When I select Feedback from the sidebar
      cy.get('h6').contains('Feedback').should('be.visible').click();

      // Then The Login Required popup displays
      cy.get('[role="dialog"]').contains('Login Required').as('loginScreen');
      cy.get('@loginScreen').scrollIntoView().should('be.visible');
    });

    // TODO Update this once we have an authenticated test user!
    it('Should load Sign In popup', () => {
      // When I select Feedback from the sidebar
      cy.get('h6').contains('Sign In').should('be.visible').click();

      // Then The Login Required popup displays
      cy.get('[role="dialog"]').contains('Login Required').as('loginScreen');
      cy.get('@loginScreen').scrollIntoView().should('be.visible');
    });
  });
});
