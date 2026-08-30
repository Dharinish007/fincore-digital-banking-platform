import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "./AdminNavbar.css";

function AdminNavbar() {
  return (
    <header className="admin-navbar">

      {/* Search */}
      <div className="admin-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search customers, employees..."
        />

      </div>

      {/* Right Section */}
      <div className="admin-navbar-right">

        {/* Notification */}
        <div className="admin-notification">
          <FaBell className="admin-nav-icon" />

          <span className="admin-notification-dot"></span>
        </div>

        {/* Profile */}
        <div className="admin-profile">

          <FaUserCircle />

          <div className="admin-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;