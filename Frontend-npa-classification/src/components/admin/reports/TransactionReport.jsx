import "./TransactionReport.css";

function TransactionReport() {

  const transactions = [
    {
      id: "TXN001",
      customer: "Rahul Sharma",
      type: "Deposit",
      account: "Savings",
      amount: "₹50,000",
      date: "08 Aug 2026",
      status: "Success",
    },
    {
      id: "TXN002",
      customer: "Priya Patil",
      type: "Withdrawal",
      account: "Current",
      amount: "₹12,000",
      date: "08 Aug 2026",
      status: "Success",
    },
    {
      id: "TXN003",
      customer: "Amit Kumar",
      type: "Transfer",
      account: "Savings",
      amount: "₹8,500",
      date: "07 Aug 2026",
      status: "Pending",
    },
    {
      id: "TXN004",
      customer: "Sneha Joshi",
      type: "Deposit",
      account: "Savings",
      amount: "₹25,000",
      date: "07 Aug 2026",
      status: "Success",
    },
    {
      id: "TXN005",
      customer: "Rohan Patil",
      type: "Withdrawal",
      account: "Current",
      amount: "₹15,500",
      date: "06 Aug 2026",
      status: "Failed",
    },
  ];

  return (
    <div className="transaction-report">

      <div className="transaction-report-header">

        <div>
          <h2>Transaction Report</h2>

          <p>
            Detailed transaction activity across the banking platform.
          </p>
        </div>

        <button className="export-report-btn">
          Export Report
        </button>

      </div>


      <div className="transaction-table-wrapper">

        <table className="transaction-report-table">

          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {transactions.map((transaction) => (

              <tr key={transaction.id}>

                <td>
                  <strong className="transaction-id">
                    {transaction.id}
                  </strong>
                </td>

                <td>
                  {transaction.customer}
                </td>

                <td>
                  <span
                    className={`transaction-type ${transaction.type.toLowerCase()}`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td>
                  {transaction.account}
                </td>

                <td className="transaction-amount">
                  {transaction.amount}
                </td>

                <td>
                  {transaction.date}
                </td>

                <td>
                  <span
                    className={`transaction-status ${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TransactionReport;