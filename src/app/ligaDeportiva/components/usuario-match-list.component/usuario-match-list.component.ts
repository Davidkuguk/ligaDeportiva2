import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ManagedMatch } from '../../services/match-management.service';

// Lista reutilizable para mostrar los partidos del usuario o de su equipo.
@Component({
  selector: 'app-usuario-match-list',
  imports: [CommonModule],
  templateUrl: './usuario-match-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioMatchListComponent {
  @Input({ required: true }) matches: ManagedMatch[] = [];
  @Input() teamName = '';
}
