import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-solicitar-cuenta',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './solicitar-cuenta.component.html',
  styleUrl: './solicitar-cuenta.component.css'
})
export class SolicitarCuentaComponent {}