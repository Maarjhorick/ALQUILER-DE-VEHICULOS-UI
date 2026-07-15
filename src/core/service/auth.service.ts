import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UsuarioSesion } from '../models/auth.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'paulcars_token';
  private readonly userKey = 'paulcars_user';

  private readonly usuarioSignal = signal<UsuarioSesion | null>(this.getStoredUser());

  readonly usuarioActual = computed(() => this.usuarioSignal());
  readonly estaAutenticado = computed(() => !!this.usuarioSignal());
  readonly rolActual = computed(() => this.usuarioSignal()?.rol ?? null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap((response) => this.guardarSesion(response))
  );
}

  logout(redirectTo: string = '/login'): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.usuarioSignal.set(null);
    this.router.navigate([redirectTo]);
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
    const usuario: UsuarioSesion = (response as any).usuario ?? { username: (response as any).username, rol: (response as any).rol };
    localStorage.setItem(this.userKey, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  private getStoredUser(): UsuarioSesion | null {
    const stored = localStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) as UsuarioSesion : null;
  }
}