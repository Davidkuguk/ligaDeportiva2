import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
