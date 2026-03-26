import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

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
