import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-vehiculos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-vehiculos.component.html',
  styleUrl: './listar-vehiculos.component.css'
})
export class ListarVehiculosComponent {
  categorias = ['Todos', 'Auto sedan', 'SUV familiar', 'Pickup', 'Minivan'];

  vehiculos = [
    {
      nombre: 'Toyota Corolla 2024',
      categoria: 'Auto sedan',
      imagen: 'images/hero-car-rental.png',
      precioDia: 145,
      descuento: 12,
      transmision: 'Automatica',
      pasajeros: 5,
      maletas: 2,
      combustible: 'Gasolina',
      caracteristicas: ['Aire acondicionado', 'Bluetooth', 'Camara de retroceso']
    },
    {
      nombre: 'Hyundai Tucson 2024',
      categoria: 'SUV familiar',
      imagen: 'images/hero-car-rental.png',
      precioDia: 210,
      descuento: 8,
      transmision: 'Automatica',
      pasajeros: 5,
      maletas: 4,
      combustible: 'Gasolina',
      caracteristicas: ['Sensores de parqueo', 'Pantalla tactil', 'Seguro incluido']
    },
    {
      nombre: 'Toyota Hilux 2023',
      categoria: 'Pickup',
      imagen: 'images/hero-car-rental.png',
      precioDia: 260,
      descuento: 10,
      transmision: 'Mecanica',
      pasajeros: 5,
      maletas: 5,
      combustible: 'Diesel',
      caracteristicas: ['Doble cabina', 'Traccion 4x4', 'Tolva amplia']
    }
  ];
}
