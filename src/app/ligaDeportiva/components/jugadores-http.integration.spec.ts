// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Player } from '../models/liga.models';

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

@Injectable()
class JugadorHttpIntegrationService {
  private readonly http = inject(HttpClient);

  getJugadores() {
    return this.http.get<LaravelJugadorResponse>('/api/jugadores');
  }
}

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
  private readonly jugadorService = inject(JugadorHttpIntegrationService);

  protected players: Player[] = [];
  protected errorMessage = '';

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

describe('JugadoresListaIntegracionComponent + JugadorHttpIntegrationService', () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JugadoresListaIntegracionComponent],
      providers: [JugadorHttpIntegrationService],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

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
