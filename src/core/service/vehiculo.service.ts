import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/vehiculos`;

  private readonly vehiculosSignal = signal<Vehiculo[]>([]);
  readonly vehiculos = this.vehiculosSignal.asReadonly();

  cargar(): void {
    this.http.get<Vehiculo[]>(this.apiUrl).subscribe({
      next: (data) => this.vehiculosSignal.set(data),
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }
  listarTodos(): Observable<Vehiculo[]> {
  return this.http.get<Vehiculo[]>(this.apiUrl);
}

  agregar(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.apiUrl, vehiculo).pipe(
      tap(() => this.cargar())
    );
  }

  actualizar(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/${id}`, vehiculo).pipe(
      tap(() => this.cargar())
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cargar())
    );
  }
}