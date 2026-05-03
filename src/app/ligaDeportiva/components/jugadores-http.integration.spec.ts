// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Player } from '../models/liga.models';

// esta interfaz interna me ayuda a ordenar los datos de LaravelJugadorResponse.
interface LaravelJugadorResponse {
  data: Array<{
    id: number;
    nombre: string;
    posicion: string;
    dorsal: number;
    club: {
      nombre: string;
      categoria: string;
    };
  }>;
}

// con Injectable hago que Angular pueda usar esta clase como servicio.
@Injectable()
class JugadorHttpIntegrationService {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly http = inject(HttpClient);

  // separo esta accion en un metodo para que el componente quede mas claro.
  getJugadores() {
    return this.http.get<LaravelJugadorResponse>('/api/jugadores');
  }
}

// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-jugadores-lista-integracion',
  imports: [CommonModule],
  template: `
    <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    <article *ngFor="let player of players">
      <h2>{{ player.name }}</h2>
      <span>{{ player.team }}</span>
    </article>
  `,
})
class JugadoresListaIntegracionComponent implements OnInit {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly jugadorService = inject(JugadorHttpIntegrationService);

  // esta variable controla informacion que se muestra en la plantilla.
  protected players: Player[] = [];
  // esta variable controla informacion que se muestra en la plantilla.
  protected errorMessage = '';

  // al iniciar el componente cargo los datos que necesita la pantalla.
  ngOnInit(): void {
    this.jugadorService.getJugadores().subscribe({
      next: (response) => {
        this.players = response.data.map((jugador) => ({
          name: jugador.nombre,
          nickname: 'Sin apodo',
          number: jugador.dorsal,
          position: jugador.posicion,
          team: jugador.club.nombre,
          competition: jugador.club.categoria,
          stats: [],
        }));
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los jugadores.';
      },
    });
  }
}

// agrupo aqui las pruebas relacionadas con esta parte.
describe('JugadoresListaIntegracionComponent + JugadorHttpIntegrationService', () => {
  let httpController: HttpTestingController;

  // preparo el entorno antes de cada prueba para que no se mezclen datos.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JugadoresListaIntegracionComponent],
      providers: [JugadorHttpIntegrationService],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  // limpio lo que se haya usado en la prueba para dejar todo controlado.
  afterEach(() => {
    httpController.verify();
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('intercepta la peticion y simula una respuesta JSON de Laravel', () => {
    const fixture = TestBed.createComponent(JugadoresListaIntegracionComponent);

    fixture.detectChanges();

    const request = httpController.expectOne('/api/jugadores');
    expect(request.request.method).toBe('GET');
    request.flush({
      data: [
        {
          id: 12,
          nombre: 'Alvaro Prieto',
          posicion: 'Defensa',
          dorsal: 5,
          club: {
            nombre: 'Club Maestre',
            categoria: 'Juvenil',
          },
        },
      ],
    });

    const component = fixture.componentInstance as unknown as { players: Player[] };

    expect(component.players.length).toBe(1);
    expect(component.players[0].name).toBe('Alvaro Prieto');
    expect(component.players[0].team).toBe('Club Maestre');
  });

  // este caso comprueba un comportamiento concreto de la aplicacion.
  it('guarda un mensaje de error cuando la peticion HTTP simulada falla', () => {
    const fixture = TestBed.createComponent(JugadoresListaIntegracionComponent);

    fixture.detectChanges();

    const request = httpController.expectOne('/api/jugadores');
    request.flush('Error de carga', {
      status: 500,
      statusText: 'Server Error',
    });

    const component = fixture.componentInstance as unknown as { players: Player[]; errorMessage: string };

    expect(component.players).toEqual([]);
    expect(component.errorMessage).toBe('No se pudieron cargar los jugadores.');
  });
});

