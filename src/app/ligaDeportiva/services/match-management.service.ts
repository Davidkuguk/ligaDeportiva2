import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { RegisterPayload } from './auth.service';

// Este servicio agrupa todas las llamadas HTTP relacionadas con partidos, equipos y catalogos.
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
  private readonly http = inject(HttpClient);

  getCatalogOptions(): Promise<CatalogOptionsResponse> {
    return firstValueFrom(this.http.get<CatalogOptionsResponse>('/api/catalog/options'));
  }

  listMatches(filter: { refereeUsername?: string; teamName?: string } = {}): Promise<MatchesResponse> {
    // Construimos la query solo con los filtros que realmente se hayan indicado.
    const query = new URLSearchParams();

    if (filter.refereeUsername) {
      query.set('refereeUsername', filter.refereeUsername);
    }

    if (filter.teamName) {
      query.set('teamName', filter.teamName);
    }

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return firstValueFrom(this.http.get<MatchesResponse>(`/api/matches${suffix}`));
  }

  createMatch(payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return firstValueFrom(this.http.post<{ ok: boolean; match: ManagedMatch }>('/api/matches', payload));
  }

  updateMatch(id: string, payload: MatchPayload): Promise<{ ok: boolean; match: ManagedMatch }> {
    return firstValueFrom(this.http.put<{ ok: boolean; match: ManagedMatch }>(`/api/matches/${id}`, payload));
  }

  createTeam(payload: TeamPayload): Promise<{ ok: boolean; team: { name: string; competition: string; captain: string } }> {
    return firstValueFrom(this.http.post<{ ok: boolean; team: { name: string; competition: string; captain: string } }>('/api/teams', payload));
  }

  assignUserTeam(username: string, teamName: string): Promise<{ ok: boolean; user: CatalogOptionsResponse['users'][number] }> {
    return firstValueFrom(
      this.http.put<{ ok: boolean; user: CatalogOptionsResponse['users'][number] }>(`/api/users/${username}/team`, {
        teamName,
      }),
    );
  }
}
