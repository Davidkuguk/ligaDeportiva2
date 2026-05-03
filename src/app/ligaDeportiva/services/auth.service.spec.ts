// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

// agrupo aqui las pruebas relacionadas con esta parte.
describe('AuthService', () => {
  let service: AuthService;

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  // limpio lo que se haya usado en la prueba para dejar todo controlado.
  afterEach(() => {
    localStorage.clear();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
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

  // este caso comprueba un comportamiento concreto de la aplicacion.
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

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('rechaza el inicio de sesion con contrasena incorrecta', async () => {
    await expectAsync(
      service.login({
        username: 'admin',
        password: 'incorrecta',
      }),
    ).toBeRejectedWithError('Usuario o contrasena incorrectos.');
  });
});

