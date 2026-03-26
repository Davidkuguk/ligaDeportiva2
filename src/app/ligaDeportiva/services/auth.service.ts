import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  private readonly http = inject(HttpClient);

  register(payload: RegisterPayload): Promise<RegisterResponse> {
    return firstValueFrom(this.http.post<RegisterResponse>('/api/auth/register', payload));
  }

  login(payload: LoginPayload): Promise<LoginResponse> {
    return firstValueFrom(this.http.post<LoginResponse>('/api/auth/login', payload));
  }
}
