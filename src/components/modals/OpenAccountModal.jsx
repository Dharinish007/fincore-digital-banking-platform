import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const OpenAccountModal = ({
  isOpen,
  onClose,
  customers = [],
  onSuccess,
}) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('25000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setError('Please select a customer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          accountType,
          initialDeposit: parseFloat(initialDeposit) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to open account');
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
      title="Open New Deposit / Operating Account"
      subtitle="Provisions a unique 12-digit core banking account number (Spring Data JPA)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Select Customer Holder *</label>
          <select
            className="form-control"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.customerCode || c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Account Category</label>
            <select
              className="form-control"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="SAVINGS">Savings Account (4.0% p.a.)</option>
              <option value="CURRENT">Current Account (Commercial)</option>
              <option value="ESCROW">Escrow Reserve</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Opening Deposit (₹)</label>
            <input
              type="number"
              className="form-control"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              min="0"
              required
            />
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
            {loading ? 'Opening...' : 'Open Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
