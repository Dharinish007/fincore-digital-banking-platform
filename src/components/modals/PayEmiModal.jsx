import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CreditCard } from 'lucide-react';

export const PayEmiModal = ({
  isOpen,
  onClose,
  schedule,
  accounts = [],
  onSuccess,
}) => {
  if (!schedule) return null;

  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/milestone2/repayments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: schedule.id,
          accountId,
          simulateFailure,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Payment execution failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pay Loan Installment (EMI #${schedule.installmentNumber})`}
      subtitle={`Double-entry repayment ledger with automatic principal & interest split`}
      maxWidth="md"
    >
      <form onSubmit={handlePay}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="card mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex justify-between items-center mb-3">
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total Installment Due</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ₹{schedule.totalInstallment?.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>Principal Component: <strong className="text-primary font-mono">₹{schedule.principalComponent?.toLocaleString()}</strong></div>
            <div>Interest Component: <strong className="text-primary font-mono">₹{schedule.interestComponent?.toLocaleString()}</strong></div>
            <div>Due Date: <strong className="text-primary">{new Date(schedule.dueDate).toLocaleDateString()}</strong></div>
            <div>Remaining Principal: <strong className="text-primary font-mono">₹{schedule.remainingPrincipal?.toLocaleString()}</strong></div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Debit Funding Account *</label>
          <select
            className="form-control"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            <option value="">-- Choose Account --</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountNumber} ({a.accountType} - Bal: ₹{a.balance?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label className="flex items-center gap-2" style={{ fontSize: '0.8125rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
            />
            <span className="text-muted">Simulate insufficient balance error</span>
          </label>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            <CreditCard size={16} />
            <span>{loading ? 'Processing...' : `Debit ₹${schedule.totalInstallment?.toLocaleString()}`}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
