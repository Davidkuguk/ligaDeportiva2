type ClubRecord = {
  id: number;
  nombre: string;
  categoria: string;
};

type PlayerRecord = {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
  club: ClubRecord;
};

// Este helper deja preparado todo el backend falso que necesita el panel admin.
function stubAdminApis(players: PlayerRecord[], clubs: ClubRecord[]): void {
  cy.intercept('GET', '**/api/catalog/options', {
    statusCode: 200,
    body: {
      ok: true,
      teams: ['Azules', 'Titanes'],
      referees: [],
      users: [],
    },
  }).as('getCatalog');

  cy.intercept('GET', '**/api/matches', {
    statusCode: 200,
    body: {
      ok: true,
      matches: [],
    },
  }).as('getMatches');

  cy.intercept('GET', '**/api/clubs', {
    statusCode: 200,
    body: {
      data: clubs,
    },
  }).as('getClubs');

  cy.intercept('GET', '**/api/jugadores', {
    statusCode: 200,
    body: {
      data: players,
    },
  }).as('getPlayers');

  cy.intercept('POST', '**/api/jugadores', (request) => {
    const payload = request.body as {
      nombre: string;
      posicion: string;
      dorsal: number;
      club_id: number;
    };

    const duplicate = players.some((player) => player.club_id === payload.club_id && player.dorsal === payload.dorsal);

    if (duplicate) {
      request.reply({
        statusCode: 422,
        body: {
          message: 'El dorsal ya existe en este club.',
        },
      });
      return;
    }

    const club = clubs.find((item) => item.id === Number(payload.club_id));

    const createdPlayer: PlayerRecord = {
      id: Math.max(...players.map((player) => player.id), 0) + 1,
      nombre: payload.nombre,
      posicion: payload.posicion,
      dorsal: Number(payload.dorsal),
      club_id: Number(payload.club_id),
      club: club!,
    };

    players.push(createdPlayer);

    request.reply({
      statusCode: 201,
      body: {
        data: createdPlayer,
      },
    });
  }).as('createPlayer');

  cy.intercept('PUT', '**/api/jugadores/*', (request) => {
    const id = Number(request.url.split('/').pop());
    const payload = request.body as {
      nombre: string;
      posicion: string;
      dorsal: number;
      club_id: number;
    };

    const player = players.find((item) => item.id === id);
    const duplicate = players.some(
      (item) => item.id !== id && item.club_id === Number(payload.club_id) && item.dorsal === Number(payload.dorsal),
    );

    if (!player) {
      request.reply({
        statusCode: 404,
        body: {
          message: 'Jugador no encontrado.',
        },
      });
      return;
    }

    if (duplicate) {
      request.reply({
        statusCode: 422,
        body: {
          message: 'El dorsal ya existe en este club.',
        },
      });
      return;
    }

    const club = clubs.find((item) => item.id === Number(payload.club_id));

    player.nombre = payload.nombre;
    player.posicion = payload.posicion;
    player.dorsal = Number(payload.dorsal);
    player.club_id = Number(payload.club_id);
    player.club = club!;

    request.reply({
      statusCode: 200,
      body: {
        data: player,
      },
    });
  }).as('updatePlayer');

  cy.intercept('DELETE', '**/api/jugadores/*', (request) => {
    const id = Number(request.url.split('/').pop());
    const index = players.findIndex((item) => item.id === id);

    if (index >= 0) {
      players.splice(index, 1);
    }

    request.reply({
      statusCode: 200,
      body: {
        message: 'Jugador eliminado correctamente.',
      },
    });
  }).as('deletePlayer');

  cy.intercept('POST', '**/api/auth/login**', {
    statusCode: 200,
    body: {
      ok: true,
      message: 'Sesion iniciada.',
      user: {
        username: 'admin.maestre',
        firstName: 'Admin',
        tipo: 'admin',
      },
    },
  }).as('login');
}

// Repetimos el acceso como lo haria un usuario real desde la pantalla de login.
function loginAsAdmin(): void {
  cy.visit('/login', {
    onBeforeLoad(window) {
      window.localStorage.setItem('liga.demo_admin_key', 'demo-ut3-key');
    },
  });

  cy.get('#username').type('admin.maestre');
  cy.get('#password').type('admin123');
  cy.contains('button', 'Entrar').click();
  cy.wait('@login');
  cy.url().should('include', '/panel-admin');
}

describe('Administracion de jugadores', () => {
  it('permite crear y editar jugadores desde el panel admin', () => {
    cy.fixture('clubes.json').then((clubs: ClubRecord[]) => {
      cy.fixture('jugadores-admin.json').then((initialPlayers: PlayerRecord[]) => {
        const players = structuredClone(initialPlayers);

        stubAdminApis(players, clubs);
        loginAsAdmin();

        cy.wait(['@getCatalog', '@getMatches', '@getClubs', '@getPlayers']);

        cy.contains('h2', 'Jugadores gestionables').should('be.visible');
        cy.contains('Alvaro Prieto').should('be.visible');

        cy.get('#playerName').clear().type('Lucia Navas');
        cy.get('#playerPosition').clear().type('Centrocampista');
        cy.get('#playerNumber').clear().type('8');
        cy.get('#playerClub').select('2');
        cy.contains('button', 'Crear jugador').click();

        cy.wait('@createPlayer');
        cy.contains('Lucia Navas').should('be.visible');
        cy.contains('#8').should('be.visible');

        cy.contains('tr', 'Lucia Navas').within(() => {
          cy.contains('button', 'Editar').click();
        });

        cy.get('#playerPosition').clear().type('Pivote');
        cy.contains('button', 'Actualizar jugador').click();

        cy.wait('@updatePlayer');
        cy.contains('Pivote').should('be.visible');
      });
    });
  });

  it('muestra un error controlado cuando se intenta repetir un dorsal en el mismo club', () => {
    cy.fixture('clubes.json').then((clubs: ClubRecord[]) => {
      cy.fixture('jugadores-admin.json').then((initialPlayers: PlayerRecord[]) => {
        const players = structuredClone(initialPlayers);

        stubAdminApis(players, clubs);
        loginAsAdmin();

        cy.wait(['@getCatalog', '@getMatches', '@getClubs', '@getPlayers']);

        cy.get('#playerName').clear().type('Mario Torres');
        cy.get('#playerPosition').clear().type('Portero');
        cy.get('#playerNumber').clear().type('5');
        cy.get('#playerClub').select('1');
        cy.contains('button', 'Crear jugador').click();

        cy.wait('@createPlayer');
        cy.get('[role="alert"]').should('contain.text', 'El dorsal ya existe en este club.');
        cy.contains('Mario Torres').should('not.exist');
      });
    });
  });
});
