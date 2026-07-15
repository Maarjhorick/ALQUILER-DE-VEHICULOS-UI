import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  private readonly clientesSignal = signal<Cliente[]>([]);
  readonly clientes = this.clientesSignal.asReadonly();

  cargar(): void {
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (data) => this.clientesSignal.set(data),
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }
  listarTodos(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(this.apiUrl);
}

  agregar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      tap(() => this.cargar())
    );
  }

  actualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente).pipe(
      tap(() => this.cargar())
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cargar())
    );
  }
}