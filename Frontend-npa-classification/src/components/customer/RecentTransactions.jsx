import React from "react";
import "./RecentTransactions.css";

const transactions = [
  {
    id: 1,
    date: "03 Aug 2026",
    description: "Salary Credit",
    amount: "+ ₹45,000",
    status: "Completed",
  },
  {
    id: 2,
    date: "02 Aug 2026",
    description: "Electricity Bill",
    amount: "- ₹1,250",
    status: "Completed",
  },
  {
    id: 3,
    date: "01 Aug 2026",
    description: "UPI Transfer",
    amount: "- ₹500",
    status: "Completed",
  },
  {
    id: 4,
    date: "30 Jul 2026",
    description: "ATM Withdrawal",
    amount: "- ₹5,000",
    status: "Completed",
  },
];

function RecentTransactions() {
  return (
    <div className="transactions-card">

      <div className="table-header">

        <h3>Recent Transactions</h3>

        <button>View All</button>

      </div>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Description</th>

            <th>Amount</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item) => (

            <tr key={item.id}>

              <td>{item.date}</td>

              <td>{item.description}</td>

              <td>{item.amount}</td>

              <td>

                <span className="status">
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentTransactions;