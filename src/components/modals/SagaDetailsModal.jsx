import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const SagaDetailsModal = ({
  isOpen,
  onClose,
  saga,
  onRetry,
}) => {
  if (!saga) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saga Orchestration Timeline & Compensation Log"
      subtitle={`Instance: ${saga.id} • Type: ${saga.sagaType} • Idempotency: ${saga.idempotencyKey}`}
      maxWidth="3xl"
    >
      <div>
        {/* Status Summary Banner */}
        <div className="card mb-4" style={{ backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{saga.sagaType} SAGA</span>
              <StatusBadge status={saga.status} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Customer: <strong style={{ color: 'var(--text-primary)' }}>{saga.customerName}</strong> • Amount:{' '}
              <strong className="font-mono" style={{ color: 'var(--success)' }}>₹{saga.amount?.toLocaleString()}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Progress</span>
              <span className="font-mono font-bold">{saga.currentStep} / {saga.totalSteps} Steps</span>
            </div>
            {saga.status === 'FAILED' && onRetry && (
              <button
                onClick={() => onRetry(saga.id)}
                className="btn btn-primary btn-sm"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Step Execution List */}
        <h5 className="font-semibold mb-3" style={{ fontSize: '0.875rem' }}>Execution Timeline & State Machine</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {saga.steps?.map((step) => (
            <div
              key={step.stepNumber}
              className="card"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: step.status === 'COMPLETED' ? 'var(--bg-secondary)' : step.status === 'FAILED' ? 'var(--danger-bg)' : 'var(--bg-card)',
                borderColor: step.status === 'COMPLETED' ? 'var(--border-color)' : step.status === 'FAILED' ? 'var(--danger-border)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: step.status === 'COMPLETED' ? 'var(--success-bg)' : step.status === 'FAILED' ? 'var(--danger)' : 'var(--bg-primary)',
                  color: step.status === 'COMPLETED' ? 'var(--success)' : '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 'bold'
                }}>
                  {step.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : step.status === 'FAILED' ? <XCircle size={14} /> : step.stepNumber}
                </div>
                <div>
                  <p className="font-semibold" style={{ fontSize: '0.8125rem' }}>{step.stepName}</p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Action: {step.action}</p>
                </div>
              </div>

              <div>
                <StatusBadge status={step.status} size="sm" />
              </div>
            </div>
          ))}
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
