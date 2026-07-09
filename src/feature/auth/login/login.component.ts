import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ocultarPassword = true;
  cargando = false;
  error = '';

  loginForm = this.fb.nonNullable.group({
  username: ['', [Validators.required]],
  password: ['', [Validators.required]]
});

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        const destino = (response.rol === 'EMPLEADO' || response.rol === 'ADMIN') ? '/empleado' : '/';

    this.router.navigate([destino]).then((exito) => {
      this.cargando = false;

      if (!exito) {
        console.error('La navegación a', destino, 'no se completó. Revisa la consola arriba por errores.');
        this.error = 'No se pudo abrir el panel. Revisa la consola del navegador (F12).';
      }
    }).catch((err) => {
      this.cargando = false;
      console.error('Error de navegación:', err);
      this.error = 'Ocurrió un error al abrir el panel.';
    });
  },
  error: () => {
    this.error = 'Usuario o contraseña incorrectos.';
    this.cargando = false;
  }
});
  }
}