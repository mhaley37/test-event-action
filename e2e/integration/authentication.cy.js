import { AUTHENTICATED_HEADER_SELECTOR, GITHUB_SIGN_IN_BUTTON_ID } from '../../support/constants.js';

describe('Given a user is unauthenticated', () => {
  beforeEach(() => cy.signOutUser());

  describe('When the user navigates to any page', () => {
    beforeEach(() => cy.visit('/catalog'));

    it('Then the user is redirected to the Sign In page', () => {
      cy.get(AUTHENTICATED_HEADER_SELECTOR).should('not.exist');
      cy.get(GITHUB_SIGN_IN_BUTTON_ID).should('be.visible');
    });
  });

  describe('When the user authenticates unsuccessfully', () => {
    beforeEach(() => {
      cy.window().then(win => cy.stub(win, 'open'));
      cy.get(GITHUB_SIGN_IN_BUTTON_ID).click();
    });

    it('Then the sign-in modal is still displayed', () => cy.get(GITHUB_SIGN_IN_BUTTON_ID).should('be.visible'));
    it('Then an error message is displayed', () => {
      cy.contains('Login failed; caused by PopupRejectedError').should('be.visible');
    });
  });

  describe('When the user authenticates successfully', () => {
    let startUrl;

    beforeEach(() => {
      cy.intercept('GET', '**/entity-facets?facet=metadata.tags').as('CatalogBackend')
      cy.visit(Cypress.config().baseUrl);
      cy.window().then(win => cy.stub(win, 'open', redirectUrl => (startUrl = redirectUrl)));
      cy.get(GITHUB_SIGN_IN_BUTTON_ID).click().then(() => cy.request({ url: startUrl, followRedirect: false }));
      cy.loginAsGitHubUser();
      cy.visit('/catalog');
      cy.wait('@CatalogBackend');
    });

    it('Then the user proceeds to the requested page',
      () => cy.get(AUTHENTICATED_HEADER_SELECTOR).should('be.visible'));

    afterEach(() => cy.signOutUser());
  });
});

describe('Given a user is authenticated', () => {
  beforeEach(() => cy.loginAsGitHubUser());

  describe('When the user navigates to any page', () => {
    beforeEach(() => cy.visit('/catalog'));

    it('Then they proceed to the requested page', () => {
      cy.get(AUTHENTICATED_HEADER_SELECTOR).should('be.visible');
      cy.get(GITHUB_SIGN_IN_BUTTON_ID).should('not.exist');
    });
  });

  afterEach(() => cy.signOutUser());
});
