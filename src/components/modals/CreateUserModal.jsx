import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const CreateUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('TELLER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !fullName || !email) {
      setError('Please provide all user credentials');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/milestone1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          fullName,
          email,
          password,
          role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to create user');
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
      title="Provision Banking User & Assign Role"
      subtitle="Creates authenticated staff, compliance, or customer user account"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Staff / Official Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">System Username *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. teller.priya"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">System Role *</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="TELLER">Teller / Cashier</option>
              <option value="SUPERVISOR">Supervisor / Manager</option>
              <option value="AUDITOR">Auditor / Compliance Officer</option>
              <option value="ADMIN">System Administrator</option>
              <option value="CUSTOMER">Retail Customer</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Official Email Address *</label>
          <input
            type="email"
            className="form-control"
            placeholder="official@fincore.bank"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
            {loading ? 'Creating...' : 'Provision User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
