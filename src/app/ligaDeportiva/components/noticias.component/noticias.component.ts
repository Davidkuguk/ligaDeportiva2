import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LigaDataService } from '../../services/liga-data.service';

// Componente encargado de pintar las noticias de portada.
@Component({
  selector: 'app-noticias',
  imports: [RouterLink],
  templateUrl: './noticias.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticiasComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly news = this.ligaDataService.getNews();
  // La primera noticia se usa como articulo principal.
  protected readonly featuredArticle = this.news[0];
}
