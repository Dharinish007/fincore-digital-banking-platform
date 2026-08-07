import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
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

  handleError(error: any): void {
    this.loggingService.error('Global Error Caught', error);

    // Show a user-friendly message using NgZone to ensure it runs inside Angular's zone
    // since errors can occur outside of it (e.g. DOM events)
    this.zone.run(() => {
      this.notificationService.error(MESSAGE_CONSTANTS.ERROR.GENERIC);
    });
  }
}
