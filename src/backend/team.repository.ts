import { MongoServerError } from 'mongodb';

import { Team } from '../app/ligaDeportiva/models/liga.models';
import { getTeamsCollection, getUsersCollection, UserDocument } from './mongo.service';

export interface CreateTeamInput {
  name: string;
  competition: string;
  image?: string;
  captainUsername: string;
}

export interface TeamSummary {
  name: string;
  competition: string;
  captain: string;
}

export interface AssignUserTeamInput {
  username: string;
  teamName: string;
}

export interface UserSummary {
  username: string;
  firstName: string;
  lastName: string;
  tipo: UserDocument['tipo'];
  teamName?: string;
}

export class DuplicateTeamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateTeamError';
  }
}

export async function createTeam(input: CreateTeamInput): Promise<TeamSummary> {
  const [teamsCollection, usersCollection] = await Promise.all([getTeamsCollection(), getUsersCollection()]);
  const captainUser = await usersCollection.findOne({ username: input.captainUsername.trim().toLowerCase() });

  if (!captainUser) {
    throw new Error('Capitan no encontrado.');
  }

  const teamDocument: Team = {
    name: input.name.trim(),
    competition: input.competition.trim(),
    captain: `${captainUser.firstName} ${captainUser.lastName}`.trim(),
    image: input.image?.trim() || '/img/duelo.avif',
    players: [],
  };

  try {
    await teamsCollection.insertOne(teamDocument);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new DuplicateTeamError('El equipo ya existe.');
    }

    throw error;
  }

  await usersCollection.updateOne(
    { username: captainUser.username },
    { $set: { teamName: teamDocument.name, updatedAt: new Date().toISOString() } },
  );

  return {
    name: teamDocument.name,
    competition: teamDocument.competition,
    captain: teamDocument.captain,
  };
}

export async function assignUserToTeam(input: AssignUserTeamInput): Promise<UserSummary | null> {
  const usersCollection = await getUsersCollection();
  const result = await usersCollection.findOneAndUpdate(
    { username: input.username.trim().toLowerCase() },
    { $set: { teamName: input.teamName.trim(), updatedAt: new Date().toISOString() } },
    {
      returnDocument: 'after',
      projection: {
        _id: 0,
        username: 1,
        firstName: 1,
        lastName: 1,
        tipo: 1,
        teamName: 1,
      },
    },
  );

  return result;
}

export async function listUsers(): Promise<UserSummary[]> {
  const usersCollection = await getUsersCollection();
  return usersCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          username: 1,
          firstName: 1,
          lastName: 1,
          tipo: 1,
          teamName: 1,
        },
      },
    )
    .sort({ username: 1 })
    .toArray();
}
