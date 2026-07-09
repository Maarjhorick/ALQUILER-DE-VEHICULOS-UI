import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Vehiculo } from '../../../core/models/vehiculo.model';
import { Catalogos } from '../../../core/models/catalogo.model';
import { CatalogoService } from '../../../core/service/catalogo.service';

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
export class VehiculoFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<VehiculoFormDialogComponent>);
  private readonly catalogoService = inject(CatalogoService);
  readonly data: VehiculoDialogData = inject(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data?.vehiculo;

  catalogos: Catalogos | null = null;

  form = this.fb.nonNullable.group({
    placa: [
      this.data?.vehiculo?.placa ?? '',
      [Validators.required, Validators.pattern(/^[A-Z0-9]{3}-[A-Z0-9]{3}$/)]
    ],
    color: [this.data?.vehiculo?.color ?? '', [Validators.required]],
    anio: [
      this.data?.vehiculo?.anio ?? new Date().getFullYear(),
      [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]
    ],
    numeroMotor: [this.data?.vehiculo?.numeroMotor ?? '', [Validators.required]],
    numeroVin: [this.data?.vehiculo?.numeroVin ?? '', [Validators.required]],
    precioDia: [this.data?.vehiculo?.precioDia ?? 0, [Validators.required, Validators.min(1)]],
    precioHora: [this.data?.vehiculo?.precioHora ?? 0, [Validators.required, Validators.min(1)]],
    idModelo: [this.data?.vehiculo?.modelo?.idModelo ?? null, [Validators.required]],
    idTipo: [this.data?.vehiculo?.tipo?.idTipo ?? null, [Validators.required]],
    idCombustible: [this.data?.vehiculo?.combustible?.idCombustible ?? null, [Validators.required]],
    idEstado: [this.data?.vehiculo?.estado?.idEstado ?? null, [Validators.required]]
  });

  ngOnInit(): void {
    this.catalogoService.obtenerTodos().subscribe({
      next: (data) => (this.catalogos = data),
      error: (err) => console.error('Error cargando catálogos:', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();

    const vehiculo: Vehiculo = {
      placa: valores.placa,
      color: valores.color,
      anio: valores.anio,
      numeroMotor: valores.numeroMotor,
      numeroVin: valores.numeroVin,
      precioDia: valores.precioDia,
      precioHora: valores.precioHora,
      modelo: { idModelo: valores.idModelo! } as any,
      tipo: { idTipo: valores.idTipo! } as any,
      combustible: { idCombustible: valores.idCombustible! } as any,
      estado: { idEstado: valores.idEstado! } as any
    };

    this.dialogRef.close(vehiculo);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}