# Memoria UT5 - Despliegue Frontend Angular

## Objetivo

En esta unidad se prepara el frontend Angular + Bootstrap de la Liga Deportiva del IES Maestre de Calatrava para publicarse en produccion y desplegarse automaticamente despues de superar las pruebas.

## Servicio Publicado

- Frontend actual: https://ligadeportivafront.netlify.app/home
- Frontend preparado para Render: `liga-deportiva-front`

## Plataforma

El frontend se despliega como sitio estatico. Render instala las dependencias con `npm ci`, compila Angular con `npm run build` y publica el resultado generado en:

```text
dist/ligaDeportiva2/browser
```

El archivo `public/_redirects` y la regla de rutas de `render.yaml` redirigen cualquier ruta interna a `index.html`, por lo que se puede abrir directamente `/home`, `/jugadores`, `/equipos`, `/clasificaciones` o cualquier vista gestionada por Angular Router.

## Configuracion Render

El archivo `render.yaml` define:

- tipo de servicio: `web`;
- runtime: `static`;
- comando de build: `npm ci && npm run build`;
- carpeta publicada: `dist/ligaDeportiva2/browser`;
- rewrite `/* -> /index.html` para soportar rutas SPA.

## Integracion Continua

El workflow `.github/workflows/tests.yml` ejecuta la validacion del frontend:

- instala dependencias con `npm ci`;
- prepara Chrome para las pruebas;
- ejecuta pruebas unitarias e integracion con Jasmine/Karma;
- ejecuta pruebas E2E con Cypress;
- compila la aplicacion Angular.

## Despliegue Continuo

El workflow `.github/workflows/deploy-render.yml` se activa cuando `Angular CI` termina correctamente en `main` o `master`.

Para activarlo se crea en GitHub el secreto:

```text
RENDER_FRONTEND_DEPLOY_HOOK_URL
```

Este secreto contiene la Deploy Hook URL del sitio en Render. Si las pruebas o la build fallan, no se lanza el despliegue.

## Seguridad Y Estabilidad

- El despliegue solo se ejecuta despues de superar CI.
- La URL privada de despliegue se guarda en GitHub Secrets.
- La aplicacion se entrega como archivos estaticos optimizados.
- Las rutas internas quedan protegidas contra errores 404 del servidor mediante rewrite a `index.html`.
