// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

// Aqui se pintan las clasificaciones generales de la liga.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-clasificaciones.component',
  imports: [],
  templateUrl: './clasificaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de ClasificacionesComponent.
export class ClasificacionesComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly standings = this.ligaDataService.getStandings();
}

