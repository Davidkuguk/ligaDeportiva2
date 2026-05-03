// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ManagedPlayer } from '../../services/jugador.service';

// Este componente solo pinta la tabla y avisa al padre cuando se pulsa editar o borrar.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-admin-player-list',
  imports: [CommonModule],
  templateUrl: './admin-player-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de AdminPlayerListComponent.
export class AdminPlayerListComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) players: ManagedPlayer[] = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() selectedPlayerId: number | null = null;
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() deletingPlayerId: number | null = null;

  // Emitimos el jugador completo para que el panel admin tenga toda la informacion.
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() editPlayer = new EventEmitter<ManagedPlayer>();
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() deletePlayer = new EventEmitter<ManagedPlayer>();
}

