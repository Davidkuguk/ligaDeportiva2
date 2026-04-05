import { Injectable } from '@angular/core';

import { LoginResponse } from './auth.service';

// Esta constante se usa para guardar la sesion general del usuario.
const SESSION_STORAGE_KEY = 'liga.session';
// Esta segunda clave guarda la clave demo del administrador para las operaciones protegidas.
const DEMO_ADMIN_KEY_STORAGE_KEY = 'liga.demo_admin_key';

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

  getDemoAdminKey(): string {
    // Si no hay clave guardada devolvemos cadena vacia para no romper la cabecera.
    return globalThis.localStorage?.getItem(DEMO_ADMIN_KEY_STORAGE_KEY) ?? '';
  }

  setDemoAdminKey(key: string): void {
    // Quitamos espacios al principio y al final para evitar errores tontos al copiar la clave.
    const trimmedKey = key.trim();

    if (!trimmedKey) {
      // Si se deja vacio, interpretamos que hay que borrar la clave guardada.
      globalThis.localStorage?.removeItem(DEMO_ADMIN_KEY_STORAGE_KEY);
      return;
    }

    // Guardamos la clave ya limpia para reutilizarla en el panel admin.
    globalThis.localStorage?.setItem(DEMO_ADMIN_KEY_STORAGE_KEY, trimmedKey);
  }
}
