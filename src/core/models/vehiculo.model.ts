import { Combustible, EstadoVehiculoCatalogo, Modelo, TipoVehiculo } from './catalogo.model';

export interface Vehiculo {
  idVehiculo?: number;
  placa: string;
  color: string;
  anio: number;
  numeroMotor: string;
  numeroVin: string;
  precioDia: number;
  precioHora: number;
  modelo: Modelo;
  tipo: TipoVehiculo;
  combustible: Combustible;
  estado: EstadoVehiculoCatalogo;
}