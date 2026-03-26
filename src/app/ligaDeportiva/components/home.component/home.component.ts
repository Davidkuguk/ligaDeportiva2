import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NoticiasComponent } from '../noticias.component/noticias.component';
import { LigaDataService } from '../../services/liga-data.service';

@Component({
  selector: 'app-home.component',
  imports: [NoticiasComponent, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly featuredResults = this.ligaDataService.getFeaturedResults();
}
