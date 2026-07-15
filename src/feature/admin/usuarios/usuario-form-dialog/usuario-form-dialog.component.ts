import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CrearUsuarioRequest, Rol } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/service/usuario.service';

@Component({
  selector: 'app-usuario-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './usuario-form-dialog.component.html',
  styleUrl: './usuario-form-dialog.component.css'
})
export class UsuarioFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UsuarioFormDialogComponent>);
  private readonly usuarioService = inject(UsuarioService);

  roles: Rol[] | null = null;

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rolNombre: ['EMPLEADO', [Validators.required]],
    emailRecuperacion: ['', [Validators.email]]
  });

  ngOnInit(): void {
    this.usuarioService.listarRoles().subscribe({
      next: (data) => (this.roles = data.filter((r) => r.nombreRol.toUpperCase() !== 'CLIENTE')),
      error: (err) => console.error('Error cargando roles:', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();

    const request: CrearUsuarioRequest = {
      username: valores.username,
      password: valores.password,
      rolNombre: valores.rolNombre,
      emailRecuperacion: valores.emailRecuperacion || undefined
    };

    this.dialogRef.close(request);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}