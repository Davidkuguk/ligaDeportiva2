// prueba E2E para comprobar la aplicacion como si la usara una persona real.
describe('Jugadores', () => {
  const createdPlayerName = `Marta E2E ${Date.now()}`;
  const firstNumber = 40 + (Date.now() % 20);
  const updatedNumber = firstNumber + 20;
  const clubs = [
    {
      id: 1,
      nombre: 'IES Maestre de Calatrava',
      ciudad: 'Ciudad Real',
      categoria: 'Juvenil',
    },
  ];
  let players: Array<{
    id: number;
    nombre: string;
    posicion: string;
    dorsal: number;
    club_id: number;
    club: (typeof clubs)[number];
  }> = [];

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(() => {
    cy.clearLocalStorage();
    players = [
      {
        id: 1,
        nombre: 'Alvaro Martin',
        posicion: 'Portero',
        dorsal: 1,
        club_id: 1,
        club: clubs[0],
      },
    ];

    cy.intercept('GET', '**/api/jugadores', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: players,
        },
      });
    }).as('listPlayers');

    cy.intercept('GET', '**/api/clubs', {
      statusCode: 200,
      body: {
        data: clubs,
      },
    }).as('listClubs');

    cy.intercept('POST', '**/api/auth/login', (req) => {
      if (req.body.username === 'admin' && req.body.password === 'admin') {
        req.reply({
          statusCode: 200,
          body: {
            ok: true,
            message: 'Sesion iniciada correctamente.',
            token: 'token-admin-e2e',
            user: {
              username: 'admin',
              firstName: 'Admin',
              tipo: 'admin',
            },
          },
        });
        return;
      }

      req.reply({
        statusCode: 422,
        body: {
          message: 'Usuario o contrasena incorrectos.',
        },
      });
    }).as('login');

    cy.intercept('POST', '**/api/jugadores', (req) => {
      const player = {
        id: 99,
        ...req.body,
        club: clubs[0],
      };

      players = [...players, player];

      req.reply({
        statusCode: 201,
        body: {
          data: player,
        },
      });
    }).as('createPlayer');

    cy.intercept('PUT', '**/api/jugadores/*', (req) => {
      const id = Number(req.url.split('/').pop());
      const updatedPlayer = {
        id,
        ...req.body,
        club: clubs[0],
      };

      players = players.map((player) => (player.id === id ? updatedPlayer : player));

      req.reply({
        statusCode: 200,
        body: {
          data: updatedPlayer,
        },
      });
    }).as('updatePlayer');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('muestra la lista publica de jugadores', () => {
    cy.visit('/#/jugadores');
    cy.wait('@listPlayers');

    cy.contains('h1', 'Jugadores').should('be.visible');
    cy.contains('Alvaro Martin').should('be.visible');
    cy.contains('IES Maestre de Calatrava').should('be.visible');
    cy.contains('#1').should('be.visible');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('muestra un error controlado si el login de administrador falla', () => {
    cy.visit('/#/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('clave-incorrecta');
    cy.contains('button', 'Entrar').click();
    cy.wait('@login');

    cy.location('hash').should('eq', '#/login');
    cy.get('[role="alert"]').should('be.visible').and('contain', 'Usuario o contrasena incorrectos.');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('crea y edita un jugador desde el panel admin y lo muestra actualizado', () => {
    cy.visit('/#/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.contains('button', 'Entrar').click();
    cy.wait('@login');

    cy.location('hash').should('eq', '#/panel-admin');
    cy.wait('@listPlayers');
    cy.wait('@listClubs');

    cy.get('#playerName').type(createdPlayerName);
    cy.get('#playerPosition').type('Base');
    cy.get('#playerNumber').clear().type(String(firstNumber));
    cy.get('#playerClub').select(1);
    cy.contains('button', 'Crear jugador').click();
    cy.wait('@createPlayer');
    cy.wait('@listPlayers');

    cy.contains('tr', createdPlayerName).within(() => {
      cy.contains('Base').should('be.visible');
      cy.contains(`#${firstNumber}`).should('be.visible');
      cy.contains('IES Maestre de Calatrava').should('be.visible');
      cy.contains('button', 'Editar').click();
    });

    cy.get('#playerPosition').clear().type('Escolta');
    cy.get('#playerNumber').clear().type(String(updatedNumber));
    cy.contains('button', 'Actualizar jugador').click();
    cy.wait('@updatePlayer');
    cy.wait('@listPlayers');

    cy.contains('tr', createdPlayerName).within(() => {
      cy.contains('Escolta').should('be.visible');
      cy.contains(`#${updatedNumber}`).should('be.visible');
    });

    cy.visit('/#/jugadores');
    cy.wait('@listPlayers');

    cy.contains(createdPlayerName).should('be.visible');
    cy.contains('IES Maestre de Calatrava').should('be.visible');
    cy.contains(`#${updatedNumber}`).should('be.visible');
  });
});

