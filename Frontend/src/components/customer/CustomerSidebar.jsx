import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaHistory,
  FaIdCard,
  FaUser,
  FaSignOutAlt,
  FaUniversity,
  FaClipboardList,
} from "react-icons/fa";

import "./CustomerSidebar.css";

function CustomerSidebar() {
  return (
    <aside className="customer-sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <FaUniversity className="logo-icon" />

        <h2>FinCore</h2>

        <p>Digital Banking</p>

      </div>

      {/* Navigation */}

      <ul>

        <li className="active">
          <FaHome />
          Dashboard
        </li>

        <li>
          <FaWallet />
          My Accounts
        </li>

        <li>
          <FaExchangeAlt />
          Transfer Money
        </li>

        <li>
          <FaHistory />
          Transactions
        </li>

        <li>
          <FaIdCard />
          KYC Upload
        </li>

        <li>
          <FaClipboardList />
          Audit Logs
        </li>

        <li>
          <FaUser />
          Profile
        </li>

      </ul>

      {/* Logout */}

      <button className="logout-btn">

        <FaSignOutAlt />

        Logout

      </button>

    </aside>
  );
}

export default CustomerSidebar;