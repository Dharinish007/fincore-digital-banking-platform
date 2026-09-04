import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { AppUser, UserRole } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  users: AppUser[] = [];
  roles: UserRole[] = [
    'Super Admin',
    'Banking Admin',
    'Branch Manager',
    'Loan Officer',
    'KYC Officer',
    'Auditor',
    'Support Agent',
    'Customer'
  ];

  permissionMatrix = [
    { module: 'Customer Management', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': true, 'Loan Officer': true, 'KYC Officer': true, 'Auditor': false, 'Support Agent': true, 'Customer': false } },
    { module: 'Account Lifecycle & Balance Adjust', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': true, 'Loan Officer': false, 'KYC Officer': false, 'Auditor': false, 'Support Agent': false, 'Customer': false } },
    { module: 'Transaction Reversal & Clearance', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': true, 'Loan Officer': false, 'KYC Officer': false, 'Auditor': false, 'Support Agent': false, 'Customer': false } },
    { module: 'Loan Sanction & Disbursement', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': true, 'Loan Officer': true, 'KYC Officer': false, 'Auditor': false, 'Support Agent': false, 'Customer': false } },
    { module: 'KYC Biometric Verification', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': false, 'Loan Officer': false, 'KYC Officer': true, 'Auditor': false, 'Support Agent': false, 'Customer': false } },
    { module: 'Fraud Alert Mitigation & Freeze', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': false, 'Loan Officer': false, 'KYC Officer': true, 'Auditor': false, 'Support Agent': false, 'Customer': false } },
    { module: 'Audit Log Chain Inspection', roles: { 'Super Admin': true, 'Banking Admin': true, 'Branch Manager': false, 'Loan Officer': false, 'KYC Officer': false, 'Auditor': true, 'Support Agent': false, 'Customer': false } },
    { module: 'Keycloak & Security Firewall', roles: { 'Super Admin': true, 'Banking Admin': false, 'Branch Manager': false, 'Loan Officer': false, 'KYC Officer': false, 'Auditor': false, 'Support Agent': false, 'Customer': false } }
  ];

  showAddModal = false;
  newUser = {
    username: '',
    fullName: '',
    email: '',
    department: 'Central Operations',
    role: 'Banking Admin' as UserRole
  };

  ngOnInit() {
    this.banking.getUsers().subscribe(u => {
      this.users = u;
    });
  }

  changeRole(u: AppUser, newRole: UserRole) {
    this.banking.updateUserRole(u.userId, newRole).subscribe(() => {
      this.toast.info('Role Updated', `Assigned ${newRole} to ${u.fullName}`);
    });
  }

  toggleActive(u: AppUser) {
    u.status = u.status === 'Active' ? 'Inactive' : 'Active';
    this.toast.warning('Account Status', `${u.fullName} is now ${u.status}`);
  }

  openAddModal() {
    this.newUser = {
      username: '',
      fullName: '',
      email: '',
      department: 'Central Operations',
      role: 'Banking Admin'
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitNewUser() {
    if (!this.newUser.username || !this.newUser.fullName || !this.newUser.email) {
      this.toast.error('Required', 'Please fill all user fields');
      return;
    }

    const created: AppUser = {
      userId: 'USR-' + Math.floor(100 + Math.random() * 900),
      username: this.newUser.username,
      fullName: this.newUser.fullName,
      email: this.newUser.email,
      department: this.newUser.department,
      role: this.newUser.role,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    this.users = [created, ...this.users];
    this.toast.success('Operator Provisioned', `Created account for ${created.fullName}`);
    this.closeAddModal();
  }
}
