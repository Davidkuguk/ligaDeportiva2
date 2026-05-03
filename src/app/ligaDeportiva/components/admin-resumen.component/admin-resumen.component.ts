// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Resumen rapido del panel de administrador.
@Component({
  selector: 'app-admin-resumen',
  imports: [],
  templateUrl: './admin-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminResumenComponent {
  @Input({ required: true }) username = '';
  @Input({ required: true }) totalMatches = 0;
}
