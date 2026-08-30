import {
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";

const SettlementCard = ({ settlement, onView }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle size={15} />;

      case "Pending":
        return <Clock size={15} />;

      default:
        return <AlertCircle size={15} />;
    }
  };

  return (
    <tr>
      <td>
        <span className="settlement-id">
          {settlement.id}
        </span>
      </td>

      <td>
        <div className="customer-info">
          <strong>{settlement.customerName}</strong>
          <span>{settlement.accountNumber}</span>
        </div>
      </td>

      <td>
        {settlement.transactionRef}
      </td>

      <td>
        <strong className="amount-value">
          {settlement.amount}
        </strong>
      </td>

      <td>
        {settlement.settlementDate}
      </td>

      <td>
        <span
          className={`status-badge ${settlement.status.toLowerCase()}`}
        >
          {getStatusIcon(settlement.status)}
          {settlement.status}
        </span>
      </td>

      <td>
        <button
          className="view-button"
          onClick={() => onView(settlement)}
        >
          <Eye size={16} />
          View
        </button>
      </td>
    </tr>
  );
};

export default SettlementCard;