// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de LoginComponent.
export class LoginComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly formBuilder = inject(FormBuilder);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly authService = inject(AuthService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly sessionService = inject(SessionService);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly router = inject(Router);
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  // esta variable controla informacion que se muestra en la plantilla.
  protected isSubmitting = false;
  // esta variable controla informacion que se muestra en la plantilla.
  protected submitError = '';

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected async submit(): Promise<void> {
    this.submitError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.changeDetectorRef.markForCheck();

    try {
      const { username, password } = this.loginForm.getRawValue();
      const response = await this.authService.login({ username, password });

      // Guardamos la sesion para poder reutilizar los datos del usuario en los paneles.
      this.sessionService.setSession(response.user);

      // Segun el tipo de usuario, lo mandamos a su panel correspondiente.
      await this.router.navigateByUrl(getRouteByTipo(response.user.tipo));
    } catch (error) {
      this.submitError = getErrorMessage(error);
    } finally {
      this.isSubmitting = false;
      this.changeDetectorRef.markForCheck();
    }
  }
}

// esta funcion auxiliar evita repetir la misma logica en varios sitios.
function getRouteByTipo(tipo: string): string {
  // Esta funcion nos permite tener la redireccion por roles en un solo sitio.
  switch (tipo) {
    case 'admin':
      return '/panel-admin';
    case 'arbitro':
      return '/panel-arbitro';
    case 'capitan':
      return '/panel-capitan';
    default:
      return '/panel-usuario';
  }
}

// esta funcion auxiliar evita repetir la misma logica en varios sitios.
function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof error.error === 'object' &&
    error.error !== null &&
    'message' in error.error &&
    typeof error.error.message === 'string'
  ) {
    return error.error.message;
  }

  return 'No se pudo iniciar sesion.';
}

