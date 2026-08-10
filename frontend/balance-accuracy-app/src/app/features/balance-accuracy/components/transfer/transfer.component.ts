import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent {
  sidebarCollapsed = false;

  sender = '';
  receiver = '';
  amount = 0;
  reference = '';
  statusMessage = '';
  statusClass: 'info' | 'success' | 'error' = 'info';
  backendStatus = '';
  backendBalance: number | null = null;
  backendTransactionId = '';
  receiverName = '';
  receiverLookupMessage = '';
  isSending = false;
  showProcessing = false;
  private processingIndicatorTimeout?: number;

  constructor(private txService: TransactionService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  submit() {
    this.statusMessage = '';
    this.backendStatus = '';
    this.backendBalance = null;
    this.backendTransactionId = '';
    this.isSending = true;
    this.showProcessing = false;
    if (this.processingIndicatorTimeout) {
      clearTimeout(this.processingIndicatorTimeout);
    }
    this.processingIndicatorTimeout = window.setTimeout(() => {
      this.showProcessing = true;
    }, 1200);

    const tx: Transaction = {
      id: '',
      sender: this.sender,
      senderName: undefined,
      receiver: this.receiver,
      receiverName: undefined,
      type: 'Transfer',
      amount: Number(this.amount),
      date: new Date().toISOString(),
      reference:
        this.reference || `REF${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
    } as Transaction;

    this.txService.confirm(tx).subscribe(
      (res) => {
        const isSuccess = res.transaction.status === 'Success';
        const backendStatus = res.backendResponse?.status;
        const backendMessage = res.backendResponse?.message;
        const backendBalance = res.backendResponse?.balance;
        const backendTransactionId =
          res.backendResponse?.transactionId || res.transaction.id;

        this.backendStatus = backendStatus
          ? `${backendStatus}`
          : isSuccess
            ? 'Success'
            : 'Failed';
        this.backendBalance = backendBalance != null ? backendBalance : null;
        this.backendTransactionId = backendTransactionId;

        this.statusClass = isSuccess ? 'success' : 'error';
        this.statusMessage =
          backendMessage ||
          (isSuccess
            ? 'Money Transferred Successfully'
            : 'Transfer failed. Please check the transaction details.');
        this.clearProcessingState();
      },
      (err) => {
        this.statusClass = 'error';
        this.statusMessage = err?.message || 'Failed to submit transfer.';
        this.clearProcessingState();
      },
    );
  }

  private clearProcessingState(): void {
    this.isSending = false;
    this.showProcessing = false;
    if (this.processingIndicatorTimeout) {
      clearTimeout(this.processingIndicatorTimeout);
      this.processingIndicatorTimeout = undefined;
    }
  }

  resolveReceiver() {
    this.receiverName = '';
    this.receiverLookupMessage = '';

    if (!this.receiver?.trim()) {
      this.receiverLookupMessage =
        'Please enter a receiver account number first.';
      return;
    }

    this.txService.getReceiverName(this.receiver.trim()).subscribe(
      (response) => {
        let parsed = response;

        try {
          const json = JSON.parse(response as string);
          parsed =
            json?.name ||
            json?.receiverName ||
            json?.accountName ||
            json?.data ||
            JSON.stringify(json);
        } catch {
          parsed = response;
        }

        if (typeof parsed === 'string' && parsed.trim()) {
          this.receiverName = parsed;
        } else {
          this.receiverLookupMessage = 'Receiver lookup returned empty result.';
        }
      },
      (error) => {
        this.receiverLookupMessage =
          error?.message ||
          'Unable to resolve receiver name. Please verify the account number.';
      },
    );
  }
}
