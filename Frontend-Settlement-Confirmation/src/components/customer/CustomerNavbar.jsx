import {
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "./CustomerNavbar.css";

function CustomerNavbar() {
  return (
    <header className="customer-navbar">

      {/* Search */}
      <div className="customer-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
        />

      </div>

      {/* Right Section */}
      <div className="customer-navbar-right">

        <FaBell className="customer-nav-icon" />

        <div className="customer-profile">

          <FaUserCircle />

          <span>Vaishnavi</span>

        </div>

      </div>

    </header>
  );
}

export default CustomerNavbar;