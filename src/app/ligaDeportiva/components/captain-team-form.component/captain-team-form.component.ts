// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Formulario simple para que un capitan cree su equipo.
@Component({
  selector: 'app-captain-team-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captain-team-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptainTeamFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) captainUsername = '';
  @Input() canCreate = false;
  @Input() isSaving = false;

  @Output() createTeam = new EventEmitter<{ name: string; competition: string; captainUsername: string }>();

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    competition: ['', [Validators.required]],
  });

  protected submit(): void {
    if (!this.canCreate || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.createTeam.emit({
      ...this.form.getRawValue(),
      captainUsername: this.captainUsername,
    });
  }
}
