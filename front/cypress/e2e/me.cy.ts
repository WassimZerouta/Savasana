import '../support/commands.ts'

describe('Me', () => {
  it('should display user information and allow account deletion', () => {

    cy.intercept('GET', '/api/user/1', {
        body: {
            email: 'wassim.zerouta@gmail.com',
            firstName: 'wassim',
            lastName: 'zerouta',
            admin: false,
            createdAt: new Date(2025, 0, 5),
            updatedAt: new Date(2025, 0, 7)
        }
    });

    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200,
      body: {},
    }).as('deleteAccount');

    cy.loginAsUser();

    cy.url().should('include', '/sessions');

    cy.contains('span.link', 'Account').should('be.visible');
    cy.contains('span.link', 'Account').click();

    cy.contains('Name: wassim ZEROUTA').should('be.visible');
    cy.contains('Email: wassim.zerouta@gmail.com').should('be.visible');
    cy.contains('Create at: January 5, 2025').should('be.visible');
    cy.contains('Last update: January 7, 2025').should('be.visible');

    cy.contains('Detail').should('be.visible');

    cy.contains('Detail').click();

    cy.wait('@deleteAccount').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/');
  });
});

describe('Me', () => {
  it('should display user information and logout successfully', () => {
    
    cy.intercept('GET', '/api/user/1', {
        body: {
            email: 'wassim.zerouta@gmail.com',
            firstName: 'wassim',
            lastName: 'zerouta',
            admin: false,
            createdAt: new Date(2025, 0, 5).toISOString(),
            updatedAt: new Date(2025, 0, 7).toISOString()
        }
    }).as('getUser');

    cy.loginAsUser();

    cy.url().should('include', '/sessions');

    cy.contains('span.link', 'Account').should('be.visible');

    cy.contains('span.link', 'Account').click();

    cy.contains('Name: wassim ZEROUTA').should('be.visible');
    cy.contains('Email: wassim.zerouta@gmail.com').should('be.visible');
    cy.contains('Delete my account:').should('be.visible');
    cy.contains('Create at: January 5, 2025').should('be.visible');
    cy.contains('Last update: January 7, 2025').should('be.visible');

    cy.contains('span.link', 'Logout').should('be.visible');

    cy.contains('span.link', 'Logout').click();

    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
