// configuracion de Karma para lanzar las pruebas de Angular con Jasmine.
const path = require('node:path');

// exporto la configuracion para que Karma sepa como lanzar las pruebas.
module.exports = function (config) {
  // dentro de este objeto dejo todas las opciones importantes de Karma.
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    // estos plugins conectan Jasmine, Chrome y el informe de cobertura.
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    client: {
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    // aqui indico donde se guardara la cobertura de las pruebas.
    coverageReporter: {
      dir: path.join(__dirname, 'coverage', 'ligaDeportiva2'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    // uso Chrome en modo headless para que funcione tambien en CI.
    browsers: ['ChromeHeadlessNoSandbox'],
    // este lanzador evita problemas de permisos en entornos automaticos.
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};

