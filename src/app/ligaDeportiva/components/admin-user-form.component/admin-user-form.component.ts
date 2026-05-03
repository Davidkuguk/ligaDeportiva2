import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RegisterPayload } from '../../services/auth.service';

const USER_TYPE_OPTIONS: Array<{ value: RegisterPayload['tipo']; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'jugador', label: 'Jugador' },
  { value: 'capitan', label: 'Capitan' },
  { value: 'arbitro', label: 'Arbitro' },
  { value: 'entrenador', label: 'Entrenador' },
  { value: 'aficionado', label: 'Aficionado' },
  { value: 'admin', label: 'Admin' },
];

@Component({
  selector: 'app-admin-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) teams: string[] = [];
  @Input() isSaving = false;
  @Input() resetToken = 0;

  @Output() createUser = new EventEmitter<RegisterPayload>();

  protected readonly userTypeOptions = USER_TYPE_OPTIONS;
  protected passwordMismatch = false;

  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    tipo: ['normal' as RegisterPayload['tipo'], [Validators.required]],
    teamName: [''],
    password: ['', [Validators.required, Validators.minLength(4)]],
    passwordConfirm: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetToken']) {
      this.resetForm();
    }
  }

  protected submit(): void {
    this.passwordMismatch = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { passwordConfirm, teamName, ...payload } = this.form.getRawValue();

    if (payload.password !== passwordConfirm) {
      this.passwordMismatch = true;
      return;
    }

    this.createUser.emit({
      ...payload,
      teamName: teamName || undefined,
    });
  }

  protected resetForm(): void {
    this.passwordMismatch = false;
    this.form.reset({
      firstName: '',
      lastName: '',
      username: '',
      tipo: 'normal',
      teamName: '',
      password: '',
      passwordConfirm: '',
    });
  }
}
