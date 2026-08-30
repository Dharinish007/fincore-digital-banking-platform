import {
  FaHome,
  FaUsers,
  FaIdCard,
  FaMoneyCheckAlt,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaUniversity,
  FaExchangeAlt,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./ManagerSidebar.css";

function ManagerSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="manager-sidebar">

      {/* Logo */}

      <div className="manager-sidebar-logo">

        <FaUniversity className="manager-logo-icon" />

        <h2>FinCore</h2>

        <p>Manager Portal</p>

      </div>

      {/* Navigation */}

      <ul>

        <li
          className="active"
          onClick={() => navigate("/manager/dashboard")}
        >
          <FaHome />
          Dashboard
        </li>

        <li
          onClick={() => navigate("/customer-management")}
        >
          <FaUsers />
          Customer Management
        </li>

        <li
          onClick={() => navigate("/kyc-verification")}
        >
          <FaIdCard />
          KYC Verification
        </li>

        <li
          onClick={() => navigate("/loan-approval")}
        >
          <FaMoneyCheckAlt />
          Loan Approval
        </li>

        <li
          onClick={() => navigate("/transaction-monitoring")}
        >
          <FaExchangeAlt />
          Transaction Monitoring
        </li>

        {/* Settlement Confirmation */}

        <li
          onClick={() => navigate("/settlement-confirmation")}
        >
          <FaCheckCircle />
          Settlement Confirmation
        </li>

      <li
        onClick={() => navigate("/risk-scoring")}
      >
        <FaShieldAlt />
        Risk Scoring
      </li>

        <li
          onClick={() => navigate("/reports")}
        >
          <FaChartBar />
          Reports
        </li>

        <li
          onClick={() => navigate("/profile")}
        >
          <FaUser />
          Profile
        </li>

      </ul>

      {/* Logout */}

      <button className="manager-logout-btn">

        <FaSignOutAlt />

        Logout

      </button>

    </aside>
  );
}

export default ManagerSidebar;