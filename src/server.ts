import 'dotenv/config';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

import { LIGA_SEED_DATA } from './app/ligaDeportiva/data/liga.seed';
import { getCatalogOptions } from './backend/catalog.repository';
import { getLigaDataFromDatabase, seedLigaData } from './backend/liga.repository';
import { createMatch, listMatches, updateMatch } from './backend/match.repository';
import { getDatabase, isMongoConfigured, pingMongo } from './backend/mongo';
import { assignUserToTeam, createTeam, DuplicateTeamError } from './backend/team.repository';
import { DuplicateUserError, loginUser, registerUser } from './backend/user.repository';

const ALLOWED_USER_TYPES = ['admin', 'normal', 'arbitro', 'jugador', 'capitan', 'entrenador', 'aficionado'] as const;

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// Endpoint para registrar un usuario nuevo en MongoDB.
app.post('/api/auth/register', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  const firstName = getStringField(req.body, 'firstName');
  const lastName = getStringField(req.body, 'lastName');
  const username = getStringField(req.body, 'username');
  const tipo = getStringField(req.body, 'tipo');
  const password = getStringField(req.body, 'password');

  if (!firstName || !lastName || !username || !tipo || !password) {
    res.status(400).json({
      ok: false,
      message: 'Nombre, apellidos, usuario, tipo de usuario y contrasena son obligatorios.',
    });
    return;
  }

  if (!isValidUserType(tipo)) {
    res.status(400).json({
      ok: false,
      message: 'El tipo de usuario no es valido.',
    });
    return;
  }

  try {
    const user = await registerUser({
      firstName,
      lastName,
      username,
      tipo,
      teamName: getStringField(req.body, 'teamName') || undefined,
      password,
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente.',
      user,
    });
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      res.status(409).json({
        ok: false,
        message: error.message,
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

// Devuelve listados auxiliares para formularios: equipos, arbitros y usuarios.
app.get('/api/catalog/options', async (_req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  try {
    const options = await getCatalogOptions();
    res.status(200).json({
      ok: true,
      ...options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

// Permite crear equipos nuevos desde el panel del capitan.
app.post('/api/teams', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({ ok: false, message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.' });
    return;
  }

  const name = getStringField(req.body, 'name');
  const competition = getStringField(req.body, 'competition');
  const captainUsername = getStringField(req.body, 'captainUsername');
  const image = getStringField(req.body, 'image') || undefined;

  if (!name || !competition || !captainUsername) {
    res.status(400).json({ ok: false, message: 'Nombre, competicion y capitan son obligatorios.' });
    return;
  }

  try {
    const team = await createTeam({ name, competition, captainUsername, image });
    res.status(201).json({ ok: true, team });
  } catch (error) {
    if (error instanceof DuplicateTeamError) {
      res.status(409).json({ ok: false, message: error.message });
      return;
    }

    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';
    res.status(500).json({ ok: false, message });
  }
});

// El administrador puede asignar manualmente un usuario a un equipo.
app.put('/api/users/:username/team', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({ ok: false, message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.' });
    return;
  }

  const username = req.params['username'];
  const teamName = getStringField(req.body, 'teamName');

  if (!username || !teamName) {
    res.status(400).json({ ok: false, message: 'Usuario y equipo son obligatorios.' });
    return;
  }

  try {
    const user = await assignUserToTeam({ username, teamName });

    if (!user) {
      res.status(404).json({ ok: false, message: 'Usuario no encontrado.' });
      return;
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';
    res.status(500).json({ ok: false, message });
  }
});

// Lista partidos y permite filtrarlos por arbitro o por equipo.
app.get('/api/matches', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  try {
    const matches = await listMatches({
      refereeUsername: getQueryString(req.query['refereeUsername']),
      teamName: getQueryString(req.query['teamName']),
    });

    res.status(200).json({
      ok: true,
      matches,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

// Crear partidos desde el panel de administrador.
app.post('/api/matches', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  const payload = getMatchPayload(req.body);

  if (!payload) {
    res.status(400).json({
      ok: false,
      message: 'Faltan datos obligatorios del partido.',
    });
    return;
  }

  try {
    const match = await createMatch(payload);
    res.status(201).json({
      ok: true,
      match,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

// Editar partidos ya existentes.
app.put('/api/matches/:id', async (req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  const payload = getMatchPayload(req.body);

  if (!payload) {
    res.status(400).json({
      ok: false,
      message: 'Faltan datos obligatorios del partido.',
    });
    return;
  }

  try {
    const match = await updateMatch(req.params['id'], payload);

    if (!match) {
      res.status(404).json({
        ok: false,
        message: 'Partido no encontrado.',
      });
      return;
    }

    res.status(200).json({
      ok: true,
      match,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

// Se deja login por GET para ajustarse al enunciado del proyecto.
app.get('/api/auth/login', async (req, res) => {
  await handleLoginRequest(
    getQueryString(req.query['username']) ?? '',
    getQueryString(req.query['password']) ?? '',
    res,
  );
});

// Y tambien por POST para mantener una forma mas tipica de enviar credenciales.
app.post('/api/auth/login', async (req, res) => {
  await handleLoginRequest(getStringField(req.body, 'username'), getStringField(req.body, 'password'), res);
});

// Sirve para comprobar rapido si MongoDB esta configurado y responde.
app.get('/api/health', async (_req, res) => {
  if (!isMongoConfigured()) {
    res.status(200).json({
      ok: true,
      mongoConfigured: false,
      mongoConnected: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  try {
    await pingMongo();
    res.status(200).json({
      ok: true,
      mongoConfigured: true,
      mongoConnected: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      mongoConfigured: true,
      mongoConnected: false,
      message,
    });
  }
});

// Si Mongo no esta listo, devolvemos los datos semilla para que la app no se quede vacia.
app.get('/api/liga-data', async (_req, res) => {
  if (!isMongoConfigured()) {
    res.status(200).json({
      source: 'seed',
      data: LIGA_SEED_DATA,
    });
    return;
  }

  try {
    const db = await getDatabase();
    const data = await getLigaDataFromDatabase(db);

    res.status(200).json({
      source: 'mongo',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      source: 'mongo',
      message,
    });
  }
});

// Carga en Mongo los datos semilla del proyecto.
app.post('/api/admin/seed', async (_req, res) => {
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  try {
    const db = await getDatabase();
    await seedLigaData(db);

    res.status(200).json({
      ok: true,
      message: 'Database seeded successfully.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

function getStringField(body: unknown, field: string): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    field in body &&
    typeof body[field as keyof typeof body] === 'string'
  ) {
    return body[field as keyof typeof body] as string;
  }

  return '';
}

function isValidUserType(value: string): value is (typeof ALLOWED_USER_TYPES)[number] {
  return ALLOWED_USER_TYPES.includes(value as (typeof ALLOWED_USER_TYPES)[number]);
}

function getQueryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getMatchPayload(body: unknown) {
  const sport = getStringField(body, 'sport');
  const localTeam = getStringField(body, 'localTeam');
  const awayTeam = getStringField(body, 'awayTeam');
  const competition = getStringField(body, 'competition');
  const round = getStringField(body, 'round');
  const date = getStringField(body, 'date');
  const status = getStringField(body, 'status');

  if (!sport || !localTeam || !awayTeam || !competition || !round || !date || !isValidMatchStatus(status)) {
    return null;
  }

  // Reunimos aqui todos los datos necesarios para crear o editar un partido.
  return {
    sport,
    localTeam,
    awayTeam,
    competition,
    round,
    date,
    refereeUsername: getStringField(body, 'refereeUsername') || undefined,
    venue: getStringField(body, 'venue') || undefined,
    score: getStringField(body, 'score') || undefined,
    status,
  };
}

function isValidMatchStatus(value: string): value is 'scheduled' | 'finished' | 'postponed' {
  return value === 'scheduled' || value === 'finished' || value === 'postponed';
}

async function handleLoginRequest(
  username: string,
  password: string,
  res: express.Response,
): Promise<void> {
  // La logica del login se comparte entre GET y POST para no duplicar codigo.
  if (!isMongoConfigured()) {
    res.status(400).json({
      ok: false,
      message: 'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB_NAME.',
    });
    return;
  }

  if (!username || !password) {
    res.status(400).json({
      ok: false,
      message: 'Usuario y contrasena son obligatorios.',
    });
    return;
  }

  try {
    const user = await loginUser({ username, password });

    if (!user) {
      res.status(401).json({
        ok: false,
        message: 'Credenciales invalidas.',
      });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Login correcto.',
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB error';

    res.status(500).json({
      ok: false,
      message,
    });
  }
}
