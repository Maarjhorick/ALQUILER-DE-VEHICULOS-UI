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
  email: ['', [Validators.required]],
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
      next: ({ usuario }) => {
  if (usuario.rol === 'EMPLEADO') {
    this.router.navigate(['/empleado']);
    return;
  }

  this.router.navigate(['/']);
},
error: () => {
  this.error = 'Solo puedes ingresar usando EMPLEADO como usuario.';
  this.cargando = false;
}
    });
  }
}