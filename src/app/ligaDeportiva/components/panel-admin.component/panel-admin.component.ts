// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminPlayerFormComponent } from '../admin-player-form.component/admin-player-form.component';
import { AdminPlayerListComponent } from '../admin-player-list.component/admin-player-list.component';
import { AdminMatchFormComponent } from '../admin-match-form.component/admin-match-form.component';
import { AdminMatchListComponent } from '../admin-match-list.component/admin-match-list.component';
import { AdminResumenComponent } from '../admin-resumen.component/admin-resumen.component';
import { AdminUserTeamFormComponent } from '../admin-user-team-form.component/admin-user-team-form.component';
import { ClubOption, JugadorService, ManagedPlayer, PlayerPayload } from '../../services/jugador.service';
import { ManagedMatch, MatchManagementService, MatchPayload } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

// Este panel reune las operaciones del administrador sobre partidos y usuarios.
@Component({
  selector: 'app-panel-admin',
  imports: [
    CommonModule,
    AdminResumenComponent,
    AdminMatchFormComponent,
    AdminMatchListComponent,
    AdminUserTeamFormComponent,
    AdminPlayerFormComponent,
    AdminPlayerListComponent,
  ],
  templateUrl: './panel-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAdminComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly jugadorService = inject(JugadorService);
  private readonly matchManagementService = inject(MatchManagementService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected username = '';
  protected matches: ManagedMatch[] = [];
  protected players: ManagedPlayer[] = [];
  protected clubs: ClubOption[] = [];
  protected teams: string[] = [];
  protected referees: Array<{ username: string; name: string }> = [];
  protected users: Array<{ username: string; name: string; tipo: string; teamName?: string }> = [];
  protected selectedMatch: ManagedMatch | null = null;
  protected selectedPlayer: ManagedPlayer | null = null;
  protected isSaving = false;
  protected isAssigningTeam = false;
  protected isSavingPlayer = false;
  protected deletingPlayerId: number | null = null;
  protected errorMessage = '';

  async ngOnInit(): Promise<void> {
    const session = this.sessionService.getSession();

    // Solo el administrador puede entrar aqui.
    if (!session || session.tipo !== 'admin') {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.username = session.username;
    await this.loadData();
  }

  protected selectMatch(match: ManagedMatch): void {
    // Guardamos el partido pulsado para pasar el formulario a modo edicion.
    this.selectedMatch = match;
  }

  protected clearSelection(): void {
    // Volvemos al modo crear partido.
    this.selectedMatch = null;
  }

  protected selectPlayer(player: ManagedPlayer): void {
    // Guardamos el jugador elegido para editarlo en el formulario.
    this.selectedPlayer = player;
  }

  protected clearPlayerSelection(): void {
    // Con esto quitamos la seleccion y el formulario vuelve a modo alta.
    this.selectedPlayer = null;
  }

  protected async saveMatch(payload: MatchPayload): Promise<void> {
    this.isSaving = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
      // Si hay partido seleccionado, estamos editando. Si no, estamos creando uno nuevo.
      if (this.selectedMatch) {
        await this.matchManagementService.updateMatch(this.selectedMatch.id, payload);
      } else {
        await this.matchManagementService.createMatch(payload);
      }

      this.selectedMatch = null;
      await this.loadMatches();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isSaving = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  protected async assignUserTeam(payload: { username: string; teamName: string }): Promise<void> {
    this.isAssigningTeam = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
      await this.matchManagementService.assignUserTeam(payload.username, payload.teamName);
      await this.loadData();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isAssigningTeam = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  protected async savePlayer(payload: PlayerPayload): Promise<void> {
    this.isSavingPlayer = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
      // Reutilizamos el mismo formulario para crear o actualizar segun haya seleccion previa.
      if (this.selectedPlayer) {
        await this.jugadorService.updatePlayer(this.selectedPlayer.id, payload);
      } else {
        await this.jugadorService.createPlayer(payload);
      }

      this.selectedPlayer = null;
      await this.loadPlayers();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.isSavingPlayer = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  protected async deletePlayer(player: ManagedPlayer): Promise<void> {
    // Guardamos el id para poder desactivar solo el boton del jugador que se esta borrando.
    this.deletingPlayerId = player.id;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
      await this.jugadorService.deletePlayer(player.id);

      if (this.selectedPlayer?.id === player.id) {
        this.selectedPlayer = null;
      }

      await this.loadPlayers();
    } catch (error) {
      this.errorMessage = getErrorMessage(error);
    } finally {
      this.deletingPlayerId = null;
      this.changeDetectorRef.markForCheck();
    }
  }

  private async loadData(): Promise<void> {
    // Cargamos en paralelo toda la informacion necesaria para el panel.
    const [catalog, matchesResponse, players, clubs] = await Promise.all([
      this.matchManagementService.getCatalogOptions(),
      this.matchManagementService.listMatches(),
      this.jugadorService.listManagedPlayers().catch(() => []),
      this.jugadorService.listClubOptions().catch(() => []),
    ]);

    this.teams = catalog.teams;
    this.referees = catalog.referees;
    this.users = catalog.users;
    this.matches = matchesResponse.matches;
    this.players = players;
    this.clubs = clubs;
    this.changeDetectorRef.markForCheck();
  }

  private async loadMatches(): Promise<void> {
    this.matches = (await this.matchManagementService.listMatches()).matches;
    this.changeDetectorRef.markForCheck();
  }

  private async loadPlayers(): Promise<void> {
    this.players = await this.jugadorService.listManagedPlayers();
    this.changeDetectorRef.markForCheck();
  }
}

function getErrorMessage(error: unknown): string {
  // Intentamos leer el mensaje detallado para ensenarlo tal cual en la interfaz.
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

  // Mensaje generico de respaldo cuando no llega detalle.
  return 'No se pudo guardar el partido.';
}
