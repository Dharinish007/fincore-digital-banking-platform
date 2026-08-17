import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "./ManagerNavbar.css";

function ManagerNavbar() {
  return (
    <header className="manager-navbar">

      <div className="manager-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>

      <div className="manager-navbar-right">

        <FaBell className="manager-nav-icon" />

        <div className="manager-profile">

          <FaUserCircle />

          <span>Manager</span>

        </div>

      </div>

    </header>
  );
}

export default ManagerNavbar;