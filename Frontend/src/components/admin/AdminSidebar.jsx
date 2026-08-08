import {
  FaHome,
  FaUserCog,
  FaUserFriends,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";

import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      {/* =========================
          Logo
      ========================= */}

      <div className="admin-sidebar-header">

        <div className="admin-logo-circle">
          <FaUniversity />
        </div>

        <div>
          <h2>FinCore</h2>
          <span>Digital Banking</span>
        </div>

      </div>


      {/* =========================
          Navigation
      ========================= */}

      <ul className="admin-menu">

        <li className="active">
          <FaHome />
          <span>Dashboard</span>
        </li>

        <li>
          <FaUserCog />
          <span>Employee Management</span>
        </li>

        <li>
          <FaUserFriends />
          <span>User Management</span>
        </li>

        <li>
          <FaUserShield />
          <span>Role Management</span>
        </li>

        <li>
          <FaClipboardList />
          <span>Audit Logs</span>
        </li>

        <li>
          <FaChartBar />
          <span>Reports</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>

        <li>
          <FaUserCircle />
          <span>Profile</span>
        </li>

      </ul>


      {/* =========================
          Logout
      ========================= */}

      <button className="admin-logout">

        <FaSignOutAlt />

        <span>Logout</span>

      </button>

    </aside>
  );
}

export default AdminSidebar;