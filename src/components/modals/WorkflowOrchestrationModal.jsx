import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const WorkflowOrchestrationModal = ({
  isOpen,
  onClose,
  onSelectView,
}) => {
  const [running, setRunning] = useState(null);
  const [result, setResult] = useState(null);

  const runFlow = async (endpoint, milestoneName, targetView) => {
    setRunning(milestoneName);
    setResult(null);
    try {
      const res = await fetch(`/api/operations/flow/${endpoint}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResult({
          milestone: milestoneName,
          message: data.message,
          data,
        });
      }
    } catch (e) {
      setResult({
        milestone: milestoneName,
        message: `Execution failed: ${e.message}`,
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="FinCore Digital Banking: Automated Workflow Orchestrator"
      subtitle="Execute automated end-to-end operational workflows and multi-stage transaction pipelines (Spring Boot & MySQL)"
      maxWidth="3xl"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {result && (
          <div className="card" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <span className="font-bold" style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{result.milestone} Completed</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{result.message}</p>
          </div>
        )}

        {/* Milestone 1 Workflow */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
              <span className="font-bold">Milestone 1: Identity & KYC Intake Adjudication</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Simulate customer document upload (PAN/Aadhaar) and automated supervisor Four-Eyes approval
            </p>
          </div>
          <button
            onClick={() => runFlow('m1-kyc-flow', 'Milestone 1: KYC Onboarding', 'm1-kyc')}
            disabled={!!running}
            className="btn btn-primary btn-sm"
          >
            <Play size={14} />
            <span>{running === 'Milestone 1: KYC Onboarding' ? 'Executing...' : 'Run Pipeline'}</span>
          </button>
        </div>

        {/* Milestone 2 Workflow */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} style={{ color: 'var(--warning)' }} />
              <span className="font-bold">Milestone 2: Double-Entry Repayment & NPA Evaluation</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Triggers EMI collection ledger split and computes DPD-based SMA-0/1/2/NPA provisioning
            </p>
          </div>
          <button
            onClick={() => runFlow('m2-repayment-npa-flow', 'Milestone 2: Repayment & NPA', 'm2-npa')}
            disabled={!!running}
            className="btn btn-secondary btn-sm"
          >
            <Play size={14} />
            <span>{running === 'Milestone 2: Repayment & NPA' ? 'Executing...' : 'Run Pipeline'}</span>
          </button>
        </div>

        {/* Milestone 3 Workflow */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="flex items-center gap-2">
              <Zap size={18} style={{ color: 'var(--success)' }} />
              <span className="font-bold">Milestone 3: 6-Step Distributed Disbursement Saga</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Executes multi-step loan disbursement saga with automated compensating rollback triggers
            </p>
          </div>
          <button
            onClick={() => runFlow('m3-saga-disbursement-flow', 'Milestone 3: Saga Disbursement', 'm3-saga')}
            disabled={!!running}
            className="btn btn-success btn-sm"
          >
            <Play size={14} />
            <span>{running === 'Milestone 3: Saga Disbursement' ? 'Executing...' : 'Run Pipeline'}</span>
          </button>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
