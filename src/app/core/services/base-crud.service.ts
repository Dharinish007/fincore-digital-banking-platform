import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, HttpOptions } from './api.service';

/**
 * Base CRUD Service to be extended by feature services
 * Provides standard CRUD operations to reduce boilerplate
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<T, K = string> {
  protected apiService = inject(ApiService);
  
  /**
   * The base endpoint for this service (e.g., '/customers')
   */
  protected abstract endpoint: string;

  getAll(options?: HttpOptions): Observable<T[]> {
    return this.apiService.get<T[]>(this.endpoint, options);
  }

  getById(id: K, options?: HttpOptions): Observable<T> {
    return this.apiService.get<T>(`${this.endpoint}/${id}`, options);
  }

  create(data: Partial<T>, options?: HttpOptions): Observable<T> {
    return this.apiService.post<T>(this.endpoint, data, options);
  }

  update(id: K, data: Partial<T>, options?: HttpOptions): Observable<T> {
    return this.apiService.put<T>(`${this.endpoint}/${id}`, data, options);
  }

  delete(id: K, options?: HttpOptions): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`, options);
  }
}
