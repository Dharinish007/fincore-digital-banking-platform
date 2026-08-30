import {
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import "./ReportSummary.css";

function ReportSummary() {
  return (
    <div className="report-summary">

      <div className="report-summary-header">

        <div>
          <h2>Report Summary</h2>

          <p>
            Overview of banking operations for the selected period.
          </p>
        </div>

        <span className="report-period">
          This Month
        </span>

      </div>


      <div className="report-summary-grid">

        <div className="summary-item">
          <span>Total Transactions</span>

          <strong>8,542</strong>

          <small className="summary-positive">
            <FaArrowUp /> 8.7%
          </small>
        </div>


        <div className="summary-item">
          <span>Total Deposits</span>

          <strong>₹15.8 Cr</strong>

          <small className="summary-positive">
            <FaArrowUp /> 5.4%
          </small>
        </div>


        <div className="summary-item">
          <span>Total Withdrawals</span>

          <strong>₹8.4 Cr</strong>

          <small className="summary-negative">
            <FaArrowDown /> 2.1%
          </small>
        </div>


        <div className="summary-item">
          <span>NPA Accounts</span>

          <strong>86</strong>

          <small className="summary-negative">
            <FaArrowUp /> 1.8%
          </small>
        </div>

      </div>

    </div>
  );
}

export default ReportSummary;