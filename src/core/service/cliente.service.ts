import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Cliente } from '../models/cliente.model';

// TODO: reemplazar el arreglo en memoria por llamadas HTTP a
// `${apiUrl}/clientes` cuando el back de Spring Boot esté disponible.

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly _clientes = signal<Cliente[]>([
    { id: 1, nombres: 'Marjhorick', apellidos: 'Ventura', dni: '71234567', email: 'marjhorick@correo.com', telefono: '987654321', direccion: 'Av. Los Álamos 123, Lima' },
    { id: 2, nombres: 'Ana', apellidos: 'Torres', dni: '72345678', email: 'ana.torres@correo.com', telefono: '987112233', direccion: 'Jr. Las Rosas 456, Lima' },
    { id: 3, nombres: 'Luis', apellidos: 'Ramírez', dni: '73456789', email: 'luis.ramirez@correo.com', telefono: '987223344', direccion: 'Calle Sol 789, Callao' },
    { id: 4, nombres: 'Carla', apellidos: 'Mendoza', dni: '74567890', email: 'carla.mendoza@correo.com', telefono: '987334455', direccion: 'Av. Central 321, Lima' }
  ]);

  readonly clientes = this._clientes.asReadonly();

  listar(): Observable<Cliente[]> {
    return of(this._clientes()).pipe(delay(300));
  }

  agregar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    const nuevo: Cliente = { ...cliente, id: this.generarId() };
    this._clientes.update((lista) => [nuevo, ...lista]);
    return of(nuevo).pipe(delay(300));
  }

  actualizar(id: number, cambios: Omit<Cliente, 'id'>): Observable<Cliente> {
    const actualizado: Cliente = { ...cambios, id };
    this._clientes.update((lista) =>
      lista.map((c) => (c.id === id ? actualizado : c))
    );
    return of(actualizado).pipe(delay(300));
  }

  eliminar(id: number): Observable<boolean> {
    this._clientes.update((lista) => lista.filter((c) => c.id !== id));
    return of(true).pipe(delay(200));
  }

  private generarId(): number {
    const ids = this._clientes().map((c) => c.id);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }
}
