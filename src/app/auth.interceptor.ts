import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('username');
  const token = localStorage.getItem('sessionToken');
  const role = localStorage.getItem('userRole'); // Ensure this key matches your Login code

  if (user && token && token !== 'undefined') {
    const authReq = req.clone({
      setParams: {
        username: user,
        sessionToken: token,
        role: role || '' // Include the role so the backend can authorize
      }
    });
    return next(authReq);
  }
  return next(req);
};