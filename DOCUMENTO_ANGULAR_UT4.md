# Documento Explicativo De La Parte Angular

## 1. Estructura Angular Del Proyecto

La parte de Angular se ha realizado dentro de la carpeta `ligaDeportiva2`.

La aplicacion esta organizada en componentes, servicios, modelos, datos locales y rutas:

- `src/app/app.routes.ts`: define las rutas principales de la aplicacion.
- `src/app/ligaDeportiva/components`: contiene los componentes visuales.
- `src/app/ligaDeportiva/services`: contiene la logica de la aplicacion.
- `src/app/ligaDeportiva/models`: contiene las interfaces de datos.
- `src/app/ligaDeportiva/data`: contiene los datos iniciales de la liga.

El proyecto se ha dejado como frontend Angular puro. No depende de un backend real para funcionar.

## 2. Servicios Angular

Se han creado servicios para separar la logica de los componentes:

- `JugadorService`: gestiona jugadores.
- `AuthService`: gestiona registro e inicio de sesion.
- `LigaDataService`: devuelve datos publicos de la liga.
- `MatchManagementService`: gestiona partidos, equipos y asignaciones.
- `LocalLeagueStoreService`: guarda datos en `localStorage`.
- `SessionService`: guarda la sesion del usuario.

De esta forma, los componentes no trabajan directamente con los datos, sino que piden la informacion a los servicios.

## 3. Pruebas Unitarias Con Jasmine/Karma

Se han realizado pruebas unitarias para comprobar que la logica funciona correctamente de forma aislada.

Archivos principales:

- `src/app/ligaDeportiva/services/jugador.service.spec.ts`
- `src/app/ligaDeportiva/services/auth.service.spec.ts`
- `src/app/ligaDeportiva/services/liga-data.service.spec.ts`
- `src/app/ligaDeportiva/components/jugadores.component/jugadores.component.spec.ts`

En `JugadorService` se comprueba:

- Que devuelve los jugadores iniciales.
- Que puede crear un jugador.
- Que puede actualizar un jugador.
- Que puede eliminar un jugador.
- Que lanza error si se intenta actualizar un jugador que no existe.

En `AuthService` se comprueba:

- Que registra un usuario.
- Que permite iniciar sesion con datos correctos.
- Que rechaza usuarios duplicados.
- Que rechaza contrasenas incorrectas.

Comando usado:

```bash
npm run test:ci
```

Resultado comprobado:

```text
17 SUCCESS
```

## 4. Pruebas De Integracion En Angular

Tambien se han hecho pruebas de integracion. En estas pruebas no se prueba solo una clase aislada, sino la comunicacion entre un componente y un servicio.

Archivo:

- `src/app/ligaDeportiva/components/jugadores-http.integration.spec.ts`

En esta prueba se crea:

- Un servicio de prueba que usa `HttpClient`.
- Un componente de prueba que llama a ese servicio.
- Una peticion HTTP interceptada con `HttpTestingController`.

Esto permite comprobar que el componente se comunica correctamente con el servicio.

## 5. Simulacion De Llamadas HTTP Con Mocks

Para no depender de un servidor real, se ha usado:

- `HttpClientTestingModule`
- `HttpTestingController`

La prueba intercepta esta peticion:

```ts
/api/adegjorsu;
```

Y devuelve una respuesta falsa con formato parecido a Laravel:

```ts
{
  data: [
    {
      id: 12,
      nombre: 'Alvaro Prieto',
      posicion: 'Defensa',
      dorsal: 5,
      club: {
        nombre: 'Club Maestre',
        categoria: 'Juvenil',
      },
    },
  ];
}
```

Esto simula que Laravel responde, aunque no haya ningun backend real.

Tambien se prueba un caso de error HTTP `500`, para comprobar que el componente guarda un mensaje de error cuando la peticion falla.

## 6. Pruebas E2E Con Cypress

Las pruebas E2E comprueban la aplicacion como si la usara una persona real desde el navegador.

Archivo:

- `cypress/e2e/jugadores.cy.ts`

Se prueban estos casos:

- Entrar en la pagina publica de jugadores.
- Comprobar que aparece la lista de jugadores.
- Iniciar sesion como administrador.
- Crear un jugador desde el panel de administracion.
- Editar el jugador creado.
- Comprobar que los cambios aparecen en pantalla.
- Ir a la vista publica y comprobar que el jugador editado aparece actualizado.

Comando usado:

```bash
npm run test:e2e
```

Resultado comprobado:

```text
2 passing
```

Nota: en Windows fue necesario quitar la variable `ELECTRON_RUN_AS_NODE` antes de ejecutar Cypress:

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
```

## 7. Integracion Continua CI/CD

Se ha configurado GitHub Actions para ejecutar las pruebas automaticamente.

Archivo:

- `.github/workflows/tests.yml`

El workflow se ejecuta en:

- `push` a `main`
- `push` a `master`
- `pull_request`

Tiene dos jobs:

### `unit-and-integration-tests`

Instala dependencias y ejecuta:

```bash
npm run test:ci
```

Este comando ejecuta las pruebas unitarias y las pruebas de integracion con Jasmine/Karma.

### `e2e-and-build`

Despues de pasar los tests anteriores:

- Ejecuta Cypress.
- Arranca la aplicacion Angular.
- Comprueba que la aplicacion compila con `npm run build`.

## 8. Comandos Principales

Para arrancar la aplicacion:

```bash
npm start
```

Para compilar:

```bash
npm run build
```

Para ejecutar tests unitarios e integracion:

```bash
npm run test:ci
```

Para ejecutar Cypress:

```bash
npm run test:e2e
```

## 9. Conclusion

La parte de Angular cumple los puntos principales del ejercicio:

- Tiene componentes y servicios separados.
- Tiene pruebas unitarias con Jasmine/Karma.
- Tiene pruebas de integracion entre componente y servicio.
- Simula llamadas HTTP sin usar backend real.
- Tiene pruebas E2E con Cypress.
- Tiene integracion continua con GitHub Actions.
- La aplicacion compila correctamente.
