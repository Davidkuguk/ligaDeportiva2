import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';

import { Player } from '../../models/liga.models';
import { JugadorApiService } from '../../services/jugador-api.service';
import { LigaDataService } from '../../services/liga-data.service';

// Vista publica con la lista de jugadores destacados.
@Component({
  selector: 'app-jugadores.component',
  imports: [],
  templateUrl: './jugadores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JugadoresComponent implements OnInit {
  private readonly jugadorApiService = inject(JugadorApiService);
  private readonly ligaDataService = inject(LigaDataService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);

  // Mientras no llegue la API mostramos los jugadores semilla para no dejar la vista vacia.
  protected players: Player[] = this.ligaDataService.getPlayers();

  async ngOnInit(): Promise<void> {
    // Durante el prerender del servidor no llamamos a la API porque esa ruta no existe ahi.
    if (!isPlatformBrowser(this.platformId)) {
      this.players = this.ligaDataService.getPlayers();
      this.changeDetectorRef.markForCheck();
      return;
    }

    try {
      // Intentamos cargar la informacion real desde Laravel.
      this.players = await this.jugadorApiService.listPlayers();
    } catch {
      // Si la API falla, mantenemos los datos locales de apoyo para que la pagina siga funcionando.
      this.players = this.ligaDataService.getPlayers();
    } finally {
      // Como usamos OnPush, marcamos la vista para que Angular refresque el contenido.
      this.changeDetectorRef.markForCheck();
    }
  }
}
