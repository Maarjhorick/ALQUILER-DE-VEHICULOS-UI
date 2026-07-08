import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { EstadoVehiculo, Vehiculo } from '../models/vehiculo.model';

// TODO: cuando el back (Spring Boot) esté disponible, reemplazar el arreglo
// en memoria por llamadas HTTP usando `inject(HttpClient)` contra
// `${apiUrl}/vehiculos`, manteniendo la misma interfaz pública del servicio.

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly _vehiculos = signal<Vehiculo[]>([
    { id: 1, marca: 'Toyota', modelo: 'Yaris', placa: 'ABC-123', anio: 2023, tipo: 'Sedán', precioPorDia: 120, estado: 'DISPONIBLE', imagenUrl: 'https://picsum.photos/seed/yaris/480/300' },
    { id: 2, marca: 'Hyundai', modelo: 'Tucson', placa: 'BSD-456', anio: 2022, tipo: 'SUV', precioPorDia: 180, estado: 'ALQUILADO', imagenUrl: 'https://picsum.photos/seed/tucson/480/300' },
    { id: 3, marca: 'Kia', modelo: 'Rio', placa: 'CJT-789', anio: 2021, tipo: 'Hatchback', precioPorDia: 100, estado: 'DISPONIBLE', imagenUrl: 'https://picsum.photos/seed/rio/480/300' },
    { id: 4, marca: 'Chevrolet', modelo: 'N400', placa: 'DPL-321', anio: 2020, tipo: 'Furgoneta', precioPorDia: 150, estado: 'MANTENIMIENTO', imagenUrl: 'https://picsum.photos/seed/n400/480/300' },
    { id: 5, marca: 'Suzuki', modelo: 'Swift', placa: 'ETX-654', anio: 2023, tipo: 'Hatchback', precioPorDia: 95, estado: 'DISPONIBLE', imagenUrl: 'https://picsum.photos/seed/swift/480/300' },
    { id: 6, marca: 'Toyota', modelo: 'Hilux', placa: 'FGH-987', anio: 2022, tipo: 'Camioneta', precioPorDia: 220, estado: 'ALQUILADO', imagenUrl: 'https://picsum.photos/seed/hilux/480/300' }
  ]);

  readonly vehiculos = this._vehiculos.asReadonly();

  readonly disponibles = computed(
    () => this._vehiculos().filter((v) => v.estado === 'DISPONIBLE').length
  );

  listar(): Observable<Vehiculo[]> {
    return of(this._vehiculos()).pipe(delay(300));
  }

  agregar(vehiculo: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    const nuevo: Vehiculo = { ...vehiculo, id: this.generarId() };
    this._vehiculos.update((lista) => [nuevo, ...lista]);
    return of(nuevo).pipe(delay(300));
  }

  actualizar(id: number, cambios: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    const actualizado: Vehiculo = { ...cambios, id };
    this._vehiculos.update((lista) =>
      lista.map((v) => (v.id === id ? actualizado : v))
    );
    return of(actualizado).pipe(delay(300));
  }

  cambiarEstado(id: number, estado: EstadoVehiculo): void {
    this._vehiculos.update((lista) =>
      lista.map((v) => (v.id === id ? { ...v, estado } : v))
    );
  }

  eliminar(id: number): Observable<boolean> {
    this._vehiculos.update((lista) => lista.filter((v) => v.id !== id));
    return of(true).pipe(delay(200));
  }

  private generarId(): number {
    const ids = this._vehiculos().map((v) => v.id);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }
}
