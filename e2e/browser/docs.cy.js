// docs landing page intercepts
import catalogQuery from '../../fixtures/apis/catalog.json';
import docsMetadata from '../../fixtures/techdocs/landingPage/docs_metadata.json';
import facetsMetadata from '../../fixtures/techdocs/landingPage/facets_metadata.json';
// owner page intercepts
import lighthouseOwner from '../../fixtures/techdocs/ownerPage/lighthouse_owner.json';
import lighthouseAncestry from '../../fixtures/techdocs/ownerPage/lighthouse_ancestry.json';
import LighthouseEntities from '../../fixtures/techdocs/ownerPage/lighthouse_entities.json';
import lighthouseUsers from '../../fixtures/techdocs/ownerPage/lighthouse_users.json';
// docs page intercepts
import lighthouseMetadataTechdocs from '../../fixtures/techdocs/docsPage/lighthouse_metadata_techdocs.json';
import lighthouseMetadataEntity from '../../fixtures/techdocs/docsPage/lighthouse_metadata_entity.json';
import lighthouseQuery from '../../fixtures/techdocs/docsPage/lighthouse_query.json';

/*
  browser tests for techdocs with stubbed responses

  to run locally:

    docker compose up frontend -d

    cd /packages/app/

    yarn run cy:run --spec cypress/e2e/browser/docs.cy.js
*/

