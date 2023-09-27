/* eslint-disable jest/no-commented-out-tests */

// const GITHUB_ISSUE_URL =
//   '/repos/department-of-veterans-affairs/lighthouse-developer-portal/issues';

describe('FeedbackModal', () => {
  // Set current user as guest, visit the homepage, and open the feedback modal
  beforeEach(() => {
    cy.loginAsGuest();
    cy.visit('/');
    cy.get('h6').contains('Feedback').click();
  });

  afterEach(() => {
    cy.clearSessionStorage();
  });

  it('should open the login prompt', () => {
    cy.contains('Login Required').should('be.visible');
  });

  // TODO: re add tests once we can fake authentication
  // @see https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/468

  //   it('should close the feedback modal', () => {
  //     cy.visit('/');
  //     cy.get('h6').contains('Feedback').click();
  //     cy.contains('Provide feedback on the Lighthouse Hub').should(
  //       'be.visible',
  //     );
  //     cy.get('span').contains('Cancel').should('be.visible').click();
  //     cy.contains('Provide feedback on the Lighthouse Hub').should(
  //       'not.exist',
  //     );
  //   });

  //   it('should not submit when textarea is empty', () => {
  //     cy.contains('Provide feedback on the Lighthouse Hub').should(
  //       'be.visible',
  //     );
  //     cy.get('button').contains('Submit').parent().should('be.disabled');
  //   });

  //   context('Submitting feedback', () => {
  //     // Confirm the feedback modal is open, and enter the text within the textarea
  //     beforeEach(() => {
  //       cy.contains('Provide feedback on the Lighthouse Hub').should(
  //         'be.visible',
  //       );
  //       cy.get('textarea').first().type('feedback is awesome!');
  //     });

  //     it('should submit the form when the text area has content', () => {
  //       // Submit the form
  //       cy.get('button')
  //         .contains('Submit')
  //         .parent()
  //         .should('not.be.disabled')
  //         .click();
  //       cy.contains('Provide feedback on the Lighthouse Hub').should(
  //         'not.exist',
  //       );
  //     });
  //   it('should display a dismissable message after failed submit', () => {
  //     cy.intercept(
  //       { method: 'POST', url: GITHUB_ISSUE_URL },
  //       {
  //         statusCode: 404,
  //         body: '404 Not Found!',
  //         headers: {
  //           'x-not-found': 'true',
  //         },
  //       },
  //     );

  //     // Submit the form
  //     cy.get('button')
  //       .contains('Submit')
  //       .parent()
  //       .should('not.be.disabled')
  //       .click();

  //     cy.get('div')
  //       .contains('Failed to submit feedback. Please try again later.')
  //       .should('be.visible');
  //     cy.contains('Provide feedback on the Lighthouse Hub').should(
  //       'not.exist',
  //     );
  //   });
  // });
});
