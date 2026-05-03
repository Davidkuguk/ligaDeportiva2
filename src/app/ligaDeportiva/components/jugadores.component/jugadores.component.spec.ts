// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';

import { JugadorService } from '../../services/jugador.service';
import { JugadoresComponent } from './jugadores.component';

describe('JugadoresComponent', () => {
  it('renderiza los jugadores recibidos desde el servicio local', async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresComponent],
      providers: [
        {
          provide: JugadorService,
          useValue: {
            listPlayers: jasmine.createSpy().and.resolveTo([
              {
                name: 'Alvaro Prieto',
                nickname: 'Sin apodo',
                number: 5,
                position: 'Defensa',
                team: 'Club Maestre',
                competition: 'Juvenil',
                stats: [],
              },
            ]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(JugadoresComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('article.card').length).toBe(1);
    expect(compiled.textContent).toContain('Alvaro Prieto');
    expect(compiled.textContent).toContain('Club Maestre');
    expect(compiled.textContent).toContain('#5');
  });

  it('renderiza varios jugadores locales', async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresComponent],
      providers: [
        {
          provide: JugadorService,
          useValue: {
            listPlayers: jasmine.createSpy().and.resolveTo([
              {
                name: 'Antoni Ruiz',
                nickname: 'Toro',
                number: 9,
                position: 'Delantero',
                team: 'Azules',
                competition: 'Liga Principal',
                stats: ['7 goles'],
              },
              {
                name: 'Isabela Mora',
                nickname: 'Ace',
                number: 1,
                position: 'Tenista',
                team: 'Monteverde',
                competition: 'Torneo Juvenil',
                stats: ['5 victorias'],
              },
            ]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(JugadoresComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('article.card').length).toBe(2);
    expect(compiled.textContent).toContain('Antoni Ruiz');
    expect(compiled.textContent).toContain('Isabela Mora');
  });
});
