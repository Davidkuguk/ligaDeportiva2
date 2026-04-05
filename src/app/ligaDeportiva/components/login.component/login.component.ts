import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected isSubmitting = false;
  protected submitError = '';

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

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
