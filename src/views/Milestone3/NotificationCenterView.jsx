import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bell, Mail, MessageSquare, Smartphone, Search, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export const NotificationCenterView = () => {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestone3/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    const term = (search || '').toLowerCase();
    const recipient = n.recipient || n.customerId || n.userId || '';
    const subject = n.subject || n.title || '';
    const body = n.body || n.message || '';
    const matchesSearch =
      recipient.toLowerCase().includes(term) ||
      subject.toLowerCase().includes(term) ||
      body.toLowerCase().includes(term);
    const matchesChannel = channelFilter === 'ALL' || n.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bell size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Customer Alerts & Security Notifications
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Event-driven transaction SMS, payment confirmations, and account security notices
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchNotifications} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by recipient, subject, or message content..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Channel:</span>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="ALL">All Communication Channels</option>
              <option value="SMS">SMS Gateway</option>
              <option value="EMAIL">Email Dispatcher</option>
              <option value="PUSH">Push Notifications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Recipient</th>
                <th>Subject / Purpose</th>
                <th>Notification Content</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading notification history...
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No dispatched notifications found.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        {n.channel === 'SMS' ? <Smartphone size={12} /> : <Mail size={12} />}
                        <span>{n.channel}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {n.recipient || n.customerId || n.userId || 'Customer'}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {n.subject || n.title || 'Banking Transaction Alert'}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {n.body || n.message}
                    </td>
                    <td>
                      <span className="badge badge-success">DELIVERED</span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {n.sentAt || n.createdAt ? new Date(n.sentAt || n.createdAt).toLocaleString('en-IN') : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
