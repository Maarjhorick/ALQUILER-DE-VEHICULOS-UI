import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable, inject, signal } from '@angular/core';

import { Pago } from '../models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pagos`;

  private readonly pagosSignal = signal<Pago[]>([]);
  readonly pagos = this.pagosSignal.asReadonly();

  cargar(): void {
    this.http.get<Pago[]>(this.apiUrl).subscribe({
      next: (data) => this.pagosSignal.set(data),
      error: (err) => console.error('Error cargando pagos:', err)
    });
  }
}