import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const ApplyLoanModal = ({
  isOpen,
  onClose,
  customers = [],
  accounts = [],
  onSuccess,
}) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [accountId, setAccountId] = useState('');
  const [loanType, setLoanType] = useState('PERSONAL_LOAN');
  const [principalAmount, setPrincipalAmount] = useState('200000');
  const [interestRate, setInterestRate] = useState('10.5');
  const [tenureMonths, setTenureMonths] = useState('12');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const customerAccounts = accounts.filter((a) => a.customerId === customerId);

  const p = parseFloat(principalAmount) || 0;
  const r = (parseFloat(interestRate) || 0) / 12 / 100;
  const n = parseInt(tenureMonths) || 12;
  const calculatedEmi =
    r > 0 && n > 0 && p > 0
      ? Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
      : Math.round(p / n);
  const totalPayable = calculatedEmi * n;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || !accountId || p <= 0) {
      setError('Please select customer, disbursement account, and valid loan amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          accountId,
          loanType,
          principalAmount: p,
          interestRate: parseFloat(interestRate),
          tenureMonths: n,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to submit loan application');
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
      title="Originate Credit Facility / Loan Application"
      subtitle="Sanctioning engine with automated EMI amortization calculation (Java & Spring Boot)"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Select Borrower Customer *</label>
            <select
              className="form-control"
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setAccountId('');
              }}
              required
            >
              <option value="">-- Choose Borrower --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.customerCode || c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Disbursement Credit Account *</label>
            <select
              className="form-control"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              <option value="">-- Select Target Account --</option>
              {customerAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountNumber} ({a.accountType} - ₹{a.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="form-group">
            <label className="form-label">Loan Facility Type</label>
            <select
              className="form-control"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              <option value="PERSONAL_LOAN">Personal Loan (Retail)</option>
              <option value="HOME_LOAN">Home Mortgage Loan</option>
              <option value="BUSINESS_LOAN">Commercial / MSME Loan</option>
              <option value="AUTO_LOAN">Auto Vehicle Loan</option>
              <option value="EDUCATION_LOAN">Higher Education Loan</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Principal Sanction Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(e.target.value)}
              min="10000"
              max="50000000"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="form-group">
            <label className="form-label">Annual Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              min="1"
              max="36"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Repayment Tenure (Months)</label>
            <input
              type="number"
              className="form-control"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              min="3"
              max="360"
              required
            />
          </div>
        </div>

        {/* EMI Summary Card */}
        <div className="card mt-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-light)' }}>
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Calculated Monthly EMI</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ₹{calculatedEmi.toLocaleString()} / mo
            </span>
          </div>
          <div className="flex justify-between items-center" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Total Repayment (Principal + Interest):</span>
            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>₹{totalPayable.toLocaleString()}</span>
          </div>
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
            {loading ? 'Sanctioning...' : 'Sanction Loan Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
