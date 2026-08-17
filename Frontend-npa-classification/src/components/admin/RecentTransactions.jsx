import "./RecentTransactions.css";

function RecentTransactions() {
  return (
    <section className="recent-transactions">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="transactions-header">

        <div>
          <h2>Recent Transactions</h2>

          <p>
            Latest transactions across the banking platform.
          </p>
        </div>

        <button className="transactions-view-btn">
          View All
        </button>

      </div>


      {/* ==========================================
          Table
      ========================================== */}

      <div className="transactions-table-wrapper">

        <table className="transactions-table">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Account Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>


          <tbody>

            {/* Transaction 1 */}

            <tr>

              <td>
                <div className="transaction-customer">

                  <div className="transaction-avatar">
                    RS
                  </div>

                  <div>
                    <strong>Rahul Sharma</strong>
                    <span>rahul@example.com</span>
                  </div>

                </div>
              </td>

              <td>Saving Account</td>

              <td className="transaction-amount">
                ₹50,000
              </td>

              <td>08 Aug 2026</td>

              <td>
                <span className="transaction-status success">
                  Success
                </span>
              </td>

            </tr>


            {/* Transaction 2 */}

            <tr>

              <td>
                <div className="transaction-customer">

                  <div className="transaction-avatar">
                    PP
                  </div>

                  <div>
                    <strong>Priya Patil</strong>
                    <span>priya@example.com</span>
                  </div>

                </div>
              </td>

              <td>Current Account</td>

              <td className="transaction-amount">
                ₹12,000
              </td>

              <td>08 Aug 2026</td>

              <td>
                <span className="transaction-status success">
                  Success
                </span>
              </td>

            </tr>


            {/* Transaction 3 */}

            <tr>

              <td>
                <div className="transaction-customer">

                  <div className="transaction-avatar">
                    AK
                  </div>

                  <div>
                    <strong>Amit Kumar</strong>
                    <span>amit@example.com</span>
                  </div>

                </div>
              </td>

              <td>Saving Account</td>

              <td className="transaction-amount">
                ₹8,500
              </td>

              <td>07 Aug 2026</td>

              <td>
                <span className="transaction-status pending">
                  Pending
                </span>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default RecentTransactions;