describe('Plugins', () => {
  beforeEach(() => {
    cy.loginAsGuest();
  });
  afterEach(() => {
    cy.clearSessionStorage();
  });

  // Given I am on the Plugins - Tools page
  describe('Plugins Page', () => {
    beforeEach(() => {
      cy.visit('/plugins');
    });

    const plugins = [
      {
        name: 'API Docs',
        url: '/catalog/default/api/catalog-api/definition',
      },
      {
        name: 'Datadog',
        url: '/catalog/default/api/catalog-api/datadog',
      },
      {
        name: 'GitHub Actions',
        url: '/catalog/default/component/frontend/github-actions',
      },
      {
        name: 'GitHub Insights',
        url: '/catalog/default/component/lighthouse-hub-monorepo/code-insights',
      },
      {
        name: 'Security Insights',
        url: '/catalog/default/component/lighthouse-hub-monorepo/security-insights',
      },
    ];

    plugins.forEach(({ name, url }) => {
      it(`Should load the ${name} page`, () => {
        // When I select Explore from the plugin card
        cy.contains(name)
          .parent()
          .parent()
          .within(() => {
            cy.contains('Explore').click();
          });

        // Then the correct page displays
        cy.url().should('include', url);
      });
    });

    // The tech insights plugin links to a website outside of Lighthouse Hub, so we need to verify the href here.
    it(`Should link to the Tech Insights page`, () => {
      // When I select Explore from the plugin card
      cy.contains('Tech Insights')
        .parent()
        .parent()
        .within(() => {
          cy.contains('Explore')
            .should('have.attr', 'href')
            .and('include', '/backstage/plugins/tech-insights/');
        });
    });
  });
});
