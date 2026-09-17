import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  CreditCard,
  GitMerge,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function LendingPage() {
  const { user, isAdmin, isSupervisor, isTeller, isCustomer, isAuditor } = useAuth();

  const [activeTab, setActiveTab] = useState('repayments'); // 'repayments' | 'saga' | 'npa'
  const [loans, setLoans] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [newSagaCustomer, setNewSagaCustomer] = useState('Robert Vance');
  const [newSagaAmount, setNewSagaAmount] = useState('150000');
  const [isProcessing, setIsProcessing] = useState(false);

  const canDisburse = isAdmin || isSupervisor;
  const canCollectPayments = isAdmin || isSupervisor || isTeller || isCustomer;

  const loadData = async () => {
    try {
      const [loanRes, sagaRes, repRes] = await Promise.all([
        apiClient.getLoans(),
        apiClient.getSagas(),
        apiClient.getRepayments(),
      ]);
      setLoans(loanRes.data || []);
      setSagas(sagaRes.data || []);
      setRepayments(repRes.data || []);
    } catch (err) {
      console.error('Error loading Lending data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayInstallment = async () => {
    if (!selectedLoanForPayment) return;
    setIsProcessing(true);
    try {
      const res = await apiClient.payRepayment(
        selectedLoanForPayment.id,
        paymentAmount || selectedLoanForPayment.emiAmount,
        user?.name
      );
      setNotificationMsg(
        `Payment of $${parseFloat(paymentAmount || selectedLoanForPayment.emiAmount).toFixed(2)} processed for Loan ${selectedLoanForPayment.id}. Updated NPA Category: ${res.data.loan.npaClassification}`
      );
      setSelectedLoanForPayment(null);
      setPaymentAmount('');
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Failed to process payment: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteSaga = async (sagaId) => {
    setIsProcessing(true);
    try {
      await apiClient.executeSaga(sagaId);
      setNotificationMsg(`Disbursement saga ${sagaId} executed successfully across all distributed service stages.`);
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Saga execution failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // NPA Classification Counts
  const npaSummary = {
    standard: loans.filter((l) => l.npaClassification === 'STANDARD').length,
    sma0: loans.filter((l) => l.npaClassification === 'SMA-0').length,
    sma1: loans.filter((l) => l.npaClassification === 'SMA-1').length,
    sma2: loans.filter((l) => l.npaClassification === 'SMA-2').length,
    npa: loans.filter((l) => l.npaClassification === 'NPA').length,
  };

  // Filter loans for Customer if logged in as customer
  const visibleLoans = isCustomer
    ? loans.filter((l) => l.customerName.toLowerCase().includes('sarah') || l.customerName.toLowerCase().includes(user?.name.toLowerCase()))
    : loans;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>Credit &amp; Loan Portfolio Management</h1>
          <p>EMI Servicing, Multi-Phase Disbursement Sagas, and Regulatory NPA Classification</p>
        </div>
      </div>

      {notificationMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: 20 }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'repayments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('repayments')}
        >
          <CreditCard size={16} />
          <span>Loan Portfolio &amp; Repayments ({visibleLoans.length})</span>
        </button>

        {!isCustomer && (
          <>
            <button
              type="button"
              className={`btn ${activeTab === 'saga' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('saga')}
            >
              <GitMerge size={16} />
              <span>Disbursement Sagas ({sagas.length})</span>
            </button>

            <button
              type="button"
              className={`btn ${activeTab === 'npa' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('npa')}
            >
              <AlertTriangle size={16} />
              <span>Asset Classification &amp; NPA Engine</span>
            </button>
          </>
        )}
      </div>

      {/* TAB 1: REPAYMENTS & PORTFOLIO */}
      {activeTab === 'repayments' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Active Loan Accounts &amp; Repayment Schedules</h2>
              <div className="card-subtitle">
                Amortization schedules, monthly EMI progress, and Days Past Due (DPD) tracking
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer Name</th>
                  <th>Facility Type</th>
                  <th>Principal Amount</th>
                  <th>Outstanding Balance</th>
                  <th>Monthly EMI</th>
                  <th>Days Past Due</th>
                  <th>Asset Classification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>{loan.id}</td>
                    <td className="cell-primary">
                      {loan.customerName}
                      <span className="cell-sub">{loan.accountNumber}</span>
                    </td>
                    <td>
                      <span className="badge badge-blue">{loan.loanType}</span>
                    </td>
                    <td className="cell-primary">${(loan.principalAmount || 0).toLocaleString()}</td>
                    <td className="cell-primary" style={{ color: '#f87171', fontWeight: 600 }}>
                      ${(loan.outstandingBalance || 0).toLocaleString()}
                    </td>
                    <td className="cell-mono">${(loan.emiAmount || 0).toLocaleString()}</td>
                    <td>
                      {loan.dpd === 0 ? (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>0 Days</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>{loan.dpd} Days</span>
                      )}
                    </td>
                    <td>
                      {loan.npaClassification === 'STANDARD' && (
                        <span className="badge badge-success">STANDARD</span>
                      )}
                      {loan.npaClassification === 'SMA-0' && (
                        <span className="badge badge-blue">SMA-0</span>
                      )}
                      {loan.npaClassification === 'SMA-1' && (
                        <span className="badge badge-warning">SMA-1</span>
                      )}
                      {loan.npaClassification === 'SMA-2' && (
                        <span className="badge badge-purple">SMA-2</span>
                      )}
                      {loan.npaClassification === 'NPA' && (
                        <span className="badge badge-danger">NPA</span>
                      )}
                    </td>
                    <td>
                      {canCollectPayments && loan.outstandingBalance > 0 && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedLoanForPayment(loan);
                            setPaymentAmount(loan.emiAmount?.toString() || '1000');
                          }}
                        >
                          <DollarSign size={14} />
                          <span>Pay Installment</span>
                        </button>
                      )}
                      {loan.outstandingBalance <= 0 && (
                        <span className="badge badge-success">PAID IN FULL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISBURSEMENT SAGA */}
      {activeTab === 'saga' && !isCustomer && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Multi-Phase Loan Disbursement Sagas</h2>
              <div className="card-subtitle">
                Distributed orchestration: Document Verification → Credit Approval → Account Credited → Settlement Finalized
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
            {sagas.map((saga) => (
              <div
                key={saga.id}
                style={{
                  background: '#0b1329',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: 18
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span className="cell-mono" style={{ color: '#60a5fa', fontWeight: 700 }}>{saga.id}</span>
                    <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: 2 }}>{saga.customerName}</h3>
                  </div>
                  <div>
                    {saga.status === 'COMPLETED' && <span className="badge badge-success">COMPLETED</span>}
                    {saga.status === 'IN_PROGRESS' && <span className="badge badge-warning">IN PROGRESS</span>}
                    {saga.status === 'FAILED' && <span className="badge badge-danger">FAILED</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.82rem', marginBottom: 16 }}>
                  <div>
                    <span className="stat-title">Facility Amount</span>
                    <div className="cell-primary" style={{ color: '#10b981' }}>${(saga.amount || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="stat-title">Current Step</span>
                    <div className="cell-primary">{saga.currentStep} / {saga.totalSteps}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ background: '#111e3b', borderRadius: 9999, height: 8, overflow: 'hidden', marginBottom: 14 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(saga.currentStep / saga.totalSteps) * 100}%`,
                      background: saga.status === 'COMPLETED' ? '#10b981' : saga.status === 'FAILED' ? '#ef4444' : '#2563eb'
                    }}
                  />
                </div>

                {/* Steps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', marginBottom: 14 }}>
                  {(saga.steps || []).map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#cbd5e1' }}>{step.name}</span>
                      <span className={`badge ${step.status === 'SUCCESS' ? 'badge-success' : step.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>

                {canDisburse && saga.status !== 'COMPLETED' && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    disabled={isProcessing}
                    onClick={() => handleExecuteSaga(saga.id)}
                  >
                    <Play size={14} />
                    <span>Resume / Execute Disbursement</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NPA CLASSIFICATION ENGINE */}
      {activeTab === 'npa' && !isCustomer && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Regulatory Asset Classification (NPA Engine)</h2>
              <div className="card-subtitle">
                Automated statutory staging based on Days Past Due (DPD) &amp; Basel III Capital Provisioning
              </div>
            </div>
          </div>

          {/* NPA Summary Metrics */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-title">Standard Assets (0 DPD)</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{npaSummary.standard}</div>
              <div className="cell-sub">0.40% General Provisioning</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Special Mention (SMA-0)</div>
              <div className="stat-value" style={{ color: '#60a5fa' }}>{npaSummary.sma0}</div>
              <div className="cell-sub">1 - 30 DPD (Early Warning)</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Sub-Watchlist (SMA-1)</div>
              <div className="stat-value" style={{ color: '#f59e0b' }}>{npaSummary.sma1}</div>
              <div className="cell-sub">31 - 60 DPD (Active Watch)</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">High Default Risk (SMA-2)</div>
              <div className="stat-value" style={{ color: '#8b5cf6' }}>{npaSummary.sma2}</div>
              <div className="cell-sub">61 - 90 DPD (Accelerated Reserve)</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Regulatory NPA (&gt; 90 DPD)</div>
              <div className="stat-value" style={{ color: '#ef4444' }}>{npaSummary.npa}</div>
              <div className="cell-sub">25.00% Statutory Reserve</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Regulatory Staging</th>
                  <th>Overdue Range (DPD)</th>
                  <th>Statutory Reserve Ratio</th>
                  <th>Supervisory Action Trigger</th>
                  <th>Active Portfolio Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-primary"><span className="badge badge-success">STANDARD</span></td>
                  <td>0 Days</td>
                  <td>0.40% Standard Capital Reserve</td>
                  <td className="cell-sub">Routine automated billing debit</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{npaSummary.standard}</td>
                </tr>
                <tr>
                  <td className="cell-primary"><span className="badge badge-blue">SMA-0</span></td>
                  <td>1 - 30 Days</td>
                  <td>1.00% Supervisory Reserve</td>
                  <td className="cell-sub">Early delinquency notice &amp; automated reminder</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{npaSummary.sma0}</td>
                </tr>
                <tr>
                  <td className="cell-primary"><span className="badge badge-warning">SMA-1</span></td>
                  <td>31 - 60 Days</td>
                  <td>5.00% Supervisory Reserve</td>
                  <td className="cell-sub">Credit risk review committee notification</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{npaSummary.sma1}</td>
                </tr>
                <tr>
                  <td className="cell-primary"><span className="badge badge-purple">SMA-2</span></td>
                  <td>61 - 90 Days</td>
                  <td>15.00% Accelerated Provisioning</td>
                  <td className="cell-sub">Restructuring mandate &amp; collateral appraisal</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{npaSummary.sma2}</td>
                </tr>
                <tr>
                  <td className="cell-primary"><span className="badge badge-danger">NPA</span></td>
                  <td>&gt; 90 Days</td>
                  <td>25.00% Asset Loss Provisioning</td>
                  <td className="cell-sub">Statutory recovery proceedings &amp; legal notice</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{npaSummary.npa}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {selectedLoanForPayment && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Process Loan Installment Payment</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedLoanForPayment(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div className="stat-title">Facility ID</div>
                <div className="cell-mono">{selectedLoanForPayment.id}</div>
              </div>
              <div>
                <div className="stat-title">Borrower</div>
                <div className="cell-primary">{selectedLoanForPayment.customerName}</div>
              </div>
              <div>
                <div className="stat-title">Outstanding Balance</div>
                <div className="cell-primary" style={{ color: '#ef4444' }}>
                  ${(selectedLoanForPayment.outstandingBalance || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="stat-title">Scheduled EMI</div>
                <div className="cell-primary" style={{ color: '#10b981' }}>
                  ${(selectedLoanForPayment.emiAmount || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Amount ($ USD)</label>
              <input
                type="number"
                className="form-control"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter repayment amount"
                min="1"
                max={selectedLoanForPayment.outstandingBalance}
              />
              <div className="cell-sub" style={{ marginTop: 4 }}>
                Submitting payment immediately reduces principal, recalculates DPD, and commits a cryptographic SHA-256 audit entry.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isProcessing}
                onClick={() => setSelectedLoanForPayment(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isProcessing}
                onClick={handlePayInstallment}
              >
                <DollarSign size={16} />
                <span>{isProcessing ? 'Processing Transaction...' : 'Confirm & Post Repayment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
