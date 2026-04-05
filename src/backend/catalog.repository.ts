import { getTeamsCollection, getUsersCollection } from './mongo.service';

// Este repositorio devuelve datos auxiliares para rellenar selects y listados del frontend.
export interface CatalogOptions {
  teams: string[];
  referees: Array<{ username: string; name: string }>;
  users: Array<{ username: string; name: string; tipo: string; teamName?: string }>;
}

export async function getCatalogOptions(): Promise<CatalogOptions> {
  const [teamsCollection, usersCollection] = await Promise.all([
    getTeamsCollection(),
    getUsersCollection(),
  ]);

  const [teams, referees, users] = await Promise.all([
    teamsCollection.find({}, { projection: { _id: 0, name: 1 } }).sort({ name: 1 }).toArray(),
    usersCollection
      .find({ tipo: 'arbitro' }, { projection: { _id: 0, username: 1, firstName: 1, lastName: 1 } })
      .sort({ username: 1 })
      .toArray(),
    usersCollection
      .find({}, { projection: { _id: 0, username: 1, firstName: 1, lastName: 1, tipo: 1, teamName: 1 } })
      .sort({ username: 1 })
      .toArray(),
  ]);

  return {
    teams: teams.map((team) => team.name),
    referees: referees.map((referee) => ({
      username: referee.username,
      name: `${referee.firstName} ${referee.lastName}`.trim(),
    })),
    users: users.map((user) => ({
      username: user.username,
      name: `${user.firstName} ${user.lastName}`.trim(),
      tipo: user.tipo,
      teamName: user.teamName,
    })),
  };
}
