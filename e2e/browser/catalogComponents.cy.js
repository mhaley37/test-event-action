import entitiesComponents from '../../fixtures/entities/components.json';
import componentSpec from '../../fixtures/facets/components_spec.json';
import componentMetadata from '../../fixtures/facets/components_meta.json';
import allKinds from '../../fixtures/facets/all.json';
import facetMetadata from '../../fixtures/facets/metadata_tags.json';
import componentPage from '../../fixtures/entity/component.json';
import systemPage from '../../fixtures/entity/system.json';
import ownerPage from '../../fixtures/entity/bandicoot.json';

describe('Given I am on the Catalog - Components page', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/component/default/frontend',
      },
      {
        statusCode: 202,
        body: componentPage,
      },
    ).as('getComponentPage');
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/system/default/lighthouse-developer-portal',
      },
      {
        statusCode: 202,
        body: systemPage,
      },
    ).as('getComponentSystem');
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/group/default/lighthouse-bandicoot',
      },
      {
        statusCode: 202,
        body: ownerPage,
      },
    ).as('getComponentOwner');
    cy.intercept(
      { method: 'GET', url: '**/entities?filter=kind=component' },
      {
        statusCode: 202,
        body: entitiesComponents,
      },
    ).as('getEntityFilterKindComponent');
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
      { method: 'GET', url: '**/entity-facets?facet=metadata.tags' },
      {
        statusCode: 202,
        body: facetMetadata,
      },
    ).as('getFacetMetadata');
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entity-facets?facet=kind' },
      {
        statusCode: 202,
        body: allKinds,
      },
    ).as('getFacetKind');

    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.clearBrowserCache',
      }),
    );
    cy.clearCookies();

    cy.loginAsGuest();
    cy.visit('/catalog');
    cy.get('div[aria-label="catalog-kinds"] > button')
      .contains('Components')
      .should('be.visible')
      .click({ force: true });
    cy.wait('@getEntityFilterKindComponent');
    cy.contains('Browse the collection of Components')
      .scrollIntoView()
      .should('be.visible');
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I select a component from the Name column', () => {
    beforeEach(() => {
      cy.contains('component:frontend').should('exist').click({ force: true });
      cy.wait('@getComponentPage');
    });

    it('Then the Overview page for that component displays', () => {
      cy.url().should('include', '/catalog/default/component/frontend');
      cy.contains('Component Overview').scrollIntoView().should('be.visible');
    });
  });

  describe('When I select a system from the System column', () => {
    beforeEach(() => {
      cy.wait('@getComponentSystem');
      cy.get('a[href*="/catalog/default/system/lighthouse-developer-portal"]', {
        timeout: 10000,
      })
        .first()
        .click({ force: true });
    });

    it('Then the system page for that component displays', () => {
      cy.url().should(
        'include',
        '/catalog/default/system/lighthouse-developer-portal',
      );
      cy.get('h1')
        .contains('Lighthouse Hub')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('When I select an owner from the Owner column', () => {
    beforeEach(() => {
      cy.wait('@getComponentOwner');
      cy.get('a[href*="/catalog/default/group/lighthouse-bandicoot"]', {
        timeout: 10000,
      })
        .first()
        .click({ force: true });
    });

    it('Then the owner page for that component displays', () => {
      cy.url().should('include', '/catalog/default/group/lighthouse-bandicoot');
      cy.get('h1')
        .contains('lighthouse-bandicoot')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe('When I enter text into the Filter components by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('catalog');
    });

    it('Then the components table filters to display only components with values matching the text entered', () => {
      cy.contains('component:catalog').should('exist');
      cy.contains('component:frontend').should('not.exist');
    });
  });

  describe('When I select the X on the filter component by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('catalog');
      cy.get('svg[aria-label="clear"]').click({ force: true });
    });

    it('Then the text entered into the filter field is cleared', () => {
      cy.get('input[aria-label="Search"]').should('be.empty');
      cy.contains('component:frontend').should('exist');
    });
  });

  describe(`When I select the Name column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Name`, () => {
      cy.contains('component:api-styleguide')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:artist-lookup')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:backend').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the System column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('System').as('SystemColumn');
      cy.get('@SystemColumn').scrollIntoView();
      cy.get('@SystemColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to System`, () => {
      cy.contains('component:api-styleguide')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:catalog').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Owner column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Owner`, () => {
      cy.contains('component:backend').scrollIntoView().should('be.visible');
      cy.contains('component:catalog').scrollIntoView().should('be.visible');
      cy.contains('component:frontend').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Type column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Type').as('TypeColumn');
      cy.get('@TypeColumn').scrollIntoView();
      cy.get('@TypeColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Type`, () => {
      cy.contains('component:api-styleguide')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:playback-sdk')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Secure Release Pipeline')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the Lifecycle column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
      cy.get('@LifecycleColumn').scrollIntoView();
      cy.get('@LifecycleColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Lifecycle`, () => {
      cy.contains('experimental').scrollIntoView().should('be.visible');
      cy.contains('production').should('not.be.visible');
    });
  });

  describe(`When I select the Description column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Description`, () => {
      cy.contains('component:plugin-feature-flags')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('Secure Release Pipeline')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:api-styleguide')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the Tags column`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Tags').as('TagsColumn');
      cy.get('@TagsColumn').scrollIntoView();
      cy.get('@TagsColumn').click();
    });

    it(`Then the components in the table are displayed in ascending order according to Tags`, () => {
      cy.contains('component:api-styleguide')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:lighthouse-bandicoot/catalog-entries')
        .scrollIntoView()
        .should('be.visible');
    });
  });

  describe(`When I select the Name column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').dblclick();
    });

    it(`Then the components in the table are displayed in descending order according to Name`, () => {
      cy.contains('Secure Release Pipeline')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:www-artist').scrollIntoView().should('be.visible');
      cy.contains('component:wayback-search')
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

    it(`Then the components in the table are displayed in descending order according to System`, () => {
      cy.contains('component:podcast-api')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:queue-proxy')
        .scrollIntoView()
        .should('be.visible');
      cy.contains('component:backend').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Owner column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').dblclick();
    });

    it(`Then the components in the table are displayed in descending order according to Owner`, () => {
      cy.get('[data-testid="guest"]')
        .first()
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

    it(`Then the components in the table are displayed in descending order according to Type`, () => {
      cy.contains('website').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Lifecycle column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Lifecycle').as('LifecycleColumn');
      cy.get('@LifecycleColumn').scrollIntoView();
      cy.get('@LifecycleColumn').dblclick();
    });

    it(`Then the components in the table are displayed in descending order according to Lifecycle`, () => {
      cy.contains('production').scrollIntoView().should('be.visible');
      cy.contains('experimental').should('not.be.visible');
    });
  });

  describe(`When I select the Description column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').dblclick();
    });

    it(`Then the components in the table are displayed in descending order according to Description`, () => {
      cy.contains('component:vets-api').scrollIntoView().should('be.visible');
      cy.contains('component:frontend').scrollIntoView().should('be.visible');
      cy.contains('component:backend').scrollIntoView().should('be.visible');
    });
  });

  describe(`When I select the Tags column twice`, () => {
    beforeEach(() => {
      cy.get('table tr').contains('Tags').as('TagsColumn');
      cy.get('@TagsColumn').scrollIntoView();
      cy.get('@TagsColumn').dblclick();
    });
  });
});
