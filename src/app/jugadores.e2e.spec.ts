// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

describe('Jugadores flow (E2E)', () => {
  beforeEach(async () => {
    window.history.replaceState({}, '', '/home');

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('navigates from the navbar to the players page and renders the featured roster', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const jugadoresLink = Array.from(compiled.querySelectorAll('a')).find(
      (link) => link.textContent?.trim() === 'Jugadores',
    ) as HTMLAnchorElement | undefined;

    expect(jugadoresLink).toBeTruthy();
    expect(jugadoresLink?.getAttribute('href')).toBe('/jugadores');

    await router.navigateByUrl('/jugadores');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/jugadores');
    expect(compiled.querySelector('h1')?.textContent).toContain('Jugadores');
    expect(compiled.textContent).toContain('Antoni Ruiz');
    expect(compiled.querySelectorAll('article.card').length).toBe(3);
  });
});
