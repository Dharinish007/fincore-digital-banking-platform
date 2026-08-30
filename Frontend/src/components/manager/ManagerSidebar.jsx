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
} from "react-icons/fa";

import "./ManagerSidebar.css";

function ManagerSidebar() {
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

        <li className="active">
          <FaHome />
          Dashboard
        </li>

        <li>
          <FaUsers />
          Customer Management
        </li>

        <li>
          <FaIdCard />
          KYC Verification
        </li>

        <li>
          <FaMoneyCheckAlt />
          Loan Approval
        </li>

        <li>
          <FaExchangeAlt />
          Transaction Monitoring
        </li>

        <li>
          <FaChartBar />
          Reports
        </li>

        <li>
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