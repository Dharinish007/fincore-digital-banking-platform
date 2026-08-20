import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Subscription,
  timer,
  forkJoin,
  catchError,
  of,
  map,
  switchMap
} from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService implements OnDestroy {
  private http = inject(HttpClient);
  private subscription?: Subscription;

  readonly isOnline = signal<boolean>(false);

  constructor() {
    this.startPolling();
  }

  startPolling(intervalMs = 15000): void {
    this.subscription?.unsubscribe();

    this.subscription = timer(0, intervalMs)
      .pipe(
        switchMap(() => this.checkHealth())
      )
      .subscribe(status => {
        this.isOnline.set(status);
      });
  }

  checkHealth() {
    const gatewayHealthUrl = environment.apiBaseUrl.replace('/api/v1', '') + '/actuator/health';

    return this.http.get(gatewayHealthUrl, { responseType: 'text' }).pipe(
      map(() => true),
      catchError(error => {
        // 404/401/403 etc. still prove the server is reachable.
        return of(
          error &&
          typeof error.status === 'number' &&
          error.status > 0
        );
      })
    );
  }

  setOnline(status: boolean): void {
    this.isOnline.set(status);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}