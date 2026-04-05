import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Componente que enseña los ultimos resultados de competicion.
@Component({
  selector: 'app-resultado.component',
  imports: [],
  templateUrl: './resultado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly results = this.ligaDataService.getFeaturedResults();
}
