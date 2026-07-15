import { NgClass } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Alquiler } from '../../../core/models/alquiler.model';
import { AlquilerService } from '../../../core/service/alquiler.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AlquilerFormDialogComponent, NuevoAlquilerResultado } from '../alquiler-form-dialog/alquiler-form-dialog.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

type FiltroEstado = 'TODOS' | 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

@Component({
  selector: 'app-listar-alquileres',
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
  templateUrl: './listar-alquileres.component.html',
  styleUrl: './listar-alquileres.component.css'
})
export class ListarAlquileresComponent implements OnInit {
  private readonly alquilerService = inject(AlquilerService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['cliente', 'vehiculo', 'fechas', 'estado', 'acciones'];

  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('TODOS');

  readonly alquileres = this.alquilerService.alquileres;

  readonly alquileresFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.alquileres().filter((a) => {
      const nombreCliente = `${a.cliente?.nombres ?? ''} ${a.cliente?.apellidos ?? ''}`;
      const nombreVehiculo = `${a.vehiculo?.modelo?.marca?.nombreMarca ?? ''} ${a.vehiculo?.modelo?.modelo ?? ''}`;
      const coincideTexto = !texto || `${nombreCliente} ${nombreVehiculo}`.toLowerCase().includes(texto);
      const coincideEstado = estado === 'TODOS' || a.estado?.nombreEstado === estado;
      return coincideTexto && coincideEstado;
    });
  });

  ngOnInit(): void {
    this.alquilerService.cargar();
  }

  buscar(valor: string): void {
    this.busqueda.set(valor);
  }

  filtrarPorEstado(estado: FiltroEstado): void {
    this.filtroEstado.set(estado);
  }

  abrirNuevo(): void {
    const ref = this.dialog.open(AlquilerFormDialogComponent, {
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado: NuevoAlquilerResultado | undefined) => {
      if (!resultado) return;

      this.alquilerService
        .agregar(resultado.idCliente, resultado.idVehiculo, resultado.fechaInicio, resultado.fechaFin)
        .subscribe({
          next: () => this.snackBar.open('Alquiler registrado correctamente', 'Cerrar', { duration: 2500 }),
          error: (err) => this.mostrarError(err, 'registrar el alquiler')
        });
    });
  }

  finalizar(alquiler: Alquiler): void {
    const data: ConfirmDialogData = {
      titulo: 'Finalizar alquiler',
      mensaje: `¿Marcar como finalizado el alquiler de ${alquiler.cliente?.nombres} ${alquiler.cliente?.apellidos}? El vehículo quedará disponible nuevamente.`,
      textoConfirmar: 'Finalizar'
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      const hoy = new Date().toISOString().slice(0, 10);

      this.alquilerService.finalizar(alquiler.idAlquiler!, hoy).subscribe({
        next: () => this.snackBar.open('Alquiler finalizado', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'finalizar el alquiler')
      });
    });
  }

  cancelar(alquiler: Alquiler): void {
    const data: ConfirmDialogData = {
      titulo: 'Cancelar alquiler',
      mensaje: `¿Seguro que deseas cancelar el alquiler de ${alquiler.cliente?.nombres} ${alquiler.cliente?.apellidos}?`,
      textoConfirmar: 'Cancelar alquiler'
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.alquilerService.cancelar(alquiler.idAlquiler!).subscribe({
        next: () => this.snackBar.open('Alquiler cancelado', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'cancelar el alquiler')
      });
    });
  }

  claseEstado(nombreEstado: string | undefined): string {
    switch (nombreEstado) {
      case 'ACTIVO':
        return 'estado-activo';
      case 'FINALIZADO':
        return 'estado-finalizado';
      default:
        return 'estado-cancelado';
    }
  }

  private mostrarError(err: any, accion: string): void {
    const mensaje = err?.error?.message || err?.error || `No se pudo ${accion}.`;
    this.snackBar.open(typeof mensaje === 'string' ? mensaje : `No se pudo ${accion}.`, 'Cerrar', { duration: 3500 });
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