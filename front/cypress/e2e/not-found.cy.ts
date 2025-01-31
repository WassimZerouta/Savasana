describe('not-found', () => {
    it('should navigate to the 404', () => {
      cy.visit('/unknown');

      cy.url().should('contain', '/404');
  
      cy.contains('h1', 'Page not found').should('exist');
    });
  });