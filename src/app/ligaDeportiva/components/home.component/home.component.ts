// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NoticiasComponent } from '../noticias.component/noticias.component';
import { LigaDataService } from '../../services/liga-data.service';

// La home muestra un resumen rapido de la liga y algunos resultados destacados.
@Component({
  selector: 'app-home.component',
  imports: [NoticiasComponent, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly ligaDataService = inject(LigaDataService);

  // Recuperamos los resultados destacados desde el servicio comun de datos.
  protected readonly featuredResults = this.ligaDataService.getFeaturedResults();
}
