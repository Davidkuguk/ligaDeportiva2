// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de NavbarComponent.
export class NavbarComponent {
  // Esta variable controla si el menu hamburguesa esta abierto o cerrado en movil.
  // esta variable controla informacion que se muestra en la plantilla.
  protected isMenuOpen = false;

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected closeMenu(): void {
    this.isMenuOpen = false;
  }
}

