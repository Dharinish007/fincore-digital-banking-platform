import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentUpload } from '../models/document.model';
import { LoanApplication, PreQualificationData } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private preQualificationBuffer: PreQualificationData | null = null;

  private applications: LoanApplication[] = [
    {
      loanId: 1001,
      id: 'LO-1001',
      customerId: 101,
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      mobile: '+91 98765 43210',
      loanType: 'Home',
      loanAmount: 3500000,
      requestedAmount: 3500000,
      tenureMonths: 240,
      tenure: '240 months (20 years)',
      interestRate: 7.35,
      purpose: 'Primary residential property acquisition',
      applicationDate: '2026-08-01',
      stage: 'Application Processing',
      status: 'Under Review',
      applicationStatus: 'Pending',
      city: 'Mumbai',
      state: 'Maharashtra',
      employmentType: 'Salaried',
      employerName: 'Tata Consultancy Services',
      jobTitle: 'Senior Tech Lead',
      monthlyIncome: 145000,
      creditScore: 782,
      approvedAmount: 3200000
    },
    {
      loanId: 1002,
      id: 'LO-1002',
      customerId: 102,
      fullName: 'Pooja Verma',
      email: 'pooja.verma@finmail.com',
      mobile: '+91 98234 56789',
      loanType: 'Personal',
      loanAmount: 850000,
      requestedAmount: 850000,
      tenureMonths: 60,
      tenure: '60 months (5 years)',
      interestRate: 10.25,
      purpose: 'Home renovation and modular interior upgrade',
      applicationDate: '2026-07-28',
      stage: 'Loan Application',
      status: 'Approved',
      applicationStatus: 'Approved',
      city: 'Bengaluru',
      state: 'Karnataka',
      employmentType: 'Salaried',
      employerName: 'Infosys Ltd',
      jobTitle: 'Product Manager',
      monthlyIncome: 110000,
      creditScore: 810,
      approvedAmount: 850000
    },
    {
      loanId: 1003,
      id: 'LO-1003',
      customerId: 103,
      fullName: 'Vikramaditya Roy',
      email: 'vikram.roy@technova.in',
      mobile: '+91 97112 34567',
      loanType: 'Vehicle',
      loanAmount: 1400000,
      requestedAmount: 1400000,
      tenureMonths: 84,
      tenure: '84 months (7 years)',
      interestRate: 8.50,
      purpose: 'Electric vehicle acquisition',
      applicationDate: '2026-08-10',
      stage: 'Loan Application',
      status: 'Draft',
      applicationStatus: 'Draft',
      city: 'Delhi',
      state: 'Delhi',
      employmentType: 'Self-Employed',
      employerName: 'Roy Tech Solutions',
      jobTitle: 'Proprietor',
      monthlyIncome: 180000,
      creditScore: 745
    },
    {
      loanId: 1004,
      id: 'LO-1004',
      customerId: 104,
      fullName: 'Sneha Patel',
      email: 'sneha.patel@corpgroup.com',
      mobile: '+91 99001 88223',
      loanType: 'Education',
      loanAmount: 2200000,
      requestedAmount: 2200000,
      tenureMonths: 120,
      tenure: '120 months (10 years)',
      interestRate: 8.10,
      purpose: 'Master in Artificial Intelligence overseas tuition',
      applicationDate: '2026-08-14',
      stage: 'Loan Application',
      status: 'Pending',
      applicationStatus: 'Pending',
      city: 'Ahmedabad',
      state: 'Gujarat',
      employmentType: 'Salaried',
      employerName: 'Adani Digital Labs',
      jobTitle: 'Data Engineer',
      monthlyIncome: 95000,
      creditScore: 760
    }
  ];

  private documents: DocumentUpload[] = [
    { label: 'Identity Proof (Aadhaar / Passport)', status: 'Verified' },
    { label: 'Address Proof (Utility Bill)', status: 'Verified' },
    { label: 'Income Proof (Form 16 / Payslips)', status: 'Submitted' },
    { label: 'Bank Statement (Last 6 Months)', status: 'Verified' },
    { label: 'Employment Verification Letter', status: 'Submitted' }
  ];

  private applications$ = new BehaviorSubject<LoanApplication[]>(this.applications);

  getApplications() {
    return this.applications$.asObservable();
  }

  getCurrentApplicationsSnapshot(): LoanApplication[] {
    return [...this.applications];
  }

  getApplicationById(id: string) {
    return this.applications.find((app) => app.id === id || String(app.loanId) === id);
  }

  addApplication(application: LoanApplication) {
    this.applications = [application, ...this.applications];
    this.applications$.next(this.applications);
  }

  updateApplication(updated: LoanApplication) {
    this.applications = this.applications.map((app) => 
      (app.id === updated.id || (app.loanId && app.loanId === updated.loanId)) ? updated : app
    );
    this.applications$.next(this.applications);
  }

  deleteApplication(id: string) {
    this.applications = this.applications.filter((app) => app.id !== id && String(app.loanId) !== id);
    this.applications$.next(this.applications);
  }

  setPendingPreQualification(data: PreQualificationData | null) {
    this.preQualificationBuffer = data;
  }

  getPendingPreQualification(): PreQualificationData | null {
    return this.preQualificationBuffer;
  }

  clearPendingPreQualification() {
    this.preQualificationBuffer = null;
  }

  getDocuments() {
    return [...this.documents];
  }
}
