// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ManagedMatch, MatchPayload } from '../../services/match-management.service';

// Formulario reutilizable para crear y editar partidos desde el panel admin.
// aqui empieza la configuracion del componente de Angular.
@Component({
  selector: 'app-admin-match-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-match-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// esta clase contiene la logica principal de AdminMatchFormComponent.
export class AdminMatchFormComponent implements OnChanges {
  // guardo esta referencia como propiedad para usarla dentro de la clase.
  private readonly formBuilder = inject(FormBuilder);

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) teams: string[] = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input({ required: true }) referees: Array<{ username: string; name: string }> = [];
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() selectedMatch: ManagedMatch | null = null;
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Input() isSaving = false;

  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() saveMatch = new EventEmitter<MatchPayload>();
  // esta propiedad comunica datos entre este componente y su componente padre.
  @Output() clearSelection = new EventEmitter<void>();

  // guardo esta referencia como propiedad para usarla dentro de la clase.
  protected readonly matchForm = this.formBuilder.nonNullable.group({
    sport: ['Futbol', [Validators.required]],
    localTeam: ['', [Validators.required]],
    awayTeam: ['', [Validators.required]],
    competition: ['', [Validators.required]],
    round: ['', [Validators.required]],
    date: ['', [Validators.required]],
    refereeUsername: [''],
    venue: [''],
    score: [''],
    status: ['scheduled' as MatchPayload['status'], [Validators.required]],
  });

  // separo esta accion en un metodo para que el componente quede mas claro.
  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el partido seleccionado, cargamos sus datos en el formulario.
    if (changes['selectedMatch']) {
      this.patchForm();
    }
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected submit(): void {
    if (this.matchForm.invalid) {
      this.matchForm.markAllAsTouched();
      return;
    }

    const payload = this.matchForm.getRawValue();

    if (payload.localTeam === payload.awayTeam) {
      return;
    }

    this.saveMatch.emit({
      ...payload,
      refereeUsername: payload.refereeUsername || undefined,
      venue: payload.venue || undefined,
      score: payload.score || undefined,
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  protected resetForm(): void {
    this.clearSelection.emit();
    this.matchForm.reset({
      sport: 'Futbol',
      localTeam: '',
      awayTeam: '',
      competition: '',
      round: '',
      date: '',
      refereeUsername: '',
      venue: '',
      score: '',
      status: 'scheduled',
    });
  }

  // separo esta accion en un metodo para que el componente quede mas claro.
  private patchForm(): void {
    // Este metodo rellena el formulario cuando editamos un partido ya existente.
    if (!this.selectedMatch) {
      this.resetForm();
      return;
    }

    this.matchForm.reset({
      sport: this.selectedMatch.sport,
      localTeam: this.selectedMatch.localTeam,
      awayTeam: this.selectedMatch.awayTeam,
      competition: this.selectedMatch.competition,
      round: this.selectedMatch.round,
      date: this.selectedMatch.date,
      refereeUsername: this.selectedMatch.refereeUsername ?? '',
      venue: this.selectedMatch.venue ?? '',
      score: this.selectedMatch.score ?? '',
      status: this.selectedMatch.status,
    });
  }
}

