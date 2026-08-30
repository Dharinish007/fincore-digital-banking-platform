import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";

import "./NpaResult.css";

function NpaResult({ result }) {

  if (!result) {
    return (
      <div className="npa-result-empty">

        <FaShieldAlt />

        <h3>No Classification Available</h3>

        <p>
          Submit the loan details to view the NPA classification result.
        </p>

      </div>
    );
  }

  const getStatusIcon = () => {

    if (result.status === "STANDARD") {
      return <FaCheckCircle />;
    }

    if (result.status === "DOUBTFUL") {
      return <FaExclamationTriangle />;
    }

    return <FaTimesCircle />;
  };

  return (
    <div className={`npa-result-card ${result.status?.toLowerCase()}`}>

      <div className="npa-result-header">

        <div>
          <span>Classification Result</span>

          <h2>
            {result.classification}
          </h2>
        </div>

        <div className="npa-result-icon">
          {getStatusIcon()}
        </div>

      </div>


      <div className="npa-result-status">

        <span className="npa-status-label">
          Status
        </span>

        <strong>
          {result.status}
        </strong>

      </div>


      <div className="npa-result-details">

        <div className="npa-detail-item">
          <span>Overdue Days</span>
          <strong>{result.overdueDays} Days</strong>
        </div>

        <div className="npa-detail-item">
          <span>Risk Level</span>
          <strong>{result.riskLevel}</strong>
        </div>

        <div className="npa-detail-item">
          <span>Outstanding Amount</span>
          <strong>{result.outstandingAmount}</strong>
        </div>

      </div>


      <div className="npa-result-message">

        <strong>Assessment</strong>

        <p>
          {result.message}
        </p>

      </div>

    </div>
  );
}

export default NpaResult;