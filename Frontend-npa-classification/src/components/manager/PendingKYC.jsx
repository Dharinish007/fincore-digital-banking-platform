import "./PendingKYC.css";

function PendingKYC() {

  const requests = [
    {
      name: "Rahul Sharma",
      document: "Aadhaar",
      status: "Pending",
    },
    {
      name: "Priya Patil",
      document: "PAN",
      status: "Pending",
    },
    {
      name: "Amit Kumar",
      document: "Aadhaar + PAN",
      status: "Pending",
    },
  ];

  return (
    <div className="pending-kyc">

      <div className="kyc-header">

        <h3>Pending KYC Verification</h3>

        <button>View All</button>

      </div>

      <div className="kyc-table">

        {requests.map((request, index) => (

          <div className="kyc-row" key={index}>

            <div>
              <strong>{request.name}</strong>
              <span>{request.document}</span>
            </div>

            <span className="kyc-status">
              {request.status}
            </span>

            <button className="verify-btn">
              Verify
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PendingKYC;