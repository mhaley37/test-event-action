import entitiesApis from '../../fixtures/entities/apis.json';
import entitiesResources from '../../fixtures/entities/resources.json';
import artistsDB from '../../fixtures/entity/artistsDB.json';
import artistsSystem from '../../fixtures/entity/artistsSystem.json';
import catalogQuery from '../../fixtures/queryTerms/catalog.json';
import allKinds from '../../fixtures/facets/all.json';
import facetMetadata from '../../fixtures/facets/metadata_tags.json';
import apiSpec from '../../fixtures/facets/apis_spec.json';
import apiMetadata from '../../fixtures/facets/apis_meta.json';
import resourceSpec from '../../fixtures/facets/resource_spec.json';
import resourceMetadata from '../../fixtures/facets/resource_meta.json';

describe('Given I am on the resources page', () => {
  // Set current user as guest and visit the Catalog API page
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
      { method: 'GET', url: '**/entities?filter=kind=resource' },
      {
        statusCode: 202,
        body: entitiesResources,
      },
    ).as('getEntityFilterKindResource');
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
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=resource&facet=spec.type',
      },
      {
        statusCode: 202,
        body: resourceSpec,
      },
    ).as('getFacetResourceSpec');
    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=resource&facet=metadata.tags',
      },
      {
        statusCode: 202,
        body: resourceMetadata,
      },
    ).as('getFacetResourceMetadata');
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
        url: '**/api/catalog/entities/by-name/system/default/artist-engagement-portal',
      },
      {
        statusCode: 202,
        body: artistsSystem,
      },
    ).as('getArtistsSystem');
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/resource/default/artists-db',
      },
      {
        statusCode: 202,
        body: artistsDB,
      },
    ).as('getArtistsDB');
    cy.intercept('GET', '**query?term=&pageLimit=10**').as('searchReady');

    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.clearBrowserCache',
      }),
    );
    cy.clearCookies();

    cy.loginAsGuest();
    cy.visit('/catalog');
    cy.contains('Resources').click();
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('Log in and visit Home Page', () => {
    // Set current user as guest and visit the Catalog API page
    beforeEach(() => {
      cy.loginAsGuest();
      cy.visit('/');
    });
    afterEach(() => {
      cy.clearSessionStorage();
    });

    describe('Given I am on the resources page', () => {
      beforeEach(() => {
        cy.contains('Catalog').click();
        cy.contains('Resources').click();
      });

      describe('When I select a resource from the Name column', () => {
        beforeEach(() => {
          cy.contains('Artists Db').click({ force: true });
          cy.url().should('include', '/artists-db');
        });

        it('Then the Overview page for that resource displays', () => {
          cy.get('h1').contains('Artists Db').should('exist');
          cy.contains('Overview').should('exist');
        });
      });

      describe('When I enter text into the Filter resources by keyword', () => {
        beforeEach(() => {
          cy.wait('@getQueryTerm');
          cy.get('input[aria-label="Search"]').type('Artists');
        });

        it('Then the resources table filters to display only resources with values matching the text entered', () => {
          cy.contains('Artists Db', { timeout: 10000 }).should('exist');
          cy.contains('Lighthouse Hub DB').should('not.exist');
        });
      });

      describe('When I select the X on the filter resource by keyword', () => {
        beforeEach(() => {
          cy.get('input[aria-label="Search"]').type('Artists Db');
          cy.get('svg[aria-label="clear"]').click({ force: true });
        });
        it('Then the text entered into the filter field is cleared', () => {
          cy.get('input[aria-label="Search"]').should('be.empty');
        });
      });

      describe('When I select the Name column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Name').as('NameColumn');
          cy.get('@NameColumn').scrollIntoView();
          cy.get('@NameColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Name', () => {
          cy.contains('Artists Db').scrollIntoView().should('be.visible');
          cy.contains('Lighthouse Hub DB')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the System column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('System').as('SystemColumn');
          cy.get('@SystemColumn').scrollIntoView();
          cy.get('@SystemColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to System', () => {
          cy.contains('artist-engagement-portal')
            .scrollIntoView()
            .should('be.visible');
          cy.contains('lighthouse-hub').scrollIntoView().should('be.visible');
        });
      });

      describe('When I select the Owner column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Owner').as('OwnerColumn');
          cy.get('@OwnerColumn').scrollIntoView();
          cy.get('@OwnerColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Owner', () => {
          cy.contains('lighthouse-bandicoot')
            .scrollIntoView()
            .should('be.visible');
          cy.contains('team-a').scrollIntoView().should('be.visible');
        });
      });

      describe('When I select the Type column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Type').as('TypeColumn');
          cy.get('@TypeColumn').scrollIntoView();
          cy.get('@TypeColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Type', () => {
          cy.contains('database').scrollIntoView().should('be.visible');
        });
      });

      describe('When I select the Lifecycle column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
          cy.get('@LifecycleColumn').scrollIntoView();
          cy.get('@LifecycleColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Lifecycle', () => {
          cy.contains('Artists Db').scrollIntoView().should('be.visible');
          cy.contains('Lighthouse Hub DB')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Description column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Description').as('DescriptionColumn');
          cy.get('@DescriptionColumn').scrollIntoView();
          cy.get('@DescriptionColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Description', () => {
          cy.get('[value ="Stores artist details"]')
            .scrollIntoView()
            .should('be.visible');
          cy.get('[value ="Stores data for the Lighthouse Hub"]')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Tags column', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Tags').as('TagsColumn');
          cy.get('@TagsColumn').scrollIntoView();
          cy.get('@TagsColumn').click();
        });

        it('Then the resources in the table are displayed in ascending order according to Tags', () => {
          cy.get('[value="lighthouse"]').scrollIntoView().should('be.visible');
          cy.contains('lighthouse-developer-portal-test-set')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Name column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Name').as('NameColumn');
          cy.get('@NameColumn').scrollIntoView();
          cy.get('@NameColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Name', () => {
          cy.contains('Lighthouse Hub DB')
            .scrollIntoView()
            .should('be.visible');
          cy.contains('Artists Db').scrollIntoView().should('be.visible');
        });
      });
      describe('When I select the System column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('System').as('SystemColumn');
          cy.get('@SystemColumn').scrollIntoView();
          cy.get('@SystemColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to System', () => {
          cy.contains('lighthouse-hub').scrollIntoView().should('be.visible');
          cy.contains('artist-engagement-portal')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Owner column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Owner').as('OwnerColumn');
          cy.get('@OwnerColumn').scrollIntoView();
          cy.get('@OwnerColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Owner', () => {
          cy.contains('team-a').scrollIntoView().should('be.visible');
          cy.contains('lighthouse-bandicoot')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Type column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Type').as('TypeColumn');
          cy.get('@TypeColumn').scrollIntoView();
          cy.get('@TypeColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Type', () => {
          cy.contains('database').scrollIntoView().should('be.visible');
        });
      });

      describe('When I select the Lifecycle column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
          cy.get('@LifecycleColumn').scrollIntoView();
          cy.get('@LifecycleColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Lifecycle', () => {
          cy.contains('Lighthouse Hub DB')
            .scrollIntoView()
            .should('be.visible');
          cy.contains('Artists Db').scrollIntoView().should('be.visible');
        });
      });

      describe('When I select the Description column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Description').as('DescriptionColumn');
          cy.get('@DescriptionColumn').scrollIntoView();
          cy.get('@DescriptionColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Description', () => {
          cy.get('[value ="Stores data for the Lighthouse Hub"]')
            .scrollIntoView()
            .should('be.visible');
          cy.get('[value ="Stores artist details"]')
            .scrollIntoView()
            .should('be.visible');
        });
      });

      describe('When I select the Tags column twice', () => {
        beforeEach(() => {
          cy.get('table tr').contains('Tags').as('TagsColumn');
          cy.get('@TagsColumn').scrollIntoView();
          cy.get('@TagsColumn').dblclick();
        });

        it('Then the resources in the table are displayed in descending order according to Tags', () => {
          cy.get('[value="lighthouse-developer-portal-test-set"]')
            .scrollIntoView()
            .should('be.visible');
          cy.contains('lighthouse').scrollIntoView().should('be.visible');
        });
      });
    });
  });
});
