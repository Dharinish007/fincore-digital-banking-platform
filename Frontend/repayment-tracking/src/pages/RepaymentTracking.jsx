import { useState } from "react";
import "../styles/RepaymentTracking.css";

// Installment schedules for different customers
const ARUN_INSTALLMENT_1_DETAILS = [
  { no: 1, dueDate: "15-06-2025", amountDue: "₹2,307.25", amountPaid: "₹2,307.25", paymentDate: "14-06-2025", status: "PAID", remaining: "₹0.00" }
];

const ARUN_INSTALLMENT_2_DETAILS = [
  { no: 1, dueDate: "15-06-2025", amountDue: "₹2,307.25", amountPaid: "₹2,307.25", paymentDate: "14-06-2025", status: "PAID", remaining: "₹0.00" },
  { no: 2, dueDate: "15-07-2025", amountDue: "₹2,307.25", amountPaid: "₹2,307.25", paymentDate: "15-07-2025", status: "PAID", remaining: "₹0.00" }
];

const ARUN_INSTALLMENT_3_DETAILS = [
  { no: 1, dueDate: "15-06-2025", amountDue: "₹2,307.25", amountPaid: "₹2,307.25", paymentDate: "14-06-2025", status: "PAID", remaining: "₹0.00" },
  { no: 2, dueDate: "15-07-2025", amountDue: "₹2,307.25", amountPaid: "₹2,307.25", paymentDate: "15-07-2025", status: "PAID", remaining: "₹0.00" },
  { no: 3, dueDate: "15-08-2025", amountDue: "₹2,307.25", amountPaid: "₹1,000.00", paymentDate: "10-08-2025", status: "PARTIAL", remaining: "₹1,307.25" }
];

const RAVI_INSTALLMENTS = [
  { no: 1, dueDate: "20-06-2025", amountDue: "₹3,150.00", amountPaid: "₹0.00", paymentDate: "-", status: "OVERDUE", remaining: "₹3,150.00" },
  { no: 2, dueDate: "20-07-2025", amountDue: "₹3,150.00", amountPaid: "₹0.00", paymentDate: "-", status: "PENDING", remaining: "₹3,150.00" }
];

// Added multiple installments for Sneha R
const SNEHA_INSTALLMENTS = [
  { no: 1, dueDate: "18-06-2025", amountDue: "₹1,850.00", amountPaid: "₹1,850.00", paymentDate: "18-06-2025", status: "PAID", remaining: "₹0.00" },
  { no: 2, dueDate: "18-07-2025", amountDue: "₹1,850.00", amountPaid: "₹1,850.00", paymentDate: "17-07-2025", status: "PAID", remaining: "₹0.00" },
  { no: 3, dueDate: "18-08-2025", amountDue: "₹1,850.00", amountPaid: "₹0.00", paymentDate: "-", status: "PENDING", remaining: "₹1,850.00" },
  { no: 4, dueDate: "18-09-2025", amountDue: "₹1,850.00", amountPaid: "₹0.00", paymentDate: "-", status: "PENDING", remaining: "₹1,850.00" }
];

const REPAYMENT_RECORDS = [
  {
    loanId: "LN001",
    customerName: "Arun Kumar",
    installmentNo: 1,
    dueDate: "15-06-2025",
    amountDue: "₹2,307.25",
    amountPaid: "₹2,307.25",
    paymentDate: "14-06-2025",
    status: "PAID",
    remainingAmount: "₹0.00",
    details: {
      loanAmount: "₹50,000.00",
      interestRate: "10%",
      tenure: "24",
      emiAmount: "₹2,307.25",
      totalAmount: "₹55,373.91",
      installments: ARUN_INSTALLMENT_1_DETAILS
    }
  },
  {
    loanId: "LN001",
    customerName: "Arun Kumar",
    installmentNo: 2,
    dueDate: "15-07-2025",
    amountDue: "₹2,307.25",
    amountPaid: "₹2,307.25",
    paymentDate: "15-07-2025",
    status: "PAID",
    remainingAmount: "₹0.00",
    details: {
      loanAmount: "₹50,000.00",
      interestRate: "10%",
      tenure: "24",
      emiAmount: "₹2,307.25",
      totalAmount: "₹55,373.91",
      installments: ARUN_INSTALLMENT_2_DETAILS
    }
  },
  {
    loanId: "LN001",
    customerName: "Arun Kumar",
    installmentNo: 3,
    dueDate: "15-08-2025",
    amountDue: "₹2,307.25",
    amountPaid: "₹1,000.00",
    paymentDate: "10-08-2025",
    status: "PARTIAL",
    remainingAmount: "₹1,307.25",
    details: {
      loanAmount: "₹50,000.00",
      interestRate: "10%",
      tenure: "24",
      emiAmount: "₹2,307.25",
      totalAmount: "₹55,373.91",
      installments: ARUN_INSTALLMENT_3_DETAILS
    }
  },
  {
    loanId: "LN002",
    customerName: "Ravi Kumar",
    installmentNo: 1,
    dueDate: "20-06-2025",
    amountDue: "₹3,150.00",
    amountPaid: "₹0.00",
    paymentDate: "-",
    status: "OVERDUE",
    remainingAmount: "₹3,150.00",
    details: {
      loanAmount: "₹60,000.00",
      interestRate: "10%",
      tenure: "24",
      emiAmount: "₹3,150.00",
      totalAmount: "₹75,600.00",
      installments: RAVI_INSTALLMENTS
    }
  },
  {
    loanId: "LN003",
    customerName: "Sneha R",
    installmentNo: 1,
    dueDate: "18-06-2025",
    amountDue: "₹1,850.00",
    amountPaid: "₹1,850.00",
    paymentDate: "18-06-2025",
    status: "PAID",
    remainingAmount: "₹0.00",
    details: {
      loanAmount: "₹40,000.00",
      interestRate: "10%",
      tenure: "24",
      emiAmount: "₹1,850.00",
      totalAmount: "₹44,400.00",
      installments: SNEHA_INSTALLMENTS
    }
  }
];

