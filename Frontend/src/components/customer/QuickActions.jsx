import React from "react";
import {
  FaExchangeAlt,
  FaFileInvoice,
  FaMoneyBillWave,
  FaUpload,
} from "react-icons/fa";

import "./QuickActions.css";

function QuickActions() {
  return (
    <div className="quick-actions">

      <h3>Quick Actions</h3>

      <div className="actions-grid">

        <button>
          <FaExchangeAlt />
          Transfer
        </button>

        <button>
          <FaMoneyBillWave />
          Pay Bills
        </button>

        <button>
          <FaFileInvoice />
          Statement
        </button>

        <button>
          <FaUpload />
          Upload KYC
        </button>

      </div>

    </div>
  );
}

export default QuickActions;