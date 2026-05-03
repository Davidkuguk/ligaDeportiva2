// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ManagedMatch } from '../../services/match-management.service';

// Lista reutilizable para mostrar los partidos del usuario o de su equipo.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-usuario-match-list',
  imports: [CommonModule],
  templateUrl: './usuario-match-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de UsuarioMatchListComponent.
export class UsuarioMatchListComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) matches: ManagedMatch[] = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() teamName = '';
}

