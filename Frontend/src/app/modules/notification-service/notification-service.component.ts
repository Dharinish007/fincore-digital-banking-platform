import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface NotificationLog {
  id: string;
  channel: string;
  recipient: string;
  subject: string;
  message: string;
  status: string;
  sentTime: string;
}

export interface CustomerContact {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  accountNumber: string;
}

@Component({
  selector: 'app-notification-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-service.component.html',
  styleUrl: './notification-service.component.css'
})
export class NotificationServiceComponent implements OnInit {
  private readonly api = inject(ApiService);

  // Form State: Ask user for Notification Type, To Whom (Recipient), and Message
  notificationType: 'SMS' | 'EMAIL' = 'SMS';
  recipient: string = '+91 98765 43210';
  message: string = 'Dear John Smith, ₹18,470 debited for Home Loan EMI #1 from ACC-8849-1001. Balance: ₹4,52,100.00.';

  customers: CustomerContact[] = [];
  notificationLogs: NotificationLog[] = [];
  isSending = false;

  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  ngOnInit(): void {
    this.loadCustomers();
    this.loadNotifications();
  }

  loadCustomers(): void {
    this.api.get<CustomerContact[]>('/api/operations/customers').subscribe({
      next: (custs) => {
        if (custs && custs.length > 0) {
          this.customers = custs;
        } else {
          this.customers = [
            { id: 1, fullName: 'John Smith', phoneNumber: '+91 98765 43210', email: 'john.smith@example.com', accountNumber: 'ACC-8849-1001' },
            { id: 2, fullName: 'Sarah Jenkins', phoneNumber: '+91 98765 43211', email: 'sarah.jenkins@example.com', accountNumber: 'ACC-8849-1002' },
            { id: 3, fullName: 'TechCorp Industries', phoneNumber: '+91 98765 43212', email: 'finance@techcorp.example.com', accountNumber: 'ACC-8849-1003' }
          ];
        }
      },
      error: () => {
        this.customers = [
          { id: 1, fullName: 'John Smith', phoneNumber: '+91 98765 43210', email: 'john.smith@example.com', accountNumber: 'ACC-8849-1001' },
          { id: 2, fullName: 'Sarah Jenkins', phoneNumber: '+91 98765 43211', email: 'sarah.jenkins@example.com', accountNumber: 'ACC-8849-1002' },
          { id: 3, fullName: 'TechCorp Industries', phoneNumber: '+91 98765 43212', email: 'finance@techcorp.example.com', accountNumber: 'ACC-8849-1003' }
        ];
      }
    });
  }

  loadNotifications(): void {
    this.api.get<any[]>('/api/notification/all').subscribe({
      next: (rows) => this.handleLoadedRows(rows),
      error: () => {
        this.api.get<any[]>('/api/notification').subscribe({
          next: (rows) => this.handleLoadedRows(rows),
          error: () => this.showToast('Unable to load notifications from database.', 'danger')
        });
      }
    });
  }

  private handleLoadedRows(rows: any[]): void {
    if (!rows || rows.length === 0) {
      this.notificationLogs = [];
      return;
    }

    this.notificationLogs = rows.map((row) => ({
      id: `NTF-${row.id}`,
      channel: (row.type || 'EMAIL').toUpperCase(),
      recipient: row.recipient,
      subject: row.subject || `${row.type || 'EMAIL'} Advisory`,
      message: row.message || '',
      status: row.status || 'DELIVERED',
      sentTime: row.createdAt ? row.createdAt.replace('T', ' ').substring(0, 19) : ''
    }));
  }

  // Display recent 2 notification messages sent
  get recent2Notifications(): NotificationLog[] {
    return this.notificationLogs.slice(0, 2);
  }

  onTypeChange(): void {
    if (this.customers.length > 0) {
      const c = this.customers[0];
      this.recipient = this.notificationType === 'SMS' ? c.phoneNumber : c.email;
    } else {
      this.recipient = this.notificationType === 'SMS' ? '+91 98765 43210' : 'john.smith@example.com';
    }
  }

  selectCustomer(cust: CustomerContact): void {
    if (this.notificationType === 'SMS') {
      this.recipient = cust.phoneNumber;
    } else {
      this.recipient = cust.email;
    }
    this.message = `Dear ${cust.fullName}, your FinCore account ${cust.accountNumber} has a new notification: `;
  }

  applyTemplate(templateKey: string): void {
    const cust = this.customers[0] || { fullName: 'John Smith', accountNumber: 'ACC-8849-1001' };
    switch (templateKey) {
      case 'EMI':
        this.message = `Dear ${cust.fullName}, ₹18,470 has been debited for Home Loan EMI #1 from account ${cust.accountNumber}. Available Balance: ₹4,52,100.00.`;
        break;
      case 'CREDIT':
        this.message = `Dear ${cust.fullName}, your account ${cust.accountNumber} has been credited with ₹50,000.00 via IMPS / UPI ref TXN-2026-0002.`;
        break;
      case 'OTP':
        this.message = `Your FinCore Digital Banking 2FA OTP for fund transfer authentication is 849201. Valid for 5 minutes. Do not share.`;
        break;
    }
  }

  // Send notification & persist in database table 'notifications'
  sendNotification(): void {
    if (!this.recipient || !this.recipient.trim()) {
      this.showToast('Please enter to who the notification should be sent (phone number or email).', 'danger');
      return;
    }

    if (!this.message || !this.message.trim()) {
      this.showToast('Please enter the notification message body.', 'danger');
      return;
    }

    this.isSending = true;

    const payload = {
      type: this.notificationType,
      to: this.recipient.trim(),
      subject: `${this.notificationType} Banking Alert`,
      message: this.message.trim()
    };

    this.api.post<any>('/api/notification/send', payload).subscribe({
      next: (savedEntity) => {
        this.isSending = false;
        this.loadNotifications();
        this.showToast(
          `Success! ${payload.type} notification sent to ${payload.to} and saved to database table 'notifications'.`,
          'success'
        );
      },
      error: () => {
        // Fallback to /email endpoint
        this.api.post<any>('/api/notification/email', payload).subscribe({
          next: () => {
            this.isSending = false;
            this.loadNotifications();
            this.showToast(
              `Success! Notification sent to ${payload.to} and saved to database table 'notifications'.`,
              'success'
            );
          },
          error: () => {
            this.isSending = false;
            this.showToast('Failed to dispatch notification to backend server.', 'danger');
          }
        });
      }
    });
  }

  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = null;
      }
    }, 4500);
  }
}
