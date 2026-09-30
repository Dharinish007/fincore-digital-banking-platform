import { db } from '../db.js';
import {
  SagaInstance,
  SagaStep,
  Transaction,
  Settlement,
  RepaymentSchedule,
  Loan,
  Account,
  Customer
} from '../../src/types/index.js';
import { AuditService } from './auditService.js';
import { NotificationService } from './notificationService.js';

export class SagaOrchestrator {
  /**
   * Execute Loan Disbursement Saga
   */
  public static async executeDisbursementSaga(params: {
    loanId: string;
    executedBy: string;
    simulateFailureAtStep?: number;
    idempotencyKey?: string;
  }): Promise<{ saga: SagaInstance; success: boolean; message: string }> {
    const state = db.getState();
    const loan = state.loans.find((l) => l.id === params.loanId);
    if (!loan) throw new Error(`Loan not found: ${params.loanId}`);

    const customer = state.customers.find((c) => c.id === loan.customerId);
    if (!customer) throw new Error(`Customer not found: ${loan.customerId}`);

    const account = state.accounts.find((a) => a.id === loan.accountId);
    if (!account) throw new Error(`Disbursement target account not found: ${loan.accountId}`);

    const idempotencyKey = params.idempotencyKey || `IDEMP-DISB-${loan.id}-${Date.now()}`;

    // Check duplicate idempotency
    const existingSaga = state.sagas.find((s) => s.idempotencyKey === idempotencyKey);
    if (existingSaga && existingSaga.status === 'COMPLETED') {
      return { saga: existingSaga, success: true, message: 'Idempotent request: Saga already completed.' };
    }

    const sagaId = `SAGA-DISB-${String(state.sagas.length + 1).padStart(3, '0')}`;
    const txnRef = `TXN-FC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const steps: SagaStep[] = [
      {
        stepNumber: 1,
        name: 'Validate Customer & KYC Status',
        action: `Verify KYC status for ${customer.fullName} (${customer.customerCode})`,
        compensationAction: 'None (Read-only validation)',
        status: 'PENDING',
      },
      {
        stepNumber: 2,
        name: 'Validate Target Disbursement Account',
        action: `Ensure Account ${account.accountNumber} is active and unblocked`,
        compensationAction: 'None (Read-only validation)',
        status: 'PENDING',
      },
      {
        stepNumber: 3,
        name: 'Reserve Central Liquidity Pool',
        action: `Reserve ₹${loan.principalAmount.toLocaleString('en-IN')} in FinCore Core Treasury Pool`,
        compensationAction: `Release ₹${loan.principalAmount.toLocaleString('en-IN')} hold in Core Treasury Pool`,
        status: 'PENDING',
      },
      {
        stepNumber: 4,
        name: 'Credit Customer Account',
        action: `Credit ₹${loan.principalAmount.toLocaleString('en-IN')} to Account ${account.accountNumber}`,
        compensationAction: `Debit reversal ₹${loan.principalAmount.toLocaleString('en-IN')} from Account ${account.accountNumber}`,
        status: 'PENDING',
      },
      {
        stepNumber: 5,
        name: 'Generate Amortization Repayment Schedule',
        action: `Generate ${loan.tenureMonths}-month EMI schedule (EMI ₹${loan.emiAmount.toLocaleString('en-IN')})`,
        compensationAction: 'Delete generated repayment schedule rows',
        status: 'PENDING',
      },
      {
        stepNumber: 6,
        name: 'Create Settlement & Dispatch Notification',
        action: 'Post internal settlement record and notify customer via SMS/In-App',
        compensationAction: 'Cancel settlement and send cancellation alert',
        status: 'PENDING',
      },
    ];

    const sagaInstance: SagaInstance = {
      id: sagaId,
      sagaType: 'DISBURSEMENT',
      customerId: customer.id,
      customerName: customer.fullName,
      loanId: loan.id,
      accountId: account.id,
      amount: loan.principalAmount,
      currency: 'INR',
      currentStep: 0,
      totalSteps: 6,
      status: 'PROCESSING',
      retryCount: 0,
      maxRetries: 3,
      idempotencyKey,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps,
    };

    state.sagas.unshift(sagaInstance);

    AuditService.log({
      user: params.executedBy,
      role: 'SUPERVISOR',
      action: 'SAGA_STARTED',
      module: 'MILESTONE_3_SAGA_SETTLEMENT',
      entity: 'SAGA_INSTANCE',
      entityId: sagaId,
      details: `Started Loan Disbursement Saga for ${loan.loanNumber} (₹${loan.principalAmount.toLocaleString('en-IN')})`,
    });

    // Execute steps sequentially
    try {
      // STEP 1
      sagaInstance.currentStep = 1;
      steps[0].status = 'RUNNING';
      if (params.simulateFailureAtStep === 1 || customer.kycStatus !== 'VERIFIED') {
        throw new Error(`Customer KYC is ${customer.kycStatus}. KYC must be VERIFIED for disbursement.`);
      }
      steps[0].status = 'COMPLETED';
      steps[0].executedAt = new Date().toISOString();

      // STEP 2
      sagaInstance.currentStep = 2;
      steps[1].status = 'RUNNING';
      if (params.simulateFailureAtStep === 2 || account.status !== 'ACTIVE') {
        throw new Error(`Target account ${account.accountNumber} status is ${account.status}.`);
      }
      steps[1].status = 'COMPLETED';
      steps[1].executedAt = new Date().toISOString();

      // STEP 3
      sagaInstance.currentStep = 3;
      steps[2].status = 'RUNNING';
      if (params.simulateFailureAtStep === 3) {
        throw new Error('Treasury Liquidity Pool allocation timeout.');
      }
      steps[2].status = 'COMPLETED';
      steps[2].executedAt = new Date().toISOString();

      // STEP 4 - Credit account
      sagaInstance.currentStep = 4;
      steps[3].status = 'RUNNING';
      if (params.simulateFailureAtStep === 4) {
        throw new Error('Core ledger account posting error (Network partition).');
      }
      account.balance += loan.principalAmount;
      steps[3].status = 'COMPLETED';
      steps[3].executedAt = new Date().toISOString();

      // Create transaction record
      const txnId = `TXN-${String(state.transactions.length + 1).padStart(5, '0')}`;
      const txn: Transaction = {
        id: txnId,
        transactionReference: txnRef,
        sourceAccountId: 'ACC-SYSTEM-POOL',
        destinationAccountId: account.id,
        customerId: customer.id,
        customerName: customer.fullName,
        amount: loan.principalAmount,
        currency: 'INR',
        type: 'LOAN_DISBURSEMENT',
        status: 'SUCCESS',
        description: `Loan Disbursement for ${loan.loanNumber}`,
        sagaId,
        timestamp: new Date().toISOString(),
      };
      state.transactions.unshift(txn);
      sagaInstance.transactionId = txnId;

      // STEP 5 - Generate Repayment Schedule
      sagaInstance.currentStep = 5;
      steps[4].status = 'RUNNING';
      if (params.simulateFailureAtStep === 5) {
        throw new Error('Amortization schedule generation engine failed.');
      }

      // Generate schedules
      const monthlyInterestRate = loan.interestRate / 12 / 100;
      let remainingPrincipal = loan.principalAmount;
      const schedules: RepaymentSchedule[] = [];

      for (let i = 1; i <= loan.tenureMonths; i++) {
        const interestPart = Math.round(remainingPrincipal * monthlyInterestRate);
        const principalPart = loan.emiAmount - interestPart;
        remainingPrincipal = Math.max(0, remainingPrincipal - principalPart);

        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);

        schedules.push({
          id: `REP-${loan.id.replace('LN-', '')}-${String(i).padStart(3, '0')}`,
          loanId: loan.id,
          customerId: customer.id,
          customerName: customer.fullName,
          installmentNumber: i,
          dueDate: dueDate.toISOString().slice(0, 10),
          emiAmount: loan.emiAmount,
          principalComponent: principalPart,
          interestComponent: interestPart,
          paidAmount: 0,
          overdueAmount: 0,
          daysPastDue: 0,
          status: i === 1 ? 'DUE' : 'UPCOMING',
          penaltyAmount: 0,
        });
      }

      state.repaymentSchedules.push(...schedules);
      loan.status = 'DISBURSED';
      loan.disbursedDate = new Date().toISOString();

      steps[4].status = 'COMPLETED';
      steps[4].executedAt = new Date().toISOString();

      // STEP 6 - Settlement & Notifications
      sagaInstance.currentStep = 6;
      steps[5].status = 'RUNNING';
      if (params.simulateFailureAtStep === 6) {
        throw new Error('Settlement clearance system rejection.');
      }

      const settlementId = `SETTL-${String(state.settlements.length + 1).padStart(4, '0')}`;
      const settlement: Settlement = {
        id: settlementId,
        settlementReference: `STL-FC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: txnId,
        sagaId,
        customerId: customer.id,
        customerName: customer.fullName,
        amount: loan.principalAmount,
        currency: 'INR',
        settlementType: 'INTERNAL_CLEARING',
        bankReference: `FC-DISB-${loan.loanNumber}`,
        clearingHouse: 'FinCore Core Settlement Hub',
        status: 'SUCCESS',
        initiatedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3,
      };
      state.settlements.unshift(settlement);
      txn.settlementId = settlementId;

