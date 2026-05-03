// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Injectable } from '@angular/core';

import { LIGA_SEED_DATA, LigaSeedData } from '../data/liga.seed';

// Servicio basico para servir los datos semilla en las vistas publicas.
@Injectable({ providedIn: 'root' })
export class LigaDataService {
  getLigaData(): LigaSeedData {
    return LIGA_SEED_DATA;
  }

  getNews() {
    return this.getLigaData().news;
  }

  getFeaturedResults() {
    return this.getLigaData().results;
  }

  getTeams() {
    return this.getLigaData().teams;
  }

  getStandings() {
    return this.getLigaData().standings;
  }

  getPlayers() {
    return this.getLigaData().players;
  }

  getReferees() {
    return this.getLigaData().referees;
  }
}
