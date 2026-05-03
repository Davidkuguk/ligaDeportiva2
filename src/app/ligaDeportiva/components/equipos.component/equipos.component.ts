// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Vista publica para mostrar los equipos disponibles.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-equipos.component',
  imports: [],
  templateUrl: './equipos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de EquiposComponent.
export class EquiposComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly teams = this.ligaDataService.getTeams();
}

