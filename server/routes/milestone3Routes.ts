import { Router } from 'express';
import { db } from '../db.js';
import { SagaOrchestrator } from '../services/sagaOrchestrator.js';
import { AuditService } from '../services/auditService.js';
import { NotificationService } from '../services/notificationService.js';

export const milestone3Router = Router();

// ======================= SAGA EXECUTION =======================
milestone3Router.get('/sagas', (req, res) => {
  const state = db.getState();
  const { type, status, search } = req.query;
  let sagas = state.sagas;

  if (type) sagas = sagas.filter((s) => s.sagaType === type);
  if (status) sagas = sagas.filter((s) => s.status === status);
  if (search) {
    const s = String(search).toLowerCase();
    sagas = sagas.filter(
      (sg) =>
        sg.id.toLowerCase().includes(s) ||
        sg.customerName.toLowerCase().includes(s) ||
        sg.transactionId?.toLowerCase().includes(s)
    );
  }

  const summary = {
    totalSagas: state.sagas.length,
    running: state.sagas.filter((s) => s.status === 'PROCESSING' || s.status === 'INITIATED').length,
    completed: state.sagas.filter((s) => s.status === 'COMPLETED').length,
    failed: state.sagas.filter((s) => s.status === 'FAILED').length,
    compensated: state.sagas.filter((s) => s.status === 'COMPENSATED').length,
  };

  res.json({ success: true, summary, sagas });
});

milestone3Router.get('/sagas/:id', (req, res) => {
  const state = db.getState();
  const saga = state.sagas.find((s) => s.id === req.params.id);
  if (!saga) return res.status(404).json({ success: false, message: 'Saga not found.' });
  res.json({ success: true, saga });
});

