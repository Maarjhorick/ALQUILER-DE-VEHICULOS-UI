import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface VehiculoDisponible {
  id: number;
  nombre: string;
  categoria: string;
  imagen: string;
  precioDia: number;
  descuento: number;
  transmision: string;
  pasajeros: number;
  maletas: number;
  combustible: string;
  caracteristicas: string[];
  disponible: boolean;
}

@Component({
  selector: 'app-listar-alquileres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-alquileres.component.html',
  styleUrl: './listar-alquileres.component.css'
})
export class ListarAlquileresComponent {
  pasoActual = 1;
  pasosCompletados = {
    ubicacion: false,
    vehiculo: false,
    cliente: false
  };

  reserva = {
    fechaRecojo: '',
    horaRecojo: '',
    fechaDevolucion: '',
    horaDevolucion: '',
    lugarRecojo: '',
    lugarDevolucion: '',
    vehiculoId: 0,
    cobertura: 'basica',
    extras: {
      sillaBebe: false,
      conductorAdicional: false,
      gps: false
    },
    nombres: '',
    apellidos: '',
    documento: '',
    licencia: '',
    telefono: '',
    correo: '',
    direccion: '',
    comentarios: '',
    aceptaTerminos: false
  };

  reservaRegistrada = false;

  vehiculosDisponibles: VehiculoDisponible[] = [
    {
      id: 1,
      nombre: 'Toyota Corolla 2024',
      categoria: 'Auto sedan',
      imagen: 'images/hero-car-rental.png',
      precioDia: 145,
      descuento: 12,
      transmision: 'Automatica',
      pasajeros: 5,
      maletas: 2,
      combustible: 'Gasolina',
      caracteristicas: ['Aire acondicionado', 'Camara de retroceso', 'Bluetooth', 'Seguro incluido'],
      disponible: true
    },
    {
      id: 2,
      nombre: 'Hyundai Tucson 2024',
      categoria: 'SUV familiar',
      imagen: 'images/hero-car-rental.png',
      precioDia: 210,
      descuento: 8,
      transmision: 'Automatica',
      pasajeros: 5,
      maletas: 4,
      combustible: 'Gasolina',
      caracteristicas: ['Control de estabilidad', 'Pantalla tactil', 'Sensores de parqueo', 'Asientos amplios'],
      disponible: true
    },
    {
      id: 3,
      nombre: 'Toyota Hilux 2023',
      categoria: 'Pickup',
      imagen: 'images/hero-car-rental.png',
      precioDia: 260,
      descuento: 10,
      transmision: 'Mecanica',
      pasajeros: 5,
      maletas: 5,
      combustible: 'Diesel',
      caracteristicas: ['Doble cabina', 'Traccion 4x4', 'Tolva amplia', 'Ideal para rutas exigentes'],
      disponible: true
    }
  ];

  get vehiculoSeleccionado(): VehiculoDisponible | undefined {
    return this.vehiculosDisponibles.find(vehiculo => vehiculo.id === this.reserva.vehiculoId);
  }

  irAlPaso(paso: number): void {
    if (paso === 1 || (paso === 2 && this.pasosCompletados.ubicacion) || (paso === 3 && this.pasosCompletados.vehiculo)) {
      this.pasoActual = paso;
    }
  }

  confirmarUbicacion(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.pasosCompletados.ubicacion = true;
    this.pasoActual = 2;
  }

  seleccionarVehiculo(vehiculo: VehiculoDisponible): void {
    if (!vehiculo.disponible) {
      return;
    }

    this.reserva.vehiculoId = vehiculo.id;
  }

  confirmarVehiculo(form: NgForm): void {
    if (form.invalid || !this.reserva.vehiculoId) {
      return;
    }

    this.pasosCompletados.vehiculo = true;
    this.pasoActual = 3;
  }

  registrarReserva(): void {
    if (!this.reserva.aceptaTerminos) {
      return;
    }

    this.pasosCompletados.cliente = true;
    this.reservaRegistrada = true;
    console.log('Reserva lista para enviar a la API:', {
      ...this.reserva,
      vehiculo: this.vehiculoSeleccionado
    });
  }
}
