// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable } from '@angular/core';

import type { LoginResponse } from './auth.service';

// Esta constante se usa para guardar la sesion general del usuario.
// dejo esta constante separada para no escribir el mismo valor varias veces.
const SESSION_STORAGE_KEY = 'liga.session';

export type UserSession = LoginResponse['user'];

// Servicio sencillo para guardar la sesion del usuario en localStorage.
// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de SessionService.
export class SessionService {
  // separo esta accion en un metodo para que el componente quede mas claro.
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

  // separo esta accion en un metodo para que el componente quede mas claro.
  setSession(session: UserSession): void {
    // Guardamos la sesion convertida a JSON para poder recuperarla despues.
    globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
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

  // separo esta accion en un metodo para que el componente quede mas claro.
  clearSession(): void {
    // Al cerrar sesion borramos la informacion guardada.
    globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
  }

}

