import { CheckCircle } from "lucide-react";

const SettlementConfirmModal = ({
  settlement,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!settlement) {
    return null;
  }

  return (
    <div className="settlement-overlay">

      <div className="confirm-modal">

        <div className="confirm-icon">
          <CheckCircle size={30} />
        </div>

        <h2>
          Confirm Settlement?
        </h2>

        <p>
          Are you sure you want to confirm settlement{" "}
          <strong>{settlement.id}</strong>?
          This action may not be reversible.
        </p>

        <div className="confirm-actions">

          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="confirm-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              "Confirming..."
            ) : (
              <>
                <CheckCircle size={17} />
                Yes, Confirm
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};

export default SettlementConfirmModal;