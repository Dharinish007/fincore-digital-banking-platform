import { Router } from 'express';
import { db } from '../db.js';
import { SagaOrchestrator } from '../services/sagaOrchestrator.js';
import { NPAService } from '../services/npaService.js';
import { AuditService } from '../services/auditService.js';

export const milestone2Router = Router();

// ======================= REPAYMENT TRACKING =======================
const handleGetRepayments = (req: any, res: any) => {
  const state = db.getState();
  const { loanId, customerId, status } = req.query;
  let schedules = state.repaymentSchedules;

  if (loanId) schedules = schedules.filter((s) => s.loanId === loanId);
  if (customerId) schedules = schedules.filter((s) => s.customerId === customerId);
  if (status) schedules = schedules.filter((s) => s.status === status);

  res.json({ success: true, schedules });
};

milestone2Router.get('/repayments', handleGetRepayments);
milestone2Router.get('/repayments/schedules', handleGetRepayments);

// Pay EMI via Repayment Saga
const handlePayEmi = async (req: any, res: any) => {
  const id = req.params.id || req.body.scheduleId;
  const { accountId, executedBy, simulateFailure } = req.body;

  try {
    const result = await SagaOrchestrator.executeRepaymentSaga({
      scheduleId: id,
      accountId: accountId || 'ACC-8001',
      executedBy: executedBy || 'teller',
      simulateFailure: Boolean(simulateFailure),
    });

    res.json({ success: result.success, message: result.message, saga: result.saga });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

milestone2Router.post('/repayments/pay', handlePayEmi);
milestone2Router.post('/repayments/:id/pay', handlePayEmi);

// ======================= DISBURSEMENT SAGA =======================
milestone2Router.post('/disbursements/execute', async (req, res) => {
  const { loanId, executedBy, simulateFailureAtStep, idempotencyKey } = req.body;

  if (!loanId) {
    return res.status(400).json({ success: false, message: 'loanId is required.' });
  }

  try {
    const result = await SagaOrchestrator.executeDisbursementSaga({
      loanId,
      executedBy: executedBy || 'supervisor',
      simulateFailureAtStep: simulateFailureAtStep ? Number(simulateFailureAtStep) : undefined,
      idempotencyKey,
    });

    res.json({ success: result.success, message: result.message, saga: result.saga });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================= NPA CLASSIFICATION =======================
milestone2Router.get('/npa', (req, res) => {
  const state = db.getState();
  const { status, smaCategory } = req.query;
  let records = state.npaRecords;

  if (status) records = records.filter((n) => n.npaStatus === status);
  if (smaCategory) records = records.filter((n) => n.smaCategory === smaCategory);

  const totalLoans = state.loans.length;
  const standardLoans = records.filter((n) => n.npaStatus === 'STANDARD').length;
  const smaLoans = records.filter((n) => n.npaStatus === 'SMA').length;
  const npaLoans = records.filter((n) => n.npaStatus === 'NPA').length;
  const totalNpaAmount = records
    .filter((n) => n.npaStatus === 'NPA')
    .reduce((sum, n) => sum + n.outstandingPrincipal, 0);
  const totalProvisionAllocated = records.reduce((sum, n) => sum + n.provisionAmount, 0);

  res.json({
    success: true,
    summary: {
      totalLoans,
      standardLoans,
      smaLoans,
      npaLoans,
      totalNpaAmount,
      totalProvisionAllocated,
    },
    config: state.npaConfig,
    records,
  });
});

const handleNpaClassify = (req: any, res: any) => {
  const { executedBy } = req.body;
  const result = NPAService.classifyAllLoans(executedBy || 'supervisor');
  res.json({ success: true, message: `Asset classification complete. ${result.updatedCount} loan records evaluated.`, records: result.records, classifiedCount: result.updatedCount });
};

milestone2Router.post('/npa/reclassify', handleNpaClassify);
milestone2Router.post('/npa/classify', handleNpaClassify);

milestone2Router.post('/npa/config', (req, res) => {
  const { sma0Days, sma1Days, sma2Days, npaDays, standardProvision, smaProvision, npaProvision, updatedBy } = req.body;
  const state = db.getState();

  state.npaConfig = {
    sma0Days: Number(sma0Days) || state.npaConfig.sma0Days,
    sma1Days: Number(sma1Days) || state.npaConfig.sma1Days,
    sma2Days: Number(sma2Days) || state.npaConfig.sma2Days,
    npaDays: Number(npaDays) || state.npaConfig.npaDays,
    standardProvision: Number(standardProvision) || state.npaConfig.standardProvision,
    smaProvision: Number(smaProvision) || state.npaConfig.smaProvision,
    npaProvision: Number(npaProvision) || state.npaConfig.npaProvision,
  };

  AuditService.log({
    user: updatedBy || 'admin',
    role: 'ADMIN',
    action: 'CONFIG_UPDATED',
    module: 'MILESTONE_2_DISBURSEMENT_NPA',
    entity: 'NPA_CONFIG',
    entityId: 'SYSTEM',
    details: `NPA classification thresholds updated. NPA threshold: ${state.npaConfig.npaDays} days`,
  });

  res.json({ success: true, config: state.npaConfig });
});
