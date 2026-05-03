// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Aqui se pintan las clasificaciones generales de la liga.
@Component({
  selector: 'app-clasificaciones.component',
  imports: [],
  templateUrl: './clasificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionesComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly standings = this.ligaDataService.getStandings();
}
