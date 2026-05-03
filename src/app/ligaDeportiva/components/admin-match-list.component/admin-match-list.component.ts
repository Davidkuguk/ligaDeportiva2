// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ManagedMatch } from '../../services/match-management.service';

// Lista de partidos que el administrador puede seleccionar para editar.
@Component({
  selector: 'app-admin-match-list',
  imports: [CommonModule],
  templateUrl: './admin-match-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMatchListComponent {
  @Input({ required: true }) matches: ManagedMatch[] = [];
  @Input() selectedMatchId: string | null = null;
  @Output() editMatch = new EventEmitter<ManagedMatch>();
}
