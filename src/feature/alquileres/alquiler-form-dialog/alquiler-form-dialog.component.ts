import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { ClienteService } from '../../../core/service/cliente.service';
import { VehiculoService } from '../../../core/service/vehiculo.service';
import { NuevoAlquiler } from '../../../core/service/alquiler.service';

function rangoDeFechasValido(): ValidatorFn {
  return (group): ValidationErrors | null => {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    return new Date(fin) > new Date(inicio) ? null : { rangoInvalido: true };
  };
}

@Component({
  selector: 'app-alquiler-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './alquiler-form-dialog.component.html',
  styleUrl: './alquiler-form-dialog.component.css'
})
export class AlquilerFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AlquilerFormDialogComponent>);
  private readonly clienteService = inject(ClienteService);
  private readonly vehiculoService = inject(VehiculoService);
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  readonly clientes = this.clienteService.clientes;

  readonly vehiculosDisponibles = computed(() =>
    this.vehiculoService.vehiculos().filter((v) => v.estado === 'DISPONIBLE')
  );

  form = this.fb.nonNullable.group(
    {
      clienteId: [null as number | null, [Validators.required]],
      vehiculoId: [null as number | null, [Validators.required]],
      fechaInicio: [null as Date | null, [Validators.required]],
      fechaFin: [null as Date | null, [Validators.required]]
    },
    { validators: rangoDeFechasValido() }
  );

  readonly totalEstimado = signal(0);

  constructor() {
    this.form.valueChanges.subscribe(() => this.calcularTotal());
  }

  private calcularTotal(): void {
    const { vehiculoId, fechaInicio, fechaFin } = this.form.getRawValue();
    const vehiculo = this.vehiculosDisponibles().find((v) => v.id === vehiculoId);

    if (!vehiculo || !fechaInicio || !fechaFin) {
      this.totalEstimado.set(0);
      return;
    }

    const dias = Math.max(
      1,
      Math.round((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / 86_400_000)
    );

    this.totalEstimado.set(dias * vehiculo.precioPorDia);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { clienteId, vehiculoId, fechaInicio, fechaFin } = this.form.getRawValue();
    const cliente = this.clientes().find((c) => c.id === clienteId);
    const vehiculo = this.vehiculosDisponibles().find((v) => v.id === vehiculoId);

    if (!cliente || !vehiculo || !fechaInicio || !fechaFin) return;

    const resultado: NuevoAlquiler = {
      clienteId: cliente.id,
      clienteNombre: `${cliente.nombres} ${cliente.apellidos}`,
      vehiculoId: vehiculo.id,
      vehiculoNombre: `${vehiculo.marca} ${vehiculo.modelo}`,
      fechaInicio: new Date(fechaInicio).toISOString().slice(0, 10),
      fechaFin: new Date(fechaFin).toISOString().slice(0, 10),
      total: this.totalEstimado()
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
