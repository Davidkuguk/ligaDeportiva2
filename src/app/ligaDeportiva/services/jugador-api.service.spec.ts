import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { JugadorApiService } from './jugador-api.service';
import { SessionService } from './session.service';

describe('JugadorApiService', () => {
  let service: JugadorApiService;
  let httpController: HttpTestingController;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    // Preparamos el servicio y el controlador HTTP falso para interceptar las peticiones.
    service = TestBed.inject(JugadorApiService);
    httpController = TestBed.inject(HttpTestingController);
    sessionService = TestBed.inject(SessionService);
    sessionService.setDemoAdminKey('');
  });

  afterEach(() => {
    // Verificamos que no se quede ninguna peticion pendiente al terminar cada test.
    httpController.verify();
  });

  it('solicita /api/jugadores y transforma la respuesta del backend al modelo del frontend', async () => {
    // Lanzamos el metodo antes de responder para poder capturar la solicitud.
    const promise = service.listPlayers();
    const request = httpController.expectOne('/api/jugadores');

    expect(request.request.method).toBe('GET');

    // Simulamos la respuesta de Laravel con un jugador.
    request.flush({
      data: [
        {
          nombre: 'Lucia Navas',
          posicion: 'Centrocampista',
          dorsal: 8,
          club: {
            nombre: 'Club Calatrava',
            categoria: 'Juvenil',
          },
        },
      ],
    });

    const players = await promise;

    expect(players.length).toBe(1);
    expect(players[0]).toEqual({
      name: 'Lucia Navas',
      nickname: 'Sin apodo',
      number: 8,
      position: 'Centrocampista',
      team: 'Club Calatrava',
      competition: 'Juvenil',
      stats: [],
    });
  });

  it('solicita los clubes disponibles para el formulario de jugadores', async () => {
    const promise = service.listClubOptions();
    const request = httpController.expectOne('/api/clubs');

    expect(request.request.method).toBe('GET');

    request.flush({
      data: [
        { id: 1, nombre: 'Club Maestre', categoria: 'Juvenil' },
        { id: 2, nombre: 'Club Calatrava', categoria: 'Cadete' },
      ],
    });

    await expectAsync(promise).toBeResolvedTo([
      { id: 1, nombre: 'Club Maestre', categoria: 'Juvenil' },
      { id: 2, nombre: 'Club Calatrava', categoria: 'Cadete' },
    ]);
  });

  it('envia la cabecera demo admin al crear un jugador cuando existe una clave guardada', async () => {
    // Guardamos una clave demo ficticia para comprobar que viaja en la cabecera.
    sessionService.setDemoAdminKey('demo-ut3-key');

    const promise = service.createPlayer({
      nombre: 'Mario Torres',
      posicion: 'Portero',
      dorsal: 1,
      club_id: 1,
    });

    const request = httpController.expectOne('/api/jugadores');

    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('X-Demo-Admin-Key')).toBe('demo-ut3-key');
    expect(request.request.body).toEqual({
      nombre: 'Mario Torres',
      posicion: 'Portero',
      dorsal: 1,
      club_id: 1,
    });

    request.flush({
      data: {
        id: 9,
        nombre: 'Mario Torres',
        posicion: 'Portero',
        dorsal: 1,
        club_id: 1,
        club: {
          id: 1,
          nombre: 'Club Maestre',
          categoria: 'Juvenil',
        },
      },
    });

    await expectAsync(promise).toBeResolvedTo({
      id: 9,
      nombre: 'Mario Torres',
      posicion: 'Portero',
      dorsal: 1,
      clubId: 1,
      clubNombre: 'Club Maestre',
      categoria: 'Juvenil',
    });
  });

  it('actualiza y elimina jugadores utilizando la API protegida', async () => {
    sessionService.setDemoAdminKey('demo-ut3-key');

    // Primero comprobamos la actualizacion.
    const updatePromise = service.updatePlayer(9, {
      nombre: 'Mario Torres',
      posicion: 'Cierre',
      dorsal: 1,
      club_id: 1,
    });

    const updateRequest = httpController.expectOne('/api/jugadores/9');

    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.headers.get('X-Demo-Admin-Key')).toBe('demo-ut3-key');

    updateRequest.flush({
      data: {
        id: 9,
        nombre: 'Mario Torres',
        posicion: 'Cierre',
        dorsal: 1,
        club_id: 1,
        club: {
          id: 1,
          nombre: 'Club Maestre',
          categoria: 'Juvenil',
        },
      },
    });

    await expectAsync(updatePromise).toBeResolvedTo({
      id: 9,
      nombre: 'Mario Torres',
      posicion: 'Cierre',
      dorsal: 1,
      clubId: 1,
      clubNombre: 'Club Maestre',
      categoria: 'Juvenil',
    });

    // Despues validamos el borrado del mismo jugador.
    const deletePromise = service.deletePlayer(9);
    const deleteRequest = httpController.expectOne('/api/jugadores/9');

    expect(deleteRequest.request.method).toBe('DELETE');
    expect(deleteRequest.request.headers.get('X-Demo-Admin-Key')).toBe('demo-ut3-key');

    deleteRequest.flush({});

    await expectAsync(deletePromise).toBeResolved();
  });
});
