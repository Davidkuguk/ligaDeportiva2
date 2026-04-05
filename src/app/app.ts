import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer.component/footer.component';
import { NavbarComponent } from './shared/navbar.component/navbar.component';

// Este es el componente raiz. Aqui se monta la estructura comun con navbar, contenido y footer.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Dejo el titulo como signal por si en el futuro quiero reutilizarlo de forma reactiva.
  protected readonly title = signal('ligaDeportiva2');
}
