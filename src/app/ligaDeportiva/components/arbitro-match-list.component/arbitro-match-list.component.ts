// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ManagedMatch } from '../../services/match-management.service';

// Lista de partidos asignados al arbitro autenticado.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-arbitro-match-list',
  imports: [CommonModule],
  templateUrl: './arbitro-match-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de ArbitroMatchListComponent.
export class ArbitroMatchListComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) matches: ManagedMatch[] = [];
}

