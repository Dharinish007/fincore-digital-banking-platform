import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class ApiService {
  base = '/api';
  constructor(private http: HttpClient){}
  // placeholder methods
  get(path:string){ return this.http.get(this.base + path); }
  post(path:string, body:any){ return this.http.post(this.base + path, body); }
}
