import translate from '../../fixtures/catalogImport/translate.json';
import addApi from '../../fixtures/catalogImport/addApi.json';

describe('Given I am on the catalog import page', () => {
  // Set current user as guest and visit the Catalog API page
  beforeEach(() => {
    cy.intercept(
      { method: 'POST', url: '**/api/catalog/locations?dryRun=true' },
      {
        statusCode: 201,
        body: translate,
      },
    ).as('translateIntercept');
    cy.intercept(
      { method: 'POST', url: '**/api/catalog/locations' },
      {
        statusCode: 201,
        body: addApi,
      },
    ).as('addApiIntercept');
    cy.viewport(1600, 1000);
    cy.loginAsGuest();
    cy.visit('/');
    cy.contains('Add to Catalog').click();
  });
  afterEach(() => {
    cy.clearSessionStorage();
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

  describe('When I select the "LEARN MORE ABOUT OUR CATALOG" link', () => {
    beforeEach(() => {
      cy.contains('LEARN MORE ABOUT OUR CATALOG').should('exist');
    });

    it('Then the "Starter Guide" documentation page is displayed', () => {
      cy.get(
        'a[href="/docs/default/component/lighthouse-hub-monorepo/Development/starter-guide"]',
      )
        .contains('LEARN MORE ABOUT OUR CATALOG')
        .should('exist');
    });
  });

  it('Then the translate button should be disabled', () => {
    cy.contains('button', 'Submit').should('be.disabled');
  });

  it('Then the url input should be present', () => {
    cy.get('input[name="url"]').should('exist');
  });

  describe('When I enter an API Repository URL', () => {
    beforeEach(() => {
      cy.get('input[id="url"]').type(
        'https://github.com/KaemonIsland/lighthouse-developer-portal-test/blob/main/api-no-relation.yaml',
      );
    });

    it('Then the analyze button should be active', () => {
      cy.contains('button', 'Submit').should('not.be.disabled');
    });

    describe('When I press the Submit button', () => {
      beforeEach(() => {
        cy.contains('button', 'Submit').should('not.be.disabled').click();
      });

      it('Then a review of the entered API displays', () => {
        cy.contains(
          'p',
          'The following items will be added to the catalog:',
        ).should('exist');
      });

      it('Then the "Add" and "Back" buttons are active', () => {
        cy.contains('button', 'Add').should('not.be.disabled');
        cy.contains('button', 'Back').should('not.be.disabled');
      });

      describe('When I press the back button', () => {
        beforeEach(() => {
          cy.contains('button', 'Back').should('not.be.disabled').click();
        });

        it('Then the "Analyze" page is visible again', () => {
          cy.get("button[type='submit']").should('exist');
        });
      });

      describe('When I press the "Add" button', () => {
        beforeEach(() => {
          cy.contains('button', 'Add').should('not.be.disabled').click();
        });

        it('Then the API is imported and displays confirmation message', () => {
          cy.contains(
            'p',
            'The following items were added to the catalog:',
          ).should('exist');
        });
      });
    });
  });
});
