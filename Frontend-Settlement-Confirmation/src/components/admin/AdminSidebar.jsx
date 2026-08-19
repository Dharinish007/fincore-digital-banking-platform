import { useNavigate, useLocation } from "react-router-dom";

import {
  FaHome,
  FaUserCog,
  FaUserFriends,
  FaUserShield,
  FaExclamationTriangle,
  FaClipboardList,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";

import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check whether the current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="admin-sidebar">

      {/* ==========================================
          Sidebar Header
      ========================================== */}

      <div className="admin-sidebar-header">

        <div className="admin-logo-circle">
          <FaUniversity />
        </div>

        <div className="admin-brand-text">
          <h2>FinCore</h2>
          <span>Digital Banking</span>
        </div>

      </div>


      {/* ==========================================
          Navigation
      ========================================== */}

      <ul className="admin-menu">

        {/* Dashboard */}

        <li
          className={
            isActive("/admin/dashboard")
              ? "active"
              : ""
          }
          onClick={() => navigate("/admin/dashboard")}
        >
          <FaHome />
          <span>Dashboard</span>
        </li>


        {/* Employee Management */}

        <li
          className={
            isActive("/admin/employees")
              ? "active"
              : ""
          }
          onClick={() => navigate("/admin/employees")}
        >
          <FaUserCog />
          <span>Employee Management</span>
        </li>


        {/* User Management */}

        <li
          className={
            isActive("/admin/users")
              ? "active"
              : ""
          }
          onClick={() => navigate("/admin/users")}
        >
          <FaUserFriends />
          <span>User Management</span>
        </li>


        {/* Role Management */}

        <li
          className={
            isActive("/admin/roles")
              ? "active"
              : ""
          }
          onClick={() => navigate("/admin/roles")}
        >
          <FaUserShield />
          <span>Role Management</span>
        </li>


        {/* NPA Classification */}

        <li
          className={
            isActive("/admin/npa-classification")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/admin/npa-classification")
          }
        >
          <FaExclamationTriangle />
          <span>NPA Classification</span>
        </li>


        {/* Audit Logs */}

        <li
          className={
            isActive("/admin/audit-logs")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/admin/audit-logs")
          }
        >
          <FaClipboardList />
          <span>Audit Logs</span>
        </li>


        {/* Reports */}

        <li
          className={
            isActive("/admin/reports")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/admin/reports")
          }
        >
          <FaChartBar />
          <span>Reports</span>
        </li>


        {/* Profile */}

        <li
          className={
            isActive("/admin/profile")
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("/admin/profile")
          }
        >
          <FaUserCircle />
          <span>Profile</span>
        </li>

      </ul>


      {/* ==========================================
          Logout
      ========================================== */}

      <button
        className="admin-logout"
        onClick={() => {
          // Logout functionality will be connected later
          console.log("Admin logout clicked");
        }}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

    </aside>
  );
}

export default AdminSidebar;