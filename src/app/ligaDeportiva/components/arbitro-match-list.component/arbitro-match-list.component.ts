import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ManagedMatch } from '../../services/match-management.service';

// Lista de partidos asignados al arbitro autenticado.
@Component({
  selector: 'app-arbitro-match-list',
  imports: [CommonModule],
  templateUrl: './arbitro-match-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArbitroMatchListComponent {
  @Input({ required: true }) matches: ManagedMatch[] = [];
}
