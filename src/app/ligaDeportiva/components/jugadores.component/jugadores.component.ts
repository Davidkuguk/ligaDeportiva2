import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LigaDataService } from '../../services/liga-data.service';

@Component({
  selector: 'app-jugadores.component',
  imports: [],
  templateUrl: './jugadores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JugadoresComponent {
  private readonly ligaDataService = inject(LigaDataService);

  protected readonly players = this.ligaDataService.getPlayers();
}
