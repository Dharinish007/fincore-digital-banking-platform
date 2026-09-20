import { Injectable } from '@angular/core';
import { EmiCalculationRequest, EmiSummary, AmortizationScheduleItem } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class EmiService {

  calculateEmi(req: EmiCalculationRequest): { summary: EmiSummary; schedule: AmortizationScheduleItem[] } {
    const P = req.loanAmount;
    const annualRate = req.interestRate;
    const tenureMonths = req.tenureType === 'YEARS' ? req.tenure * 12 : req.tenure;

    if (P <= 0 || annualRate <= 0 || tenureMonths <= 0) {
      return {
        summary: {
          loanAmount: P,
          interestRate: annualRate,
          tenureMonths: tenureMonths,
          monthlyEmi: 0,
          totalInterest: 0,
          totalRepayment: 0
        },
        schedule: []
      };
    }

    const r = annualRate / 12 / 100; // Monthly interest rate
    const n = tenureMonths;

    // Standard reducing balance EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiFactor = Math.pow(1 + r, n);
    const monthlyEmi = Math.round(P * r * emiFactor / (emiFactor - 1));

    const totalRepayment = monthlyEmi * n;
    const totalInterest = totalRepayment - P;

    const summary: EmiSummary = {
      loanAmount: P,
      interestRate: annualRate,
      tenureMonths: n,
      monthlyEmi,
      totalInterest,
      totalRepayment
    };

    const schedule: AmortizationScheduleItem[] = [];
    let remainingBalance = P;
    const startDate = req.startDate ? new Date(req.startDate) : new Date(2026, 8, 1);

    for (let month = 1; month <= n; month++) {
      const monthInterest = Math.round(remainingBalance * r);
      let monthPrincipal = monthlyEmi - monthInterest;

      if (month === n || remainingBalance < monthPrincipal) {
        monthPrincipal = remainingBalance;
      }

      remainingBalance = Math.max(0, remainingBalance - monthPrincipal);

      const payDate = new Date(startDate);
      payDate.setMonth(payDate.getMonth() + (month - 1));
      const formattedDate = payDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      schedule.push({
        month,
        paymentDate: formattedDate,
        emi: month === n ? monthPrincipal + monthInterest : monthlyEmi,
        principal: monthPrincipal,
        interest: monthInterest,
        remainingBalance
      });
    }

    return { summary, schedule };
  }
}
