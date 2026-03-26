import { Injectable } from '@angular/core';

import { LoginResponse } from './auth.service';

const SESSION_STORAGE_KEY = 'liga.session';

export type UserSession = LoginResponse['user'];

@Injectable({ providedIn: 'root' })
export class SessionService {
  getSession(): UserSession | null {
    const raw = globalThis.localStorage?.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  setSession(session: UserSession): void {
    globalThis.localStorage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  updateSessionTeam(teamName: string): void {
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
    globalThis.localStorage?.removeItem(SESSION_STORAGE_KEY);
  }
}
