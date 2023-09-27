import locations from '../../fixtures/locations.json';
import entitiesApis from '../../fixtures/entities/apis.json';
import artists from '../../fixtures/apis/artists.json';
import catalog from '../../fixtures/apis/catalog.json';
import countries from '../../fixtures/apis/countries.json';

describe('OpenAPI definition widget', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.loginAsGuest();
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entities?fields=kind**' },
      {
        statusCode: 202,
        body: locations,
      },
    );
    cy.intercept(
      { method: 'GET', url: '**/api/catalog/entities?filter=kind=api**' },
      {
        statusCode: 202,
        body: entitiesApis,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/api/default/artists',
      },
      {
        statusCode: 202,
        body: artists,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/api/default/catalog-api',
      },
      {
        statusCode: 202,
        body: catalog,
      },
    );
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/catalog/entities/by-name/api/default/countries-api',
      },
      {
        statusCode: 202,
        body: countries,
      }
    );
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  it('loads catalog-api definition(no drop down menu)', () => {
    cy.visit('/catalog/default/api/catalog-api/api-spec');
    cy.contains('catalog-api').should('be.visible');
  });

  it('loads artists definition(drop down menu)', () => {
    cy.visit('/catalog/default/api/artists/api-spec');
    cy.contains('artists').should('be.visible');
  });

  it('selects development server by default', () => {
    cy.visit('/catalog/default/api/artists/api-spec');
    cy.contains('development').should('be.visible');
  });

  it('should display non-production servers as enabled', () => {
    cy.visit('/catalog/default/api/artists/api-spec');
    cy.get('select')
      .get('[value="https://api-qa.va.gov/v3"]')
      .should('not.be.disabled');
    cy.get('select')
      .get('[value="http://sandbox-api.va.gov/v2"]')
      .should('not.be.disabled');
  });

  it('should display production servers as disabled', () => {
    cy.visit('/catalog/default/api/artists/api-spec');
    cy.get('select')
      .get('[value="http://artist.spotify.net/v1"]')
      .should('be.disabled');
    cy.get('select')
      .get('[value="https://api.va.gov/v1"]')
      .should('be.disabled');
  });

  describe('Given an API is a SOAP API', () => {
    const apiUri = '/catalog/default/api/countries-api/api-spec';

    describe('And the Swagger UI view of the API spec has rendered', () => {
      beforeEach(() => cy.visit(apiUri));

      it('Then the WSDL service name is visible', () => cy.contains('CountriesPortService').should('be.visible'));
    });

    describe('And a user has expanded an operation', () => {
      beforeEach(() => cy.visit("${apiUri}#/default/getCountry"));

      it('Then the Swagger UI view of the API spec is read-only', () => {
        cy.get('.auth-wrapper').should('not.exist');
        cy.get('.try-out').should('not.exist');
      });
    });

    describe('When a user selects the raw version of the API spec', () => {
      beforeEach(() => {
        cy.visit(apiUri);
        cy.contains('Raw').click();
      });

      it('Then XML is displayed', () => {
        cy.get('code')
          .contains('<?xml version="1.0"')
          .contains('wsdl:definitions')
          .should('be.visible');
      });
    });
  });
});
