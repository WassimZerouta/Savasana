Cypress.Commands.add('loginAsUser', () => {

  cy.visit('/login');

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'Wass',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      admin: false,
    },
  });

  cy.intercept('GET', '/api/session', []).as('getSession');

  cy.get('input[formControlName="email"]').type('wassim.zerouta@gmail.com');
  cy.get('input[formControlName="password"]').type('wasswass1234!!{enter}{enter}');

  cy.url().should('contain', '/sessions');
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/login')

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'Wassim',
      firstName: 'Wass',
      lastName: 'Zer',
      admin: true,
    },
  })

  cy.intercept('GET', '/api/session', []).as('getSession');

  cy.get('input[formControlName=email]').type("yoga@studio.com")
  cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

  cy.url().should('contain', '/sessions')
});

  declare namespace Cypress {
    interface Chainable {
      loginAsUser(): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
    }
  }