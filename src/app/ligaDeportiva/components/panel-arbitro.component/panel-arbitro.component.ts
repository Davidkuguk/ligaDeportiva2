// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ArbitroMatchListComponent } from '../arbitro-match-list.component/arbitro-match-list.component';
import { ArbitroResumenComponent } from '../arbitro-resumen.component/arbitro-resumen.component';
import { ManagedMatch, MatchManagementService } from '../../services/match-management.service';
import { SessionService } from '../../services/session.service';

// Panel privado del arbitro, donde solo ve los partidos asignados a su usuario.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-panel-arbitro',
  imports: [CommonModule, ArbitroResumenComponent, ArbitroMatchListComponent],
  templateUrl: './panel-arbitro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de PanelArbitroComponent.
export class PanelArbitroComponent implements OnInit {
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
  protected matches: ManagedMatch[] = [];

  // al iniciar el componente cargo los datos que necesita la pantalla.
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

