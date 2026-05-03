// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JugadorService } from './jugador.service';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment';

// agrupo aqui las pruebas relacionadas con esta parte.
describe('JugadorService', () => {
  let service: JugadorService;
  let httpController: HttpTestingController;

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(JugadorService);
    httpController = TestBed.inject(HttpTestingController);
  });

  // limpio lo que se haya usado en la prueba para dejar todo controlado.
  afterEach(() => {
    localStorage.clear();
    httpController.verify();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('devuelve los jugadores iniciales adaptados al modelo de la vista publica', async () => {
    const playersPromise = service.listPlayers();

    const request = httpController.expectOne(`${environment.apiUrl}/jugadores`);
    request.flush({
      data: [
        {
          id: 1,
          nombre: 'Antoni Ruiz',
          posicion: 'Delantero',
          dorsal: 9,
          club_id: 1,
          club: {
            id: 1,
            nombre: 'Azules',
            categoria: 'Liga Principal',
          },
        },
      ],
    });

    const players = await playersPromise;

    expect(players.length).toBe(1);
    expect(players[0]).toEqual(
      jasmine.objectContaining({
        name: 'Antoni Ruiz',
        nickname: 'Sin apodo',
        number: 9,
        position: 'Delantero',
        team: 'Azules',
        competition: 'Liga Principal',
        stats: [],
      }),
    );
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('crea un jugador y lo mantiene en el listado gestionado', async () => {
    TestBed.inject(SessionService).setSession({
      username: 'admin',
      firstName: 'Admin',
      tipo: 'admin',
      token: 'token-admin',
    });

    const playerPromise = service.createPlayer({
      nombre: 'Marta Cano',
      posicion: 'Base',
      dorsal: 12,
      club_id: 1,
    });

    const request = httpController.expectOne(`${environment.apiUrl}/jugadores`);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-admin');
    request.flush({
      data: {
        id: 4,
        nombre: 'Marta Cano',
        posicion: 'Base',
        dorsal: 12,
        club_id: 1,
        club: {
          id: 1,
          nombre: 'Azules',
          categoria: 'Liga Principal',
        },
      },
    });

    const player = await playerPromise;

    expect(player).toEqual(
      jasmine.objectContaining({
        id: 4,
        nombre: 'Marta Cano',
        posicion: 'Base',
        dorsal: 12,
        clubNombre: 'Azules',
      }),
    );
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('actualiza y elimina un jugador existente', async () => {
    TestBed.inject(SessionService).setSession({
      username: 'admin',
      firstName: 'Admin',
      tipo: 'admin',
      token: 'token-admin',
    });

    const updatedPromise = service.updatePlayer(9, {
      nombre: 'Luis Marco',
      posicion: 'Defensa',
      dorsal: 4,
      club_id: 3,
    });

    const updateRequest = httpController.expectOne(`${environment.apiUrl}/jugadores/9`);
    expect(updateRequest.request.method).toBe('PUT');
    updateRequest.flush({
      data: {
        id: 9,
        nombre: 'Luis Marco',
        posicion: 'Defensa',
        dorsal: 4,
        club_id: 3,
        club: {
          id: 3,
          nombre: 'Monteverde',
          categoria: 'Liga Principal',
        },
      },
    });

    const updatedPlayer = await updatedPromise;

    const deletePromise = service.deletePlayer(9);
    const deleteRequest = httpController.expectOne(`${environment.apiUrl}/jugadores/9`);
    expect(deleteRequest.request.method).toBe('DELETE');
    expect(deleteRequest.request.headers.get('Authorization')).toBe('Bearer token-admin');
    deleteRequest.flush({ message: 'Jugador eliminado correctamente.' });

    await deletePromise;

    expect(updatedPlayer).toEqual(
      jasmine.objectContaining({
        id: 9,
        posicion: 'Defensa',
        dorsal: 4,
        clubNombre: 'Monteverde',
      }),
    );
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('lanza un error si se intenta actualizar un jugador que no existe', async () => {
    const updatePromise = service.updatePlayer(999, {
        nombre: 'Jugador Fantasma',
        posicion: 'Delantero',
        dorsal: 99,
        club_id: 1,
      });

    const request = httpController.expectOne(`${environment.apiUrl}/jugadores/999`);
    request.flush(
      { message: 'Jugador no encontrado.' },
      { status: 404, statusText: 'Not Found' },
    );

    await expectAsync(updatePromise).toBeRejected();
  });
});

