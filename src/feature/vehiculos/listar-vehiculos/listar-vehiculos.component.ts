import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EstadoVehiculo, Vehiculo } from '../../../core/models/vehiculo.model';
import { VehiculoService } from '../../../core/service/vehiculo.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { VehiculoFormDialogComponent } from '../vehiculo-form-dialog/vehiculo-form-dialog.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
// removed duplicate import

type FiltroEstado = 'TODOS' | EstadoVehiculo;

@Component({
  selector: 'app-listar-vehiculos',
  imports: [
    NgClass,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    BackButtonComponent
],
  templateUrl: './listar-vehiculos.component.html',
  styleUrls: ['./listar-vehiculos.component.css'
  ]
})
export class ListarVehiculosComponent {
  private readonly vehiculoService = inject(VehiculoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['vehiculo', 'placa', 'tipo', 'anio', 'precio', 'estado', 'acciones'];

  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('TODOS');

  readonly vehiculos = this.vehiculoService.vehiculos;

  readonly vehiculosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.vehiculos().filter((v) => {
      const coincideTexto =
        !texto ||
        `${v.marca} ${v.modelo} ${v.placa}`.toLowerCase().includes(texto);
      const coincideEstado = estado === 'TODOS' || v.estado === estado;
      return coincideTexto && coincideEstado;
    });
  });

  buscar(valor: string): void {
    this.busqueda.set(valor);
  }

  filtrarPorEstado(estado: FiltroEstado): void {
    this.filtroEstado.set(estado);
  }

  abrirNuevo(): void {
    const ref = this.dialog.open(VehiculoFormDialogComponent, {
      data: {},
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.vehiculoService.agregar(resultado).subscribe(() => {
        this.snackBar.open('Vehículo registrado correctamente', 'Cerrar', { duration: 2500 });
      });
    });
  }

  editar(vehiculo: Vehiculo): void {
    const ref = this.dialog.open(VehiculoFormDialogComponent, {
      data: { vehiculo },
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.vehiculoService.actualizar(vehiculo.id, resultado).subscribe(() => {
        this.snackBar.open('Vehículo actualizado correctamente', 'Cerrar', { duration: 2500 });
      });
    });
  }

  eliminar(vehiculo: Vehiculo): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar vehículo',
      mensaje: `¿Seguro que deseas eliminar ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})? Esta acción no se puede deshacer.`
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.vehiculoService.eliminar(vehiculo.id).subscribe(() => {
        this.snackBar.open('Vehículo eliminado', 'Cerrar', { duration: 2500 });
      });
    });
  }

  claseEstado(estado: EstadoVehiculo): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'estado-disponible';
      case 'ALQUILADO':
        return 'estado-alquilado';
      default:
        return 'estado-mantenimiento';
    }
  }
}
