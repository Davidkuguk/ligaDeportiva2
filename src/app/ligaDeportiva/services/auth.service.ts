// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

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
  token: string;
  user: {
    username: string;
    firstName: string;
      tipo: RegisterPayload['tipo'];
      teamName?: string;
      token?: string;
  };
}

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de AuthService.
export class AuthService {
  private readonly http = inject(HttpClient);

  // separo esta accion en un metodo para que el componente quede mas claro.
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return firstValueFrom(
      this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload),
    );
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload),
    );

    return {
      ...response,
      user: {
        ...response.user,
        token: response.token,
      },
    };
  }
}

