// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Formulario del administrador para asignar usuarios a equipos existentes.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-admin-user-team-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-team-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de AdminUserTeamFormComponent.
export class AdminUserTeamFormComponent {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly formBuilder = inject(FormBuilder);

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) users: Array<{ username: string; name: string; tipo: string; teamName?: string }> = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) teams: string[] = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() isSaving = false;

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() assignUser = new EventEmitter<{ username: string; teamName: string }>();

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    teamName: ['', [Validators.required]],
  });

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.assignUser.emit(this.form.getRawValue());
  }
}

