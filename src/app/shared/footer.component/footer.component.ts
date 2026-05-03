// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Componente visual del pie de pagina compartido por toda la aplicacion.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de FooterComponent.
export class FooterComponent { }

