// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { Player } from '../models/liga.models';
import { LocalLeagueStoreService } from './local-league-store.service';

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

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de JugadorService.
export class JugadorService {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly localStore = inject(LocalLeagueStoreService);

  // separo esta accion en un metodo para que el componente quede mas claro.
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

  // separo esta accion en un metodo para que el componente quede mas claro.
  async listManagedPlayers(): Promise<ManagedPlayer[]> {
    return this.localStore.listManagedPlayers();
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async listClubOptions(): Promise<ClubOption[]> {
    return this.localStore.listClubOptions();
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async createPlayer(payload: PlayerPayload): Promise<ManagedPlayer> {
    return this.localStore.createPlayer(payload);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async updatePlayer(id: number, payload: PlayerPayload): Promise<ManagedPlayer> {
    return this.localStore.updatePlayer(id, payload);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async deletePlayer(id: number): Promise<void> {
    this.localStore.deletePlayer(id);
  }
}

