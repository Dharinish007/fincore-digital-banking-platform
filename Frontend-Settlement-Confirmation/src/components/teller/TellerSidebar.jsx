import {
  FaHome,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaExchangeAlt,
  FaUsers,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";

import "./TellerSidebar.css";

function TellerSidebar() {
  return (
    <aside className="teller-sidebar">

      {/* Logo */}

      <div className="teller-sidebar-logo">

        <FaUniversity className="teller-logo-icon" />

        <h2>FinCore</h2>

        <p>Teller Portal</p>

      </div>

      {/* Navigation */}

      <ul>

        <li className="active">
          <FaHome />
          Dashboard
        </li>

        <li>
          <FaMoneyBillWave />
          Cash Deposit
        </li>

        <li>
          <FaMoneyCheckAlt />
          Cash Withdrawal
        </li>

        <li>
          <FaExchangeAlt />
          Fund Transfer
        </li>

        <li>
          <FaUsers />
          Customer Accounts
        </li>

        <li>
          <FaHistory />
          Transactions
        </li>

        <li>
          <FaUser />
          Profile
        </li>

      </ul>

      {/* Logout */}

      <button className="teller-logout-btn">

        <FaSignOutAlt />

        Logout

      </button>

    </aside>
  );
}

export default TellerSidebar;