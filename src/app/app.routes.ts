import { Routes } from '@angular/router';
import { HomeComponent } from '../feature/home/home.component';
import { NosotrosComponent } from '../feature/nosotros/nosotros.component';
import { ContactanosComponent } from '../feature/contactanos/contactanos.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';

export const routes: Routes = [
{
    path: '',
    component: HomeComponent
  },

  {
    path: 'nosotros',
    component: NosotrosComponent
  },

  {
    path: 'contactanos',
    component: ContactanosComponent
  },

  {
    path: '**',
    component: NotFoundComponent
  }
];