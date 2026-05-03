// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';

import { JugadorService } from './jugador.service';

describe('JugadorService', () => {
  let service: JugadorService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(JugadorService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devuelve los jugadores iniciales adaptados al modelo de la vista publica', async () => {
    const players = await service.listPlayers();

    expect(players.length).toBe(3);
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

  it('crea un jugador y lo mantiene en el listado gestionado', async () => {
    const player = await service.createPlayer({
      nombre: 'Marta Cano',
      posicion: 'Base',
      dorsal: 12,
      club_id: 1,
    });

    const players = await service.listManagedPlayers();

    expect(player).toEqual(
      jasmine.objectContaining({
        id: 4,
        nombre: 'Marta Cano',
        posicion: 'Base',
        dorsal: 12,
        clubNombre: 'Azules',
      }),
    );
    expect(players.some((candidate) => candidate.nombre === 'Marta Cano')).toBeTrue();
  });

  it('actualiza y elimina un jugador existente', async () => {
    const createdPlayer = await service.createPlayer({
      nombre: 'Luis Marco',
      posicion: 'Portero',
      dorsal: 1,
      club_id: 2,
    });

    const updatedPlayer = await service.updatePlayer(createdPlayer.id, {
      nombre: 'Luis Marco',
      posicion: 'Defensa',
      dorsal: 4,
      club_id: 3,
    });

    await service.deletePlayer(createdPlayer.id);
    const players = await service.listManagedPlayers();

    expect(updatedPlayer).toEqual(
      jasmine.objectContaining({
        id: createdPlayer.id,
        posicion: 'Defensa',
        dorsal: 4,
        clubNombre: 'Monteverde',
      }),
    );
    expect(players.some((candidate) => candidate.id === createdPlayer.id)).toBeFalse();
  });

  it('lanza un error si se intenta actualizar un jugador que no existe', async () => {
    await expectAsync(
      service.updatePlayer(999, {
        nombre: 'Jugador Fantasma',
        posicion: 'Delantero',
        dorsal: 99,
        club_id: 1,
      }),
    ).toBeRejectedWithError('Jugador no encontrado.');
  });
});