      steps[5].status = 'COMPLETED';
      steps[5].executedAt = new Date().toISOString();

      sagaInstance.status = 'COMPLETED';
      sagaInstance.updatedAt = new Date().toISOString();

      AuditService.log({
        user: params.executedBy,
        role: 'SUPERVISOR',
        action: 'DISBURSEMENT_COMPLETED',
        module: 'MILESTONE_2_DISBURSEMENT_NPA',
        entity: 'LOAN',
        entityId: loan.id,
        oldValue: 'APPROVED',
        newValue: 'DISBURSED',
        details: `Disbursement Saga ${sagaId} completed successfully for ₹${loan.principalAmount.toLocaleString('en-IN')}`,
      });

      NotificationService.send({
        customerId: customer.id,
        transactionId: txnId,
        sagaId,
        type: 'LOAN_DISBURSED',
        title: `Loan Disbursed: ₹${loan.principalAmount.toLocaleString('en-IN')}`,
        message: `Your ${loan.loanType.replace('_', ' ')} ${loan.loanNumber} of ₹${loan.principalAmount.toLocaleString('en-IN')} has been disbursed to Account ${account.accountNumber}.`,
        channel: 'IN_APP',
      });

      return { saga: sagaInstance, success: true, message: 'Disbursement Saga executed and settled successfully.' };
    } catch (err: any) {
      // FAILURE OCCURRED -> EXECUTE SAGA COMPENSATION
      const failedStepNum = sagaInstance.currentStep;
      steps[failedStepNum - 1].status = 'FAILED';
      steps[failedStepNum - 1].errorMessage = err.message;
      sagaInstance.status = 'COMPENSATING';
      sagaInstance.failureReason = err.message;

      AuditService.log({
        user: params.executedBy,
        role: 'ADMIN',
        action: 'SAGA_FAILED',
        module: 'MILESTONE_3_SAGA_SETTLEMENT',
        entity: 'SAGA_INSTANCE',
        entityId: sagaId,
        status: 'FAILURE',
        details: `Saga failed at Step ${failedStepNum} (${steps[failedStepNum - 1].name}): ${err.message}`,
      });

      // Compensate completed steps in reverse order
      await this.rollbackSteps(sagaInstance, failedStepNum, loan, account);

      sagaInstance.status = 'COMPENSATED';
      sagaInstance.updatedAt = new Date().toISOString();

      NotificationService.send({
        customerId: customer.id,
        sagaId,
        type: 'SAGA_COMPENSATED',
        title: 'Loan Disbursement Failed & Safely Compensated',
        message: `Disbursement for ${loan.loanNumber} failed at step ${failedStepNum}. All ledger modifications have been rolled back cleanly.`,
        channel: 'IN_APP',
      });

      return {
        saga: sagaInstance,
        success: false,
        message: `Saga failed at step ${failedStepNum}: ${err.message}. Compensation completed.`,
      };
    }
  }

  /**
   * Helper to execute compensation rollback
   */
  private static async rollbackSteps(
    saga: SagaInstance,
    failedAtStep: number,
    loan?: Loan,
    account?: Account
  ) {
    const state = db.getState();

    for (let s = failedAtStep - 1; s >= 1; s--) {
      const step = saga.steps[s - 1];
      if (step.status === 'COMPLETED') {
        if (s === 4 && account && loan) {
          // Reverse Account Credit
          account.balance = Math.max(0, account.balance - loan.principalAmount);
        } else if (s === 5 && loan) {
          // Remove generated schedules
          state.repaymentSchedules = state.repaymentSchedules.filter((r) => r.loanId !== loan.id);
          loan.status = 'APPROVED';
        }
        step.status = 'COMPENSATED';
      }
    }

    if (saga.transactionId) {
      const txn = state.transactions.find((t) => t.id === saga.transactionId);
      if (txn) txn.status = 'REVERSED';
    }

    AuditService.log({
      user: 'saga-coordinator',
      role: 'ADMIN',
      action: 'SAGA_COMPENSATED',
      module: 'MILESTONE_3_SAGA_SETTLEMENT',
      entity: 'SAGA_INSTANCE',
      entityId: saga.id,
      status: 'WARNING',
      details: `Compensated all prior steps for Saga ${saga.id}`,
    });
  }

  /**
   * Retry a failed Saga
   */
  public static async retrySaga(
    sagaId: string,
    executedBy: string
  ): Promise<{ saga: SagaInstance; success: boolean; message: string }> {
    const state = db.getState();
    const saga = state.sagas.find((s) => s.id === sagaId);
    if (!saga) throw new Error(`Saga not found: ${sagaId}`);

    if (saga.status !== 'FAILED' && saga.status !== 'COMPENSATED') {
      return { saga, success: false, message: 'Only FAILED or COMPENSATED Sagas can be retried.' };
    }

    if (saga.retryCount >= saga.maxRetries) {
      return { saga, success: false, message: `Maximum retries (${saga.maxRetries}) exceeded.` };
    }

    saga.retryCount += 1;
    saga.status = 'PROCESSING';
    saga.failureReason = undefined;

    // Reset failed/compensated steps
    saga.steps.forEach((step) => {
      if (step.status === 'FAILED' || step.status === 'COMPENSATED') {
        step.status = 'PENDING';
        step.errorMessage = undefined;
      }
    });

    if (saga.sagaType === 'DISBURSEMENT' && saga.loanId) {
      return this.executeDisbursementSaga({
        loanId: saga.loanId,
        executedBy,
        idempotencyKey: `${saga.idempotencyKey}-retry-${saga.retryCount}`,
      });
    }

    saga.status = 'COMPLETED';
    saga.steps.forEach((s) => (s.status = 'COMPLETED'));
    return { saga, success: true, message: `Saga ${saga.id} successfully retried.` };
  }

  /**
   * Execute Repayment Saga (Pay EMI)
   */
  public static async executeRepaymentSaga(params: {
    scheduleId: string;
    accountId: string;
    executedBy: string;
    simulateFailure?: boolean;
  }): Promise<{ saga: SagaInstance; success: boolean; message: string }> {
    const state = db.getState();
    const schedule = state.repaymentSchedules.find((r) => r.id === params.scheduleId);
    if (!schedule) throw new Error(`Repayment schedule not found: ${params.scheduleId}`);

    const loan = state.loans.find((l) => l.id === schedule.loanId);
    if (!loan) throw new Error(`Loan not found: ${schedule.loanId}`);

    const account = state.accounts.find((a) => a.id === params.accountId);
    if (!account) throw new Error(`Debit account not found: ${params.accountId}`);

    const totalToPay = schedule.emiAmount + schedule.penaltyAmount;
    if (account.balance < totalToPay) {
      throw new Error(`Insufficient funds in Account ${account.accountNumber}. Balance: ₹${account.balance.toLocaleString('en-IN')}, Required: ₹${totalToPay.toLocaleString('en-IN')}`);
    }

    const sagaId = `SAGA-REP-${String(state.sagas.length + 1).padStart(3, '0')}`;
    const txnRef = `TXN-FC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const steps: SagaStep[] = [
      {
        stepNumber: 1,
        name: 'Debit Customer Account',
        action: `Debit ₹${totalToPay.toLocaleString('en-IN')} from Account ${account.accountNumber}`,
        compensationAction: `Credit ₹${totalToPay.toLocaleString('en-IN')} back to Account ${account.accountNumber}`,
        status: 'PENDING',
      },
      {
        stepNumber: 2,
        name: 'Credit Loan Repayment Ledger',
        action: `Apply Principal ₹${schedule.principalComponent.toLocaleString('en-IN')} and Interest ₹${schedule.interestComponent.toLocaleString('en-IN')}`,
        compensationAction: 'Revert Loan Ledger balance credit',
        status: 'PENDING',
      },
      {
        stepNumber: 3,
        name: 'Update Repayment Schedule & NPA Status',
        action: `Mark Installment #${schedule.installmentNumber} as PAID and recalibrate DPD`,
        compensationAction: 'Revert Installment status to DUE/OVERDUE',
        status: 'PENDING',
      },
      {
        stepNumber: 4,
        name: 'Confirm IMPS/Clearing Settlement',
        action: 'Dispatch settlement confirmation packet to Clearing Gateway',
        compensationAction: 'Send cancellation packet to Clearing Gateway',
        status: 'PENDING',
      },
      {
        stepNumber: 5,
        name: 'Deliver Notification & Audit Log',
        action: 'Send In-App & SMS receipt to customer',
        compensationAction: 'Send failure apology alert',
        status: 'PENDING',
      },
    ];

    const sagaInstance: SagaInstance = {
      id: sagaId,
      sagaType: 'REPAYMENT',
      customerId: schedule.customerId,
      customerName: schedule.customerName,
      loanId: loan.id,
      accountId: account.id,
      amount: totalToPay,
      currency: 'INR',
      currentStep: 1,
      totalSteps: 5,
      status: 'PROCESSING',
      retryCount: 0,
      maxRetries: 3,
      idempotencyKey: `IDEMP-REP-${schedule.id}-${Date.now()}`,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps,
    };

    state.sagas.unshift(sagaInstance);

    try {
      // Step 1: Debit account
      sagaInstance.currentStep = 1;
      steps[0].status = 'RUNNING';
      account.balance -= totalToPay;
      steps[0].status = 'COMPLETED';
      steps[0].executedAt = new Date().toISOString();

      if (params.simulateFailure) {
        throw new Error('Repayment clearing gateway disconnected abruptly.');
      }

      // Step 2: Credit loan ledger
      sagaInstance.currentStep = 2;
      steps[1].status = 'RUNNING';
      loan.paidAmount += totalToPay;
      loan.outstandingPrincipal = Math.max(0, loan.outstandingPrincipal - schedule.principalComponent);
      steps[1].status = 'COMPLETED';
      steps[1].executedAt = new Date().toISOString();

      // Step 3: Update schedule
      sagaInstance.currentStep = 3;
      steps[2].status = 'RUNNING';
      schedule.paidAmount = totalToPay;
      schedule.paidDate = new Date().toISOString();
      schedule.status = 'PAID';
      schedule.overdueAmount = 0;
      schedule.daysPastDue = 0;
      steps[2].status = 'COMPLETED';
      steps[2].executedAt = new Date().toISOString();

      // Step 4: Settlement
      sagaInstance.currentStep = 4;
      steps[3].status = 'RUNNING';
      const txnId = `TXN-${String(state.transactions.length + 1).padStart(5, '0')}`;
      const txn: Transaction = {
        id: txnId,
        transactionReference: txnRef,
        sourceAccountId: account.id,
        destinationAccountId: 'ACC-SYSTEM-LOAN',
        customerId: schedule.customerId,
        customerName: schedule.customerName,
        amount: totalToPay,
        currency: 'INR',
        type: 'LOAN_REPAYMENT',
        status: 'SUCCESS',
        description: `EMI Repayment for Loan ${loan.loanNumber} (Installment #${schedule.installmentNumber})`,
        sagaId,
        timestamp: new Date().toISOString(),
      };
      state.transactions.unshift(txn);
      sagaInstance.transactionId = txnId;

      const settlementId = `SETTL-${String(state.settlements.length + 1).padStart(4, '0')}`;
      const settlement: Settlement = {
        id: settlementId,
        settlementReference: `STL-FC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: txnId,
        sagaId,
        customerId: schedule.customerId,
        customerName: schedule.customerName,
        amount: totalToPay,
        currency: 'INR',
        settlementType: 'IMPS',
        bankReference: `NPCI-IMPS-${Math.floor(1000000 + Math.random() * 9000000)}`,
        clearingHouse: 'National Payments Corporation of India',
        status: 'SUCCESS',
        initiatedAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3,
      };
      state.settlements.unshift(settlement);
      txn.settlementId = settlementId;

      steps[3].status = 'COMPLETED';
      steps[3].executedAt = new Date().toISOString();

      // Step 5: Notification & Audit
      sagaInstance.currentStep = 5;
      steps[4].status = 'RUNNING';
      steps[4].status = 'COMPLETED';
      steps[4].executedAt = new Date().toISOString();

      sagaInstance.status = 'COMPLETED';
      sagaInstance.updatedAt = new Date().toISOString();

      AuditService.log({
        user: params.executedBy,
        role: 'TELLER',
        action: 'REPAYMENT_PROCESSED',
        module: 'MILESTONE_2_DISBURSEMENT_NPA',
        entity: 'REPAYMENT_SCHEDULE',
        entityId: schedule.id,
        details: `EMI of ₹${totalToPay.toLocaleString('en-IN')} paid for loan ${loan.loanNumber} via account ${account.accountNumber}`,
      });

      NotificationService.send({
        customerId: schedule.customerId,
        transactionId: txnId,
        sagaId,
        type: 'REPAYMENT_SUCCESS',
        title: `EMI Repayment Successful: ₹${totalToPay.toLocaleString('en-IN')}`,
        message: `Installment #${schedule.installmentNumber} for loan ${loan.loanNumber} has been received and settled successfully.`,
        channel: 'IN_APP',
      });

      return { saga: sagaInstance, success: true, message: 'Repayment Saga completed successfully.' };
    } catch (err: any) {
      sagaInstance.status = 'COMPENSATING';
      sagaInstance.failureReason = err.message;
      steps[sagaInstance.currentStep - 1].status = 'FAILED';
      steps[sagaInstance.currentStep - 1].errorMessage = err.message;

      // Rollback step 1 debit
      account.balance += totalToPay;
      steps[0].status = 'COMPENSATED';
      sagaInstance.status = 'COMPENSATED';
      sagaInstance.updatedAt = new Date().toISOString();

      AuditService.log({
        user: params.executedBy,
        role: 'ADMIN',
        action: 'SAGA_COMPENSATED',
        module: 'MILESTONE_3_SAGA_SETTLEMENT',
        entity: 'SAGA_INSTANCE',
        entityId: sagaId,
        status: 'WARNING',
        details: `Repayment Saga failed: ${err.message}. Account debit reversed.`,
      });

      NotificationService.send({
        customerId: schedule.customerId,
        sagaId,
        type: 'REPAYMENT_FAILED',
        title: 'EMI Repayment Failed & Funds Reversed',
        message: `Your payment of ₹${totalToPay.toLocaleString('en-IN')} encountered an error: ${err.message}. Deducted funds have been credited back.`,
        channel: 'IN_APP',
      });

      return { saga: sagaInstance, success: false, message: `Repayment failed: ${err.message}. Funds reversed.` };
    }
  }
}
