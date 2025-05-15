import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  if (authService.token) {
    const authReq = req.clone({
      headers: authService.getAuthHeader()
    });
    return next(authReq);
  }
  
  return next(req);
};
