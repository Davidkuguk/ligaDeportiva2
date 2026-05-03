// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClubOption, ManagedPlayer, PlayerPayload } from '../../services/jugador.service';

// Formulario reutilizable para crear y editar jugadores desde el panel admin.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-admin-player-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-player-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de AdminPlayerFormComponent.
export class AdminPlayerFormComponent implements OnChanges {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly formBuilder = inject(FormBuilder);

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) clubs: ClubOption[] = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() selectedPlayer: ManagedPlayer | null = null;
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() isSaving = false;
  // esta propiedad cambia cuando el panel padre necesita limpiar el formulario.
  @Input() resetToken = 0;

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() savePlayer = new EventEmitter<PlayerPayload>();
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() clearSelection = new EventEmitter<void>();

  // Usamos validaciones basicas para no guardar datos incoherentes.
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly playerForm = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    posicion: ['', [Validators.required, Validators.minLength(2)]],
    dorsal: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
    club_id: [0, [Validators.required, Validators.min(1)]],
  });

  // separo esta accion en un metodo para que el componente quede mas claro.
  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el jugador seleccionado o llega una orden de limpieza, actualizamos el formulario.
    if (changes['selectedPlayer'] || changes['resetToken']) {
      this.patchForm();
    }
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected submit(): void {
    // No dejamos enviar si faltan datos o si alguno no cumple las reglas.
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    // Emitimos un payload limpio para que el padre decida si crea o actualiza.
    this.savePlayer.emit(this.playerForm.getRawValue());
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected resetForm(): void {
    // Avisamos al padre de que ya no estamos editando ningun jugador.
    this.clearSelection.emit();
    this.resetFields();
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private resetFields(): void {
    this.playerForm.reset({
      nombre: '',
      posicion: '',
      dorsal: 1,
      club_id: 0,
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private patchForm(): void {
    if (!this.selectedPlayer) {
      // Si no hay jugador seleccionado, volvemos al modo de alta.
      this.resetFields();
      return;
    }

    // Si estamos editando, cargamos en el formulario los datos del jugador elegido.
    this.playerForm.reset({
      nombre: this.selectedPlayer.nombre,
      posicion: this.selectedPlayer.posicion,
      dorsal: this.selectedPlayer.dorsal,
      club_id: this.selectedPlayer.clubId,
    });
  }
}

