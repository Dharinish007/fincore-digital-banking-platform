import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MESSAGE_CONSTANTS } from '../../core/constants/app.constants';
import { ToastComponent, ToastData, ToastType } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  /** Simple debounce tracker to prevent duplicate toasts in rapid succession */
  private lastMessage = '';
  private lastMessageTime = 0;

  success(message: string, title = 'Success'): void {
    this.showToast('success', title, message, 3500);
  }

  error(message: string = MESSAGE_CONSTANTS.ERROR.GENERIC, title = 'Error'): void {
    this.showToast('error', title, message, 6000);
  }

  warning(message: string, title = 'Warning'): void {
    this.showToast('warning', title, message, 5000);
  }

  info(message: string, title = 'Information'): void {
    this.showToast('info', title, message, 3500);
  }

  private showToast(type: ToastType, title: string, message: string, duration: number): void {
    const now = Date.now();
    const key = `${type}:${message}`;

    // Suppress exact duplicate toasts triggered within 1500ms (e.g. interceptor + component catch)
    if (this.lastMessage === key && now - this.lastMessageTime < 1500) {
      return;
    }

    this.lastMessage = key;
    this.lastMessageTime = now;

    this.snackBar.openFromComponent<ToastComponent, ToastData>(ToastComponent, {
      data: { type, title, message },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-snack-container', `toast-${type}-container`]
    });
  }
}
