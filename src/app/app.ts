// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer.component/footer.component';
import { NavbarComponent } from './shared/navbar.component/navbar.component';

// Este es el componente raiz. Aqui se monta la estructura comun con navbar, contenido y footer.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
// esta clase contiene la logica principal de App.
export class App {
  // Dejo el titulo como signal por si en el futuro quiero reutilizarlo de forma reactiva.
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly title = signal('ligaDeportiva2');
}

