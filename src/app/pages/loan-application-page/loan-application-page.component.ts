import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { LoanApplication } from '../../models/application.model';

@Component({
  selector: 'app-loan-application-page',
  standalone: false,
  templateUrl: './loan-application-page.component.html',
  styleUrls: ['./loan-application-page.component.scss']
})
export class LoanApplicationPageComponent {
  applicationId = '';
  submitted = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private mockData: MockDataService) {
    this.form = this.fb.group({
      customerId: ['C-84729', Validators.required],
      fullName: ['Aarav Sharma', Validators.required],
      dateOfBirth: ['1990-05-14', Validators.required],
      gender: ['Male', Validators.required],
      mobile: ['+91 98765 43210', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
      email: ['aarav.sharma@example.com', [Validators.required, Validators.email]],
      address: ['42/1 Palm Grove Residency', Validators.required],
      city: ['Mumbai', Validators.required],
      state: ['Maharashtra', Validators.required],
      pincode: ['400050', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      employmentType: ['Salaried', Validators.required],
      employerName: ['TechCorp India Pvt Ltd', Validators.required],
      jobTitle: ['Senior Software Engineer', Validators.required],
      workExperience: ['6 years', Validators.required],
      monthlyIncome: [85000, [Validators.required, Validators.min(0)]],
      otherIncome: [5000, [Validators.min(0)]],
      loanType: ['Home Loan', Validators.required],
      requestedLoanAmount: [4500000, [Validators.required, Validators.min(1)]],
      tenure: ['15 years', Validators.required],
      purpose: ['Purchase of new flat', Validators.required]
    });
  }

  saveDraft() {
    if (this.form.valid) {
      this.createApplication('Draft', 'Pre-Qualification');
      this.submitted = true;
      this.applicationId = this.form.get('customerId')?.value || 'LO-0000';
    }
  }

  submitApplication() {
    if (this.form.valid) {
      const application = this.createApplication('Under Review', 'Loan Application');
      this.applicationId = application.id;
      this.submitted = true;
    }
  }

  reset() {
    this.form.reset();
    this.submitted = false;
    this.applicationId = '';
  }

  cancel() {
    this.reset();
  }

  private createApplication(status: string, stage: string): LoanApplication {
    const application: LoanApplication = {
      id: `LO-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: this.form.get('customerId')?.value,
      fullName: this.form.get('fullName')?.value,
      dateOfBirth: this.form.get('dateOfBirth')?.value,
      gender: this.form.get('gender')?.value,
      mobile: this.form.get('mobile')?.value,
      email: this.form.get('email')?.value,
      address: this.form.get('address')?.value,
      city: this.form.get('city')?.value,
      state: this.form.get('state')?.value,
      pincode: this.form.get('pincode')?.value,
      employmentType: this.form.get('employmentType')?.value,
      employerName: this.form.get('employerName')?.value,
      jobTitle: this.form.get('jobTitle')?.value,
      workExperience: this.form.get('workExperience')?.value,
      monthlyIncome: Number(this.form.get('monthlyIncome')?.value),
      otherIncome: Number(this.form.get('otherIncome')?.value) || 0,
      loanType: this.form.get('loanType')?.value,
      requestedAmount: Number(this.form.get('requestedLoanAmount')?.value),
      tenure: this.form.get('tenure')?.value,
      purpose: this.form.get('purpose')?.value,
      applicationDate: new Date().toISOString().split('T')[0],
      stage: stage as any,
      status: status as any
    };

    this.mockData.addApplication(application);
    return application;
  }
}
