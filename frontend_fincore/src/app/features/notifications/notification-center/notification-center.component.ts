import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../../core/services/banking.service';
import { NotificationItem } from '../../../core/models/banking.models';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss']
})
export class NotificationCenterComponent implements OnInit {
  private banking = inject(BankingService);
  private toast = inject(ToastService);

  notifications: NotificationItem[] = [];
  filteredNotifications: NotificationItem[] = [];

  activeChannel = 'ALL';
  showSendModal = false;

  newNotif = {
    customerName: 'Rahul Sharma',
    channel: 'Push' as NotificationItem['channel'],
    notificationType: 'Transaction' as NotificationItem['notificationType'],
    title: '',
    message: ''
  };

  ngOnInit() {
    this.banking.getNotifications().subscribe(n => {
      this.notifications = n;
      this.applyFilter();
    });
  }

  setChannel(ch: string) {
    this.activeChannel = ch;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeChannel === 'ALL') {
      this.filteredNotifications = this.notifications;
    } else {
      this.filteredNotifications = this.notifications.filter(n => n.channel === this.activeChannel);
    }
  }

  markRead(id: string) {
    this.banking.markNotificationAsRead(id);
    this.toast.info('Marked Read', 'Notification status updated');
  }

  retry(n: NotificationItem) {
    this.toast.success('Dispatched', `Retried sending ${n.channel} alert to ${n.customerName}`);
  }

  openSendModal() {
    this.newNotif = {
      customerName: 'Rahul Sharma',
      channel: 'Push',
      notificationType: 'Transaction',
      title: '',
      message: ''
    };
    this.showSendModal = true;
  }

  closeSendModal() {
    this.showSendModal = false;
  }

  submitSend() {
    if (!this.newNotif.title || !this.newNotif.message) {
      this.toast.error('Required', 'Please fill in title and message');
      return;
    }

    this.banking.sendNotification({
      customerId: 'CUS100234',
      customerName: this.newNotif.customerName,
      channel: this.newNotif.channel,
      notificationType: this.newNotif.notificationType,
      title: this.newNotif.title,
      message: this.newNotif.message
    });

    this.toast.success('Notification Sent', `Delivered via ${this.newNotif.channel} channel`);
    this.closeSendModal();
  }
}
