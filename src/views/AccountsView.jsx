import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { OpenAccountModal } from '../components/modals/OpenAccountModal';
import { safeFetchJson } from '../utils/api';
import {
  CreditCard,
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  RefreshCw,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AccountsView = () => {
  const { user } = useAuth();
  const role = user?.role || 'ADMIN';
  const isSupervisorOrAdmin = role === 'ADMIN' || role === 'SUPERVISOR';

  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);

  // Cashier action state (Deposit/Withdrawal)
  const [actionAccount, setActionAccount] = useState(null);
  const [actionType, setActionType] = useState('DEPOSIT');
  const [actionAmount, setActionAmount] = useState('10000');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Transfer action state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSourceId, setTransferSourceId] = useState('');
  const [transferDestId, setTransferDestId] = useState('');
  const [transferAmount, setTransferAmount] = useState('5000');
  const [transferDesc, setTransferDesc] = useState('Inter-account fund transfer');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const [accRes, custRes] = await Promise.all([
        safeFetchJson('/api/accounts'),
        safeFetchJson('/api/customers'),
      ]);
      const accData = accRes.data || {};
      const custData = custRes.data || {};
      if (accData.success) setAccounts(accData.accounts || []);
      if (custData.success) setCustomers(custData.customers || []);
    } catch {
      // Handled gracefully with fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCashierAction = async (e) => {
    e.preventDefault();
    if (!actionAccount || Number(actionAmount) <= 0) return;
    setActionLoading(true);
    setActionError('');
    try {
      const endpoint = actionType === 'DEPOSIT' ? '/api/cashier/deposit' : '/api/cashier/withdraw';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: actionAccount.id,
          amount: Number(actionAmount),
          description: `${actionType} transaction via Cashier Terminal`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionAccount(null);
        fetchAccounts();
      } else {
        setActionError(data.message || 'Transaction failed');
      }
    } catch (err) {
      setActionError(err.message || 'Network connection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferSourceId || !transferDestId || Number(transferAmount) <= 0) {
      setTransferError('Please select valid source, target accounts and amount');
      return;
    }
    setTransferLoading(true);
    setTransferError('');
    setTransferSuccess('');
    try {
      const res = await fetch('/api/transfers/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceAccountId: transferSourceId,
          targetAccountId: transferDestId,
          amount: Number(transferAmount),
          description: transferDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTransferSuccess('Transfer executed successfully with ACID journal guarantee.');
        setTimeout(() => {
          setShowTransferModal(false);
          setTransferSuccess('');
          fetchAccounts();
        }, 1500);
      } else {
        setTransferError(data.message || 'Transfer failed');
      }
    } catch (err) {
      setTransferError(err.message || 'Network connection failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (a.accountNumber || '').toLowerCase().includes(s) ||
      (a.customerName || '').toLowerCase().includes(s);
    const matchesType = typeFilter === 'ALL' || a.accountType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="card-title flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
            <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
            Core Deposit & Operating Accounts
          </h2>
          <p className="card-subtitle">
            Manage deposit balances, process cashier cash ops, or execute internal ACID transfers (Java & Spring Boot).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchAccounts} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={() => setShowTransferModal(true)} className="btn btn-secondary btn-sm">
            <ArrowRightLeft size={14} />
            <span>Transfer Funds</span>
          </button>
          <button onClick={() => setShowOpenModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Open Account</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by account number or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div className="flex items-center gap-3">
            <select
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Account Types</option>
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
              <option value="ESCROW">Escrow Pool</option>
            </select>

            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="FROZEN">Frozen</option>
              <option value="DORMANT">Dormant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Holder</th>
                <th>Category</th>
                <th>Current Balance</th>
                <th>Status</th>
                <th>Currency</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    Loading accounts database from MySQL...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No accounts found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {acc.accountNumber}
                    </td>
                    <td>
                      <p className="font-semibold">{acc.customerName || 'Core Bank Pool'}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {acc.customerId}</p>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{acc.accountType}</span>
                    </td>
                    <td className="font-mono font-bold" style={{ fontSize: '0.9375rem', color: 'var(--success)' }}>
                      ₹{acc.balance?.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={acc.status} size="sm" />
                    </td>
                    <td className="font-mono text-muted">{acc.currency || 'INR'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActionAccount(acc);
                            setActionType('DEPOSIT');
                            setActionAmount('10000');
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Cash Deposit"
                        >
                          <ArrowDownLeft size={13} style={{ color: 'var(--success)' }} />
                          <span>Deposit</span>
                        </button>
                        <button
                          onClick={() => {
                            setActionAccount(acc);
                            setActionType('WITHDRAWAL');
                            setActionAmount('5000');
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Cash Withdrawal"
                        >
                          <ArrowUpRight size={13} style={{ color: 'var(--warning)' }} />
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cashier Action Modal */}
      {actionAccount && (
        <div className="modal-overlay" onClick={() => setActionAccount(null)}>
          <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Teller Cash {actionType}</h3>
                <p className="modal-subtitle">Account: {actionAccount.accountNumber} ({actionAccount.customerName})</p>
              </div>
              <button onClick={() => setActionAccount(null)} className="modal-close-btn">&times;</button>
            </div>

            <form onSubmit={handleCashierAction}>
              {actionError && (
                <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
                  {actionError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Transaction Amount (₹) *</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setActionAccount(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary">
                  {actionLoading ? 'Processing...' : `Confirm ₹${Number(actionAmount || 0).toLocaleString()} ${actionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Internal Fund Transfer (ACID)</h3>
                <p className="modal-subtitle">Direct balance debit and credit across accounts with optimistic lock checking</p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="modal-close-btn">&times;</button>
            </div>

            <form onSubmit={handleTransfer}>
              {transferError && (
                <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
                  {transferError}
                </div>
              )}
              {transferSuccess && (
                <div className="badge badge-success w-full p-2 mb-4" style={{ display: 'block' }}>
                  {transferSuccess}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Source Account (Debit) *</label>
                <select
                  className="form-control"
                  value={transferSourceId}
                  onChange={(e) => setTransferSourceId(e.target.value)}
                  required
                >
                  <option value="">-- Select Source Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountNumber} ({a.customerName} - ₹{a.balance?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Account (Credit) *</label>
                <select
                  className="form-control"
                  value={transferDestId}
                  onChange={(e) => setTransferDestId(e.target.value)}
                  required
                >
                  <option value="">-- Select Beneficiary Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id} disabled={a.id === transferSourceId}>
                      {a.accountNumber} ({a.customerName} - ₹{a.balance?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Amount (₹) *</label>
                <input
                  type="number"
                  className="form-control font-mono"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={transferLoading} className="btn btn-primary">
                  {transferLoading ? 'Transferring...' : 'Execute Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OpenAccountModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        customers={customers}
        onSuccess={fetchAccounts}
      />
    </div>
  );
};
