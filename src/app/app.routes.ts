import { Routes } from '@angular/router';
import { HomeComponent } from '../feature/home/home.component';
import { NosotrosComponent } from '../feature/nosotros/nosotros.component';
import { ContactanosComponent } from '../feature/contactanos/contactanos.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { ListarVehiculosComponent } from '../feature/vehiculos/listar-vehiculos/listar-vehiculos.component';
import { ListarClientesComponent } from '../feature/clientes/listar-clientes/listar-clientes.component';
import { ListarAlquileresComponent } from '../feature/alquileres/listar-alquileres/listar-alquileres.component';

import { LoginComponent } from '../feature/auth/login/login.component';
import { DashboardEmpleadoComponent } from '../feature/empleado/dashboard-empleado/dashboard-empleado.component';
import { DashboardAdminComponent } from '../feature/admin/dashboard-admin/dashboard-admin.component';
import { DashboardClienteComponent } from '../feature/cliente/dashboard-cliente/dashboard-cliente.component';

import { SolicitarCuentaComponent } from '../feature/auth/solicitar-cuenta/solicitar-cuenta.component';
import { CatalogoVehiculosComponent } from '../feature/catalogo/catalogo-vehiculos/catalogo-vehiculos.component';
import { ReservaPublicaComponent } from '../feature/reservas/reserva-publica/reserva-publica.component';
import { authGuard } from '../core/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'solicitar-cuenta',
    component: SolicitarCuentaComponent
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'cliente',
        component: DashboardClienteComponent,
        canActivate: [authGuard],
        data: { roles: ['CLIENTE'] }
      },
      {
        path: 'empleado',
        component: DashboardEmpleadoComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'EMPLEADO'] }
      },
      {
        path: 'admin',
        component: DashboardAdminComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'catalogo',
        component: CatalogoVehiculosComponent
      },
      {
        path: 'reservar',
        component: ReservaPublicaComponent
      },
      {
        path: 'vehiculos',
        component: ListarVehiculosComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'EMPLEADO'] }
      },
      {
        path: 'clientes',
        component: ListarClientesComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'EMPLEADO'] }
      },
      {
        path: 'alquileres',
        component: ListarAlquileresComponent,
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'EMPLEADO'] }
      },

      {
        path: 'nosotros',
        component: NosotrosComponent
      },

      {
        path: 'contacto',
        component: ContactanosComponent
      },
      {
        path: 'contactanos',
        component: ContactanosComponent
      },

      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }

];
