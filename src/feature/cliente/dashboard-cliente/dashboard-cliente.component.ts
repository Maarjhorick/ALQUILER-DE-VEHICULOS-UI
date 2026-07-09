import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AlquilerService } from '../../../core/service/alquiler.service';
import { VehiculoService } from '../../../core/service/vehiculo.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent {
  private readonly vehiculoService = inject(VehiculoService);
  private readonly alquilerService = inject(AlquilerService);

  readonly vehiculosDisponibles = computed(
    () => this.vehiculoService.vehiculos().filter((v) => v.estado?.nombreEstado === 'DISPONIBLE').length
  );
  readonly reservasActivas = computed(
    () => this.alquilerService.alquileres().filter((alquiler) => alquiler.estado === 'ACTIVO').length
  );
}
