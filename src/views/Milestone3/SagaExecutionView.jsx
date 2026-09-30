import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SagaDetailsModal } from '../../components/modals/SagaDetailsModal';
import { Zap, RefreshCw, Search, Play, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, Eye } from 'lucide-react';

export const SagaExecutionView = () => {
  const [sagas, setSagas] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedSaga, setSelectedSaga] = useState(null);

  const fetchSagas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestone3/sagas');
      const data = await res.json();
      if (data.success) {
        setSagas(data.sagas || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSagas();
  }, []);

  const handleRetrySaga = async (sagaId) => {
    try {
      const res = await fetch(`/api/milestone3/sagas/${sagaId}/retry`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSaga(data.saga);
        fetchSagas();
      } else {
        console.warn(data.message || 'Retry failed');
      }
    } catch (e) {
      console.error(e.message || 'Network error');
    }
  };

  const filteredSagas = sagas.filter((s) => {
    const term = (search || '').toLowerCase();
    const matchesSearch =
      (s.id || '').toLowerCase().includes(term) ||
      (s.customerName || '').toLowerCase().includes(term) ||
      (s.idempotencyKey || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || s.sagaType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Zap size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Distributed Transaction & Saga Orchestration
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Transactional atomicity, idempotent execution, and automated backward compensation
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchSagas} className="btn btn-secondary btn-sm" title="Refresh">
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
              placeholder="Search by Saga ID, customer, idempotency key..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Transaction Types</option>
              <option value="PAYMENT_TRANSFER">Payment Transfers</option>
              <option value="DISBURSEMENT">Loan Disbursements</option>
              <option value="REPAYMENT">Loan Repayments</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              <option value="COMPLETED">Completed (Success)</option>
              <option value="IN_PROGRESS">Executing</option>
              <option value="COMPENSATED">Compensated (Rolled Back)</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Saga Reference</th>
                <th>Transaction Type</th>
                <th>Associated Entity</th>
                <th>Amount (₹)</th>
                <th>Execution State</th>
                <th>Idempotency Key</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading distributed transaction instances...
                  </td>
                </tr>
              ) : filteredSagas.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No distributed transaction instances found.
                  </td>
                </tr>
              ) : (
                filteredSagas.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {s.id}
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{s.sagaType}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.entityId}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{Number(s.payload?.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {s.idempotencyKey ? s.idempotencyKey.slice(0, 16) + '...' : 'AUTO-GEN'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(s.createdAt).toLocaleTimeString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedSaga(s)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Eye size={14} />
                          <span>Inspect</span>
                        </button>
                        {s.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetrySaga(s.id)}
                            className="btn btn-warning btn-sm"
                          >
                            <RotateCcw size={14} />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <SagaDetailsModal
        isOpen={!!selectedSaga}
        onClose={() => setSelectedSaga(null)}
        saga={selectedSaga}
      />
    </div>
  );
};
