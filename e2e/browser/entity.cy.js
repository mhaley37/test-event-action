import apiWithRelated from '../../fixtures/entity/apiWithRelated.json';
import componentWithRelated from '../../fixtures/entity/componentWithRelated.json';
import api from '../../fixtures/entity/api.json';
import apiSoap from '../../fixtures/entity/api-soap.json';
import monitorOk from '../../fixtures/datadog/monitor_ok.json';
import monitorAlert from '../../fixtures/datadog/monitor_alert.json';
import services from '../../fixtures/pagerDuty/services.json';
import onCalls from '../../fixtures/pagerDuty/onCalls.json';

describe('Given I am on an Entity Page', () => {
  beforeEach(() => {
    cy.loginAsGuest();
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  context('When the Entity has related entities', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/catalog/entities/by-name/api/default/hello-world',
        },
        {
          statusCode: 202,
          body: apiWithRelated,
        },
      );
      cy.intercept(
        {
          method: 'GET',
          url: '/api/catalog/entities?filter=kind=component,metadata.namespace=default,metadata.name=frontend',
        },
        {
          statusCode: 202,
          body: componentWithRelated,
        },
      );
    });

    it('Displays a Providers card', () => {
      cy.visit('/catalog/default/api/hello-world');
      cy.contains('Hello World').should('be.visible');
      cy.contains('Providers').should('exist');
    });

    it('Displays a Consumers card', () => {
      cy.visit('/catalog/default/api/hello-world');
      cy.contains('Hello World').should('be.visible');
      cy.contains('Consumers').should('exist');
    });
  });

  context('When I view an Entity that does not have related entities', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/catalog/entities/by-name/api/default/hello-world',
        },
        {
          statusCode: 202,
          body: api,
        },
      );
      cy.intercept(
        {
          method: 'GET',
          url: '/api/proxy/pagerduty/services*',
        },
        {
          statusCode: 200,
          body: services,
        },
      );
      cy.intercept(
        {
          method: 'GET',
          url: '/api/proxy/pagerduty/oncalls*',
        },
        {
          statusCode: 200,
          body: onCalls,
        },
      );
    });

    it('Then the Providers card is not displayed', () => {
      cy.visit('/catalog/default/api/hello-world');
      cy.contains('Hello World').should('be.visible');
      cy.contains('Providers').should('not.exist');
    });

    it('Then the Consumers card is not displayed', () => {
      cy.visit('/catalog/default/api/hello-world');
      cy.contains('Hello World').should('be.visible');
      cy.contains('Consumers').should('not.exist');
    });

    it('Then the on call card is displayed', () => {
      cy.visit('/catalog/default/api/hello-world');

      cy.contains('Hello World').should('be.visible');
      cy.contains('Test testington').scrollIntoView().should('be.visible');
    });

    it('Then the Status tab is displayed', () => {
      cy.visit('/catalog/default/api/hello-world');

      cy.contains('Hello World').should('be.visible');
      cy.contains('Status').should('be.visible');
    });

    it('Then the PagerDuty Card is displayed on the status tab', () => {
      cy.visit('/catalog/default/api/hello-world');

      cy.contains('Hello World').should('be.visible');
      cy.contains('Status').should('be.visible').click();
      cy.contains('Incidents').should('be.visible');
      cy.contains('Test testington').scrollIntoView().should('be.visible');
    });
  });

  context('For an API of type XML', () => {
    describe('When I click the Try It out button', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/api/catalog/entities/by-name/api/default/hello-world-without-relations-soap',
          },
          {
            statusCode: 202,
            body: apiSoap,
          },
        );
        cy.visit(
          '/catalog/default/api/hello-world-without-relations-soap/api-spec',
        );
        cy.contains('getListCountries').should('be.visible');
        cy.contains('/getCountries').scrollIntoView();
        cy.contains('/getCountries').should('be.visible').click();
      });

      it('Then an example request is displayed', () => {
        cy.contains('Example Value').should('be.visible');
      });

      it('Then it has the Try It Out button enabled', () => {
        cy.contains('Try it out').should('be.visible').click();

        cy.contains('Execute').should('be.visible');
      });

      it('Then it is able to submit an example request', () => {
        cy.intercept(
          {
            method: 'POST',
            url: '/api/soap/getListCountries/getCountries?wsdl=**',
          },
          {
            statusCode: 200,
            body: 'Cypress',
          },
        ).as('soapRequest');
        cy.contains('Try it out').should('be.visible').click();

        cy.contains('Execute').should('be.visible').click();
        cy.wait('@soapRequest')
          .its('request.body')
          .should('include', '<wsse:Username>string</wsse:Username>');
      });
    });
  });

  context('Given an entity has an API status annotation', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/catalog/entities/by-name/api/default/hello-world-without-relations-soap',
        },
        {
          statusCode: 202,
          body: apiSoap,
        },
      );

      cy.visit(
        '/catalog/default/api/hello-world-without-relations-soap/status',
      );
      cy.contains('Current Status').should('be.visible');
    });

    describe('When a user visits the Status view for that entity', () => {
      it('Then a monitor with OK status is displayed', () => {
        cy.intercept(
          {
            method: 'GET',
            url: '/api/proxy/datadog/*',
          },
          {
            statusCode: 200,
            body: monitorOk,
          },
        ).as('healthyMonitor');

        cy.visit(
          '/catalog/default/api/hello-world-without-relations-soap/status',
        );
        cy.contains('Current Status').should('be.visible');
        cy.wait('@healthyMonitor');
        cy.contains('Production:').should('be.visible');
        cy.contains('API is performing as expected.').should('be.visible');
      });

      it('Then a monitor with Alert status is displayed', () => {
        cy.intercept(
          {
            method: 'GET',
            url: '/api/proxy/datadog/*',
          },
          {
            statusCode: 200,
            body: monitorAlert,
          },
        ).as('alertMonitor');

        cy.visit(
          '/catalog/default/api/hello-world-without-relations-soap/status',
        );
        cy.contains('Current Status').should('be.visible');
        cy.wait('@alertMonitor');
        cy.contains('Production:').should('be.visible');
        cy.contains('API is down or performing poorly.').should('be.visible');
      });

      it('Then a error message is displayed for incorrect ids', () => {
        cy.contains('Production:').should('be.visible');
        cy.contains(
          'Status monitoring has not been set up for this API',
        ).should('be.visible');
      });
    });
  });

  context('Given an entity has no API status annotation', () => {
    describe('When a user visits the Status view for the entity', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            url: '/api/catalog/entities/by-name/api/default/hello-world-without-relations-soap',
          },
          {
            statusCode: 202,
            body: api,
          },
        );
        cy.intercept(
          {
            method: 'GET',
            url: '/api/proxy/datadog/search?*',
          },
          {
            statusCode: 200,
            body: { monitors: [monitorOk] },
          },
        ).as('healthyMonitorSearch');
        cy.visit(
          '/catalog/default/api/hello-world-without-relations-soap/status',
        );
        cy.wait('@healthyMonitorSearch');
        cy.contains('Current Status').should('be.visible');
      });

      it('Then a monitor found via search is displayed', () => {
        cy.contains('Production:').should('be.visible');
        cy.contains('API is performing as expected.').should('be.visible');
      });
    });
  });
});
