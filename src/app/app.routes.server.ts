import { RenderMode, ServerRoute } from '@angular/ssr';

// En servidor prerenderizamos todas las rutas para mejorar la carga inicial.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
