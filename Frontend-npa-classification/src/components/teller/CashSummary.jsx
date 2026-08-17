import {
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

import "./CashSummary.css";

function CashSummary() {
  return (
    <div className="cash-summary">

      <div className="cash-summary-header">

        <h3>Cash Summary</h3>

        <FaMoneyBillWave />

      </div>

      <div className="cash-item">

        <div className="cash-item-icon opening">
          <FaMoneyBillWave />
        </div>

        <div>
          <span>Opening Cash</span>
          <strong>₹20,00,000</strong>
        </div>

      </div>

      <div className="cash-item">

        <div className="cash-item-icon deposit">
          <FaArrowDown />
        </div>

        <div>
          <span>Today's Deposits</span>
          <strong>₹12,50,000</strong>
        </div>

      </div>

      <div className="cash-item">

        <div className="cash-item-icon withdrawal">
          <FaArrowUp />
        </div>

        <div>
          <span>Today's Withdrawals</span>
          <strong>₹8,20,000</strong>
        </div>

      </div>

      <div className="cash-total">

        <span>Available Cash</span>

        <strong>₹24,30,000</strong>

      </div>

    </div>
  );
}

export default CashSummary;