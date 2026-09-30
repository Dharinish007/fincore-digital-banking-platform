import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CreateCustomerModal } from '../components/modals/CreateCustomerModal';

export const LoginView = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@fincore.bank');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showQuickPresets, setShowQuickPresets] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address or username.');
      return;
    }
    const res = await login(email.trim(), password);
    if (!res.success) {
      setError(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleCustomerLogin = async () => {
    setEmail('customer@fincore.bank');
    setPassword('password123');
    setError('');
    const res = await login('customer@fincore.bank', 'password123');
    if (!res.success) {
      const res2 = await login('rohan.customer', 'password123');
      if (!res2.success) {
        setError(res2.message || 'Customer login failed.');
      }
    }
  };

  const handlePresetSelect = (presetEmail, presetPass = 'password123') => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError('');
    setShowQuickPresets(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap', backgroundColor: 'var(--bg-primary)' }}>
      {/* LEFT SIDE: Brand Showcase */}
      <div style={{
        flex: '1 1 400px',
        background: 'linear-gradient(180deg, #1848cc 0%, #103bb3 50%, #0b2b8a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#1b50dc',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '56px', height: '56px' }}>
              <polygon points="14,38 50,14 86,38" fill="white" />
              <rect x="14" y="40" width="72" height="6" rx="1.5" fill="white" />
              <rect x="23" y="49" width="11" height="27" rx="1.5" fill="white" />
              <rect x="44.5" y="49" width="11" height="27" rx="1.5" fill="white" />
              <rect x="66" y="49" width="11" height="27" rx="1.5" fill="white" />
              <rect x="14" y="79" width="72" height="6" rx="1.5" fill="white" />
              <rect x="10" y="86" width="80" height="5" rx="1.5" fill="white" />
            </svg>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            FinCore Bank
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#bfdbfe', marginTop: '0.5rem', marginBottom: '2rem' }}>
            Secure Digital & Internet Banking
          </p>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#fff' }}>
              Security & Banking Assurance
            </h3>
            <ul style={{ fontSize: '0.8125rem', color: '#e0e7ff', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <li>✓ <strong>Multi-Factor Authentication</strong> & 256-Bit TLS Security</li>
              <li>✓ <strong>Instant 24x7 Clearing</strong> via NEFT, IMPS & UPI</li>
              <li>✓ <strong>Zero-Liability Policy</strong> for Unauthorized Transactions</li>
              <li>✓ <strong>Full Regulatory Compliance</strong> & RBI Approved Custody</li>
              <li>✓ <strong>Paperless Digital KYC</strong> with Biometric Verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div style={{
        flex: '1 1 400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sign In to Banking Portal</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Access Core Banking System, Cashier Desk, or NetBanking
            </p>
          </div>

          {error && (
            <div className="badge badge-danger w-full p-3 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="admin.rajesh@fincore.bank"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4" style={{ fontSize: '0.8125rem' }}>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowQuickPresets(!showQuickPresets)}
                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                Quick Role Credentials ▼
              </button>
            </div>

            {showQuickPresets && (
              <div className="card mb-4" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)' }}>
                <span className="nav-section-title" style={{ padding: '0 0 0.5rem 0' }}>Authorized Role Credentials:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('admin.rajesh@fincore.bank')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    👑 <strong>Admin</strong> (admin.rajesh@fincore.bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('supervisor.sunita@fincore.bank')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    🛡️ <strong>Supervisor</strong> (supervisor.sunita@fincore.bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('teller.priya@fincore.bank')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    💵 <strong>Teller</strong> (teller.priya@fincore.bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('auditor.vikram@fincore.bank')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    📋 <strong>Auditor / Compliance</strong> (auditor.vikram@fincore.bank)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('customer.rohan@gmail.com')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    👤 <strong>Retail Customer</strong> (customer.rohan@gmail.com)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In Securely'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="btn btn-secondary w-full"
            >
              + Open New Customer Account (Self Onboard)
            </button>
          </div>
        </div>
      </div>

      <CreateCustomerModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => setShowRegisterModal(false)}
      />
    </div>
  );
};
