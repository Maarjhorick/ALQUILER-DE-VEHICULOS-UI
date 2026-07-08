import { Injectable, inject, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Alquiler, EstadoAlquiler } from '../models/alquiler.model';
import { VehiculoService } from './vehiculo.service';

// TODO: reemplazar el arreglo en memoria por llamadas HTTP a
// `${apiUrl}/alquileres` cuando el back de Spring Boot esté disponible.

export interface NuevoAlquiler {
  clienteId: number;
  clienteNombre: string;
  vehiculoId: number;
  vehiculoNombre: string;
  fechaInicio: string;
  fechaFin: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {
  private readonly vehiculoService = inject(VehiculoService);

  private readonly _alquileres = signal<Alquiler[]>([
    { id: 1, clienteId: 1, clienteNombre: 'Marjhorick Ventura', vehiculoId: 2, vehiculoNombre: 'Hyundai Tucson', fechaInicio: '2026-07-01', fechaFin: '2026-07-05', estado: 'ACTIVO', total: 720 },
    { id: 2, clienteId: 2, clienteNombre: 'Ana Torres', vehiculoId: 6, vehiculoNombre: 'Toyota Hilux', fechaInicio: '2026-06-20', fechaFin: '2026-06-25', estado: 'FINALIZADO', total: 1100 },
    { id: 3, clienteId: 3, clienteNombre: 'Luis Ramírez', vehiculoId: 1, vehiculoNombre: 'Toyota Yaris', fechaInicio: '2026-07-10', fechaFin: '2026-07-12', estado: 'ACTIVO', total: 240 }
  ]);

  readonly alquileres = this._alquileres.asReadonly();

  listar(): Observable<Alquiler[]> {
    return of(this._alquileres()).pipe(delay(300));
  }

  agregar(datos: NuevoAlquiler): Observable<Alquiler> {
    const nuevo: Alquiler = {
      ...datos,
      id: this.generarId(),
      estado: 'ACTIVO'
    };

    this._alquileres.update((lista) => [nuevo, ...lista]);
    this.vehiculoService.cambiarEstado(datos.vehiculoId, 'ALQUILADO');

    return of(nuevo).pipe(delay(300));
  }

  cambiarEstado(id: number, estado: EstadoAlquiler): void {
    const alquiler = this._alquileres().find((a) => a.id === id);

    this._alquileres.update((lista) =>
      lista.map((a) => (a.id === id ? { ...a, estado } : a))
    );

    if (alquiler && (estado === 'FINALIZADO' || estado === 'CANCELADO')) {
      this.vehiculoService.cambiarEstado(alquiler.vehiculoId, 'DISPONIBLE');
    }
  }

  eliminar(id: number): Observable<boolean> {
    this._alquileres.update((lista) => lista.filter((a) => a.id !== id));
    return of(true).pipe(delay(200));
  }

  private generarId(): number {
    const ids = this._alquileres().map((a) => a.id);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }
}
