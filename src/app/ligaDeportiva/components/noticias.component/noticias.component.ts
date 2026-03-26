import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LigaDataService } from '../../services/liga-data.service';

@Component({
  selector: 'app-noticias',
  imports: [RouterLink],
  templateUrl: './noticias.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticiasComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly news = this.ligaDataService.getNews();
  protected readonly featuredArticle = this.news[0];
}
