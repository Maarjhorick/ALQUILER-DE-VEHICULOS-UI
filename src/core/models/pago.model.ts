import { Alquiler } from './alquiler.model';

export interface MetodoPagoCatalogo {
  idMetodoPago: number;
  nombreMetodo: string;
}

export interface Pago {
  idPago?: number;
  alquiler: Alquiler;
  metodoPago: MetodoPagoCatalogo;
  montoTotal: number;
  fechaPago: string;
  estadoPago: string;
}