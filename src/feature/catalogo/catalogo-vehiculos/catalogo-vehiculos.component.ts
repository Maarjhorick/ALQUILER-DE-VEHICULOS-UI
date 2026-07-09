import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
export class CatalogoVehiculosComponent implements OnInit {
  private readonly vehiculoService = inject(VehiculoService);

  readonly filtroTipo = signal('TODOS');

  readonly tipos = computed(() => {
    const tipos = new Set(
      this.vehiculoService.vehiculos().map((v) => v.tipo?.nombreTipo).filter((t): t is string => !!t)
    );
    return ['TODOS', ...tipos];
  });

  readonly vehiculosPublicos = computed(() => {
    const tipo = this.filtroTipo();

    return this.vehiculoService
      .vehiculos()
      .filter((v) => v.estado?.nombreEstado === 'DISPONIBLE')
      .filter((v) => tipo === 'TODOS' || v.tipo?.nombreTipo === tipo);
  });

  ngOnInit(): void {
    this.vehiculoService.cargar();
  }

  filtrarPorTipo(tipo: string): void {
    this.filtroTipo.set(tipo);
  }
}