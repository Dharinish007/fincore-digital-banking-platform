import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ExecuteDisbursementModal } from '../../components/modals/ExecuteDisbursementModal';
import { SagaDetailsModal } from '../../components/modals/SagaDetailsModal';
import { GitMerge, Play, RefreshCw, AlertTriangle, CheckCircle2, RotateCcw, ArrowRight, Eye } from 'lucide-react';

export const DisbursementSagaView = () => {
  const [loans, setLoans] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [inspectedSaga, setInspectedSaga] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loanRes, sagaRes] = await Promise.all([
        fetch('/api/loans'),
        fetch('/api/milestone3/sagas?type=DISBURSEMENT'),
      ]);
      const loanData = await loanRes.json();
      const sagaData = await sagaRes.json();
      if (loanData.success) setLoans(loanData.loans || []);
      if (sagaData.success) setSagas(sagaData.sagas || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvedLoans = loans.filter((l) => l.status === 'APPROVED');
  const disbursedLoans = loans.filter((l) => l.status === 'DISBURSED');

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
                <GitMerge size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Loan Disbursement & Automated Sanction Processing
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Automated liquidity allocation, amortization generation, borrower credit, and double-entry accounting
                </p>
              </div>
            </div>
          </div>

          <button onClick={fetchData} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 6-Step Automated Pipeline */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Automated 6-Stage Disbursement Process
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 1</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Validate KYC</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compliance & AML check</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 2</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Reserve Funds</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lock bank liquidity pool</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 3</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Amortization</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate EMI schedule</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 4</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Credit Account</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disburse principal</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 5</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Ledger Journal</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Double-entry booking</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Stage 6</span>
            <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginTop: '0.25rem' }}>Send SMS Alert</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify customer</div>
          </div>
        </div>
      </div>

      {/* Approved Loans Awaiting Disbursement */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Approved Loans Ready for Disbursement</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click &quot;Execute Disbursement&quot; to initiate atomic multi-step release of loan capital</p>
          </div>
          <span className="badge badge-info">{approvedLoans.length} Loans Pending</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan Reference</th>
                <th>Borrower Profile</th>
                <th>Principal Amount</th>
                <th>Interest & Tenure</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>Disburse Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                    No loans currently awaiting disbursement.
                  </td>
                </tr>
              ) : (
                approvedLoans.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {l.loanNumber || l.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.customerName || 'Borrower'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account: {l.accountId || 'Savings'}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{Number(l.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {l.interestRate}% p.a. &bull; {l.termMonths} Months
                    </td>
                    <td>
                      <StatusBadge status={l.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedLoan(l)}
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: 'auto' }}
                      >
                        <Play size={14} />
                        <span>Disburse Capital</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disbursed History / Audit Records */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Disbursement Audit Records</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed loan disbursements with atomic verification signatures</p>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Disbursement ID</th>
                <th>Loan Reference</th>
                <th>Disbursed Amount</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Log Details</th>
              </tr>
            </thead>
            <tbody>
              {sagas.length === 0 ? (
                disbursedLoans.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>DSB-{l.id.slice(0, 6)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{l.loanNumber || l.id}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(l.amount).toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{l.approvedAt || 'Recent'}</td>
                    <td><span className="badge badge-success">COMPLETED</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>All Steps Succeeded</span>
                    </td>
                  </tr>
                ))
              ) : (
                sagas.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{s.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{s.entityId}</td>
                    <td style={{ fontWeight: 700 }}>₹{Number(s.payload?.amount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(s.createdAt).toLocaleString('en-IN')}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => setInspectedSaga(s)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                        <Eye size={14} />
                        <span>Inspect Steps</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execute Disbursement Modal */}
      <ExecuteDisbursementModal
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        loan={selectedLoan}
        onSuccess={fetchData}
      />

      {/* Inspect Saga Modal */}
      <SagaDetailsModal
        isOpen={!!inspectedSaga}
        onClose={() => setInspectedSaga(null)}
        saga={inspectedSaga}
      />
    </div>
  );
};
