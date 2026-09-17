import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import RiskDashboard from '../components/RiskDashboard';
import {
  ShieldCheck,
  Scale,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  RotateCcw,
  Zap,
  Sliders,
  Check,
  FileCheck,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function GovernanceRiskPage() {
  const { user, isAdmin, isSupervisor, isAuditor, isTeller } = useAuth();

  const [activeTab, setActiveTab] = useState('integrity'); // 'integrity' | 'alerts' | 'risk' | 'compliance'
  const [riskScores, setRiskScores] = useState([]);
  const [loans, setLoans] = useState([]);
  const [complianceChecks, setComplianceChecks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditAlerts, setAuditAlerts] = useState([]);
  const [integrityStatus, setIntegrityStatus] = useState(null);

  // Modals & forms
  const [selectedRiskCustomer, setSelectedRiskCustomer] = useState(null);
  const [newCreditScore, setNewCreditScore] = useState('');
  const [riskReassessNotes, setRiskReassessNotes] = useState('');

  const [newComplianceCustomer, setNewComplianceCustomer] = useState('Sarah Jenkins');
  const [newComplianceType, setNewComplianceType] = useState('AML');
  const [newComplianceNotes, setNewComplianceNotes] = useState('Quarterly anti-money laundering screening.');

  const [selectedAlertForResolution, setSelectedAlertForResolution] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const [notificationMsg, setNotificationMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canReassessRisk = isAdmin || isSupervisor;
  const canReviewCompliance = isAdmin || isSupervisor;
  const canSubmitCompliance = isAdmin || isSupervisor || isTeller;
  const canManageAuditAlerts = isAdmin || isSupervisor || isAuditor;
  const canSimulateTamper = isAdmin || isAuditor;

  const loadData = async () => {
    try {
      const [riskRes, compRes, logsRes, alertsRes, integRes, loansRes] = await Promise.all([
        apiClient.getRiskScores(),
        apiClient.getComplianceChecks(),
        apiClient.getAuditLogs(),
        apiClient.getAuditAlerts(),
        apiClient.checkAuditIntegrity(),
        apiClient.getLoans(),
      ]);
      setRiskScores(riskRes.data || []);
      setComplianceChecks(compRes.data || []);
      setAuditLogs(logsRes.data || []);
      setAuditAlerts(alertsRes.data || []);
      setIntegrityStatus(integRes.data || null);
      setLoans(loansRes.data || []);
    } catch (err) {
      console.error('Failed to load Governance & Risk data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyChain = async () => {
    setIsProcessing(true);
    try {
      const res = await apiClient.checkAuditIntegrity();
      setIntegrityStatus(res.data);
      if (res.data.isValid) {
        setNotificationMsg(`Cryptographic Verification Succeeded: All ${res.data.totalBlocks} blocks in hash chain verified matching SHA-256 digest.`);
      } else {
        setNotificationMsg(`TAMPER DETECTED at Block #${res.data.tamperedBlockIndex}! Hash mismatch identified.`);
      }
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Verification failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateTamper = async (index) => {
    setIsProcessing(true);
    try {
      const res = await apiClient.simulateTamper(index);
      setNotificationMsg(res.data.message);
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Tamper simulation failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreLedger = async () => {
    setIsProcessing(true);
    try {
      const res = await apiClient.restoreLedger();
      setNotificationMsg(res.data.message);
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Ledger restoration failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlertForResolution) return;
    setIsProcessing(true);
    try {
      await apiClient.resolveAuditAlert(
        selectedAlertForResolution.id,
        resolutionNotes,
        user?.name
      );
      setNotificationMsg(`Audit Alert ${selectedAlertForResolution.id} successfully resolved and archived.`);
      setSelectedAlertForResolution(null);
      setResolutionNotes('');
      await loadData();
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      alert('Alert resolution failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReassessRisk = async () => {
    if (!selectedRiskCustomer || !newCreditScore) return;
    setIsProcessing(true);
    try {
      const res = await apiClient.reassessRisk(
        selectedRiskCustomer.customerId,
        parseInt(newCreditScore, 10),
        riskReassessNotes
      );
      setNotificationMsg(
        `Risk profile updated for ${res.data?.profile?.customerName || res.data?.riskScore?.customerName || selectedRiskCustomer.customerName}: New Score ${res.data?.profile?.score ?? res.data?.riskScore?.score} (${res.data?.profile?.level || res.data?.riskScore?.level} RISK).`
      );
      setSelectedRiskCustomer(null);
      setNewCreditScore('');
      setRiskReassessNotes('');
      await loadData();
      setTimeout(() => setNotificationMsg(''), 5000);
    } catch (err) {
      alert('Risk reassessment failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitCompliance = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await apiClient.submitComplianceCheck({
        customerName: newComplianceCustomer,
        type: newComplianceType,
        notes: newComplianceNotes,
        submittedBy: user?.name,
      });
      setNotificationMsg(`Regulatory ${newComplianceType} screening check logged for ${newComplianceCustomer}.`);
      setNewComplianceNotes('');
      await loadData();
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      alert('Failed to submit screening: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReviewCompliance = async (checkId, status) => {
    setIsProcessing(true);
    try {
      await apiClient.reviewComplianceCheck(
        checkId,
        status,
        user?.name,
        `Officer review decision: ${status}`
      );
      setNotificationMsg(`Compliance check ${checkId} signed off as ${status}.`);
      await loadData();
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err) {
      alert('Failed to update compliance check: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>Risk Intelligence &amp; Cryptographic Audit Integrity</h1>
          <p>SHA-256 Immutable Ledger, Real-Time Tamper Surveillance, Credit Risk Scoring &amp; AML/PEP Compliance</p>
        </div>
      </div>

      {notificationMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: 20 }}>
          <CheckCircle size={18} color="#10b981" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'integrity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('integrity')}
        >
          <Lock size={16} />
          <span>Cryptographic Hash Ledger</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('alerts')}
        >
          <ShieldAlert size={16} />
          <span>Audit Alerts &amp; Incidents ({auditAlerts.filter(a => a.status === 'OPEN').length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'risk' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('risk')}
        >
          <Scale size={16} />
          <span>Multi-Factor Risk Scoring ({riskScores.length})</span>
        </button>

        <button
          type="button"
          className={`btn ${activeTab === 'compliance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('compliance')}
        >
          <FileCheck size={16} />
          <span>AML &amp; PEP Compliance Register ({complianceChecks.length})</span>
        </button>
      </div>

      {/* TAB 1: CRYPTOGRAPHIC HASH LEDGER */}
      {activeTab === 'integrity' && (
        <div>
          {/* Integrity Status Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: integrityStatus?.isValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${integrityStatus?.isValid ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.4)'}`,
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {integrityStatus?.isValid ? (
                <ShieldCheck size={28} color="#10b981" />
              ) : (
                <AlertTriangle size={28} color="#ef4444" />
              )}
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                  {integrityStatus?.isValid
                    ? 'Cryptographic Hash Chain: VERIFIED & INTACT'
                    : `CRITICAL ALERT: LEDGER TAMPER DETECTED AT BLOCK #${integrityStatus?.tamperedBlockIndex}`}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0' }}>
                  {integrityStatus?.isValid
                    ? `All ${integrityStatus?.totalBlocks} blocks sequentially linked with verifiable SHA-256 digests.`
                    : `Block #${integrityStatus?.tamperedBlockIndex} payload modified externally. Hash digest does not match mathematical chain.`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={isProcessing}
                onClick={handleVerifyChain}
              >
                <RefreshCw size={14} />
                <span>Verify SHA-256 Chain</span>
              </button>

              {!integrityStatus?.isValid && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={isProcessing}
                  onClick={handleRestoreLedger}
                >
                  <RotateCcw size={14} />
                  <span>Restore Clean Ledger</span>
                </button>
              )}
            </div>
          </div>

          {/* Tamper Simulation Card for Auditor/Admin */}
          {canSimulateTamper && (
            <div className="banking-card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div>
                  <h2>Forensic Integrity Surveillance Test</h2>
                  <div className="card-subtitle">
                    Inject a simulated payload change to verify that the SHA-256 detection engine immediately catches unauthorized alterations
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSimulateTamper(1)}
                  >
                    Simulate Tamper on Block #1
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSimulateTamper(2)}
                  >
                    Simulate Tamper on Block #2
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chain Block List */}
          <div className="banking-card">
            <div className="card-header">
              <div>
                <h2>Sequential Cryptographic Blocks ({auditLogs.length})</h2>
                <div className="card-subtitle">
                  Formula: SHA256(index | timestamp | user | role | action | details | prevHash)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {auditLogs.map((block, idx) => {
                const isTampered = !integrityStatus?.isValid && integrityStatus?.tamperedBlockIndex === block.index;

                return (
                  <div
                    key={block.index || idx}
                    style={{
                      background: isTampered ? 'rgba(239, 68, 68, 0.1)' : '#0b1329',
                      border: `1px solid ${isTampered ? '#ef4444' : 'var(--border-subtle)'}`,
                      borderRadius: 10,
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="badge badge-blue">BLOCK #{block.index}</span>
                        <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>
                          {block.action}
                        </span>
                        {isTampered && <span className="badge badge-danger">HASH MISMATCH DETECTED</span>}
                      </div>
                      <span className="cell-sub">{block.timestamp}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: '0.82rem', marginBottom: 12 }}>
                      <div>
                        <span className="stat-title">Initiating Principal:</span>
                        <div className="cell-primary">{block.user} ({block.role})</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span className="stat-title">Transaction Payload:</span>
                        <div style={{ color: '#cbd5e1' }}>{block.details}</div>
                      </div>
                    </div>

                    {/* Hashes */}
                    <div style={{ background: '#070d1e', padding: 10, borderRadius: 8, fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#64748b' }}>PREV HASH: </span>
                        <span className="cell-mono" style={{ color: '#94a3b8' }}>{block.prevHash}</span>
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#64748b' }}>BLOCK HASH: </span>
                        <span className="cell-mono" style={{ color: isTampered ? '#ef4444' : '#60a5fa', fontWeight: 600 }}>
                          {block.currentHash}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT ALERTS */}
      {activeTab === 'alerts' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Forensic Audit Alerts &amp; Discrepancies</h2>
              <div className="card-subtitle">
                System-generated incident alerts requiring formal investigation and signoff
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Timestamp</th>
                  <th>Severity</th>
                  <th>Discrepancy Category</th>
                  <th>Incident Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa' }}>{alert.id}</td>
                    <td className="cell-sub" style={{ fontSize: '0.78rem' }}>{alert.timestamp}</td>
                    <td>
                      {alert.severity === 'CRITICAL' && <span className="badge badge-danger">CRITICAL</span>}
                      {alert.severity === 'HIGH' && <span className="badge badge-warning">HIGH</span>}
                      {alert.severity === 'MEDIUM' && <span className="badge badge-blue">MEDIUM</span>}
                    </td>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{alert.type}</td>
                    <td style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{alert.message}</td>
                    <td>
                      {alert.status === 'OPEN' ? (
                        <span className="badge badge-danger">INVESTIGATION OPEN</span>
                      ) : (
                        <span className="badge badge-success">RESOLVED</span>
                      )}
                    </td>
                    <td>
                      {alert.status === 'OPEN' && canManageAuditAlerts ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedAlertForResolution(alert);
                            setResolutionNotes('');
                          }}
                        >
                          Resolve Alert
                        </button>
                      ) : (
                        <span className="cell-sub">{alert.resolutionNotes || 'Archived'}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {auditAlerts.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No forensic audit alerts currently logged.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-FACTOR RISK SCORING */}
      {activeTab === 'risk' && (
        <RiskDashboard
          riskScores={riskScores}
          loans={loans}
          onReassess={
            canReassessRisk
              ? (loanOrScore) => {
                  setSelectedRiskCustomer(loanOrScore);
                  setNewCreditScore(loanOrScore.creditScore?.toString() || '720');
                }
              : null
          }
        />
      )}

      {/* TAB 4: COMPLIANCE CHECK REGISTER */}
      {activeTab === 'compliance' && (
        <div>
          {canSubmitCompliance && (
            <div className="banking-card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div>
                  <h2>Submit Customer for Regulatory Screening</h2>
                  <div className="card-subtitle">
                    Screen against Anti-Money Laundering (AML), Politically Exposed Persons (PEP), and Sanctions lists
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitCompliance}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <select
                      className="select-control"
                      value={newComplianceCustomer}
                      onChange={(e) => setNewComplianceCustomer(e.target.value)}
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins (Mortgage Client)</option>
                      <option value="Vikram Patel">Vikram Patel (Working Capital)</option>
                      <option value="Robert Vance">Robert Vance (Commercial Facility)</option>
                      <option value="Helena Thorne">Helena Thorne (Asset Backed)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Screening Type</label>
                    <select
                      className="select-control"
                      value={newComplianceType}
                      onChange={(e) => setNewComplianceType(e.target.value)}
                    >
                      <option value="AML">AML (Anti-Money Laundering)</option>
                      <option value="PEP">PEP (Politically Exposed Person)</option>
                      <option value="SANCTIONS">Global Sanctions &amp; Watchlist</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Screening Notes &amp; Rationale</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newComplianceNotes}
                      onChange={(e) => setNewComplianceNotes(e.target.value)}
                      placeholder="Enter screening rationale and background..."
                      required
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                    <span>Submit for Screening Review</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="banking-card">
            <div className="card-header">
              <div>
                <h2>Regulatory Compliance Screening Register</h2>
                <div className="card-subtitle">
                  Formal AML, PEP, and Sanctions compliance decisions
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="banking-table">
                <thead>
                  <tr>
                    <th>Check ID</th>
                    <th>Customer Name</th>
                    <th>Screening Type</th>
                    <th>Submission Date</th>
                    <th>Compliance Decision</th>
                    <th>Reviewing Officer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceChecks.map((chk) => (
                    <tr key={chk.id}>
                      <td className="cell-mono" style={{ color: '#60a5fa' }}>{chk.id}</td>
                      <td className="cell-primary">{chk.customerName}</td>
                      <td>
                        <span className="badge badge-purple">{chk.type || chk.checkType || 'AML Diligence'}</span>
                      </td>
                      <td className="cell-sub">{chk.submittedDate || chk.submittedAt || '2026-09-05'}</td>
                      <td>
                        {(chk.status === 'PASSED' || chk.status === 'PASS') && <span className="badge badge-success">PASSED / CLEARED</span>}
                        {chk.status === 'PENDING' && <span className="badge badge-warning">PENDING REVIEW</span>}
                        {(chk.status === 'FLAGGED' || chk.status === 'REJECTED') && <span className="badge badge-danger">FLAGGED / REJECTED</span>}
                      </td>
                      <td className="cell-sub">{chk.reviewedBy || 'Pending Assignment'}</td>
                      <td>
                        {chk.status === 'PENDING' && canReviewCompliance ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleReviewCompliance(chk.id, 'PASSED')}
                            >
                              Pass
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReviewCompliance(chk.id, 'FLAGGED')}
                            >
                              Flag
                            </button>
                          </div>
                        ) : (
                          <span className="cell-sub">Decision Documented</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RISK REASSESSMENT MODAL */}
      {selectedRiskCustomer && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Reassess Credit Risk: {selectedRiskCustomer.customerName}</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedRiskCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div className="stat-title">Current Score</div>
                <div className="cell-primary">
                  {selectedRiskCustomer.score ?? selectedRiskCustomer.riskScore} / 100
                </div>
              </div>
              <div>
                <div className="stat-title">Current Tier</div>
                <div>
                  <span
                    className={`badge ${
                      (selectedRiskCustomer.level || selectedRiskCustomer.riskLevel) === 'LOW'
                        ? 'badge-success'
                        : (selectedRiskCustomer.level || selectedRiskCustomer.riskLevel) === 'MEDIUM'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {selectedRiskCustomer.level || selectedRiskCustomer.riskLevel} RISK
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Updated Bureau Rating (300 - 850)</label>
              <input
                type="number"
                className="form-control"
                value={newCreditScore}
                onChange={(e) => setNewCreditScore(e.target.value)}
                min="300"
                max="850"
                placeholder="e.g. 740"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Evaluation Notes &amp; Rationale</label>
              <textarea
                className="form-control"
                rows="3"
                value={riskReassessNotes}
                onChange={(e) => setRiskReassessNotes(e.target.value)}
                placeholder="Document supervisory credit justification..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRiskCustomer(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isProcessing}
                onClick={handleReassessRisk}
              >
                <span>Commit Reassessment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLVE ALERT MODAL */}
      {selectedAlertForResolution && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Resolve Audit Alert: {selectedAlertForResolution.id}</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedAlertForResolution(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="stat-title">Discrepancy Description</div>
              <div style={{ color: '#f87171', fontSize: '0.88rem', marginTop: 4 }}>
                {selectedAlertForResolution.message}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Forensic Resolution Findings &amp; Signoff</label>
              <textarea
                className="form-control"
                rows="3"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Document forensic investigation results, remediation actions, and officer signoff..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedAlertForResolution(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isProcessing || !resolutionNotes.trim()}
                onClick={handleResolveAlert}
              >
                <Check size={16} />
                <span>Archive &amp; Resolve Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
