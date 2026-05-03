// Comentario de estudiante: prueba E2E para comprobar la aplicacion como si la usara una persona real.
describe('Jugadores', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('muestra la lista publica de jugadores', () => {
    cy.visit('/jugadores');

    cy.contains('h1', 'Jugadores').should('be.visible');
    cy.contains('Antoni Ruiz').should('be.visible');
    cy.contains('Azules').should('be.visible');
    cy.contains('#9').should('be.visible');
  });

  it('muestra un error controlado si el login de administrador falla', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('clave-incorrecta');
    cy.contains('button', 'Entrar').click();

    cy.location('pathname').should('eq', '/login');
    cy.get('[role="alert"]').should('be.visible').and('contain', 'No se pudo iniciar sesion.');
  });

  it('crea y edita un jugador desde el panel admin y lo muestra actualizado', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.contains('button', 'Entrar').click();

    cy.location('pathname').should('eq', '/panel-admin');

    cy.get('#playerName').type('Marta E2E');
    cy.get('#playerPosition').type('Base');
    cy.get('#playerNumber').clear().type('12');
    cy.get('#playerClub').select(1);
    cy.contains('button', 'Crear jugador').click();

    cy.contains('tr', 'Marta E2E').within(() => {
      cy.contains('Base').should('be.visible');
      cy.contains('#12').should('be.visible');
      cy.contains('Azules').should('be.visible');
      cy.contains('button', 'Editar').click();
    });

    cy.get('#playerPosition').clear().type('Escolta');
    cy.get('#playerNumber').clear().type('8');
    cy.contains('button', 'Actualizar jugador').click();

    cy.contains('tr', 'Marta E2E').within(() => {
      cy.contains('Escolta').should('be.visible');
      cy.contains('#8').should('be.visible');
    });

    cy.visit('/jugadores');

    cy.contains('Marta E2E').should('be.visible');
    cy.contains('Azules').should('be.visible');
    cy.contains('#8').should('be.visible');
  });
});
