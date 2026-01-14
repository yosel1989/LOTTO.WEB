import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { environment } from 'environments/environment';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthApiService } from 'app/features/auth/services/auth-api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthApiService);
  const token = storageService.getToken();

  const ignoredUrls = [
    'https://via.placeholder.com/',
    `${environment.authUrl}/refreshToken`,
    `${environment.authUrl}/logout`
  ];

  if (ignoredUrls.some(url => req.url.startsWith(url))) {
    return next(req);
  }

  const authReq = token
    ? req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          return authService.refreshToken().pipe(
            switchMap(newToken => {
              const retriedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retriedReq);
            })
          );
        }
        return throwError(() => error);
      })
    );
};
