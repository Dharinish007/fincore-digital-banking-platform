import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface NotificationLog {
  id: string;
  channel: string;
  recipient: string;
  eventType: string;
  payloadSnippet: string;
  status: string;
  sentTime: string;
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

  notificationLogs: NotificationLog[] = [];
  selectedNotification: NotificationLog = {
    id: 'NTF-0000',
    channel: 'N/A',
    recipient: 'N/A',
    eventType: 'N/A',
    payloadSnippet: 'No notifications loaded yet',
    status: 'PENDING',
    sentTime: ''
  };

  showTestModal = false;
  showWebhookModal = false;
  showLogsModal = false;

  testRecipient = 'user1@example.com';
  testChannel = 'SMS Gateway + Email';
  testEventType = 'LoanDisbursedEvent';
  testCustomMessage = 'Your Home Loan EMI of ₹18,470 has been debited via Auto-debit.';

  webhookUrl = 'https://audit.bank-partner.in/v1/events';
  webhookSecret = 'sec_live_908234891238912';

  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  ngOnInit(): void {
    this.loadNotificationHistory();
  }

  loadNotificationHistory(): void {
    this.api.get<any[]>(`/api/notification/history?recipient=${encodeURIComponent(this.testRecipient)}`).subscribe({
      next: (rows) => {
        this.notificationLogs = rows.map((row) => ({
          id: `NTF-${row.id}`,
          channel: row.type ?? 'EMAIL',
          recipient: row.recipient,
          eventType: row.type ?? 'EMAIL',
          payloadSnippet: row.message ?? '',
          status: row.status ?? 'PENDING',
          sentTime: row.createdAt ? row.createdAt.replace('T', ' ').substring(0, 19) : ''
        }));

        if (this.notificationLogs.length > 0) {
          this.selectedNotification = this.notificationLogs[0];
        }
      },
      error: () => {
        this.showToast('Unable to load notification history from the backend.', 'danger');
      }
    });
  }

  selectNotification(item: NotificationLog): void {
    this.selectedNotification = item;
  }

  sendTestAlert(): void {
    this.showTestModal = true;
  }

  closeModals(): void {
    this.showTestModal = false;
    this.showWebhookModal = false;
    this.showLogsModal = false;
  }

  dispatchTestAlert(): void {
    if (!this.testRecipient) {
      this.showToast('Please specify a recipient.', 'danger');
      return;
    }

    const payload = {
      to: this.testRecipient,
      subject: this.testEventType,
      message: this.testCustomMessage
    };

    this.api.post<string>('/api/notification/email', payload).subscribe({
      next: () => {
        this.closeModals();
        this.loadNotificationHistory();
        this.showToast(`Notification sent to ${this.testRecipient}.`, 'success');
      },
      error: () => {
        this.showToast('Notification request failed; the backend did not accept the email payload.', 'danger');
      }
    });
  }

  configureWebhooks(): void {
    this.showWebhookModal = true;
  }

  saveWebhookSettings(): void {
    this.closeModals();
    this.showToast(`Webhook endpoint updated: ${this.webhookUrl} with active Saga signing key.`, 'success');
  }

  viewDeliveryLogs(): void {
    this.showLogsModal = true;
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
