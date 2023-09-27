import entitiesDomains from '../../fixtures/entities/domains.json';
import entitiesApis from '../../fixtures/entities/apis.json';
import domainMetadata from '../../fixtures/facets/domain_meta.json';
import apiSpec from '../../fixtures/facets/apis_spec.json';
import apiMetadata from '../../fixtures/facets/apis_meta.json';
import allKinds from '../../fixtures/facets/all.json';
import catalogQuery from '../../fixtures/queryTerms/catalog.json';
import facetMetadata from '../../fixtures/facets/metadata_tags.json';
import domainsPage from '../../fixtures/entity/playback.json';

const responseStubs = [
  { url: '**/api/catalog/entities/by-name/domain/default/playback', body: domainsPage },
  { url: '**/api/catalog/entity-facets?facet=kind', body: allKinds },
  { url: '**/entities?filter=kind=api', body: entitiesApis },
  { url: '**/entities?filter=kind=domain', body: entitiesDomains },
  { url: '**/entity-facets?facet=metadata.tags', body: facetMetadata },
  { url: '**/entity-facets?filter=kind=api&facet=metadata.tags', body: apiMetadata },
  { url: '**/entity-facets?filter=kind=api&facet=spec.type', body: apiSpec },
  { url: '**/entity-facets?filter=kind=domain&facet=metadata.tags', body: domainMetadata },
  { url: '**/query?term=', body: catalogQuery },
];

