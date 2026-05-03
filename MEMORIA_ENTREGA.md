# Memoria De Entrega

Este proyecto desarrolla una aplicacion web frontend para una liga deportiva escolar con Angular.

## Estructura

- `src/app`: componentes, rutas y servicios de la aplicacion.
- `src/app/ligaDeportiva/data`: datos iniciales de la liga.
- `src/app/ligaDeportiva/services`: servicios de sesion, datos locales y gestion de la liga.
- `public/img`: imagenes usadas por las vistas.

## Persistencia Local

La aplicacion guarda usuarios, equipos, partidos y jugadores en el navegador mediante `localStorage`.

Esto permite probar registro, login, paneles por rol y gestion de partidos sin depender de ningun servicio externo.

## Funcionalidades

- Pagina principal con noticias y resultados.
- Listado de equipos, clasificaciones, jugadores y arbitros.
- Registro e inicio de sesion por rol.
- Panel de administrador para gestionar partidos, jugadores y asignaciones.
- Panel de capitan para crear equipo y revisar partidos.
- Panel de arbitro para gestionar partidos asignados.

## Pruebas

El proyecto incluye pruebas unitarias y de integracion con Jasmine/Karma:

- Servicios de jugadores y autenticacion.
- Componentes de jugadores.
- Integracion entre componente, servicio y peticiones HTTP simuladas con `HttpClientTestingModule` y `HttpTestingController`.

Tambien incluye pruebas E2E con Cypress en `cypress/e2e/jugadores.cy.ts`:

- Ver la lista publica de jugadores.
- Iniciar sesion como administrador.
- Crear un jugador desde el panel.
- Editar el jugador creado.
- Comprobar que el cambio aparece en el panel y en la vista publica.

## Integracion Continua

El proyecto incluye un workflow de GitHub Actions en `.github/workflows/tests.yml`.

Este workflow se ejecuta automaticamente en cada `push` a `main` o `master` y en cada `pull_request`.

El job `unit-and-integration-tests` instala dependencias y ejecuta:

```bash
npm run test:ci
```

Con ese comando se ejecutan las pruebas unitarias y las pruebas de integracion de Angular con Jasmine/Karma.

El job `e2e-and-build` se ejecuta despues, lanza las pruebas E2E con Cypress y comprueba que la aplicacion Angular compila correctamente.

## Ejecucion

```bash
npm start
```

## Ejecucion De Pruebas

```bash
npm run test:ci
npm run test:e2e
```

## Usuarios De Prueba

- `admin` / `admin`
- `celia` / `1234`
- `ruben` / `1234`
