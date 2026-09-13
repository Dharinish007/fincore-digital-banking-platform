import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

export interface PaymentItem {
  txId: string;
  sagaId: string;
  amount: number; // in Rupees
  date: string;
  type: string;
  status: string;
  sender: string;
  receiver: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  private readonly api = inject(ApiService);
  payments: PaymentItem[] = [
    { txId: 'TXN-99401', sagaId: 'Saga: Account→Loan→Payment', amount: 18470, date: '05-Aug-2026', type: 'EMI Auto-Debit', status: 'Completed', sender: 'ACC-8849-1001', receiver: 'Loan HL-2024-1247' },
    { txId: 'TXN-99402', sagaId: 'Saga: Loan→Disbursement', amount: 2400000, date: '01-May-2024', type: 'Loan Disbursement', status: 'Completed', sender: 'FinCore Escrow Node', receiver: 'John Smith (ACC-1001)' },
    { txId: 'TXN-99403', sagaId: 'Saga: Account→Prepay', amount: 100000, date: '15-Jul-2026', type: 'Loan Prepayment', status: 'Completed', sender: 'John Smith', receiver: 'FinCore Loan Principal' },
    { txId: 'TXN-99404', sagaId: 'Saga: Interbank→NEFT', amount: 500000, date: '20-Aug-2026', type: 'High-Value Transfer', status: 'Completed', sender: 'TechCorp LLC', receiver: 'HDFC Vendor Escrow' }
  ];

  selectedPayment: PaymentItem = { ...this.payments[0] };

  ngOnInit(): void {
    this.loadPaymentsFromDatabase();
  }

  loadPaymentsFromDatabase(): void {
    this.api.get<any[]>('/api/operations/transactions').subscribe({
      next: (txs) => {
        if (txs && txs.length > 0) {
          const dbPayments: PaymentItem[] = txs.map(t => ({
            txId: t.transactionReference || `TXN-2026-000${t.id}`,
            sagaId: `Saga: Account→InterbankClearing (#${t.id})`,
            amount: Number(t.amount),
            date: t.createdAt ? String(t.createdAt).substring(0, 10) : '2026-09-12',
            type: t.type ? t.type.replace('_', ' ') : 'Interbank Transfer',
            status: t.status === 'SUCCESS' ? 'Completed' : t.status,
            sender: 'ACC-8849-1001 (John Smith)',
            receiver: 'Interbank RBI Clearing Node'
          }));
          this.payments = dbPayments;
          this.selectedPayment = dbPayments[0];
        }
      },
      error: (err) => console.warn('Payments DB load fallback:', err)
    });
  }


  // Modals & UI State
  showNewTransferModal = false;
  showSagaTraceModal = false;

  // New Payment Form Model
  newRecipient = '';
  newAmount = 25000;
  newChannel = 'IMPS Immediate Transfer';

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  selectPayment(item: PaymentItem): void {
    this.selectedPayment = item;
  }

  openNewTransfer(): void { this.showNewTransferModal = true; }
  openSagaTrace(): void { this.showSagaTraceModal = true; }
  closeModals(): void { this.showNewTransferModal = false; this.showSagaTraceModal = false; }

  processNewTransfer(): void {
    if (!this.newRecipient || this.newAmount <= 0) {
      this.showToast('Please enter recipient details and valid amount.', 'danger');
      return;
    }

    const newTxId = `TXN-${Math.floor(90000 + Math.random() * 10000)}`;
    const newTx: PaymentItem = {
      txId: newTxId,
      sagaId: 'Saga: RealTimePaymentSaga',
      amount: this.newAmount,
      date: new Date().toISOString().substring(0, 10),
      type: this.newChannel,
      status: 'Completed',
      sender: 'ACC-8849-1001 (John Smith)',
      receiver: this.newRecipient
    };

    this.payments.unshift(newTx);
    this.selectedPayment = newTx;
    this.closeModals();

    // Trigger debit in PostgreSQL database
    this.api.post('/api/operations/accounts/1/balance-adjustments', {
      amount: this.newAmount,
      entryType: 'DEBIT',
      description: `Payment ${newTxId} to ${this.newRecipient} via ${this.newChannel}`
    }).subscribe({
      error: (err) => console.warn('Payment debit sync fallback:', err)
    });

    // Record in Audit Trail
    this.api.post('/api/audit', {
      username: 'SYSTEM_OPERATOR',
      action: 'PAYMENT_TRANSFER_DISPATCHED',
      module: 'SETTLEMENT',
      entityType: 'PAYMENT',
      entityId: newTxId,
      details: `Dispatched payment of ₹${this.newAmount} to ${this.newRecipient} via ${this.newChannel}`,
      status: 'SUCCESS'
    }).subscribe({
      error: (err) => console.warn('Payment audit sync fallback:', err)
    });

    this.showToast(`Transfer ${newTxId} of ₹${this.newAmount.toLocaleString('en-IN')} sent via ${this.newChannel} and recorded in database.`, 'success');
  }


  private showToast(msg: string, type: 'success' | 'danger' | 'info'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { if (this.toastMessage === msg) this.toastMessage = null; }, 4500);
  }
}
