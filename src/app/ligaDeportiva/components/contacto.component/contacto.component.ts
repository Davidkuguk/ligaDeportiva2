// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Componente visual del formulario de contacto de la web.
@Component({
  selector: 'app-contacto.component',
  imports: [],
  templateUrl: './contacto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoComponent { }
