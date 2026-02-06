import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // SKIP interceptor for login/register routes
  if (req.url.includes('/api/users/login') || req.url.includes('/api/users/register') || req.url.includes('/api/products/print/')) {
    return next(req);
  }

  const user = localStorage.getItem('username');
  const token = localStorage.getItem('sessionToken');
  const role = localStorage.getItem('userRole');

  // 1. Add parameters to the request (Same as before)
  let authReq = req;
  if (user && token && token !== 'undefined') {
    authReq = req.clone({
      setParams: {
        username: user,
        sessionToken: token,
        role: role || ''
      }
    });
  }

  // 2. Catch the response to check for "Session Invalid"
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // This triggers when the backend detects the token has changed (User B logged in)
        alert("Session Invalid: Someone else has logged in with this account or your session expired.");
        
        // Clear local data so they have to log in again
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};