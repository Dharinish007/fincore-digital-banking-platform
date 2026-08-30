
import {
  CheckCircle,
  X,
  Clock,
} from "lucide-react";

const SettlementDetails = ({
  settlement,
  onClose,
  onConfirm,
}) => {
  if (!settlement) {
    return null;
  }

  return (
    <div className="settlement-overlay">

      <div className="settlement-modal">

        {/* Header */}

        <div className="modal-header">

          <div>
            <h2>Settlement Details</h2>

            <p>
              {settlement.id}
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>

        {/* Details */}

        <div className="settlement-details">

          <div className="detail-item">
            <span>Customer Name</span>

            <strong>
              {settlement.customerName}
            </strong>
          </div>

          <div className="detail-item">
            <span>Account Number</span>

            <strong>
              {settlement.accountNumber}
            </strong>
          </div>

          <div className="detail-item">
            <span>Transaction Reference</span>

            <strong>
              {settlement.transactionRef}
            </strong>
          </div>

          <div className="detail-item">
            <span>Transaction Count</span>

            <strong>
              {settlement.transactionCount}
            </strong>
          </div>

          <div className="detail-item">
            <span>Settlement Date</span>

            <strong>
              {settlement.settlementDate}
            </strong>
          </div>

          <div className="detail-item">
            <span>Settlement Amount</span>

            <strong className="detail-amount">
              {settlement.amount}
            </strong>
          </div>

          <div className="detail-item">

            <span>Status</span>

            <span
              className={`status-badge ${settlement.status.toLowerCase()}`}
            >
              {settlement.status === "Confirmed" ? (
                <CheckCircle size={15} />
              ) : (
                <Clock size={15} />
              )}

              {settlement.status}
            </span>

          </div>

        </div>

        {/* Actions */}

        {settlement.status === "Pending" && (

          <div className="modal-actions">

            <button
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="confirm-button"
              onClick={() => onConfirm(settlement)}
            >
              <CheckCircle size={17} />
              Confirm Settlement
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default SettlementDetails;