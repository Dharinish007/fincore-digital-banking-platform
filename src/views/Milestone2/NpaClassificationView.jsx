import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  AlertTriangle,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingDown,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const NpaClassificationView = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningClassification, setRunningClassification] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);

  const fetchNpaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/loans');
      const data = await res.json();
      if (data.success) {
        setLoans(data.loans || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNpaData();
  }, []);

  const handleRunNpaClassification = async () => {
    setRunningClassification(true);
    setClassificationResult(null);
    try {
      const res = await fetch('/api/milestone2/npa/classify', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setClassificationResult(data);
        fetchNpaData();
      }
    } catch (e) {
      setClassificationResult({ success: false, message: e.message || 'Classification execution failed' });
    } finally {
      setRunningClassification(false);
    }
  };

  // NPA distribution metrics
  const standardLoans = loans.filter((l) => l.npaCategory === 'STANDARD');
  const smaLoans = loans.filter((l) => ['SMA_0', 'SMA_1', 'SMA_2'].includes(l.npaCategory));
  const npaLoans = loans.filter((l) => ['SUBSTANDARD', 'DOUBTFUL', 'LOSS'].includes(l.npaCategory));

  const totalProvisionRequired = loans.reduce((sum, l) => sum + (l.provisionAmount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(16, 22, 34, 0.95))',
        borderColor: 'var(--border-light)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Non-Performing Asset (NPA) & Risk Classification
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Regulatory Asset Quality Review &bull; Days Past Due (DPD) Tracking &bull; Mandatory Capital Provisioning
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchNpaData} className="btn btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleRunNpaClassification}
              disabled={runningClassification}
              className="btn btn-danger btn-sm"
            >
              <Play size={14} />
              <span>{runningClassification ? 'Classifying Portfolio...' : 'Run Portfolio NPA Review'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result notification */}
      {classificationResult && (
        <div className="badge badge-success" style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>
            NPA Classification Completed: {classificationResult.classifiedCount || loans.length} loan accounts evaluated according to regulatory asset criteria.
          </span>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Standard Assets (0 DPD)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {standardLoans.length} Loans
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Provisioning: 0.40%
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Special Mention Accounts (SMA)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {smaLoans.length} Loans
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            1 - 90 Days Past Due
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Classified NPAs (&gt;90 DPD)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.25rem' }}>
            {npaLoans.length} Loans
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Substandard, Doubtful & Loss
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Required Capital Reserve</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            ₹{totalProvisionRequired.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Provisioned against credit risk
          </div>
        </div>
      </div>

      {/* Loan Risk Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Loan Portfolio Risk Register</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asset quality categorization per regulatory prudential norms</p>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan Reference</th>
                <th>Borrower Profile</th>
                <th>Outstanding Principal</th>
                <th>Days Past Due (DPD)</th>
                <th>Risk Category</th>
                <th>Capital Provisioning</th>
                <th>Sanction Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => {
                const dpd = l.dpd || 0;
                const isNpa = ['SUBSTANDARD', 'DOUBTFUL', 'LOSS'].includes(l.npaCategory);
                return (
                  <tr key={l.id} style={{ backgroundColor: isNpa ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {l.loanNumber || l.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.customerName || 'Borrower'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acct: {l.accountId || 'Savings'}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{Number(l.amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge ${dpd === 0 ? 'badge-success' : dpd <= 30 ? 'badge-info' : dpd <= 90 ? 'badge-warning' : 'badge-danger'}`}>
                        {dpd} DPD
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${l.npaCategory === 'STANDARD' ? 'badge-success' : isNpa ? 'badge-danger' : 'badge-warning'}`}>
                        {l.npaCategory || 'STANDARD'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{Number(l.provisionAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <StatusBadge status={l.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
