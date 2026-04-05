import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Componente pequeño para guardar o limpiar la clave demo del administrador.
@Component({
  selector: 'app-admin-player-access',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-player-access.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPlayerAccessComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() isSaving = false;
  @Input()
  set currentKey(value: string) {
    // Cuando cambia la clave desde fuera, la reflejamos en el formulario sin disparar eventos.
    this.form.controls.demoAdminKey.setValue(value, { emitEvent: false });
  }

  @Output() saveKey = new EventEmitter<string>();

  // Formulario reactivo minimo para pedir la clave demo.
  protected readonly form = this.formBuilder.nonNullable.group({
    demoAdminKey: ['', [Validators.required]],
  });

  protected submit(): void {
    // Si el campo esta vacio marcamos errores para que el usuario lo vea.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Emitimos la clave al componente padre para que la guarde.
    this.saveKey.emit(this.form.getRawValue().demoAdminKey);
  }

  protected clear(): void {
    // Este boton vacia tanto el formulario como la clave guardada.
    this.form.controls.demoAdminKey.setValue('');
    this.saveKey.emit('');
  }
}
