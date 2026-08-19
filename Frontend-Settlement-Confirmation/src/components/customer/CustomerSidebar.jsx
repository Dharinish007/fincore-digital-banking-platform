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
          <span>Dashboard</span>
        </li>

        <li>
          <FaWallet />
          <span>My Accounts</span>
        </li>

        <li>
          <FaExchangeAlt />
          <span>Transfer Money</span>
        </li>

        <li>
          <FaHistory />
          <span>Transactions</span>
        </li>

        <li>
          <FaIdCard />
          <span>KYC Upload</span>
        </li>

        <li>
          <FaClipboardList />
          <span>Audit Logs</span>
        </li>

        <li>
          <FaUser />
          <span>Profile</span>
        </li>

      </ul>


      {/* Logout */}

      <button className="logout-btn">

        <FaSignOutAlt />

        <span>Logout</span>

      </button>

    </aside>
  );
}

export default CustomerSidebar;