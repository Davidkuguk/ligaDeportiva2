import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Player } from '../models/liga.models';
import { JugadorApiService } from '../services/jugador-api.service';

@Component({
  selector: 'app-jugadores-http-test-host',
  imports: [CommonModule],
  template: `
    <section>
      <article class="player-card" *ngFor="let player of players">
        <h2>{{ player.name }}</h2>
        <p class="team">{{ player.team }}</p>
        <p class="number">#{{ player.number }}</p>
      </article>
    </section>
  `,
})
class JugadoresHttpTestHostComponent {
  private readonly jugadorApiService = inject(JugadorApiService);

  protected players: Player[] = [];

  async loadPlayers(): Promise<void> {
    this.players = await this.jugadorApiService.listPlayers();
  }
}

describe('Jugadores HTTP integration', () => {
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresHttpTestHostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('prueba la comunicacion entre componente y servicio simulando /api/jugadores', async () => {
    const fixture = TestBed.createComponent(JugadoresHttpTestHostComponent);
    const loadPromise = fixture.componentInstance.loadPlayers();

    const request = httpController.expectOne('/api/jugadores');

    expect(request.request.method).toBe('GET');

    request.flush({
      data: [
        {
          nombre: 'Alvaro Prieto',
          posicion: 'Defensa',
          dorsal: 5,
          club: {
            nombre: 'Club Maestre',
            categoria: 'Juvenil',
          },
        },
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

    await loadPromise;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.player-card').length).toBe(2);
    expect(compiled.textContent).toContain('Alvaro Prieto');
    expect(compiled.textContent).toContain('Club Maestre');
    expect(compiled.textContent).toContain('#5');
    expect(compiled.textContent).toContain('Lucia Navas');
  });
});
