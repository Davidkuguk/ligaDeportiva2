import { ChangeDetectionStrategy, Component } from '@angular/core';

// Componente visual del pie de pagina compartido por toda la aplicacion.
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent { }
