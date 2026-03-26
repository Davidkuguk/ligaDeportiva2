import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminMatchFormComponent } from '../admin-match-form.component/admin-match-form.component';
import { AdminMatchListComponent } from '../admin-match-list.component/admin-match-list.component';
import { AdminResumenComponent } from '../admin-resumen.component/admin-resumen.component';
import { AdminUserTeamFormComponent } from '../admin-user-team-form.component/admin-user-team-form.component';
import { ManagedMatch, MatchManagementService, MatchPayload } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-panel-admin',
  imports: [
    CommonModule,
    AdminResumenComponent,
    AdminMatchFormComponent,
    AdminMatchListComponent,
    AdminUserTeamFormComponent,
  ],
  templateUrl: './panel-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAdminComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly matchManagementService = inject(MatchManagementService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected username = '';
  protected matches: ManagedMatch[] = [];
  protected teams: string[] = [];
  protected referees: Array<{ username: string; name: string }> = [];
  protected users: Array<{ username: string; name: string; tipo: string; teamName?: string }> = [];
  protected selectedMatch: ManagedMatch | null = null;
  protected isSaving = false;
  protected isAssigningTeam = false;
  protected errorMessage = '';

  async ngOnInit(): Promise<void> {
    const session = this.sessionService.getSession();

    if (!session || session.tipo !== 'admin') {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.username = session.username;
    await this.loadData();
  }

  protected selectMatch(match: ManagedMatch): void {
    this.selectedMatch = match;
  }

  protected clearSelection(): void {
    this.selectedMatch = null;
  }

  protected async saveMatch(payload: MatchPayload): Promise<void> {
    this.isSaving = true;
    this.errorMessage = '';
    this.changeDetectorRef.markForCheck();

    try {
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

  private async loadData(): Promise<void> {
    const [catalog, matchesResponse] = await Promise.all([
      this.matchManagementService.getCatalogOptions(),
      this.matchManagementService.listMatches(),
    ]);

    this.teams = catalog.teams;
    this.referees = catalog.referees;
    this.users = catalog.users;
    this.matches = matchesResponse.matches;
    this.changeDetectorRef.markForCheck();
  }

  private async loadMatches(): Promise<void> {
    this.matches = (await this.matchManagementService.listMatches()).matches;
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

  return 'No se pudo guardar el partido.';
}
