// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Vista publica para mostrar arbitros y sus datos basicos.
@Component({
  selector: 'app-arbitros.component',
  imports: [],
  templateUrl: './arbitros.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArbitrosComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly referees = this.ligaDataService.getReferees();
}
