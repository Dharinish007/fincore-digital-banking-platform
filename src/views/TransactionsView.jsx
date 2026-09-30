import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SagaDetailsModal } from '../components/modals/SagaDetailsModal';
import { Search, RefreshCw, Zap } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

export const TransactionsView = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedSaga, setSelectedSaga] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await safeFetchJson('/api/transactions');
      if (res.data?.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch {
      // Handled gracefully with fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInspectSaga = async (sagaId) => {
    try {
      const res = await safeFetchJson(`/api/milestone3/sagas/${sagaId}`);
      if (res.data?.success) {
        setSelectedSaga(res.data.saga);
      }
    } catch {
      // Handled gracefully
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (tx.referenceNumber || tx.id || '').toLowerCase().includes(s) ||
      (tx.accountNumber || '').toLowerCase().includes(s) ||
      (tx.description || '').toLowerCase().includes(s);
    const matchesType = typeFilter === 'ALL' || tx.transactionType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="card-title flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
            <Zap size={20} style={{ color: 'var(--accent-primary)' }} />
            Core Ledger & Transaction Journal
          </h2>
          <p className="card-subtitle">
            Double-entry accounting journal with idempotency enforcement and audit tracking (Spring Boot & MySQL).
          </p>
        </div>

        <button onClick={fetchTransactions} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by reference ID, account or description..."
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
              <option value="ALL">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DISBURSEMENT">Disbursement</option>
              <option value="REPAYMENT">Repayment</option>
            </select>

            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Account</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    Loading ledger transactions from MySQL...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No transactions found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {tx.referenceNumber || tx.id}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{tx.transactionType}</span>
                    </td>
                    <td className="font-mono">{tx.accountNumber || 'Core Ledger'}</td>
                    <td>{tx.description}</td>
                    <td className="font-mono font-bold" style={{ color: tx.transactionType === 'DEPOSIT' ? 'var(--success)' : 'var(--text-primary)' }}>
                      ₹{tx.amount?.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(tx.createdAt || tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SagaDetailsModal
        isOpen={!!selectedSaga}
        onClose={() => setSelectedSaga(null)}
        saga={selectedSaga}
      />
    </div>
  );
};
