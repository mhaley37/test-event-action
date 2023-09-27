import entitiesComponents from '../../fixtures/entities/components.json';
import entitiesDomains from '../../fixtures/entities/domains.json';
import entitiesResources from '../../fixtures/entities/resources.json';
import entitiesSystems from '../../fixtures/entities/systems.json';
import entitiesApis from '../../fixtures/entities/apis.json';
import componentSpec from '../../fixtures/facets/components_spec.json';
import componentMetadata from '../../fixtures/facets/components_meta.json';
import apiSpec from '../../fixtures/facets/apis_spec.json';
import apiMetadata from '../../fixtures/facets/apis_meta.json';
import allKinds from '../../fixtures/facets/all.json';
import catalogQuery from '../../fixtures/queryTerms/catalog.json';
import facetMetadata from '../../fixtures/facets/metadata_tags.json';
import helloApi from '../../fixtures/entity/api.json';
import system from '../../fixtures/entity/system.json';
import group from '../../fixtures/entity/group.json';

describe('Catalog Page', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', url: '**/query?term=' },
      {
        statusCode: 202,
        body: catalogQuery,
      },
    ).as('getQueryTerm');
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entity-facets?facet=kind' },
      {
        statusCode: 202,
        body: allKinds,
      },
    ).as('getFacetKind');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=component' },
      {
        statusCode: 202,
        body: entitiesComponents,
      },
    ).as('getEntityFilterKindComponent');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=domain' },
      {
        statusCode: 202,
        body: entitiesDomains,
      },
    ).as('getEntityFilterKindDomain');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=resource' },
      {
        statusCode: 202,
        body: entitiesResources,
      },
    ).as('getEntityFilterKindResource');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=system' },
      {
        statusCode: 202,
        body: entitiesSystems,
      },
    ).as('getEntityFilterKindSystem');
    cy.intercept(
      { method: 'GET', url: '**/entity-facets?facet=metadata.tags' },
      {
        statusCode: 202,
        body: facetMetadata,
      },
    ).as('getFacetMetadata');
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=component&facet=spec.type',
      },
      {
        statusCode: 202,
        body: componentSpec,
      },
    ).as('getFacetComponentSpec');
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=component&facet=metadata.tags',
      },
      {
        statusCode: 202,
        body: componentMetadata,
      },
    ).as('getFacetComponentMetadata');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=api' },
      {
        statusCode: 202,
        body: entitiesApis,
      },
    ).as('getEntityFilterKindApi');
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=api&facet=spec.type',
      },
      {
        statusCode: 202,
        body: apiSpec,
      },
    ).as('getFacetApiSpec');
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=api&facet=metadata.tags',
      },
      {
        statusCode: 202,
        body: apiMetadata,
      },
    ).as('getFacetApiMetadata');
    cy.loginAsGuest();
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('Entity Kinds', () => {
    it('selects APIs tab by default', () => {
      cy.visit('/catalog');
      cy.contains('Browse the collection of APIs').should('be.visible');
    });

    it('changes the tab when clicked', () => {
      cy.visit('/catalog');
      cy.get('div[aria-label="catalog-kinds"] > button')
        .contains('Components')
        .should('be.visible')
        .should('be.visible')
        .click({ force: true });
      cy.contains('Browse the collection of Components').should('be.visible');
    });

    const kinds = ['API', 'Component', 'Domain', 'Resource', 'System'];

    kinds.forEach(kind => {
      it(`updates the keyword filter to match the current page (${kind})`, () => {
        cy.visit(`/catalog?filters[kind]=${kind}&filters[user]=all`);
        cy.get('input')
          .invoke('attr', 'placeholder')
          .should('contain', `Filter ${kind}s by keyword`);
      });
    });
  });

  describe('Catalog APIs Page - API table', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '**/api/catalog/entities/by-name/api/default/hello-world',
        },
        {
          statusCode: 202,
          body: helloApi,
        },
      );
      cy.visit('/catalog');
      cy.contains('Browse the collection of APIs').should('be.visible');
    });

    it('Should open API page', () => {
      // When I select the name of an API
      cy.contains('hello-world').should('exist').click({ force: true });

      // Then the selected API page displays
      cy.get('h1').contains('Hello World').should('be.visible');
      cy.url().should('include', '/catalog/default/api/hello-world');
    });

    it('Should load APIs system page if system exists', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '**/api/catalog/entities/by-name/system/default/lighthouse-developer-portal',
        },
        {
          statusCode: 200,
          body: system,
        },
      ).as('lighthouse-developer-portal-system');
      cy.reload();
      cy.wait('@lighthouse-developer-portal-system');
      // When I select the name of a system
      cy.get('a[href*="/catalog/default/system/lighthouse-developer-portal"]')
        .should('be.visible')
        .click({ force: true });

      // Then the selected system page displays
      cy.get('h1').contains('Lighthouse Hub').should('be.visible');
      cy.url().should(
        'include',
        '/catalog/default/system/lighthouse-developer-portal',
      );
    });

    it("Should not link to APIs system page if the system doesn't exist", () => {
      // When I select the api owner column
      cy.get('div[data-testid="lighthouse-developer-portal"').should(
        'be.visible',
      );
    });

    it('Should load APIs Owner page if the owner exists', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '**/api/catalog/entities/by-name/group/default/lighthouse-bandicoot',
        },
        {
          statusCode: 200,
          body: group,
        },
      ).as('lighthouse-bandicoot-group');
      cy.reload();
      cy.wait('@lighthouse-bandicoot-group');
      // When I select the api owner column
      cy.get('a[href*="/catalog/default/group/lighthouse-bandicoot"]')
        .first()
        .should('be.visible')
        .click({ force: true });

      // Then the selected owner page displays
      cy.get('h1').contains('lighthouse-bandicoot').should('be.visible');
      cy.url().should('include', '/catalog/default/group/lighthouse-bandicoot');
    });

    it("Should not link to APIs Owner page if the owner doesn't exist", () => {
      // When I select the api owner column
      cy.get('div[data-testid="lighthouse-bandicoot"').should('be.visible');
    });
  });

  describe('Catalog API - Actions Column', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '**/api/catalog/entities/by-name/api/default/hello-world',
        },
        {
          statusCode: 202,
          body: helloApi,
        },
      );
      cy.visit('/catalog/default/api/hello-world');
      cy.get('h1').contains('Hello World').should('be.visible');
    });

    it('Should open GitHub API yaml page', () => {
      cy.contains('View Source')
        .should('have.attr', 'href')
        .and('contain', '/lighthouse-developer-portal-test/tree/main/');
    });

    it('Should open GitHub edit API yaml page', () => {
      // I select the Edit icon from the Actions column
      cy.get('[data-testid="edit-icon"]').click();

      cy.contains('Edit this item in GitHub').should('be.visible');
    });

    it('Should mark API as favorite', () => {
      // I select the start icon under the Actions column for an API
      cy.get('button[aria-label="favorite"]').should('be.visible').click();
      // the star icon turns yellow
      cy.get('svg[title="Remove from favorites"]')
        .should('have.css', 'color')
        .and('eq', 'rgb(243, 186, 55)');

      // the Starred value in the Personal section increments by +1
      cy.visit('/catalog');
      cy.contains('Browse the collection of APIs').should('be.visible');
      cy.contains('Filters').should('be.visible').click();
      cy.get('p')
        .contains('Starred')
        .should('be.visible')
        .parents('li')
        .contains('1');
    });
  });
});
