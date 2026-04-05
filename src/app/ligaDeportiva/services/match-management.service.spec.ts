import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MatchManagementService } from './match-management.service';

describe('MatchManagementService', () => {
  let service: MatchManagementService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MatchManagementService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('requests catalog options from the expected endpoint', async () => {
    const promise = service.getCatalogOptions();
    const request = httpController.expectOne('/api/catalog/options');

    expect(request.request.method).toBe('GET');

    request.flush({
      ok: true,
      teams: ['Azules', 'Titanes'],
      referees: [{ username: 'celia', name: 'Celia Mena' }],
      users: [{ username: 'ruben', name: 'Ruben Vidal', tipo: 'capitan', teamName: 'Azules' }],
    });

    const response = await promise;

    expect(response.ok).toBeTrue();
    expect(response.teams).toEqual(['Azules', 'Titanes']);
  });

  it('builds query params only for the provided list filter values', async () => {
    const promise = service.listMatches({
      refereeUsername: 'celia',
      teamName: 'Azules',
    });

    const request = httpController.expectOne('/api/matches?refereeUsername=celia&teamName=Azules');

    expect(request.request.method).toBe('GET');

    request.flush({
      ok: true,
      matches: [
        {
          id: 'match-1',
          sport: 'Futbol sala',
          localTeam: 'Azules',
          awayTeam: 'Titanes',
          competition: 'Liga Principal',
          round: 'Jornada 8',
          date: '2026-04-10',
          refereeUsername: 'celia',
          refereeName: 'Celia Mena',
          status: 'scheduled',
        },
      ],
    });

    const response = await promise;

    expect(response.matches.length).toBe(1);
    expect(response.matches[0].localTeam).toBe('Azules');
    expect(response.matches[0].refereeUsername).toBe('celia');
  });

  it('omits the query string when no filters are provided', async () => {
    const promise = service.listMatches();
    const request = httpController.expectOne('/api/matches');

    expect(request.request.method).toBe('GET');

    request.flush({ ok: true, matches: [] });

    const response = await promise;

    expect(response).toEqual({
      ok: true,
      matches: [],
    });
  });

  it('sends team creation payloads to the team management endpoint', async () => {
    const promise = service.createTeam({
      name: 'Halcones',
      competition: 'Liga Principal',
      captainUsername: 'iker',
      image: '/img/halcones.avif',
    });

    const request = httpController.expectOne('/api/teams');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Halcones',
      competition: 'Liga Principal',
      captainUsername: 'iker',
      image: '/img/halcones.avif',
    });

    request.flush({
      ok: true,
      team: {
        name: 'Halcones',
        competition: 'Liga Principal',
        captain: 'iker',
      },
    });

    const response = await promise;

    expect(response.ok).toBeTrue();
    expect(response.team.name).toBe('Halcones');
  });
});
