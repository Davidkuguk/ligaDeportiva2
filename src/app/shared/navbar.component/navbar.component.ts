// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

import { SESSION_CHANGED_EVENT, SessionService, UserSession } from '../../ligaDeportiva/services/session.service';

// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'navbar',
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de NavbarComponent.
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  // Esta variable controla si el menu hamburguesa esta abierto o cerrado en movil.
  // esta variable controla informacion que se muestra en la plantilla.
  protected isMenuOpen = false;
  protected session: UserSession | null = null;

  private readonly refreshSession = (): void => {
    this.session = this.sessionService.getSession();
    this.changeDetectorRef.markForCheck();
  };

  ngOnInit(): void {
    this.refreshSession();
    globalThis.addEventListener?.(SESSION_CHANGED_EVENT, this.refreshSession);
    globalThis.addEventListener?.('storage', this.refreshSession);
  }

  ngOnDestroy(): void {
    globalThis.removeEventListener?.(SESSION_CHANGED_EVENT, this.refreshSession);
    globalThis.removeEventListener?.('storage', this.refreshSession);
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected closeMenu(): void {
    this.isMenuOpen = false;
  }

  protected get dashboardRoute(): string {
    switch (this.session?.tipo) {
      case 'admin':
        return '/panel-admin';
      case 'arbitro':
        return '/panel-arbitro';
      case 'capitan':
        return '/panel-capitan';
      default:
        return '/panel-usuario';
    }
  }

  protected async logout(): Promise<void> {
    this.sessionService.clearSession();
    this.closeMenu();
    await this.router.navigateByUrl('/home');
  }
}

