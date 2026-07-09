import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (rolesPermitidos && !authService.tieneRol(rolesPermitidos)) {
    return router.createUrlTree(['/']);
  }

  return true;
};