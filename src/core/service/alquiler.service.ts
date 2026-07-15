import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Alquiler } from '../models/alquiler.model';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private readonly http = inject(HttpClient);
private readonly apiUrl = `${environment.apiUrl}/alquileres`;

  private readonly alquileresSignal = signal<Alquiler[]>([]);
  readonly alquileres = this.alquileresSignal.asReadonly();

  cargar(): void {
    this.http.get<Alquiler[]>(this.apiUrl).subscribe({
      next: (data) => this.alquileresSignal.set(data),
      error: (err) => console.error('Error cargando alquileres:', err)
    });
  }

  agregar(idCliente: number, idVehiculo: number, fechaInicio: string, fechaFin: string): Observable<Alquiler> {
    const params = new HttpParams()
      .set('idCliente', idCliente)
      .set('idVehiculo', idVehiculo)
      .set('inicio', fechaInicio)
      .set('fin', fechaFin);

    return this.http.post<Alquiler>(this.apiUrl, null, { params }).pipe(
      tap(() => this.cargar())
    );
  }

  finalizar(idAlquiler: number, fechaFinReal: string): Observable<Alquiler> {
    const params = new HttpParams().set('fechaFinReal', fechaFinReal);

    return this.http.put<Alquiler>(`${this.apiUrl}/${idAlquiler}/finalizar`, null, { params }).pipe(
      tap(() => this.cargar())
    );
  }

  cancelar(idAlquiler: number): Observable<Alquiler> {
    return this.http.put<Alquiler>(`${this.apiUrl}/${idAlquiler}/cancelar`, null).pipe(
      tap(() => this.cargar())
    );
  }
}