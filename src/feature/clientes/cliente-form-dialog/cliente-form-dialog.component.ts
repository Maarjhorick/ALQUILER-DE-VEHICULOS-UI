import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Cliente } from '../../../core/models/cliente.model';

export interface ClienteDialogData {
  cliente?: Cliente;
}

@Component({
  selector: 'app-cliente-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './cliente-form-dialog.component.html',
  styleUrl: './cliente-form-dialog.component.css'
})
export class ClienteFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ClienteFormDialogComponent>);
  readonly data: ClienteDialogData = inject(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data?.cliente;

  form = this.fb.nonNullable.group({
    nombres: [this.data?.cliente?.nombres ?? '', [Validators.required, Validators.minLength(2)]],
    apellidos: [this.data?.cliente?.apellidos ?? '', [Validators.required, Validators.minLength(2)]],
    dni: [
      this.data?.cliente?.dni ?? '',
      [Validators.required, Validators.pattern(/^\d{8}$/)]
    ],
    email: [this.data?.cliente?.email ?? '', [Validators.required, Validators.email]],
    telefono: [
      this.data?.cliente?.telefono ?? '',
      [Validators.required, Validators.pattern(/^\d{9}$/)]
    ],
    direccion: [this.data?.cliente?.direccion ?? '', [Validators.required]]
  });

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
