import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from './services/logging.service';
import { NotificationService } from '../shared/services/notification.service';
import { MESSAGE_CONSTANTS } from './constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private loggingService = inject(LoggingService);
  private notificationService = inject(NotificationService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    const errObj = error as any;
    const isStatusZero = error instanceof HttpErrorResponse && error.status === 0 ||
      errObj?.rejection instanceof HttpErrorResponse && errObj.rejection.status === 0 ||
      errObj?.status === 0;

    if (isStatusZero) {
      this.loggingService.warn('Global error handler ignored expected backend status 0 (offline) error.');
      return;
    }

    this.loggingService.error('Global Error Caught', error);

    this.zone.run(() => {
      this.notificationService.error(MESSAGE_CONSTANTS.ERROR.GENERIC);
    });
  }
}
