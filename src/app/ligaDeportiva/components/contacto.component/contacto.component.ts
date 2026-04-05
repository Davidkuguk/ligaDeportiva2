import { ChangeDetectionStrategy, Component } from '@angular/core';

// Componente visual del formulario de contacto de la web.
@Component({
  selector: 'app-contacto.component',
  imports: [],
  templateUrl: './contacto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactoComponent { }
