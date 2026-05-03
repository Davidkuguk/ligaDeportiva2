// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable } from '@angular/core';

import { LIGA_SEED_DATA, LigaSeedData } from '../data/liga.seed';

// Servicio basico para servir los datos semilla en las vistas publicas.
// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable({ providedIn: 'root' })
// esta clase contiene la logica principal de LigaDataService.
export class LigaDataService {
  // separo esta accion en un metodo para que el componente quede mas claro.
  getLigaData(): LigaSeedData {
    return LIGA_SEED_DATA;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getNews() {
    return this.getLigaData().news;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getFeaturedResults() {
    return this.getLigaData().results;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getTeams() {
    return this.getLigaData().teams;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getStandings() {
    return this.getLigaData().standings;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getPlayers() {
    return this.getLigaData().players;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  getReferees() {
    return this.getLigaData().referees;
  }
}

