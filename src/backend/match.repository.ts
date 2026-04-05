import { ObjectId } from 'mongodb';

import { getMatchesCollection, getUsersCollection, MatchDocument, UserDocument } from './mongo.service';

// Repositorio para consultar, crear y editar partidos en MongoDB.
export interface MatchView extends MatchDocument {
  id: string;
}

export interface MatchFilter {
  refereeUsername?: string;
  teamName?: string;
}

export interface MatchPayload {
  sport: string;
  localTeam: string;
  awayTeam: string;
  competition: string;
  round: string;
  date: string;
  refereeUsername?: string;
  venue?: string;
  score?: string;
  status: MatchDocument['status'];
}

export async function listMatches(filter: MatchFilter = {}): Promise<MatchView[]> {
  const matchesCollection = await getMatchesCollection();
  const query: Record<string, unknown> = {};

  // El arbitro filtra por su usuario y el usuario/capitan por el nombre del equipo.
  if (filter.refereeUsername) {
    query['refereeUsername'] = filter.refereeUsername.toLowerCase();
  }

  if (filter.teamName) {
    query['$or'] = [{ localTeam: filter.teamName }, { awayTeam: filter.teamName }];
  }

  const matches = await matchesCollection.find(query).sort({ date: 1 }).toArray();
  return matches.map(mapMatchDocument);
}

export async function createMatch(payload: MatchPayload): Promise<MatchView> {
  const matchesCollection = await getMatchesCollection();
  const referee = await resolveReferee(payload.refereeUsername);

  // Guardamos tambien el nombre del arbitro para simplificar la lectura desde frontend.
  const document: MatchDocument = {
    sport: payload.sport.trim(),
    localTeam: payload.localTeam.trim(),
    awayTeam: payload.awayTeam.trim(),
    competition: payload.competition.trim(),
    round: payload.round.trim(),
    date: payload.date,
    refereeUsername: referee?.username,
    refereeName: referee ? `${referee.firstName} ${referee.lastName}`.trim() : undefined,
    status: payload.status,
    venue: payload.venue?.trim() || undefined,
    score: payload.score?.trim() || undefined,
  };

  const result = await matchesCollection.insertOne(document);
  return {
    id: result.insertedId.toString(),
    ...document,
  };
}

export async function updateMatch(id: string, payload: MatchPayload): Promise<MatchView | null> {
  const matchesCollection = await getMatchesCollection();
  const referee = await resolveReferee(payload.refereeUsername);

  const updateDocument: Partial<MatchDocument> = {
    sport: payload.sport.trim(),
    localTeam: payload.localTeam.trim(),
    awayTeam: payload.awayTeam.trim(),
    competition: payload.competition.trim(),
    round: payload.round.trim(),
    date: payload.date,
    refereeUsername: referee?.username,
    refereeName: referee ? `${referee.firstName} ${referee.lastName}`.trim() : undefined,
    status: payload.status,
    venue: payload.venue?.trim() || undefined,
    score: payload.score?.trim() || undefined,
  };

  const result = await matchesCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateDocument },
    { returnDocument: 'after' },
  );

  return result ? mapMatchDocument(result) : null;
}

async function resolveReferee(refereeUsername?: string): Promise<UserDocument | null> {
  // Solo aceptamos usuarios que realmente sean arbitros.
  if (!refereeUsername) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({
    username: refereeUsername.trim().toLowerCase(),
    tipo: 'arbitro',
  });
}

function mapMatchDocument(document: MatchDocument & { _id: ObjectId }): MatchView {
  // Convertimos el ObjectId de Mongo a string para manejarlo mejor en Angular.
  return {
    id: document._id.toString(),
    sport: document.sport,
    localTeam: document.localTeam,
    awayTeam: document.awayTeam,
    competition: document.competition,
    round: document.round,
    date: document.date,
    refereeUsername: document.refereeUsername,
    refereeName: document.refereeName,
    status: document.status,
    venue: document.venue,
    score: document.score,
  };
}
