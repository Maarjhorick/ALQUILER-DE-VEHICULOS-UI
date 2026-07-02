import { Routes } from '@angular/router';
import { HomeComponent } from '../feature/home/home.component';
import { NosotrosComponent } from '../feature/nosotros/nosotros.component';
import { ContactanosComponent } from '../feature/contactanos/contactanos.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { ListarVehiculosComponent } from '../feature/vehiculos/listar-vehiculos/listar-vehiculos.component';
import { ListarClientesComponent } from '../feature/clientes/listar-clientes/listar-clientes.component';
import { ListarAlquileresComponent } from '../feature/alquileres/listar-alquileres/listar-alquileres.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'vehiculos',
        component: ListarVehiculosComponent
      },
      {
        path: 'clientes',
        component: ListarClientesComponent
      },
      {
        path: 'alquileres',
        component: ListarAlquileresComponent
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
        redirectTo: 'contacto',
        pathMatch: 'full'
      },

      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }

];