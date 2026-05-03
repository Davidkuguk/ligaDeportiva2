// Comentario de estudiante: configuracion de Cypress para probar la web como usuario real.
import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
  },
  fixturesFolder: 'cypress/fixtures',
  video: false,
  screenshotOnRunFailure: false,
});
