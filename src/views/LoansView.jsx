import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ApplyLoanModal } from '../components/modals/ApplyLoanModal';
import { ExecuteDisbursementModal } from '../components/modals/ExecuteDisbursementModal';
import { SagaDetailsModal } from '../components/modals/SagaDetailsModal';
import { Banknote, Plus, Search, CheckCircle2, GitMerge, RefreshCw } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

export const LoansView = ({ onSelectView }) => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedDisburseLoan, setSelectedDisburseLoan] = useState(null);
  const [completedSaga, setCompletedSaga] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const [loanRes, custRes, accRes] = await Promise.all([
        safeFetchJson('/api/loans'),
        safeFetchJson('/api/customers'),
        safeFetchJson('/api/accounts'),
      ]);
      const loanData = loanRes.data || {};
      const custData = custRes.data || {};
      const accData = accRes.data || {};
      if (loanData.success) setLoans(loanData.loans || []);
      if (custData.success) setCustomers(custData.customers || []);
      if (accData.success) setAccounts(accData.accounts || []);
    } catch {
      // Handled gracefully with fallback data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApproveLoan = async (loanId) => {
    setApprovingId(loanId);
    try {
      const res = await fetch(`/api/loans/${loanId}/approve`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchLoans();
      } else {
        console.warn(data.message || 'Approval failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApprovingId(null);
    }
  };

  const filteredLoans = loans.filter((l) => {
    const s = (search || '').toLowerCase();
    const matchesSearch =
      (l.loanNumber || '').toLowerCase().includes(s) ||
      (l.customerName || '').toLowerCase().includes(s) ||
      (l.loanType || '').toLowerCase().includes(s);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="card-title flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
            <Banknote size={20} style={{ color: 'var(--accent-primary)' }} />
            Credit Facilities & Loan Origination
          </h2>
          <p className="card-subtitle">
            Sanction credit facilities, execute automated loan amortization, and trigger multi-step disbursement sagas (Java & Spring Boot).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchLoans} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={() => setShowApplyModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Sanction New Loan</span>
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
              placeholder="Search by loan number or borrower name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Loan Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="APPROVED">Approved (Pending Disburse)</option>
              <option value="ACTIVE">Active (Disbursed)</option>
              <option value="CLOSED">Closed / Paid Off</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan Number</th>
                <th>Borrower</th>
                <th>Facility Type</th>
                <th>Sanction Amount</th>
                <th>Interest / Tenure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    Loading loan facilities from MySQL...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No loan applications found.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((l) => (
                  <tr key={l.id}>
                    <td className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {l.loanNumber}
                    </td>
                    <td>
                      <p className="font-semibold">{l.customerName}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Acct: {l.accountNumber}</p>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{l.loanType}</span>
                    </td>
                    <td className="font-mono font-bold" style={{ color: 'var(--success)' }}>
                      ₹{l.principalAmount?.toLocaleString()}
                    </td>
                    <td>
                      <p>{l.interestRate}% p.a.</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{l.tenureMonths} Months</p>
                    </td>
                    <td>
                      <StatusBadge status={l.status} size="sm" />
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {l.status === 'APPLIED' && (
                          <button
                            onClick={() => handleApproveLoan(l.id)}
                            disabled={approvingId === l.id}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle2 size={13} />
                            <span>{approvingId === l.id ? 'Approving...' : 'Approve'}</span>
                          </button>
                        )}
                        {l.status === 'APPROVED' && (
                          <button
                            onClick={() => setSelectedDisburseLoan(l)}
                            className="btn btn-primary btn-sm"
                          >
                            <GitMerge size={13} />
                            <span>Disburse Saga</span>
                          </button>
                        )}
                        {l.status === 'ACTIVE' && onSelectView && (
                          <button
                            onClick={() => onSelectView('m2-repayments')}
                            className="btn btn-secondary btn-sm"
                          >
                            <span>Repayments</span>
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

      <ApplyLoanModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        customers={customers}
        accounts={accounts}
        onSuccess={fetchLoans}
      />

      <ExecuteDisbursementModal
        isOpen={!!selectedDisburseLoan}
        onClose={() => setSelectedDisburseLoan(null)}
        loan={selectedDisburseLoan}
        onSuccess={(saga) => {
          fetchLoans();
          setCompletedSaga(saga);
        }}
      />

      <SagaDetailsModal
        isOpen={!!completedSaga}
        onClose={() => setCompletedSaga(null)}
        saga={completedSaga}
      />
    </div>
  );
};
