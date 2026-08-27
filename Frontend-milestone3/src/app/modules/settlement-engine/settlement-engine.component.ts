import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SettlementBatch {
  batchId: string;
  clearingMethod: string;
  pendingVolume: number; // in Rupees
  nettingRatio: string;
  sagaFlow: string;
  totalTransactions: number;
  status: string;
  estimatedCompletion: string;
  clearingWindow: string;
  grossAmount: number;
  netSettlementAmount: number;
}

export interface BankNettingDetail {
  bankName: string;
  grossOutward: number;
  grossInward: number;
  netObligation: number;
  type: 'PAYABLE' | 'RECEIVABLE';
}

@Component({
  selector: 'app-settlement-engine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settlement-engine.component.html',
  styleUrl: './settlement-engine.component.css'
})
export class SettlementEngineComponent {
  batches: SettlementBatch[] = [
    {
      batchId: 'SETTLE-2026-0820',
      clearingMethod: 'Multilateral Netting & RBI RTGS',
      pendingVolume: 142000000, // ₹14.2 Cr
      nettingRatio: '94.8%',
      sagaFlow: 'PaymentExecuted → ReserveHold → InterbankNetting → FinalSettlement',
      totalTransactions: 12450,
      status: 'Processing Batch',
      estimatedCompletion: '05 mins (Batch #8820)',
      clearingWindow: 'Window #4 (18:30 IST)',
      grossAmount: 2730000000, // ₹273 Cr
      netSettlementAmount: 142000000 // ₹14.2 Cr
    },
    {
      batchId: 'SETTLE-2026-0821',
      clearingMethod: 'NEFT Clearing Session 05',
      pendingVolume: 48000000, // ₹4.8 Cr
      nettingRatio: '91.2%',
      sagaFlow: 'BatchQueued → NettingCalculated → RTGSDispatched',
      totalTransactions: 6820,
      status: 'Queued',
      estimatedCompletion: '15 mins (Batch #8821)',
      clearingWindow: 'Window #5 (19:00 IST)',
      grossAmount: 545000000, // ₹54.5 Cr
      netSettlementAmount: 48000000
    },
    {
      batchId: 'SETTLE-2026-0819',
      clearingMethod: 'Bilateral High-Value RTGS',
      pendingVolume: 85000000, // ₹8.5 Cr
      nettingRatio: '98.5%',
      sagaFlow: 'DirectReserveRelease → RBI_RTGS_Ack',
      totalTransactions: 310,
      status: 'Settled & Reconciled',
      estimatedCompletion: 'Completed',
      clearingWindow: 'Window #3 (17:30 IST)',
      grossAmount: 5660000000, // ₹566 Cr
      netSettlementAmount: 85000000
    }
  ];

  selectedBatch: SettlementBatch = { ...this.batches[0] };

  // Netting Summary Data
  bankNettingList: BankNettingDetail[] = [
    { bankName: 'State Bank of India (SBI)', grossOutward: 850000000, grossInward: 920000000, netObligation: 70000000, type: 'RECEIVABLE' },
    { bankName: 'HDFC Bank Ltd', grossOutward: 640000000, grossInward: 580000000, netObligation: 60000000, type: 'PAYABLE' },
    { bankName: 'ICICI Bank Ltd', grossOutward: 510000000, grossInward: 540000000, netObligation: 30000000, type: 'RECEIVABLE' },
    { bankName: 'Axis Bank Ltd', grossOutward: 430000000, grossInward: 390000000, netObligation: 40000000, type: 'PAYABLE' },
    { bankName: 'Punjab National Bank (PNB)', grossOutward: 300000000, grossInward: 300000000, netObligation: 0, type: 'RECEIVABLE' }
  ];

  // Modals & UI state
  showNettingModal = false;
  showReportModal = false;
  showNewBatchModal = false;
  isClearingInProgress = false;
  clearingStep = 0;

  // New Batch Form Model
  newClearingMethod = 'Multilateral Netting & RBI RTGS';
  newGrossVolume = 50000000;
  newTxnCount = 1500;

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'info';

  selectBatch(item: SettlementBatch): void {
    this.selectedBatch = item;
  }

  forceClearBatch(): void {
    if (this.selectedBatch.status === 'Settled & Reconciled') {
      this.showToast(`Batch ${this.selectedBatch.batchId} is already fully settled.`, 'info');
      return;
    }

    this.isClearingInProgress = true;
    this.clearingStep = 1;
    this.selectedBatch.status = 'Clearing Initiated (Saga Active)';

    const stepsTimer = setInterval(() => {
      this.clearingStep++;
      if (this.clearingStep === 4) {
        clearInterval(stepsTimer);
        this.isClearingInProgress = false;
        this.selectedBatch.status = 'Settled & Reconciled';
        const found = this.batches.find(b => b.batchId === this.selectedBatch.batchId);
        if (found) {
          found.status = 'Settled & Reconciled';
          found.estimatedCompletion = 'Completed';
        }
        this.showToast(`Batch ${this.selectedBatch.batchId} cleared via RTGS. Net volume ₹${(this.selectedBatch.pendingVolume / 10000000).toFixed(2)} Cr settled successfully.`, 'success');
      }
    }, 900);
  }

  openNettingSummary(): void {
    this.showNettingModal = true;
  }

  closeNettingSummary(): void {
    this.showNettingModal = false;
  }

  downloadReport(): void {
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
  }

  openNewBatchModal(): void {
    this.showNewBatchModal = true;
  }

  closeNewBatchModal(): void {
    this.showNewBatchModal = false;
  }

  createNewBatch(): void {
    const newId = `SETTLE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nettingVal = Math.round(this.newGrossVolume * 0.06); // ~94% netting efficiency
    const newBatch: SettlementBatch = {
      batchId: newId,
      clearingMethod: this.newClearingMethod,
      pendingVolume: nettingVal,
      nettingRatio: '94.0%',
      sagaFlow: 'BatchQueued → MultilateralNetting → ReserveHold → RTGS',
      totalTransactions: this.newTxnCount,
      status: 'Queued',
      estimatedCompletion: '10 mins',
      clearingWindow: 'Next Window (19:30 IST)',
      grossAmount: this.newGrossVolume,
      netSettlementAmount: nettingVal
    };

    this.batches.unshift(newBatch);
    this.selectedBatch = newBatch;
    this.closeNewBatchModal();
    this.showToast(`New settlement batch ${newId} created with gross ₹${(this.newGrossVolume / 10000000).toFixed(2)} Cr.`, 'success');
  }

  getIsoXmlSnippet(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.009.001.08">
  <FICreditTrf>
    <GrpHdr>
      <MsgId>${this.selectedBatch.batchId}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>${this.selectedBatch.totalTransactions}</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <SttlmAcct>RBI-RTGS-SGL-99841</SttlmAcct>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId><EndToEndId>FINCORE-NET-SAGA-9082</EndToEndId></PmtId>
      <IntrBkSttlmAmt Ccy="INR">${this.selectedBatch.netSettlementAmount}</IntrBkSttlmAmt>
      <Dbtr>State Bank of India</Dbtr>
      <Cdtr>HDFC Bank Ltd</Cdtr>
    </CdtTrfTxInf>
  </FICreditTrf>
</Document>`;
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
