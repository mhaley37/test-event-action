import entitiesSystems from '../../fixtures/entities/systemEnt.json';
import entitiesApis from '../../fixtures/entities/apis.json';
import systemMetadata from '../../fixtures/facets/systems_meta.json';
import apiSpec from '../../fixtures/facets/apis_spec.json';
import apiMetadata from '../../fixtures/facets/apis_meta.json';
import allKinds from '../../fixtures/facets/all.json';
import catalogQuery from '../../fixtures/queryTerms/catalog.json';
import facetMetadata from '../../fixtures/facets/metadata_tags.json';
import systemPage from '../../fixtures/entity/systemPage.json';
import ownerPage from '../../fixtures/entity/platform.json';

describe('Given I am on the Catalog - Systems page', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/system/artist-engagement-portal',
      },
      {
        statusCode: 202,
        body: systemPage,
      },
    ).as('getSystemPage');

    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/group/default/platform-console-services',
      },
      {
        statusCode: 202,
        body: ownerPage,
      },
    ).as('getSystemOwner');
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
      { method: 'GET', url: '**/entities?filter=kind=system' },
      {
        statusCode: 202,
        body: entitiesSystems,
      },
    ).as('getEntityFilterKindSystem');

    cy.intercept(
      {
        method: 'GET',
        url: '**/entity-facets?filter=kind=system&facet=metadata.tags',
      },
      {
        statusCode: 202,
        body: systemMetadata,
      },
    ).as('getFacetSystemMetadata');
    cy.intercept(
      { method: 'GET', url: '**/entity-facets?facet=metadata.tags' },
      {
        statusCode: 202,
        body: facetMetadata,
      },
    ).as('getFacetMetadata');

    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.clearBrowserCache',
      }),
    );
    cy.clearCookies();

    cy.loginAsGuest();
    cy.visit('/catalog');
    cy.get('div[aria-label="catalog-kinds"] > button')
      .contains('Systems')
      .should('be.visible')
      .click({ force: true });
    cy.contains('Browse the collection of Systems')
      .scrollIntoView()
      .should('be.visible');
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I select a system from the Name column', () => {
    beforeEach(() => {
      cy.get('[value="system:artist-engagement-portal"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });

    it('Then the Overview page for that system displays', () => {
      cy.contains('Artist Engagement Portal').should('exist');
    });
  });

  describe('When I select an owner from the Owner column', () => {
    beforeEach(() => {
      cy.get('a[href*="/catalog/default/group/platform-console-services')
        .first()
        .as('platformConsoleServices');
      cy.get('@platformConsoleServices', { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true });
    });

    it('Then the owner page for that system displays', () => {
      cy.contains('Platform Console Services (Tools BE)')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('When I enter text into the Filter systems by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('Artist');
    });

    it('Then the systems table filters to display only systems with values matching the text entered', () => {
      cy.contains('Artist Engagement Portal').should('exist');
      cy.contains('Audio Playback').should('not.exist');
    });
  });

  describe('When I select the X on the filter system by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('Artist');
      cy.get('svg[aria-label="clear"]').click({ force: true });
    });

    it('Then the text entered into the filter field is cleared', () => {
      cy.get('input[aria-label="Search"]').should('be.empty');
    });
  });

  describe('When I select the Name Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Name`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });

  describe('When I select the System Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('System').as('SystemColumn');
      cy.get('@SystemColumn').scrollIntoView();
      cy.get('@SystemColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Systems`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });

  describe('When I select the Owner Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Owner`, () => {
      cy.contains('lighthouse-bandicoot')
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.contains('platform-console-services')
        .first()
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('When I select the Type Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Type').as('TypeColumn');
      cy.get('@TypeColumn').scrollIntoView();
      cy.get('@TypeColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Type`, () => {
      cy.contains('Artist Engagement Portal')
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback')
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Lighthouse Hub')
        .first()
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('When I select the Lifecyle Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
      cy.get('@LifecycleColumn').scrollIntoView();
      cy.get('@LifecycleColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Lifecyle`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });
  describe('When I select the Description Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Description`, () => {
      cy.get('[value ="Audio playback system"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[value="Everything related to artists"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[value ="Lighthouse Hub for Lighthouse APIs"]').should('exist');
    });
  });

  describe('When I select the Tags Column', () => {
    beforeEach(() => {
      cy.get('table tr').contains('Tags').as('TagsColumn');
      cy.get('@TagsColumn').scrollIntoView();
      cy.get('@TagsColumn').click();
    });

    it(`Then the systems in the table are displayed in ascending order according to Tags`, () => {
      cy.contains('lighthouse-developer-portal-test-set')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('lighthouse-developer-portal-test-set')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('lighthouse').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Name column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Name`, () => {
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the System column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('System').as('SystemColumn');
      cy.get('@SystemColumn').scrollIntoView();
      cy.get('@SystemColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to System`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Owner column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Owner`, () => {
      cy.contains('team-c').scrollIntoView().should('be.visible');
      cy.contains('team-b').scrollIntoView().should('be.visible');
      cy.contains('platform-console-services')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the Type column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Type').as('TypeColumn');
      cy.get('@TypeColumn').scrollIntoView();
      cy.get('@TypeColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Type`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Lifecycle column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
      cy.get('@LifecycleColumn').scrollIntoView();
      cy.get('@LifecycleColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Lifecylce`, () => {
      cy.contains('Artist Engagement Portal')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Audio Playback').scrollIntoView().should('be.visible');
      cy.contains('Lighthouse Hub').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Description column again`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Description`, () => {
      cy.get('[value ="Lighthouse Hub for Lighthouse APIs"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[value="Everything related to artists"]')
        .scrollIntoView()
        .should('be.visible');
      cy.get('[value ="Audio playback system"]')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the Tags column again`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Tags').as('TagsColumn');
      cy.get('@TagsColumn').scrollIntoView();
      cy.get('@TagsColumn').dblclick();
    });

    it(`Then the systems in the table are displayed in descending order according to Tags`, () => {
      cy.contains('lighthouse').first().scrollIntoView().should('be.visible');
      cy.get('[value="lighthouse-developer-portal-test-set"]')
        .first()
        .scrollIntoView()
        .should('be.visible');
      cy.contains('lighthouse-developer-portal-test-set')
        .first()
        .scrollIntoView()
        .should('be.visible');
    });
  });
});
