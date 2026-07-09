import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mostrarMenuAutenticado = computed(() => this.authService.estaAutenticado());
  readonly esAdmin = computed(() => this.authService.rolActual() === 'ADMIN');
  readonly esEmpleado = computed(() => this.authService.rolActual() === 'EMPLEADO');
  readonly esCliente = computed(() => this.authService.rolActual() === 'CLIENTE');

  readonly dashboardPrincipal = computed(() => {
    const rol = this.authService.rolActual();
    if (rol === 'ADMIN') return '/admin';
    if (rol === 'EMPLEADO') return '/empleado';
    if (rol === 'CLIENTE') return '/cliente';
    return '/';
  });

  irAInicio(): void {
    this.router.navigate([this.dashboardPrincipal()]);
  }

  cerrarSesion(): void {
    this.authService.logout('/');
  }
}
