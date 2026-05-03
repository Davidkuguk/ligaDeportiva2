// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Resumen rapido del panel de administrador.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-admin-resumen',
  imports: [],
  templateUrl: './admin-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de AdminResumenComponent.
export class AdminResumenComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) username = '';
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) totalMatches = 0;
}

