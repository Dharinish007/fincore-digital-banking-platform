import "./LoanRequests.css";

function LoanRequests() {

  const loans = [
    {
      name: "Sneha Joshi",
      type: "Home Loan",
      amount: "₹25,00,000",
    },
    {
      name: "Vikram Patil",
      type: "Personal Loan",
      amount: "₹5,00,000",
    },
    {
      name: "Neha Shah",
      type: "Education Loan",
      amount: "₹8,00,000",
    },
  ];

  return (
    <div className="loan-requests">

      <div className="loan-header">

        <h3>Loan Requests</h3>

        <button>View All</button>

      </div>

      {loans.map((loan, index) => (

        <div className="loan-row" key={index}>

          <div>
            <strong>{loan.name}</strong>
            <span>{loan.type}</span>
          </div>

          <div className="loan-amount">
            {loan.amount}
          </div>

          <button className="loan-review">
            Review
          </button>

        </div>

      ))}

    </div>
  );
}

export default LoanRequests;