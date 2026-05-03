// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Cabecera resumen del panel de arbitro.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-arbitro-resumen',
  imports: [],
  templateUrl: './arbitro-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de ArbitroResumenComponent.
export class ArbitroResumenComponent {
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) firstName = '';
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) totalMatches = 0;
}

