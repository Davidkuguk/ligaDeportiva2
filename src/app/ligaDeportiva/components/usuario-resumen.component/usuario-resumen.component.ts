import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-usuario-resumen',
  imports: [],
  templateUrl: './usuario-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioResumenComponent {
  @Input({ required: true }) firstName = '';
  @Input() teamName = '';
  @Input({ required: true }) totalMatches = 0;
}
