import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  Users,
  CreditCard,
  GitMerge,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Lock,
  FileText,
  Activity,
  DollarSign,
  ShieldAlert,
  Search,
  Check,
  Building,
  BellRing,
  Scale
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin, isSupervisor, isTeller, isAuditor, isCustomer } = useAuth();

  const [stats, setStats] = useState({
    customers: 5,
    totalLoanVolume: 1365000,
    activeSagas: 2,
    auditChainValid: true,
    npaCount: 1,
    pendingCompliance: 1,
  });

  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditIntegrity, setAuditIntegrity] = useState(null);
  const [kycRecords, setKycRecords] = useState([]);
  const [auditAlerts, setAuditAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [custRes, loanRes, auditRes, integrityRes, kycRes, alertsRes, notifRes] = await Promise.all([
          apiClient.getCustomers(),
          apiClient.getLoans(),
          apiClient.getAuditLogs(),
          apiClient.checkAuditIntegrity(),
          apiClient.getKycRecords(),
          apiClient.getAuditAlerts(),
          apiClient.getNotifications(),
        ]);

        setCustomers(custRes.data || []);
        setLoans(loanRes.data || []);
        setAuditLogs(auditRes.data || []);
        setAuditIntegrity(integrityRes.data || null);
        setKycRecords(kycRes.data || []);
        setAuditAlerts(alertsRes.data || []);
        setNotifications(notifRes.data || []);

        const totalVol = (loanRes.data || []).reduce((acc, curr) => acc + (curr.principalAmount || 0), 0);
        const npas = (loanRes.data || []).filter((l) => l.npaClassification === 'NPA').length;

        setStats({
          customers: (custRes.data || []).length,
          totalLoanVolume: totalVol,
          activeSagas: 2,
          auditChainValid: integrityRes.data?.isValid ?? true,
          npaCount: npas,
          pendingCompliance: 1,
        });
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>
            {isCustomer ? 'Personal Banking Portal' : `${user?.role} Operational Workspace`}
          </h1>
          <p>
            Welcome back, {user?.name} · {user?.department}
          </p>
        </div>

        <div className="page-actions" style={{ display: 'flex', gap: 10 }}>
          <Link to="/accounts-kyc" className="btn btn-secondary btn-sm">
            <Users size={15} />
            <span>{isCustomer ? 'My Account & Transfer' : 'Customer Directory & KYC'}</span>
          </Link>
          <Link to="/operations-pipeline" className="btn btn-primary btn-sm">
            <Activity size={15} />
            <span>Operations Pipeline</span>
          </Link>
        </div>
      </div>

      {/* 1. CUSTOMER VIEW */}
      {isCustomer && (() => {
        const currentCust = customers.find(c => 
          (user?.customerId && c.id === user.customerId) || 
          (user?.accountNumber && c.accountNumber === user.accountNumber) || 
          (user?.email && c.email === user.email) ||
          c.name === user?.name
        ) || customers[0];
        const custLoan = loans.find(l => l.customerId === currentCust?.id || l.customerName === currentCust?.name) || loans[0];
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-title">Primary Balance</span>
                  <div className="stat-icon icon-blue">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="stat-value">
                  ${(currentCust?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="stat-desc" style={{ color: currentCust?.status === 'ACTIVE' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={12} /> Account {currentCust?.status || 'Active'} ({currentCust?.accountNumber || 'FC-8820-9104'})
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-title">Active Loan Balance</span>
                  <div className="stat-icon icon-purple">
                    <CreditCard size={18} />
                  </div>
                </div>
                <div className="stat-value">
                  ${(custLoan?.outstandingAmount || 218450).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="stat-desc">{custLoan?.loanType || 'Home Mortgage'} ({custLoan?.id || 'LN-8001'})</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-title">Next Monthly EMI</span>
                  <div className="stat-icon icon-orange">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="stat-value">
                  ${(custLoan?.emiAmount || 2145).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="stat-desc">Due on {custLoan?.nextDueDate || '2026-09-15'}</div>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-title">KYC Status</span>
                  <div className="stat-icon icon-green">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <div className="stat-value" style={{ fontSize: '1.4rem', color: currentCust?.kycStatus === 'VERIFIED' ? '#10b981' : '#f59e0b' }}>
                  {currentCust?.kycStatus || 'VERIFIED'}
                </div>
                <div className="stat-desc">{currentCust?.accountType || 'Premium Savings'}</div>
              </div>
            </div>

            <div className="banking-card">
              <div className="card-header">
                <div>
                  <h2>My Active Credit Schedule</h2>
                  <div className="card-subtitle">Loan {custLoan?.id || 'LN-8001'} amortization summary</div>
                </div>
                <Link to="/lending" className="btn btn-primary btn-sm">
                  <span>View Full Schedule / Pay EMI</span>
                </Link>
              </div>
              <div className="table-responsive">
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Loan Reference</th>
                      <th>Type</th>
                      <th>Principal</th>
                      <th>Outstanding</th>
                      <th>Tenor</th>
                      <th>Next Due</th>
                      <th>Classification</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-mono cell-primary">{custLoan?.id || 'LN-8001'}</td>
                      <td>{custLoan?.loanType || 'Home Mortgage'}</td>
                      <td>${(custLoan?.principalAmount || 250000).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="cell-primary" style={{ color: '#f87171' }}>${(custLoan?.outstandingAmount || 218450).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{custLoan?.totalInstallments || 180} Months</td>
                      <td>{custLoan?.nextDueDate || '2026-09-15'}</td>
                      <td><span className="badge badge-success">{custLoan?.npaClassification || 'STANDARD'} (0 DPD)</span></td>
                      <td>
                        <Link to="/lending" className="btn btn-primary btn-sm">
                          Pay EMI
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}

      {/* 2. TELLER VIEW */}
      {isTeller && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Teller Station</span>
                <div className="stat-icon icon-green">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="stat-value">Counter 04</div>
              <div className="stat-desc">Front-Office Branch Servicing</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Loan Accounts</span>
                <div className="stat-icon icon-blue">
                  <Users size={18} />
                </div>
              </div>
              <div className="stat-value">{loans.length} Accounts</div>
              <div className="stat-desc">Active repayment schedules</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Repayment Action</span>
                <div className="stat-icon icon-purple">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="stat-value">Authorized</div>
              <div className="stat-desc">Post EMI cash / debit credits</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Compliance Intake</span>
                <div className="stat-icon icon-orange">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div className="stat-value">Active</div>
              <div className="stat-desc">AML screening submissions</div>
            </div>
          </div>

          <div className="banking-card">
            <div className="card-header">
              <div>
                <h2>Loan Repayment Counter Collection</h2>
                <div className="card-subtitle">Select loan facility to record borrower installment payment</div>
              </div>
              <Link to="/lending" className="btn btn-primary btn-sm">
                <span>Go to Loan Servicing Console</span>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Loan Reference</th>
                    <th>Borrower</th>
                    <th>Outstanding Balance</th>
                    <th>Monthly EMI</th>
                    <th>DPD Status</th>
                    <th>Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 5).map((l) => (
                    <tr key={l.id}>
                      <td className="cell-mono cell-primary">{l.id}</td>
                      <td className="cell-primary">{l.customerName}</td>
                      <td className="cell-primary">${(l.outstandingBalance || 0).toLocaleString()}</td>
                      <td className="cell-mono">${(l.emiAmount || 0).toLocaleString()}</td>
                      <td>
                        {l.dpd === 0 ? (
                          <span className="badge badge-success">0 DPD</span>
                        ) : (
                          <span className="badge badge-danger">{l.dpd} DPD</span>
                        )}
                      </td>
                      <td>
                        <Link to="/lending" className="btn btn-primary btn-sm">
                          Collect EMI
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 3. AUDITOR VIEW */}
      {isAuditor && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Cryptographic Chain</span>
                <div className="stat-icon icon-blue">
                  <Lock size={18} />
                </div>
              </div>
              <div className="stat-value" style={{ color: auditIntegrity?.isValid ? '#10b981' : '#ef4444' }}>
                {auditIntegrity?.isValid ? 'INTACT' : 'TAMPERED'}
              </div>
              <div className="stat-desc">{auditIntegrity?.totalBlocks || 8} SHA-256 blocks chained</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Open Audit Alerts</span>
                <div className="stat-icon icon-orange">
                  <ShieldAlert size={18} />
                </div>
              </div>
              <div className="stat-value" style={{ color: auditAlerts.filter(a => a.status === 'OPEN').length > 0 ? '#ef4444' : '#10b981' }}>
                {auditAlerts.filter(a => a.status === 'OPEN').length} Open
              </div>
              <div className="stat-desc">Forensic incidents logged</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Audit Log Volume</span>
                <div className="stat-icon icon-purple">
                  <FileText size={18} />
                </div>
              </div>
              <div className="stat-value">{auditLogs.length} Records</div>
              <div className="stat-desc">Immutable system operations</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">NPA Risk Exposure</span>
                <div className="stat-icon icon-green">
                  <Scale size={18} />
                </div>
              </div>
              <div className="stat-value">{stats.npaCount} Classified</div>
              <div className="stat-desc">Statutory capital reserve audited</div>
            </div>
          </div>

          <div className="banking-card">
            <div className="card-header">
              <div>
                <h2>Forensic Ledger Inspection &amp; Alerts</h2>
                <div className="card-subtitle">Cryptographic verification surveillance</div>
              </div>
              <Link to="/governance-risk" className="btn btn-primary btn-sm">
                <span>Open Forensic Console</span>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Alert Reference</th>
                    <th>Severity</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {auditAlerts.map((a) => (
                    <tr key={a.id}>
                      <td className="cell-mono cell-primary">{a.id}</td>
                      <td>
                        <span className={`badge ${a.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}`}>
                          {a.severity}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{a.type}</td>
                      <td style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{a.message}</td>
                      <td>
                        <span className={`badge ${a.status === 'OPEN' ? 'badge-danger' : 'badge-success'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/governance-risk" className="btn btn-secondary btn-sm">
                          Investigate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 4. SUPERVISOR & ADMIN VIEW */}
      {(isAdmin || isSupervisor) && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Total Customers</span>
                <div className="stat-icon icon-blue">
                  <Users size={18} />
                </div>
              </div>
              <div className="stat-value">{stats.customers} Accounts</div>
              <div className="stat-desc">KYC &amp; Risk profiles active</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Loan Portfolio</span>
                <div className="stat-icon icon-green">
                  <CreditCard size={18} />
                </div>
              </div>
              <div className="stat-value">${(stats.totalLoanVolume / 1000).toFixed(0)}k</div>
              <div className="stat-desc" style={{ color: stats.npaCount > 0 ? '#ef4444' : '#10b981' }}>
                {stats.npaCount} Classified NPA Account
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Active Sagas</span>
                <div className="stat-icon icon-purple">
                  <GitMerge size={18} />
                </div>
              </div>
              <div className="stat-value">2 Sagas</div>
              <div className="stat-desc">Disbursement orchestration active</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-title">Cryptographic Integrity</span>
                <div className="stat-icon icon-orange">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <div
                className="stat-value"
                style={{ fontSize: '1.4rem', color: auditIntegrity?.isValid ? '#10b981' : '#ef4444' }}
              >
                {auditIntegrity?.isValid ? 'VERIFIED' : 'TAMPERED'}
              </div>
              <div className="stat-desc">
                {auditIntegrity?.totalBlocks || 8} Blocks Chained
              </div>
            </div>
          </div>

          {/* Supervisory Action Queues */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
            {/* Customer Portfolio */}
            <div className="banking-card">
              <div className="card-header">
                <div>
                  <h2>Customer Registry &amp; KYC Status</h2>
                  <div className="card-subtitle">Active accounts with verification and risk tiering</div>
                </div>
                <Link to="/accounts-kyc" className="btn btn-secondary btn-sm">
                  Review All
                </Link>
              </div>

              <div className="table-responsive">
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Account</th>
                      <th>Balance</th>
                      <th>KYC</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.slice(0, 4).map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="cell-primary">{c.name}</div>
                          <div className="cell-sub">{c.id}</div>
                        </td>
                        <td className="cell-mono">{c.accountNumber}</td>
                        <td className="cell-primary" style={{ color: '#10b981' }}>
                          ${(c.balance || 0).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              c.kycStatus === 'VERIFIED'
                                ? 'badge-success'
                                : c.kycStatus === 'PENDING'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {c.kycStatus}
                          </span>
                        </td>
                        <td>
                          <Link to="/accounts-kyc" className="btn btn-secondary btn-sm">
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loans & NPA Staging */}
            <div className="banking-card">
              <div className="card-header">
                <div>
                  <h2>Credit Risk &amp; NPA Classification</h2>
                  <div className="card-subtitle">Days Past Due (DPD) regulatory monitoring</div>
                </div>
                <Link to="/lending" className="btn btn-secondary btn-sm">
                  Loan Console
                </Link>
              </div>

              <div className="table-responsive">
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Borrower</th>
                      <th>Outstanding</th>
                      <th>DPD</th>
                      <th>NPA Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.slice(0, 4).map((l) => (
                      <tr key={l.id}>
                        <td className="cell-mono cell-primary">{l.id}</td>
                        <td>{l.customerName}</td>
                        <td className="cell-primary" style={{ color: '#f87171' }}>
                          ${(l.outstandingBalance || 0).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 600, color: l.dpd > 60 ? '#ef4444' : l.dpd > 0 ? '#f59e0b' : '#10b981' }}>
                          {l.dpd} Days
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              l.npaClassification === 'STANDARD'
                                ? 'badge-success'
                                : l.npaClassification === 'SMA-0'
                                ? 'badge-blue'
                                : l.npaClassification === 'SMA-1'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {l.npaClassification}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Audit Trail */}
          <div className="banking-card" style={{ marginTop: 20 }}>
            <div className="card-header">
              <div>
                <h2>Recent Cryptographic Audit Trail</h2>
                <div className="card-subtitle">SHA-256 linked operations with immutable timestamps</div>
              </div>
              <Link to="/governance-risk" className="btn btn-secondary btn-sm">
                <span>View Full Hash Chain</span>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Block #</th>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Block Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(-4).reverse().map((log) => (
                    <tr key={log.index}>
                      <td className="cell-mono cell-primary">#{log.index}</td>
                      <td className="cell-sub">{log.timestamp}</td>
                      <td className="cell-primary">{log.user}</td>
                      <td><span className="badge badge-purple">{log.role}</span></td>
                      <td><span className="cell-primary">{log.action}</span></td>
                      <td className="cell-mono" style={{ color: '#93c5fd', fontSize: '0.78rem' }}>
                        {log.currentHash ? `${log.currentHash.substring(0, 24)}...` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
