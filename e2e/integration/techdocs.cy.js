/*
    integration tests for techdocs

    to run locally:

        docker compose -f docker-compose.localstack.yml -f docker-compose.yml up -d

        cd /packages/app/

        yarn run cy:run --spec cypress/e2e/integration/localTechdocs.cy.js
*/

describe('Given I am on the Documentation page', () => {
  beforeEach(() => {
    cy.viewport(1600, 1000);
    cy.loginAsGuest();
    cy.visit('/docs');
    cy.url().should('contain', '/docs?filters%5Buser%5D=all');
  });

  afterEach(() => {
    cy.clearAllSessionStorage();
  });

  describe('When I click on the name of a document under the Document column', () => {
    beforeEach(() => {
      cy.get('div').contains('Lighthouse Hub').click({ force: true });

      cy.url().should(
        'include',
        'docs/default/component/lighthouse-hub-monorepo',
      );
    });

    it('Then the page for the selected document loads', () => {
      cy.get('h1')
        .contains('Lighthouse Hub Documentation')
        .should('be.visible');
    });

    it('AND the documentation loads in shadow root', () => {
      cy.get('div[data-testid*="techdocs-native-shadowroot"]')
        .shadow()
        .as('shadowroot');

      cy.get('@shadowroot')
        .find('h1')
        .contains('Welcome to the Lighthouse Hub')
        .should('be.visible');
    });
  });

  describe('When I select the owner name from the Owner column for a given document', () => {
    beforeEach(() => {
      cy.get('div').contains('lighthouse-bandicoot').click({ force: true });
      cy.url().should('include', 'lighthouse-bandicoot');
    });

    it('Then the Owner page for the respective document loads', () => {
      cy.get('div').contains('group').should('be.visible');
      cy.get('div').contains('lighthouse-bandicoot').should('be.visible');
    });
  });

  describe('When I select the star/favorite icon under the action column for a given document', () => {
    beforeEach(() => {
      cy.get('[title*="Add to favorites"]')
        .first()
        .as('favButton')
        .click({ force: true });
    });

    it('Then the Star icon color changes to yellow', () => {
      cy.get('@favButton')
        .should('have.css', 'color')
        .and('eq', 'rgba(0, 0, 0, 0.87)');
    });

    it('AND the Starred label under the Personal section increments by +1', () => {
      cy.get('[data-testid="user-picker-starred"]')
        .should('have.attr', 'aria-disabled', 'false')
        .parents('li')
        .contains('1');
    });
  });

  describe('When I select the Support icon', () => {
    beforeEach(() => {
      cy.get('button[data-testid="support-button"]').click({ force: true });
    });

    it('Then the Support popup displays', () => {
      cy.get('span').contains('Contact Support Team').should('be.visible');
    });
  });

  describe('When I enter values into the Filter search', () => {
    beforeEach(() => {
      cy.get('input[aria-label*="Search"]').as('searchBox').should('exist');

      cy.get('@searchBox').type('lighthouse-bandicoot');

      cy.get('[class*="MuiTableBody-root"]')
        .find('[class*="MuiTableRow-root"]')
        .filter(':contains(" ")')
        .as('entityTable')
        .should('not.contain', 'Veterans API');
    });

    it('Then the value is present in the search box', () => {
      cy.get('@searchBox').should('have.value', 'lighthouse-bandicoot');
    });

    it('AND the values in the Documentation table are updated and include only values within search parameters', () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get('@entityTable').each(row => {
        cy.wrap(row).as('row');

        cy.get('@row')
          .find('a', { timeout: 100000 })
          .should('contain', 'lighthouse');
      });
    });
  });

  describe('When I select an owner value from the Owner dropdown list', () => {
    beforeEach(() => {
      cy.get('label').contains('Owner').parent().as('ownerPicker');

      cy.get('@ownerPicker')
        .find('svg[data-testid="owner-picker-expand"]')
        .click({ force: true });

      cy.get('label').contains('lighthouse-bandicoot').siblings('span').click();
    });

    it('Then the owner is added to the Owner filter', () => {
      cy.get('@ownerPicker')
        .contains('lighthouse-bandicoot')
        .should('be.visible');
    });

    it('AND the table is updated to include only Documents belonging to the selected owner', () => {
      cy.get('[class*="MuiTableBody-root"]')
        .find('[class*="MuiTableRow-root"]')
        .filter(':contains(" ")') // filter out empty rows in table
        .should('not.contain', 'Veterans API')
        .each(row => {
          cy.wrap(row).contains('lighthouse-bandicoot').should('exist');
        });
    });
  });

  describe('When I select a tag value from the Tags dropdown list', () => {
    beforeEach(() => {
      cy.get('label').contains('Tags').parent().as('tagPicker').click();

      cy.get('label').contains('monorepo').siblings('span').click();

      cy.get('header').scrollIntoView();
    });

    it('Then the tag is added to the Tag filter', () => {
      cy.get('@tagPicker')
        .find('[class*="MuiChip-label"]')
        .contains('monorepo')
        .should('be.visible');
    });

    it('AND the table is updated to include only Documents belonging to the selected tag', () => {
      cy.get('[class*="MuiTableBody-root"]')
        .find('[class*="MuiTableRow-root"]')
        .filter(':contains(" ")') // filter out empty rows in table
        .should('not.contain', 'Veterans API')
        .each(row => {
          cy.wrap(row).contains('monorepo').should('be.visible');
        });
    });
  });
});
