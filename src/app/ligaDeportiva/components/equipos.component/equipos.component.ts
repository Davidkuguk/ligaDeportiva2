// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Vista publica para mostrar los equipos disponibles.
@Component({
  selector: 'app-equipos.component',
  imports: [],
  templateUrl: './equipos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquiposComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly teams = this.ligaDataService.getTeams();
}
