// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable } from '@angular/core';

import { LIGA_SEED_DATA } from '../data/liga.seed';
import type { RegisterPayload } from './auth.service';
import type { ClubOption, ManagedPlayer, PlayerPayload } from './jugador.service';
import type { ManagedMatch, MatchPayload, TeamPayload } from './match-management.service';

// esta interfaz interna me ayuda a ordenar los datos de StoredUser.
interface StoredUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  tipo: RegisterPayload['tipo'];
  teamName?: string;
  createdAt: string;
}

// esta interfaz interna me ayuda a ordenar los datos de StoredTeam.
interface StoredTeam {
  name: string;
  competition: string;
  captain: string;
  image: string;
  players: string[];
}

// dejo esta constante separada para no escribir el mismo valor varias veces.
const USERS_KEY = 'liga.local.users';
// dejo esta constante separada para no escribir el mismo valor varias veces.
const TEAMS_KEY = 'liga.local.teams';
// dejo esta constante separada para no escribir el mismo valor varias veces.
const MATCHES_KEY = 'liga.local.matches';
// dejo esta constante separada para no escribir el mismo valor varias veces.
const PLAYERS_KEY = 'liga.local.players';

const DEFAULT_USERS: StoredUser[] = [
  {
    firstName: 'Admin',
    lastName: 'Liga',
    username: 'admin',
    password: 'admin',
    tipo: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    firstName: 'Celia',
    lastName: 'Mena',
    username: 'celia',
    password: '1234',
    tipo: 'arbitro',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    firstName: 'Ruben',
    lastName: 'Vidal',
    username: 'ruben',
    password: '1234',
    tipo: 'capitan',
    teamName: 'Azules',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de LocalLeagueStoreService.
export class LocalLeagueStoreService {
  // separo esta accion en un metodo para que el componente quede mas claro.
  registerUser(payload: RegisterPayload): StoredUser {
    const users = this.getUsers();
    const username = payload.username.trim();

    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Ya existe un usuario con ese nombre.');
    }

    const user: StoredUser = {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      username,
      password: payload.password,
      tipo: payload.tipo,
      teamName: payload.teamName,
      createdAt: new Date().toISOString(),
    };

    this.setUsers([...users, user]);
    return user;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  loginUser(username: string, password: string): StoredUser {
    const user = this
      .getUsers()
      .find((candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase());

    if (!user || user.password !== password) {
      throw new Error('Usuario o contrasena incorrectos.');
    }

    return user;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  listUsers(): Array<{ username: string; name: string; tipo: string; teamName?: string }> {
    return this.getUsers().map((user) => ({
      username: user.username,
      name: `${user.firstName} ${user.lastName}`.trim(),
      tipo: user.tipo,
      teamName: user.teamName,
    }));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  assignUserTeam(username: string, teamName: string) {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex === -1) {
      throw new Error('Usuario no encontrado.');
    }

    users[userIndex] = { ...users[userIndex], teamName };
    this.setUsers(users);

    return {
      username: users[userIndex].username,
      name: `${users[userIndex].firstName} ${users[userIndex].lastName}`.trim(),
      tipo: users[userIndex].tipo,
      teamName: users[userIndex].teamName,
    };
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  listTeams(): StoredTeam[] {
    return this.read<StoredTeam[]>(TEAMS_KEY, LIGA_SEED_DATA.teams);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  createTeam(payload: TeamPayload) {
    const teams = this.listTeams();

    if (teams.some((team) => team.name.toLowerCase() === payload.name.trim().toLowerCase())) {
      throw new Error('Ya existe un equipo con ese nombre.');
    }

    const captain = this.assignUserTeam(payload.captainUsername, payload.name);
    const team: StoredTeam = {
      name: payload.name.trim(),
      competition: payload.competition.trim(),
      captain: captain.name,
      image: payload.image || '/img/deportes.avif',
      players: [],
    };

    this.write(TEAMS_KEY, [...teams, team]);
    return team;
  }

  listMatches(filter: { refereeUsername?: string; teamName?: string } = {}): ManagedMatch[] {
    return this.getMatches().filter((match) => {
      const matchesReferee = !filter.refereeUsername || match.refereeUsername === filter.refereeUsername;
      const matchesTeam =
        !filter.teamName || match.localTeam === filter.teamName || match.awayTeam === filter.teamName;

      return matchesReferee && matchesTeam;
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  createMatch(payload: MatchPayload): ManagedMatch {
    const matches = this.getMatches();
    const match = this.buildMatch(String(Date.now()), payload);

    this.write(MATCHES_KEY, [...matches, match]);
    return match;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  updateMatch(id: string, payload: MatchPayload): ManagedMatch {
    const matches = this.getMatches();
    const matchIndex = matches.findIndex((match) => match.id === id);

    if (matchIndex === -1) {
      throw new Error('Partido no encontrado.');
    }

    const match = this.buildMatch(id, payload);
    matches[matchIndex] = match;
    this.write(MATCHES_KEY, matches);
    return match;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  listClubOptions(): ClubOption[] {
    return this.listTeams().map((team, index) => ({
      id: index + 1,
      nombre: team.name,
      categoria: team.competition,
    }));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  listManagedPlayers(): ManagedPlayer[] {
    return this.read<ManagedPlayer[]>(PLAYERS_KEY, this.getSeedManagedPlayers());
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  createPlayer(payload: PlayerPayload): ManagedPlayer {
    const players = this.listManagedPlayers();
    const player = this.buildManagedPlayer(this.getNextPlayerId(players), payload);

    this.write(PLAYERS_KEY, [...players, player]);
    return player;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  updatePlayer(id: number, payload: PlayerPayload): ManagedPlayer {
    const players = this.listManagedPlayers();
    const playerIndex = players.findIndex((player) => player.id === id);

    if (playerIndex === -1) {
      throw new Error('Jugador no encontrado.');
    }

    const player = this.buildManagedPlayer(id, payload);
    players[playerIndex] = player;
    this.write(PLAYERS_KEY, players);
    return player;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  deletePlayer(id: number): void {
    this.write(
      PLAYERS_KEY,
      this.listManagedPlayers().filter((player) => player.id !== id),
    );
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private getUsers(): StoredUser[] {
    return this.read<StoredUser[]>(USERS_KEY, DEFAULT_USERS);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private setUsers(users: StoredUser[]): void {
    this.write(USERS_KEY, users);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private getMatches(): ManagedMatch[] {
    return this.read<ManagedMatch[]>(MATCHES_KEY, this.getSeedMatches());
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private buildMatch(id: string, payload: MatchPayload): ManagedMatch {
    const referee = this.listUsers().find((user) => user.username === payload.refereeUsername);

    return {
      id,
      sport: payload.sport,
      localTeam: payload.localTeam,
      awayTeam: payload.awayTeam,
      competition: payload.competition,
      round: payload.round,
      date: payload.date,
      refereeUsername: payload.refereeUsername,
      refereeName: referee?.name,
      status: payload.status,
      venue: payload.venue,
      score: payload.score,
    };
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private buildManagedPlayer(id: number, payload: PlayerPayload): ManagedPlayer {
    const club = this.listClubOptions().find((option) => option.id === payload.club_id);

    return {
      id,
      nombre: payload.nombre,
      posicion: payload.posicion,
      dorsal: payload.dorsal,
      clubId: payload.club_id,
      clubNombre: club?.nombre ?? 'Sin club',
      categoria: club?.categoria ?? 'Sin categoria',
    };
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private getSeedMatches(): ManagedMatch[] {
    return LIGA_SEED_DATA.results.map((result, index) => ({
      id: String(index + 1),
      sport: 'Futbol',
      localTeam: result.localTeam,
      awayTeam: result.awayTeam,
      competition: result.competition,
      round: result.round,
      date: result.date,
      refereeUsername: index === 0 ? 'celia' : undefined,
      refereeName: index === 0 ? 'Celia Mena' : undefined,
      status: 'finished',
      score: result.score,
    }));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private getSeedManagedPlayers(): ManagedPlayer[] {
    const clubs = this.listClubOptions();

    return LIGA_SEED_DATA.players.map((player, index) => {
      const club = clubs.find((option) => option.nombre === player.team);

      return {
        id: index + 1,
        nombre: player.name,
        posicion: player.position,
        dorsal: player.number,
        clubId: club?.id ?? 0,
        clubNombre: player.team,
        categoria: player.competition,
      };
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private getNextPlayerId(players: ManagedPlayer[]): number {
    return players.reduce((highest, player) => Math.max(highest, player.id), 0) + 1;
  }

  private read<T>(key: string, fallback: T): T {
    const raw = globalThis.localStorage?.getItem(key);

    if (!raw) {
      return structuredClone(fallback);
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      globalThis.localStorage?.removeItem(key);
      return structuredClone(fallback);
    }
  }

  private write<T>(key: string, value: T): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  }
}

