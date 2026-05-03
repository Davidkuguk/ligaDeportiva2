// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { Player } from '../../models/liga.models';
import { JugadorService } from '../../services/jugador.service';
import { LigaDataService } from '../../services/liga-data.service';

// Vista publica con la lista de jugadores destacados.
@Component({
  selector: 'app-jugadores.component',
  imports: [],
  templateUrl: './jugadores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JugadoresComponent implements OnInit {
  private readonly jugadorService = inject(JugadorService);
  private readonly ligaDataService = inject(LigaDataService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  // Mostramos datos locales para no depender de servicios externos.
  protected players: Player[] = this.ligaDataService.getPlayers();

  async ngOnInit(): Promise<void> {
    this.players = await this.jugadorService.listPlayers();
    this.changeDetectorRef.markForCheck();
  }
}
