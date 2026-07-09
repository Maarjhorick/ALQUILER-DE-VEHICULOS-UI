export type EstadoVehiculo = 'DISPONIBLE' | 'ALQUILADO' | 'MANTENIMIENTO';

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  anio: number;
  tipo: string;
  precioPorDia: number;
  estado: EstadoVehiculo;
  imagenUrl?: string;
}