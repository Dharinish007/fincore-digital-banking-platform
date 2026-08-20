import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = signal<number>(0);
  
  readonly isLoading = signal<boolean>(false);

  show(): void {
    this.activeRequests.update(count => count + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests.update(count => Math.max(0, count - 1));
    if (this.activeRequests() === 0) {
      this.isLoading.set(false);
    }
  }
}
