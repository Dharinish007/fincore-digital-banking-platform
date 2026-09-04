import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';

interface AmortizationYear {
  year: number;
  openingBalance: number;
  emiPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent implements OnInit {
  private banking = inject(BankingService);

  // Inputs
  principal: number = 3000000;
  interestRate: number = 8.5;
  tenureYears: number = 20;

  // Computed Outputs
  monthlyEmi: number = 0;
  totalInterest: number = 0;
  totalPayment: number = 0;
  principalPercent: number = 0;
  interestPercent: number = 0;

  amortizationSchedule: AmortizationYear[] = [];

  ngOnInit() {
    this.calculate();
  }

  calculate() {
    const months = this.tenureYears * 12;
    const res = this.banking.calculateEMI(this.principal, this.interestRate, months);
    this.monthlyEmi = res.emi;
    this.totalInterest = res.totalInterest;
    this.totalPayment = res.totalPayment;

    this.principalPercent = Math.round((this.principal / this.totalPayment) * 100);
    this.interestPercent = 100 - this.principalPercent;

    this.generateAmortization();
  }

  generateAmortization() {
    this.amortizationSchedule = [];
    let balance = this.principal;
    const monthlyRate = this.interestRate / 12 / 100;
    const annualEmi = this.monthlyEmi * 12;

    for (let yr = 1; yr <= Math.min(this.tenureYears, 10); yr++) {
      let yrInterest = 0;
      let yrPrincipal = 0;
      const opening = balance;

      for (let m = 1; m <= 12; m++) {
        const intForMonth = balance * monthlyRate;
        const prinForMonth = this.monthlyEmi - intForMonth;
        yrInterest += intForMonth;
        yrPrincipal += prinForMonth;
        balance -= prinForMonth;
      }

      this.amortizationSchedule.push({
        year: yr,
        openingBalance: Math.max(0, Math.round(opening)),
        emiPaid: Math.round(annualEmi),
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        closingBalance: Math.max(0, Math.round(balance))
      });
    }
  }
}
