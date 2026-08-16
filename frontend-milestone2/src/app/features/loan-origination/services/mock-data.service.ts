import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentUpload } from '../models/document.model';
import { LoanApplication, ApplicationStage, ApplicationStatus } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private applications: LoanApplication[] = [
    {
      id: 'LO-1001',
      customerId: 'C-56421',
      fullName: 'Aditi Sharma',
      dateOfBirth: '1989-03-15',
      gender: 'Female',
      mobile: '+91 98765 43210',
      email: 'aditi.sharma@example.com',
      address: '14 Magnolia Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      employmentType: 'Salaried',
      employerName: 'Sapphire Pvt Ltd',
      jobTitle: 'Senior Analyst',
      workExperience: '7 years',
      monthlyIncome: 132000,
      otherIncome: 18000,
      loanType: 'Home Loan',
      requestedAmount: 3100000,
      tenure: '20 years',
      purpose: 'Home purchase',
      applicationDate: '2026-08-01',
      stage: 'Application Processing',
      status: 'Under Review',
      approvedAmount: 3000000,
      approvedTenure: '18 years',
      interestRate: '7.35%',
      fundingAccount: 'HDFC 3421',
      fundingStatus: 'Pending'
    },
    {
      id: 'LO-1002',
      customerId: 'C-99231',
      fullName: 'Rohan Mehta',
      dateOfBirth: '1993-07-09',
      gender: 'Male',
      mobile: '+91 91234 56789',
      email: 'rohan.mehta@example.com',
      address: '78 Blue Ridge Apartments',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
      employmentType: 'Self-Employed',
      employerName: 'Mehta Traders',
      jobTitle: 'Owner',
      workExperience: '10 years',
      monthlyIncome: 180000,
      otherIncome: 25000,
      loanType: 'Business Loan',
      requestedAmount: 2200000,
      tenure: '10 years',
      purpose: 'Business expansion',
      applicationDate: '2026-07-28',
      stage: 'Underwriting',
      status: 'Approved',
      approvedAmount: 2150000,
      approvedTenure: '10 years',
      interestRate: '8.10%',
      fundingAccount: 'SBI 1098',
      fundingStatus: 'Ready for Funding'
    }
  ];

  private documents: DocumentUpload[] = [
    { label: 'Identity Proof', status: 'Verified' },
    { label: 'Address Proof', status: 'Verified' },
    { label: 'Income Proof', status: 'Submitted' },
    { label: 'Bank Statement', status: 'Pending' },
    { label: 'Employment Proof', status: 'Submitted' }
  ];

  private applications$ = new BehaviorSubject<LoanApplication[]>(this.applications);

  getApplications() {
    return this.applications$.asObservable();
  }

  getApplicationById(id: string) {
    return this.applications.find((app) => app.id === id);
  }

  addApplication(application: LoanApplication) {
    this.applications = [application, ...this.applications];
    this.applications$.next(this.applications);
  }

  updateApplication(updated: LoanApplication) {
    this.applications = this.applications.map((app) => (app.id === updated.id ? updated : app));
    this.applications$.next(this.applications);
  }

  getDocuments() {
    return [...this.documents];
  }
}
