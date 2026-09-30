import { db } from '../db.js';
import { NPARecord, NPAStatus, SMACategory } from '../../src/types/index.js';
import { AuditService } from './auditService.js';
import { NotificationService } from './notificationService.js';

export class NPAService {
  public static classifyAllLoans(executedBy = 'system'): { updatedCount: number; records: NPARecord[] } {
    const state = db.getState();
    const config = state.npaConfig;
    let updatedCount = 0;

    state.loans.forEach((loan) => {
      if (loan.status !== 'DISBURSED' && loan.status !== 'ACTIVE') return;

      // Find all unpaid overdue schedules for this loan
      const overdueSchedules = state.repaymentSchedules
        .filter((r) => r.loanId === loan.id && (r.status === 'OVERDUE' || r.status === 'DEFAULTED'))
        .sort((a, b) => b.daysPastDue - a.daysPastDue);

      const maxDpd = overdueSchedules.length > 0 ? overdueSchedules[0].daysPastDue : 0;
      const totalOverdue = overdueSchedules.reduce((sum, r) => sum + r.overdueAmount, 0);

      let npaStatus: NPAStatus = 'STANDARD';
      let smaCategory: SMACategory = 'NONE';
      let provisionPct = config.standardProvision;

      if (maxDpd > config.npaDays) {
        npaStatus = 'NPA';
        smaCategory = 'NONE';
        provisionPct = config.npaProvision;
      } else if (maxDpd > config.sma1Days) {
        npaStatus = 'SMA';
        smaCategory = 'SMA-2';
        provisionPct = config.smaProvision;
      } else if (maxDpd > config.sma0Days) {
        npaStatus = 'SMA';
        smaCategory = 'SMA-1';
        provisionPct = config.smaProvision;
      } else if (maxDpd > 0) {
        npaStatus = 'SMA';
        smaCategory = 'SMA-0';
        provisionPct = config.smaProvision;
      }

      const provisionAmount = (loan.outstandingPrincipal * provisionPct) / 100;

      let existingRecord = state.npaRecords.find((n) => n.loanId === loan.id);
      const oldStatus = existingRecord ? `${existingRecord.npaStatus} (${existingRecord.smaCategory})` : 'UNCLASSIFIED';
      const newStatus = `${npaStatus} (${smaCategory})`;

      if (!existingRecord) {
        existingRecord = {
          id: `NPA-${String(state.npaRecords.length + 1).padStart(4, '0')}`,
          loanId: loan.id,
          loanNumber: loan.loanNumber,
          customerId: loan.customerId,
          customerName: loan.customerName,
          outstandingPrincipal: loan.outstandingPrincipal,
          overdueAmount: totalOverdue,
          daysPastDue: maxDpd,
          lastPaymentDate: loan.disbursedDate,
          npaStatus,
          smaCategory,
          classificationDate: new Date().toISOString(),
          provisionPercentage: provisionPct,
          provisionAmount,
          remarks: maxDpd > 90 ? `Defaulted with ${maxDpd} DPD` : `Classified under standard prudential norms`,
        };
        state.npaRecords.push(existingRecord);
        updatedCount++;
      } else {
        existingRecord.outstandingPrincipal = loan.outstandingPrincipal;
        existingRecord.overdueAmount = totalOverdue;
        existingRecord.daysPastDue = maxDpd;
        existingRecord.npaStatus = npaStatus;
        existingRecord.smaCategory = smaCategory;
        existingRecord.classificationDate = new Date().toISOString();
        existingRecord.provisionPercentage = provisionPct;
        existingRecord.provisionAmount = provisionAmount;
        updatedCount++;
      }

      if (oldStatus !== newStatus) {
        AuditService.log({
          user: executedBy,
          role: 'ADMIN',
          action: 'NPA_CLASSIFIED',
          module: 'MILESTONE_2_DISBURSEMENT_NPA',
          entity: 'LOAN',
          entityId: loan.id,
          oldValue: oldStatus,
          newValue: newStatus,
          status: npaStatus === 'NPA' ? 'WARNING' : 'SUCCESS',
          details: `Loan ${loan.loanNumber} evaluated. DPD: ${maxDpd}, Overdue: ₹${totalOverdue.toLocaleString('en-IN')}`,
        });

        if (npaStatus === 'NPA' || npaStatus === 'SMA') {
          NotificationService.send({
            customerId: loan.customerId,
            type: 'NPA_CLASSIFIED',
            title: `Asset Classification Alert: ${loan.loanNumber}`,
            message: `Your loan ${loan.loanNumber} is currently at ${maxDpd} Days Past Due (${newStatus}). Overdue amount: ₹${totalOverdue.toLocaleString('en-IN')}. Please clear dues to prevent regulatory escalation.`,
            channel: 'IN_APP',
          });
        }
      }
    });

    return { updatedCount, records: state.npaRecords };
  }
}
