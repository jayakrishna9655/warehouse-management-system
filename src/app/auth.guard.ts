import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we are running in the browser
  if (isPlatformBrowser(platformId)) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      return true;
    }
  }

  // If we are on the server OR not logged in, redirect
  // (Note: On server, we usually return true or redirect to avoid flicker)
  if (isPlatformBrowser(platformId)) {
    router.navigate(['/login']);
  }
  return false;
};