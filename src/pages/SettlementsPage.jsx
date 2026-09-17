import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  GitMerge,
  FileCheck2,
  BellRing,
  Send,
  CheckCircle,
  RefreshCw,
  Check,
  AlertCircle,
  Building,
  Radio,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function SettlementsPage() {
  const { user, isAdmin, isSupervisor, isAuditor, isCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState('settlement'); // 'settlement' | 'sagas' | 'notifications'
  const [settlements, setSettlements] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotifRecipient, setNewNotifRecipient] = useState('Sarah Jenkins');
  const [newNotifChannel, setNewNotifChannel] = useState('SMS');
  const [newNotifTitle, setNewNotifTitle] = useState('Transaction Settlement Notice');
  const [newNotifMessage, setNewNotifMessage] = useState('Your interbank transfer has cleared successfully.');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canConfirmSettlement = isAdmin || isSupervisor;
  const canSendNotif = isAdmin || isSupervisor;

  const loadData = async () => {
    try {
      const [settleRes, sagaRes, notifRes] = await Promise.all([
        apiClient.getSettlements(),
        apiClient.getSagas(),
        apiClient.getNotifications(),
      ]);
      setSettlements(settleRes.data || []);
      setSagas(sagaRes.data || []);
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error('Failed to load Settlements data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmSettlement = async (settlementId) => {
    setIsProcessing(true);
    try {
      await apiClient.confirmSettlement(settlementId);
      setNotificationMsg(`Interbank clearing batch ${settlementId} successfully CONFIRMED and settled with central clearinghouse.`);
      await loadData();
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      alert('Settlement confirmation failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await apiClient.sendNotification({
        recipient: newNotifRecipient,
        channel: newNotifChannel,
        title: newNotifTitle,
        message: newNotifMessage,
      });
      setNotificationMsg(`Banking alert dispatched via ${newNotifChannel} to ${newNotifRecipient}.`);
      setNewNotifTitle('Transaction Settlement Notice');
      setNewNotifMessage('Your transfer has been processed.');
      await loadData();
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      alert('Failed to send notification: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered notifications for customer
  const visibleNotifications = isCustomer
    ? notifications.filter((n) => n.recipient?.toLowerCase().includes('sarah') || n.recipient?.toLowerCase().includes(user?.name.toLowerCase()))
    : notifications;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>Treasury Operations &amp; Interbank Settlements</h1>
          <p>Distributed Saga Orchestration, Clearinghouse Batches, and Multi-Channel Notification Dispatch</p>
        </div>
      </div>

      {notificationMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: 20 }}>
          <CheckCircle size={18} color="#10b981" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {!isCustomer && (
          <>
            <button
              type="button"
              className={`btn ${activeTab === 'settlement' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('settlement')}
            >
              <FileCheck2 size={16} />
              <span>Interbank Settlement Batches ({settlements.length})</span>
            </button>

            <button
              type="button"
              className={`btn ${activeTab === 'sagas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('sagas')}
            >
              <GitMerge size={16} />
              <span>Distributed Transaction Sagas ({sagas.length})</span>
            </button>
          </>
        )}

        <button
          type="button"
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('notifications')}
        >
          <BellRing size={16} />
          <span>Banking Notifications &amp; Alerts ({visibleNotifications.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERBANK SETTLEMENT BATCHES */}
      {activeTab === 'settlement' && !isCustomer && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Clearinghouse Settlement Batches</h2>
              <div className="card-subtitle">
                Central clearing interfaces across RTGS, NEFT, SWIFT, and ACH networks
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Batch Reference</th>
                  <th>Clearing Network</th>
                  <th>Batch Amount ($ USD)</th>
                  <th>Transaction Count</th>
                  <th>Execution Cutoff</th>
                  <th>Settlement Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((batch) => (
                  <tr key={batch.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>{batch.id}</td>
                    <td>
                      <span className="badge badge-purple">{batch.network}</span>
                    </td>
                    <td className="cell-primary" style={{ color: '#10b981' }}>
                      ${(batch.amount || 0).toLocaleString()}
                    </td>
                    <td className="cell-mono">{batch.transactionCount} Trans</td>
                    <td className="cell-sub">{batch.cutoffTime}</td>
                    <td>
                      {batch.status === 'CONFIRMED' && (
                        <span className="badge badge-success">CLEARED</span>
                      )}
                      {batch.status === 'PENDING' && (
                        <span className="badge badge-warning">AWAITING CLEARANCE</span>
                      )}
                      {batch.status === 'PROCESSING' && (
                        <span className="badge badge-blue">IN PROCESSING</span>
                      )}
                    </td>
                    <td>
                      {batch.status === 'PENDING' && canConfirmSettlement ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={isProcessing}
                          onClick={() => handleConfirmSettlement(batch.id)}
                        >
                          <Check size={14} />
                          <span>Confirm &amp; Clear Batch</span>
                        </button>
                      ) : (
                        <span className="cell-sub">
                          {batch.status === 'CONFIRMED' ? 'Settled with Central Bank' : 'Processing'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISTRIBUTED TRANSACTION SAGAS */}
      {activeTab === 'sagas' && !isCustomer && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Distributed Transaction Saga Engine</h2>
              <div className="card-subtitle">
                Two-phase commit coordination with automatic compensation and rollback tracking
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {sagas.map((saga) => (
              <div
                key={saga.id}
                style={{
                  background: '#0b1329',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 20
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span className="cell-mono" style={{ color: '#60a5fa', fontWeight: 700 }}>{saga.id}</span>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem', marginTop: 2 }}>
                      {saga.customerName}
                    </div>
                  </div>
                  <span className={`badge ${saga.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                    {saga.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: 14 }}>
                  <span>Facility Allocation: </span>
                  <strong style={{ color: '#10b981' }}>${(saga.amount || 0).toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(saga.steps || []).map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: '#111e3b',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>#{idx + 1}</span>
                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{step.name}</span>
                      </div>
                      <span className={`badge ${step.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS DISPATCH */}
      {activeTab === 'notifications' && (
        <div>
          {canSendNotif && (
            <div className="banking-card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div>
                  <h2>Dispatch Customer Banking Alert</h2>
                  <div className="card-subtitle">
                    Multi-channel delivery: SMS, Email, and Mobile Push Notifications
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendNotification}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Recipient Account</label>
                    <select
                      className="select-control"
                      value={newNotifRecipient}
                      onChange={(e) => setNewNotifRecipient(e.target.value)}
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins (Mortgage Client)</option>
                      <option value="Vikram Patel">Vikram Patel (Working Capital)</option>
                      <option value="Robert Vance">Robert Vance (Commercial Facility)</option>
                      <option value="Helena Thorne">Helena Thorne (Asset Backed)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Channel</label>
                    <select
                      className="select-control"
                      value={newNotifChannel}
                      onChange={(e) => setNewNotifChannel(e.target.value)}
                    >
                      <option value="SMS">SMS Cellular Gateway</option>
                      <option value="EMAIL">Encrypted Email Alert</option>
                      <option value="IN_APP">In-App Push Notification</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Alert Subject / Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newNotifTitle}
                      onChange={(e) => setNewNotifTitle(e.target.value)}
                      placeholder="Enter alert title"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Message Payload</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newNotifMessage}
                      onChange={(e) => setNewNotifMessage(e.target.value)}
                      placeholder="Enter customer message payload..."
                      required
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                    <Send size={15} />
                    <span>{isProcessing ? 'Dispatching...' : 'Dispatch Alert Notice'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="banking-card">
            <div className="card-header">
              <div>
                <h2>{isCustomer ? 'My Banking Notifications' : 'Recent Dispatched Banking Alerts'}</h2>
                <div className="card-subtitle">
                  Real-time delivery verification across notification channels
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Recipient</th>
                    <th>Channel</th>
                    <th>Subject</th>
                    <th>Message Details</th>
                    <th>Delivery Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleNotifications.map((notif) => (
                    <tr key={notif.id}>
                      <td className="cell-sub" style={{ fontSize: '0.78rem' }}>{notif.timestamp}</td>
                      <td className="cell-primary">{notif.recipient}</td>
                      <td>
                        <span className="badge badge-purple">{notif.channel}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{notif.title}</td>
                      <td style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{notif.message}</td>
                      <td>
                        <span className="badge badge-success">DELIVERED</span>
                      </td>
                    </tr>
                  ))}
                  {visibleNotifications.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        No notifications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
