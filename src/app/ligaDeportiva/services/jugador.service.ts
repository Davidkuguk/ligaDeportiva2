// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Player } from '../models/liga.models';
import { environment } from '../../../environments/environment';
import { SessionService } from './session.service';

// esta interfaz marca la forma que tienen los datos de ManagedPlayer.
export interface ManagedPlayer {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  clubId: number;
  clubNombre: string;
  categoria: string;
}

// esta interfaz marca la forma que tienen los datos de PlayerPayload.
export interface PlayerPayload {
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
}

// esta interfaz marca la forma que tienen los datos de ClubOption.
export interface ClubOption {
  id: number;
  nombre: string;
  categoria: string;
}

interface LaravelClub {
  id: number;
  nombre: string;
  categoria: string;
}

interface LaravelJugador {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
  club?: LaravelClub;
}

interface LaravelResponse<T> {
  data: T;
}

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de JugadorService.
export class JugadorService {
  private readonly http = inject(HttpClient);
  private readonly sessionService = inject(SessionService);

  // separo esta accion en un metodo para que el componente quede mas claro.
  async listPlayers(): Promise<Player[]> {
    const jugadores = await this.listManagedPlayers();

    return jugadores.map((jugador) => ({
      name: jugador.nombre,
      nickname: 'Sin apodo',
      number: jugador.dorsal,
      position: jugador.posicion,
      team: jugador.clubNombre,
      competition: jugador.categoria,
      stats: [],
    }));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async listManagedPlayers(): Promise<ManagedPlayer[]> {
    const response = await firstValueFrom(
      this.http.get<LaravelResponse<LaravelJugador[]>>(`${environment.apiUrl}/jugadores`),
    );

    return response.data.map((jugador) => this.toManagedPlayer(jugador));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async listClubOptions(): Promise<ClubOption[]> {
    const response = await firstValueFrom(
      this.http.get<LaravelResponse<LaravelClub[]>>(`${environment.apiUrl}/clubs`),
    );

    return response.data.map((club) => ({
      id: club.id,
      nombre: club.nombre,
      categoria: club.categoria,
    }));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async createPlayer(payload: PlayerPayload): Promise<ManagedPlayer> {
    const response = await firstValueFrom(
      this.http.post<LaravelResponse<LaravelJugador>>(`${environment.apiUrl}/jugadores`, payload, {
        headers: this.getAuthHeaders(),
      }),
    );

    return this.toManagedPlayer(response.data);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async updatePlayer(id: number, payload: PlayerPayload): Promise<ManagedPlayer> {
    const response = await firstValueFrom(
      this.http.put<LaravelResponse<LaravelJugador>>(`${environment.apiUrl}/jugadores/${id}`, payload, {
        headers: this.getAuthHeaders(),
      }),
    );

    return this.toManagedPlayer(response.data);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async deletePlayer(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/jugadores/${id}`, {
        headers: this.getAuthHeaders(),
      }),
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.sessionService.getSession()?.token;

    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private toManagedPlayer(jugador: LaravelJugador): ManagedPlayer {
    return {
      id: jugador.id,
      nombre: jugador.nombre,
      posicion: jugador.posicion,
      dorsal: jugador.dorsal,
      clubId: jugador.club_id,
      clubNombre: jugador.club?.nombre ?? 'Sin club',
      categoria: jugador.club?.categoria ?? 'Sin categoria',
    };
  }
}