describe('Given I am on the Documentation page', () => {
  beforeEach(() => {
    // landing page intercepts
    cy.intercept(
      { method: 'GET', url: '**/query?term=' },
      {
        statusCode: 200,
        body: catalogQuery,
      },
    ).as('getQueryTerm');

    cy.intercept(
      {
        method: 'GET',
        url: '**/entities?filter=metadata.annotations.backstage.io%2Ftechdocs-ref',
      },
      {
        statusCode: 200,
        body: docsMetadata,
      },
    ).as('getDocsMetadata');

    cy.intercept(
      { method: 'GET', url: '**/entity-facets?facet=metadata.tags' },
      {
        statusCode: 200,
        body: facetsMetadata,
      },
    ).as('getFacetsMetadata');

    // owner page intercepts
    cy.intercept(
      {
        method: 'GET',
        url: '**/entities/by-name/group/default/lighthouse-bandicoot',
      },
      {
        statusCode: 200,
        body: lighthouseOwner,
      },
    ).as('getLighthouseOwner');

    cy.intercept(
      { method: 'GET', url: '**/ancestry' },
      {
        statusCode: 200,
        body: lighthouseAncestry,
      },
    ).as('getLighthouseAncestry');

    cy.intercept(
      {
        method: 'GET',
        url: '**/entities?filter=kind=Component,kind=API,kind=System,relations.ownedBy=group%3Adefault%2Flighthouse-bandicoot&fields=kind,metadata.name,metadata.namespace,spec.type,relations',
      },
      {
        statusCode: 200,
        body: LighthouseEntities,
      },
    ).as('getLighthouseEntities');

    cy.intercept(
      {
        method: 'GET',
        url: '**/entities?filter=kind=User,relations.memberof=group%3Adefault%2Flighthouse-bandicoot',
      },
      {
        statusCode: 200,
        body: lighthouseUsers,
      },
    ).as('getLighthouseUsers');

    // docs page intercepts
    cy.intercept(
      {
        method: 'GET',
        url: '**/techdocs/static/docs/default/component/lighthouse-hub-monorepo/index.html',
      },
      {
        statusCode: 200,
      },
    ).as('getLighthouseIndexHTML');

    cy.intercept(
      {
        method: 'GET',
        url: '**/techdocs/sync/default/component/lighthouse-hub-monorepo',
      },
      {
        statusCode: 200,
      },
    ).as('getLighthouseSync');

    cy.intercept(
      {
        method: 'GET',
        url: '**/techdocs/metadata/techdocs/default/component/lighthouse-hub-monorepo',
      },
      {
        statusCode: 200,
        body: lighthouseMetadataTechdocs,
      },
    ).as('getlighthouseMetadataTechdocs');

    cy.intercept(
      {
        method: 'GET',
        url: '**/techdocs/metadata/entity/default/component/lighthouse-hub-monorepo',
      },
      {
        statusCode: 200,
        body: lighthouseMetadataEntity,
      },
    ).as('getlighthouseMetadataEntity');

    cy.intercept(
      {
        method: 'GET',
        url: '**/search/query?term=&types%5B0%5D=techdocs&filters%5Bkind%5D=component&filters%5Bname%5D=lighthouse-hub-monorepo&filters%5Bnamespace%5D=default&pageCursor=',
      },
      {
        statusCode: 200,
        body: lighthouseQuery,
      },
    ).as('getLighthouseQuery');

    cy.viewport(1600, 1000);
    cy.loginAsGuest();
    cy.visit('/docs');
    cy.url().should('contain', '/docs?filters%5Buser%5D=all');

    cy.wait('@getDocsMetadata');
    cy.wait('@getFacetsMetadata');
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

      cy.wait('@getLighthouseIndexHTML');
      cy.wait('@getLighthouseSync');
      cy.wait('@getlighthouseMetadataTechdocs');
      cy.wait('@getlighthouseMetadataEntity');
    });

    it('Then the page for the selected document loads', () => {
      cy.get('h1')
        .contains('Lighthouse Hub Documentation')
        .should('be.visible');
    });
  });

  describe('When I select the owner name from the Owner column for a given document', () => {
    beforeEach(() => {
      cy.get('div').contains('lighthouse-bandicoot').click({ force: true });
      cy.url().should('include', 'lighthouse-bandicoot');

      cy.wait('@getLighthouseOwner');
      cy.wait('@getLighthouseEntities');
      cy.wait('@getLighthouseUsers');
    });

    it('Then the Owner page for the respective document loads', () => {
      cy.get('div').contains('group — team').should('be.visible');
      cy.get('article div')
        .contains('lighthouse-bandicoot')
        .should('be.visible');
    });
  });

  describe('When I select the star/favorite icon under the action column for a given document', () => {
    beforeEach(() => {
      cy.get('[title*="Add to favorites"]')
        .first()
        .click({ force: true })
        .as('favButton');
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
      cy.get('input[aria-label*="Search"]')
        .click({ force: true })
        .type('lighthouse');
    });

    it('Then the values in the Documentation table are updated and include only values within search parameters', () => {
      cy.get('[class*="MuiTableBody-root"]')
        .find('[class*="MuiTableRow-root"]')
        .filter(':contains(" ")')
        .should('not.contain', 'Veterans API')
        .each(row => {
          cy.wrap(row).contains('lighthouse').should('be.visible');
        });
    });
  });

  describe('When I select an owner value from the Owner dropdown list', () => {
    beforeEach(() => {
      cy.contains('label', 'Owner').parent().as('ownerPicker');

      cy.get('@ownerPicker')
        .find('svg[data-testid="owner-picker-expand"]')
        .click({ force: true });

      cy.get('label').contains('lighthouse-bandicoot').siblings('span').click();
    });

    it('Then the owner is added to the Owner filter', () => {
      cy.get('@ownerPicker')
        .find('[class*="MuiChip-label"]')
        .contains('lighthouse-bandicoot')
        .should('be.visible');
    });

    it('AND the table is updated to include only Documents belonging to the selected owner', () => {
      cy.get('[class*="MuiTableBody-root"]')
        .find('[class*="MuiTableRow-root"]')
        .filter(':contains(" ")')
        .should('not.contain', 'Veterans API')
        .each(row => {
          cy.wrap(row).contains('lighthouse-bandicoot').should('exist');
        });
    });
  });

  describe('When I select a tag value from the Tags dropdown list', () => {
    beforeEach(() => {
      cy.contains('label', 'Tags').parent().as('tagPicker').click();

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