describe('Given I am on the Catalog - Domains page', () => {
  beforeEach(() => {
    responseStubs.forEach(stub => cy.intercept('GET', stub.url, { statusCode: 202, body: stub.body }));

    cy.wrap(Cypress.automation('remote:debugger:protocol', { command: 'Network.clearBrowserCache' }));
    cy.clearCookies();

    cy.loginAsGuest();
    cy.visit('/catalog');
    cy.get('div[aria-label="catalog-kinds"] > button')
      .contains('Domains')
      .should('be.visible')
      .click();
    cy.contains('Browse the collection of Domains').scrollIntoView().should('be.visible');
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  describe('When I select a domain from the Name column', () => {
    beforeEach(() => {
      cy.get('[title="domain:playback"]').as('PlaybackDomain')
      cy.get('@PlaybackDomain').scrollIntoView();
      cy.get('@PlaybackDomain').click({ force: true });
    });

    it('Then the Overview page for that domain displays', () => {
      cy.url().should('include', '/catalog/default/domain/playback');
      cy.get('header').contains('Playback').scrollIntoView().should('be.visible');
      cy.get('article').contains('About').scrollIntoView().should('be.visible');
    });
  });

  describe('When I enter text into the Filter Domains by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('Artists');
    });

    it('Then the domains table filters to display only domains with values matching the text entered', () => {
      cy.contains('Artists').should('exist');
      cy.contains('Playback').should('not.exist');
    });
  });

  describe('When I select the X on the filter domain by keyword', () => {
    beforeEach(() => {
      cy.get('input[aria-label="Search"]').type('Artists');
      cy.get('svg[aria-label="clear"]').click();
    });

    it('Then the text entered into the filter field is cleared', () => {
      cy.get('input[aria-label="Search"]').should('be.empty');
    });
  });

  describe(`When I select the Name column`, () => {
    beforeEach(() => {
      cy.contains('Artists').parents('tr').as('ArtistsDomain');
      cy.contains('Lighthouse').parents('tr').as('LighthouseDomain');
      cy.contains('Playback').parents('tr').as('PlaybackDomain');
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').click();
      cy.get('@ArtistsDomain').scrollIntoView();
    });

    it('Then the domains in the table are displayed in ascending order by Name', () => {
      cy.get('@ArtistsDomain').invoke('attr', 'index').then(parseInt).then(artistsDomainIndex => {
        cy.get('@LighthouseDomain').invoke('attr', 'index').then(parseInt).should('be.gt', artistsDomainIndex);
      });
      cy.get('@LighthouseDomain').invoke('attr', 'index').then(parseInt).then(lighthouseDomainIndex => {
        cy.get('@PlaybackDomain').invoke('attr', 'index').then(parseInt).should('be.gt', lighthouseDomainIndex);
      });
    });
  });
  describe(`When I select the Owner column`, () => {
    beforeEach(() => {
      cy.contains('department-of-veterans-affairs').parents('tr').as('deptvaOwner');
      cy.contains('team-a').parents('tr').as('team-aOwner');
      cy.contains('frank.tiernan').parents('tr').as('frankOwner');
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').click();
      cy.get('@deptvaOwner').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in ascending order according to Owner`, () => {
      cy.get('@deptvaOwner').invoke('attr', 'index').then(parseInt).then(deptvaOwnerIndex => {
        cy.get('@team-aOwner').invoke('attr', 'index').then(parseInt).should('be.gt', deptvaOwnerIndex);
      });
      cy.get('@team-aOwner').invoke('attr', 'index').then(parseInt).then(team_aDomainIndex => {
        cy.get('@frankOwner').invoke('attr', 'index').then(parseInt).should('be.gt', team_aDomainIndex);
      });
    });
  });
  describe(`When I select the Description column`, () => {
    beforeEach(() => {
      cy.get('[value ="Everything related to artists"]').parents('tr').as('artistDesc');
      cy.get('[value ="Everything related to audio playback"]').parents('tr').as('playbackDesc');
      cy.get('[value ="Everything related to lighthouse"]').parents('tr').as('lighthouseDesc');
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').click();
      cy.get('@artistDesc').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in ascending order according to Description`, () => {
      cy.get('@artistDesc').invoke('attr', 'index').then(parseInt).then(artistDescIndex => {
        cy.get('@playbackDesc').invoke('attr', 'index').then(parseInt).should('be.gt', artistDescIndex);
      });
      cy.get('@playbackDesc').invoke('attr', 'index').then(parseInt).then(playbackDescIndex => {
        cy.get('@lighthouseDesc').invoke('attr', 'index').then(parseInt).should('be.gt', playbackDescIndex);
      });
    });
  });
  describe(`When I select the Tags column`, () => {
    beforeEach(() => {
      cy.get('[value="lighthouse"]').parents('tr').as('lighthouseTag');
      cy.contains('lighthouse-developer-portal-test-set').parents('tr').as('lighthouseTestTag');
      cy.get('table tr').contains('Tag').as('TagColumn');
      cy.get('@TagColumn').scrollIntoView();
      cy.get('@TagColumn').click();
      cy.get('@lighthouseTag').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in ascending order according to Tag`, () => {
      cy.get('@lighthouseTag').invoke('attr', 'index').then(parseInt).then(lighthouseTagIndex => {
        cy.get('@lighthouseTestTag').invoke('attr', 'index').then(parseInt).should('be.gt', lighthouseTagIndex);
      });
    });
  });
  describe('When I select the Name column twice', () => {
    beforeEach(() => {
      cy.contains('Artists').parents('tr').as('ArtistsDomain');
      cy.contains('Lighthouse').parents('tr').as('LighthouseDomain');
      cy.contains('Playback').parents('tr').as('PlaybackDomain');
      cy.get('table tr').contains('Name').as('NameColumn');
      cy.get('@NameColumn').scrollIntoView();
      cy.get('@NameColumn').dblclick();
      cy.get('@ArtistsDomain').scrollIntoView();
    });

    it('Then the domains in the table are displayed in descending order by Name', () => {
      cy.get('@ArtistsDomain').invoke('attr', 'index').then(parseInt).then(artistsDomainIndex => {
        cy.get('@LighthouseDomain').invoke('attr', 'index').then(parseInt).should('be.lt', artistsDomainIndex);
      });
      cy.get('@LighthouseDomain').invoke('attr', 'index').then(parseInt).then(lighthouseDomainIndex => {
        cy.get('@PlaybackDomain').invoke('attr', 'index').then(parseInt).should('be.lt', lighthouseDomainIndex);
      });
    });
  });

  describe(`When I select the Owner column twice`, () => {
    beforeEach(() => {
      cy.contains('frank.tiernan').parents('tr').as('frankOwner');
      cy.contains('team-a').parents('tr').as('team-aOwner');
      cy.contains('department-of-veterans-affairs').parents('tr').as('deptvaOwner');
      cy.get('table tr').contains('Owner').as('OwnerColumn');
      cy.get('@OwnerColumn').scrollIntoView();
      cy.get('@OwnerColumn').dblclick();
      cy.get('@frankOwner').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in descending order according to Owner`, () => {
      cy.get('@frankOwner').invoke('attr', 'index').then(parseInt).then(frankOwnerIndex => {
        cy.get('@team-aOwner').invoke('attr', 'index').then(parseInt).should('be.gt', frankOwnerIndex);
      });
      cy.get('@team-aOwner').invoke('attr', 'index').then(parseInt).then(team_aOwnerIndex => {
        cy.get('@deptvaOwner').invoke('attr', 'index').then(parseInt).should('be.gt', team_aOwnerIndex);
      });
    });
  });

  describe(`When I select the Description column twice`, () => {
    beforeEach(() => {
      cy.get('[value ="Everything related to artists"]').parents('tr').as('artistDesc');
      cy.get('[value ="Everything related to audio playback"]').parents('tr').as('playbackDesc');
      cy.get('[value ="Everything related to lighthouse"]').parents('tr').as('lighthouseDesc');
      cy.get('table tr').contains('Description').as('DescriptionColumn');
      cy.get('@DescriptionColumn').scrollIntoView();
      cy.get('@DescriptionColumn').dblclick();
      cy.get('@artistDesc').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in descending order according to Description`, () => {
      cy.get('@artistDesc').invoke('attr', 'index').then(parseInt).then(artistDescIndex => {
        cy.get('@playbackDesc').invoke('attr', 'index').then(parseInt).should('be.lt', artistDescIndex);
      });
      cy.get('@playbackDesc').invoke('attr', 'index').then(parseInt).then(playbackDescIndex => {
        cy.get('@lighthouseDesc').invoke('attr', 'index').then(parseInt).should('be.lt', playbackDescIndex);
      });
    });
  });

  describe('When I select the Tag column twice', () => {
    beforeEach(() => {
      cy.get('[value="lighthouse"]').parents('tr').as('lighthouseTag');
      cy.contains('lighthouse-developer-portal-test-set').parents('tr').as('lighthouseTestTag');
      cy.get('table tr').contains('Tag').as('TagColumn');
      cy.get('@TagColumn').scrollIntoView();
      cy.get('@TagColumn').dblclick();
      cy.get('@lighthouseTag').scrollIntoView();
    });

    it(`Then the domains in the table are displayed in ascending order according to Tags`, () => {
      cy.get('@lighthouseTag').invoke('attr', 'index').then(parseInt).then(lighthouseTagIndex => {
        cy.get('@lighthouseTestTag').invoke('attr', 'index').then(parseInt).should('be.lt', lighthouseTagIndex);
      });
    });
  });
});
