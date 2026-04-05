import { TestBed } from '@angular/core/testing';

import { JugadorApiService } from '../../services/jugador-api.service';
import { JugadoresComponent } from './jugadores.component';

describe('JugadoresComponent', () => {
  it('renderiza los jugadores recibidos desde la API', async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresComponent],
      providers: [
        {
          provide: JugadorApiService,
          useValue: {
            // Simulamos que la API devuelve un unico jugador.
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

    // Creamos el componente real y dejamos que termine la carga asincrona.
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

  it('mantiene la lista semilla cuando falla la API', async () => {
    await TestBed.configureTestingModule({
      imports: [JugadoresComponent],
      providers: [
        {
          provide: JugadorApiService,
          useValue: {
            // Fuerza un error para comprobar el comportamiento de respaldo.
            listPlayers: jasmine.createSpy().and.rejectWith(new Error('API unavailable')),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(JugadoresComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // Leemos las estadisticas en forma de lista para comprobar que se ven los datos semilla.
    const statItems = Array.from(compiled.querySelectorAll('li')).map((item) => item.textContent?.trim());

    expect(compiled.querySelectorAll('article.card').length).toBe(3);
    expect(compiled.textContent).toContain('Antoni Ruiz');
    expect(statItems).toContain('7 goles');
    expect(statItems).toContain('84% de primeros saques');
    expect(statItems).toContain('12 recuperaciones');
  });
});
