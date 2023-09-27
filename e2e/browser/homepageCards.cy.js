describe('Given I am on the Homepage', () => {
  beforeEach(() => {
    cy.loginAsGuest();
    cy.visit('/');
  });

  afterEach(() => cy.clearSessionStorage());

  describe('When I select the Add an API card', () => {
    beforeEach(() =>
      cy.get('main a').contains('Add an API', { matchCase: false }).click(),
    );

    it('Then the Catalog Import page renders', () =>
      cy.url().should('include', '/catalog-import'));
  });

  describe('When I select the Explore the Catalog card', () => {
    beforeEach(() =>
      cy
        .get('main a')
        .contains('Explore the catalog', { matchCase: false })
        .click(),
    );

    it('Then the catalog renders', () =>
      cy.url().should('include', '/catalog'));
  });

  describe('When I select the Starter Guide Card', () => {
    beforeEach(() =>
      cy
        .get('main a')
        .contains('Read the starter guide', { matchCase: false })
        .click(),
    );

    it('Then the Starter Guide renders', () =>
      cy.url().should('include', '/starter-guide'));
  });

  describe('When I select the Slack link from the Onboarding card', () => {
    beforeEach(() => {
      cy.contains('CONNECT VIA SLACK')
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
    it('Then the Slack email modal appears', () =>
      cy.contains('your Slack account').should('be.visible'));

    describe('And I type an email in the text field', () => {
      beforeEach(() => {
        cy.get('input[placeholder="name@work-email.com"]')
          .should('be.visible')
          .click();
        cy.get('input[placeholder="name@work-email.com"]')
          .should('have.value', '')
          .type('test@test.com');
      });
      it('Then the Enter button activates', () => {
        cy.get('button[tabindex="0"]').contains('Enter').should('be.visible');
      });
    });

    describe('And I select the Cancel button', () => {
      beforeEach(() => cy.contains('Cancel').should('be.visible').click());

      it('Then the Slack modal closes', () => {
        cy.contains('Provide feedback on the Lighthouse Hub').should(
          'not.exist',
        );
      });
    });
  });

  describe('When I try to leave feedback', () => {
    beforeEach(() => {
      cy.get('main').scrollTo('bottom', {
        duration: 100,
        ensureScrollable: false,
      });
      cy.get('main a').contains('Get in touch!').click();
    });

    it('Then the Login Required popup displays', () => {
      cy.get('h1').contains('Login Required').as('loginScreen');
      cy.get('@loginScreen').scrollIntoView().should('be.visible');
    });
  });
});
