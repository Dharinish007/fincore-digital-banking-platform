import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: string, context?: any): void {
    console.log(`[INFO] ${message}`, context || '');
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
  }

  warn(message: string, context?: any): void {
    console.warn(`[WARN] ${message}`, context || '');
  }
}
