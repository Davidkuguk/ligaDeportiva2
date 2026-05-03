// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { Player } from '../../models/liga.models';
import { JugadorService } from '../../services/jugador.service';
import { LigaDataService } from '../../services/liga-data.service';

// Vista publica con la lista de jugadores destacados.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-jugadores.component',
  imports: [],
  templateUrl: './jugadores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de JugadoresComponent.
export class JugadoresComponent implements OnInit {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly jugadorService = inject(JugadorService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly ligaDataService = inject(LigaDataService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  // Mostramos datos iniciales mientras llega la respuesta de Laravel.
  // esta variable controla informacion que se muestra en la plantilla.
  protected players: Player[] = this.ligaDataService.getPlayers();

  // al iniciar el componente cargo los datos que necesita la pantalla.
  async ngOnInit(): Promise<void> {
    this.players = await this.jugadorService.listPlayers();
    this.changeDetectorRef.markForCheck();
  }
}

