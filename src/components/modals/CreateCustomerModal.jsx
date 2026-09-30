import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Copy } from 'lucide-react';

export const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('password123');
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [riskLevel, setRiskLevel] = useState('LOW');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdData, setCreatedData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) {
      setError('Please provide all customer profile details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/core/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          riskLevel,
          password: password.trim() || 'password123',
          initialDeposit: Number(initialDeposit) || 10000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedData(data);
        onSuccess();
      } else {
        setError(data.message || 'Failed to create customer');
      }
    } catch (err) {
      setError(err.message || 'Network connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdData?.user) return;
    const text = `FinCore Banking Credentials:\nUsername: ${createdData.user.username}\nPassword: ${createdData.user.password || 'password123'}\nAccount No: ${createdData.account?.accountNumber}\nCustomer ID: ${createdData.customer?.id}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLoginAsNewCustomer = async () => {
    if (!createdData?.user) return;
    await login(createdData.user.username, createdData.user.password || 'password123');
    onClose();
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('+91 ');
    setAddress('');
    setPassword('password123');
    setInitialDeposit(10000);
    setCreatedData(null);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={createdData ? "Customer Onboarding Complete" : "Onboard New Banking Customer"}
      subtitle="Creates customer record, auto-provisions Savings Account, and assigns NetBanking credentials"
      maxWidth="2xl"
    >
      {createdData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', textAlign: 'center', padding: '1.5rem' }}>
            <CheckCircle2 size={40} style={{ color: 'var(--success)', margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--success)' }}>Customer Account Created Successfully!</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Core deposit account and NetBanking profile have been activated.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h5 className="card-title" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>Onboarded Account Summary</h5>
            <div className="grid grid-cols-2 gap-3" style={{ fontSize: '0.8125rem' }}>
              <div>
                <span className="text-muted">Customer Name:</span>
                <p className="font-semibold">{createdData.customer?.fullName}</p>
              </div>
              <div>
                <span className="text-muted">Customer Code:</span>
                <p className="font-mono font-semibold">{createdData.customer?.customerCode}</p>
              </div>
              <div>
                <span className="text-muted">Account Number:</span>
                <p className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>{createdData.account?.accountNumber}</p>
              </div>
              <div>
                <span className="text-muted">Initial Balance:</span>
                <p className="font-mono font-semibold" style={{ color: 'var(--success)' }}>₹{createdData.account?.balance?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted">Username:</span>
                <p className="font-mono font-semibold">{createdData.user?.username}</p>
              </div>
              <div>
                <span className="text-muted">Default Password:</span>
                <p className="font-mono font-semibold">{createdData.user?.password || 'password123'}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="btn btn-secondary"
            >
              <Copy size={14} />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
            </button>
            <button
              type="button"
              onClick={handleLoginAsNewCustomer}
              className="btn btn-success"
            >
              Login as this Customer
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="btn btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Risk Rating Classification</label>
              <select
                className="form-control"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>
          </div>

          <div className="form-group mt-2">
            <label className="form-label">Residential / Business Address *</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Full address details with PIN code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="form-group">
              <label className="form-label">NetBanking Password</label>
              <input
                type="text"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Opening Deposit (₹)</label>
              <input
                type="number"
                className="form-control"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                min="0"
                step="1000"
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
              {loading ? 'Onboarding...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
