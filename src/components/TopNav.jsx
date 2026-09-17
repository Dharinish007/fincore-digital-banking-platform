import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Landmark, Bell, LogOut, CheckCircle, ShieldAlert, X } from 'lucide-react';

export default function TopNav() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await apiClient.getNotifications();
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.map((p) => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'role-pill bg-purple';
      case 'SUPERVISOR':
        return 'role-pill bg-blue';
      case 'AUDITOR':
        return 'role-pill bg-orange';
      case 'TELLER':
        return 'role-pill bg-green';
      default:
        return 'role-pill';
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-badge">
          <div className="brand-icon-box">
            <Landmark size={20} color="#ffffff" />
          </div>
          <span>FinCore Nexus</span>
        </div>
        <span className="topbar-tagline">
          Secure Digital Banking Platform
        </span>
      </div>

      <div className="topbar-right">
        {user && (
          <span className={getRoleBadgeClass(user.role)}>
            {user.role}
          </span>
        )}

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            className="topbar-action-btn"
            title="Banking Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </button>

          {showNotifs && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>
                  Banking Alerts ({notifications.length})
                </span>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setShowNotifs(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="notification-dropdown-list">
                {notifications.map((n) => (
                  <div key={n.id} className="notification-item">
                    <div className="notification-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {n.type?.includes('ALERT') ? (
                        <ShieldAlert size={14} color="#f59e0b" />
                      ) : (
                        <CheckCircle size={14} color="#10b981" />
                      )}
                      <span>{n.title}</span>
                    </div>
                    <div className="notification-item-msg">{n.message}</div>
                    <div className="notification-item-time" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>To: {n.recipient}</span>
                      <span>{n.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div className="user-profile-menu">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <span className="user-name-text">{user.name}</span>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          className="logout-btn"
          onClick={logout}
          title="Sign out of FinCore Nexus"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
