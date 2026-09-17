import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Lock,
  GitMerge,
  RotateCcw,
  Sparkles,
  Layers,
  Scale,
  Users
} from 'lucide-react';

export default function OperationsPipelinePage() {
  const { user } = useAuth();

  const [activeWorkflow, setActiveWorkflow] = useState('WORKFLOW_1');
  const [isRunning, setIsRunning] = useState(false);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('Vikram Patel');

  // Run real cross-module workflow
  const handleRunWorkflow1 = async () => {
    setIsRunning(true);
    setWorkflowResults(null);
    try {
      const res = await apiClient.runCrossModuleWorkflow(selectedCustomer);
      setWorkflowResults(res.data);
    } catch (err) {
      alert('Banking operations pipeline failed: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-box">
          <h1>Integrated Banking Operations Pipeline</h1>
          <p>
            Synchronized Real-Time Execution Across KYC Onboarding, Credit Sagas, NPA Engine &amp; Cryptographic SHA-256 Chains
          </p>
        </div>
      </div>

      {/* Workflow Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div
          onClick={() => setActiveWorkflow('WORKFLOW_1')}
          style={{
            background: activeWorkflow === 'WORKFLOW_1' ? '#16274e' : '#111e3b',
            border: `1px solid ${activeWorkflow === 'WORKFLOW_1' ? '#2563eb' : 'var(--border-subtle)'}`,
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="badge badge-blue">PIPELINE 1</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Identity, Risk &amp; Ledger Chain</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Customer Onboarding → KYC Document Verification → Algorithmic Risk Scoring → Regulatory AML Compliance → Cryptographic SHA-256 Block Commit.
          </p>
        </div>

        <div
          onClick={() => setActiveWorkflow('WORKFLOW_2')}
          style={{
            background: activeWorkflow === 'WORKFLOW_2' ? '#16274e' : '#111e3b',
            border: `1px solid ${activeWorkflow === 'WORKFLOW_2' ? '#2563eb' : 'var(--border-subtle)'}`,
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="badge badge-purple">PIPELINE 2</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Credit Lifecycle &amp; NPA Servicing</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Facility Approval → Distributed Disbursement Saga → Real-Time EMI Servicing → DPD Tracking → Automated Regulatory NPA Staging (SMA 0/1/2/NPA).
          </p>
        </div>

        <div
          onClick={() => setActiveWorkflow('WORKFLOW_3')}
          style={{
            background: activeWorkflow === 'WORKFLOW_3' ? '#16274e' : '#111e3b',
            border: `1px solid ${activeWorkflow === 'WORKFLOW_3' ? '#2563eb' : 'var(--border-subtle)'}`,
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className="badge badge-warning">PIPELINE 3</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Audit Integrity &amp; Forensic Shield</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Financial Operations → Immutable Audit Trail → Cryptographic Hash Generation → Continuous Tamper Surveillance → Real-Time Forensic Remediation.
          </p>
        </div>
      </div>

      {/* PIPELINE 1 EXECUTION PANEL */}
      {activeWorkflow === 'WORKFLOW_1' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Pipeline 1 · Onboarding → KYC → Risk → Compliance → Cryptographic SHA-256 Ledger</h2>
              <div className="card-subtitle">
                Executes live database operations and calculates block hash dynamically
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <select
                className="select-control"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="Vikram Patel">Vikram Patel (Working Capital)</option>
                <option value="Robert Vance">Robert Vance (Commercial Facility)</option>
                <option value="Helena Thorne">Helena Thorne (Asset Backed)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Mortgage Facility)</option>
              </select>

              <button
                type="button"
                className="btn btn-primary"
                disabled={isRunning}
                onClick={handleRunWorkflow1}
              >
                <Play size={15} />
                <span>{isRunning ? 'Processing Pipeline...' : 'Run End-to-End Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Workflow Architecture Diagram */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              background: '#0b1329',
              padding: '16px 20px',
              borderRadius: 10,
              marginBottom: 24,
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STAGE 1</div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>Customer Profile</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Core Accounts</div>
            </div>
            <ArrowRight size={16} color="#64748b" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STAGE 2</div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>KYC Verification</div>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa' }}>Identity Engine</div>
            </div>
            <ArrowRight size={16} color="#64748b" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STAGE 3</div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>Risk Score (0-100)</div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Credit Intelligence</div>
            </div>
            <ArrowRight size={16} color="#64748b" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STAGE 4</div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>AML Compliance</div>
              <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Regulatory Register</div>
            </div>
            <ArrowRight size={16} color="#64748b" />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STAGE 5</div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>SHA-256 Block</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Audit Ledger</div>
            </div>
          </div>

          {/* Results Output */}
          {workflowResults ? (
            <div style={{ background: '#0b1329', padding: 20, borderRadius: 12, border: '1px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  End-to-End Pipeline Executed &amp; Committed to Ledger
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 18 }}>
                <div style={{ background: '#111e3b', padding: 14, borderRadius: 8 }}>
                  <div className="stat-title">Customer / Account</div>
                  <div className="cell-primary" style={{ fontSize: '1.05rem' }}>
                    {workflowResults.customer.name}
                  </div>
                  <div className="cell-mono">{workflowResults.customer.accountNumber}</div>
                </div>

                <div style={{ background: '#111e3b', padding: 14, borderRadius: 8 }}>
                  <div className="stat-title">KYC Validation</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="badge badge-success">{workflowResults.kyc.status}</span>
                  </div>
                  <div className="cell-sub">{workflowResults.kyc.documentType} ({workflowResults.kyc.documentNumber})</div>
                </div>

                <div style={{ background: '#111e3b', padding: 14, borderRadius: 8 }}>
                  <div className="stat-title">Computed Risk Profile</div>
                  <div style={{ marginTop: 4 }}>
                    <span className={`badge ${workflowResults.risk.level === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                      {workflowResults.risk.level} ({workflowResults.risk.score}/100)
                    </span>
                  </div>
                  <div className="cell-sub" style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Array.isArray(workflowResults.risk.factors) ? (
                      workflowResults.risk.factors.map((f, i) => (
                        <span key={i} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {f.name || f}
                        </span>
                      ))
                    ) : typeof workflowResults.risk.factors === 'object' && workflowResults.risk.factors !== null ? (
                      JSON.stringify(workflowResults.risk.factors)
                    ) : (
                      workflowResults.risk.factors
                    )}
                  </div>
                </div>

                <div style={{ background: '#111e3b', padding: 14, borderRadius: 8 }}>
                  <div className="stat-title">AML Compliance Decision</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="badge badge-success">{workflowResults.compliance.status}</span>
                  </div>
                  <div className="cell-sub">Type: {workflowResults.compliance.type}</div>
                </div>
              </div>

              {/* Cryptographic Ledger Block Committed */}
              <div style={{ background: '#070d1e', border: '1px solid rgba(37,99,235,0.4)', padding: 16, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa' }}>
                    New Immutable Audit Block #{workflowResults.auditBlock.index}
                  </span>
                  <span className="cell-sub">{workflowResults.auditBlock.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: 8 }}>
                  <strong>Payload:</strong> {workflowResults.auditBlock.details}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4, fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>PREV HASH: </span>
                    <span className="cell-mono" style={{ color: '#94a3b8' }}>{workflowResults.auditBlock.prevHash}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>BLOCK HASH: </span>
                    <span className="cell-mono" style={{ color: '#60a5fa', fontWeight: 600 }}>{workflowResults.auditBlock.currentHash}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              Click "Run End-to-End Pipeline" to trigger synchronized multi-stage integration across all core banking services.
            </div>
          )}
        </div>
      )}

      {/* PIPELINE 2: CREDIT & NPA */}
      {activeWorkflow === 'WORKFLOW_2' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Pipeline 2 · Facility Approval → Disbursement Saga → EMI Servicing → NPA Classification</h2>
              <div className="card-subtitle">
                Demonstrates regulatory DPD transitions and automatic asset staging
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Amortization Stage</th>
                  <th>Days Past Due (DPD)</th>
                  <th>Regulatory Classification</th>
                  <th>Capital Reserve Ratio</th>
                  <th>Supervisory Action Trigger</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="cell-primary">Standard Performance</td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>0 Days</td>
                  <td><span className="badge badge-success">STANDARD</span></td>
                  <td>0.40% General Provisioning</td>
                  <td className="cell-sub">Routine automated EMI debit</td>
                </tr>
                <tr>
                  <td className="cell-primary">Early Delinquency Notice</td>
                  <td style={{ color: '#60a5fa', fontWeight: 700 }}>1 - 30 Days</td>
                  <td><span className="badge badge-blue">SMA-0</span></td>
                  <td>1.00% Supervisory Reserve</td>
                  <td className="cell-sub">Automated SMS / Email reminder</td>
                </tr>
                <tr>
                  <td className="cell-primary">Sub-Watchlist Delinquency</td>
                  <td style={{ color: '#f59e0b', fontWeight: 700 }}>31 - 60 Days</td>
                  <td><span className="badge badge-warning">SMA-1</span></td>
                  <td>5.00% Supervisory Reserve</td>
                  <td className="cell-sub">Credit risk committee notification</td>
                </tr>
                <tr>
                  <td className="cell-primary">Imminent Default Risk</td>
                  <td style={{ color: '#8b5cf6', fontWeight: 700 }}>61 - 90 Days</td>
                  <td><span className="badge badge-purple">SMA-2</span></td>
                  <td>15.00% Accelerated Provisioning</td>
                  <td className="cell-sub">Restructuring mandate &amp; collateral call</td>
                </tr>
                <tr>
                  <td className="cell-primary">Regulatory Non-Performing Asset</td>
                  <td style={{ color: '#ef4444', fontWeight: 700 }}>&gt; 90 Days</td>
                  <td><span className="badge badge-danger">NPA</span></td>
                  <td>25.00% Asset Loss Provisioning</td>
                  <td className="cell-sub">Recovery proceedings &amp; legal notice</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PIPELINE 3: AUDIT & FORENSICS */}
      {activeWorkflow === 'WORKFLOW_3' && (
        <div className="banking-card">
          <div className="card-header">
            <div>
              <h2>Pipeline 3 · Continuous Audit Trail &amp; Cryptographic Tamper Shield</h2>
              <div className="card-subtitle">
                Mathematical integrity assurance prevents undetected database manipulation
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: '#0b1329', padding: 18, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                1. Continuous SHA-256 Hashing
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Every financial operation generates a cryptographic digest linking the current payload with the previous block's hash. Any modification anywhere in the chain invalidates every subsequent block.
              </p>
            </div>

            <div style={{ background: '#0b1329', padding: 18, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                2. Real-Time Tamper Detection
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                The automated audit engine recalculates digests on a schedule and on-demand. When an unauthorized change occurs, the discrepancy is immediately flagged with block index precision.
              </p>
            </div>

            <div style={{ background: '#0b1329', padding: 18, borderRadius: 10 }}>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                3. Audit Alert &amp; Forensic Remediation
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Upon detecting an anomaly, the system automatically spawns a CRITICAL severity Audit Alert that can only be resolved by authorized compliance/auditor roles with documented resolution notes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
