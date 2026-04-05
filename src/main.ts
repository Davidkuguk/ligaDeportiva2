import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Punto de entrada principal de Angular en el navegador.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
