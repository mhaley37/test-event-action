describe('Given a user is authenticated', () => {
  beforeEach(() => cy.loginAsGitHubUser());

  describe('When I select Feedback from the Sidebar', () => {
    beforeEach(() => cy.contains('Feedback').should('be.visible').click());

    it('Then the Feedback Modal displays', () => {
      cy.get('h2')
        .contains('Provide feedback on the Lighthouse Hub')
        .should('be.visible');
    });
  });

  describe('When I view the Sidebar', () => {
    beforeEach(() => cy.contains('Settings').should('be.visible'));

    it('Settings is displayed instead of Sign In', () =>
      cy.get('h6').contains('Sign In').should('not.exist'));

    afterEach(() => cy.signOutUser());
  });

  describe('When I select YAML File Best Practices from the Featured card', () => {
    beforeEach(() => {
      cy.get('a')
        .contains('YAML File Best Practices')
        .as('yamlBestPracticesLink');
      cy.get('@yamlBestPracticesLink').scrollIntoView();
      cy.get('@yamlBestPracticesLink').should('be.visible').click();
    });

    it('Then the Catalog Entry Template page Loads', () =>
      cy
        .url()
        .should(
          'include',
          '/docs/default/component/lighthouse-hub-monorepo/yaml-file-best-practices',
        ));
  });

  describe('When I select the Benefits Claims API link from the Featured card', () => {
    beforeEach(() => {
      cy.get('a').contains('Benefits Claims API').as('claimsApiLink');
      cy.get('@claimsApiLink').scrollIntoView();
      cy.get('@claimsApiLink').should('be.visible').click();
    });

    it('Then the Benefits Claims API page loads', () =>
      cy.url().should('include', '/catalog/default/api/claims-benefits'));
  });

  describe('When I select the Start Guide link from the Featured card', () => {
    beforeEach(() => cy.contains('Starter Guide').should('be.visible').click());

    it('Then the Starter Guide page loads', () =>
      cy
        .url()
        .should(
          'include',
          '/docs/default/component/lighthouse-hub-monorepo/Development/starter-guide',
        ));
  });

  describe('When I select "Get in Touch" from the Feedback modal', () => {
    beforeEach(() => {
      // Intercept the POST request to the GitHub API to prevent issues from being created
      cy.intercept(
        {
          method: 'POST',
          url: 'https://api.github.com/repos/department-of-veterans-affairs/lighthouse-developer-portal/issues',
        },
        {},
      );

      cy.contains('Get in touch!').click();
    });

    it('Then the Feedback modal opens', () => {
      cy.get('h2')
        .contains('Provide feedback on the Lighthouse Hub')
        .should('be.visible');
    });

    describe('And I select the Cancel button', () => {
      beforeEach(() => cy.contains('Cancel').should('be.visible').click());

      it('Then the Feedback modal closes', () => {
        cy.contains('Provide feedback on the Lighthouse Hub').should(
          'not.exist',
        );
      });
    });

    describe('And I Enter text into the suggestion field', () => {
      beforeEach(() =>
        cy
          .get('textarea')
          .not('[aria-hidden="true"]')
          .type('Automation Feedback Test'),
      );

      describe('And I select the Submit button', () => {
        beforeEach(() => cy.contains('Submit').should('be.visible').click());

        it('Then a dismissable confirmation message is displayed', () => {
          cy.contains('Feedback submitted!').should('be.visible');
          cy.contains('Provide feedback on the Lighthouse Hub').should(
            'not.exist',
          );
        });
      });
    });
  });
});
