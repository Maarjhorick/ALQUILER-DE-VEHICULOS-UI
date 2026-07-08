export type EstadoAlquiler = 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

export interface Alquiler {
  id: number;
  clienteId: number;
  clienteNombre: string;
  vehiculoId: number;
  vehiculoNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoAlquiler;
  total: number;
}
