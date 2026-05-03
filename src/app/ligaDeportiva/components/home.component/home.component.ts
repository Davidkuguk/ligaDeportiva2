// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NoticiasComponent } from '../noticias.component/noticias.component';
import { LigaDataService } from '../../services/liga-data.service';

// La home muestra un resumen rapido de la liga y algunos resultados destacados.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-home.component',
  imports: [NoticiasComponent, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de HomeComponent.
export class HomeComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // Recuperamos los resultados destacados desde el servicio comun de datos.
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly featuredResults = this.ligaDataService.getFeaturedResults();
}

