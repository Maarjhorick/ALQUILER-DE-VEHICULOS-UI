import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
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

  // La página de inicio siempre mostrara el header público,
  // sin importar si el usuario ya inició sesión.
  private readonly urlActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  private readonly esPaginaInicio = computed(() => this.urlActual() === '/');

  readonly mostrarMenuAutenticado = computed(
    () => this.authService.estaAutenticado() && !this.esPaginaInicio()
  );

  // Al hacer click en el logo: si hay sesión activa, se cierra y se va al inicio
  // ya como usuario público. Si no hay sesión, simplemente navega al inicio.
  irAInicio(): void {
    if (this.authService.estaAutenticado()) {
      this.authService.logout('/');
    } else {
      this.router.navigate(['/']);
    }
  }
}