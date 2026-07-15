import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Cliente } from '../../../core/models/cliente.model';
import { AuthService } from '../../../core/service/auth.service';
import { ClienteService } from '../../../core/service/cliente.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClienteFormDialogComponent } from '../cliente-form-dialog/cliente-form-dialog.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-listar-clientes',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    BackButtonComponent
],
  templateUrl: './listar-clientes.component.html',
  styleUrl: './listar-clientes.component.css'
})
export class ListarClientesComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  readonly esAdmin = computed(() => this.authService.rolActual() === 'ADMIN');

  readonly columnas = ['cliente', 'documento', 'contacto', 'licencia', 'acciones'];

  readonly busqueda = signal('');
  readonly clientes = this.clienteService.clientes;

  readonly clientesFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    if (!texto) return this.clientes();

    return this.clientes().filter((c) =>
      `${c.nombres} ${c.apellidos} ${c.numeroDocumento} ${c.email}`.toLowerCase().includes(texto)
    );
  });

  ngOnInit(): void {
    this.clienteService.cargar();
  }

  buscar(valor: string): void {
    this.busqueda.set(valor);
  }

  abrirNuevo(): void {
    const ref = this.dialog.open(ClienteFormDialogComponent, {
      data: {},
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.clienteService.agregar(resultado).subscribe({
        next: () => this.snackBar.open('Cliente registrado correctamente', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'registrar')
      });
    });
  }

  editar(cliente: Cliente): void {
    const ref = this.dialog.open(ClienteFormDialogComponent, {
      data: { cliente },
      width: '600px'
    });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.clienteService.actualizar(cliente.idCliente!, resultado).subscribe({
        next: () => this.snackBar.open('Cliente actualizado correctamente', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'actualizar')
      });
    });
  }

  eliminar(cliente: Cliente): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar cliente',
      mensaje: `¿Seguro que deseas eliminar a ${cliente.nombres} ${cliente.apellidos}? Esta acción no se puede deshacer.`
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.clienteService.eliminar(cliente.idCliente!).subscribe({
        next: () => this.snackBar.open('Cliente eliminado', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'eliminar')
      });
    });
  }

  iniciales(cliente: Cliente): string {
    return `${cliente.nombres.charAt(0)}${cliente.apellidos.charAt(0)}`.toUpperCase();
  }

  private mostrarError(err: any, accion: string): void {
    const mensaje = err?.error?.message || err?.error || `No se pudo ${accion} el cliente.`;
    this.snackBar.open(typeof mensaje === 'string' ? mensaje : `No se pudo ${accion} el cliente.`, 'Cerrar', { duration: 3500 });
  }
}