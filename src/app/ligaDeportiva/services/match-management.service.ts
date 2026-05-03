// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { LocalLeagueStoreService } from './local-league-store.service';

export interface CatalogOptionsResponse {
  ok: boolean;
  teams: string[];
  referees: Array<{ username: string; name: string }>;
  users: Array<{ username: string; name: string; tipo: string; teamName?: string }>;
}

export interface ManagedMatch {
  id: string;
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
  status: ManagedMatch['status'];
}

export interface MatchesResponse {
  ok: boolean;
  matches: ManagedMatch[];
}

export interface TeamPayload {
  name: string;
  competition: string;
  captainUsername: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class MatchManagementService {
  private readonly localStore = inject(LocalLeagueStoreService);

  getCatalogOptions(): Promise<CatalogOptionsResponse> {
    return Promise.resolve({
      ok: true,
      teams: this.localStore.listTeams().map((team) => team.name),
      referees: this.localStore
        .listUsers()
        .filter((user) => user.tipo === 'arbitro')
        .map((user) => ({ username: user.username, name: user.name })),
      users: this.localStore.listUsers(),
    });
  }

  listMatches(filter: { refereeUsername?: string; teamName?: string } = {}): Promise<MatchesResponse> {
    return Promise.resolve({
      ok: true,
      matches: this.localStore.listMatches(filter),
    });
  }

  createMatch(payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return Promise.resolve({
      ok: true,
      match: this.localStore.createMatch(payload),
    });
  }

  updateMatch(id: string, payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return Promise.resolve({
      ok: true,
      match: this.localStore.updateMatch(id, payload),
    });
  }

  createTeam(payload: TeamPayload): Promise<{ ok: boolean; team: { name: string; competition: string; captain: string } }> {
    return Promise.resolve({
      ok: true,
      team: this.localStore.createTeam(payload),
    });
  }

  assignUserTeam(username: string, teamName: string): Promise<{ ok: boolean; user: CatalogOptionsResponse['users'][number] }> {
    return Promise.resolve({
      ok: true,
      user: this.localStore.assignUserTeam(username, teamName),
    });
  }
}
