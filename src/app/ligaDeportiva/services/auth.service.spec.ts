import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('posts the registration payload to the register endpoint', async () => {
    const promise = service.register({
      firstName: 'Lucia',
      lastName: 'Navas',
      username: 'lucia.navas',
      password: 'segura123',
      tipo: 'jugador',
      teamName: 'Azules',
    });

    const request = httpController.expectOne('/api/auth/register');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      firstName: 'Lucia',
      lastName: 'Navas',
      username: 'lucia.navas',
      password: 'segura123',
      tipo: 'jugador',
      teamName: 'Azules',
    });

    request.flush({
      ok: true,
      message: 'Usuario registrado.',
      user: {
        username: 'lucia.navas',
        tipo: 'jugador',
        createdAt: '2026-04-05T20:00:00.000Z',
      },
    });

    const response = await promise;

    expect(response.ok).toBeTrue();
    expect(response.user.username).toBe('lucia.navas');
    expect(response.user.tipo).toBe('jugador');
  });

  it('encodes login credentials as query params on the GET request', async () => {
    const promise = service.login({
      username: 'capitan azules',
      password: 'clave con espacios',
    });

    const request = httpController.expectOne(
      '/api/auth/login?username=capitan+azules&password=clave+con+espacios',
    );

    expect(request.request.method).toBe('GET');

    request.flush({
      ok: true,
      message: 'Sesion iniciada.',
      user: {
        username: 'capitan azules',
        firstName: 'Ruben',
        tipo: 'capitan',
        teamName: 'Azules',
      },
    });

    const response = await promise;

    expect(response.ok).toBeTrue();
    expect(response.user.firstName).toBe('Ruben');
    expect(response.user.tipo).toBe('capitan');
  });
});
