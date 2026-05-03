// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('registra un usuario y permite iniciar sesion con sus datos', async () => {
    const registerResponse = await service.register({
      firstName: 'Laura',
      lastName: 'Santos',
      username: 'laura',
      password: '1234',
      tipo: 'jugador',
      teamName: 'Azules',
    });

    const loginResponse = await service.login({
      username: 'laura',
      password: '1234',
    });

    expect(registerResponse.ok).toBeTrue();
    expect(registerResponse.user).toEqual(
      jasmine.objectContaining({
        username: 'laura',
        tipo: 'jugador',
      }),
    );
    expect(loginResponse.user).toEqual(
      jasmine.objectContaining({
        username: 'laura',
        firstName: 'Laura',
        tipo: 'jugador',
        teamName: 'Azules',
      }),
    );
  });

  it('rechaza usuarios duplicados sin distinguir mayusculas', async () => {
    await service.register({
      firstName: 'Laura',
      lastName: 'Santos',
      username: 'laura',
      password: '1234',
      tipo: 'normal',
    });

    await expectAsync(
      service.register({
        firstName: 'Otra',
        lastName: 'Persona',
        username: 'LAURA',
        password: 'abcd',
        tipo: 'normal',
      }),
    ).toBeRejectedWithError('Ya existe un usuario con ese nombre.');
  });

  it('rechaza el inicio de sesion con contrasena incorrecta', async () => {
    await expectAsync(
      service.login({
        username: 'admin',
        password: 'incorrecta',
      }),
    ).toBeRejectedWithError('Usuario o contrasena incorrectos.');
  });
});
