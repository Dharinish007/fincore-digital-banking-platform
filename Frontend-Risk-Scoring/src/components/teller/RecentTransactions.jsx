import "./RecentTransactions.css";

function RecentTransactions() {

  const transactions = [
    {
      customer: "Rahul Sharma",
      type: "Cash Deposit",
      amount: "₹50,000",
      status: "Completed",
    },
    {
      customer: "Priya Patil",
      type: "Cash Withdrawal",
      amount: "₹20,000",
      status: "Completed",
    },
    {
      customer: "Amit Kumar",
      type: "Fund Transfer",
      amount: "₹15,000",
      status: "Pending",
    },
    {
      customer: "Sneha Joshi",
      type: "Cash Deposit",
      amount: "₹35,000",
      status: "Completed",
    },
  ];

  return (
    <div className="teller-transactions">

      <div className="teller-table-header">

        <h3>Recent Transactions</h3>

        <button>
          View All
        </button>

      </div>

      <div className="teller-table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Customer</th>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {transactions.map((transaction, index) => (

              <tr key={index}>

                <td>
                  {transaction.customer}
                </td>

                <td>
                  {transaction.type}
                </td>

                <td className="transaction-amount">
                  {transaction.amount}
                </td>

                <td>

                  <span
                    className={
                      transaction.status === "Pending"
                        ? "transaction-status pending"
                        : "transaction-status completed"
                    }
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

export default RecentTransactions;