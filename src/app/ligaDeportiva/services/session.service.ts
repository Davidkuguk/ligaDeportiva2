// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable } from '@angular/core';

import { LoginResponse } from './auth.service';

// Esta constante se usa para guardar la sesion general del usuario.
const SESSION_STORAGE_KEY = 'liga.session';

export type UserSession = LoginResponse['user'];

// Servicio sencillo para guardar la sesion del usuario en localStorage.
@Injectable({ providedIn: 'root' })
export class SessionService {
  getSession(): UserSession | null {
    // Leemos la sesion guardada si existe.
    const raw = globalThis.localStorage?.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      // Si el JSON esta corrupto, lo limpiamos para evitar errores posteriores.
      globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  setSession(session: UserSession): void {
    // Guardamos la sesion convertida a JSON para poder recuperarla despues.
    globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  updateSessionTeam(teamName: string): void {
    // Recuperamos la sesion actual para actualizar solo el equipo asignado.
    const session = this.getSession();

    if (!session) {
      return;
    }

    this.setSession({
      ...session,
      teamName,
    });
  }

  clearSession(): void {
    // Al cerrar sesion borramos la informacion guardada.
    globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
  }

}
