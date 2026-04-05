import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Player } from '../models/liga.models';
import { SessionService } from './session.service';

// Este modelo representa al jugador tal y como lo gestionamos desde el panel admin.
export interface ManagedPlayer {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  clubId: number;
  clubNombre: string;
  categoria: string;
}

// Este payload es el cuerpo que enviamos al backend cuando creamos o editamos.
export interface PlayerPayload {
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
}

// Estructura simple para rellenar el selector de clubes del formulario.
export interface ClubOption {
  id: number;
  nombre: string;
  categoria: string;
}

// Respuesta tipica del endpoint de jugadores de Laravel.
interface JugadorApiResponse {
  data: JugadorApiItem[];
}

// Modelo intermedio de lo que puede devolver la API.
interface JugadorApiItem {
  id?: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id?: number;
  club?: {
    id?: number;
    nombre?: string;
    categoria?: string;
  } | null;
}

// Respuesta de la API para el listado de clubes.
interface ClubApiResponse {
  data: Array<{
    id: number;
    nombre: string;
    categoria: string;
  }>;
}

// Respuesta generica de crear o actualizar un jugador.
interface MutationResponse {
  message?: string;
  data: JugadorApiItem;
}

// Servicio HTTP del modulo de jugadores para consumir la API REST de Laravel.
@Injectable({ providedIn: 'root' })
export class JugadorApiService {
  private readonly http = inject(HttpClient);
  private readonly sessionService = inject(SessionService);

  async listPlayers(): Promise<Player[]> {
    // Pedimos el listado publico y lo adaptamos al modelo que ya usaba la vista.
    const response = await firstValueFrom(this.http.get<JugadorApiResponse>('/api/jugadores'));

    return response.data.map((jugador) => ({
      name: jugador.nombre,
      nickname: 'Sin apodo',
      number: jugador.dorsal,
      position: jugador.posicion,
      team: jugador.club?.nombre ?? 'Sin club',
      competition: jugador.club?.categoria ?? 'Competicion no indicada',
      stats: [],
    }));
  }

  async listManagedPlayers(): Promise<ManagedPlayer[]> {
    // Este metodo devuelve mas informacion porque el panel admin necesita ids y club real.
    const response = await firstValueFrom(this.http.get<JugadorApiResponse>('/api/jugadores'));

    return response.data.map((jugador) => ({
      id: jugador.id ?? 0,
      nombre: jugador.nombre,
      posicion: jugador.posicion,
      dorsal: jugador.dorsal,
      clubId: jugador.club_id ?? jugador.club?.id ?? 0,
      clubNombre: jugador.club?.nombre ?? 'Sin club',
      categoria: jugador.club?.categoria ?? 'Sin categoria',
    }));
  }

  async listClubOptions(): Promise<ClubOption[]> {
    // Cargamos los clubes para rellenar el select del formulario de jugadores.
    const response = await firstValueFrom(this.http.get<ClubApiResponse>('/api/clubs'));

    return response.data.map((club) => ({
      id: club.id,
      nombre: club.nombre,
      categoria: club.categoria,
    }));
  }

  async createPlayer(payload: PlayerPayload): Promise<ManagedPlayer> {
    // En las operaciones protegidas enviamos la cabecera demo si existe.
    const response = await firstValueFrom(
      this.http.post<MutationResponse>('/api/jugadores', payload, {
        headers: this.getAdminHeaders(),
      }),
    );

    return this.mapManagedPlayer(response.data);
  }

  async updatePlayer(id: number, payload: PlayerPayload): Promise<ManagedPlayer> {
    // Para actualizar indicamos el id del jugador dentro de la URL.
    const response = await firstValueFrom(
      this.http.put<MutationResponse>(`/api/jugadores/${id}`, payload, {
        headers: this.getAdminHeaders(),
      }),
    );

    return this.mapManagedPlayer(response.data);
  }

  async deletePlayer(id: number): Promise<void> {
    // El borrado no necesita devolver datos, solo comprobar que la peticion termina bien.
    await firstValueFrom(
      this.http.delete(`/api/jugadores/${id}`, {
        headers: this.getAdminHeaders(),
      }),
    );
  }

  private mapManagedPlayer(jugador: JugadorApiItem): ManagedPlayer {
    // Centralizamos el mapeo para no repetir la misma transformacion en varios sitios.
    return {
      id: jugador.id ?? 0,
      nombre: jugador.nombre,
      posicion: jugador.posicion,
      dorsal: jugador.dorsal,
      clubId: jugador.club_id ?? jugador.club?.id ?? 0,
      clubNombre: jugador.club?.nombre ?? 'Sin club',
      categoria: jugador.club?.categoria ?? 'Sin categoria',
    };
  }

  private getAdminHeaders(): Record<string, string> {
    // Recuperamos la clave guardada por el administrador en el navegador.
    const demoAdminKey = this.sessionService.getDemoAdminKey();

    // Si no hay clave devolvemos un objeto vacio y asi la peticion sigue siendo valida.
    return demoAdminKey ? { 'X-Demo-Admin-Key': demoAdminKey } : {};
  }
}
