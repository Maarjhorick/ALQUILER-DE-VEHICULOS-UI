import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Vehiculo } from '../../../core/models/vehiculo.model';

export interface VehiculoDialogData {
  vehiculo?: Vehiculo;
}

@Component({
  selector: 'app-vehiculo-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './vehiculo-form-dialog.component.html',
  styleUrl: './vehiculo-form-dialog.component.css'
})
export class VehiculoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<VehiculoFormDialogComponent>);
  readonly data: VehiculoDialogData = inject(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data?.vehiculo;

  readonly tipos = ['Sedán', 'SUV', 'Hatchback', 'Camioneta', 'Furgoneta'];
  readonly estados = ['DISPONIBLE', 'ALQUILADO', 'MANTENIMIENTO'];

  form = this.fb.nonNullable.group({
    marca: [this.data?.vehiculo?.marca ?? '', [Validators.required, Validators.minLength(2)]],
    modelo: [this.data?.vehiculo?.modelo ?? '', [Validators.required, Validators.minLength(1)]],
    placa: [
      this.data?.vehiculo?.placa ?? '',
      [Validators.required, Validators.pattern(/^[A-Z0-9]{3}-[A-Z0-9]{3}$/)]
    ],
    anio: [
      this.data?.vehiculo?.anio ?? new Date().getFullYear(),
      [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]
    ],
    tipo: [this.data?.vehiculo?.tipo ?? '', [Validators.required]],
    precioPorDia: [this.data?.vehiculo?.precioPorDia ?? 0, [Validators.required, Validators.min(1)]],
    estado: [this.data?.vehiculo?.estado ?? 'DISPONIBLE', [Validators.required]]
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
