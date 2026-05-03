// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { LocalLeagueStoreService } from './local-league-store.service';

// esta interfaz marca la forma que tienen los datos de RegisterPayload.
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  tipo: 'admin' | 'normal' | 'arbitro' | 'jugador' | 'capitan' | 'entrenador' | 'aficionado';
  teamName?: string;
}

// esta interfaz marca la forma que tienen los datos de LoginPayload.
export interface LoginPayload {
  username: string;
  password: string;
}

// esta interfaz marca la forma que tienen los datos de RegisterResponse.
export interface RegisterResponse {
  ok: boolean;
  message: string;
  user: {
    username: string;
    tipo: RegisterPayload['tipo'];
    createdAt: string;
  };
}

// esta interfaz marca la forma que tienen los datos de LoginResponse.
export interface LoginResponse {
  ok: boolean;
  message: string;
  user: {
    username: string;
    firstName: string;
    tipo: RegisterPayload['tipo'];
    teamName?: string;
  };
}

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de AuthService.
export class AuthService {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly localStore = inject(LocalLeagueStoreService);

  // separo esta accion en un metodo para que el componente quede mas claro.
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const user = this.localStore.registerUser(payload);

    return {
      ok: true,
      message: 'Usuario creado correctamente.',
      user: {
        username: user.username,
        tipo: user.tipo,
        createdAt: user.createdAt,
      },
    };
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const user = this.localStore.loginUser(payload.username, payload.password);

    return {
      ok: true,
      message: 'Sesion iniciada correctamente.',
      user: {
        username: user.username,
        firstName: user.firstName,
        tipo: user.tipo,
        teamName: user.teamName,
      },
    };
  }
}

