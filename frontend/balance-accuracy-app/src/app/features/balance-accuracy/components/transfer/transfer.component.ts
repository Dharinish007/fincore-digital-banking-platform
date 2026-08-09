import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Transaction } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent {
  sender = '';
  receiver = '';
  amount = 0;
  reference = '';
  statusMessage = '';

  constructor(private txService: TransactionService) {}

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
        this.statusMessage = 'Transfer submitted. Processing...';
        setTimeout(() => {
          this.statusMessage = 'Transfer completed (check transactions view).';
        }, 2500);
      },
      (err) => {
        this.statusMessage = 'Failed to submit transfer.';
      },
    );
  }
}
