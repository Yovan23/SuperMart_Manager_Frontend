import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.validateToken().pipe(
    map(response => {
      if (response.success) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      localStorage.clear(); 
      return of(false);
    })
  );
};