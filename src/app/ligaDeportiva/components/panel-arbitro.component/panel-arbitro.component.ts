// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ArbitroMatchListComponent } from '../arbitro-match-list.component/arbitro-match-list.component';
import { ArbitroResumenComponent } from '../arbitro-resumen.component/arbitro-resumen.component';
import { ManagedMatch, MatchManagementService } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

// Panel privado del arbitro, donde solo ve los partidos asignados a su usuario.
@Component({
  selector: 'app-panel-arbitro',
  imports: [CommonModule, ArbitroResumenComponent, ArbitroMatchListComponent],
  templateUrl: './panel-arbitro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelArbitroComponent implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly matchManagementService = inject(MatchManagementService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected firstName = '';
  protected matches: ManagedMatch[] = [];

  async ngOnInit(): Promise<void> {
    const session = this.sessionService.getSession();

    // Validamos que el usuario autenticado sea realmente arbitro.
    if (!session || session.tipo !== 'arbitro') {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.firstName = session.firstName;
    this.matches = (await this.matchManagementService.listMatches({
      refereeUsername: session.username,
    })).matches;
    this.changeDetectorRef.markForCheck();
  }
}
