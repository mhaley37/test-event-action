import inputQuery from '../../fixtures/search/query.json';
import catalogQuery from '../../fixtures/queryTerms/catalog.json';
import nextQuery from '../../fixtures/queryTerms/nextQuery.json';
import previousQuery from '../../fixtures/queryTerms/previousQuery.json';
import techdocs from '../../fixtures/search/techdocs.json';
import techdocsResponse from '../../fixtures/search/techdocsResponse.json';
import metadata from '../../fixtures/search/metadata.json';
import siteDescription from '../../fixtures/search/siteDescription.json';

describe('Given I am on the homepage of the Lighthouse Hub', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.loginAsGuest();
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I select the "Search" input', () => {
    beforeEach(() => {
      cy.get('input[placeholder="SEARCH"]').should('be.visible').click();
    });

    it('Then I can type a search query', () => {
      cy.get('input[placeholder="SEARCH"]')
        .should('have.value', '')
        .type('Test search');
      cy.get('input[placeholder="SEARCH"]').should('have.value', 'Test search');
    });

    describe('When I press the "Enter" key on the homepage search', () => {
      it('Then I am redirected to the search page', () => {
        cy.get('input').type('{enter}');

        cy.url().should('include', '/search');
      });
    });

    it('Then it redirects to the search page', () => {
      cy.get('input[placeholder="SEARCH"]')
        .should('have.value', '')
        .type('Test search');
      cy.get('input[placeholder="SEARCH"]').should('have.value', 'Test search');

      cy.get('[data-testid="search-icon"').should('exist').click();
      cy.url().should('include', '/search');
    });
  });

  describe('Given I search for a Techdoc', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', url: '**query?term=deployment**' },
        {
          statusCode: 200,
          body: techdocs,
        },
      ).as('getDeploymentSearch');

      cy.intercept(
        { method: 'GET', url: '**/api/techdocs/**' },
        {
          statusCode: 200,
          body: techdocsResponse,
        },
      );

      cy.intercept(
        {
          method: 'GET',
          url: '**/api/techdocs/metadata/techdocs/default/component/deployment-repo**',
        },
        {
          statusCode: 200,
          body: siteDescription,
        },
      );

      cy.intercept(
        {
          method: 'GET',
          url: '**/api/techdocs/metadata/entity/default/component/deployment-repo**',
        },
        {
          statusCode: 200,
          body: metadata,
        },
      );
      cy.intercept('GET', '**query?term=&pageLimit=10**').as('searchReady');
      cy.visit('/search');
      cy.get('h1').contains('Search').should('be.visible');
    });

    describe('When I search for the Techdoc', () => {
      beforeEach(() => {
        cy.wait('@searchReady');
        cy.get('input[placeholder="SEARCH"]').should('have.value', '');
        cy.get('input[placeholder="SEARCH"]').type('deployment{enter}', {
          force: true,
        });
        cy.wait('@getDeploymentSearch');
      });

      it('the Techdoc is loaded', () => {
        cy.contains('Sealed Secrets').should('be.visible').click();
        cy.url().should(
          'match',
          /docs\/default\/component\/deployment-repo\/sealed-secrets/,
        );
      });
    });
  });
});

describe('Given I am on the search page', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', url: '**query?term=**' },
      {
        statusCode: 202,
        body: catalogQuery,
      },
    ).as('getEmptyQuery');
    cy.intercept(
      {
        method: 'GET',
        url: '**query?term=lighthouse-hub-monorepo**',
      },
      {
        statusCode: 200,
        body: inputQuery,
      },
    ).as('getInputQuery');
    cy.intercept(
      { method: 'GET', url: '**query?term=&pageCursor=MQ**' },
      {
        statusCode: 200,
        body: nextQuery,
      },
    ).as('getNextPage');
    cy.intercept(
      { method: 'GET', url: '**query?term=&pageCursor=MA**' },
      {
        statusCode: 200,
        body: previousQuery,
      },
    ).as('getPreviousPage');

    cy.loginAsGuest();
    cy.visit('/search');
    cy.get('h1').contains('Search').should('be.visible').click();
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I enter text into the search field', () => {
    beforeEach(() => {
      cy.get('input[placeholder="SEARCH"]').should('have.value', '');
      cy.get('input[placeholder="SEARCH"]').type('lighthouse-hub-monorepo');
    });

    it('Then the search results auto populate', () => {
      cy.contains('monorepo').should('be.visible');
    });
  });

  describe('When I select a result', () => {
    beforeEach(() => {
      cy.get('input[placeholder="SEARCH"]').should('have.value', '');
      cy.get('input[placeholder="SEARCH"]').type('lighthouse-hub-monorepo');
    });

    it('Then the page for the selected result displays', () => {
      cy.get(
        'a[href*="/catalog/default/component/lighthouse-developer-portal-monorepo"]',
      ).click();

      cy.url().should(
        'include',
        '/catalog/default/component/lighthouse-developer-portal-monorepo',
      );
    });
  });

  describe('When I select the next button', () => {
    beforeEach(() => {
      cy.get('button[aria-label="next page"]').should('exist').click();
    });

    it('Then the next page of results should load', () => {
      cy.contains('Petstore').should('exist');
    });
  });

  describe('When I select the previous button', () => {
    beforeEach(() => {
      cy.get('button[aria-label="next page"]').should('exist').click();
      cy.get('button[aria-label="previous page"]').should('exist').click();
    });

    it('Then the previous page of results should load', () => {
      cy.contains('Artists').should('exist');
    });
  });
});
