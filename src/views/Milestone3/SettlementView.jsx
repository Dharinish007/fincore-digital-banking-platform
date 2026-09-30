import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Building2, RefreshCw, Search, ArrowUpRight, CheckCircle2, RotateCcw, AlertTriangle, Play } from 'lucide-react';

export const SettlementView = () => {
  const [settlements, setSettlements] = useState([]);
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/milestone3/settlements');
      const data = await res.json();
      if (data.success) {
        setSettlements(data.settlements || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleProcessSettlement = async (id) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/milestone3/settlements/${id}/process`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchSettlements();
      } else {
        console.warn(data.message || 'Settlement execution failed');
      }
    } catch (e) {
      console.error(e.message || 'Network error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSettlements = settlements.filter((s) => {
    const term = (search || '').toLowerCase();
    const batch = s.batchNumber || s.settlementReference || '';
    const clearing = s.clearingHouse || '';
    const network = s.networkType || s.settlementType || '';
    const matchesSearch =
      batch.toLowerCase().includes(term) ||
      (s.id || '').toLowerCase().includes(term) ||
      clearing.toLowerCase().includes(term);
    const matchesNetwork = networkFilter === 'ALL' || network === networkFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesNetwork && matchesStatus;
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
                <Building2 size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Interbank Clearing & Settlement Gateway
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Batch reconciliation for NEFT, RTGS, IMPS & UPI networks with automated multilateral netting
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchSettlements} className="btn btn-secondary btn-sm" title="Refresh">
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
              placeholder="Search by batch, settlement ID, or clearing house..."
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
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
            >
              <option value="ALL">All Payment Rails</option>
              <option value="NEFT">NEFT (National Clearing)</option>
              <option value="RTGS">RTGS (High Value Real-Time)</option>
              <option value="IMPS">IMPS (Immediate Payment)</option>
              <option value="UPI">UPI (Unified Payments)</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Settlement Statuses</option>
              <option value="SETTLED">Settled</option>
              <option value="PENDING">Pending Clearing Cycle</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed Reconcile</option>
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
                <th>Batch Number</th>
                <th>Payment Rail</th>
                <th>Clearing Entity</th>
                <th>Total Batch Value</th>
                <th>Item Count</th>
                <th>Cycle Status</th>
                <th>Settlement Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading clearing batches...
                  </td>
                </tr>
              ) : filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No settlement records found.
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {s.batchNumber || s.settlementReference || s.id}
                    </td>
                    <td>
                      <span className="badge badge-info">{s.networkType || s.settlementType || 'NEFT'}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.clearingHouse || 'Reserve Bank Clearing Center'}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{Number(s.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td>{s.itemCount || 1} Txns</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {s.settlementDate || s.createdAt ? new Date(s.settlementDate || s.createdAt).toLocaleString('en-IN') : 'Recent Cycle'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {s.status === 'PENDING' ? (
                        <button
                          onClick={() => handleProcessSettlement(s.id)}
                          disabled={processingId === s.id}
                          className="btn btn-primary btn-sm"
                          style={{ marginLeft: 'auto' }}
                        >
                          <Play size={14} />
                          <span>{processingId === s.id ? 'Clearing...' : 'Execute Clearing'}</span>
                        </button>
                      ) : (
                        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                          <CheckCircle2 size={12} />
                          <span>Reconciled</span>
                        </span>
                      )}
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
