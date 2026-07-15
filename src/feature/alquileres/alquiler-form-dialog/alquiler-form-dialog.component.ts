import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Cliente } from '../../../core/models/cliente.model';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { ClienteService } from '../../../core/service/cliente.service';
import { VehiculoService } from '../../../core/service/vehiculo.service';

function rangoDeFechasValido(): ValidatorFn {
  return (group): ValidationErrors | null => {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;

    if (!inicio || !fin) return null;

    return new Date(fin) > new Date(inicio) ? null : { rangoInvalido: true };
  };
}

export interface NuevoAlquilerResultado {
  idCliente: number;
  idVehiculo: number;
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-alquiler-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './alquiler-form-dialog.component.html',
  styleUrl: './alquiler-form-dialog.component.css'
})
export class AlquilerFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AlquilerFormDialogComponent>);
  private readonly clienteService = inject(ClienteService);
  private readonly vehiculoService = inject(VehiculoService);

  clientes: Cliente[] | null = null;
  vehiculosDisponibles: Vehiculo[] | null = null;

  readonly hoy = new Date().toISOString().slice(0, 10);

  form = this.fb.nonNullable.group(
    {
      clienteId: [null as number | null, [Validators.required]],
      vehiculoId: [null as number | null, [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
    },
    { validators: rangoDeFechasValido() }
  );

  readonly totalEstimado = signal(0);

  constructor() {
    this.form.valueChanges.subscribe(() => this.calcularTotal());
  }

  ngOnInit(): void {
    this.clienteService.listarTodos().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error('Error cargando clientes:', err)
    });

    this.vehiculoService.listarTodos().subscribe({
      next: (data) => (this.vehiculosDisponibles = data.filter((v) => v.estado?.nombreEstado === 'DISPONIBLE')),
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  private calcularTotal(): void {
    const { vehiculoId, fechaInicio, fechaFin } = this.form.getRawValue();
    const vehiculo = this.vehiculosDisponibles?.find((v) => v.idVehiculo === vehiculoId);

    if (!vehiculo || !fechaInicio || !fechaFin) {
      this.totalEstimado.set(0);
      return;
    }

    const dias = Math.max(
      1,
      Math.round((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / 86_400_000)
    );

    this.totalEstimado.set(dias * vehiculo.precioDia);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { clienteId, vehiculoId, fechaInicio, fechaFin } = this.form.getRawValue();

    if (!clienteId || !vehiculoId || !fechaInicio || !fechaFin) return;

    const resultado: NuevoAlquilerResultado = {
      idCliente: clienteId,
      idVehiculo: vehiculoId,
      fechaInicio,
      fechaFin
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}