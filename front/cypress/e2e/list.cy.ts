import '../support/commands.ts'

describe('List', () => {
    it('should create a session', () => {
      cy.intercept('GET', '/api/session', []);
  
      cy.intercept('GET', '/api/teacher', [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: new Date(2025, 1, 2),
          updatedAt: new Date(2025, 1, 3), 
        },
        {
          id: 2,
          lastName: 'THIERCELIN',
          firstName: 'Hélène',
          createdAt: new Date(2025, 1, 3), 
          updatedAt: new Date(2025, 1, 10), 
        },
      ]);
  
      cy.intercept('POST', '/api/session', {
        id: 1,
        name: 'Session 1',
        description: 'Description session 1',
        date: new Date(2025, 1, 3), 
        teacher_id: 1,
        createdAt: new Date(2025, 1, 2), 
      });
  
      cy.loginAsAdmin();
  
      cy.contains('span.ml1', 'Create').should('be.visible');
  
      cy.contains('span.ml1', 'Create').click();
  
      cy.contains('Create session').should('be.visible');
  
      cy.get('input[formControlName=name]').type('Session 2');
      cy.get('input[formControlName=date]').type('2025-01-11');
      cy.get('mat-select[formControlName=teacher_id]')
        .click()
        .get('mat-option')
        .contains('Margot DELAHAYE')
        .click();
      cy.get('textarea[formControlName=description]').type('Description session 2');
  
      cy.intercept('GET', '/api/session', [
        {
          id: 1,
          name: 'Session 2',
          description: 'Description session 2',
          date: new Date(2025, 1, 11), 
          teacher_id: 1,
          users: [],
        },
      ]);
  
      cy.get('button[type=submit]').click();
  
      cy.url().should('include', '/sessions');
      cy.contains('Session created !').should('be.visible');
  
      cy.contains('Session 2').should('be.visible');
    });
  });
