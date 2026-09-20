import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AdminAuthService);
  readonly baseUrl = 'http://localhost:8080';

  private getHeaders(): HttpHeaders {
    const user = this.auth.currentAdmin();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-Role': user?.role || 'ADMIN',
      'X-User-Id': user?.id || 'adm-001',
      'X-User-Name': user?.username || 'admin1'
    });
    if (user?.customerId) {
      headers = headers.set('X-Customer-Id', user.customerId.toString());
    }
    return headers;
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() });
  }

  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() });
  }

  put<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() });
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() });
  }

  checkHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/api/health`).pipe(
      catchError(() => of({ status: 'OFFLINE' }))
    );
  }
}
