import artists from '../../fixtures/apis/artists.json';

const appealsStatusApiWithReleaseNotesEntity = {
  "apiVersion": "backstage.io/v1alpha1",
  "kind": "API",
  "metadata": {
    "annotations": {
      "hub.lighthouse.va.gov/api-id": "appeals",
    },
    "name": "appeals-status-api-release-notes"
  },
  "spec": {
    "definition": {
      "openapi": "3.0.0",
      "info": {
        "version": "1.0.0",
        "title": "Appeals Status API with Release Notes",
        "license": {
          "name": "MIT"
        }
      }
    },
    "lifecycle": "experimental",
    "owner": "foobar",
    "type": "openapi"
  },
}
const appealsReleaseNotes = {
  "appeals": {
    "apis": [{
      "altID": "appeals",
      "releaseNotes": "### January 31, 2019\n\nAdd Power of Attorney verification for future Appeals Version 1 " +
        "[#2717](https://github.com/department-of-veterans-affairs/vets-api/pull/2717)\n\n\n---\n\n" +
        "### January 14, 2019\n\nBug discovered and fixed for safe null requests [#2727]" +
        "(https://github.com/department-of-veterans-affairs/vets-api/pull/2727)\n\n\n---\n\n" +
        "### June 11, 2018\n\nImplement VA-required headers to retrieve status [#2024]" +
        "(https://github.com/department-of-veterans-affairs/vets-api/pull/2024)\n\n\n---\n\n" +
        "### May 23, 2018\n\nAdd appeals service API [#1961]" +
        "(https://github.com/department-of-veterans-affairs/vets-api/pull/1961)\n",
    }],
  },
};

describe('Given an API has not published release notes', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '**/api/catalog/entities/by-name/api/default/artists',
    }, {
      statusCode: 202,
      body: artists,
    });

    cy.loginAsGuest();
  });

  describe('When a user selects the \'Release Notes\' tab', () => {
    beforeEach(() => {
      cy.visit('/catalog/default/api/artists');
      cy.get('div[role="tablist"]').contains('Release Notes').as('ReleaseNotesTab');
      cy.get('@ReleaseNotesTab').scrollIntoView();
      cy.get('@ReleaseNotesTab').click();
    });

    it('Then the Release Notes plugin is selected for the API', () => {
      cy.url().should('contain', '/release-notes');
      cy.get('@ReleaseNotesTab').should('have.attr', 'aria-selected', 'true');
    });
  });

  describe('And the Release Notes plugin is selected for the API', () => {
    beforeEach(() => cy.visit('/catalog/default/api/artists/release-notes'));

    it('Then an informational disclaimer is displayed', () => {
      cy.contains('Notice').should('be.visible');
      cy.contains("VA's public API Portal").should('be.visible');
    });

    it('Then a missing annotation message is displayed', () => {
      cy.contains('Missing Annotation').should('be.visible');
      cy.contains('hub.lighthouse.va.gov/api-id').should('be.visible');
    });

    it("Then a 'VA\'s public API Portal' link leads to developer.va.gov", () => {
      cy.contains("VA\'s public API Portal").first().invoke('attr', 'href').should('include', 'developer.va.gov');
    });

    it("Then the 'Lighthouse platform backend' link should lead to a data model in Github", () => {
      cy.contains('Lighthouse platform backend').invoke('attr', 'href')
        .should('include', 'github.com/department-of-veterans-affairs/lighthouse-platform-backend');
    });

    describe("When a user clicks on 'contact us'", () => {
      beforeEach(() => cy.contains('contact us').click());

      it('Then a login prompt appears', () => cy.contains('Login Required').should('be.visible'));
    });
  });
});

describe('Given an API has published release notes through Lighthouse', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '**/api/catalog/entities/by-name/api/default/appeals-status-api-release-notes',
    }, {
      statusCode: 202,
      body: appealsStatusApiWithReleaseNotesEntity,
    });

    cy.intercept({
      method: 'GET',
      url: '**/platform-backend/v0/providers/transformations/legacy.json?environment=production',
    }, {
      statusCode: 200,
      body: appealsReleaseNotes,
    });

    cy.loginAsGuest();
    cy.visit('/catalog/default/api/appeals-status-api-release-notes');
  });

  describe('When a user selects the \'Release Notes\' tab', () => {
    beforeEach(() => {
      cy.get('div[role="tablist"]').contains('Release Notes').as('ReleaseNotesTab');
      cy.get('@ReleaseNotesTab').scrollIntoView();
      cy.get('@ReleaseNotesTab').click();
    });

    it('Then the Release Notes plugin is selected for the API', () => {
      cy.url().should('contain', '/release-notes');
      cy.get('@ReleaseNotesTab').should('have.attr', 'aria-selected', 'true');
    });

    it('Then the API\'s release notes are displayed', () => {
      cy.contains('January 31, 2019').should('be.visible');
      cy.contains('Add Power of Attorney verification for future Appeals Version 1').should('be.visible');
    });
  });
});
