import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
  },
  fixturesFolder: 'cypress/fixtures',
  video: false,
  screenshotOnRunFailure: false,
});
