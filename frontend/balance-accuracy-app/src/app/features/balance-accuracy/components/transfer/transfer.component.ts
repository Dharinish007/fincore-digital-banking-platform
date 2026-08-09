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

  constructor(private txService: TransactionService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  submit() {
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
        const backendMessage = res.backendResponse?.message;
        const balanceInfo = res.backendResponse?.balance
          ? ` New balance: ${res.backendResponse.balance}`
          : '';

        this.statusClass = isSuccess ? 'success' : 'error';
        this.statusMessage = backendMessage
          ? `${backendMessage}${balanceInfo}`
          : isSuccess
            ? `Money Transferred Successfully.${balanceInfo}`
            : 'Transfer failed. Please check the transaction details.';
      },
      (err) => {
        this.statusClass = 'error';
        this.statusMessage = err?.message || 'Failed to submit transfer.';
      },
    );
  }
}
