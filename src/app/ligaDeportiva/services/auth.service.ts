// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';

import { LocalLeagueStoreService } from './local-league-store.service';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  tipo: 'admin' | 'normal' | 'arbitro' | 'jugador' | 'capitan' | 'entrenador' | 'aficionado';
  teamName?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterResponse {
  ok: boolean;
  message: string;
  user: {
    username: string;
    tipo: RegisterPayload['tipo'];
    createdAt: string;
  };
}

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly localStore = inject(LocalLeagueStoreService);

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
