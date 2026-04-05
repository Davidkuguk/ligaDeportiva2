import { expect, test } from '@playwright/test';

// Tipo local para representar jugadores en las respuestas simuladas del E2E.
type PlayerRecord = {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
  club: {
    id: number;
    nombre: string;
    categoria: string;
  };
};

const clubs = [
  { id: 1, nombre: 'Club Maestre', categoria: 'Juvenil' },
  { id: 2, nombre: 'Club Calatrava', categoria: 'Cadete' },
];

async function stubAdminPanelApis(page: Parameters<typeof test>[0]['page'], players: PlayerRecord[]) {
  // Simulamos el catalogo basico que necesita el panel admin al cargarse.
  await page.route('**/api/catalog/options', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        teams: ['Azules', 'Titanes'],
        referees: [],
        users: [],
      }),
    });
  });

  // Aqui devolvemos una lista vacia de partidos porque en esta prueba no son lo importante.
  await page.route('**/api/matches', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        matches: [],
      }),
    });
  });

  // Cargamos los clubes para que el select del formulario tenga opciones reales.
  await page.route('**/api/clubs', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: clubs,
      }),
    });
  });

  // Este bloque resuelve tanto el listado GET como la creacion POST.
  await page.route('**/api/jugadores', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: players }),
      });
      return;
    }

    // Leemos el body del formulario como si fuera una peticion real.
    const payload = request.postDataJSON() as {
      nombre: string;
      posicion: string;
      dorsal: number;
      club_id: number;
    };

    if (players.some((player) => player.club_id === payload.club_id && player.dorsal === payload.dorsal)) {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'El dorsal ya existe en este club.',
        }),
      });
      return;
    }

    // Si no hay conflicto, anadimos el jugador al array en memoria.
    const club = clubs.find((item) => item.id === payload.club_id)!;
    const createdPlayer: PlayerRecord = {
      id: Math.max(...players.map((player) => player.id), 0) + 1,
      ...payload,
      club,
    };

    players.push(createdPlayer);

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        data: createdPlayer,
      }),
    });
  });

  // Este segundo route cubre editar y borrar sobre una URL con id.
  await page.route('**/api/jugadores/*', async (route, request) => {
    const id = Number(request.url().split('/').pop());
    const existingPlayer = players.find((player) => player.id === id);

    if (!existingPlayer) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Jugador no encontrado.' }),
      });
      return;
    }

    if (request.method() === 'PUT') {
      // Comprobamos tambien en la edicion que no se repita dorsal en el mismo club.
      const payload = request.postDataJSON() as {
        nombre: string;
        posicion: string;
        dorsal: number;
        club_id: number;
      };

      const duplicate = players.some(
        (player) => player.id !== id && player.club_id === payload.club_id && player.dorsal === payload.dorsal,
      );

      if (duplicate) {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'El dorsal ya existe en este club.',
          }),
        });
        return;
      }

      const club = clubs.find((item) => item.id === payload.club_id)!;
      existingPlayer.nombre = payload.nombre;
      existingPlayer.posicion = payload.posicion;
      existingPlayer.dorsal = payload.dorsal;
      existingPlayer.club_id = payload.club_id;
      existingPlayer.club = club;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: existingPlayer,
        }),
      });
      return;
    }

    if (request.method() === 'DELETE') {
      // Borramos del array local para que el cambio se vea reflejado en pantalla.
      const index = players.findIndex((player) => player.id === id);
      players.splice(index, 1);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Jugador eliminado correctamente.' }),
      });
    }
  });
}

test.describe('Administracion de jugadores', () => {
  test.beforeEach(async ({ page }) => {
    // Dejamos una clave demo en localStorage para que el frontend pueda enviarla.
    await page.addInitScript(() => {
      localStorage.setItem('liga.demo_admin_key', 'demo-ut3-key');
    });

    // Tambien simulamos el login para entrar al panel como admin.
    await page.route('**/api/auth/login**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'Sesion iniciada.',
          user: {
            username: 'admin.maestre',
            firstName: 'Admin',
            tipo: 'admin',
          },
        }),
      });
    });
  });

  async function loginAsAdmin(page: Parameters<typeof test>[0]['page']) {
    // Este helper repite el flujo de acceso igual que lo haria un usuario real.
    await page.goto('/login');
    await page.getByLabel('Usuario').fill('admin.maestre');
    await page.getByLabel('Contrasena').fill('admin123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/\/panel-admin$/);
  }

  test('permite crear y editar jugadores desde el panel admin', async ({ page }) => {
    const players: PlayerRecord[] = [
      {
        id: 1,
        nombre: 'Alvaro Prieto',
        posicion: 'Defensa',
        dorsal: 5,
        club_id: 1,
        club: {
          id: 1,
          nombre: 'Club Maestre',
          categoria: 'Juvenil',
        },
      },
    ];

    // Montamos el backend falso y entramos al panel.
    await stubAdminPanelApis(page, players);
    await loginAsAdmin(page);

    await expect(page.getByRole('heading', { name: 'Jugadores gestionables' })).toBeVisible();
    await expect(page.getByText('Alvaro Prieto')).toBeVisible();

    await page.getByLabel('Nombre').fill('Lucia Navas');
    await page.getByLabel('Posicion').fill('Centrocampista');
    await page.getByLabel('Dorsal').fill('8');
    await page.getByLabel('Club').selectOption({ index: 2 });
    await page.getByRole('button', { name: 'Crear jugador' }).click();

    // Validamos que el alta se ve reflejada en la interfaz.
    await expect(page.getByText('Lucia Navas')).toBeVisible();
    await expect(page.getByText('#8')).toBeVisible();

    await page.getByRole('button', { name: 'Editar' }).nth(1).click();
    await page.getByLabel('Posicion').fill('Pivote');
    await page.getByRole('button', { name: 'Actualizar jugador' }).click();

    await expect(page.getByText('Pivote')).toBeVisible();
  });

  test('muestra un error controlado cuando se intenta repetir un dorsal en el mismo club', async ({
    page,
  }) => {
    const players: PlayerRecord[] = [
      {
        id: 1,
        nombre: 'Alvaro Prieto',
        posicion: 'Defensa',
        dorsal: 5,
        club_id: 1,
        club: {
          id: 1,
          nombre: 'Club Maestre',
          categoria: 'Juvenil',
        },
      },
    ];

    await stubAdminPanelApis(page, players);
    await loginAsAdmin(page);

    // Intentamos repetir un dorsal dentro del mismo club para provocar un error controlado.
    await page.getByLabel('Nombre').fill('Mario Torres');
    await page.getByLabel('Posicion').fill('Portero');
    await page.getByLabel('Dorsal').fill('5');
    await page.getByLabel('Club').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Crear jugador' }).click();

    await expect(page.getByRole('alert')).toContainText('El dorsal ya existe en este club.');
    await expect(page.getByText('Mario Torres')).not.toBeVisible();
  });
});
