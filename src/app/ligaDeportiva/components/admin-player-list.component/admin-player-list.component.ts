import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ManagedPlayer } from '../../services/jugador-api.service';

// Este componente solo pinta la tabla y avisa al padre cuando se pulsa editar o borrar.
@Component({
  selector: 'app-admin-player-list',
  imports: [CommonModule],
  templateUrl: './admin-player-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlayerListComponent {
  @Input({ required: true }) players: ManagedPlayer[] = [];
  @Input() selectedPlayerId: number | null = null;
  @Input() deletingPlayerId: number | null = null;

  // Emitimos el jugador completo para que el panel admin tenga toda la informacion.
  @Output() editPlayer = new EventEmitter<ManagedPlayer>();
  @Output() deletePlayer = new EventEmitter<ManagedPlayer>();
}
