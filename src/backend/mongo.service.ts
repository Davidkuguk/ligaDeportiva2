import { Collection, Db, Document, MongoServerError } from 'mongodb';

import {
  MatchResult,
  NewsItem,
  Player,
  Referee,
  Standing,
  Team,
} from '../app/ligaDeportiva/models/liga.models';
import { getDatabase } from './mongo';

export interface UserDocument {
  firstName: string;
  lastName: string;
  username: string;
  passwordHash: string;
  email?: string;
  tipo: 'admin' | 'normal' | 'arbitro' | 'jugador' | 'capitan' | 'entrenador' | 'aficionado';
  teamName?: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface MatchDocument {
  sport: string;
  localTeam: string;
  awayTeam: string;
  competition: string;
  round: string;
  date: string;
  refereeUsername?: string;
  refereeName?: string;
  status: 'scheduled' | 'finished' | 'postponed';
  venue?: string;
  score?: string;
}

export type MongoCollections = {
  users: UserDocument;
  teams: Team;
  matches: MatchDocument;
  results: MatchResult;
  standings: Standing;
  players: Player;
  referees: Referee;
  news: NewsItem;
};

export type MongoCollectionName = keyof MongoCollections;

const COLLECTION_NAMES: Record<MongoCollectionName, string> = {
  users: 'usuarios',
  teams: 'teams',
  matches: 'matches',
  results: 'results',
  standings: 'standings',
  players: 'players',
  referees: 'referees',
  news: 'news',
};

const MONGO_COLLECTION_NAMES: MongoCollectionName[] = [
  'users',
  'teams',
  'matches',
  'results',
  'standings',
  'players',
  'referees',
  'news',
];

export async function getMongoServiceDatabase(): Promise<Db> {
  return getDatabase();
}

export async function getMongoCollection<K extends MongoCollectionName>(
  name: K,
): Promise<Collection<MongoCollections[K]>> {
  const db = await getMongoServiceDatabase();
  return db.collection<MongoCollections[K]>(COLLECTION_NAMES[name]);
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  return getMongoCollection('users');
}

export async function getTeamsCollection(): Promise<Collection<Team>> {
  return getMongoCollection('teams');
}

export async function getMatchesCollection(): Promise<Collection<MatchDocument>> {
  return getMongoCollection('matches');
}

export async function getResultsCollection(): Promise<Collection<MatchResult>> {
  return getMongoCollection('results');
}

export async function getStandingsCollection(): Promise<Collection<Standing>> {
  return getMongoCollection('standings');
}

export async function getPlayersCollection(): Promise<Collection<Player>> {
  return getMongoCollection('players');
}

export async function getRefereesCollection(): Promise<Collection<Referee>> {
  return getMongoCollection('referees');
}

export async function getNewsCollection(): Promise<Collection<NewsItem>> {
  return getMongoCollection('news');
}

export async function ensureMongoCollections(): Promise<void> {
  const db = await getMongoServiceDatabase();
  const existingCollections = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name),
  );

  for (const collectionName of MONGO_COLLECTION_NAMES) {
    const mongoCollectionName = COLLECTION_NAMES[collectionName];

    if (!existingCollections.has(mongoCollectionName)) {
      await db.createCollection(mongoCollectionName);
    }
  }

  await db.collection(COLLECTION_NAMES.users).updateMany({ email: null }, { $unset: { email: '' } });
  await db.collection(COLLECTION_NAMES.users).updateMany({ teamName: null }, { $unset: { teamName: '' } });
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, role: 'admin' },
    { $set: { tipo: 'admin' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, userType: 'arbitro' },
    { $set: { tipo: 'arbitro' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, userType: 'jugador' },
    { $set: { tipo: 'jugador' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, userType: 'capitan' },
    { $set: { tipo: 'capitan' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, userType: 'entrenador' },
    { $set: { tipo: 'entrenador' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false }, userType: 'aficionado' },
    { $set: { tipo: 'aficionado' } },
  );
  await db.collection(COLLECTION_NAMES.users).updateMany(
    { tipo: { $exists: false } },
    { $set: { tipo: 'normal' }, $unset: { userType: '' } },
  );

  await Promise.all([
    ensureIndex(
      db.collection<UserDocument>(COLLECTION_NAMES.users),
      { username: 1 },
      { unique: true, name: 'uniq_username' },
    ),
    ensureIndex(
      db.collection<UserDocument>(COLLECTION_NAMES.users),
      { email: 1 },
      { unique: true, sparse: true, name: 'uniq_email_sparse' },
    ),
    ensureIndex(db.collection<Team>(COLLECTION_NAMES.teams), { name: 1 }, { unique: true, name: 'uniq_team_name' }),
    ensureIndex(
      db.collection<MatchDocument>(COLLECTION_NAMES.matches),
      { competition: 1, date: 1 },
      { name: 'idx_matches_competition_date' },
    ),
    ensureIndex(
      db.collection<MatchDocument>(COLLECTION_NAMES.matches),
      { refereeUsername: 1, date: 1 },
      { name: 'idx_matches_referee_date' },
    ),
    ensureIndex(
      db.collection<MatchDocument>(COLLECTION_NAMES.matches),
      { localTeam: 1, awayTeam: 1, date: 1 },
      { name: 'idx_matches_teams_date' },
    ),
    ensureIndex(
      db.collection<MatchResult>(COLLECTION_NAMES.results),
      { competition: 1, date: 1 },
      { name: 'idx_results_competition_date' },
    ),
    ensureIndex(
      db.collection<Standing>(COLLECTION_NAMES.standings),
      { competition: 1, position: 1 },
      { name: 'idx_standings_competition_position' },
    ),
    ensureIndex(
      db.collection<Player>(COLLECTION_NAMES.players),
      { team: 1, name: 1 },
      { name: 'idx_players_team_name' },
    ),
    ensureIndex(
      db.collection<Referee>(COLLECTION_NAMES.referees),
      { competition: 1, name: 1 },
      { name: 'idx_referees_competition_name' },
    ),
    ensureIndex(db.collection<NewsItem>(COLLECTION_NAMES.news), { id: 1 }, { unique: true, name: 'uniq_news_id' }),
  ]);
}

async function ensureIndex<TSchema extends Document>(
  collection: Collection<TSchema>,
  keys: Parameters<Collection<TSchema>['createIndex']>[0],
  options: Parameters<Collection<TSchema>['createIndex']>[1],
): Promise<void> {
  try {
    await collection.createIndex(keys, options);
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      typeof error.message === 'string' &&
      (error.message.includes('already exists with a different name') ||
        error.message.includes('equivalent index already exists'))
    ) {
      return;
    }

    throw error;
  }
}
