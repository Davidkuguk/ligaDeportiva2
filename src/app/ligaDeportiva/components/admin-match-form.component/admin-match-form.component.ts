// Comentario de estudiante: este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ManagedMatch, MatchPayload } from '../../services/match-management.service';

// Formulario reutilizable para crear y editar partidos desde el panel admin.
@Component({
  selector: 'app-admin-match-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-match-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMatchFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) teams: string[] = [];
  @Input({ required: true }) referees: Array<{ username: string; name: string }> = [];
  @Input() selectedMatch: ManagedMatch | null = null;
  @Input() isSaving = false;

  @Output() saveMatch = new EventEmitter<MatchPayload>();
  @Output() clearSelection = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el partido seleccionado, cargamos sus datos en el formulario.
    if (changes['selectedMatch']) {
      this.patchForm();
    }
  }

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
