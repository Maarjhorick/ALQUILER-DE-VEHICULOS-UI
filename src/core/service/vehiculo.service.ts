import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/vehiculos';

  private readonly vehiculosSignal = signal<Vehiculo[]>([]);
  readonly vehiculos = this.vehiculosSignal.asReadonly();

  cargar(): void {
    this.http.get<Vehiculo[]>(this.apiUrl).subscribe({
      next: (data) => this.vehiculosSignal.set(data),
      error: (err) => console.error('Error cargando vehículos:', err)
    });
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

  // TODO: temporal — cuando conectemos AlquilerService al backend real,
// este cambio de estado debe venir del propio backend (al crear/finalizar
// un alquiler), no desde el frontend llamando esto manualmente.
cambiarEstado(idVehiculo: number, nombreEstado: string): void {
  console.warn(
    `cambiarEstado('${nombreEstado}') para el vehículo ${idVehiculo} es temporal y no persiste en la BD todavía.`
  );
}
}