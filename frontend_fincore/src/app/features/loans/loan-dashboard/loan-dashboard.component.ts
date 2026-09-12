import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankingService } from '../../../core/services/banking.service';
import { Loan, LoanType, LoanStatus, Customer } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-loan-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-dashboard.component.html',
  styleUrls: ['./loan-dashboard.component.scss']
})
export class LoanDashboardComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  loans: Loan[] = [];
  customers: Customer[] = [];

  showApplyModal = false;
  selectedLoan?: Loan;
  showWorkflowModal = false;

  // 8-step workflow steps
  workflowSteps = [
    { number: 1, title: 'Application', desc: 'Customer applies with income & property proof', status: 'completed' },
    { number: 2, title: 'Credit Assessment', desc: 'CIBIL / Experian score pull & DTI ratio check', status: 'completed' },
    { number: 3, title: 'Verification', desc: 'Title deed & biometric employment checks', status: 'active' },
    { number: 4, title: 'Approval', desc: 'Credit risk committee sanction letter generated', status: 'pending' },
    { number: 5, title: 'EMI Calculation', desc: 'Amortization schedule & mandate auto-debit', status: 'pending' },
    { number: 6, title: 'Disbursement', desc: 'Core ledger direct NEFT transfer to borrower', status: 'pending' },
    { number: 7, title: 'Collections', desc: 'Monthly NACH auto-sweep & SMS reminder', status: 'pending' },
    { number: 8, title: 'Closure / NOC', desc: 'No Due Certificate after zero balance settlement', status: 'pending' }
  ];

  loanForm: FormGroup = this.fb.group({
    customerId: ['', Validators.required],
    loanType: ['Home Loan' as LoanType, Validators.required],
    principalAmount: [2500000, [Validators.required, Validators.min(50000)]],
    interestRate: [8.5, [Validators.required, Validators.min(4), Validators.max(25)]],
    tenureMonths: [120, [Validators.required, Validators.min(6), Validators.max(360)]],
    creditScore: [750, [Validators.required, Validators.min(300), Validators.max(900)]]
  });

  computedEmi = 0;

  ngOnInit() {
    this.banking.getLoans().subscribe(loans => {
      this.loans = loans;
    });

    this.banking.getCustomers().subscribe(custs => {
      this.customers = custs;
      if (custs.length > 0) {
        this.loanForm.patchValue({ customerId: custs[0].customerId });
      }
    });

    this.updateComputedEmi();
    this.loanForm.valueChanges.subscribe(() => {
      this.updateComputedEmi();
    });
  }

  updateComputedEmi() {
    const { principalAmount, interestRate, tenureMonths } = this.loanForm.value;
    if (principalAmount && interestRate && tenureMonths) {
      const res = this.banking.calculateEMI(principalAmount, interestRate, tenureMonths);
      this.computedEmi = res.emi;
    }
  }

  openApplyModal() {
    this.showApplyModal = true;
  }

  closeApplyModal() {
    this.showApplyModal = false;
  }

  submitLoanApplication() {
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }

    const val = this.loanForm.value;
    const cust = this.customers.find(c => c.customerId === val.customerId);

    const newLoanData: Omit<Loan, 'loanId' | 'applicationDate' | 'isNPA' | 'repaidAmount'> = {
      customerId: val.customerId,
      customerName: cust ? `${cust.firstName} ${cust.lastName}` : 'Valued Customer',
      loanType: val.loanType,
      principalAmount: val.principalAmount,
      interestRate: val.interestRate,
      tenureMonths: val.tenureMonths,
      emiAmount: this.computedEmi,
      outstandingAmount: val.principalAmount,
      creditScore: val.creditScore,
      status: 'Approved',
      nextPaymentDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };

    this.banking.applyLoan(newLoanData).subscribe(res => {
      this.toast.success('Loan Sanctioned', `Created ${res.loanType} #${res.loanId} for ₹${res.principalAmount.toLocaleString('en-IN')}`);
      this.closeApplyModal();
    });
  }

  openWorkflow(loan: Loan) {
    this.selectedLoan = loan;
    this.showWorkflowModal = true;
  }

  closeWorkflow() {
    this.showWorkflowModal = false;
    this.selectedLoan = undefined;
  }

  disburse(loan: Loan) {
    this.banking.updateLoanStatus(loan.loanId, 'Disbursed').subscribe(() => {
      this.toast.success('Loan Disbursed', `₹${loan.principalAmount.toLocaleString('en-IN')} disbursed to ${loan.customerName}'s account`);
      this.closeWorkflow();
    });
  }

  markNPA(loan: Loan) {
    this.banking.updateLoanStatus(loan.loanId, 'NPA').subscribe(() => {
      this.toast.error('Classified as NPA', `Loan ${loan.loanId} tagged as Non-Performing Asset per RBI 90-day norm`);
      this.closeWorkflow();
    });
  }
}
