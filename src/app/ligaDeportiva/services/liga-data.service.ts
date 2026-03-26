import { Injectable } from '@angular/core';

import { LIGA_SEED_DATA, LigaSeedData } from '../data/liga.seed';

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
