import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Shield
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both User ID and Password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      setSuccessMsg(`Authentication verified for ${loggedUser.role} · ${loggedUser.name}. Redirecting to dashboard...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (roleUser, rolePwd) => {
    setUsername(roleUser);
    setPassword(rolePwd);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ marginBottom: 16 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#94a3b8',
              fontSize: '0.84rem',
              transition: 'color 0.2s'
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Portal</span>
          </Link>
        </div>

        <div className="login-header">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: 14,
              background: '#1d4ed8',
              margin: '0 auto',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Landmark size={28} color="#ffffff" />
          </div>
          <h2>FinCore Nexus</h2>
          <p>Institutional Core Banking Authentication</p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: 18
            }}
          >
            <AlertCircle size={16} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#6ee7b7',
              fontSize: '0.85rem',
              marginBottom: 18
            }}
          >
            <ShieldCheck size={16} color="#10b981" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Bank User ID / Username
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                id="username"
                type="text"
                className="form-control"
                style={{ paddingLeft: 38 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter User ID"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: 38, paddingRight: 38 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: 8 }}
            disabled={loading}
          >
            <Lock size={16} />
            <span>{loading ? 'Authenticating...' : 'Login Securely'}</span>
          </button>
        </form>

        {/* Role Account Quick Switcher */}
        <div className="quick-roles-panel">
          <div className="quick-roles-title">Select Banking Role Account</div>
          <div className="quick-roles-grid">
            <button
              type="button"
              className={`quick-role-btn ${username === 'admin' ? 'active' : ''}`}
              style={{
                borderColor: username === 'admin' ? 'var(--primary-blue)' : 'var(--border-subtle)',
                background: username === 'admin' ? '#16274e' : '#111e3b'
              }}
              onClick={() => handleQuickRole('admin', 'Admin@123')}
            >
              ADMIN
            </button>
            <button
              type="button"
              className={`quick-role-btn ${username === 'supervisor' ? 'active' : ''}`}
              style={{
                borderColor: username === 'supervisor' ? 'var(--primary-blue)' : 'var(--border-subtle)',
                background: username === 'supervisor' ? '#16274e' : '#111e3b'
              }}
              onClick={() => handleQuickRole('supervisor', 'Super@123')}
            >
              SUPERVISOR
            </button>
            <button
              type="button"
              className={`quick-role-btn ${username === 'teller' ? 'active' : ''}`}
              style={{
                borderColor: username === 'teller' ? 'var(--primary-blue)' : 'var(--border-subtle)',
                background: username === 'teller' ? '#16274e' : '#111e3b'
              }}
              onClick={() => handleQuickRole('teller', 'Teller@123')}
            >
              TELLER
            </button>
            <button
              type="button"
              className={`quick-role-btn ${username === 'auditor' ? 'active' : ''}`}
              style={{
                borderColor: username === 'auditor' ? 'var(--primary-blue)' : 'var(--border-subtle)',
                background: username === 'auditor' ? '#16274e' : '#111e3b'
              }}
              onClick={() => handleQuickRole('auditor', 'Audit@123')}
            >
              AUDITOR
            </button>
            <button
              type="button"
              className={`quick-role-btn ${username === 'customer' ? 'active' : ''}`}
              style={{
                gridColumn: 'span 2',
                borderColor: username === 'customer' ? 'var(--primary-blue)' : 'var(--border-subtle)',
                background: username === 'customer' ? '#16274e' : '#111e3b'
              }}
              onClick={() => handleQuickRole('customer', 'Cust@123')}
            >
              DEMO CUSTOMER (Sarah Jenkins · CUST-1001)
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: '0.74rem', color: '#94a3b8', textAlign: 'center', background: 'rgba(30, 58, 138, 0.25)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            💡 <strong>New Onboarded Customer?</strong> Log in using your <strong>Customer ID</strong> (e.g., <code style={{ color: '#93c5fd' }}>CUST-1006</code>), <strong>Email</strong>, or <strong>Account #</strong> with password <code style={{ color: '#93c5fd' }}>Cust@123</code>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.76rem', color: '#64748b' }}>
          Protected by 256-Bit TLS Encryption &amp; Role Segregation
        </div>
      </div>
    </div>
  );
}
