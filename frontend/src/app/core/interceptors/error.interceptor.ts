import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggingService } from '../services/logging.service';
import { BackendStatusService } from '../services/backend-status.service';
import { MESSAGE_CONSTANTS } from '../constants/app.constants';
import { ROUTES } from '../constants/app.routes';

import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const loggingService = inject(LoggingService);
  const backendStatusService = inject(BackendStatusService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isHealthCheck = req.url.includes('/health');

      if (error.status === 0 || isHealthCheck) {
        // Status 0 or health check endpoint failure: Backend connection refused / server offline
        backendStatusService.setOnline(false);
        loggingService.warn(`Backend server at ${req.url} is offline / unavailable (status ${error.status}).`);
      } else {
        loggingService.error('HTTP Error intercepted', error);

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          notificationService.error(`Client Error: ${error.error.message}`);
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              notificationService.error(error.error?.message || 'Bad Request');
              break;
            case 401:
              if (!req.url.includes('/auth/login')) {
                notificationService.error(MESSAGE_CONSTANTS.ERROR.UNAUTHORIZED);
                authService.clearSession();
                router.navigate([ROUTES.AUTH.LOGIN]);
              }
              break;
            case 403:
              notificationService.error(MESSAGE_CONSTANTS.ERROR.FORBIDDEN);
              router.navigate([ROUTES.ERRORS.FORBIDDEN]);
              break;
            case 404:
              router.navigate([ROUTES.ERRORS.NOT_FOUND]);
              break;
            case 500:
              notificationService.error(MESSAGE_CONSTANTS.ERROR.GENERIC);
              break;
            case 503:
              notificationService.error('Service Unavailable. Please try again later.');
              break;
            default:
              notificationService.error(MESSAGE_CONSTANTS.ERROR.GENERIC);
              break;
          }
        }
      }

      return throwError(() => error);
    })
  );
};
