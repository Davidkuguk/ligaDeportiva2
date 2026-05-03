// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Formulario simple para que un capitan cree su equipo.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-captain-team-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captain-team-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de CaptainTeamFormComponent.
export class CaptainTeamFormComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly formBuilder = inject(FormBuilder);

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) captainUsername = '';
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() canCreate = false;
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() isSaving = false;

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() createTeam = new EventEmitter<{ name: string; competition: string; captainUsername: string }>();

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    competition: ['', [Validators.required]],
  });

  // separo esta accion en un metodo para que el componente quede mas claro.
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

