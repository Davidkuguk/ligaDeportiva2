// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Componente que enseÃ±a los ultimos resultados de competicion.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-resultado.component',
  imports: [],
  templateUrl: './resultado.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de ResultadoComponent.
export class ResultadoComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly results = this.ligaDataService.getFeaturedResults();
}

