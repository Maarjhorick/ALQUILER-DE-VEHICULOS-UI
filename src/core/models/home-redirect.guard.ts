import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

// Protege la ruta pública "/" (home). Si el usuario ya inició sesión,
// lo saca de la landing pública y lo manda directo a su panel según su rol.
export const homeRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    const rol = authService.rolActual();
    return router.parseUrl(rol === 'ADMIN' ? '/admin' : '/empleado');
  }

  return true;
};