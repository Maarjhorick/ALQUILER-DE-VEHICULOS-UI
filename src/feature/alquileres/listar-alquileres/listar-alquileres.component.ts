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

import { Alquiler, EstadoAlquiler } from '../../../core/models/alquiler.model';
import { AlquilerService } from '../../../core/service/alquiler.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AlquilerFormDialogComponent } from '../alquiler-form-dialog/alquiler-form-dialog.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

type FiltroEstado = 'TODOS' | EstadoAlquiler;

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
export class ListarAlquileresComponent {
  private readonly alquilerService = inject(AlquilerService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = ['cliente', 'vehiculo', 'fechas', 'total', 'estado', 'acciones'];

  readonly busqueda = signal('');
  readonly filtroEstado = signal<FiltroEstado>('TODOS');

  readonly alquileres = this.alquilerService.alquileres;

  readonly alquileresFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.alquileres().filter((a) => {
      const coincideTexto =
        !texto ||
        `${a.clienteNombre} ${a.vehiculoNombre}`.toLowerCase().includes(texto);
      const coincideEstado = estado === 'TODOS' || a.estado === estado;
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
    const ref = this.dialog.open(AlquilerFormDialogComponent, {
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.alquilerService.agregar(resultado).subscribe(() => {
        this.snackBar.open('Alquiler registrado correctamente', 'Cerrar', { duration: 2500 });
      });
    });
  }

  finalizar(alquiler: Alquiler): void {
    const data: ConfirmDialogData = {
      titulo: 'Finalizar alquiler',
      mensaje: `¿Marcar como finalizado el alquiler de ${alquiler.clienteNombre}? El vehículo quedará disponible nuevamente.`,
      textoConfirmar: 'Finalizar'
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.alquilerService.cambiarEstado(alquiler.id, 'FINALIZADO');
      this.snackBar.open('Alquiler finalizado', 'Cerrar', { duration: 2500 });
    });
  }

  cancelar(alquiler: Alquiler): void {
    const data: ConfirmDialogData = {
      titulo: 'Cancelar alquiler',
      mensaje: `¿Seguro que deseas cancelar el alquiler de ${alquiler.clienteNombre}?`,
      textoConfirmar: 'Cancelar alquiler'
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.alquilerService.cambiarEstado(alquiler.id, 'CANCELADO');
      this.snackBar.open('Alquiler cancelado', 'Cerrar', { duration: 2500 });
    });
  }

  eliminar(alquiler: Alquiler): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar alquiler',
      mensaje: `¿Deseas eliminar el registro del alquiler de ${alquiler.clienteNombre}? Esta acción no se puede deshacer.`
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.alquilerService.eliminar(alquiler.id).subscribe(() => {
        this.snackBar.open('Alquiler eliminado', 'Cerrar', { duration: 2500 });
      });
    });
  }

  claseEstado(estado: EstadoAlquiler): string {
    switch (estado) {
      case 'ACTIVO':
        return 'estado-activo';
      case 'FINALIZADO':
        return 'estado-finalizado';
      default:
        return 'estado-cancelado';
    }
  }
}
