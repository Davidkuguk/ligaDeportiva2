// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { Routes } from '@angular/router';
import { ArbitrosComponent } from './ligaDeportiva/components/arbitros.component/arbitros.component';
import { ClasificacionesComponent } from './ligaDeportiva/components/clasificaciones.component/clasificaciones.component';
import { ContactoComponent } from './ligaDeportiva/components/contacto.component/contacto.component';
import { EquiposComponent } from './ligaDeportiva/components/equipos.component/equipos.component';
import { HomeComponent } from './ligaDeportiva/components/home.component/home.component';
import { JugadoresComponent } from './ligaDeportiva/components/jugadores.component/jugadores.component';
import { LoginComponent } from './ligaDeportiva/components/login.component/login.component';
import { PanelAdminComponent } from './ligaDeportiva/components/panel-admin.component/panel-admin.component';
import { PanelArbitroComponent } from './ligaDeportiva/components/panel-arbitro.component/panel-arbitro.component';
import { PanelCapitanComponent } from './ligaDeportiva/components/panel-capitan.component/panel-capitan.component';
import { PanelUsuarioComponent } from './ligaDeportiva/components/panel-usuario.component/panel-usuario.component';
import { RegistroComponent } from './ligaDeportiva/components/registro.component/registro.component';
import { ResultadoComponent } from './ligaDeportiva/components/resultado.component/resultado.component';

// Aqui se centralizan todas las rutas de la aplicacion para separar las vistas publicas
// de los paneles privados segun el rol del usuario.
// exporto esta constante para poder reutilizarla desde otros archivos.
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'equipos', component: EquiposComponent },
  { path: 'resultados', component: ResultadoComponent },
  { path: 'clasificaciones', component: ClasificacionesComponent },
  { path: 'jugadores', component: JugadoresComponent },
  { path: 'arbitros', component: ArbitrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'panel-admin', component: PanelAdminComponent },
  { path: 'panel-arbitro', component: PanelArbitroComponent },
  { path: 'panel-capitan', component: PanelCapitanComponent },
  { path: 'panel-usuario', component: PanelUsuarioComponent },
  { path: '**', redirectTo: '' },
];

