// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Tarjeta resumen del panel de usuario con su nombre, equipo y numero de partidos.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-usuario-resumen',
  imports: [],
  templateUrl: './usuario-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de UsuarioResumenComponent.
export class UsuarioResumenComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) firstName = '';
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() teamName = '';
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) totalMatches = 0;
}

