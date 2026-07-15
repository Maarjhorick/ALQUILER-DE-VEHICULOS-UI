import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Vehiculo } from '../../../core/models/vehiculo.model';
import { VehiculoService } from '../../../core/service/vehiculo.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { VehiculoFormDialogComponent } from '../vehiculo-form-dialog/vehiculo-form-dialog.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { AuthService } from '../../../core/service/auth.service';

type FiltroEstado = 'TODOS' | string;

@Component({
  selector: 'app-listar-vehiculos',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    BackButtonComponent,
    MatChipListbox,
    MatChipOption
],
  templateUrl: './listar-vehiculos.component.html',
  styleUrl: './listar-vehiculos.component.css' 
})
export class ListarVehiculosComponent implements OnInit {
  private readonly vehiculoService = inject(VehiculoService);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly esAdmin = computed(() => this.authService.rolActual() === 'ADMIN');

  readonly columnas = ['vehiculo', 'placa', 'tipo', 'anio', 'precio', 'estado', 'acciones'];

  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('TODOS');

  readonly vehiculos = this.vehiculoService.vehiculos;

  readonly vehiculosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.vehiculos().filter((v) => {
      const marcaModelo = `${v.modelo?.marca?.nombreMarca ?? ''} ${v.modelo?.modelo ?? ''} ${v.placa ?? ''}`.toLowerCase();
      const coincideTexto = !texto || marcaModelo.includes(texto);
      const coincideEstado = estado === 'TODOS' || v.estado?.nombreEstado === estado;
      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.vehiculoService.cargar();
  }

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

      this.vehiculoService.agregar(resultado).subscribe({
        next: () => this.snackBar.open('Vehículo registrado correctamente', 'Cerrar', { duration: 2500 }),
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al registrar el vehículo', 'Cerrar', { duration: 3000 });
        }
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

      this.vehiculoService.actualizar(vehiculo.idVehiculo!, resultado).subscribe({
        next: () => this.snackBar.open('Vehículo actualizado correctamente', 'Cerrar', { duration: 2500 }),
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al actualizar el vehículo', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  eliminar(vehiculo: Vehiculo): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar vehículo',
      mensaje: `¿Seguro que deseas eliminar ${vehiculo.modelo?.marca?.nombreMarca} ${vehiculo.modelo?.modelo} (${vehiculo.placa})? Esta acción no se puede deshacer.`
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.vehiculoService.eliminar(vehiculo.idVehiculo!).subscribe({
        next: () => this.snackBar.open('Vehículo eliminado', 'Cerrar', { duration: 2500 }),
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar el vehículo', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  claseEstado(estado?: string): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'estado-disponible';
      case 'NO DISPONIBLE':
        return 'estado-mantenimiento';
      default:
        return 'estado-alquilado';
    }
  }

  iconoPorTipo(nombreTipo?: string): string {
    switch ((nombreTipo ?? '').toUpperCase()) {
      case 'SUV':
        return 'directions_car_filled';
      case 'PICKUP':
        return 'local_shipping';
      case 'HATCHBACK':
        return 'time_to_leave';
      case 'SEDAN':
      default:
        return 'directions_car';
    }
  }

  private readonly coloresConocidos: Record<string, string> = {
    blanco: '#eef1f5',
    negro: '#dfe3e8',
    gris: '#e4e7ec',
    plomo: '#e4e7ec',
    plata: '#e9edf2',
    rojo: '#fde2e1',
    azul: '#dfeaff',
    verde: '#e1f5ea',
    amarillo: '#fff6d9',
    naranja: '#ffe8d6',
    marron: '#efe3d6',
    beige: '#f4efe4'
  };

  colorFondo(color?: string): string {
    const clave = (color ?? '').trim().toLowerCase();
    return this.coloresConocidos[clave] ?? '#e8f1ff';
  }
}