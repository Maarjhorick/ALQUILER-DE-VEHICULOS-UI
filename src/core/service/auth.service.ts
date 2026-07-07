import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UsuarioSesion } from '../models/auth.models';

import { Observable, of, throwError, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'paulcars_token';
  private readonly userKey = 'paulcars_user';

  private readonly usuarioSignal = signal<UsuarioSesion | null>(this.getStoredUser());

  readonly usuarioActual = computed(() => this.usuarioSignal());
  readonly estaAutenticado = computed(() => !!this.getToken());
  readonly rolActual = computed(() => this.usuarioSignal()?.rol ?? null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
  const usuario = credentials.email.trim().toUpperCase();

  if (usuario !== 'EMPLEADO') {
    return throwError(() => new Error('Credenciales incorrectas'));
  }

  const response: LoginResponse = {
    token: 'token-simulado-empleado',
    usuario: {
      id: 1,
      nombres: 'Empleado',
      email: 'EMPLEADO',
      rol: 'EMPLEADO'
    }
  };

  return of(response).pipe(
    delay(500),
    tap((response) => this.guardarSesion(response))
  );
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.usuarioSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  tieneRol(rolesPermitidos: string[]): boolean {
    const rol = this.rolActual();
    return !!rol && rolesPermitidos.includes(rol);
  }

  private guardarSesion(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
    this.usuarioSignal.set(response.usuario);
  }

  private getStoredUser(): UsuarioSesion | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) as UsuarioSesion : null;
  }
}