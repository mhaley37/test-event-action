describe('Homepage', () => {
  // Set current user as guest and visit the homepage
  beforeEach(() => {
    cy.loginAsGuest();
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  it('should load homepage', () => {
    cy.contains('Explore the Hub');
  });

  it('should contain to add to catalog card', () => {
    cy.contains('Add an API');
  });

  it('should contain explore catalog card', () => {
    cy.contains('Explore the catalog');
  });

  it('should contain starter guide card', () => {
    cy.contains('Read the starter guide');
  });

  it('should contain onboarding info card', () => {
    cy.contains('Delivery Infrastructure questions?');
  });

  it('should contain feedback banner', () => {
    cy.contains("We'd love your feedback!");
  });
});
