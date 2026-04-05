import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClubOption, ManagedPlayer, PlayerPayload } from '../../services/jugador-api.service';

// Formulario reutilizable para crear y editar jugadores desde el panel admin.
@Component({
  selector: 'app-admin-player-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-player-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlayerFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) clubs: ClubOption[] = [];
  @Input() selectedPlayer: ManagedPlayer | null = null;
  @Input() isSaving = false;

  @Output() savePlayer = new EventEmitter<PlayerPayload>();
  @Output() clearSelection = new EventEmitter<void>();

  // Usamos validaciones basicas para no mandar datos incoherentes al backend.
  protected readonly playerForm = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    posicion: ['', [Validators.required, Validators.minLength(2)]],
    dorsal: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
    club_id: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Si el jugador seleccionado cambia, rellenamos el formulario con sus datos.
    if (changes['selectedPlayer']) {
      this.patchForm();
    }
  }

  protected submit(): void {
    // No dejamos enviar si faltan datos o si alguno no cumple las reglas.
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    // Emitimos un payload limpio para que el padre decida si crea o actualiza.
    this.savePlayer.emit(this.playerForm.getRawValue());
  }

  protected resetForm(): void {
    // Avisamos al padre de que ya no estamos editando ningun jugador.
    this.clearSelection.emit();
    this.playerForm.reset({
      nombre: '',
      posicion: '',
      dorsal: 1,
      club_id: 0,
    });
  }

  private patchForm(): void {
    if (!this.selectedPlayer) {
      // Si no hay jugador seleccionado, volvemos al modo de alta.
      this.resetForm();
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
