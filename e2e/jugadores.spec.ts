import { expect, test } from '@playwright/test';

test.describe('Modulo de jugadores', () => {
  test('caso exitoso: un administrador visualiza el listado actualizado de jugadores', async ({
    page,
  }) => {
    // Guardamos una sesion de admin simulada para evitar depender del login en esta prueba.
    await page.addInitScript(() => {
      localStorage.setItem(
        'liga.session',
        JSON.stringify({
          username: 'admin.maestre',
          firstName: 'Admin',
          tipo: 'admin',
        }),
      );
    });

    // Interceptamos el endpoint y devolvemos una lista controlada para comprobar la vista.
    await page.route('**/api/jugadores', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              nombre: 'Alvaro Prieto',
              posicion: 'Defensa',
              dorsal: 5,
              club: {
                nombre: 'Club Maestre',
                categoria: 'Juvenil',
              },
            },
            {
              nombre: 'Lucia Navas',
              posicion: 'Centrocampista',
              dorsal: 8,
              club: {
                nombre: 'Club Calatrava',
                categoria: 'Juvenil',
              },
            },
          ],
        }),
      });
    });

    // Entramos en la pagina publica de jugadores y comprobamos lo que ve el usuario.
    await page.goto('/jugadores');

    await expect(page.getByRole('heading', { name: 'Jugadores' })).toBeVisible();
    await expect(page.getByText('Alvaro Prieto')).toBeVisible();
    await expect(page.getByText('Club Maestre')).toBeVisible();
    await expect(page.getByText('#5')).toBeVisible();
    await expect(page.getByText('Lucia Navas')).toBeVisible();
  });

  test('caso de error controlado: si falla /api/jugadores se mantiene el listado semilla', async ({
    page,
  }) => {
    // Simulamos un fallo del backend para verificar el comportamiento de respaldo.
    await page.route('**/api/jugadores', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'No se pudo cargar la lista de jugadores.',
        }),
      });
    });

    await page.goto('/jugadores');

    // Si todo va bien, la interfaz sigue mostrando los datos semilla sin romperse.
    await expect(page.getByRole('heading', { name: 'Jugadores' })).toBeVisible();
    await expect(page.getByText('Antoni Ruiz')).toBeVisible();
    await expect(page.getByText('Toro')).toBeVisible();
    await expect(page.getByText('#9')).toBeVisible();
  });
});
