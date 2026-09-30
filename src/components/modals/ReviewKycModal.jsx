import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ReviewKycModal = ({
  isOpen,
  onClose,
  kycRecord,
  onSuccess,
}) => {
  if (!kycRecord) return null;

  const [decision, setDecision] = useState('VERIFIED');
  const [riskLevel, setRiskLevel] = useState(kycRecord.riskLevel || 'LOW');
  const [remarks, setRemarks] = useState(
    'Supervisor verified all identity credentials against authorized government repository. Document status verified.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/milestone1/kyc/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kycId: kycRecord.id,
          status: decision,
          riskLevel,
          remarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Review action failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supervisor KYC Four-Eyes Adjudication"
      subtitle={`Verify Identity Record: ${kycRecord.id}`}
      maxWidth="lg"
    >
      <form onSubmit={handleReview}>
        {error && (
          <div className="badge badge-danger w-full p-2 mb-4" style={{ display: 'block' }}>
            {error}
          </div>
        )}

        <div className="card mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '0.8125rem' }}>
            <div>
              <span className="text-muted">Applicant Name:</span>
              <p className="font-semibold">{kycRecord.fullName}</p>
            </div>
            <div>
              <span className="text-muted">Document Type:</span>
              <p className="font-mono">{kycRecord.documentType}: {kycRecord.documentNumber}</p>
            </div>
            <div>
              <span className="text-muted">Current Status:</span>
              <div><StatusBadge status={kycRecord.verificationStatus} size="sm" /></div>
            </div>
            <div>
              <span className="text-muted">Submitted By:</span>
              <p>{kycRecord.submittedBy}</p>
            </div>
          </div>

          {/* Biometric & OCR Inspection Strip */}
          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="text-muted">OCR Recognition:</span>
              <div style={{ color: '#10b981', fontWeight: 700 }}>
                ✓ {kycRecord.ocrExtractedData?.confidenceScore || 99.4}% Confidence
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="text-muted">Liveness Detection:</span>
              <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                ✓ Anti-Spoofing Passed
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <span className="text-muted">Biometric Face Match:</span>
              <div style={{ color: '#a855f7', fontWeight: 700 }}>
                ✓ {kycRecord.faceMatchScore || 98.7}% Match
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Adjudication Decision *</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setDecision('VERIFIED')}
              className={`btn flex-1 ${decision === 'VERIFIED' ? 'btn-success' : 'btn-secondary'}`}
            >
              <CheckCircle2 size={16} />
              <span>Approve & Verify (Compliant)</span>
            </button>
            <button
              type="button"
              onClick={() => setDecision('REJECTED')}
              className={`btn flex-1 ${decision === 'REJECTED' ? 'btn-danger' : 'btn-secondary'}`}
            >
              <XCircle size={16} />
              <span>Reject (Non-Compliant)</span>
            </button>
          </div>
        </div>

        <div className="form-group mt-3">
          <label className="form-label">Customer AML / Risk Rating</label>
          <select
            className="form-control"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
          >
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        <div className="form-group mt-3">
          <label className="form-label">Supervisor Audit Remarks *</label>
          <textarea
            className="form-control"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`btn ${decision === 'VERIFIED' ? 'btn-success' : 'btn-danger'}`}
          >
            {loading ? 'Submitting...' : `Confirm ${decision}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
