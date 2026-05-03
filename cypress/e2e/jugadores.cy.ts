// prueba E2E para comprobar la aplicacion como si la usara una persona real.
describe('Jugadores', () => {
  const createdPlayerName = `Marta E2E ${Date.now()}`;
  const firstNumber = 40 + (Date.now() % 20);
  const updatedNumber = firstNumber + 20;

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('muestra la lista publica de jugadores', () => {
    cy.visit('/jugadores');

    cy.contains('h1', 'Jugadores').should('be.visible');
    cy.contains('Alvaro Martin').should('be.visible');
    cy.contains('IES Maestre de Calatrava').should('be.visible');
    cy.contains('#1').should('be.visible');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('muestra un error controlado si el login de administrador falla', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('clave-incorrecta');
    cy.contains('button', 'Entrar').click();

    cy.location('pathname').should('eq', '/login');
    cy.get('[role="alert"]').should('be.visible').and('contain', 'Usuario o contrasena incorrectos.');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('crea y edita un jugador desde el panel admin y lo muestra actualizado', () => {
    cy.visit('/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.contains('button', 'Entrar').click();

    cy.location('pathname').should('eq', '/panel-admin');

    cy.get('#playerName').type(createdPlayerName);
    cy.get('#playerPosition').type('Base');
    cy.get('#playerNumber').clear().type(String(firstNumber));
    cy.get('#playerClub').select(1);
    cy.contains('button', 'Crear jugador').click();

    cy.contains('tr', createdPlayerName).within(() => {
      cy.contains('Base').should('be.visible');
      cy.contains(`#${firstNumber}`).should('be.visible');
      cy.contains('IES Maestre de Calatrava').should('be.visible');
      cy.contains('button', 'Editar').click();
    });

    cy.get('#playerPosition').clear().type('Escolta');
    cy.get('#playerNumber').clear().type(String(updatedNumber));
    cy.contains('button', 'Actualizar jugador').click();

    cy.contains('tr', createdPlayerName).within(() => {
      cy.contains('Escolta').should('be.visible');
      cy.contains(`#${updatedNumber}`).should('be.visible');
    });

    cy.visit('/jugadores');

    cy.contains(createdPlayerName).should('be.visible');
    cy.contains('IES Maestre de Calatrava').should('be.visible');
    cy.contains(`#${updatedNumber}`).should('be.visible');
  });
});

