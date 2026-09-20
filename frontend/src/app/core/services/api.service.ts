import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const base = environment.apiBaseUrl || 'http://localhost:8080/api/v1';
    return `${base}${cleanPath}`;
  }

  get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), options);
  }

  post<T>(path: string, body: any = {}, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body, options);
  }

  put<T>(path: string, body: any = {}, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body, options);
  }

  patch<T>(path: string, body: any = {}, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path), options);
  }
}
