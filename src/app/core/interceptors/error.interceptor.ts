import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggingService } from '../services/logging.service';
import { MESSAGE_CONSTANTS } from '../constants/app.constants';
import { ROUTES } from '../constants/app.routes';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const loggingService = inject(LoggingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
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
            notificationService.error(MESSAGE_CONSTANTS.ERROR.UNAUTHORIZED);
            // Optionally dispatch a logout action if using NgRx or call authService.logout()
            router.navigate([ROUTES.AUTH.LOGIN]);
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
          case 0:
            notificationService.error(MESSAGE_CONSTANTS.ERROR.NETWORK);
            break;
          default:
            notificationService.error(MESSAGE_CONSTANTS.ERROR.GENERIC);
            break;
        }
      }

      return throwError(() => error);
    })
  );
};
