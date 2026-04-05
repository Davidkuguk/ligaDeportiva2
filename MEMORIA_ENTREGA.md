# Memoria De Entrega UT2

## 1. Descripcion General

Este proyecto desarrolla una aplicacion web para la Liga Deportiva del instituto con Angular, SSR con Express y persistencia en MongoDB Atlas. La aplicacion reutiliza la idea del proyecto anterior y la adapta a una estructura moderna basada en componentes, servicios, rutas y backend integrado.

## 2. Estructura Del Proyecto

La aplicacion se organiza en varias capas:

- `src/app/shared`: componentes compartidos como navbar y footer.
- `src/app/ligaDeportiva/components`: componentes de vistas publicas y paneles por rol.
- `src/app/ligaDeportiva/services`: servicios de autenticacion, sesion, datos y gestion de partidos.
- `src/backend`: acceso a MongoDB, repositorios y catalogos.
- `src/server.ts`: servidor Express con los endpoints REST y renderizado SSR.
- `public/img`: imagenes usadas por la interfaz.

## 3. Componentes Implementados

Se han creado y adaptado los siguientes componentes principales:

- `home`
- `noticias`
- `equipos`
- `jugadores`
- `clasificaciones`
- `arbitros`
- `contacto`
- `login`
- `registro`
- `panel-admin`
- `panel-arbitro`
- `panel-usuario`
- `panel-capitan`

Ademas, se han descompuesto los paneles en subcomponentes reutilizables como:

- `admin-match-form`
- `admin-match-list`
- `admin-user-team-form`
- `admin-resumen`
- `arbitro-match-list`
- `arbitro-resumen`
- `usuario-match-list`
- `usuario-resumen`
- `captain-team-form`

## 4. Rutas Y Navegacion

La aplicacion incluye rutas para las vistas publicas y los paneles privados:

- `/home`
- `/equipos`
- `/resultados`
- `/clasificaciones`
- `/jugadores`
- `/arbitros`
- `/contacto`
- `/login`
- `/registro`
- `/panel-admin`
- `/panel-arbitro`
- `/panel-capitan`
- `/panel-usuario`

En el login se consulta el usuario en MongoDB y, segun su campo `tipo`, se redirige al panel correspondiente.

## 5. Roles Y Funcionalidad

### Administrador

- Puede crear partidos.
- Puede editar partidos.
- Puede asignar usuarios a equipos.
- Puede consultar el catalogo general de usuarios, arbitros y equipos.

### Arbitro

- Solo visualiza los partidos en los que esta asignado como arbitro.

### Capitan

- Dispone de un panel propio.
- Puede crear su equipo si todavia no tiene uno asignado.
- Puede consultar los partidos de su equipo.

### Usuario

- Consulta solo los partidos del equipo al que pertenece.

## 6. MongoDB Y Persistencia

La persistencia se realiza con MongoDB Atlas. El proyecto usa variables de entorno:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `PORT`

Colecciones usadas:

- `usuarios`
- `teams`
- `matches`
- `results`
- `standings`
- `players`
- `referees`
- `news`

Se han creado indices para mejorar las consultas y garantizar unicidad, por ejemplo:

- `uniq_username`
- `uniq_email_sparse`
- `uniq_team_name`
- indices de partidos por competicion, arbitro y equipos

## 7. Servicio Backend

El servidor Express implementa, entre otros, los siguientes endpoints:

- `POST /api/auth/register`
- `GET /api/auth/login`
- `POST /api/auth/login`
- `GET /api/catalog/options`
- `POST /api/teams`
- `PUT /api/users/:username/team`
- `GET /api/matches`
- `POST /api/matches`
- `PUT /api/matches/:id`
- `GET /api/health`
- `GET /api/liga-data`
- `POST /api/admin/seed`

El login y el registro se conectan con MongoDB para crear y recuperar usuarios reales. La contrasena se almacena de forma cifrada mediante `scrypt`.

## 8. Diseno Responsive

La interfaz usa Bootstrap y CSS propio. Se han empleado:

- contenedores fluidos y rejilla Bootstrap
- columnas responsivas `col-12`, `col-md-*`, `col-lg-*`, `col-xl-*`
- menu responsive con `navbar-expand-md`
- media query para movil en `src/styles.css`

Esto permite una visualizacion correcta al menos en dispositivos moviles, como pide el enunciado.

## 9. Scripts Y Ejecucion

Scripts principales del proyecto:

- `npm run build`
- `npm run test -- --watch=false`
- `npm run serve:ssr:ligaDeportiva2`
- `npm run seed:mongo`

## 10. Verificacion Realizada

Antes de la entrega se ha comprobado que:

- la build del proyecto compila correctamente
- los tests pasan
- existe separacion por roles
- existe panel propio para capitan
- el login admite consulta mediante `GET`
- MongoDB esta preparado con repositorios, indices y endpoints

## 11. Material Para El PDF Final

Para exportar esta memoria a PDF y completar la entrega, conviene anadir:

- captura del arbol de directorios del proyecto
- capturas del login y registro
- capturas de panel administrador, arbitro, capitan y usuario
- capturas en resolucion movil
- capturas de MongoDB Atlas con el cluster y las colecciones

La base tecnica y el texto explicativo ya estan preparados en este documento.
