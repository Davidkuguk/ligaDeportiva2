// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LigaDataService } from '../../services/liga-data.service';

// Componente encargado de pintar las noticias de portada.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-noticias',
  imports: [RouterLink],
  templateUrl: './noticias.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de NoticiasComponent.
export class NoticiasComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly news = this.ligaDataService.getNews();
  // La primera noticia se usa como articulo principal.
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly featuredArticle = this.news[0];
}

