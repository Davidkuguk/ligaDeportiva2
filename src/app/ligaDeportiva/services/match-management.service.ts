// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { LocalLeagueStoreService } from './local-league-store.service';

// esta interfaz marca la forma que tienen los datos de CatalogOptionsResponse.
export interface CatalogOptionsResponse {
  ok: boolean;
  teams: string[];
  referees: Array<{ username: string; name: string }>;
  users: Array<{ username: string; name: string; tipo: string; teamName?: string }>;
}

// esta interfaz marca la forma que tienen los datos de ManagedMatch.
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

// esta interfaz marca la forma que tienen los datos de MatchPayload.
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

// esta interfaz marca la forma que tienen los datos de MatchesResponse.
export interface MatchesResponse {
  ok: boolean;
  matches: ManagedMatch[];
}

// esta interfaz marca la forma que tienen los datos de TeamPayload.
export interface TeamPayload {
  name: string;
  competition: string;
  captainUsername: string;
  image?: string;
}

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de MatchManagementService.
export class MatchManagementService {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly localStore = inject(LocalLeagueStoreService);

  // separo esta accion en un metodo para que el componente quede mas claro.
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

  // separo esta accion en un metodo para que el componente quede mas claro.
  createMatch(payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return Promise.resolve({
      ok: true,
      match: this.localStore.createMatch(payload),
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  updateMatch(id: string, payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return Promise.resolve({
      ok: true,
      match: this.localStore.updateMatch(id, payload),
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  createTeam(payload: TeamPayload): Promise<{ ok: boolean; team: { name: string; competition: string; captain: string } }> {
    return Promise.resolve({
      ok: true,
      team: this.localStore.createTeam(payload),
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  assignUserTeam(username: string, teamName: string): Promise<{ ok: boolean; user: CatalogOptionsResponse['users'][number] }> {
    return Promise.resolve({
      ok: true,
      user: this.localStore.assignUserTeam(username, teamName),
    });
  }
}

