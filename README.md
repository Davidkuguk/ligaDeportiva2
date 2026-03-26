# LigaDeportiva2

Proyecto Angular con SSR, Express y preparacion para MongoDB.

## Desarrollo frontend

```bash
ng serve
```

## Build

```bash
ng build
```

## Tests

```bash
ng test
```

## MongoDB con Express

1. Crea un archivo `.env` a partir de `.env.example`.
2. Configura `MONGODB_URI` con tu cadena de MongoDB Atlas y `MONGODB_DB_NAME` con el nombre de tu base de datos.
3. Asegurate de que la IP desde la que ejecutas la app esta permitida en MongoDB Atlas Network Access.
4. Ejecuta la build:

```bash
npm run build
```

5. Arranca el servidor SSR con Express:

```bash
npm run serve:ssr:ligaDeportiva2
```

## Endpoints API

- `GET /api/health`: comprueba si MongoDB esta configurado y si responde.
- `GET /api/liga-data`: devuelve los datos de la liga desde MongoDB. Si Mongo no esta configurado, devuelve los datos semilla.
- `POST /api/admin/seed`: inserta en MongoDB los datos semilla del proyecto.

## Flujo recomendado

1. Crea un cluster en MongoDB Atlas.
2. Crea un usuario de base de datos con permisos sobre tu cluster.
3. Permite tu IP en MongoDB Atlas Network Access.
4. Rellena `.env` con la URI `mongodb+srv` y el nombre de base de datos.
5. Ejecuta `npm run build`.
6. Ejecuta `npm run serve:ssr:ligaDeportiva2`.
7. Llama a `POST http://localhost:4000/api/admin/seed`.
8. Comprueba `GET http://localhost:4000/api/liga-data`.
