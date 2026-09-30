import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Key,
  Bell,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

export const SettingsView = () => {
  const { user, logout } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: 'idle' });

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setPasswordStatus({ type: 'loading' });
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: 'Network connection error.' });
    }
  };

  const handleSavePreferences = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
      {/* Top Header */}
      <div>
        <h2 className="card-title flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
          <User size={20} style={{ color: 'var(--accent-primary)' }} />
          Account Profile & System Settings
        </h2>
        <p className="card-subtitle">
          Manage your authenticated identity, credentials, and notification thresholds.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="card">
        <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>User Profile Overview</h3>
        <div className="grid grid-cols-2 gap-4" style={{ fontSize: '0.875rem' }}>
          <div>
            <span className="text-muted">Display Name:</span>
            <p className="font-semibold">{user?.name || user?.fullName}</p>
          </div>
          <div>
            <span className="text-muted">Username / Login ID:</span>
            <p className="font-mono font-semibold">{user?.username}</p>
          </div>
          <div>
            <span className="text-muted">Email Address:</span>
            <p>{user?.email}</p>
          </div>
          <div>
            <span className="text-muted">Assigned Security Role:</span>
            <p><span className="badge badge-info">{user?.role}</span></p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2" style={{ fontSize: '1rem' }}>
            <Key size={16} style={{ color: 'var(--accent-primary)' }} />
            Change Password
          </h3>
        </div>

        {passwordStatus.type === 'error' && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={14} />
            <span>{passwordStatus.message}</span>
          </div>
        )}
        {passwordStatus.type === 'success' && (
          <div className="badge badge-success w-full p-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={14} />
            <span>{passwordStatus.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Current Password *</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="form-group">
              <label className="form-label">New Password *</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={passwordStatus.type === 'loading'}
              className="btn btn-primary"
            >
              {passwordStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="card">
        <h3 className="card-title flex items-center gap-2" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
          <Bell size={16} style={{ color: 'var(--accent-primary)' }} />
          Notification & Alert Preferences
        </h3>

        {savedSettings && (
          <div className="badge badge-success w-full p-2 mb-4" style={{ display: 'block' }}>
            Preferences saved successfully!
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <span>Receive transaction email receipts & monthly e-statements</span>
          </label>

          <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
            />
            <span>Receive high-value withdrawal & debit SMS OTP alerts</span>
          </label>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="btn btn-secondary"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
