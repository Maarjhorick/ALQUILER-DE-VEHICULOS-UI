import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { VehiculoService } from '../../../core/service/vehiculo.service';

@Component({
  selector: 'app-catalogo-vehiculos',
  imports: [RouterLink, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './catalogo-vehiculos.component.html',
  styleUrl: './catalogo-vehiculos.component.css'
})
export class CatalogoVehiculosComponent {
  private readonly vehiculoService = inject(VehiculoService);

  readonly filtroTipo = signal('TODOS');

  readonly tipos = computed(() => {
    const tipos = new Set(this.vehiculoService.vehiculos().map((v) => v.tipo));
    return ['TODOS', ...tipos];
  });

  // Vista pública: solo mostramos vehículos disponibles, sin datos de
  // gestión interna (sin placa visible como dato principal, sin acciones
  // de editar/eliminar). Esto es independiente de ListarVehiculosComponent,
  // que es exclusivo para empleados/administradores.
  readonly vehiculosPublicos = computed(() => {
    const tipo = this.filtroTipo();

    return this.vehiculoService
      .vehiculos()
      .filter((v) => v.estado === 'DISPONIBLE')
      .filter((v) => tipo === 'TODOS' || v.tipo === tipo);
  });

  filtrarPorTipo(tipo: string): void {
    this.filtroTipo.set(tipo);
  }
}