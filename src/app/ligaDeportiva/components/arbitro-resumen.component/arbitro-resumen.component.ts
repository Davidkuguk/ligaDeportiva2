import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// Cabecera resumen del panel de arbitro.
@Component({
  selector: 'app-arbitro-resumen',
  imports: [],
  templateUrl: './arbitro-resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArbitroResumenComponent {
  @Input({ required: true }) firstName = '';
  @Input({ required: true }) totalMatches = 0;
}
