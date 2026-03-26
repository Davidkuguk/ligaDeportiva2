import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-user-team-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-team-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserTeamFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) users: Array<{ username: string; name: string; tipo: string; teamName?: string }> = [];
  @Input({ required: true }) teams: string[] = [];
  @Input() isSaving = false;

  @Output() assignUser = new EventEmitter<{ username: string; teamName: string }>();

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    teamName: ['', [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.assignUser.emit(this.form.getRawValue());
  }
}
