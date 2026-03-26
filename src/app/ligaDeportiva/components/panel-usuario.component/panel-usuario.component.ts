import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CaptainTeamFormComponent } from '../captain-team-form.component/captain-team-form.component';
import { UsuarioMatchListComponent } from '../usuario-match-list.component/usuario-match-list.component';
import { UsuarioResumenComponent } from '../usuario-resumen.component/usuario-resumen.component';
import { ManagedMatch, MatchManagementService } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-panel-usuario',
  imports: [CommonModule, UsuarioResumenComponent, UsuarioMatchListComponent, CaptainTeamFormComponent],
  templateUrl: './panel-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelUsuarioComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly matchManagementService = inject(MatchManagementService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected firstName = '';
  protected username = '';
  protected tipo = '';
  protected teamName = '';
  protected matches: ManagedMatch[] = [];
  protected isCreatingTeam = false;
  protected errorMessage = '';
  protected successMessage = '';

  async ngOnInit(): Promise<void> {
    const session = this.sessionService.getSession();

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

  protected canCreateTeam(): boolean {
    return this.tipo === 'capitan' && !this.teamName;
  }

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
