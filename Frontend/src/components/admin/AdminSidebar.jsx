import {
  FaHome,
  FaUserCog,
  FaUserFriends,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaUniversity,
  FaExclamationTriangle,
} from "react-icons/fa";

import "./AdminSidebar.css";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {

  const navigate = useNavigate();
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

      <li onClick={() => navigate("/admin/employees")}>
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

        <li onClick={() => navigate("/admin/npa-classification")}>
          <FaExclamationTriangle />
          <span>NPA Classification</span>
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