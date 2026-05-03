// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Punto de entrada principal de Angular en el navegador.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
