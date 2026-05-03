// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

// Configuracion general de Angular para el navegador.
// exporto esta constante para poder reutilizarla desde otros archivos.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withHashLocation()),
  ]
};

