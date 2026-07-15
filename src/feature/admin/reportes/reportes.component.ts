import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { AlquilerService } from '../../../core/service/alquiler.service';
import { PagoService } from '../../../core/service/pago.service';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

interface FilaFlota {
  nombre: string;
  placa: string;
  totalAlquileres: number;
}

@Component({
  selector: 'app-reportes',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    BackButtonComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  private readonly alquilerService = inject(AlquilerService);
  private readonly pagoService = inject(PagoService);

  readonly alquileres = this.alquilerService.alquileres;
  readonly pagos = this.pagoService.pagos;

  readonly desde = signal('');
  readonly hasta = signal('');

  readonly columnasFlota = ['vehiculo', 'placa', 'total'];
  readonly columnasPendientes = ['cliente', 'vehiculo', 'fechas', 'estado'];

  readonly ingresosTotales = computed(() =>
    this.pagos().reduce((suma, p) => suma + Number(p.montoTotal), 0)
  );

  readonly ingresosPorMetodo = computed(() => {
    const mapa = new Map<string, number>();
    for (const pago of this.pagos()) {
      const nombre = pago.metodoPago?.nombreMetodo ?? 'Sin especificar';
      mapa.set(nombre, (mapa.get(nombre) ?? 0) + Number(pago.montoTotal));
    }
    return Array.from(mapa.entries()).map(([metodo, total]) => ({ metodo, total }));
  });

  readonly alquileresEnPeriodo = computed(() => {
    const desde = this.desde();
    const hasta = this.hasta();

    if (!desde && !hasta) return this.alquileres();

    return this.alquileres().filter((a) => {
      const inicio = a.fechaInicio;
      const despuesDeDesde = !desde || inicio >= desde;
      const antesDeHasta = !hasta || inicio <= hasta;
      return despuesDeDesde && antesDeHasta;
    });
  });

  readonly ingresosEnPeriodo = computed(() => {
    const desde = this.desde();
    const hasta = this.hasta();

    if (!desde && !hasta) return this.ingresosTotales();

    return this.pagos()
      .filter((p) => {
        const fecha = p.fechaPago;
        const despuesDeDesde = !desde || fecha >= desde;
        const antesDeHasta = !hasta || fecha <= hasta;
        return despuesDeDesde && antesDeHasta;
      })
      .reduce((suma, p) => suma + Number(p.montoTotal), 0);
  });

  aplicarFiltro(desde: string, hasta: string): void {
    this.desde.set(desde);
    this.hasta.set(hasta);
  }

  limpiarFiltro(): void {
    this.desde.set('');
    this.hasta.set('');
  }

  readonly flotaMasAlquilada = computed<FilaFlota[]>(() => {
    const conteo = new Map<number, FilaFlota>();

    for (const a of this.alquileres()) {
      const vehiculo = a.vehiculo;
      if (!vehiculo?.idVehiculo) continue;

      const existente = conteo.get(vehiculo.idVehiculo);
      if (existente) {
        existente.totalAlquileres++;
      } else {
        conteo.set(vehiculo.idVehiculo, {
          nombre: `${vehiculo.modelo?.marca?.nombreMarca ?? ''} ${vehiculo.modelo?.modelo ?? ''}`.trim(),
          placa: vehiculo.placa,
          totalAlquileres: 1
        });
      }
    }

    return Array.from(conteo.values())
      .sort((a, b) => b.totalAlquileres - a.totalAlquileres)
      .slice(0, 5);
  });

  readonly pagosPendientes = computed(() => {
    const idsConPago = new Set(this.pagos().map((p) => p.alquiler?.idAlquiler));

    return this.alquileres().filter(
      (a) => a.estado?.nombreEstado !== 'CANCELADO' && !idsConPago.has(a.idAlquiler)
    );
  });

  ngOnInit(): void {
    this.alquilerService.cargar();
    this.pagoService.cargar();
  }
}