import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EMICalculationRequest {
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
}

export interface EMICalculationResponse {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/emi/calculate`;

  calculateEMI(request: EMICalculationRequest): Observable<EMICalculationResponse> {
    return this.http.post<EMICalculationResponse>(this.apiUrl, request).pipe(
      catchError(() => {
        // Fallback local calculation when backend is offline
        const { principalAmount, interestRate, tenureMonths } = request;
        let monthlyEMI = 0;
        if (interestRate === 0) {
          monthlyEMI = principalAmount / tenureMonths;
        } else {
          const r = interestRate / 12 / 100;
          const factor = Math.pow(1 + r, tenureMonths);
          monthlyEMI = (principalAmount * r * factor) / (factor - 1);
        }
        const totalPayment = monthlyEMI * tenureMonths;
        const totalInterest = totalPayment - principalAmount;

        return of({
          monthlyEMI: Number(monthlyEMI.toFixed(2)),
          totalInterest: Number(totalInterest.toFixed(2)),
          totalPayment: Number(totalPayment.toFixed(2))
        });
      })
    );
  }
}
