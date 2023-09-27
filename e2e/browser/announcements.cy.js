// announcements page intercepts
import announcementsList from '../../fixtures/announcements/announcementsList.json';
import announcement from '../../fixtures/announcements/announcement.json';
// home page intercepts
import announcementBanner from '../../fixtures/announcements/announcementBanner.json';
import backstageIdentity from '../../fixtures/announcements/backstageIdentity.json';

describe('Announcements Plugin', () => {
  beforeEach(() => {
    // announcements page intercepts
    cy.intercept(
      {
        method: 'GET',
        url: '**/api/announcements/announcements?max=10&page=1',
      },
      {
        statusCode: 200,
        body: announcementsList,
      },
    ).as('getAnnouncements');

    cy.intercept(
      {
        method: 'GET',
        url: '**/api/announcements/announcements/43efe311-7f81-4c11-ac3c-ef9efd08725b',
      },
      {
        statusCode: 200,
        body: announcement,
      },
    ).as('getAnnouncementByID');

    cy.intercept(
      {
        method: 'GET',
        url: '**/api/announcements/categories',
      },
      {
        statusCode: 200,
        body: [
          { slug: 'info', title: 'Info' },
          { slug: 'warning', title: 'Warning' },
        ],
      },
    ).as('getCategories');

    // home page intercepts
    cy.intercept(
      {
        method: 'GET',
        url: '**/announcements?max=1',
      },
      {
        statusCode: 200,
        body: announcementBanner,
      },
    ).as('getAnnouncementBanner');
  });

  describe('Given I am logged in as a Guest User', () => {
    beforeEach(() => {
      cy.viewport(1600, 1000);
      cy.loginAsGuest();
    });

    afterEach(() => {
      cy.clearAllSessionStorage();
    });

    describe('AND I am on the Announcements Page', () => {
      beforeEach(() => {
        cy.visit('/announcements');
        cy.url().should('contain', '/announcements');

        cy.wait('@getAnnouncements');
      });

      it('Then all current announcements are listed', () => {
        cy.get('div').contains('test announcement').should('be.visible');
      });

      it('Then clicking on a announcement card opens the announcement details page', () => {
        cy.get('div')
          .contains('test announcement')
          .should('be.visible')
          .click({ force: true });

        cy.wait('@getAnnouncementByID');

        cy.url().should(
          'contain',
          'announcements/view/43efe311-7f81-4c11-ac3c-ef9efd08725b',
        );

        cy.contains('Back to announcements').should('be.visible');
      });

      it('Then the new announcement button is NOT visible', () => {
        cy.get('span').contains('New announcement').should('not.exist');
      });

      it('Then the edit announcement icon button is NOT visible', () => {
        cy.get('a[title="edit announcement"]').should('not.exist');
      });

      it('Then the delete announcement icon button is NOT visible', () => {
        cy.get('a[title="delete announcement"]').should('not.exist');
      });

      it('Then the Categories Menu button is NOT visible', () => {
        cy.get('button[data-testid="menu-button"]').should('not.exist');
      });
    });

    describe('AND I am on the Home Page', () => {
      beforeEach(() => {
        cy.visit('/');
        cy.url().should('contain', '/');

        cy.wait('@getAnnouncementBanner');
      });

      it('Then the new announcement banner is displayed on the homepage', () => {
        cy.get('div')
          .contains('View announcement details')
          .should('be.visible');
      });

      it('AND clicking on the announcement opens the announcement details page', () => {
        cy.get('div')
          .contains('View announcement details')
          .should('be.visible')
          .click();

        cy.url().should(
          'contain',
          'announcements/view/43efe311-7f81-4c11-ac3c-ef9efd08725b',
        );

        cy.contains('Back to announcements').should('be.visible');
      });
    });
  });

  describe('Given I am logged in as a member of team bandicoot', () => {
    beforeEach(() => {
      cy.viewport(1600, 1000);
      cy.loginAsGitHubUser();

      cy.intercept(
        {
          method: 'GET',
          url: '**api/auth/github/refresh?optional&env=development',
        },
        {
          statusCode: 200,
          body: backstageIdentity,
        },
      ).as('backstageIdentity');

      cy.intercept(
        {
          method: 'POST',
          url: '**/api/permission/authorize',
        },
        req => {
          req.reply({
            statusCode: 200,
            body: {
              items: [{ id: req.body.items[0].id, result: 'ALLOW' }],
            },
          });
        },
      ).as('announcementsPermissionALLOW');
    });

    describe('AND I am on the Announcements Page', () => {
      beforeEach(() => {
        cy.visit('/announcements');

        cy.wait('@backstageIdentity');
        cy.wait('@announcementsPermissionALLOW');
      });

      it('Then all current announcements are listed', () => {
        cy.get('div').contains('Announcements').should('be.visible');
      });

      it('Then the new announcement button is visible and opens to the new announcement page', () => {
        cy.get('span')
          .contains('New announcement')
          .should('be.visible')
          .click();

        cy.url().should('contain', 'announcements/create');

        cy.contains('New announcement').should('be.visible');
      });

      it('Then the edit announcement icon button is visible and opens to the edit announcement page', () => {
        cy.get('a[title="edit announcement"]')
          .should('be.visible')
          .first()
          .click();

        cy.wait('@getAnnouncementByID');

        cy.url().should('contain', 'announcements/edit');

        cy.contains('Edit announcement').should('be.visible');
      });

      it('Then the delete announcement icon button is visible and opens to the delete announcement dialog', () => {
        cy.get('button[title="delete announcement"]')
          .should('be.visible')
          .first()
          .click();

        cy.contains('Delete').should('be.visible');
      });

      it('Then the Categories Menu button is visible and opens to the categories page', () => {
        cy.get('button[data-testid="menu-button"]')
          .should('be.visible')
          .click();

        cy.get('span').contains('Categories').click();

        cy.url().should('contain', 'announcements/categories');

        cy.wait('@getCategories');

        cy.contains('Manage announcement categories').should('be.visible');
      });
    });
  });
});
