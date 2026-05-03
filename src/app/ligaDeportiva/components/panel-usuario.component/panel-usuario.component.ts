// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CaptainTeamFormComponent } from '../captain-team-form.component/captain-team-form.component';
import { UsuarioMatchListComponent } from '../usuario-match-list.component/usuario-match-list.component';
import { UsuarioResumenComponent } from '../usuario-resumen.component/usuario-resumen.component';
import { ManagedMatch, MatchManagementService } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

// Panel general de usuario. Si el rol es capitan, aqui se habilita la creacion de equipo.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-panel-usuario',
  imports: [CommonModule, UsuarioResumenComponent, UsuarioMatchListComponent, CaptainTeamFormComponent],
  templateUrl: './panel-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de PanelUsuarioComponent.
export class PanelUsuarioComponent implements OnInit {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly sessionService = inject(SessionService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly matchManagementService = inject(MatchManagementService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly router = inject(Router);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  // esta variable controla informacion que se muestra en la plantilla.
  protected firstName = '';
  // esta variable controla informacion que se muestra en la plantilla.
  protected username = '';
  // esta variable controla informacion que se muestra en la plantilla.
  protected tipo = '';
  // esta variable controla informacion que se muestra en la plantilla.
  protected teamName = '';
  // esta variable controla informacion que se muestra en la plantilla.
  protected matches: ManagedMatch[] = [];
  // esta variable controla informacion que se muestra en la plantilla.
  protected isCreatingTeam = false;
  // esta variable controla informacion que se muestra en la plantilla.
  protected errorMessage = '';
  // esta variable controla informacion que se muestra en la plantilla.
  protected successMessage = '';

  // al iniciar el componente cargo los datos que necesita la pantalla.
  async ngOnInit(): Promise<void> {
    const session = this.sessionService.getSession();

    // Si no hay sesion, no dejamos entrar al panel.
    if (!session) {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.firstName = session.firstName;
    this.username = session.username;
    this.tipo = session.tipo;
    this.teamName = session.teamName ?? '';

    await this.loadMatches();
  }

  protected async createTeam(payload: { name: string; competition: string; captainUsername: string }): Promise<void> {
    this.isCreatingTeam = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
      // Al crear el equipo actualizamos tambien la sesion local.
      const response = await this.matchManagementService.createTeam(payload);
      this.teamName = response.team.name;
      this.sessionService.updateSessionTeam(response.team.name);
      this.successMessage = `Equipo ${response.team.name} creado correctamente.`;
      await this.loadMatches();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isCreatingTeam = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected canCreateTeam(): boolean {
    // Solo un capitan sin equipo creado ve este formulario.
    return this.tipo === 'capitan' && !this.teamName;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private async loadMatches(): Promise<void> {
    if (this.teamName) {
      this.matches = (await this.matchManagementService.listMatches({
        teamName: this.teamName,
      })).matches;
    } else {
      this.matches = [];
    }

    this.changeDetectorRef.markForCheck();
  }
}

// esta funcion auxiliar evita repetir la misma logica en varios sitios.
function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof error.error === 'object' &&
    error.error !== null &&
    'message' in error.error &&
    typeof error.error.message === 'string'
  ) {
    return error.error.message;
  }

  return 'No se pudo completar la operacion.';
}

