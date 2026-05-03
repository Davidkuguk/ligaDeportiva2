// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';

import { LIGA_SEED_DATA } from '../data/liga.seed';
import { LigaDataService } from './liga-data.service';

describe('LigaDataService', () => {
  let service: LigaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigaDataService);
  });

  it('returns the shared seed object as the league data source', () => {
    expect(service.getLigaData()).toBe(LIGA_SEED_DATA);
  });

  it('returns the featured players exactly as defined in the seed', () => {
    expect(service.getPlayers()).toEqual(LIGA_SEED_DATA.players);
    expect(service.getPlayers().length).toBe(3);
    expect(service.getPlayers()[0]).toEqual(jasmine.objectContaining({
      name: 'Antoni Ruiz',
      team: 'Azules',
      number: 9,
    }));
  });

  it('exposes the rest of the public catalog blocks without reshaping them', () => {
    expect(service.getNews()).toEqual(LIGA_SEED_DATA.news);
    expect(service.getFeaturedResults()).toEqual(LIGA_SEED_DATA.results);
    expect(service.getTeams()).toEqual(LIGA_SEED_DATA.teams);
    expect(service.getStandings()).toEqual(LIGA_SEED_DATA.standings);
    expect(service.getReferees()).toEqual(LIGA_SEED_DATA.referees);
  });
});
