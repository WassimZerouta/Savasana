describe('Register', () => {
    it('should register user', () => {

      cy.visit('/register');
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 201,
        body: {
          id: 1,
          firstName: 'Wass',
          lastName: 'Zer',
          email: 'wass.wass@gmail.com',
          createdAt: new Date(2025, 0, 9),
        },
      }).as('registerUser');
  
      cy.get('input[formControlName=firstName]').type('Wass');
      cy.get('input[formControlName=lastName]').type('Zer');
      cy.get('input[formControlName=email]').type('wass.wass@gmail.com');
      cy.get('input[formControlName=password]').type('password123');
  
      cy.get('button').contains('Submit').click();
  
      cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
  
      cy.url().should('include', '/login');
    });
  });