// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { Player } from '../models/liga.models';
import { LocalLeagueStoreService } from './local-league-store.service';

export interface ManagedPlayer {
  id: number;
  nombre: string;
  posicion: string;
  dorsal: number;
  clubId: number;
  clubNombre: string;
  categoria: string;
}

export interface PlayerPayload {
  nombre: string;
  posicion: string;
  dorsal: number;
  club_id: number;
}

export interface ClubOption {
  id: number;
  nombre: string;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class JugadorService {
  private readonly localStore = inject(LocalLeagueStoreService);

  async listPlayers(): Promise<Player[]> {
    return this.localStore.listManagedPlayers().map((jugador) => ({
      name: jugador.nombre,
      nickname: 'Sin apodo',
      number: jugador.dorsal,
      position: jugador.posicion,
      team: jugador.clubNombre,
      competition: jugador.categoria,
      stats: [],
    }));
  }

  async listManagedPlayers(): Promise<ManagedPlayer[]> {
    return this.localStore.listManagedPlayers();
  }

  async listClubOptions(): Promise<ClubOption[]> {
    return this.localStore.listClubOptions();
  }

  async createPlayer(payload: PlayerPayload): Promise<ManagedPlayer> {
    return this.localStore.createPlayer(payload);
  }

  async updatePlayer(id: number, payload: PlayerPayload): Promise<ManagedPlayer> {
    return this.localStore.updatePlayer(id, payload);
  }

  async deletePlayer(id: number): Promise<void> {
    this.localStore.deletePlayer(id);
  }
}