function RepaymentTracking() {
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const handleExport = () => {
  const csvData = [
    ["Loan ID", "Customer Name", "Installment No.", "Due Date", "Amount Due", "Amount Paid", "Payment Date", "Status", "Remaining Amount"],
    ["LN001", "Arun Kumar", "1", "15-06-2025", "₹2,307.25", "₹2,307.25", "14-06-2025", "PAID", "₹0.00"],
    ["LN001", "Arun Kumar", "2", "15-07-2025", "₹2,307.25", "₹2,307.25", "15-07-2025", "PAID", "₹0.00"],
    ["LN001", "Arun Kumar", "3", "15-08-2025", "₹2,307.25", "₹1,000.00", "10-08-2025", "PARTIAL", "₹1,307.25"],
    ["LN002", "Ravi Kumar", "1", "20-06-2025", "₹3,150.00", "₹0.00", "-", "OVERDUE", "₹3,150.00"],
    ["LN003", "Sneha R", "1", "18-06-2025", "₹1,850.00", "₹1,850.00", "18-06-2025", "PAID", "₹0.00"]
  ];

  const csv = csvData
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "repayment-records.csv";
  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <div className="repayment-page">
      <h1>Repayment Tracking</h1>
      <p>Track and manage loan repayments</p>

      <div className="dashboard-cards">
        <div className="card">
          <img className="card-image" src="../src/assets/wallet.png" alt="Total Due" />
          <h3>Total Due</h3>
          <p>₹50,000</p>
        </div>

        <div className="card">
          <img className="card-image" src="../src/assets/success.png" alt="Total Paid" />
          <h3>Total Paid</h3>
          <p>₹30,000</p>
        </div>

        <div className="card">
          <img className="card-image" src="../src/assets/pending.png" alt="Pending" />
          <h3>Pending</h3>
          <p>₹10,000</p>
        </div>

        <div className="card">
          <img className="card-image" src="../src/assets/overdue.png" alt="Over Due" />
          <h3>Over Due</h3>
          <p>₹10,000</p>
        </div>
      </div>

      <div className="search-section">
        <input type="text"  placeholder="Search by Customer Name or Loan ID" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option>All Status</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Pending</option>
            <option>Overdue</option>
         </select>

        <button className="export-button" onClick={handleExport}>Export</button>
      </div>

      <h2 className="records-title">Repayment Records</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer Name</th>
              <th>Installment No.</th>
              <th>Due Date</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Remaining Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
 {REPAYMENT_RECORDS
  .filter((record) =>
    (
      record.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (
      selectedStatus === "All Status" ||
      record.status.toLowerCase() === selectedStatus.toLowerCase()
    )
  )
    .map((record, index) => (
      <tr key={index}>
        <td>{record.loanId}</td>
        <td>{record.customerName}</td>
        <td>{record.installmentNo}</td>
        <td>{record.dueDate}</td>
        <td>{record.amountDue}</td>
        <td>{record.amountPaid}</td>
        <td>{record.paymentDate}</td>
        <td>
          <span className={`status ${record.status.toLowerCase()}`}>
            {record.status}
          </span>
        </td>
        <td>{record.remainingAmount}</td>
        <td>
          <button
            className="view-button"
            onClick={() =>
              setSelectedRepayment({
                loanId: record.loanId,
                customerName: record.customerName,
                ...record.details
              })
            }
          >
            View Details
          </button>
        </td>
      </tr>
    ))}
</tbody>
        </table>
      </div>

      <div>
        {selectedRepayment && (
          <div className="repayment-details">
            <h2>Repayment Details</h2>

            <div className="details-content">
              <div className="loan-information">
                <p>
                  <strong>Loan ID:</strong> {selectedRepayment.loanId}
                </p>
                <p>
                  <strong>Customer Name:</strong> {selectedRepayment.customerName}
                </p>
                <p>
                  <strong>Loan Amount:</strong> {selectedRepayment.loanAmount}
                </p>
                <p>
                  <strong>Interest Rate:</strong> {selectedRepayment.interestRate}
                </p>
                <p>
                  <strong>Tenure:</strong> {selectedRepayment.tenure} Months
                </p>
                <p>
                  <strong>EMI Amount:</strong> {selectedRepayment.emiAmount}
                </p>
                <p>
                  <strong>Total Amount:</strong> {selectedRepayment.totalAmount}
                </p>
              </div>

              <div className="installment-details">
                <h3>Installment Details</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Installment No.</th>
                      <th>Due Date</th>
                      <th>Amount Due</th>
                      <th>Amount Paid</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                      <th>Remaining Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRepayment.installments &&
                      selectedRepayment.installments.map((installment) => (
                        <tr key={installment.no}>
                          <td>{installment.no}</td>
                          <td>{installment.dueDate}</td>
                          <td>{installment.amountDue}</td>
                          <td>{installment.amountPaid}</td>
                          <td>{installment.paymentDate}</td>
                          <td>
                            <span
                              className={`status ${installment.status.toLowerCase()}`}
                            >
                              {installment.status}
                            </span>
                          </td>
                          <td>{installment.remaining}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RepaymentTracking;