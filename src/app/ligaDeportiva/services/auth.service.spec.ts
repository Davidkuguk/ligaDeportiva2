// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

// agrupo aqui las pruebas relacionadas con esta parte.
describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  // limpio lo que se haya usado en la prueba para dejar todo controlado.
  afterEach(() => {
    localStorage.clear();
    httpController.verify();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('registra un usuario y permite iniciar sesion con sus datos', async () => {
    const registerPromise = service.register({
      firstName: 'Laura',
      lastName: 'Santos',
      username: 'laura',
      password: '1234',
      tipo: 'jugador',
      teamName: 'Azules',
    });

    const registerRequest = httpController.expectOne(`${environment.apiUrl}/auth/register`);
    expect(registerRequest.request.method).toBe('POST');
    registerRequest.flush({
      ok: true,
      message: 'Usuario creado correctamente.',
      user: {
        username: 'laura',
        tipo: 'jugador',
        createdAt: '2026-05-03T00:00:00.000Z',
      },
    });

    const registerResponse = await registerPromise;

    const loginPromise = service.login({
      username: 'laura',
      password: '1234',
    });

    const loginRequest = httpController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(loginRequest.request.method).toBe('POST');
    loginRequest.flush({
      ok: true,
      message: 'Sesion iniciada correctamente.',
      token: 'token-laravel',
      user: {
        username: 'laura',
        firstName: 'Laura',
        tipo: 'jugador',
        teamName: 'Azules',
      },
    });

    const loginResponse = await loginPromise;

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
        token: 'token-laravel',
      }),
    );
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('propaga el error del backend si el usuario ya existe', async () => {
    const registerPromise = service.register({
      firstName: 'Laura',
      lastName: 'Santos',
      username: 'laura',
      password: '1234',
      tipo: 'normal',
    });

    const request = httpController.expectOne(`${environment.apiUrl}/auth/register`);
    request.flush(
      {
        message: 'Ya existe un usuario con ese nombre.',
        errors: {
          username: ['Ya existe un usuario con ese nombre.'],
        },
      },
      {
        status: 422,
        statusText: 'Unprocessable Entity',
      },
    );

    await expectAsync(registerPromise).toBeRejected();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('rechaza el inicio de sesion con contrasena incorrecta', async () => {
    const loginPromise = service.login({
      username: 'admin',
      password: 'incorrecta',
    });

    const request = httpController.expectOne(`${environment.apiUrl}/auth/login`);
    request.flush(
      {
        message: 'Usuario o contrasena incorrectos.',
      },
      {
        status: 422,
        statusText: 'Unprocessable Entity',
      },
    );

    await expectAsync(loginPromise).toBeRejected();
  });
});

