// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Vista publica para mostrar arbitros y sus datos basicos.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-arbitros.component',
  imports: [],
  templateUrl: './arbitros.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de ArbitrosComponent.
export class ArbitrosComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly referees = this.ligaDataService.getReferees();
}

