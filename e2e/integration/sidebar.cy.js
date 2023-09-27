describe('Given a user is authenticated', () => {
  beforeEach(() => cy.loginAsGitHubUser());

  describe('When they select settings from the sidebar', () => {
    beforeEach(() => cy.get('a[aria-label="Settings"]').should('exist').click());

    it('Then the settings page displays', () => cy.url().should('include', '/settings'));
  });

  describe('And they are on the Settings page', () => {
    beforeEach(() => {
      cy.visit('/settings');
      cy.get('input[aria-label="Pin Sidebar Switch"]').as('PinSidebarSwitch');
      cy.get('nav').get('[aria-label="Home"]').as('HomeMenuLink');
    });

    describe('When they select the ellipses icon in the profile section', () => {
      beforeEach(() => cy.get('button[aria-label="more"]').should('exist').click());

      it('Then the "Sign Out" option is displayed', () => cy.contains('Sign Out').should('be.visible'));
    });

    describe('When they pin the sidebar', () => {
      beforeEach(() => {
        localStorage.setItem('sidebarPinState', false);
        cy.reload();
        cy.get('header').contains('Settings').should('be.visible');
        cy.get('@PinSidebarSwitch').check();
      });

      it('Then the sidebar is pinned open', () => cy.get('@HomeMenuLink').contains('Home').should('be.visible'));
    });

    describe('When they unpin the sidebar', () => {
      beforeEach(() => {
        localStorage.setItem('sidebarPinState', true);
        cy.reload();
        cy.get('header').contains('Settings').should('be.visible');
        cy.get('@PinSidebarSwitch').uncheck();
      });

      it('Then the sidebar is not pinned open', () => cy.get('@HomeMenuLink').contains('Home').should('not.exist'));
    });

    describe('When they select the Authentication Providers tab', () => {
      beforeEach(() => cy.contains('Authentication Providers').click());

      it('Then the Authentication Providers page is displayed', () => {
        cy.url().should('include', '/settings/auth-providers');
        cy.get('article').contains('Available Providers').should('be.visible');
      });
    });

    describe('When they select the Feature Flags tab', () => {
      beforeEach(() => cy.contains('Feature Flags').click());

      it('Then the Feature Flags page is displayed', () => {
        cy.url().should('include', '/settings/feature-flags');
        cy.get('article').contains('Feature Flags').should('be.visible');
      });
    });
  });

  describe('And they are on the Feature Flags page', () => {
    const techRadarSelector = 'a[aria-label="Tech Radar"]';

    beforeEach(() => {
      sessionStorage.setItem('featureFlags', '{}');
      cy.visit('/settings/feature-flags');
      cy.get('input[name="radar-dashboard"]').as('RadarDashboardSwitch');
    });

    describe('When they toggle the radar dashboard', () => {
      beforeEach(() => {
        cy.get('@RadarDashboardSwitch').check();
        cy.reload();
        cy.get('article').contains('Feature Flags').should('be.visible');
      });

      it('Then the radar icon color changes to blue', () => {
        // Verify css color field is set to blue
        cy.get('@RadarDashboardSwitch').parent().parent().should('have.css', 'color').and('eq', 'rgb(17, 34, 56)');
      });

      it('Then Tech Radar is displayed on the sidebar', () => cy.get(techRadarSelector).should('be.visible'));

      describe('And they select the tech radar from the sidebar', () => {
        beforeEach(() => cy.get(techRadarSelector).should('exist').click());

        it('Then the tech radar page is displayed', () => {
          cy.url().should('include', '/tech-radar');
          cy.contains('Tech Radar').should('be.visible');
        });
      });
    });

    describe('When they un-toggle the radar dashboard', () => {
      beforeEach(() => {
        cy.get('@RadarDashboardSwitch').uncheck();
        cy.reload();
        cy.get('article').contains('Feature Flags').should('be.visible');
      });

      it('Then the radar icon color changes back to white', () => {
        // Verify that css color field is set to white
        cy.get('@RadarDashboardSwitch').parent().parent().should('have.css', 'color').and('eq', 'rgb(250, 250, 250)');
      });

      it('Then Tech Radar is not displayed on the sidebar', () => cy.get(techRadarSelector).should('not.exist'));
    });
  });

  afterEach(() => {
    cy.signOutUser();
    localStorage.clear();
  });
});