// Retry a failed Saga
milestone3Router.post('/sagas/:id/retry', async (req, res) => {
  const { id } = req.params;
  const { executedBy } = req.body;

  try {
    const result = await SagaOrchestrator.retrySaga(id, executedBy || 'supervisor');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================= SETTLEMENTS =======================
milestone3Router.get('/settlements', (req, res) => {
  const state = db.getState();
  const { status, type, search } = req.query;
  let settlements = state.settlements;

  if (status) settlements = settlements.filter((s) => s.status === status);
  if (type) settlements = settlements.filter((s) => s.settlementType === type);
  if (search) {
    const s = String(search).toLowerCase();
    settlements = settlements.filter(
      (st) =>
        (st.id || '').toLowerCase().includes(s) ||
        (st.settlementReference || (st as any).batchNumber || '').toLowerCase().includes(s) ||
        (st.bankReference || '').toLowerCase().includes(s) ||
        (st.customerName || '').toLowerCase().includes(s) ||
        (st.clearingHouse || '').toLowerCase().includes(s)
    );
  }

  // Format so both Settlement and SettlementRecord interfaces are supported
  const mappedSettlements = settlements.map((st) => ({
    ...st,
    batchNumber: (st as any).batchNumber || st.settlementReference || st.id,
    totalAmount: (st as any).totalAmount !== undefined ? (st as any).totalAmount : st.amount,
    networkType: (st as any).networkType || st.settlementType,
    fee: (st as any).fee !== undefined ? (st as any).fee : 25,
    settlementDate: (st as any).settlementDate || st.confirmedAt || st.initiatedAt,
  }));

  res.json({ success: true, settlements: mappedSettlements });
});

// Confirm / Process settlement
const handleConfirmSettlement = (req: any, res: any) => {
  const { id } = req.params;
  const { confirmedBy } = req.body;
  const state = db.getState();
  const settlement = state.settlements.find((s) => s.id === id);

  if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found.' });

  settlement.status = 'SUCCESS';
  settlement.confirmedAt = new Date().toISOString();

  AuditService.log({
    user: confirmedBy || 'supervisor',
    role: 'SUPERVISOR',
    action: 'SETTLEMENT_CONFIRMED',
    module: 'MILESTONE_3_SAGA_SETTLEMENT',
    entity: 'SETTLEMENT',
    entityId: settlement.id,
    oldValue: 'PENDING',
    newValue: 'SUCCESS',
    details: `Settlement ${settlement.settlementReference} confirmed by ${confirmedBy || 'supervisor'}`,
  });

  NotificationService.send({
    customerId: settlement.customerId,
    transactionId: settlement.transactionId,
    sagaId: settlement.sagaId,
    type: 'SETTLEMENT_CONFIRMED',
    title: `Settlement Confirmed: ₹${settlement.amount.toLocaleString('en-IN')}`,
    message: `Payment clearing via ${settlement.clearingHouse} (Ref: ${settlement.bankReference}) confirmed.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, settlement });
};

milestone3Router.post('/settlements/:id/confirm', handleConfirmSettlement);
milestone3Router.post('/settlements/:id/process', handleConfirmSettlement);

// Retry failed settlement
milestone3Router.post('/settlements/:id/retry', (req, res) => {
  const { id } = req.params;
  const { executedBy } = req.body;
  const state = db.getState();
  const settlement = state.settlements.find((s) => s.id === id);

  if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found.' });

  if (settlement.retryCount >= settlement.maxRetries) {
    return res.status(400).json({ success: false, message: `Maximum retries (${settlement.maxRetries}) reached. Initiate compensation.` });
  }

  settlement.retryCount += 1;
  settlement.status = 'SUCCESS';
  settlement.confirmedAt = new Date().toISOString();
  settlement.failureReason = undefined;

  AuditService.log({
    user: executedBy || 'supervisor',
    role: 'SUPERVISOR',
    action: 'SETTLEMENT_CONFIRMED',
    module: 'MILESTONE_3_SAGA_SETTLEMENT',
    entity: 'SETTLEMENT',
    entityId: settlement.id,
    details: `Settlement retry #${settlement.retryCount} succeeded.`,
  });

  res.json({ success: true, message: 'Settlement retried and confirmed successfully.', settlement });
});

// Reverse settlement (triggers compensation)
milestone3Router.post('/settlements/:id/reverse', (req, res) => {
  const { id } = req.params;
  const { reversedBy, reason } = req.body;
  const state = db.getState();
  const settlement = state.settlements.find((s) => s.id === id);

  if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found.' });

  settlement.status = 'REVERSED';
  settlement.failureReason = reason || 'Manual supervisor reversal and compensation dispatched.';

  if (settlement.transactionId) {
    const txn = state.transactions.find((t) => t.id === settlement.transactionId);
    if (txn) txn.status = 'REVERSED';
  }

  AuditService.log({
    user: reversedBy || 'supervisor',
    role: 'SUPERVISOR',
    action: 'TRANSACTION_REVERSED',
    module: 'MILESTONE_3_SAGA_SETTLEMENT',
    entity: 'SETTLEMENT',
    entityId: settlement.id,
    oldValue: 'SUCCESS',
    newValue: 'REVERSED',
    details: `Settlement reversed. Reason: ${settlement.failureReason}`,
  });

  NotificationService.send({
    customerId: settlement.customerId,
    transactionId: settlement.transactionId,
    type: 'SETTLEMENT_FAILED',
    title: 'Settlement Reversal & Compensation Notice',
    message: `Settlement ${settlement.settlementReference} (₹${settlement.amount.toLocaleString('en-IN')}) was reversed.`,
    channel: 'IN_APP',
  });

  res.json({ success: true, settlement });
});

// ======================= NOTIFICATIONS =======================
milestone3Router.get('/notifications', (req, res) => {
  const state = db.getState();
  const { customerId, channel, unreadOnly } = req.query;
  let notifs = state.notifications;

  if (customerId) notifs = notifs.filter((n) => n.customerId === customerId);
  if (channel) notifs = notifs.filter((n) => n.channel === channel);
  if (unreadOnly === 'true') notifs = notifs.filter((n) => !n.isRead);

  // Map to support both Notification and NotificationRecord
  const mappedNotifs = notifs.map((n) => ({
    ...n,
    recipient: (n as any).recipient || n.customerId || n.userId || 'Customer Portal',
    subject: (n as any).subject || n.title,
    body: (n as any).body || n.message,
    sentAt: (n as any).sentAt || n.createdAt,
  }));

  res.json({ success: true, notifications: mappedNotifs, unreadCount: notifs.filter((n) => !n.isRead).length });
});

milestone3Router.patch('/notifications/:id/read', (req, res) => {
  const state = db.getState();
  const notif = state.notifications.find((n) => n.id === req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });

  notif.isRead = true;
  notif.readAt = new Date().toISOString();
  res.json({ success: true, notification: notif });
});

milestone3Router.post('/notifications/mark-all-read', (req, res) => {
  const state = db.getState();
  state.notifications.forEach((n) => {
    n.isRead = true;
    n.readAt = new Date().toISOString();
  });
  res.json({ success: true, message: 'All notifications marked as read.' });
});

milestone3Router.post('/notifications/dispatch', (req, res) => {
  const { customerId, type, title, message, channel } = req.body;
  const notif = NotificationService.send({
    customerId,
    type: type || 'TRANSACTION_SUCCESS',
    title: title || 'Custom Banking Notice',
    message: message || 'Important update regarding your account activities.',
    channel: channel || 'IN_APP',
  });
  res.json({ success: true, notification: notif });
});
