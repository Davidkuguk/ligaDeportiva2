import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService, RegisterPayload } from '../../services/auth.service';
import { MatchManagementService } from '../../services/match-management.service';

const USER_TYPE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'jugador', label: 'Jugador' },
  { value: 'capitan', label: 'Capitan' },
  { value: 'arbitro', label: 'Arbitro' },
  { value: 'entrenador', label: 'Entrenador' },
  { value: 'aficionado', label: 'Aficionado' },
  { value: 'admin', label: 'Admin' },
] as const;

// Componente de registro conectado con MongoDB para crear usuarios reales.
@Component({
  selector: 'app-registro.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly matchManagementService = inject(MatchManagementService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected isSubmitting = false;
  protected isLoadingTeams = true;
  protected submitError = '';
  protected submitSuccess = '';
  protected readonly userTypeOptions = USER_TYPE_OPTIONS;
  protected teamOptions: string[] = [];

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    tipo: ['normal', [Validators.required]],
    teamName: [''],
    password: ['', [Validators.required, Validators.minLength(4)]],
    passwordConfirm: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // Cargamos los equipos para poder asociarlos en el registro si hace falta.
    void this.loadTeams();
  }

  protected async submit(): Promise<void> {
    this.submitError = '';
    this.submitSuccess = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, username, tipo, teamName, password, passwordConfirm } =
      this.registerForm.getRawValue();

    if (password !== passwordConfirm) {
      this.submitError = 'Las contrasenas no coinciden.';
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.changeDetectorRef.markForCheck();

    try {
      const response = await this.authService.register({
        firstName,
        lastName,
        username,
        tipo: tipo as RegisterPayload['tipo'],
        teamName: teamName || undefined,
        password,
      });

      this.submitSuccess = `Usuario ${response.user.username} creado correctamente como ${response.user.tipo}.`;
      this.registerForm.reset({
        firstName: '',
        lastName: '',
        username: '',
        tipo: 'normal',
        teamName: '',
        password: '',
        passwordConfirm: '',
      });
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.submitError = getErrorMessage(error);
      this.changeDetectorRef.markForCheck();
    } finally {
      this.isSubmitting = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private async loadTeams(): Promise<void> {
    try {
      const response = await this.matchManagementService.getCatalogOptions();
      this.teamOptions = response.teams;
    } finally {
      this.isLoadingTeams = false;
      this.changeDetectorRef.markForCheck();
    }
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

  return 'No se pudo completar el registro.';
}
