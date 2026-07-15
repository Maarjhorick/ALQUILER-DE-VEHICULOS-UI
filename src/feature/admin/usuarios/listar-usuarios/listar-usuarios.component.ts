import { NgClass } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Usuario } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/service/auth.service';
import { UsuarioService } from '../../../../core/service/usuario.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsuarioFormDialogComponent } from '../usuario-form-dialog/usuario-form-dialog.component';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-listar-usuarios',
  imports: [
    NgClass,
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
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  readonly columnas = ['usuario', 'rol', 'estado', 'acciones'];

  readonly busqueda = signal('');
  readonly usuarios = this.usuarioService.usuarios;
  readonly miUsuario = computed(() => this.authService.usuarioActual()?.username);

  readonly usuariosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();

    if (!texto) return this.usuarios();

    return this.usuarios().filter((u) =>
      `${u.username} ${u.rol?.nombreRol}`.toLowerCase().includes(texto)
    );
  });

  ngOnInit(): void {
    this.usuarioService.cargar();
  }

  buscar(valor: string): void {
    this.busqueda.set(valor);
  }

  abrirNuevo(): void {
    const ref = this.dialog.open(UsuarioFormDialogComponent, { width: '520px' });

    ref.afterClosed().subscribe((resultado) => {
      if (!resultado) return;

      this.usuarioService.crear(resultado).subscribe({
        next: () => this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'crear el usuario')
      });
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const activar = !usuario.estado;

    const data: ConfirmDialogData = {
      titulo: activar ? 'Activar usuario' : 'Desactivar usuario',
      mensaje: activar
        ? `¿Activar a ${usuario.username}? Podrá volver a iniciar sesión.`
        : `¿Desactivar a ${usuario.username}? No podrá iniciar sesión hasta que lo reactives. Su historial no se borra.`
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '420px' });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;

      this.usuarioService.cambiarEstado(usuario.idUsuario!, activar).subscribe({
        next: () => this.snackBar.open(activar ? 'Usuario activado' : 'Usuario desactivado', 'Cerrar', { duration: 2500 }),
        error: (err) => this.mostrarError(err, 'actualizar el usuario')
      });
    });
  }

  claseEstado(estado: boolean): string {
    return estado ? 'estado-activo' : 'estado-inactivo';
  }

  private mostrarError(err: any, accion: string): void {
    const mensaje = err?.error?.message || err?.error || `No se pudo ${accion}.`;
    this.snackBar.open(typeof mensaje === 'string' ? mensaje : `No se pudo ${accion}.`, 'Cerrar', { duration: 3500 });
  }
}