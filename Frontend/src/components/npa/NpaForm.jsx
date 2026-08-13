import { useState } from "react";
import {
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaPercent,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import "./NpaForm.css";

function NpaForm({ onClassify, loading = false }) {

  const [formData, setFormData] = useState({
    customerName: "",
    loanAmount: "",
    outstandingAmount: "",
    overdueDays: "",
    interestRate: "",
    loanType: "Term Loan",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onClassify(formData);
  };

  const handleReset = () => {
    setFormData({
      customerName: "",
      loanAmount: "",
      outstandingAmount: "",
      overdueDays: "",
      interestRate: "",
      loanType: "Term Loan",
    });
  };

  return (
    <div className="npa-form-card">

      <div className="npa-form-header">
        <div>
          <h2>Loan Classification</h2>

          <p>
            Enter loan details to determine the NPA classification.
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit}>

        <div className="npa-form-grid">

          {/* Customer Name */}

          <div className="npa-form-group">

            <label>
              <FaUser />
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />

          </div>


          {/* Loan Type */}

          <div className="npa-form-group">

            <label>
              <FaFileInvoiceDollar />
              Loan Type
            </label>

            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
            >
              <option value="Term Loan">Term Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
            </select>

          </div>


          {/* Loan Amount */}

          <div className="npa-form-group">

            <label>
              <FaMoneyBillWave />
              Loan Amount
            </label>

            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              min="0"
              required
            />

          </div>


          {/* Outstanding Amount */}

          <div className="npa-form-group">

            <label>
              <FaMoneyBillWave />
              Outstanding Amount
            </label>

            <input
              type="number"
              name="outstandingAmount"
              value={formData.outstandingAmount}
              onChange={handleChange}
              placeholder="Enter outstanding amount"
              min="0"
              required
            />

          </div>


          {/* Overdue Days */}

          <div className="npa-form-group">

            <label>
              <FaCalendarAlt />
              Overdue Days
            </label>

            <input
              type="number"
              name="overdueDays"
              value={formData.overdueDays}
              onChange={handleChange}
              placeholder="Enter overdue days"
              min="0"
              required
            />

            <small>
              Number of days the payment has been overdue.
            </small>

          </div>


          {/* Interest Rate */}

          <div className="npa-form-group">

            <label>
              <FaPercent />
              Interest Rate
            </label>

            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              placeholder="Enter interest rate"
              min="0"
              step="0.01"
              required
            />

          </div>

        </div>


        {/* Actions */}

        <div className="npa-form-actions">

          <button
            type="button"
            className="npa-reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>

          <button
            type="submit"
            className="npa-classify-btn"
            disabled={loading}
          >
            {loading ? "Classifying..." : "Classify Loan"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default NpaForm;