// En esta prueba usamos datos simulados para no depender de la API real.
describe('Modulo de jugadores', () => {
  it('caso exitoso: muestra el listado actualizado de jugadores', () => {
    cy.fixture('jugadores-publicos.json').then((jugadores) => {
      cy.intercept('GET', '**/api/jugadores', {
        statusCode: 200,
        body: {
          data: jugadores,
        },
      }).as('getJugadores');
    });

    cy.visit('/jugadores');
    cy.wait('@getJugadores');

    cy.contains('h1', 'Jugadores').should('be.visible');
    cy.contains('Alvaro Prieto').should('be.visible');
    cy.contains('Club Maestre').should('be.visible');
    cy.contains('#5').should('be.visible');
    cy.contains('Lucia Navas').should('be.visible');
  });

  it('caso de error controlado: si falla la API se mantiene el listado semilla', () => {
    cy.intercept('GET', '**/api/jugadores', {
      statusCode: 500,
      body: {
        message: 'No se pudo cargar la lista de jugadores.',
      },
    }).as('getJugadoresError');

    cy.visit('/jugadores');
    cy.wait('@getJugadoresError');

    cy.contains('h1', 'Jugadores').should('be.visible');
    cy.contains('Antoni Ruiz').should('be.visible');
    cy.contains('Toro').should('be.visible');
    cy.contains('#9').should('be.visible');
  });
});
