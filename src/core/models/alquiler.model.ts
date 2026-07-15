import { Cliente } from './cliente.model';
import { Vehiculo } from './vehiculo.model';

export interface EstadoAlquilerCatalogo {
  idEstadoAlquiler: number;
  nombreEstado: string;
}

export interface Alquiler {
  idAlquiler?: number;
  cliente: Cliente;
  vehiculo: Vehiculo;
  fechaReserva?: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaFinReal?: string | null;
  estado: EstadoAlquilerCatalogo;
}