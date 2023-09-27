describe('Given an API has not published release notes', () => {
  beforeEach(() => {
    // add artists api to the catalog if it doesn't already exist
    cy.loginAsGitHubUser();
    cy.addEntity(
      'https://github.com/department-of-veterans-affairs/lighthouse-developer-portal-catalog-entries/blob/main/catalog-tests/apis/artists-api.yaml',
    );
  });

  afterEach(() => {
    // remove artists api from the catalog
    cy.removeEntity('/catalog/default/api/artists/');
    cy.signOutUser();
  });

  describe("And the 'Release Notes' tab is selected", () => {
    beforeEach(() => {
      cy.visit('/catalog/default/api/artists/release-notes');
      cy.url().should('contain', '/catalog/default/api/artists/release-notes');
    });

    describe("When a user clicks on 'VA's public API Portal'", () => {
      beforeEach(() => {
        cy.get('a')
          .contains("VA's public API Portal")
          .first()
          .as('VaPublicApiPortalLink');
        cy.get('@VaPublicApiPortalLink')
          .invoke('attr', 'href')
          .then(href => cy.request(href).its('status').should('eq', 200));
        cy.get('@VaPublicApiPortalLink').invoke('removeAttr', 'target').click();
      });

      it('Then developer.va.gov opens', () =>
        cy.url().should('include', 'developer.va.gov', { timeout: 45000 }));
    });

    describe("When a user clicks on 'Lighthouse platform backend'", () => {
      beforeEach(() => {
        cy.get('a').contains('Lighthouse platform backend').as('LpbLink');
        cy.get('@LpbLink')
          .invoke('attr', 'href')
          .then(href => cy.request(href).its('status').should('eq', 200));
        cy.get('@LpbLink').invoke('removeAttr', 'target').click();
      });

      it('Then a data model opens in Github', () =>
        cy
          .url()
          .should(
            'include',
            'github.com/department-of-veterans-affairs/lighthouse-platform-backend',
            { timeout: 30000 },
          ));
    });

    describe("When a user clicks on 'contact us'", () => {
      beforeEach(() => cy.get('a').contains('contact us').click());

      it('Then the feedback modal is displayed', () =>
        cy
          .get('h2')
          .contains(/Provide feedback on the Lighthouse.*Hub/)
          .should('be.visible'));
    });
  });
});

// Enable + update this test once this plugin is implemented for Lighthouse APIs
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Given an API has published release notes through Lighthouse', () => {
  beforeEach(() => {
    cy.loginAsGitHubUser();
    cy.visit('/catalog/default/api/appeals-status-api-release-notes');
  });

  describe("When a user selects the 'Release Notes' tab", () => {
    beforeEach(() =>
      cy.get('article[class^="BackstageContent-"]').as('ContentWrapper'),
    );

    it("Then the API's release notes are displayed", () => {
      // Matches for 'Month Date, Year' format, e.g. 'January 1, 2000'
      cy.get('@ContentWrapper')
        .get('h3')
        .invoke('text')
        .should('match', /[a-zA-Z]+\s\d+,\s20\d{2}/);
      cy.get('@ContentWrapper').get('p').invoke('text').should('not.be.empty');
    });

    afterEach(() => cy.signOutUser());
  });
});
