import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { GitMerge } from 'lucide-react';

export const ExecuteDisbursementModal = ({
  isOpen,
  onClose,
  loan,
  onSuccess,
}) => {
  if (!loan) return null;

  const [simulateFailure, setSimulateFailure] = useState(false);
  const [failStep, setFailStep] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDisburse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/milestone2/disbursements/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanId: loan.id,
          simulateFailureAtStep: simulateFailure ? failStep : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.saga);
        onClose();
      } else {
        setError(data.message || 'Disbursement execution encountered an error');
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
      title="Execute 6-Step Loan Disbursement Saga"
      subtitle={`Milestone 2 & 3: Distributed orchestration for ${loan.loanNumber}`}
      maxWidth="lg"
    >
      <form onSubmit={handleDisburse}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="card mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '0.8125rem' }}>
            <div>
              <span className="text-muted">Loan Number:</span>
              <p className="font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>{loan.loanNumber}</p>
            </div>
            <div>
              <span className="text-muted">Borrower:</span>
              <p className="font-semibold">{loan.customerName}</p>
            </div>
            <div>
              <span className="text-muted">Sanction Amount:</span>
              <p className="font-mono font-bold" style={{ color: 'var(--success)' }}>₹{loan.principalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted">Interest / Tenure:</span>
              <p>{loan.interestRate}% p.a. / {loan.tenureMonths} Months</p>
            </div>
          </div>
        </div>

        <div className="card mb-4" style={{ border: '1px solid var(--border-light)' }}>
          <h5 className="font-semibold mb-2" style={{ fontSize: '0.8125rem' }}>Saga Compensation Test Harness</h5>
          <label className="flex items-center gap-2" style={{ fontSize: '0.8125rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
            />
            <span style={{ color: simulateFailure ? 'var(--warning)' : 'var(--text-secondary)' }}>
              Enable automated fault-injection to test ACID rollback & compensation
            </span>
          </label>

          {simulateFailure && (
            <div className="mt-3">
              <label className="form-label">Trigger failure at Step:</label>
              <select
                className="form-control"
                value={failStep}
                onChange={(e) => setFailStep(Number(e.target.value))}
              >
                <option value="3">Step 3: Debit Bank Escrow Pool</option>
                <option value="4">Step 4: Credit Customer Checking Account (Fault Injection)</option>
                <option value="5">Step 5: Generate Repayment Amortization Schedule</option>
              </select>
            </div>
          )}
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
            <GitMerge size={16} />
            <span>{loading ? 'Orchestrating Saga...' : 'Trigger Disbursement Saga'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
