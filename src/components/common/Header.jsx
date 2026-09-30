import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  ChevronDown,
} from 'lucide-react';
import { safeFetchJson } from '../../utils/api';

export const Header = ({ onSelectView, activeView }) => {
  const { user, switchRole, logout, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await safeFetchJson('/api/milestone3/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch {
      // Handled gracefully with fallback data
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const roleLabels = {
    ADMIN: { label: 'Admin', bg: '#581c87', text: '#e9d5ff' },
    SUPERVISOR: { label: 'Supervisor', bg: '#1e3a8a', text: '#bfdbfe' },
    TELLER: { label: 'Teller', bg: '#064e3b', text: '#a7f3d0' },
    CUSTOMER: { label: 'Customer', bg: '#78350f', text: '#fde68a' },
    AUDITOR: { label: 'Auditor', bg: '#0f766e', text: '#ccfbf1' },
  };

  const currentRoleStyle = user && roleLabels[user.role] ? roleLabels[user.role] : { bg: '#1e293b', text: '#cbd5e1' };

  return (
    <header className="top-header">
      {/* Left side title / status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          <span className="badge badge-success">
            Live Banking Engine
          </span>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          FinCore National Digital & Retail Banking Portal
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: currentRoleStyle.bg, color: currentRoleStyle.text }}
          >
            <Shield size={14} />
            <span>Role: {user?.role}</span>
            <ChevronDown size={12} />
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              width: '210px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '0.5rem',
              zIndex: 50
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 'bold', color: 'var(--text-muted)', padding: '0.5rem', textTransform: 'uppercase' }}>
                Switch Role Profile
              </div>
              {['ADMIN', 'SUPERVISOR', 'TELLER', 'CUSTOMER', 'AUDITOR'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    color: user?.role === r ? 'var(--accent-primary)' : 'var(--text-primary)',
                    backgroundColor: user?.role === r ? 'var(--accent-primary-light)' : 'transparent',
                    display: 'block'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar and Logout */}
        <div className="flex items-center gap-2" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8125rem',
            color: '#fff'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
