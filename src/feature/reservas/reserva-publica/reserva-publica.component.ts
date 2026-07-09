import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AlquilerService } from '../../../core/service/alquiler.service';
import { ClienteService } from '../../../core/service/cliente.service';
import { VehiculoService } from '../../../core/service/vehiculo.service';

@Component({
  selector: 'app-reserva-publica',
  standalone: true,
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './reserva-publica.component.html',
  styleUrl: './reserva-publica.component.css'
})
export class ReservaPublicaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly vehiculoService = inject(VehiculoService);
  private readonly clienteService = inject(ClienteService);
  private readonly alquilerService = inject(AlquilerService);

  readonly enviado = signal(false);
  readonly vehiculosDisponibles = computed(() =>
    this.vehiculoService.vehiculos().filter((vehiculo) => vehiculo.estado?.nombreEstado === 'DISPONIBLE')
  );

  reserva = {
    vehiculoId: Number(this.route.snapshot.queryParamMap.get('vehiculoId')) || 0,
    fechaInicio: '',
    fechaFin: '',
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  readonly vehiculoSeleccionado = computed(() =>
    this.vehiculosDisponibles().find((vehiculo) => vehiculo.idVehiculo === Number(this.reserva.vehiculoId))
  );

  calcularTotal(): number {
    const vehiculo = this.vehiculoSeleccionado();
    const inicio = new Date(this.reserva.fechaInicio);
    const fin = new Date(this.reserva.fechaFin);

    if (!vehiculo || !this.reserva.fechaInicio || !this.reserva.fechaFin || fin <= inicio) {
      return 0;
    }

    const dias = Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / 86_400_000));
    return dias * vehiculo.precioDia;
  }

  registrar(form: NgForm): void {
    if (form.invalid || !this.vehiculoSeleccionado() || this.calcularTotal() <= 0) {
      form.control.markAllAsTouched();
      return;
    }

    const vehiculo = this.vehiculoSeleccionado();
    if (!vehiculo) return;

    this.clienteService.agregar({
      nombres: this.reserva.nombres,
      apellidos: this.reserva.apellidos,
      dni: this.reserva.dni,
      email: this.reserva.email,
      telefono: this.reserva.telefono,
      direccion: this.reserva.direccion
    }).subscribe((cliente) => {
      this.alquilerService.agregar({
        clienteId: cliente.id,
        clienteNombre: `${cliente.nombres} ${cliente.apellidos}`,
        vehiculoId:  vehiculo.idVehiculo!,
        vehiculoNombre: `${vehiculo.modelo?.marca?.nombreMarca ?? ''} ${vehiculo.modelo?.modelo ?? ''}`.trim(),
        fechaInicio: this.reserva.fechaInicio,
        fechaFin: this.reserva.fechaFin,
        total: this.calcularTotal()
      }).subscribe(() => {
        this.enviado.set(true);
        form.resetForm();
      });
    });
  }
}
