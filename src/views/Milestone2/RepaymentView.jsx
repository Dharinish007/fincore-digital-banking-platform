import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PayEmiModal } from '../../components/modals/PayEmiModal';
import { CalendarCheck, Search, RefreshCw, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const RepaymentView = () => {
  const [schedules, setSchedules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedPaySchedule, setSelectedPaySchedule] = useState(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [schedRes, accRes] = await Promise.all([
        fetch('/api/milestone2/repayments/schedules'),
        fetch('/api/accounts'),
      ]);
      const schedData = await schedRes.json();
      const accData = await accRes.json();
      if (schedData.success) setSchedules(schedData.schedules || []);
      if (accData.success) setAccounts(accData.accounts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    const term = (search || '').toLowerCase();
    const matchesSearch =
      (s.loanNumber || s.loanId || '').toLowerCase().includes(term) ||
      (s.customerName || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <CalendarCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Loan Repayment Schedules & EMI Collections
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Monthly installments, principal amortization, automated interest split, and repayment tracking
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchSchedules} className="btn btn-secondary btn-sm" title="Refresh">
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
              placeholder="Search by loan reference or customer name..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
            <select
              className="form-control"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All EMI Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="OVERDUE">Overdue (Accruing DPD)</option>
              <option value="PAID">Paid / Settled</option>
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
                <th>Inst #</th>
                <th>Loan Reference</th>
                <th>Customer Name</th>
                <th>Due Date</th>
                <th>Total EMI Amount</th>
                <th>Principal / Interest</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Payment Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading repayment schedules...
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No repayment schedules found.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>#{s.installmentNumber}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {s.loanNumber || s.loanId}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.customerName || 'Retail Borrower'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {s.dueDate}
                      {s.dpd > 0 && <span className="badge badge-danger" style={{ marginLeft: '0.5rem', fontSize: '0.625rem' }}>{s.dpd} DPD</span>}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{Number(s.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ₹{Number(s.principalComponent).toLocaleString('en-IN')} / ₹{Number(s.interestComponent).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {s.status !== 'PAID' ? (
                        <button
                          onClick={() => setSelectedPaySchedule(s)}
                          className="btn btn-primary btn-sm"
                          style={{ marginLeft: 'auto' }}
                        >
                          <CreditCard size={14} />
                          <span>Pay EMI</span>
                        </button>
                      ) : (
                        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                          <CheckCircle2 size={12} />
                          <span>Paid</span>
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

      {/* Pay EMI Modal */}
      <PayEmiModal
        isOpen={!!selectedPaySchedule}
        onClose={() => setSelectedPaySchedule(null)}
        schedule={selectedPaySchedule}
        accounts={accounts}
        onSuccess={fetchSchedules}
      />
    </div>
  );
};
